const clarifaiRequestOptions = (imageUrl) => {
	// Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = 'cc08868814e548639357740919a84e97';
    const USER_ID = 'eza36f2gyx3k';       
    const APP_ID = 'my-first-application';
    const MODEL_ID = 'face-detection';   
    const IMAGE_URL = imageUrl;

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

	return  {
		modelId: MODEL_ID,
		requestOptions: requestOptions
	}
}

export default clarifaiRequestOptions
