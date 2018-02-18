import update from 'react-addons-update';

const INITIAL_STATE = {
    records:[],
    activeRecord:{},
    loading:false
};

export default function bill(state = INITIAL_STATE, action = {}) {
    switch(action.type) {

        case 'GET_BILL':
          if(action.data == 'clear'){
              return update(state,{
                  records:{
                      $set:{}
                  },
                  activeRecord:{
                      $set:{}
                  }
              });
          }else{
              return update(state,{
                  records:{
                      $set:action.data
                  }
              });
          }


        default:
            return state;
    }
}
