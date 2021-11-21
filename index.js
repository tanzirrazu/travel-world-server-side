const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tgypl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
async function run() {
	try {
		await client.connect();
		const database = client.db('worldTravel');
		const toursCollection = database.collection('services');
		const ordersCollection = database.collection('orders');

		// post data from client side
		app.post('/services', async (req, res) => {
			const tours = req.body;
			const result = await toursCollection.insertOne(tours);
			res.send(result);
		});
		// order post
		app.post('/orders', async (req, res) => {
			const result = await ordersCollection.insertOne(req.body);
			res.send(result);
		});
		// get all data from mongodb
		app.get('/services', async (req, res) => {
			const tour = toursCollection.find({});
			const tours = await tour.toArray();
			res.send(tours);
		});
		// get signle data id from mongodb
		app.get('/services/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await toursCollection.findOne(query);
			res.send(result);
		});
	} finally {
		// await client.close();
	}
}
run().catch(console.dir);
// console.log(uri);
app.get('/', (req, res) => {
	res.send('Hello lalal!');
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
