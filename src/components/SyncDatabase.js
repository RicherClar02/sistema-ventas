'use client';
import { useState } from 'react';

export default function SyncDatabase() {
  const [syncStatus, setSyncStatus] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('🔄 Sincronizando bases de datos...');
    
    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
      });

      const data = await response.json();
      
      if (response.ok) {
        setSyncStatus(`✅ ${data.message}`);
      } else {
        setSyncStatus(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setSyncStatus('❌ Error de conexión durante la sincronización');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Sincronización de Bases de Datos</h2>
      <p className="text-gray-600 mb-6">
        Sincroniza los datos entre MongoDB Local y MongoDB Atlas (Concepto de BD Espejo)
      </p>

      <div className="space-y-6">
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium text-lg"
        >
          {isSyncing ? '🔄 Sincronizando...' : '🔄 Iniciar Sincronización'}
        </button>

        {syncStatus && (
          <div className={`p-4 rounded-lg text-center ${
            syncStatus.includes('✅') ? 'bg-green-100 text-green-700 border border-green-200' : 
            syncStatus.includes('❌') ? 'bg-red-100 text-red-700 border border-red-200' : 
            'bg-blue-100 text-blue-700 border border-blue-200'
          }`}>
            {syncStatus}
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-bold text-blue-800 mb-3">¿Cómo funciona la sincronización?</h3>
          <ul className="text-blue-700 text-sm space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Replica todos los productos de la base de datos local a MongoDB Atlas</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Mantiene ambas bases de datos idénticas y actualizadas</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Aplica el concepto de bases de datos espejo para redundancia</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Permite continuar operaciones si una base de datos falla</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">MongoDB Local</h4>
            <p className="text-gray-600">Base de datos en tu servidor local para desarrollo y respaldo</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">MongoDB Atlas</h4>
            <p className="text-gray-600">Base de datos en la nube para producción y acceso remoto</p>
          </div>
        </div>
      </div>
    </div>
  );
}