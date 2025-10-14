import dbConnect from '../../src/lib/mongodb';
import Product from '../../src/models/Product';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const products = await Product.find({});
        res.status(200).json(products);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
      }
      break;

    case 'POST':
      try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
      } catch (error) {
        if (error.code === 11000) {
          res.status(400).json({ error: 'Product ID already exists' });
        } else {
          res.status(500).json({ error: 'Error creating product' });
        }
      }
      break;

    case 'PUT':
      try {
        const product = await Product.findOneAndUpdate(
          { id: req.body.id },
          req.body,
          { new: true }
        );
        res.status(200).json(product);
      } catch (error) {
        res.status(500).json({ error: 'Error updating product' });
      }
      break;

    case 'DELETE':
      try {
        await Product.findOneAndDelete({ id: req.body.id });
        res.status(200).json({ message: 'Product deleted' });
      } catch (error) {
        res.status(500).json({ error: 'Error deleting product' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}