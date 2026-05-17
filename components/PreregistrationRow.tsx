"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { updateStatus, deletePreregistration } from "@/lib/actions/preregistrations";
import type { Preregistration } from "@/types";
import ConfirmModal from "./ConfirmModal";

const STATUS_OPTIONS = [
  { value: "pending", label: "Nouveau", color: "var(--red)" },
  { value: "contacted", label: "Contacté", color: "#A88A2C" },
  { value: "accepted", label: "Accepté", color: "#2D7D46" },
  { value: "rejected", label: "Refusé", color: "var(--stone)" },
];

const PLAN_LABELS: Record<string, string> = {
  baby: "Baby Judo",
  benjamin: "Benjamin",
  senior: "Senior",
};

export default function PreregistrationRow({ row }: { row: Preregistration }) {
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const submittedAt = new Date(row.submitted_at);
  const birth = new Date(row.birth_date);
  const age = Math.floor((Date.now() - birth.getTime()) / (365.25 * 86400000));
  const currentStatus = STATUS_OPTIONS.find((s) => s.value === row.status);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(() => { updateStatus(row.id, newStatus); });
  };

  const handleDelete = () => {
    setConfirmOpen(false);
    startTransition(() => { deletePreregistration(row.id); });
  };

  return (
    <tr style={{ borderBottom: "1px solid var(--hair-color)", opacity: isPending ? 0.5 : 1, transition: "opacity 0.2s" }}>
      <td style={{ padding: "14px 12px", color: "var(--stone)", whiteSpace: "nowrap", fontSize: 13 }}>
        {submittedAt.toLocaleDateString("fr-FR")}
        <br />
        <span style={{ fontSize: 11, color: "var(--stone-soft)" }}>
          {submittedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </td>
      <td style={{ padding: "14px 12px", fontWeight: 500 }}>{row.full_name}</td>
      <td style={{ padding: "14px 12px", color: "var(--stone)", fontSize: 13 }}>
        <a href={`mailto:${row.email}`}>{row.email}</a>
        {row.phone && (
          <>
            <br />
            <a href={`tel:${row.phone}`} style={{ fontSize: 11, color: "var(--stone-soft)" }}>{row.phone}</a>
          </>
        )}
      </td>
      <td style={{ padding: "14px 12px", color: "var(--stone)", fontSize: 13, whiteSpace: "nowrap" }}>
        {birth.toLocaleDateString("fr-FR")}
        <br />
        <span style={{ fontSize: 11, color: "var(--stone-soft)" }}>{age} ans</span>
      </td>
      <td style={{ padding: "14px 12px", fontSize: 13 }}>{PLAN_LABELS[row.plan] ?? row.plan}</td>
      <td style={{ padding: "14px 12px" }}>
        <select
          value={row.status}
          onChange={handleStatusChange}
          disabled={isPending}
          className="form-select"
          style={{ padding: "6px 10px", fontSize: 12, color: currentStatus?.color, fontWeight: 500, minWidth: 130 }}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </td>
      <td style={{ padding: "14px 12px", textAlign: "right", whiteSpace: "nowrap" }}>
        <Link
          href={`/admin/preregistrations/${row.id}`}
          style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--sumi)", marginRight: 16 }}
        >
          Modifier
        </Link>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={isPending}
          style={{
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--red)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Supprimer
        </button>
        <ConfirmModal
          open={confirmOpen}
          title="Supprimer cette pré-inscription ?"
          itemName={`${row.full_name} — ${row.email}`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      </td>
    </tr>
  );
}
