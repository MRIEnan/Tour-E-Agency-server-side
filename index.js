const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fobb8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run(){
    try{

        await client.connect();
        console.log('database connected succesfully')
        const database = client.db('tour-spot');
        const spotsCollection = database.collection('spots');
        const spotBookingCollection = database.collection('spotBooking');


        // GET api
        app.get('/spots',async(req,res)=>{
            const query = {};
            const cursor = spotsCollection.find(query);
            const spots = await cursor.toArray();
            res.send(spots);
        })

        app.get('/spots/:uid',async(req,res)=>{
            const Uid = req.params.uid;
            console.log(Uid);
            const query ={_id: ObjectId(Uid)};
            console.log(query)
            const cursor = await spotsCollection.findOne(query);
            console.log(cursor);
            res.send(cursor)
        })


        app.get('/spotss',async(req,res)=>{
            const country = req.query.country;
            console.log(country);
            const cursor = await spotsCollection.find({'country': country});
            const spotByCountry = await cursor.toArray();
            res.json(spotByCountry)
        })

        // get booked all spots 
        app.get('/spotBooking',async(req,res)=>{
            const query = {};
            const cursor = spotBookingCollection.find(query);
            const spots = await cursor.toArray();
            res.send(spots);
        })

        // get filter spots from booked spots
        app.get('/spotBooking/mySpots', async(req,res)=>{
            const mailQuery = req.query;
            const mail = mailQuery.email;
            console.log(mail);
            const cursor = await spotBookingCollection.find({'email': mail});
            const myBookedSpot = await cursor.toArray();
            console.log(myBookedSpot,'allspot');
            res.json(myBookedSpot);

        })


        // POST api
        app.post('/spotBooking',async(req,res)=>{
            const order = req.body;
            console.log(order)
            const result = await spotBookingCollection.insertOne(order);
            console.log(order,'order');
            res.json(result)
        })

        app.post('/addSpots',async(req,res)=>{
            const spotIn = req.body;
            console.log(spotIn);
            const result = await spotsCollection.insertOne(spotIn);
            console.log(result);
            res.json(result);
        })



        // delete api

        app.delete('/spotBooking/:id',async(req,res)=>{
            const id = req.params.id;
            console.log('delete',id)
            const query = { _id: ObjectId(id)};
            console.log('query',query);
            const result = await spotBookingCollection.deleteOne(query);
            console.log('deleting user with id',result);
            res.json(result);
        })

    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send('getting info from assignment server')
});

app.listen(port,()=>{
    console.log('server connected',port)
});
