'use client';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#060810] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-4xl mb-4">⚠️</p>
      <h2 className="text-white text-xl font-bold mb-2">Error en el Dashboard</h2>
      <p className="text-[#8899bb] text-sm mb-2 max-w-md">{error.message}</p>
      <pre className="text-[#8899bb]/50 text-xs mb-6 max-w-md overflow-auto">{error.stack?.split('\n').slice(0, 3).join('\n')}</pre>
      <button
        onClick={reset}
        className="px-6 py-2 bg-[#00d4ff] text-black font-bold rounded-full text-sm"
      >
        Reintentar
      </button>
    </div>
  );
}
