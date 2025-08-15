"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export default function TopProgress({
  active,
  height = 3,
  zIndex = 9999,
  finishMs = 80, // how fast to hide after deactivate
}: {
  active: boolean;
  height?: number;
  zIndex?: number;
  finishMs?: number;
}) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0); // 0 → 100

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const runIdRef = useRef(0);

  const clearIntervalSafe = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  const clearFinishTimeout = () => {
    if (finishTimeoutRef.current) {
      clearTimeout(finishTimeoutRef.current);
      finishTimeoutRef.current = null;
    }
  };
  const cancelRaf = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };
  const hardReset = () => {
    clearIntervalSafe();
    clearFinishTimeout();
    cancelRaf();
    setProgress(0);
    setVisible(false);
  };

  useEffect(() => {
    const thisRun = ++runIdRef.current;

    if (active) {
      // start fresh
      clearIntervalSafe();
      clearFinishTimeout();
      cancelRaf();

      setVisible(true);
      setProgress(0);

      // nudge next frame so CSS sees a transition
      rafRef.current = requestAnimationFrame(() => {
        if (runIdRef.current !== thisRun) return;
        setProgress(10);
      });

      // ramp toward 90%
      intervalRef.current = setInterval(() => {
        if (runIdRef.current !== thisRun) return;
        setProgress((p) => {
          const cap = 90;
          if (p >= cap) return p;
          const delta = Math.max(1, (cap - p) * 0.08); // slightly faster ramp
          return Math.min(p + delta, cap);
        });
      }, 100);

      return () => {
        if (runIdRef.current === thisRun) {
          clearIntervalSafe();
          cancelRaf();
        }
      };
    } else {
      // finish quickly and hide
      clearIntervalSafe();
      cancelRaf();

      setProgress(100); // jump to end
      clearFinishTimeout();
      finishTimeoutRef.current = setTimeout(() => {
        if (runIdRef.current === thisRun) {
          setVisible(false);
          setProgress(0);
        }
      }, finishMs);

      return () => clearFinishTimeout();
    }
  }, [active, finishMs]);

  // cleanup on unmount
  useEffect(() => () => hardReset(), []);

  return (
    <div
      aria-hidden
      className={clsx(
        "fixed left-0 top-0 w-full transition-opacity duration-100",
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
            // make the sweep very fast so reset feels instant
            transition: "width 80ms ease",
          }}
        />
      </div>
    </div>
  );
}
