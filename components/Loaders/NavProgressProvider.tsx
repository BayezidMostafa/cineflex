"use client";

import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import TopProgress from "./TopProgress";

export default function NavProgressProvider(props: PropsWithChildren) {
  return (
    <Suspense fallback={null}>
      <NavProgressProviderInner {...props} />
    </Suspense>
  );
}

function NavProgressProviderInner({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [active, setActive] = useState(false);
  const lastUrlRef = useRef<string>("");
  const watchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const urlKey = useMemo(
    () => `${pathname || ""}?${searchParams?.toString() || ""}`,
    [pathname, searchParams]
  );

  // Stop when the new URL has rendered
  useEffect(() => {
    if (lastUrlRef.current && lastUrlRef.current !== urlKey) {
      setActive(false);
      if (watchdogRef.current) {
        clearTimeout(watchdogRef.current);
        watchdogRef.current = null;
      }
    }
    lastUrlRef.current = urlKey;
  }, [urlKey]);

  const isInternal = (href: string) => {
    try {
      const u = new URL(href, window.location.href);
      return u.origin === window.location.origin;
    } catch {
      return false;
    }
  };

  // Start on internal <a> clicks
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if ((e as MouseEvent).button && (e as MouseEvent).button !== 0) return;

      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      if (!href || href.startsWith("#")) return;
      if (!isInternal(href)) return;

      const target = new URL(href, window.location.href);
      const current = new URL(window.location.href);
      if (target.pathname === current.pathname && target.search === current.search) return;

      // start only if not already running
      setActive((v) => (v ? v : true));

      // shorter watchdog, so it never lingers
      if (watchdogRef.current) clearTimeout(watchdogRef.current);
      watchdogRef.current = setTimeout(() => setActive(false), 600);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Start on browser back/forward; short watchdog too
  useEffect(() => {
    const onPopState = () => {
      setActive((v) => (v ? v : true));
      if (watchdogRef.current) clearTimeout(watchdogRef.current);
      watchdogRef.current = setTimeout(() => setActive(false), 600);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Cleanup watchdog on unmount
  useEffect(() => {
    return () => {
      if (watchdogRef.current) clearTimeout(watchdogRef.current);
    };
  }, []);

  return (
    <>
      {/* finishMs makes the close feel instant */}
      <TopProgress active={active} finishMs={80} />
      {children}
    </>
  );
}
