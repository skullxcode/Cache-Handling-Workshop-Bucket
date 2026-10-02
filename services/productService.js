const db = require('../database/db');

function badRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function validateProduct(data, partial = false) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw badRequest('Product fields are required');
  }
  if (partial && Object.keys(data).length === 0) {
    throw badRequest('Product fields are required');
  }
  if (
    (!partial || data.name !== undefined) &&
    (typeof data.name !== 'string' || !data.name.trim())
  ) {
    throw badRequest('Name must be a non-empty string');
  }
  if ((!partial || data.price !== undefined) && (!Number.isFinite(data.price) || data.price < 0)) {
    throw badRequest('Price must be a non-negative number');
  }
}

function getAllProducts() {
  return db.findAll();
}

function getProductById(id) {
  return db.findById(id);
}

function createProduct(data) {
  validateProduct(data);
  return db.insert({ ...data, name: data.name.trim() });
}

function updateProduct(id, data) {
  validateProduct(data, true);
  return db.update(id, {
    ...data,
    ...(data.name !== undefined ? { name: data.name.trim() } : {}),
  });
}

function deleteProduct(id) {
  return db.remove(id);
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
