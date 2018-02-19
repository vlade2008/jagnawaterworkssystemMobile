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
import { List,SearchBar,Flex ,WhiteSpace,Icon,WingBlank ,InputItem,Button,DatePicker,Modal,Toast} from 'antd-mobile'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from 'moment'
const { Item } = List
const Brief = Item.Brief;

import { createForm } from 'rc-form'

class ReadingForm extends Component {
  constructor(props){
    super(props);

    let bill =  _.filter(this.props.bill.records, { 'account_no': this.props.navigation.state.params });
    this.state = {
      previous_reading:!_.isEmpty(bill) ? bill[0].current_reading : 0,
      isNotBill:_.isEmpty(bill) ? true : false,
      billID:!_.isEmpty(bill) ? bill[0].id : {},
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
        let idInitial = this.props.readings.records.length + 2;
        let billInitialId = this.props.bill.records.length + 2;

        values.current_reading = parseInt(values.current_reading)
        values.meter_number = parseInt(values.meter_number)
        values.previous_reading = parseInt(values.previous_reading)
        values.reading_date = moment().format()
        values.read_by = this.props.auth.activeAuth.id
        values.account_no = this.props.navigation.state.params

        this.props.authAction.insertReading(this.state.billID,billInitialId,this.state.isNotBill,idInitial,this.state.status,values,()=>{
          Toast.success('Record success !!!', 1);
          this.props.authAction.getConsumers(this.state.status);
          this.props.authAction.getReading(this.state.status);
          this.props.authAction.getBill(this.state.status)
          this.props.navigation.goBack();
        })

			} else {
        Modal.alert('Warning', 'Please fill up required form and check the Previous Reading', [
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
								message: 'Service Period End!',
							},
						],
					})(<InputItem  type={'string'} autoCorrect={false} placeholder="Service Period End" />)}
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
      bill:state.bill,
      auth:state.auth,
      readings:state.readings
    }
}

function mapDispatchToProps(dispatch) {
    return {
      authAction: bindActionCreators(authAction, dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(createForm()(ReadingForm));
