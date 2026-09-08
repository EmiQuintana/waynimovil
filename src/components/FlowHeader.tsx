"use client";

import { useRouter } from "next/navigation";
import { BackIcon } from "./Icons";

type FlowHeaderProps = {
  title: string;
  children?: React.ReactNode;
};

export function FlowHeader({ title, children }: FlowHeaderProps) {
  const router = useRouter();

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
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      {children}
    </header>
  );
}
