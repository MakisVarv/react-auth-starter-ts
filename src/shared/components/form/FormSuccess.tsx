export function FormSuccess({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <p
      role="status"
      className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
    >
      {message}
    </p>
  );
}
