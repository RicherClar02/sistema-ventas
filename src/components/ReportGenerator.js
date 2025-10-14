'use client';
import { useState, useEffect } from 'react';

export default function ReportGenerator() {
  const [products, setProducts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const { jsPDF } = await import('jspdf');
      
      // Crear PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPosition = 20;

      // Título
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('REPORTE DE INVENTARIO', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 10;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 15;

      // Estadísticas
      const totalValue = products.reduce((sum, product) => sum + (product.price * Math.max(0, product.stock)), 0);
      const totalProducts = products.length;
      const lowStockProducts = products.filter(p => p.stock < 10 && p.stock > 0).length;
      const outOfStockProducts = products.filter(p => p.stock <= 0).length;

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RESUMEN DEL INVENTARIO', 20, yPosition);
      yPosition += 8;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Total de productos: ${totalProducts}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Valor total del inventario: $${totalValue.toFixed(2)}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Productos con bajo stock: ${lowStockProducts}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Productos agotados: ${outOfStockProducts}`, 20, yPosition);
      
      yPosition += 15;

      // Encabezados de la tabla
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text('IMAGEN', 15, yPosition);
      pdf.text('ID', 35, yPosition);
      pdf.text('NOMBRE', 55, yPosition);
      pdf.text('PRECIO', 110, yPosition);
      pdf.text('STOCK', 130, yPosition);
      pdf.text('VALOR', 150, yPosition);
      pdf.text('ESTADO', 175, yPosition);
      
      yPosition += 8;
      pdf.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 10;

      // Productos
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        
        // Verificar si necesitamos nueva página
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
          
          // Encabezados en nueva página
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(9);
          pdf.text('IMAGEN', 15, yPosition);
          pdf.text('ID', 35, yPosition);
          pdf.text('NOMBRE', 55, yPosition);
          pdf.text('PRECIO', 110, yPosition);
          pdf.text('STOCK', 130, yPosition);
          pdf.text('VALOR', 150, yPosition);
          pdf.text('ESTADO', 175, yPosition);
          yPosition += 8;
          pdf.line(15, yPosition, pageWidth - 15, yPosition);
          yPosition += 10;
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8);
        }

        const stock = Math.max(0, product.stock); // Evitar stock negativo
        const price = Math.max(0, product.price); // Evitar precio negativo
        const productValue = price * stock;
        const status = stock === 0 ? 'AGOTADO' : 
                      stock < 5 ? 'BAJO STOCK' : 'DISPONIBLE';

        // Agregar imagen (si existe y es válida)
        try {
          if (product.photo && product.photo.startsWith('http')) {
            // Crear una imagen y agregarla al PDF
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = product.photo;
            
            // Esperar a que la imagen cargue
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              setTimeout(resolve, 500); // Timeout por si la imagen no carga
            });

            // Agregar imagen al PDF (15x15 mm)
            pdf.addImage(img, 'JPEG', 15, yPosition - 8, 15, 15);
          } else {
            // Placeholder si no hay imagen
            pdf.rect(15, yPosition - 8, 15, 15);
            pdf.text('S/F', 18, yPosition);
          }
        } catch (error) {
          // Si hay error con la imagen, mostrar placeholder
          pdf.rect(15, yPosition - 8, 15, 15);
          pdf.text('S/F', 18, yPosition);
        }

        // Truncar nombre si es muy largo
        const productName = product.name.length > 25 ? 
          product.name.substring(0, 25) + '...' : product.name;

        // Datos del producto
        pdf.text(product.id, 35, yPosition);
        pdf.text(productName, 55, yPosition);
        pdf.text(`$${price.toFixed(2)}`, 110, yPosition);
        pdf.text(stock.toString(), 130, yPosition);
        pdf.text(`$${productValue.toFixed(2)}`, 150, yPosition);
        
        // Color del estado
        if (status === 'AGOTADO') {
          pdf.setTextColor(255, 0, 0); // Rojo
        } else if (status === 'BAJO STOCK') {
          pdf.setTextColor(255, 165, 0); // Naranja
        } else {
          pdf.setTextColor(0, 128, 0); // Verde
        }
        
        pdf.text(status, 175, yPosition);
        pdf.setTextColor(0, 0, 0); // Reset a negro
        
        yPosition += 20; // Más espacio para la imagen
      }

      // Totales al final
      yPosition += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 8;
      
      pdf.text('TOTALES:', 15, yPosition);
      pdf.text(totalProducts.toString(), 130, yPosition);
      pdf.text(`$${totalValue.toFixed(2)}`, 150, yPosition);
      pdf.text(`${outOfStockProducts} agotados`, 175, yPosition);

      // Pie de página
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(8);
      pdf.text('Sistema de Gestión de Ventas - Reporte generado automáticamente', 
               pageWidth / 2, 290, { align: 'center' });

      // Guardar PDF
      pdf.save(`inventario-${new Date().toISOString().split('T')[0]}.pdf`);
      
      alert('✅ PDF generado exitosamente con imágenes');
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('❌ Error al generar el PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const totalValue = products.reduce((sum, product) => sum + (product.price * Math.max(0, product.stock)), 0);
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 10 && p.stock > 0).length;
  const outOfStockProducts = products.filter(p => p.stock <= 0).length;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reporte de Inventario</h2>
        <button
          onClick={generatePDF}
          disabled={isGenerating || products.length === 0}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium flex items-center gap-2"
        >
          {isGenerating ? '🔄 Generando...' : '📊 Generar PDF'}
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-bold text-blue-900">Total Productos</h3>
          <p className="text-2xl font-bold text-blue-600">{totalProducts}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-bold text-green-900">Valor Total</h3>
          <p className="text-2xl font-bold text-green-600">${totalValue.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-bold text-yellow-900">Bajo Stock</h3>
          <p className="text-2xl font-bold text-yellow-600">{lowStockProducts}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="font-bold text-red-900">Agotados</h3>
          <p className="text-2xl font-bold text-red-600">{outOfStockProducts}</p>
        </div>
      </div>

      {/* Vista previa del reporte */}
      <div className="border-2 border-gray-300 p-6 rounded-lg">
        <div className="text-center mb-6 border-b pb-4">
          <h3 className="text-xl font-bold text-gray-900">Vista Previa del Reporte</h3>
          <p className="text-gray-800">Esta es una vista previa. El PDF incluirá imágenes de los productos.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left">Imagen</th>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">Precio</th>
                <th className="p-2 text-left">Stock</th>
                <th className="p-2 text-left">Valor</th>
                <th className="p-2 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => {
                const stock = Math.max(0, product.stock);
                const price = Math.max(0, product.price);
                const productValue = price * stock;
                const status = stock === 0 ? 'Agotado' : 
                              stock < 5 ? 'Bajo Stock' : 'Disponible';
                const statusColor = stock === 0 ? 'text-red-600' : 
                                  stock < 5 ? 'text-yellow-600' : 'text-green-600';
                
                return (
                  <tr key={product.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="p-2">
                      <img 
                        src={product.photo} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzMkMzMS4zMzE0IDMyIDM3LjMzMTQgMjYuODgzOSAzNy4zMzE0IDIwQzM3LjMzMTQgMTMuMTE2MSAzMS4zMzE0IDggMjQgOEMxNi42Njg2IDggMTAuNjY4NiAxMy4xMTYxIDEwLjY2ODYgMjBDMTAuNjY4NiAyNi44ODM5IDE2LjY2ODYgMzIgMjQgMzJaIiBmaWxsPSIjOTlBQUFGIi8+CjxwYXRoIGQ9Ik0yNCAyN0MyNi43NjE0IDI3IDI5IDI0Ljc2MTQgMjkgMjJDMjkgMTkuMjM4NiAyNi43NjE0IDE3IDI0IDE3QzIxLjIzODYgMTcgMTkgMTkuMjM4NiAxOSAyMkMxOSAyNC43NjE0IDIxLjIzODYgMjcgMjQgMjdaIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo=';
                        }}
                      />
                    </td>
                    <td className="p-2 font-mono text-gray-900">{product.id}</td>
                    <td className="p-2 font-medium text-gray-900">{product.name}</td>
                    <td className="p-2 text-gray-900">${price.toFixed(2)}</td>
                    <td className="p-2 text-gray-900">{stock}</td>
                    <td className="p-2 text-gray-900">${productValue.toFixed(2)}</td>
                    <td className={`p-2 font-medium ${statusColor}`}>
                      {status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-200 font-bold">
                <td colSpan="3" className="p-2 text-right text-gray-900">TOTALES:</td>
                <td className="p-2"></td>
                <td className="p-2 text-gray-900">{products.reduce((sum, p) => sum + Math.max(0, p.stock), 0)}</td>
                <td className="p-2 text-gray-900">${totalValue.toFixed(2)}</td>
                <td className="p-2 text-gray-900">
                  {outOfStockProducts} agotados
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-8 text-gray-900">
            No hay productos para generar el reporte.
          </div>
        )}
      </div>
    </div>
  );
}