import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { query } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import type { Preregistration } from "@/types";

const DB_READY = Boolean(process.env.DB_HOST && process.env.DB_NAME);

const STATUS_LABELS: Record<string, string> = {
  pending: "Nouveau",
  contacted: "Contacté",
  accepted: "Accepté",
  rejected: "Refusé",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "FFC8332A",
  contacted: "FFA88A2C",
  accepted: "FF2D7D46",
  rejected: "FF6B6B6B",
};

const RELATION_LABELS: Record<string, string> = {
  mere: "Mère",
  pere: "Père",
  tuteur: "Tuteur / tutrice légal·e",
  autre: "Autre",
};

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 });
  }
  if (!DB_READY) {
    return NextResponse.json({ message: "Base non configurée." }, { status: 503 });
  }

  const rows = await query<Preregistration>(
    "SELECT * FROM preregistrations ORDER BY submitted_at DESC"
  );

  // Libellés de formule (dynamiques) : plan_key -> nom
  const formuleRows = await query<{ plan_key: string; nom: string }>(
    "SELECT plan_key, nom FROM formules"
  );
  const PLAN_LABELS: Record<string, string> = {};
  for (const f of formuleRows) PLAN_LABELS[f.plan_key] = f.nom;

  const wb = new ExcelJS.Workbook();
  wb.creator = "AME-JUDO — Arts Martiaux Ermontois";
  wb.created = new Date();

  const ws = wb.addWorksheet("Pré-inscriptions", {
    views: [{ state: "frozen", ySplit: 1 }],
    properties: { defaultRowHeight: 22 },
  });

  ws.columns = [
    { header: "Reçue le",          key: "submitted",   width: 20 },
    { header: "Nom complet",       key: "name",        width: 28 },
    { header: "Email",             key: "email",       width: 32 },
    { header: "Téléphone",         key: "phone",       width: 18 },
    { header: "Date de naissance", key: "dob",         width: 16 },
    { header: "Âge",               key: "age",         width: 8  },
    { header: "Formule",           key: "plan",        width: 16 },
    { header: "Statut",            key: "status",      width: 14 },
    { header: "Responsable légal", key: "parentName",  width: 26 },
    { header: "Lien",              key: "parentRel",   width: 14 },
    { header: "Notes",             key: "notes",       width: 40 },
  ];

  // En-tête stylisé (bandeau sumi)
  const header = ws.getRow(1);
  header.height = 32;
  header.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
  header.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1A1A1A" } };
  header.eachCell((cell) => {
    cell.border = {
      bottom: { style: "medium", color: { argb: "FFC8332A" } },
    };
  });

  rows.forEach((r, idx) => {
    const submittedAt = new Date(r.submitted_at);
    const birth = new Date(r.birth_date);
    let age = new Date().getFullYear() - birth.getFullYear();
    const m = new Date().getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && new Date().getDate() < birth.getDate())) age--;

    const row = ws.addRow({
      submitted: submittedAt,
      name: r.full_name,
      email: r.email,
      phone: r.phone ?? "",
      dob: birth,
      age,
      plan: PLAN_LABELS[r.plan] ?? r.plan,
      status: STATUS_LABELS[r.status] ?? r.status,
      parentName: r.parent_name ?? "",
      parentRel: r.parent_relation ? (RELATION_LABELS[r.parent_relation] ?? r.parent_relation) : "",
      notes: r.notes ?? "",
    });

    row.height = 22;
    row.alignment = { vertical: "middle", horizontal: "left", indent: 1, wrapText: true };
    row.font = { name: "Calibri", size: 11, color: { argb: "FF1A1A1A" } };

    // Zébrage discret
    if (idx % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFBFAF6" } };
      });
    }

    // Bordures fines
    row.eachCell((cell) => {
      cell.border = {
        bottom: { style: "thin", color: { argb: "FFE8E2D5" } },
      };
    });

    // Formats spécifiques
    row.getCell("submitted").numFmt = "dd/mm/yyyy hh:mm";
    row.getCell("dob").numFmt = "dd/mm/yyyy";
    row.getCell("age").alignment = { vertical: "middle", horizontal: "center" };

    // Statut coloré
    const statusCell = row.getCell("status");
    statusCell.font = { name: "Calibri", size: 11, bold: true, color: { argb: STATUS_COLORS[r.status] ?? "FF1A1A1A" } };
  });

  // AutoFilter sur l'en-tête
  ws.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: ws.columns.length },
  };

  // Page setup pour impression
  ws.pageSetup = {
    paperSize: 9, // A4
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.5, header: 0.3, footer: 0.3 },
  };
  ws.headerFooter.oddHeader = "&L&\"Calibri,Bold\"AME-JUDO · Pré-inscriptions&R&D";
  ws.headerFooter.oddFooter = "&CPage &P / &N";

  const buffer = await wb.xlsx.writeBuffer();
  const date = new Date().toISOString().slice(0, 10);
  const filename = `preinscriptions-ame-${date}.xlsx`;

  return new NextResponse(buffer as ArrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
