import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {  StyleSheet, View ,TouchableOpacity , NetInfo} from 'react-native';
import { connect } from 'react-redux';
import * as authAction from '../actions/authAction';
import {bindActionCreators} from 'redux';
import { setHost,gethost,setApiKey } from '../utils/rest'
import axios from 'axios'
import { Toast ,WingBlank,InputItem,Text,Button} from 'antd-mobile';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import _ from 'lodash'

import Realm from '../datastore'


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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

    this.state = {
      username:'admin',
      password:'password',
      count:0,
      host:'192.168.254.103'

    }
  }

  componentDidMount() {
      NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

      NetInfo.isConnected.fetch().done(
        (isConnected) => { this.setState({ status: isConnected }); }
      );
  }

  componentWillUnmount() {
      NetInfo.isConnected.removeEventListener('change', this.handleConnectionChange);
  }

  handleConnectionChange = (isConnected) => {
          this.setState({ status: isConnected });
          console.log(`is connected: ${this.state.status}`);
  }




  onLogin = () =>{
    axios.get(gethost()+'/userApi/login', {
      params:{
              username:this.state.username,
              password:this.state.password,
            }
    }).then((response) => {
      if (response.data.error) {
          Toast.fail(response.data.message, 1);
      }else {


        setApiKey(response.data.api_key)

        let realmUser  = Realm.objects('user_privileges')
        realmUser = _.values(realmUser);
        let result = _.findIndex(realmUser,{ 'username': this.state.username, 'password':this.state.password});

        let data = {};
        data.id = response.data.user.id
        data.username = this.state.username
        data.password = this.state.password
        if (result  == -1) {
          this.props.authAction.insertUser(data);
        }
        this.props.authAction.getConsumers(this.state.status);
        this.props.authAction.SyncAllReading(this.state.status,()=>{
          Toast.success('Updated!!!', 1);
        });
        this.props.authAction.getBill(this.state.status)
        this.props.authAction.loginSuccess(data)
      }

    }).catch((e) => {
      console.log(e);
      Toast.offline(`Network connection failed !!! ${e}`, 1);
    })
  }

  onLoginLocal = () =>{

    let data  = Realm.objects('user_privileges')
    data = _.values(data);

    let result = _.findIndex(data,{ 'username': this.state.username, 'password':this.state.password});
    if (result  != -1) {

      let users = _.filter(data, { 'username': this.state.username, 'password':this.state.password});
      this.props.authAction.loginSuccess(users[0]);


    }else {
        Toast.fail('User does not exist', 1);
    }
  }

  onSubmit =() =>{
    setHost(this.state.host)
    if (!_.isEmpty(this.state.username) && !_.isEmpty(this.state.password)) {
      if (this.state.status) {
        this.onLogin();
      }else {
        this.onLoginLocal();
      }




    }else {
      Toast.fail('Please fill up all form !!!', 1);
    }
  }

  onFieldUpdate = (field, value) => {
		this.setState({ [field]: value })
	}

  onPress = () =>{
    this.setState({
      count: this.state.count+1
    })
  }

  render(){
    return(
      <KeyboardAwareScrollView contentContainerStyle={{flex: 1, justifyContent: 'center',flexDirection: 'column'}}>
        <TouchableOpacity onPress={this.onPress} style={styles.container}>
          <View style={styles.container}>
            <WingBlank>
    						<View
    							style={{
    								backgroundColor: 'white',
    								opacity: 0.5,
    								paddingTop: 10,
    								borderRadius: 10,
    							}}
    						>

                  {
                    this.state.count >= 7 ? (
                      <View>
                      <WingBlank>
        								<Text style={{ fontSize: 20, fontWeight: 'bold' }}>Host</Text>
        							</WingBlank>
        							<InputItem
        								autoCorrect={false}
        								autoCapitalize={'none'}
        								value={this.state.host}
        								onChange={value => this.onFieldUpdate('host', value)}
        								returnKeyType={'next'}
        								placeholder={'Enter host'}
        							/>
                      </View>
                    ): null
                  }

    							<WingBlank>
    								<Text style={{ fontSize: 20, fontWeight: 'bold' }}>Username</Text>
    							</WingBlank>
    							<InputItem
    								autoCorrect={false}
    								autoCapitalize={'none'}
    								value={this.state.username}
    								onChange={value => this.onFieldUpdate('username', value)}
    								returnKeyType={'next'}
    								placeholder={'Enter username'}
    							/>

    							<WingBlank>
    								<Text style={{ fontSize: 20, fontWeight: 'bold' }}>Password</Text>
    							</WingBlank>
    							<InputItem
    								type={'password'}
    								value={this.state.password}
    								onChange={value => this.onFieldUpdate('password', value)}
    								placeholder={'Enter password'}
    							/>
    						</View>

                <Button type="primary" onClick={this.onSubmit}>
                    Log in
                </Button>


    					</WingBlank>



          </View>
      </TouchableOpacity>
      </KeyboardAwareScrollView>
    )
  }
}

function mapStateToProps(state) {
    return {
      readings:state.readings
    }
}

function mapDispatchToProps(dispatch) {
    return {
        authAction: bindActionCreators(authAction, dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(LoginScreen);
