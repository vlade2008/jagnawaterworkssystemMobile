import React, { Component } from 'react';
import { StyleSheet, View ,FlatList,NetInfo,RefreshControl,Text} from 'react-native';
import { connect } from 'react-redux';
import LoginStatusMessage from './LoginStatusMessage';
import AuthButton from './AuthButton';
import {bindActionCreators} from 'redux';
import { gethost } from '../utils/rest'
import Realm from '../datastore'
import _ from 'lodash'
import * as authAction from '../actions/authAction';
import { List,SearchBar,Flex ,WhiteSpace,Icon,WingBlank ,InputItem,Button} from 'antd-mobile'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const { Item } = List
const Brief = Item.Brief;

import { createForm } from 'rc-form'

class ReadingForm extends Component {
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
      NetInfo.isConnected.removeEventListener('change', this.handleConnectionChange);
  }









  render(){


		const { getFieldDecorator } = this.props.form

    return(
      <View style={{flex:1,backgroundColor: '#fff'}}>
        <KeyboardAwareScrollView>
          <WingBlank>
						<Text style={{ fontSize: 20, fontWeight: 'bold' }}>Service Period End</Text>
					</WingBlank>
					{getFieldDecorator('client_last_name', {
						rules: [
							{
								required: true,
								type: 'string',
								message: 'Please enter Last Name!',
							},
						],
					})(<InputItem autoCorrect={false} placeholder={'Patient Last Name'} />)}
        </KeyboardAwareScrollView>
        
        <Button
          type="primary"
          style={{
              bottom: 0,
              height: 47,
              justifyContent: 'center',
            }}
          >
            Save
          </Button>
      </View>
    )
  }
}


const CreateFormReading = createForm()(ReadingForm)
export default CreateFormReading
