import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import React, { useState } from "react";

export default function RegalTable({
  columns,
  data,
  searchPlaceholder = "Search records...",
  searchKey = null,
  emptyMessage = "No records found.",
  rowsPerPage = 10,
  actionButton = null
}) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = (data || []).filter((item) => {
    if (!query) return true;
    const q = query.toLowerCase();
    if (searchKey) {
      return String(item[searchKey] || "").toLowerCase().includes(q);
    }
    return Object.values(item).some((val) =>
      String(val).toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const displayed = filtered.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="regal-card" style={{ padding: "20px 24px", background: "#0D0D0D" }}>
      {/* Table Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          marginBottom: "18px"
        }}
      >
        <div style={{ position: "relative", minWidth: "160px", flex: 1, maxWidth: "420px" }}>
          <Search
            size={16}
            color="var(--gold-primary)"
            style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="regal-input"
            style={{ paddingLeft: "40px", padding: "10px 14px 10px 40px", fontSize: "13px" }}
          />
        </div>

        {actionButton && <div style={{ flexShrink: 0 }}>{actionButton}</div>}
      </div>

      {/* Table Scrollable Container */}
      <div className="table-scroll-container" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", width: "100%" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-standard)" }}>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{
                    padding: "14px 16px",
                    color: "var(--text-muted)",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    whiteSpace: "nowrap"
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.length > 0 ? (
              displayed.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  style={{
                    borderBottom: "1px solid #181818",
                    transition: "background 0.15s ease"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(212, 175, 55, 0.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {columns.map((col, cIdx) => (
                    <td
                      key={cIdx}
                      style={{
                        padding: "15px 16px",
                        color: "var(--text-primary)",
                        verticalAlign: "middle"
                      }}
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: "40px 16px",
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: "13.5px"
                  }}
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "18px",
            paddingTop: "14px",
            borderTop: "1px solid #1A1A1A",
            fontSize: "12.5px",
            color: "var(--text-muted)"
          }}
        >
          <div>
            Showing {startIndex + 1}–{Math.min(startIndex + rowsPerPage, filtered.length)} of {filtered.length}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="btn btn-outline btn-sm"
              style={{ padding: "6px 12px", opacity: currentPage === 1 ? 0.4 : 1 }}
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn btn-outline btn-sm"
              style={{ padding: "6px 12px", opacity: currentPage === totalPages ? 0.4 : 1 }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
