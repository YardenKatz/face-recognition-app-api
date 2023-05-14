import { json } from 'express';
import clarifaiRequestOptions from '../config/ClarifaiConfig.js';

const handleImageUrl = (req, res) => {
	const { imageUrl } = req.body 
	const options = clarifaiRequestOptions(imageUrl)

	fetch("https://api.clarifai.com/v2/models/" + options.modelId + "/outputs", options.requestOptions)
	.then(response => response.json())
		.then(response => { 
			res.send(response)
		})
		.catch(err => {
			console.log(err)
			res.status(400).json('cannot process url')
		})
}

const handleImage = (req, res, db) => {
	const { id } = req.body
	
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then( data => {
		res.json(data[0].entries)
	})
	.catch(err => res.status(400).json('unable to get entries'))
}

export {
	handleImageUrl, handleImage
}