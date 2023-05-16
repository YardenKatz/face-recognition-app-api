import express from 'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt';

import handleSignin from './controllers/signin.js';
import handleRegister from './controllers/register.js';
import handleProfileGet from './controllers/profile.js';
import { handleImageUrl , handleImage } from './controllers/image.js';

// ENTER YOUR DB CONNECTION HERE
console.log('*** DB_NAME: ', process.env.DB_NAME)
console.log('*** DB_HOST: ', process.env.DB_HOST)
console.log('*** DB_USER: ', process.env.DB_USER)

const db = knex({
	client: 'pg',
	connection: {
		connectionString: process.env.DB_CONNECTION_STRING,
		host: process.env.DB_HOST,
		user: process.env.DB_NAME,
		port: 5432,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		ssl: { rejectUnauthorized: false }
	}
})

const app = express()
const saltRounds = 10

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
	res.send('success')
})
app.post('/signin', (req, res) => { handleSignin(req, res, db, bcrypt)})
app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt, saltRounds)})
app.get('/profile/:id', (req, res) => { handleProfileGet(req, res, db)})
app.post('/imageurl', (req, res) => { handleImageUrl(req, res)})
app.put('/image', (req, res) => { handleImage(req, res, db)})

app.listen(3000, ()=> {
	console.log('HI There!! app is runnin on port 3000')
})

