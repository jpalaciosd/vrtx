'use client';

import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-browser';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import Link from 'next/link';

function LoginContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const { user } = useAuth();
  const router = useRouter();

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      router.push(redirect);
    }
  }, [user, redirect, router]);

  const handleGoogleLogin = async () => {
    // Store redirect in localStorage for after OAuth
    localStorage.setItem('vrtx_redirect', redirect);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#060810] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-bold text-4xl tracking-wider">
            <span className="text-[#00d4ff]">VR</span>TX
          </h1>
          <p className="text-[#8899bb] text-sm mt-2">Accede a tu perfil digital</p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 space-y-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[#060810] text-[#8899bb]">o próximamente</span>
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="email"
              disabled
              placeholder="tu@email.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#8899bb]/50 cursor-not-allowed"
            />
            <button
              disabled
              className="w-full py-3 bg-[#00d4ff]/20 text-[#00d4ff]/40 font-semibold rounded-xl cursor-not-allowed text-sm"
            >
              Acceder con email (próximamente)
            </button>
          </div>
        </div>

        <p className="text-center text-[#8899bb]/50 text-xs mt-6">
          Al continuar, aceptas los{' '}
          <span className="text-[#8899bb]">Términos</span> y{' '}
          <span className="text-[#8899bb]">Política de Privacidad</span> de VRTX
        </p>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-[#8899bb] hover:text-[#00d4ff] transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#060810] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
