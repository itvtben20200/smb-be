import Stripe from 'stripe';
import { config } from '../config';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { CheckoutPayload } from '../types';
import { createMockSession } from '../lib/mockSessionStore';

// Detect whether a real Stripe key has been configured
const isStripeConfigured =
  config.stripe.secretKey &&
  config.stripe.secretKey !== 'sk_test_placeholder' &&
  config.stripe.secretKey.startsWith('sk_');

const stripe = isStripeConfigured ? new Stripe(config.stripe.secretKey) : null;

export class StripeService {
  async createCheckoutSession(
    payload: CheckoutPayload & { userId?: string }
  ): Promise<{ id: string; url: string }> {
    const { items, guestEmail, guestName, guestPhone, guestCompany, userId } = payload;

    // Validate products
    const productIds = [...new Set(items.map((i) => i.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });
    if (products.length !== productIds.length) {
      throw new AppError(400, 'One or more products are unavailable');
    }

    // Resolve packages for items that specify a packageId
    const packageIds = items.map((i) => i.packageId).filter(Boolean) as string[];
    const packages = packageIds.length
      ? await prisma.productPackage.findMany({
          where: { id: { in: packageIds }, isActive: true },
        })
      : [];

    if (packageIds.length && packages.length !== packageIds.length) {
      throw new AppError(400, 'One or more packages are unavailable');
    }

    // Build resolved line items — package price takes precedence over product price
    const resolvedItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const pkg = item.packageId ? packages.find((pk) => pk.id === item.packageId) : null;
      return {
        productId: item.productId,
        packageId: item.packageId,
        quantity: item.quantity,
        name: pkg ? `${product.name} – ${pkg.name}` : product.name,
        price: pkg ? Number(pkg.price) : Number(product.price),
        images: product.images,
      };
    });

    const total = resolvedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // ── MOCK MODE (no Stripe key configured) ──────────────────────────────────
    if (!stripe) {
      console.warn('[stripe] No real key configured — using mock checkout.');
      const sessionProducts = resolvedItems.map((item) => ({
        id: item.productId,
        packageId: item.packageId,
        name: item.name,
        price: String(item.price),
        quantity: item.quantity,
      }));
      const sessionId = createMockSession(payload, sessionProducts, total);
      return {
        id: sessionId,
        url: `${config.frontendUrl}/checkout/payment?sid=${sessionId}`,
      };
    }

    // ── REAL STRIPE MODE ────────────────────────────────────────────────────
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = resolvedItems.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: item.images.slice(0, 1),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const customerEmail = userId
      ? (await prisma.user.findUnique({ where: { id: userId }, select: { email: true } }))?.email
      : guestEmail;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: customerEmail || undefined,
      success_url: `${config.frontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.frontendUrl}/cart`,
      metadata: {
        userId: userId || '',
        guestEmail: guestEmail || '',
        guestName: guestName || '',
        guestPhone: guestPhone || '',
        guestCompany: guestCompany || '',
        items: JSON.stringify(items),
      },
    });

    return { id: session.id, url: session.url! };
  }
}

