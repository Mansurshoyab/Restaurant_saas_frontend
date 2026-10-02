import { config } from '@/lib/config';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090b] px-4 selection:bg-brand selection:text-white">
      <div className="pointer-events-none absolute left-[-10%] top-[-20%] h-[500px] w-[500px] rounded-full bg-brand/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-tr from-brand to-orange-400 text-2xl font-bold text-white shadow-[0_0_40px_rgba(234,88,12,0.4)]">
            {config.appName.charAt(0)}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{config.appName}</h1>
          <p className="mt-3 text-sm text-zinc-400">Manage your restaurant with precision.</p>
        </div>

        {children}
      </div>
    </div>
  );
}


