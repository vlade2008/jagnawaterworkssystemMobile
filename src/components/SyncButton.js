import React, { PureComponent } from 'react'
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import { TouchableOpacity,Alert,NetInfo} from 'react-native';
import { gethost,setApiKey } from '../utils/rest'
import { Icon ,WingBlank,Modal,Toast} from 'antd-mobile'
import axios from 'axios'
import _ from 'lodash'
import * as authAction from '../actions/authAction';
const prompt = Modal.prompt;


class SyncButton extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      value:''
    }
  }


  componentDidMount() {
      NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

      NetInfo.isConnected.fetch().done(
        (isConnected) => {
          this.setState({ status: isConnected })
         }
      );
  }

  componentWillUnmount() {
      NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
  }

  handleConnectionChange = (isConnected) => {
          this.setState({ status: isConnected })
  }



  onHandleSync = (username,password) =>{
    if (!_.isEmpty(username) && !_.isEmpty(password)) {
      let payload = {};
      payload.username = username
      payload.password = password
      this.onLoginSync(payload)

    }else {
      Toast.fail('Please fill up all form !!!', 1);
    }
  }

	onSync = () => {
    if (this.state.status) {
      prompt(
            'Login',
            'Please input login',
            [{text:'cancel'},{text:'Submit',onPress:(username,password)=>{this.onHandleSync(username,password)}}],
            'login-password',
            null,
            ['Please input username', 'Please input password'],
          )
    }else {
      Modal.alert('Warning', 'Network connection failed !!!', [
        { text: 'OK', onPress: () => console.log('ok'), style: 'default' },
      ])
    }

	}


  onLoginSync = (data) =>{
    axios.get(gethost()+'/userApi/login', {
      params:{
              username:data.username,
              password:data.password,
            }
    }).then((response) => {
      if (response.data.error) {
          Toast.fail(response.data.message, 1);
      }else {
        setApiKey(response.data.api_key)
        this.props.authAction.SyncAllReading(this.state.status,()=>{
          this.props.authAction.getReading(this.state.status)
          this.props.authAction.getBill(this.state.status)
          this.props.authAction.getConsumers(this.state.status)
          Toast.success('Success Updated!!!', 1);

        })


      }

    }).catch((e) => {
      console.log(e);
      Toast.offline(`Network connection failed !!! ${e}`, 1);
    })
  }

	render() {
		return (
			<TouchableOpacity onPress={this.onSync}>
				<WingBlank>
					<Icon type={'\ue613'} color={'#fff'}  />
				</WingBlank>
			</TouchableOpacity>
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

export default connect(mapStateToProps,mapDispatchToProps)(SyncButton);
