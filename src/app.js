
const express = require ("express")
const ProductManager = require ('./product_manager.js')

const app = express()
const PORT = 8080

const productsFile = 'data/products.json'

const productManager = new ProductManager(productsFile);
productManager.init().catch(error => {
  console.error('Error al inicializar ProductManager:', error);
  process.exit(1);
});


app.get('/', (req, res) => {
  res.send('¡Bienvenido a la página de inicio!');
});

app.get('/products', async (req, res) => {
  try {
    let products = await productManager.getProducts();

    const limit = parseInt(req.query.limit);
    if (!isNaN(limit)) {
      products = products.slice(0, limit);
    }

    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});


app.get('/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      res.status(400).json({ error: 'ID de producto no válido' });
      return;
    }

    const product = await productManager.getProductById(productId);
    res.json(product);
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});