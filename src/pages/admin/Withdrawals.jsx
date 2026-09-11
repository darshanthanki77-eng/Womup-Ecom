import { AlertCircle, CheckCircle2, Clock, ExternalLink, Wallet, XCircle } from "lucide-react";
import React, { useState } from "react";
import RegalTable from "../../components/common/RegalTable";
import ScrollableTabs from "../../components/common/ScrollableTabs";
import StatusPill from "../../components/common/StatusPill";
import { api } from "../../services/api";

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = () => {
    api.withdrawals.getAll().then((res) => {
      if (res.success && res.data) setWithdrawals(res.data);
      setLoading(false);
    });
  };

  React.useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleAction = async (id, newStatus, reason) => {
    let res;
    if (newStatus === "Approved" || newStatus === "APPROVED") {
      res = await api.withdrawals.approve(id);
    } else {
      res = await api.withdrawals.reject(id, reason || "Rejected by admin");
    }
    if (res.success) {
      setWithdrawals(withdrawals.map((w) =>
        (w.withdrawalId === id || w.id === id) ? { ...w, status: newStatus } : w
      ));
      setNotification(`Withdrawal ${id} marked as ${newStatus}.`);
    } else {
      setNotification(res.error || "Action failed.");
    }
    setTimeout(() => setNotification(""), 4000);
  };

  const filtered = activeTab === "All"
    ? withdrawals
    : withdrawals.filter((w) => w.status?.toLowerCase() === activeTab.toLowerCase());

  const columns = [
    {
      header: "Withdrawal ID",
      accessor: "withdrawalId",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--gold-bright)", fontWeight: 700 }}>{row.withdrawalId || row.id}</span>
    },
    {
      header: "User Account",
      accessor: "userName",
      render: (row) => <span style={{ color: "#FFF" }}>{row.userName || row.userEmail || "—"}</span>
    },
    {
      header: "Amount",
      accessor: "amount",
      render: (row) => <span style={{ fontWeight: 700, color: "#FFF" }}>${Number(row.amount || 0).toFixed(2)} USDT</span>
    },
    {
      header: "Protocol Fee",
      accessor: "fee",
      render: (row) => <span style={{ color: "var(--text-muted)" }}>${Number(row.fee || 0).toFixed(2)}</span>
    },
    {
      header: "Destination Wallet",
      accessor: "destination",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--gold-primary)" }}>{row.destination || row.destinationAddress || "—"}</span>
    },
    {
      header: "Requested Date",
      accessor: "requestedAt",
      render: (row) => <span>{row.requestedAt ? new Date(row.requestedAt).toLocaleDateString() : row.date || "—"}</span>
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusPill status={row.status} />
    },
    {
      header: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: "6px" }}>
          {(row.status === "Pending" || row.status === "PENDING") ? (
            <>
              <button
                onClick={() => handleAction(row.withdrawalId || row.id, "Approved")}
                style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22C55E", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(row.withdrawalId || row.id, "Rejected")}
                style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}
              >
                Reject
              </button>
            </>
          ) : (
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Processed</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: "12px", color: "#EF4444", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 800 }}>
          LIQUIDITY DISBURSEMENT
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
          Withdrawal <span className="gold-gradient-text">Queue Management</span>
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Review, approve, reject, or broadcast pending user withdrawal requests on the BNB Smart Chain settlement treasury.
        </p>
      </div>

      {notification && (
        <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid #22C55E", borderRadius: "10px", padding: "14px", color: "#22C55E", fontSize: "13.5px" }}>
          {notification}
        </div>
      )}

      {loading && (
        <div style={{ color: "var(--text-muted)", fontSize: "14px", padding: "10px 0" }}>Loading withdrawals...</div>
      )}

      {/* Tabs */}
      <ScrollableTabs
        tabs={["All", "Pending", "Approved", "Processing", "Completed", "Rejected"]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* Table */}
      <RegalTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Filter withdrawals by ID or wallet..."
      />
    </div>
  );
}
