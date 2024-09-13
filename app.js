
// Создание нового проекта с подключением к MongoDB



// import express from 'express';
// import { connectDB, client } from './db/index.js';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// app.use(express.json());

// // Connect to MongoDB
// connectDB();

// const db = client.db('ich');
// const productsCollection = db.collection('products');

// // Define routes
// app.post('/products', async (req, res) => {
//     try {
//         const result = await productsCollection.insertOne(req.body);
//         res.status(201).json(result.ops[0]);
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating product', error });
//     }
// });

// // Other routes...

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// 2 Create Collection Products in Mongo

import express from 'express';
import { connectDB, client } from './db/index.js';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb'; 

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

const db = client.db('Node12');
const productsCollection = db.collection('products');

// Create a new product
app.post('/products', async (req, res) => {
    try {
        const { name, price, description } = req.body;
        if (!name || !price) {
            return res.status(400).json({ message: 'Name and price are required' });
        }
        const result = await productsCollection.insertOne({ name, price, description });
        res.status(201).json(result.ops[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error });
    }
});

// Get all products
app.get('/products', async (req, res) => {
    try {
        const products = await productsCollection.find().toArray();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

// Get a product by ID
app.get('/products/:id', async (req, res) => {
    try {
        const product = await productsCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
});

// Update a product
app.put('/products/:id', async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const result = await productsCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { name, price, description } }
        );
        if (result.matchedCount > 0) {
            res.status(200).json({ message: 'Product updated' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
});

// Delete a product
app.delete('/products/:id', async (req, res) => {
    try {
        const result = await productsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Product deleted' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
