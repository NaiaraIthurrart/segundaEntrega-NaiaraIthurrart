const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, JSON.stringify([]));
    }
  }

  addProduct(product) {
    const {title, description, price, thumbnail, code, stock} = product;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Error: Todos los campos son obligatorios");
      return;
    }

    const products = this.getProducts();
    if (products.some(p => p.code === code)) {
      console.log(`Error: El producto con código ${code} ya existe`);
      return;
    }

    const newProduct = {
      id: products.length ? products[products.length - 1].id + 1 : 1,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    };

    products.push(newProduct);
    fs.writeFileSync(this.path, JSON.stringify(products));
  }

  getProducts() {
    const data = fs.readFileSync(this.path, 'utf-8');
    return JSON.parse(data);
  }

  getProductById(id) {
    const products = this.getProducts();
    const product = products.find(p => p.id === id);
    if (product) {
      return product;
    } else {
      console.log("Error: Producto no encontrado");
      return null;
    }
  }

  updateProduct(id, fieldsToUpdate) {
    const products = this.getProducts();
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      console.log("Error: Producto no encontrado");
      return;
    }

    const updatedProduct = {
      ...products[productIndex],
      ...fieldsToUpdate,
      id
    };
    products[productIndex] = updatedProduct;
    fs.writeFileSync(this.path, JSON.stringify(products));
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const updatedProducts = products.filter(p => p.id !== id);
    if (products.length === updatedProducts.length) {
      console.log("Error: Producto no encontrado");
      return;
    }
    fs.writeFileSync(this.path, JSON.stringify(updatedProducts));
  }
}


const manager = new ProductManager('./products.json');
manager.addProduct({
  title: "La novia gitana",
  description: "Libro de Carmen Mola",
  price: 10000,
  thumbnail: "/",
  code: "PRO01",
  stock: 10
});

const products = manager.getProducts();
console.log(products);

manager.updateProduct(1, {title: "Nuevo título", price: 20000});
console.log(manager.getProductById(1));

manager.deleteProduct(1);
console.log(manager.getProducts());

  