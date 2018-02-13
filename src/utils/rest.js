import axios from 'axios'
import _ from 'lodash'
import { AsyncStorage } from 'react-native'

export const setHost = (host) =>{
  return host
}

async function getApiKey() {
	const value = await AsyncStorage.getItem('api_key')
	let response
	if (value !== null) {
		response = value
	}

	return response
}

export const gethost = (host) =>{
  return `http://${host}:8080`
}


export const get = (path, config = {}) =>
	new Promise((resolve, reject) => {
		getAuthorization()
			.then(apikey => {
				const payload = Object.assign(config, {
					headers: {
						'Content-Type': 'application/json;charset=UTF-8',
            'Authorization':apikey
					},
				})

				axios
					.get(`${gethost()}${path}`, payload)
					.then(response => {
						resolve(response)
					})
					.catch(error => {
						reject(error)
					})
			})
			.catch(error => {
				reject(error)
			})
	})
