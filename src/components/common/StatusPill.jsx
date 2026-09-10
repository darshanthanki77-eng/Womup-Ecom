import React from "react";

export default function StatusPill({ status }) {
  if (!status) return null;

  const s = String(status).toLowerCase();

  let bg = "rgba(255, 255, 255, 0.05)";
  let color = "#A0A0A0";
  let border = "rgba(255, 255, 255, 0.15)";
  let dotColor = null;
  let isPending = false;
  let isSuccess = false;

  if (s === "active" || s === "confirmed" || s === "paid" || s === "completed" || s === "resolved" || s === "success") {
    bg = "rgba(34, 197, 94, 0.12)";
    color = "#22C55E";
    border = "rgba(34, 197, 94, 0.35)";
    dotColor = "#22C55E";
    isSuccess = true;
  } else if (s === "pending" || s === "in progress" || s === "processing" || s === "accrued") {
    bg = "rgba(245, 158, 11, 0.12)";
    color = "var(--gold-bright)";
    border = "rgba(212, 175, 55, 0.4)";
    dotColor = "#F59E0B";
    isPending = true;
  } else if (s === "rejected" || s === "flagged" || s === "failed" || s === "suspended" || s === "closed") {
    bg = "rgba(239, 68, 68, 0.12)";
    color = "#EF4444";
    border = "rgba(239, 68, 68, 0.35)";
    dotColor = "#EF4444";
  } else if (s === "open" || s === "info") {
    bg = "rgba(59, 130, 246, 0.12)";
    color = "#60A5FA";
    border = "rgba(59, 130, 246, 0.35)";
    dotColor = "#3B82F6";
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "11.5px",
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        background: bg,
        color: color,
        border: `1px solid ${border}`,
        whiteSpace: "nowrap",
        boxShadow: isSuccess ? "0 0 10px rgba(34, 197, 94, 0.15)" : isPending ? "0 0 10px rgba(212, 175, 55, 0.15)" : "none"
      }}
    >
      {isPending ? (
        <span
          style={{
            width: "8px",
            height: "8px",
            border: "1.5px solid var(--gold-bright)",
            borderTopColor: "transparent",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 1s linear infinite"
          }}
        />
      ) : isSuccess ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      ) : dotColor ? (
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: dotColor,
            boxShadow: `0 0 6px ${dotColor}`
          }}
        />
      ) : null}
      {status}
    </span>
  );
}
