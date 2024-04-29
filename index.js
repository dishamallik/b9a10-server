const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

// artDrawing
// JeVpu8FLMs5HPm5g
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1qpflqd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

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

const artCollection = client.db('artDB').collection('art');
// const artCollection = client.db('artDB').collection('art');

app.get('/art', async(req, res) => {
    const cursor = artCollection.find();
    const result = await cursor.toArray();
    res.send(result);
})

app.get('/art/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await artCollection.findOne(query);
    res.send(result);
})




app.post('/art' , async(req, res)=>{
    const newCraft = req.body;
    console.log(newCraft);
    const result = await artCollection.insertOne(newCraft);
    res.send(result)
})


app.get("/myArt/:email" , async (req, res) => {
  console.log(req.params.email);
  const result = await artCollection.find({ user_Email: req.params.email }).toArray();
  res.send(result);
})



app.delete('/art/:id', async (req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await artCollection.deleteOne(query);
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
    res.send('art craft server is running')
})


app.listen(port, () => {
    console.log(`art craft server is running: ${port}`)

})