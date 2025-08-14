"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import clsx from "clsx";

type Dir = "prev" | "next" | null;

export default function PaginationControls({
  page,
  totalPages,
  apiFilters,
}: {
  page: number;
  totalPages: number;
  apiFilters: Record<string, string>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [active, setActive] = useState<Dir>(null);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const baseParams = useMemo(() => {
    const p = new URLSearchParams(apiFilters);
    return p;
  }, [apiFilters]);

  function go(to: Dir) {
    if ((to === "prev" && !canPrev) || (to === "next" && !canNext)) return;
    const nextPage = to === "prev" ? page - 1 : page + 1;

    const params = new URLSearchParams(baseParams);
    params.set("page", String(nextPage));

    setActive(to);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  const btnClass =
    "px-4 py-1.5 transition border-2 rounded-md border-primary hover:bg-primary hover:text-secondary disabled:opacity-50 disabled:cursor-not-allowed relative min-w-[96px] flex items-center justify-center gap-2";

  const Spinner = () => (
    <svg
      className="animate-spin h-4 w-4"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        opacity="0.25"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
    </svg>
  );

  return (
    <div className="flex justify-center gap-4 mt-10">
      <button
        type="button"
        onClick={() => go("prev")}
        disabled={!canPrev || isPending}
        aria-busy={isPending && active === "prev"}
        className={clsx(btnClass)}
      >
        {isPending && active === "prev" ? <Spinner /> : null}
        <span>Previous</span>
      </button>

      <button
        type="button"
        onClick={() => go("next")}
        disabled={!canNext || isPending}
        aria-busy={isPending && active === "next"}
        className={clsx(btnClass)}
      >
        {isPending && active === "next" ? <Spinner /> : null}
        <span>Next</span>
      </button>
    </div>
  );
}
