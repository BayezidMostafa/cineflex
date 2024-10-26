"use client";

import React, { Suspense } from "react";
import Skeleton from "@/components/Movie/Card/Skeleton";
import Search from "@/components/Search/Search";

export default function SearchPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Search />
    </Suspense>
  );
}
