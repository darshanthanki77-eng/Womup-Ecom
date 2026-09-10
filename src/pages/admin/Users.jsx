import { AlertCircle, CheckCircle2, ExternalLink, Eye, Filter, ShieldAlert, UserCheck, UserX } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegalTable from "../../components/common/RegalTable";
import ScrollableTabs from "../../components/common/ScrollableTabs";
import StatusPill from "../../components/common/StatusPill";
import { initialAllUsers } from "../../data/portalData";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(initialAllUsers);
  const [statusFilter, setStatusFilter] = useState("All");

  const handleUpdateStatus = (id, newStatus) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: newStatus } : u)));
  };

  const filtered = statusFilter === "All"
    ? users
    : users.filter((u) => u.status.toLowerCase() === statusFilter.toLowerCase());

  const columns = [
    {
      header: "User ID",
      accessor: "id",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--gold-bright)", fontWeight: 700 }}>{row.id}</span>
    },
    {
      header: "Name & Email",
      accessor: "name",
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: "#FFF" }}>{row.name}</div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{row.email}</div>
        </div>
      )
    },
    {
      header: "Wallet",
      accessor: "wallet",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--gold-primary)", fontSize: "12px" }}>{row.wallet}</span>
    },
    {
      header: "Referral Code",
      accessor: "referralCode",
      render: (row) => <span style={{ fontFamily: "monospace", color: "#FFF" }}>{row.referralCode}</span>
    },
    {
      header: "Investments",
      accessor: "investments",
      render: (row) => <span style={{ fontWeight: 700, color: "#FFF" }}>${row.investments.toLocaleString()}</span>
    },
    {
      header: "Total ROI",
      accessor: "totalRoi",
      render: (row) => <span style={{ color: "var(--gold-bright)", fontWeight: 700 }}>${row.totalRoi.toFixed(2)}</span>
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusPill status={row.status} />
    },
    {
      header: "Joined",
      accessor: "joined",
      render: (row) => <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{row.joined}</span>
    },
    {
      header: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={() => navigate(`/admin/users/${row.id}`)}
            className="btn btn-outline-gold btn-sm"
            style={{ padding: "4px 8px", fontSize: "11px" }}
            title="Investigate Profile"
          >
            <Eye size={12} /> View
          </button>
          {row.status === "Active" ? (
            <button
              onClick={() => handleUpdateStatus(row.id, "Suspended")}
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}
              title="Suspend User"
            >
              Suspend
            </button>
          ) : (
            <button
              onClick={() => handleUpdateStatus(row.id, "Active")}
              style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22C55E", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}
              title="Activate User"
            >
              Activate
            </button>
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
          USER MANAGEMENT CONSOLE
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
          Registered <span className="gold-gradient-text">Users Directory</span>
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Search, audit, inspect KYC/status, and manage suspension controls across all 1,428 Web3 investor accounts.
        </p>
      </div>

      {/* Filter Tabs */}
      <ScrollableTabs
        tabs={["All", "Active", "Pending", "Flagged", "Suspended"]}
        activeTab={statusFilter}
        onTabChange={(s) => setStatusFilter(s)}
      />

      {/* User Table */}
      <RegalTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Search by user ID, wallet, name, referral code, or email..."
      />
    </div>
  );
}
