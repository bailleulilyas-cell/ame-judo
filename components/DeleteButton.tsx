"use client";

import { useRef, useState } from "react";
import ConfirmModal from "./ConfirmModal";

interface Props {
  message?: string;
  itemName?: string;
  label?: string;
}

export default function DeleteButton({
  message = "Confirmer la suppression ?",
  itemName,
  label = "Supprimer",
}: Props) {
  const [open, setOpen] = useState(false);
  const submitRef = useRef<HTMLButtonElement>(null);

  const handleConfirm = () => {
    setOpen(false);
    submitRef.current?.click();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          background: "transparent",
          color: "var(--red)",
          padding: "6px 10px",
          border: "1px solid var(--red)",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        {label}
      </button>

      <button
        ref={submitRef}
        type="submit"
        aria-hidden
        tabIndex={-1}
        style={{ position: "absolute", left: -9999, width: 0, height: 0, opacity: 0 }}
      />

      <ConfirmModal
        open={open}
        title={message}
        itemName={itemName}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
