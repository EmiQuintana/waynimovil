"use client";

import Image from "next/image";
import { AppShell } from "@/components/AppShell";
import { useCurrentUser } from "@/hooks/useDirectory";

export default function ProfilePage() {
  const currentUser = useCurrentUser();

  return (
    <AppShell>
      <main className="flex flex-1 flex-col items-center px-6 py-10">
        <h1 className="self-start text-2xl font-bold text-zinc-900">Profile</h1>
        {currentUser.isLoading ? (
          <div className="mt-12 h-24 w-24 animate-pulse rounded-full bg-zinc-200" />
        ) : currentUser.isError ? (
          <div className="mt-12 text-center">
            <p className="text-sm text-red-600">We couldn&apos;t load your profile.</p>
            <button
              type="button"
              onClick={() => currentUser.refetch()}
              className="mt-2 font-semibold text-violet-600"
            >
              Retry
            </button>
          </div>
        ) : currentUser.data ? (
          <div className="mt-12 flex flex-col items-center gap-3">
            <Image
              src={currentUser.data.avatar}
              alt={currentUser.data.fullName}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover"
            />
            <p className="text-xl font-semibold">{currentUser.data.fullName}</p>
          </div>
        ) : null}
      </main>
    </AppShell>
  );
}
