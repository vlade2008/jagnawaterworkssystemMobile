import Realm from '../datastore'
import axios from 'axios'
import { get } from '../utils/rest'
import _ from 'lodash'
import moment from 'moment'

export let loginSuccess = (data)=>{
  return {
         type: "Login",
         data:data
     }
};

export let getAllConsumers = (data)=>{
  return {
         type: "GET_CONSUMERS",
         data:data
     }
};

export let getAllReadings = (data)=>{
  return {
         type: "GET_READINGS",
         data:data
     }
};


export let loadingConsumersStart =()=>{
    return {
        type: 'LOAD_CONSUMERS_START'
    }
};
export let loadingConsumersEnd =()=>{
    return {
        type: 'LOAD_CONSUMERS_END'
    }
};

export let getConsumers = (isConnected) =>{
  return dispatch => {

    dispatch(loadingConsumersStart())
    if (isConnected) {

      Realm.write(()=>{
        let allConsumers = Realm.objects('consumers')
        Realm.delete(allConsumers)
      })


      get('/api/consumers')
      .then(response => {
        dispatch(loadingConsumersEnd())
        let newData = [];
        Realm.write(()=>{
          _.map(response.data,(data,i)=>{
              data.fullname = data.lname+" "+data.fname+" "+data.mname;
              Realm.create('consumers', {
                account_no: data.account_no,
                address: data.address,
                fname:data.fname,
                lname:data.lname,
                meter_number:data.meter_number,
                mname:data.mname,
                fullname:data.fullname
              })
              newData.push(data)
          })
        })

        dispatch(getAllConsumers(newData))

      })
      .catch(e => {
        dispatch(loadingConsumersEnd())
        console.log(e,'error')
      })


    }else {
      dispatch(loadingConsumersEnd())
      let dataConsumers = _.values(Realm.objects('consumers'));
      dispatch(getAllConsumers(dataConsumers))
    }
  }
}

export let getReading = (isConnected) =>{
  return dispatch => {

    if (isConnected) {

      Realm.write(()=>{
        let allReadings = Realm.objects('readings')
        Realm.delete(allReadings)
      })

      get('/api/readings')
      .then(response => {
        let newData = [];
        Realm.write(()=>{
          _.map(response.data,(data,i)=>{
              data.status = data.status ? data.status : 0
              Realm.create('readings', {
                id: data.id,
                service_period_end:data.service_period_end,
                account_no:data.account_no,
                reading_date:new Date(moment(data.reading_date).format('YYYY/MM/DD')),
                meter_number:data.meter_number,
                current_reading:data.current_reading,
                previous_reading:data.previous_reading,
                status:data.status
              })

              newData.push(data)

          })
        })

        dispatch(getAllReadings(newData))

      })
      .catch(e => {
        console.log(e,'error')
      })


    }else {
      let dataReadings = _.values(Realm.objects('readings'));
      dispatch(getAllReadings(dataReadings))
    }

  }
}

export let insertUser = (data) =>{
  return dispatch => {
    Realm.write(()=>{
          Realm.create('user_privileges', {
            id: data.id,
            username:data.username,
            password:data.password
          })
    })
  }
}
