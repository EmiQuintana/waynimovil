import { AlertIcon } from "./Icons";

type ErrorMessageProps = {
  id?: string;
  children: React.ReactNode;
};

export function ErrorMessage({ id, children }: ErrorMessageProps) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-4 flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-900"
    >
      <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
