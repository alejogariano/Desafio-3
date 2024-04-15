const fs = require('fs');

class ProductManager {
    constructor(filename) {
      this.filename = filename;
      this.products = [];
      this.currentId = 1;
    }
  
    async init() {
      try {
        await fs.promises.access(this.filename);
        await this.loadProducts();
      } catch (error) {
        if (error.code === 'ENOENT') {
          await this.saveProducts([]);
        } else {
          throw error;
        }
      }
    }
  
    async loadProducts() {
      const data = await fs.promises.readFile(this.filename, 'utf8');
      this.products = JSON.parse(data);
      const lastProduct = this.products[this.products.length - 1];
      if (lastProduct) {
        this.currentId = lastProduct.id + 1;
      }
    }
  
    async saveProducts(products) {
      await fs.writeFile(this.filename, JSON.stringify(products, null, 2));
    }
  
    async getProducts() {
      return this.products;
    }
  
    async addProduct({ title, description, price, thumbnail, code, stock }) {
  
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        throw new Error("Todos los campos son obligatorios.");
      }
  
      const existingProduct = this.products.find(product => product.code === code);
      if (existingProduct) {
        throw Error("El código de producto ya está en uso.");
      }
  
      const id = this.currentId++;
  
      const newProduct = {
        id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      };
  
      this.products.push(newProduct);
      await this.saveProducts(this.products);
  
      return newProduct;
    }
  
    async getProductById(id) {
      const product = this.products.find(product => product.id === id);
      if (!product) {
        throw Error("Producto no encontrado.");
      }
      return product;
    }
  
    async updateProduct(id, updatedFields) {
      const productIndex = this.products.findIndex(product => product.id === id);
      if (productIndex === -1) {
        throw Error("Producto no encontrado.");
      }
      if (updatedFields.code) {
        const existingProduct = this.products.find(product => product.code === updatedFields.code && product.id !== id);
        if (existingProduct) {
          throw new Error("El código de producto ya está en uso.");
        }
      }
  
      this.products[productIndex] = {
        ...this.products[productIndex],
        ...updatedFields
      };
  
      await this.saveProducts(this.products);
  
      return this.products[productIndex];
    }
  
    async deleteProduct(id) {
      const initialLength = this.products.length;
      this.products = this.products.filter(product => product.id !== id);
      if (this.products.length === initialLength) {
        throw Error("Producto no encontrado.");
      }
  
      await this.saveProducts(this.products);
    }
  }

  module.exports = ProductManager;
