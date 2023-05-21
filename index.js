const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.svjagxz.mongodb.net/?retryWrites=true&w=majority`;

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

        const serviceCollection = client.db('toyVichel').collection('products');
        const buyCollection = client.db('toyVichel').collection('buy');
        const categoryCollection = client.db('toyVichel').collection('category');
        app.get('/category', async (req, res) => {
            const cursor = categoryCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/addtoy', async (req, res) => {
            const cursor = serviceCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const options = {
                // Include only the `title` and `imdb` fields in each returned document
                projection: { email: 1, customerName: 1, img: 1, price: 1, url: 1, categori: 1, quantity: 1, details: 1, Rating: 1 },
            };
            const result = await buyCollection.findOne(query, options);
            console.log(result);
            res.send(result);
        })



        app.get('/bookings', async (req, res) => {
            // console.log(req.query.email);
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await buyCollection.find(query).toArray();
            res.send(result)
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            console.log(booking)
            const result = await buyCollection.insertOne(booking);
            res.send(result);
        })


        app.delete('/mybookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await buyCollection.deleteOne(query);
            res.send(result)
        })



        app.get("/mybookings/:email", async (req, res) => {
            console.log(req.params.email);
            const jobs = await buyCollection
                .find({
                    email: req.params.email,
                })
                .toArray();
            res.send(jobs);
        });


        app.get('/mybookingss/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const user = await buyCollection.findOne(query);
            console.log({ id, user });
            res.send(user);
        })

        app.put('/mybookingss/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            console.log(id, user);
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedUser = {
                $set: {
                    name: user.name,
                    email: user.email
                }
            }
            const result = await buyCollection.updateOne(filter, updatedUser, options);
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
    res.send('vehicle is running')
})

app.listen(port, () => {
    console.log(`toy vehicle is running on port ${port}`)
})