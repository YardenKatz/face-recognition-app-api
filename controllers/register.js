const handleRegister = (req, res, db, bcrypt, saltRounds) => {
	const { email, name, password } = req.body

	if (!email || !name || !password) {
		return res.status(400).json('incorrect form submission')
	}

	db.transaction(trx => {
		bcrypt.hash(password, saltRounds, (err, hash) => {
			if (err) {
				trx.rollback
				console.log(err)
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
	.catch(err => {
		console.log(err)
		res.status(400).json('unable to register')
	} 
	)
}

export default handleRegister