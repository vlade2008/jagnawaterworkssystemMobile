import update from 'react-addons-update';

const INITIAL_STATE = {
    records:[],
    activeRecord:{},
    loading:false
};

export default function consumers(state = INITIAL_STATE, action = {}) {
    switch(action.type) {


        case 'LOAD_CONSUMERS_START':
         return update(state,{
             loading:{
                 $set:true
             }
         });

         case 'LOAD_CONSUMERS_END':
         return update(state,{
             loading:{
                 $set:false
             }
         });

        case 'GET_CONSUMERS':
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

        case 'UPDATE_INPUT_CONSUMERS':
            return update(state,{
                activeRecord:{
                    $merge:action.data
                }
            });


        default:
            return state;
    }
}
