import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {  StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Button} from 'antd-mobile';
import * as authAction from '../actions/authAction';
import {bindActionCreators} from 'redux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});


class LoginScreen extends Component {
  constructor(props){
    super(props);
  }


  onLogin = () =>{
    // this.props.navigation.dispatch({ type: 'Login' })
    this.props.authAction.login();
  }

  render(){
    return(
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Screen A
        </Text>
        <Text style={styles.instructions}>
          This is great
        </Text>
        <Button
          onClick={this.onLogin}>
            Log in
          </Button>
      </View>
    )
  }
}

function mapStateToProps(state) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return {
        authAction: bindActionCreators(authAction, dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(LoginScreen);
