import axios from 'axios'
import _ from 'lodash'
import { AsyncStorage } from 'react-native'


let host = null
let api_key = null

export const setHost = url => {
	host = url
}

export const setApiKey = key => {
	api_key = key
}

export const gethost = () =>{
  return `http://${host}:8080`
}




export const instance = () =>{

  let instance = axios.create({
    baseURL: gethost(),
    timeout: 1000,
    headers:{
      'Content-Type': 'application/json;charset=UTF-8',
			'Authorization':api_key
    }
  })
  return instance

}

export const get = (path, config) => {
  return instance().get(path, config)
}

export const post = (path,body, config) => {
  return instance().post(path, body || {}, config)
}
