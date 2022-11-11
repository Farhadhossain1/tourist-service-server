const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.i3zzbr1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const serviceCollection = client.db("touristGuide").collection("services");
        const reviewCollection = client.db("touristGuide").collection("reviews")

        app.get('/limitServices', async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const threeService = await cursor.limit(3).toArray();
            res.send(threeService);
        })

        app.get('/services', async(req, res)=>{
            const query = {};
            const cursor  = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get("/service/:id", async(req, res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        app.post('/reviews' , async(req, res)=>{
            const review = req.body;
           const result = await reviewCollection.insertOne(review);
           res.send(result);
        })

        app.get("/reviews", async(req, res)=>{
            let query = {};
            if(req.query.title){
                query = {
                    title : req.query.title
                }
            }
            console.log(req.query)
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
    }
    finally{

    }
}
run().catch(e => console.error(e));












app.get('/', (req, res)=>{
    res.send("Tourist Guide Data To Be Ready Soon !!!!!!")
})

app.listen(port, ()=>{
    console.log(`Your PORT--------------->${port}`);
})