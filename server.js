import express from 'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt';

import handleSignin from './controllers/signin.js';
import handleRegister from './controllers/register.js';
import handleProfileGet from './controllers/profile.js';
import { handleImageUrl , handleImage } from './controllers/image.js';

// ENTER YOUR DB CONNECTION HERE
const db = knex({
	client: 'pg',
	connection: {
		host: process.env.DB_HOST,
		user: process.env.DB_NAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		ssl: true
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

