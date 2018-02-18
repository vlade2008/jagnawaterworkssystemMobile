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
import { List,SearchBar,Flex ,WhiteSpace,Icon,WingBlank ,InputItem,Button,DatePicker,Modal} from 'antd-mobile'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const { Item } = List
const Brief = Item.Brief;

import { createForm } from 'rc-form'

class ReadingForm extends Component {
  constructor(props){
    super(props);

    let bill =  _.filter(this.props.bill.records, { 'account_no': this.props.navigation.state.params });
    this.state = {
      previous_reading:!_.isEmpty(bill) ? bill[0].current_reading : 0
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




  checkReading = (rule,value,callback) =>{
        if (value >= this.state.previous_reading) {
          callback();
          return;
        }
        callback('The current reading must not lower of Previous reading')
    }

  onSubmit = () =>{
    this.props.form.validateFields((err, values) => {
			if (!err) {
        console.log(values);
			} else {
        Modal.alert('Warning', 'Please fill up required form', [
					{ text: 'OK', onPress: () => console.log('ok'), style: 'default' },
				])
			}
	  })
  }




  render(){

		const { getFieldDecorator } = this.props.form

    return(
      <View style={{flex:1,backgroundColor: '#fff'}}>
        <KeyboardAwareScrollView>
          <WhiteSpace size={'lg'} />
          <WingBlank>
						<Text style={{ fontSize: 20, fontWeight: 'bold' }}>Service Period End</Text>
					</WingBlank>
					{getFieldDecorator('service_period_end', {
						rules: [
							{
								required: true,
								type: 'string',
								message: 'Service Period End!',
							},
						],
					})(<InputItem autoCorrect={false} placeholder="Service Period End" />)}
          <WhiteSpace size={'lg'} />

          <WingBlank>
						<Text style={{ fontSize: 20, fontWeight: 'bold' }}>Meter Number</Text>
					</WingBlank>
					{getFieldDecorator('meter_number', {
						rules: [
							{
								required: true,
								message: 'Meter Number!',
							},
						],
					})(<InputItem  type={'number'} autoCorrect={false} placeholder={'Meter Number'} />)}
          <WhiteSpace size={'lg'} />
          <WingBlank>
						<Text style={{ fontSize: 20, fontWeight: 'bold' }}>Current Reading</Text>
					</WingBlank>
					{getFieldDecorator('current_reading', {
						rules: [
							{
								required: true,
								message: 'Current Reading!',
                validator:this.checkReading
							},
						],
					})(<InputItem type={'number'} autoCorrect={false} placeholder={'Current Reading'} />)}

          <WhiteSpace size={'lg'} />
          <WingBlank>
						<Text style={{ fontSize: 20, fontWeight: 'bold' }}>Previous Reading</Text>
					</WingBlank>
					{getFieldDecorator('previous_reading', {
            initialValue:this.state.previous_reading.toString(),
						rules: [
							{
								required: true,
								message: 'Previous Reading!',
							},
						],
					})(<InputItem  type={'number'} autoCorrect={false} placeholder={'Previous Reading'} editable={false}/>)}


        </KeyboardAwareScrollView>

        <Button
          type="primary"
          style={{
              bottom: 0,
              height: 47,
              justifyContent: 'center',
            }}
          onClick={this.onSubmit}
          >
            Save
          </Button>
      </View>
    )
  }
}


function mapStateToProps(state) {
    return {
      bill:state.bill
    }
}

function mapDispatchToProps(dispatch) {
    return {
      authAction: bindActionCreators(authAction, dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(createForm()(ReadingForm));
