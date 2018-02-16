import {get} from '../utils/rest'

// export let login = ()=>{
//
//   return {
//          type: "Login"
//      }
//
// };

export let login = () => {
    return dispatch => {

      get('/userApi/login',{
            params:{
              username:'admin',
              password:'password',
            }
        }).then((response)=>{

            console.log('success unsay response',response);

        }).catch((error)=>{
          console.log(error,'usna ni siya');
        });

    }
};
