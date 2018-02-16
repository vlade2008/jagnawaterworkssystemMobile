import axios from 'axios'
import _ from 'lodash'
import { AsyncStorage } from 'react-native'


let host = null

export const setHost = url => {
	host = url
}

export const gethost = () =>{
  return `http://${host}:8080`
}


export const instance = () =>{

  let instance = axios.create({
    baseURL: gethost(),
    timeout: 1000,
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
  return instance

}

export const get = (path, config) => {
  return instance().get(path, config)
}


// async function getAuthorization() {
// 	const value = await AsyncStorage.getItem('api_key')
// 	let response
// 	if (value !== null) {
// 		response = value
// 	}
//
// 	return response
// }




// export const get = (path, config = {}) =>
// 	new Promise((resolve, reject) => {
// 		getAuthorization()
// 			.then(apikey => {
// 				const payload = Object.assign(config, {
// 					headers: {
// 						'Content-Type': 'application/json;charset=UTF-8',
//             'Authorization':apikey
// 					},
// 				})
//
// 				axios
// 					.get(`${gethost()}${path}`, payload)
// 					.then(response => {
// 						resolve(response)
// 					})
// 					.catch(error => {
// 						reject(error)
// 					})
// 			})
// 			.catch(error => {
// 				reject(error)
// 			})
// 	})
