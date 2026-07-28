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
    update: { passwordHash: adminHash, role: Role.SUPERADMIN },
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
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: { passwordHash: customerHash, role: Role.CUSTOMER },
    create: {
      email: 'customer@example.com',
      passwordHash: customerHash,
      name: 'Jane Doe',
      role: Role.CUSTOMER,
      isVerified: true,
    },
  });
  console.log(`[seed] Customer: ${customer.email}`);

  // ── Sample products ────────────────────────────────────────────────────────
  // Deactivate old placeholder products so they don't appear in the store
  await prisma.product.updateMany({
    where: { slug: { in: ['smb-crm-suite', 'analytics-pro', 'teamflow-project-manager', 'autobill-invoicing', 'hr-sync'] } },
    data: { isActive: false },
  });

  // Note: price uses Decimal — never Float — to match DECIMAL(12,2) in DB
  const products = [
    {
      name: 'QuickStart CE',
      slug: 'quickstart-ce',
      price: new Decimal('349.00'),
      stock: 999,
      isActive: true,
      description:
        'More revenue through smart CRM – the fastest path to a digital sales organisation. ' +
        'ITVT QuickStart CE is built on Microsoft Dynamics 365 Sales (Customer Engagement) and is pre-configured specifically for small and medium-sized businesses (10–250 employees) in trade, services, and crafts. ' +
        'You get a ready-to-use CRM system for lead management, structured quoting processes, and sustainable customer care – as a monthly subscription with no hidden costs. ' +
        'Thanks to the pre-defined feature set, you are productive within a few days, starting from just one user. ' +
        'Your advantage: minimal implementation effort, maximum efficiency – start your digitalisation and AI transformation faster than ever before.',
      features: [
        'Microsoft Dynamics 365 Sales (CE) – pre-configured & ready to deploy',
        'Lead Management: Capture, qualification & automated assignment',
        'Opportunity pipeline with win probability & forecasting',
        'Quote & order creation directly in the CRM',
        '360° customer view: contacts, activities, communication history',
        'Automated follow-up tasks & email templates',
        'Seamless integration with Microsoft Outlook & Teams',
        'Power BI dashboards for sales performance & pipeline analysis',
        'Microsoft Copilot AI: conversation summaries & next-best-action',
        'Mobile access via iOS & Android app',
        'Monthly subscription – cancel anytime, no lock-in',
        'Go-live in a few days – scalable from 1 user',
      ],
      images: ['https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80'],
    },
    {
      name: 'QuickStart BC',
      slug: 'quickstart-bc',
      price: new Decimal('249.00'),
      stock: 999,
      isActive: true,
      description:
        'Streamlined processes from purchasing to logistics – your all-in-one ERP for the mid-market. ' +
        'ITVT QuickStart BC is built on Microsoft Dynamics 365 Business Central and digitalises your core business processes in purchasing, sales, inventory management, and financial accounting as a monthly subscription. ' +
        'The solution is pre-configured specifically for companies with 10–250 employees in trade, services, manufacturing, and crafts. ' +
        'Flexibly expandable with optional modules such as production, service management, or project management – exactly matching your growth. ' +
        'Your advantage: minimal implementation effort, maximum efficiency – start your digitalisation and AI transformation faster than ever before.',
      features: [
        'Microsoft Dynamics 365 Business Central – pre-configured for SMBs',
        'Financial accounting: General ledger, accounts receivable, payable & bank reconciliation',
        'Purchasing: Purchase requests, supplier orders & goods receipt',
        'Sales: Quotes, orders, delivery notes & invoicing',
        'Inventory management: Items, locations, stocktaking & batch/serial numbers',
        'Real-time financial reporting & customizable Power BI dashboards',
        'Integration with Microsoft 365: Outlook, Excel & Teams',
        'Microsoft Copilot AI: Automatic posting suggestions & anomaly detection',
        'Optional module: Production & manufacturing orders',
        'Optional module: Service management & maintenance contracts',
        'Optional module: Project management & time tracking',
        'Monthly subscription – cancel anytime, no lock-in',
      ],
      images: ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80'],
    },
    {
      name: 'QuickStart FSCM',
      slug: 'quickstart-fscm',
      price: new Decimal('449.00'),
      stock: 999,
      isActive: true,
      description:
        'Enterprise ERP for complex finance and supply chain processes in the growing mid-market. ' +
        'ITVT QuickStart FSCM is built on Microsoft Dynamics 365 Finance & Supply Chain Management (F&SCM) – Microsoft’s most powerful ERP platform for companies that have outgrown the capabilities of Business Central. ' +
        'The solution addresses companies with approximately 50+ employees with complex requirements in financial accounting, procurement, warehousing, and production. ' +
        'Multiple company codes, foreign currency handling, advanced production planning, and AI-powered demand forecasting are included as standard. ' +
        'Your advantage: minimal implementation effort, maximum efficiency – start your digitalisation and AI transformation faster than ever before.',
      features: [
        'Microsoft Dynamics 365 Finance & Supply Chain Management',
        'General ledger, cost accounting, budgeting & consolidation',
        'Accounts payable: Automatic invoice matching & payment runs',
        'Accounts receivable: Dunning, receivables management & collections',
        'Procurement & sourcing: Framework agreements, supplier evaluation & catalogs',
        'Advanced Warehouse Management (WMS): Location & wave management',
        'Transport management: Freight planning, carrier booking & tracking',
        'Production planning: MPS, MRP & manufacturing order control',
        'Multi-company code & multi-currency support (IFRS/HGB)',
        'AI-powered demand forecasting & automatic reorder suggestions',
        'Advanced Power BI analytics & real-time controlling',
        'Monthly subscription – cancel anytime, no lock-in',
      ],
      images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80'],
    },
    {
      name: 'QuickStart SW365',
      slug: 'quickstart-sw365',
      price: new Decimal('299.00'),
      stock: 999,
      isActive: true,
      description:
        'Customer service at the next level – the specialised digital solution for municipal utilities and energy suppliers. ' +
        'ITVT QuickStart SW365 combines Microsoft Dynamics 365 Customer Service with the industry-specific Stadtwerk 365 solution from ITVT Group – developed from over 20 years of experience in the energy sector. ' +
        'You receive structured customer processes, intelligent case management, transparent dashboards, and compliance with all regulatory requirements – as a monthly subscription at a predictable rate. ' +
        'For utilities, municipal energy suppliers, and public service providers looking to professionalise and digitalise their customer service. ' +
        'Your advantage: minimal implementation effort, maximum efficiency – start your digitalisation and AI transformation faster than ever before.',
      features: [
        'Stadtwerk 365 – Industry solution built on Microsoft Dynamics 365',
        'Intelligent case management: Capture, categorization & prioritization',
        'Customer contact center: Omnichannel (Phone, Email, Web, Portal)',
        'Self-service customer portal: Submit meter readings, manage contracts',
        'Meter reading capture & plausibility check',
        'Billing integration: Transfer to SAP IS-U, Wilken & others',
        'Contract management: Tariff changes, relocations & cancellations',
        'Transparent KPI dashboards: Service level, case volume & processing time',
        'Compliance: Processes in accordance with GasNZV, StromNZV & GDPR',
        'Microsoft Copilot AI: Automatic case responses & knowledge articles',
        'Seamless integration with Microsoft 365: Outlook & Teams',
        'Monthly subscription – cancel anytime, no lock-in',
      ],
      images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80'],
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { name: p.name, price: p.price, description: p.description, features: p.features, images: p.images, stock: p.stock, isActive: p.isActive },
      create: p,
    });
    console.log(`[seed] Product: ${p.name} (€${p.price})`);
  }

  console.log('[seed] Done.');
}

main()
  .catch((err) => { console.error('[seed] Error:', err); process.exit(1); })
  .finally(() => prisma.$disconnect());
