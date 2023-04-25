const fs = require("fs");

class ProductManager {
    constructor(path) {
        this.path = path;
    }
    async addProduct(productData) {
        const { title,
            description,
            price,
            thumbnail,
            code,
            stock } = productData;
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            return "Es necesario completar todos los campos";
        }

        const products = await this.getProducts();
        if (products.some((product) => product.code === code)) {
            return "Este producto está previamente registrado, por favor ingrese otro codigo";
        }
        const id = products[products.length - 1]?.id + 1 || 1;
        const newProduct = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };
        products.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async getProducts() {
        let products = [];
        if (fs.existsSync(this.path)) {
            const fileData = await fs.promises.readFile(this.path, "utf-8");
            products = JSON.parse(fileData);
        }
        return products;
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const productFound = products.find((product) => product.id === id);
        if (!productFound) {
            return "producto no encontrado";
        }
        return productFound;
    }

    async updateProduct(id, changes) {
        const products = await this.getProducts();
        const productIndex = products.findIndex((product) => product.id === id);
        if (productIndex === -1) {
            return "producto no encontrado";
        }
        const productFound = products[productIndex];
        const productUpdated = { ...productFound, ...changes };
        products[productIndex] = productUpdated;
        fs.promises.writeFile(this.path, JSON.stringify(products));
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        if (!products.some((product) => product.id === id)) {
            return "producto no encontrado";
        }
        const newProducts = products.filter((product) => product.id !== id);
        await fs.promises.writeFile(
            this.path,
            JSON.stringify(newProducts, null, 2)
        );
    }
}
const productManager = new ProductManager("products.json");

const product_1 = {
    title: "Arroz",
    description: "Grano",
    price: 1500,
    thumbnail: "NA",
    code: "34tt56",
    stock: 30,
};
const product_2 = {
    title: "Manzana",
    description: "fruta",
    price: 1000,
    thumbnail: "NA",
    code: "88tt78",
    stock: 40,
};



productManager.getProducts().then((response) => {
    console.log(response);
});

productManager.addProduct(product_2).then((response) => {
    console.log(response);
});

productManager.addProduct(product_1).then((response) => {
    console.log(response);
});

productManager.getProductById(1).then((response) => {
    console.log(response);
});

productManager.updateProduct(1, "title:Mango").then((response) => {
    console.log(response);
});

productManager.deleteProduct(1).then((response) => {
    console.log(response);
});