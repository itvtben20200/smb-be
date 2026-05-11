import { PrismaClient, Role} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[seed] Starting...');

  // ── Superadmin ─────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('Admin@1234', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@smbstore.com' },
    update: {},
    create: {
      email: 'admin@smbstore.com',
      passwordHash: adminHash,
      name: 'Store Admin',
      role: Role.SUPERADMIN,
      isVerified: true,
    },
  });
  console.log(`[seed] Admin: ${admin.email}`);

  // ── Sample customer ────────────────────────────────────────────────────────
  const customerHash = await bcrypt.hash('Customer@1234', 12);
  await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      passwordHash: customerHash,
      name: 'Jane Doe',
      role: Role.CUSTOMER,
      isVerified: true,
    },
  });

  // ── Sample products ────────────────────────────────────────────────────────
  // Uses upsert on existing slugs so FK constraints on order_items are not violated

  // Note: price uses Decimal — never Float — to match DECIMAL(12,2) in DB
  const products = [
    {
      name: 'Sales Hub Pro',
      slug: 'smb-crm-suite',
      price: new Decimal('349.00'),
      stock: 999,
      isActive: true,
      description: 'Enterprise-grade sales management platform built for modern teams. Manage your full pipeline from lead capture to close — with deal scoring, quota tracking, forecasting, and one-click CRM sync. Replaces spreadsheets with a unified sales command centre.',
      images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80'],
    },
    {
      name: 'AI Sales Assistant',
      slug: 'analytics-pro',
      price: new Decimal('249.00'),
      stock: 999,
      isActive: true,
      description: 'AI-powered sales co-pilot that writes follow-up emails, scores leads, summarises calls, and surfaces next-best-action recommendations in real time. Integrates with Outlook, Teams, Salesforce, and HubSpot out of the box.',
      images: ['https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80'],
    },
    {
      name: 'Revenue Intelligence Suite',
      slug: 'teamflow-project-manager',
      price: new Decimal('449.00'),
      stock: 999,
      isActive: true,
      description: 'End-to-end revenue operations platform with real-time pipeline analytics, win/loss analysis, rep performance coaching, and multi-touch attribution. Turn your sales data into predictable revenue growth.',
      images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80'],
    },
    {
      name: 'Field Sales Manager',
      slug: 'autobill-invoicing',
      price: new Decimal('199.00'),
      stock: 999,
      isActive: true,
      description: 'Mobile-first solution for field sales reps and territory managers. GPS-based route optimisation, visit check-ins, offline mode, expense capture, and daily activity reports sent straight to your sales director.',
      images: ['https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=600&q=80'],
    },
    {
      name: 'SalesOps Automation Platform',
      slug: 'hr-sync',
      price: new Decimal('299.00'),
      stock: 999,
      isActive: true,
      description: 'Automate your entire sales ops workflow — lead routing, contract generation, e-signature, onboarding sequences, and renewal reminders. Cut manual admin by up to 70% so your team can focus on selling, not paperwork.',
      images: ['https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80'],
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { name: p.name, price: p.price, description: p.description, images: p.images, stock: p.stock, isActive: p.isActive },
      create: p,
    });
    console.log(`[seed] Product: ${p.name} (€${p.price})`);
  }

  console.log('[seed] Done.');
}

main()
  .catch((err) => { console.error('[seed] Error:', err); process.exit(1); })
  .finally(() => prisma.$disconnect());
