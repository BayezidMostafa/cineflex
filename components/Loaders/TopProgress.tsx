"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export default function TopProgress({
  active,
  height = 3,
  zIndex = 9999,
}: {
  active: boolean;
  height?: number;
  zIndex?: number;
}) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0); // 0 → 100
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };

  useEffect(() => {
    if (active) {
      setVisible(true);
      setProgress((p) => (p < 10 ? 10 : p));

      clear();
      timer.current = setInterval(() => {
        setProgress((p) => {
          const cap = 90;
          if (p >= cap) return p;
          const delta = Math.max(0.5, (cap - p) * 0.05);
          return Math.min(p + delta, cap);
        });
      }, 100);
    } else {
      clear();
      setProgress(100);
      const t = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 150);
      return () => clearTimeout(t);
    }
    return clear;
  }, [active]);

  return (
    <div
      aria-hidden
      className={clsx(
        "fixed left-0 top-0 w-full transition-opacity duration-150",
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      style={{ zIndex }}
    >
      <div className="w-full bg-transparent relative" style={{ height }}>
        <div
          className="h-full text-black dark:text-white"
          style={{
            width: `${progress}%`,
            background: "currentColor",
            boxShadow: "0 0 8px currentColor",
            transition: "width 120ms ease",
          }}
        />
      </div>
    </div>
  );
}
