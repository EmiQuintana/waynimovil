"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BackIcon } from "./Icons";

type FlowHeaderProps = {
  title: string;
  children?: React.ReactNode;
  focusTitle?: boolean;
};

export function FlowHeader({
  title,
  children,
  focusTitle = false,
}: FlowHeaderProps) {
  const router = useRouter();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (focusTitle) {
      headingRef.current?.focus();
    }
  }, [focusTitle, title]);

  return (
    <header className="bg-[#2ECC71] px-4 pb-14 pt-4 text-white">
      <div className="relative flex h-10 items-center justify-center">
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute left-0 rounded-full p-2"
          aria-label="Go back"
        >
          <BackIcon className="h-6 w-6" />
        </button>
        <h1
          ref={headingRef}
          tabIndex={focusTitle ? -1 : undefined}
          className="text-lg font-semibold outline-none"
        >
          {title}
        </h1>
      </div>
      {children}
    </header>
  );
}
