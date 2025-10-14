import dbConnect from '../../src/lib/mongodb';
import Product from '../../src/models/Product';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { items, total, user } = req.body;

      // Actualizar stock para cada producto vendido
      for (const item of items) {
        await Product.findOneAndUpdate(
          { id: item.id },
          { $inc: { stock: -item.quantity } }
        );
      }

      // En una implementación real, guardarías la venta en una colección 'sales'
      // const sale = await Sale.create({ items, total, user, date: new Date() });

      res.status(200).json({ 
        success: true, 
        message: `Venta procesada exitosamente - Total: $${total}`,
        saleId: `VENTA-${Date.now()}`
      });
    } catch (error) {
      console.error('Error procesando venta:', error);
      res.status(500).json({ error: 'Error procesando venta' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}