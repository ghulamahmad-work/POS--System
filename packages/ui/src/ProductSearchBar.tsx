"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";

type ProductSearchBarProps = {
  placeholder?: string;
};

export function ProductSearchBar({ placeholder = "Search products" }: ProductSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [value, setValue] = useState(initialQuery);
  const isInitialMount = useRef(true);

  // Sync value when URL changes (e.g., browser back/forward), but skip initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const urlQuery = searchParams.get("q") || "";
    setValue(urlQuery);
  }, [searchParams]);

  const updateSearch = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentQuery = params.get("q") || "";
      if (query === currentQuery) return; // Avoid pushing if already the same
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Use a ref to always call the latest updateSearch without re-triggering the effect
  const updateSearchRef = useRef(updateSearch);
  updateSearchRef.current = updateSearch;

  useEffect(() => {
    const timer = setTimeout(() => {
      updateSearchRef.current(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value]);

  const handleClear = () => {
    setValue("");
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="h-10 w-full min-w-0 rounded-md border border-(--border-subtle) bg-(--panel) px-3 pr-8 text-sm shadow-sm outline-none transition placeholder:text-(--text-muted) focus:border-(--brand-500) focus:ring-2 focus:ring-(--brand-500) sm:w-64"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex size-5 items-center justify-center rounded-full text-(--text-muted) hover:text-(--text-primary) hover:bg-(--surface-hover) transition-colors"
            aria-label="Clear search"
          >
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}