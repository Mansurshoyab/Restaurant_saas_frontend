export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/10" />
      </div>
      <div className="relative flex justify-center">
        <span className="rounded-full border border-white/5 bg-[#141416] px-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          {label}
        </span>
      </div>
    </div>
  );
}

