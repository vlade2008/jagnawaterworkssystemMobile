import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {  StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import * as authAction from '../actions/authAction';
import {bindActionCreators} from 'redux';
import { setHost,gethost } from '../utils/rest'
import axios from 'axios'
import { Toast ,WingBlank,InputItem,Text,Button} from 'antd-mobile';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import _ from 'lodash'


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
      username:'',
      password:''

    }
  }


  onLogin = () =>{
    setHost('localhost')
    axios.get(gethost()+'/userApi/login', {
      params:{
              username:this.state.username,
              password:this.state.password,
            }
    }).then((response) => {
      if (response.data.error) {
          Toast.fail(response.data.message, 1);
      }else {
        Toast.success('Load success !!!', 1);
        // this.props.navigate
      }

    }).catch((e) => {
      Toast.offline(`Network connection failed !!! ${e}`, 1);
    })
  }

  onSubmuit =() =>{
    if (!_.isEmpty(this.state.username) || !_.isEmpty(this.state.password)) {
      this.onLogin();
    }else {
      Toast.fail('Please fill up all form !!!', 1);
    }
  }

  onFieldUpdate = (field, value) => {
		this.setState({ [field]: value })
	}

  render(){
    return(
      <KeyboardAwareScrollView contentContainerStyle={{flex: 1, justifyContent: 'center',flexDirection: 'column'}}>
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

            <Button onClick={this.onLogin}>
                Log in
            </Button>


					</WingBlank>



      </View>
      </KeyboardAwareScrollView>
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
