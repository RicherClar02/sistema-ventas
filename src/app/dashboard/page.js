'use client';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '../../components/ProductForm';
import ProductList from '../../components/ProductList';
import SyncDatabase from '../../components/SyncDatabase';
import ReportGenerator from '../../components/ReportGenerator';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('products');

  // Redirigir si NO está autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      console.log('No autenticado, redirigiendo a login...');
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando sesión...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Redirigiendo...</div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'add-product':
        return <ProductForm />;
      case 'products':
        return <ProductList />;
      case 'sync':
        return <SyncDatabase />;
      case 'report':
        return <ReportGenerator />;
      case 'ventas':
        return (
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Punto de Venta</h2>
            <p className="text-gray-900 mb-6">Para acceder al sistema completo de ventas:</p>
            <a 
              href="/ventas" 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
            >
              🛒 Ir al Punto de Venta
            </a>
          </div>
        );
      default:
        return <ProductList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Sistema de Ventas</h1>
            </div>
            <div className="flex items-center space-x-4">
              {session.user?.image && (
                <img 
                  src={session.user.image} 
                  alt={session.user.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-gray-700">Hola, {session.user?.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Menu */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow-sm p-6">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveSection('ventas')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeSection === 'ventas' 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                🛒 Punto de Venta
              </button>
              <button
                onClick={() => setActiveSection('products')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeSection === 'products' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                📦 Gestionar Productos
              </button>
              <button
                onClick={() => setActiveSection('add-product')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeSection === 'add-product' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                ➕ Agregar Producto
              </button>
              <button
                onClick={() => setActiveSection('sync')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeSection === 'sync' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                🔄 Sincronizar BD
              </button>
              <button
                onClick={() => setActiveSection('report')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeSection === 'report' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                📊 Generar Reporte PDF
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
}