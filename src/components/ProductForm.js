'use client';
import { useState } from 'react';

export default function ProductForm() {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    description: '',
    photo: '',
    stock: ''
  });

  // Utilizar un estado para manejar el mensaje de la alerta/notificación
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Función para mostrar notificación (reemplazando alert())
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (parseFloat(formData.price) < 0) {
      showNotification('❌ El precio no puede ser negativo', 'error');
      return;
    }
    
    if (parseInt(formData.stock) < 0) {
      showNotification('❌ El stock no puede ser negativo', 'error');
      return;
    }
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: Math.max(0, parseFloat(formData.price || 0)),
          stock: Math.max(0, parseInt(formData.stock || 0))
        }),
      });

      if (response.ok) {
        showNotification('✅ Producto agregado exitosamente', 'success');
        setFormData({
          id: '',
          name: '',
          price: '',
          description: '',
          photo: '',
          stock: ''
        });
      } else {
        showNotification('❌ Error al agregar producto', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('❌ Error al agregar producto', 'error');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Determinar clases de notificación
  const notificationClasses = notification.type === 'success'
    ? 'bg-green-100 border-green-400 text-green-700'
    : 'bg-red-100 border-red-400 text-red-700';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
      
      {/* Notificación (reemplazo de alert) */}
      {notification.message && (
        <div className={`p-4 mb-4 border-l-4 rounded font-medium transition-all ${notificationClasses}`}>
          {notification.message}
        </div>
      )}

      <h2 className="text-2xl font-extrabold text-black mb-6 border-b pb-2">
        Agregar Nuevo Producto
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* ID del Producto */}
          <div>
            <label className="block text-sm font-semibold text-black mb-1">
              ID del Producto *
            </label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
              // Texto de input y borde en negro intenso
              className="w-full px-4 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black transition-shadow shadow-inner"
              placeholder="PROD-001"
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-black mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              // Texto de input y borde en negro intenso
              className="w-full px-4 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black transition-shadow shadow-inner"
              placeholder="Laptop Gaming"
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-semibold text-black mb-1">
              Precio *
            </label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              // Texto de input y borde en negro intenso
              className="w-full px-4 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black transition-shadow shadow-inner"
              placeholder="1200.00"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-semibold text-black mb-1">
              Stock *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              // Texto de input y borde en negro intenso
              className="w-full px-4 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black transition-shadow shadow-inner"
              placeholder="10"
            />
          </div>
        </div>

        {/* URL de la Foto */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            URL de la Foto *
          </label>
          <input
            type="url"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            required
            // Texto de input y borde en negro intenso
            className="w-full px-4 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black transition-shadow shadow-inner"
            placeholder="https://ejemplo.com/foto.jpg"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            Descripción *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            // Texto de textarea y borde en negro intenso
            className="w-full px-4 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black transition-shadow shadow-inner"
            placeholder="Descripción detallada del producto..."
          />
        </div>

        {/* Botón de Enviar */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-bold transition-colors shadow-md hover:shadow-lg"
        >
          Agregar Producto
        </button>
      </form>
    </div>
  );
}