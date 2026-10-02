const express = require('express');
const productRoutes = require('./routes/productRoutes');
const app = express();
const port = 3000;

app.use(express.json());
app.use('/products', productRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  res.status(status).json({
    error: status === 500 ? 'Internal server error' : error.message,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
