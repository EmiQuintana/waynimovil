"use client";

import Image from "next/image";
import { AppShell } from "@/components/AppShell";
import { FlowHeader } from "@/components/FlowHeader";
import { useCurrentUser } from "@/hooks/useDirectory";

export function ProfileScreen() {
  const currentUser = useCurrentUser();

  return (
    <AppShell>
      <FlowHeader title="Profile" />
      <section className="-mt-10 flex flex-1 flex-col rounded-t-[2.5rem] bg-white px-6 pb-8 pt-10">
        {currentUser.isLoading ? (
          <ProfileSkeleton />
        ) : currentUser.isError ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="text-sm text-red-600">
              We couldn&apos;t load your profile.
            </p>
            <button
              type="button"
              onClick={() => currentUser.refetch()}
              className="mt-3 font-semibold text-[#2ECC71]"
            >
              Retry
            </button>
          </div>
        ) : currentUser.data ? (
          <>
            <div className="flex flex-col items-center">
              <Image
                src={currentUser.data.avatar}
                alt={currentUser.data.fullName}
                width={112}
                height={112}
                className="h-28 w-28 rounded-full object-cover"
              />
              <h2 className="mt-4 text-2xl font-bold text-zinc-900">
                {currentUser.data.fullName}
              </h2>
            </div>

            <dl className="mt-10 space-y-5">
              <ProfileRow label="City" value={currentUser.data.city} />
              <ProfileRow label="State" value={currentUser.data.state} />
              <ProfileRow label="Street" value={currentUser.data.street} />
              <ProfileRow label="Email" value={currentUser.data.email} />
              <ProfileRow label="Phone" value={currentUser.data.phone} />
            </dl>

            <div className="mt-auto flex items-start justify-between gap-6 pt-12 text-sm text-zinc-400">
              <span>ID</span>
              <span className="break-all text-right">{currentUser.data.id}</span>
            </div>
          </>
        ) : null}
      </section>
    </AppShell>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <dt className="text-zinc-400">{label}</dt>
      <dd className="text-right font-bold text-zinc-900">{value}</dd>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center">
      <div className="h-28 w-28 animate-pulse rounded-full bg-zinc-200" />
      <div className="mt-4 h-7 w-40 animate-pulse rounded bg-zinc-200" />
      <div className="mt-10 w-full space-y-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex justify-between">
            <div className="h-4 w-16 animate-pulse rounded bg-zinc-200" />
            <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
