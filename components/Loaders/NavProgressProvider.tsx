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

  const urlKey = useMemo(
    () => `${pathname || ""}?${searchParams?.toString() || ""}`,
    [pathname, searchParams]
  );

  useEffect(() => {
    if (lastUrlRef.current && lastUrlRef.current !== urlKey) setActive(false);
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

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.button && e.button !== 0) return;

      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (!href || href.startsWith("#")) return;
      if (!isInternal(href)) return;

      const target = new URL(href, window.location.href);
      const current = new URL(window.location.href);
      if (target.pathname === current.pathname && target.search === current.search) return;

      setActive(true);
    };

    document.addEventListener("click", onClick, true);
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
