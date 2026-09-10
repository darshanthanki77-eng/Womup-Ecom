import React from "react";

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendPositive = true,
  showSparkline = false,
  onClick,
  style = {}
}) {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  // Sparkline coordinates based on trend
  const sparklinePoints = trendPositive
    ? "0,28 12,24 24,26 36,18 48,20 60,10 72,14 84,6 96,2"
    : "0,6 12,10 24,8 36,16 48,14 60,22 72,20 84,26 96,30";
  const sparklineColor = trendPositive ? "#22C55E" : "var(--gold-bright)";

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className="regal-card card-spotlight metric-card-mobile"
      style={{
        padding: "22px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease",
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", position: "relative", zIndex: 2 }}>
        <span className="metric-card-title" style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
          {title}
        </span>
        {icon && (
          <div
            className="metric-card-icon"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "rgba(212, 175, 55, 0.1)",
              border: "1px solid rgba(212, 175, 55, 0.28)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 0 12px rgba(212, 175, 55, 0.15)"
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 2 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            className="metric-card-value"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "26px",
              fontWeight: 800,
              color: "#F5F5F5",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {value}
          </div>

          {(subtitle || trend) && (
            <div className="metric-card-subtitle" style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", fontSize: "12px" }}>
              {trend && (
                <span
                  style={{
                    fontWeight: 700,
                    color: trendPositive ? "#22C55E" : "#EF4444",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "3px"
                  }}
                >
                  {trend}
                </span>
              )}
              {subtitle && <span style={{ color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subtitle}</span>}
            </div>
          )}
        </div>

        {/* Optional Decorative SVG Sparkline - Only on necessary financial trend metrics */}
        {showSparkline && (
          <div className="metric-card-sparkline" style={{ opacity: 0.75, transform: "translateY(2px)", flexShrink: 0 }}>
            <svg width="78" height="28" viewBox="0 0 96 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id={`sparkGrad-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={sparklineColor} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={sparklineColor} stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon
                points={`0,32 ${sparklinePoints} 96,32`}
                fill={`url(#sparkGrad-${title.replace(/\s+/g, '')})`}
              />
              <polyline
                fill="none"
                stroke={sparklineColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={sparklinePoints}
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
