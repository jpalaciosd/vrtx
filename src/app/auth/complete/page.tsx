'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCompletePage() {
  const router = useRouter();

  useEffect(() => {
    const redirect = localStorage.getItem('vrtx_redirect') || '/dashboard';
    localStorage.removeItem('vrtx_redirect');
    router.push(redirect);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#060810] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#8899bb] text-sm">Entrando a tu VRTX...</p>
      </div>
    </div>
  );
}
