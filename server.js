import express from 'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt';

const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: '',
		password: '',
		database: 'smart-brain'
	}
})

const app = express()
const saltRounds = 10

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
	res.send('success')
})

app.post('/signin', (req, res) => {
	db.select('email', 'hash').from('login')
		.where('email', '=', req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
			if (isValid) {
				db.select('*').from('users')
					.where('email', '=', req.body.email)
					.then(user => {
						res.json(user[0])
					})
					.catch(err => res.status(400).json('unable to get user'))
			} else {
				res.status(400).json('wrong credentials')
			}
		})
		.catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
	const { email, name, password} = req.body

	db.transaction(trx => {
		bcrypt.hash(password, saltRounds, (err, hash) => {
			if (err) {
				trx.rollback

				res.status(400).json('unable to register')
			} else {
				trx.insert({
					hash: hash,
					email: email
				})
				.into('login')
				.returning('email')
				.then( loginEmail => {
					return trx('users')
					.returning('*')
					.insert({
						name: name,
						email: loginEmail[0].email,
						joined: new Date()
					})
					.then(users => {						
						res.json(users[0])
					})
				})
				.then(trx.commit)
				.catch(err => {
					trx.rollback
					console.log(err)

					res.status(400).json('unable to register')
				})
			}
		})
	})
	.catch(err => res.status(400).json('unable to register'))
})


app.get('/profile/:id', (req, res) => {
	const { id } = req.params
	db.select('*').from('users').where({ id })
	.then(user => {
		if (user.length) {
			res.json(user[0])
		} else {
			res.status(400).json('not found')
		}
	})
	.catch(err => res.status(400).json('error getting user'))
})


app.put('/image', (req, res) => {
	const { id } = req.body
	
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then( data => {
		res.json(data[0].entries)
	})
	.catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3000, ()=> {
	console.log('HI There!! app is runnin on port 3000')
})

