import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export default function ScrollableTabs({
  tabs = [],
  activeTab,
  onTabChange,
  style = {}
}) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [draggedDistance, setDraggedDistance] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);

  const checkScrollability = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    
    setHasOverflow(maxScroll > 6);
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < maxScroll - 6);
    
    if (maxScroll > 0) {
      setScrollProgress(Math.min(1, Math.max(0, scrollLeft / maxScroll)));
    } else {
      setScrollProgress(0);
    }
  };

  useEffect(() => {
    checkScrollability();
    const handleResize = () => checkScrollability();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [tabs, activeTab]);

  // When activeTab changes, auto scroll it into view
  useEffect(() => {
    if (!scrollRef.current) return;
    const activeBtn = scrollRef.current.querySelector('[data-active="true"]');
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
    checkScrollability();
  }, [activeTab]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const distance = 160;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth"
    });
    setTimeout(checkScrollability, 250);
  };

  // Mouse Drag to Scroll
  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollStart(scrollRef.current.scrollLeft);
    setDraggedDistance(0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const delta = e.pageX - startX;
    setDraggedDistance(Math.abs(delta));
    scrollRef.current.scrollLeft = scrollStart - delta;
    checkScrollability();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        maxWidth: "100%",
        width: "fit-content",
        ...style
      }}
    >
      {/* Left Scroll Chevron */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          title="Scroll Left"
          style={{
            position: "absolute",
            left: "-12px",
            zIndex: 12,
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "#121212",
            border: "1.5px solid var(--gold-primary)",
            color: "var(--gold-bright)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 0 14px rgba(0,0,0,0.8), 0 0 10px rgba(212,175,55,0.45)",
            transition: "all 0.2s ease"
          }}
        >
          <ChevronLeft size={16} strokeWidth={2.8} />
        </button>
      )}

      {/* Main Scrollable Capsule Container */}
      <div
        ref={scrollRef}
        onScroll={checkScrollability}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={(e) => {
          if (e.deltaY !== 0 && scrollRef.current) {
            scrollRef.current.scrollLeft += e.deltaY;
            checkScrollability();
          }
        }}
        className="segmented-scroll-wrapper"
        style={{
          display: "inline-flex",
          alignItems: "center",
          background: "rgba(22, 22, 22, 0.85)",
          backdropFilter: "blur(12px)",
          padding: "5px",
          borderRadius: "14px",
          border: "1px solid rgba(212, 175, 55, 0.28)",
          boxShadow: "0 4px 18px rgba(0, 0, 0, 0.45), inset 0 0 10px rgba(212, 175, 55, 0.04)",
          gap: "4px",
          maxWidth: "100%",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
          cursor: isDragging ? "grabbing" : "default",
          userSelect: "none",
          position: "relative",
          whiteSpace: "nowrap"
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              data-active={isActive ? "true" : "false"}
              onClick={() => {
                // If user was dragging, don't trigger click
                if (draggedDistance > 5) return;
                onTabChange(tab);
              }}
              className="btn btn-sm"
              style={{
                background: isActive ? "var(--gold-gradient)" : "transparent",
                color: isActive ? "#050505" : "var(--text-secondary)",
                fontWeight: isActive ? 800 : 500,
                boxShadow: isActive ? "0 0 16px rgba(212, 175, 55, 0.45)" : "none",
                border: "none",
                borderRadius: "9px",
                padding: "7px 18px",
                fontSize: "12.5px",
                letterSpacing: "0.2px",
                flexShrink: 0,
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Right Scroll Chevron */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          title="Scroll Right"
          style={{
            position: "absolute",
            right: "-12px",
            zIndex: 12,
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "#121212",
            border: "1.5px solid var(--gold-primary)",
            color: "var(--gold-bright)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 0 14px rgba(0,0,0,0.8), 0 0 10px rgba(212,175,55,0.45)",
            transition: "all 0.2s ease"
          }}
        >
          <ChevronRight size={16} strokeWidth={2.8} />
        </button>
      )}

      {/* Subtle indicator bar when horizontally scrollable on mobile/narrow screens */}
      {hasOverflow && (
        <div
          style={{
            position: "absolute",
            bottom: "-6px",
            left: "12px",
            right: "12px",
            height: "2px",
            background: "rgba(212, 175, 55, 0.15)",
            borderRadius: "2px",
            pointerEvents: "none",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              height: "100%",
              width: "35%",
              background: "var(--gold-gradient)",
              borderRadius: "2px",
              boxShadow: "0 0 8px var(--gold-primary)",
              transform: `translateX(${scrollProgress * 185}%)`,
              transition: "transform 0.1s ease-out"
            }}
          />
        </div>
      )}
    </div>
  );
}
