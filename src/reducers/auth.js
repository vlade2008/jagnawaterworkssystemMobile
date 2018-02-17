import update from 'react-addons-update';
const initialAuthState = {
  isLoggedIn: false,
  activeAuth:{}
};

export default function auth(state = initialAuthState, action) {
  switch (action.type) {

    case 'Login':
      return update(state,{
          isLoggedIn:{
              $set:true
          },
          activeAuth:{
            $set:action.data
          }
      });

    case 'Logout':
      return update(state,{
          isLoggedIn:{
              $set:false
          },
          activeAuth:{
            $set:{}
          }
      });
      
    default:
      return state;
  }
}
