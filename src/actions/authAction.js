import Realm from '../datastore'
import axios from 'axios'
import { get,post } from '../utils/rest'
import _ from 'lodash'
import moment from 'moment'
import Promise from 'bluebird'

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

export let getAllBill = (data)=>{
  return {
         type: "GET_BILL",
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

export let SyncStart =()=>{
    return {
        type: 'SYNC_START'
    }
};
export let SyncEnd =()=>{
    return {
        type: 'SYNC_END'
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

      let dataRealm = Array.from(Realm.objects('consumers'))

      let loadData = _.map(dataRealm,(data,i)=>{
        let values = {};
          values.account_no = data.account_no
          values.address = data.address
          values.fname = data.fname
          values.lname = data.lname
          values.meter_number = data.meter_number
          values.mname = data.mname
          values.fullname = data.fullname
        return values
      })

      dispatch(getAllConsumers(loadData))
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
                // service_period_end:data.service_period_end,
                account_no:data.account_no,
                reading_date:new Date(moment(data.reading_date).format('YYYY/MM/DD')),
                meter_number:data.meter_number,
                current_reading:data.current_reading,
                previous_reading:data.previous_reading,
                status:data.status,
                read_by:data.read_by
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

      let dataRealm = Array.from(Realm.objects('readings'))

      let loadData = _.map(dataRealm,(data,i)=>{
        let values = {};
          values.id = data.id,
          // values.service_period_end = data.service_period_end
          values.account_no = data.account_no
          values.reading_date = data.reading_date
          values.meter_number = data.meter_number
          values.current_reading = data.current_reading
          values.previous_reading = data.previous_reading
          values.status = data.status
          values.read_by = data.read_by
        return values
      })

      dispatch(getAllReadings(loadData))


    }

  }
}

export let getBill = (isConnected) =>{
  return dispatch => {

    if (isConnected) {

      Realm.write(()=>{
        let allBill = Realm.objects('bill')
        Realm.delete(allBill)
      })

      get('/api/monthly-bills')
      .then(response => {
        let newData = [];
        Realm.write(()=>{
          _.map(response.data,(data,i)=>{
              data.status = data.status ? data.status : 0
              Realm.create('bill', {
                id: data.id,
                current_reading:data.current_reading,
                account_no:data.account_no
              })

              newData.push(data)

          })
        })

        dispatch(getAllBill(newData))

      })
      .catch(e => {
        console.log(e,'error')
      })


    }else {

      let dataRealm = Array.from(Realm.objects('bill'))

      let loadData = _.map(dataRealm,(data,i)=>{
        let values = {};
          values.id = data.id,
          values.current_reading = data.current_reading
          values.account_no = data.account_no
        return values
      })

      dispatch(getAllBill(loadData))


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

export let insertReading = (billID,billInitialId,isNotBill,idInitial,isConnected,payload,callback = null) =>{
  return dispatch => {


    if (isConnected) {
      payload.status = true
      post('/api/readings',payload)
        .then(response => {
          Realm.write(()=>{
                Realm.create('readings', {
                  id: response.data.id,
                  // service_period_end:response.data.service_period_end,
                  account_no:response.data.account_no,
                  reading_date:new Date(moment(response.data.reading_date).format('YYYY/MM/DD')),
                  meter_number:response.data.meter_number,
                  current_reading:response.data.current_reading,
                  previous_reading:response.data.previous_reading,
                  status:1,
                  read_by:response.data.read_by
                })
            })
          if (callback) {
            dispatch(callback)
          }
        })
        .catch(e => {
          console.log(e,'error')
        })

    }else {

      Realm.write(()=>{


            payload.status = 0
            Realm.create('readings', {
              id: idInitial,
              // service_period_end:payload.service_period_end,
              account_no:payload.account_no,
              reading_date:new Date(moment(payload.reading_date).format('YYYY/MM/DD')),
              meter_number:payload.meter_number,
              current_reading:payload.current_reading,
              previous_reading:payload.previous_reading,
              status:0,
              read_by:payload.read_by
            })

            if (isNotBill) {
              Realm.create('bill', {
                id: billInitialId,
                current_reading:payload.current_reading,
                account_no:payload.account_no
              })
            }else {
              Realm.create('bill', {
                id: billID,
                current_reading:payload.current_reading
              },true)
            }




        })
        if (callback) {
          dispatch(callback)
        }

    }

  }
}

export let SyncAllReading = (isConnected,callback = null) =>{
  return dispatch => {

    let dataRealm = Array.from(Realm.objects('readings'))

    let loadData = _.map(dataRealm,(data,i)=>{
      let values = {};
        values.id = data.id,
        // values.service_period_end = data.service_period_end
        values.account_no = data.account_no
        values.reading_date = moment(data.reading_date).format()
        values.meter_number = data.meter_number
        values.current_reading = data.current_reading
        values.previous_reading = data.previous_reading
        values.status = data.status
        values.read_by = data.read_by
      return values
    })


    let readingsData = _.filter(loadData,{ 'status': 0});
    if (isConnected) {
      if (!_.isEmpty(readingsData)) {
        dispatch(SyncStart())

        _.map(readingsData,(payload,i)=>{
            delete payload.id;
            payload.status = true
            post('/api/readings',payload)
              .then(response => {
                console.log('proccess');
              })
              .catch(e => {
                console.log(e,'error')
              })

        })
        dispatch(getReading(isConnected))
        dispatch(SyncEnd())
        if (callback) {
          dispatch(callback)
        }


      }else {
        dispatch(getReading(isConnected))
        // if (callback) {
        //   dispatch(callback)
        // }
      }
    }else {
      dispatch(getReading(false))
    }





  }
}
