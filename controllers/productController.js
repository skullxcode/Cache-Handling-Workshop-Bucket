const productService = require('../services/productService');
const { setCache, clearCache } = require('../middleware/cache');

async function getAllProducts(req, res) {
  const products = await productService.getAllProducts();
  setCache(req.originalUrl, products);
  res.status(200).json(products);
}

async function getProductById(req, res) {
  const product = await productService.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  setCache(req.originalUrl, product);
  res.status(200).json(product);
}

async function createProduct(req, res) {
  const product = await productService.createProduct(req.body);
  clearCache();
  res.status(201).json(product);
}

async function updateProduct(req, res) {
  const product = await productService.updateProduct(req.params.id, req.body);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  clearCache();
  res.status(200).json(product);
}

async function deleteProduct(req, res) {
  const removed = await productService.deleteProduct(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: 'Product not found' });
  }

  clearCache();
  res.status(204).end();
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
