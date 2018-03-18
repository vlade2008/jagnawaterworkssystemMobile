import React, { Component } from 'react';
import { StyleSheet, View ,FlatList,NetInfo,RefreshControl} from 'react-native';
import { connect } from 'react-redux';
import LoginStatusMessage from './LoginStatusMessage';
import AuthButton from './AuthButton';
import {bindActionCreators} from 'redux';
import { gethost } from '../utils/rest'
import Realm from '../datastore'
import _ from 'lodash'
import * as authAction from '../actions/authAction';
import { List,Text,SearchBar,ActivityIndicator,Toast,Flex } from 'antd-mobile'
const { Item } = List
const Brief = Item.Brief;
import { computeSize } from '../utils/DeviceRatio'

import { NavigationActions } from 'react-navigation'


class MainScreen extends Component {
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

  handleConnectionChange = (isConnected) => {
          this.setState({ status: isConnected })


  }

  onRefresh = () =>{
    this.props.authAction.getConsumers(this.state.status);
    this.props.authAction.getBill(this.state.status)
    this.props.authAction.SyncAllReading(this.state.status,()=>{
      Toast.success('Success Updated!!!', 1);
    })
  }

  consumersSelect = (rowData) =>{
     this.props.navigation.navigate('Reading',rowData.account_no)
  }


  renderItem = (rowData) =>{
    return(
      <Item multipleLine onClick={() => this.consumersSelect(rowData)} >
        <Flex>
          <Flex.Item>
            <View>
              <Text>ID: {rowData.meter_number}</Text>
              <Text style={{ fontSize: computeSize(50) }}>{rowData.fullname}</Text>
              <Brief>{rowData.address}</Brief>
            </View>
          </Flex.Item>
        </Flex>

  		</Item>
    )
  }

  _keyExtractor = (item, index) => item.account_no


  onInputSearch = (value) =>{
    this.setState({
      value:value
    })
  }


onSubmit = () =>{
  const searchText  = this.state.value;

  if (_.isEmpty(searchText)) {
    this.props.authAction.getConsumers(this.state.status)
  }else {
     const reg = new RegExp(searchText, 'gi');

     let data = this.props.consumers.records.map((record,i)=>{
       const match = record.allFilter.match(reg);
       if (!match) {
         return null;
       }
       return {
         ...record
       }

     }).filter(record => !!record)


     this.props.authAction.getAllConsumers(data)
  }
}



  render(){
    return(
      <View style={{flex:1}}>
        <ActivityIndicator
            toast
            text="Loading..."
            animating={this.props.consumers.syncLoad}
          />
        <SearchBar
           value={this.state.value}
           placeholder="Search"
           onChange={this.onInputSearch}
           onSubmit={this.onSubmit}
         />
        <FlatList
					data={this.props.consumers.records}
					renderItem={({ item }) => this.renderItem(item)}
					keyExtractor={this._keyExtractor}
          refreshControl={
                       <RefreshControl
                           refreshing={this.props.consumers.loading}
                           onRefresh={this.onRefresh}
                           title="Loading..."
                           />
                   }
				/>


      </View>
    )
  }
}

function mapStateToProps(state) {
    return {
      consumers:state.consumers,
      auth:state.auth,
      readings:state.readings
    }
}

function mapDispatchToProps(dispatch) {
    return {
      authAction: bindActionCreators(authAction, dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(MainScreen);
