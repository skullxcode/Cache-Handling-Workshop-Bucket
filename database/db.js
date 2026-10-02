const fs = require('node:fs/promises');
const path = require('path');
const DB_FILE = path.join(__dirname, 'products.json');

async function readAll() {
  const contents = await fs.readFile(DB_FILE, 'utf-8');
  return JSON.parse(contents);
}

function writeAll(products) {
  return fs.writeFile(DB_FILE, JSON.stringify(products, null, 2));
}

async function findById(id) {
  const products = await readAll();
  return products.find((product) => product.id === Number(id));
}

function findAll() {
  return readAll();
}

async function insert(data) {
  const products = await readAll();
  const nextId = products.reduce((max, product) => Math.max(max, product.id), 0) + 1;
  const product = { ...data, id: nextId };
  products.push(product);
  await writeAll(products);
  return product;
}

async function update(id, data) {
  const products = await readAll();
  const productId = Number(id);
  const index = products.findIndex((product) => product.id === productId);
  if (index === -1) return null;
  products[index] = { ...products[index], ...data, id: productId };
  await writeAll(products);
  return products[index];
}

async function remove(id) {
  const products = await readAll();
  const index = products.findIndex((product) => product.id === Number(id));
  if (index === -1) return false;
  products.splice(index, 1);
  await writeAll(products);
  return true;
}

module.exports = { readAll, findById, findAll, insert, update, remove };
