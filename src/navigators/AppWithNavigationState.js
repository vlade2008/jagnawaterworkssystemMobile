import React from 'react';
import {TouchableOpacity,Text} from "react-native";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator,NavigationActions } from 'react-navigation';

import LoginScreen from '../components/LoginScreen';
import MainScreen from '../components/MainScreen';
import ProfileScreen from '../components/ProfileScreen';
import ReadingList from '../components/ReadingList';
import ReadingForm from '../components/ReadingForm';
import { addListener } from '../utils/redux';

import {Modal} from 'antd-mobile'
const alert = Modal.alert;

const resetActionToDashboard = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({routeName: 'Login'})
    ]
});


export const AppNavigator = StackNavigator({
  Login: {
    screen: LoginScreen ,
    navigationOptions: ({navigation}) => ({
           title: 'Login',
       })
  },
  Reading: {
    screen: ReadingList ,
    navigationOptions: ({navigation}) => ({
           title: 'Reading',
       })
  },
  ReadingForm: {
    screen: ReadingForm ,
    navigationOptions: ({navigation}) => ({
           title: 'New Reading',
       })
  },
  Main: {
     screen: MainScreen,
     navigationOptions: ({navigation}) => ({
            title: 'Consumers',
            headerLeft: null,
            headerRight: (
                <TouchableOpacity
                    style={{paddingHorizontal: 10}}
                    onPress={()=>{
                        alert('Delete', 'Are you to logout???', [
                         { text: 'Cancel', onPress: () => console.log('cancel'), style: 'default' },
                         { text: 'OK', onPress: () =>  navigation.dispatch((resetActionToDashboard))},
                       ])
                    }}
                    >
                    <Text style={{fontSize: 18}}>Logout</Text>
                </TouchableOpacity>
            )
        })
    },
  Profile: { screen: ProfileScreen },
});






















class AppWithNavigationState extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
  };

  render() {
    const { dispatch, nav } = this.props;
    return (
      <AppNavigator
        navigation={addNavigationHelpers({
          dispatch,
          state: nav,
          addListener,
        })}
      />
    );
  }
}


function mapStateToProps(state) {

    return {
        nav: state.nav
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AppWithNavigationState);
