"use client";

import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import TopProgress from "./TopProgress";

export default function NavProgressProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [active, setActive] = useState(false);
  const lastUrlRef = useRef<string>("");

  // Current URL key
  const urlKey = useMemo(
    () => `${pathname || ""}?${searchParams?.toString() || ""}`,
    [pathname, searchParams]
  );

  // Stop the loader when the URL has actually changed and rendered
  useEffect(() => {
    if (lastUrlRef.current && lastUrlRef.current !== urlKey) {
      // navigation finished
      setActive(false);
    }
    lastUrlRef.current = urlKey;
  }, [urlKey]);

  // Helper: is an anchor internal to this origin?
  const isInternal = (href: string) => {
    try {
      const u = new URL(href, window.location.href);
      return u.origin === window.location.origin;
    } catch {
      return false;
    }
  };

  // Start on internal <a> clicks rendered by next/link
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // ignore modified clicks / new tab / middle click
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.button && e.button !== 0) return;

      // find nearest anchor
      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (!href || href.startsWith("#")) return;

      if (!isInternal(href)) return;

      // If it's the same URL (no param change), skip
      const target = new URL(href, window.location.href);
      const current = new URL(window.location.href);
      if (
        target.pathname === current.pathname &&
        target.search === current.search
      )
        return;

      // Start loader; Next will handle the actual navigation
      setActive(true);
    };

    document.addEventListener("click", onClick, true); // capture phase to catch early
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    const onPopState = () => setActive(true);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <>
      <TopProgress active={active} />
      {children}
    </>
  );
}
