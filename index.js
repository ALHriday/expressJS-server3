const express = require('express');
const cors = require('cors');
require('dotenv').config();
// const products = require('./products.json');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 7000;

const app = express();

app.use(cors());
app.use(express.json());

const user = process.env.DB_USER;
const pass = process.env.DB_PASS;

const uri = `mongodb+srv://${user}:${pass}@cluster0.lgngp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const database = client.db('users');
        const userCollection = database.collection('coffees');

        app.get('/coffees', async (req, res) => {
            const cursor = userCollection.find(); 
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        app.put('/coffees/:id', async(req, res) => {
            const id = req.params.id;
          
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedCoffee = req.body;
            const coffee = {
                $set: {
                    name: updatedCoffee.name,
                    chef: updatedCoffee.chef,
                    supplier: updatedCoffee.supplier,
                    teste: updatedCoffee.teste,
                    category: updatedCoffee.category,
                    price: updatedCoffee.price,
                    details: updatedCoffee.details,
                    photo: updatedCoffee.photo
                }
            }
            const result = await userCollection.updateOne(filter, coffee, options);
            res.send(result);
        })
        
        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

        app.post('/coffees', async (req, res) => {
            const data = req.body;
            const result = await userCollection.insertOne(data);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World');
});

// app.get('/products', (req, res) => {
//     res.send(products);
// });

// app.get('/products/:id', (req, res) => {
//     const id = parseInt(req.params.id);
//     const eachProduct = products.find(p => id === p.id);
//     res.send(eachProduct);
// });

app.listen(port, function () {
    console.log(`Server running at: ${port}`);
});