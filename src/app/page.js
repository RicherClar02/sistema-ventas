'use client';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirigir SI está autenticado
  useEffect(() => {
    if (status === 'authenticated' && session) {
      console.log('Usuario autenticado, redirigiendo a dashboard...');
      router.push('/dashboard');
    }
  }, [session, status, router]);

  const handleGoogleLogin = async () => {
    try {
      console.log('Iniciando login con Google...');
      const result = await signIn('google', { 
        callbackUrl: '/dashboard',
        redirect: false 
      });
      
      console.log('Resultado del login:', result);
      
      if (result?.error) {
        console.error('Error en login:', result.error);
        alert('Error al iniciar sesión: ' + result.error);
      }
    } catch (error) {
      console.error('Error durante login:', error);
      alert('Error de conexión durante el login');
    }
  };

  // Mostrar loading mientras verifica
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl">Verificando sesión...</div>
      </div>
    );
  }

  // Si ya está autenticado, mostrar loading mientras redirige
  if (status === 'authenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl">Redirigiendo al dashboard...</div>
      </div>
    );
  }

  // Solo mostrar login si NO está autenticado
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sistema de Ventas</h1>
          <p className="text-gray-800">Inicia sesión para continuar</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          <div className="text-center">
            <Link 
              href="/forgot-password" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-900 text-sm">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}