import update from 'react-addons-update';

const INITIAL_STATE = {
    records:[],
    activeRecord:{},
    loading:false
};

export default function readings(state = INITIAL_STATE, action = {}) {
    switch(action.type) {

        case 'GET_READINGS':
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

        case 'UPDATE_INPUT_READINGS':
            return update(state,{
                activeRecord:{
                    $merge:action.data
                }
            });


        default:
            return state;
    }
}
