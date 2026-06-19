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
        'Mehr Umsatz durch smartes CRM – der schnellste Weg in eine digitale Vertriebsorganisation. ' +
        'ITVT QuickStart CE basiert auf Microsoft Dynamics 365 Sales (Customer Engagement) und ist speziell für kleine und mittlere Unternehmen (10–250 Mitarbeitende) aus Handel, Dienstleistungen und Handwerk vorkonfiguriert. ' +
        'Sie erhalten ein sofort einsatzbereites CRM-System für Lead-Management, strukturierte Angebotsprozesse und nachhaltige Kundenpflege – zu einem planbaren Fixpreis und mit garantierter Implementierungsdauer. ' +
        'Dank vordefiniertem Funktionsumfang sind Sie in wenigen Tagen produktiv, ab nur einem User. ' +
        'Ihr Vorteil: Minimaler Implementierungsaufwand, maximale Effizienz – starten Sie Ihre Digitalisierung und KI-Transformation schneller als je zuvor.',
      features: [
        'Microsoft Dynamics 365 Sales (CE) – vorkonfiguriert & sofort einsatzbereit',
        'Lead-Management: Erfassung, Qualifizierung & automatisierte Zuweisung',
        'Opportunity-Pipeline mit Gewinnwahrscheinlichkeit & Forecasting',
        'Angebots- & Auftragserstellung direkt im CRM',
        '360°-Kundensicht: Kontakte, Aktivitäten, Kommunikationshistorie',
        'Automatisierte Follow-up-Aufgaben & E-Mail-Vorlagen',
        'Nahtlose Integration mit Microsoft Outlook & Teams',
        'Power BI-Dashboards für Vertriebsperformance & Pipeline-Analyse',
        'Microsoft Copilot AI: Gesprächszusammenfassungen & Next-Best-Action',
        'Mobiler Zugriff über iOS & Android App',
        'Fixpreis-Implementierung – keine versteckten Kosten',
        'Go-live in wenigen Tagen – skalierbar ab 1 User',
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
        'Effiziente Abläufe vom Einkauf bis zur Logistik – Ihr All-in-One ERP für den Mittelstand. ' +
        'ITVT QuickStart BC basiert auf Microsoft Dynamics 365 Business Central und digitalisiert Ihre Kerngeschäftsprozesse in Einkauf, Verkauf, Lagerhaltung und Finanzbuchhaltung zu einem planbaren Festpreis. ' +
        'Die Lösung ist speziell für Unternehmen mit 10–250 Mitarbeitenden aus Handel, Dienstleistungen, Fertigung und Handwerk vorkonfiguriert. ' +
        'Flexibel erweiterbar um optionale Module wie Produktion, Serviceverwaltung oder Projektmanagement – exakt passend zu Ihrem Wachstum. ' +
        'Ihr Vorteil: Minimaler Implementierungsaufwand, maximale Effizienz – starten Sie Ihre Digitalisierung und KI-Transformation schneller als je zuvor.',
      features: [
        'Microsoft Dynamics 365 Business Central – vorkonfiguriert für KMU',
        'Finanzbuchhaltung: Hauptbuch, Debitoren, Kreditoren & Bank-Abgleich',
        'Einkauf: Bestellanforderungen, Lieferantenbestellungen & Wareneingang',
        'Verkauf: Angebote, Aufträge, Lieferscheine & Rechnungsstellung',
        'Lagerverwaltung: Artikel, Lagerplätze, Inventur & Chargen-/Seriennummern',
        'Echtzeit-Finanzreporting & anpassbare Power BI-Dashboards',
        'Integration mit Microsoft 365: Outlook, Excel & Teams',
        'Microsoft Copilot AI: Automatische Buchungsvorschläge & Anomalie-Erkennung',
        'Optionales Modul: Produktion & Fertigungsaufträge',
        'Optionales Modul: Serviceverwaltung & Wartungsverträge',
        'Optionales Modul: Projektmanagement & Zeiterfassung',
        'Fixpreis-Implementierung – planbar, kostensicher & schnell',
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
        'Enterprise-ERP für komplexe Finanz- und Lieferkettenprozesse im wachsenden Mittelstand. ' +
        'ITVT QuickStart FSCM basiert auf Microsoft Dynamics 365 Finance & Supply Chain Management (F&SCM) – der leistungsstärksten ERP-Plattform von Microsoft für Unternehmen, die über die Möglichkeiten von Business Central hinauswachsen. ' +
        'Die Lösung adressiert Unternehmen ab ca. 50 Mitarbeitenden mit komplexen Anforderungen an Finanzbuchhaltung, Beschaffung, Lager und Produktion. ' +
        'Mehrere Buchungskreise, Fremdwährungsabwicklung, erweiterte Produktionsplanung und KI-gestützte Bedarfsprognosen sind standardmäßig enthalten. ' +
        'Ihr Vorteil: Minimaler Implementierungsaufwand, maximale Effizienz – starten Sie Ihre Digitalisierung und KI-Transformation schneller als je zuvor.',
      features: [
        'Microsoft Dynamics 365 Finance & Supply Chain Management',
        'Hauptbuch, Kostenrechnung, Budgetierung & Konsolidierung',
        'Kreditorenbuchhaltung: Automatischer Rechnungsabgleich & Zahlungsläufe',
        'Debitorenbuchhaltung: Mahnwesen, Forderungsmanagement & Inkasso',
        'Beschaffung & Sourcing: Rahmenverträge, Lieferantenbewertung & Kataloge',
        'Erweitertes Warehouse Management (WMS): Lagerplatz- & Wellensteuerung',
        'Transportmanagement: Frachtplanung, Spediteurbuchung & Tracking',
        'Produktionsplanung: MPS, MRP & Fertigungsauftragssteuerung',
        'Multi-Buchungskreis & Mehrwährungsunterstützung (IFRS/HGB)',
        'KI-gestützte Bedarfsprognosen & automatische Nachbestellvorschläge',
        'Erweiterte Power BI-Analysen & Echtzeit-Controlling',
        'Fixpreis-Implementierung mit garantierter Projektlaufzeit',
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
        'Kundenservice auf dem nächsten Level – die spezialisierte Digitallösung für Stadtwerke und Energieversorger. ' +
        'ITVT QuickStart SW365 kombiniert Microsoft Dynamics 365 Customer Service mit der branchenspezifischen Stadtwerk 365-Lösung von ITVT Group – entwickelt aus über 20 Jahren Erfahrung in der Energiewirtschaft. ' +
        'Sie erhalten strukturierte Kundenprozesse, intelligentes Fallmanagement, transparente Dashboards und die Einhaltung aller deutschen Regulierungsanforderungen – vorkonfiguriert, zu einem Festpreis und in kürzester Implementierungszeit. ' +
        'Für EVUs, Stadtwerke und kommunale Versorger, die ihren Kundenservice professionalisieren und digitalisieren möchten. ' +
        'Ihr Vorteil: Minimaler Implementierungsaufwand, maximale Effizienz – starten Sie Ihre Digitalisierung und KI-Transformation schneller als je zuvor.',
      features: [
        'Stadtwerk 365 – Branchenlösung auf Basis von Microsoft Dynamics 365',
        'Intelligentes Fallmanagement: Erfassung, Kategorisierung & Priorisierung',
        'Kundenkontakt-Center: Omnichannel (Telefon, E-Mail, Web, Portal)',
        'Self-Service-Kundenportal: Zählerstand melden, Verträge verwalten',
        'Zählerstand-Erfassung & Plausibilitätsprüfung',
        'Abrechnungsintegration: Übergabe an SAP IS-U, Wilken & Co.',
        'Vertragsmanagement: Tarifwechsel, Umzüge & Kündigungen',
        'Transparente KPI-Dashboards: Servicelevel, Fallvolumen & Bearbeitungszeit',
        'Compliance: Prozesse gemäß GasNZV, StromNZV & DSGVO',
        'Microsoft Copilot AI: Automatische Fallantworten & Wissensartikel',
        'Nahtlose Integration in Microsoft 365: Outlook & Teams',
        'Fixpreis-Implementierung – speziell für EVUs & kommunale Versorger',
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
