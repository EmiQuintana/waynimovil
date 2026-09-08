import { BottomNav } from "./BottomNav";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh justify-center bg-zinc-100">
      <div className="flex min-h-dvh w-full max-w-[430px] flex-col bg-white shadow-lg md:max-w-2xl">
        <div className="flex flex-1 flex-col">{children}</div>
        <BottomNav />
      </div>
    </div>
  );
}
