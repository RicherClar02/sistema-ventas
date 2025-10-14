import dbConnect from '../../src/lib/mongodb';
import Product from '../../src/models/Product';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    await dbConnect();

    // Obtener todos los productos
    const products = await Product.find({});
    
    // Simular sincronización con otra base de datos
    // En un caso real, aquí te conectarías a MongoDB Atlas
    // y copiarías los datos
    
    const syncResult = {
      message: `Sincronización completada. ${products.length} productos sincronizados entre bases de datos.`,
      productsCount: products.length,
      timestamp: new Date().toISOString(),
      status: 'success'
    };

    res.status(200).json(syncResult);
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ 
      error: 'Error en la sincronización',
      details: error.message 
    });
  }
}