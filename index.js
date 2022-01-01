const express = require('express')
const cors = require('cors');
const app = express()
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hyeto.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

async function run() {
  try {
    await client.connect();
    console.log('database connected successfully');


    const database = client.db('HeroRiders');

    const servicesCollection = database.collection('services');
   


    app.get('/services', async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

     // GET Single service
     app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      console.log('getting specific service', id);
      const query = { _id: ObjectId(id) };
      const services = await servicesCollection.findOne(query);
      console.log(services);
      res.json(services);
    });


 // services GET by orderd from user
 app.get('/services', async (req, res) => {
  const email = req.query.email;
  const query = { email: email }
  const cursor = servicesCollection.find(query);
  const services = await cursor.toArray();
  res.json(services);
})







// service DELETE
app.delete('/services/:id', async (req, res) => {
  const id = req.params.id;
  console.log('delete specific item', id);

  const query = { _id: ObjectId(id) };
  const result = await servicesCollection.deleteOne(query);
  res.json(result);

})






// // PUT: UPDATE specific service
// app.put('/services/:id', async (req, res) => {
//   const id = req.params.id;
//   const updatedUser = req.body;
//   const filter = { _id: ObjectId(id) };
//   const options = { upsert: true };
//   const updateDoc = {
//     $set: {
//       name: updatedUser.name,
//       email: updatedUser.email
//     },
//   };
//   const result = await servicesCollection.updateOne(filter, updateDoc, options)
//   console.log('updating user', id);
//   res.json(result);
// })



  }
  finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello from hero riders!')
})

app.listen(port, () => {
  console.log(`listening at ${port}`)
})
