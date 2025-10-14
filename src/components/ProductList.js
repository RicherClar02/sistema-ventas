'use client';
import { useState, useEffect } from 'react';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (productId) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        const response = await fetch('/api/products', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: productId }),
        });

        if (response.ok) {
          alert('✅ Producto eliminado');
          fetchProducts();
        }
      } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al eliminar producto');
      }
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product.id);
    setEditForm(product);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditForm({});
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        alert('✅ Producto actualizado');
        setEditingProduct(null);
        setEditForm({});
        fetchProducts();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al actualizar producto');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-black mb-6 border-b pb-3">
        Gestión de Productos
      </h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-bold text-black">ID</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-black">Foto</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-black">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-black">Precio</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-black">Stock</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-black">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                {editingProduct === product.id ? (
                  // Modo edición
                  <>
                    <td className="px-4 py-3 font-mono text-sm text-gray-900">{product.id}</td>
                    <td className="px-4 py-3">
                      <input
                        type="url"
                        value={editForm.photo}
                        onChange={(e) => setEditForm({...editForm, photo: e.target.value})}
                        // Texto de input en negro
                        className="w-full px-2 py-1 border border-gray-800 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="URL de la foto"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        // Texto de input en negro
                        className="w-full px-2 py-1 border border-gray-800 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.price}
                        onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                        // Texto de input en negro
                        className="w-full px-2 py-1 border border-gray-800 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={editForm.stock}
                        onChange={(e) => setEditForm({...editForm, stock: e.target.value})}
                        // Texto de input en negro
                        className="w-full px-2 py-1 border border-gray-800 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={handleUpdate}
                        // Texto de botón en blanco para contraste
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        ✅ Guardar
                      </button>
                      <button
                        onClick={cancelEdit}
                        // Texto de botón en blanco para contraste
                        className="bg-gray-900 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                      >
                        ❌ Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  // Modo visualización
                  <>
                    <td className="px-4 py-3 font-mono text-sm text-gray-900">{product.id}</td>
                    <td className="px-4 py-3">
                      <img src={product.photo} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                    <td className="px-4 py-3 text-gray-900">${product.price}</td>
                    <td className="px-4 py-3 text-gray-900">{product.stock}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => startEdit(product)}
                        // Texto de botón en blanco para contraste
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        // Texto de botón en blanco para contraste
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {products.length === 0 && (
          <div className="text-center py-8 text-black">
            No hay productos registrados. Usa "Agregar Producto" para comenzar.
          </div>
        )}
      </div>
    </div>
  );
}