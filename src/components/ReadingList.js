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
import { List,SearchBar,Flex ,WhiteSpace,Icon ,WingBlank,Button} from 'antd-mobile'
import moment from 'moment'
const { Item } = List
const Brief = Item.Brief;

class ReadingList extends Component {
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
    this.props.authAction.getReading(this.state.status);
    this.props.authAction.getBill(this.state.status)
  }


  renderItem = (rowData) =>{
    return(
      <Item multipleLine>
        <Flex>
          <Flex.Item>
            <View>
              <Text style={{ color: 'gray' }}>Date</Text>
              <WhiteSpace/>
              <Text>{moment(rowData.reading_date).format('YYYY/MM/DD')}</Text>
            </View>
          </Flex.Item>
          <WhiteSpace/>
          <Flex.Item>
            <View>
              <Text style={{ color: 'gray' }}>Previous</Text>
              <WhiteSpace/>
              <Text>{rowData.previous_reading}</Text>
            </View>
           </Flex.Item>
           <WhiteSpace/>
          <Flex.Item>
            <View>
              <Text style={{ color: 'gray' }}>Current</Text>
              <WhiteSpace/>
              <Text>{rowData.current_reading}</Text>
            </View>
           </Flex.Item>
           <WhiteSpace/>
          <Flex.Item>
            <View>
              <Text style={{ color: 'gray' }}>Status</Text>
              <WhiteSpace/>
              <Text><Icon type={rowData.status == 1 ? '\ue630' : '\ue62e'} color={rowData.status == 1 ? '#21b68a':'#f96268'} /></Text>
            </View>
          </Flex.Item>
        </Flex>
      </Item>

    )
  }

  _keyExtractor = (item, index) => item.id


  onInputSearch = (value) =>{
    this.setState({
      value:value
    })
  }

  newReading = () =>{
    this.props.navigation.navigate('ReadingForm',this.props.navigation.state.params)
  }




  render(){

    let data = _.filter(this.props.readings.records, { 'account_no': this.props.navigation.state.params });
    let consumers = _.filter(this.props.consumers.records, { 'account_no': this.props.navigation.state.params });
    return(
      <View style={{flex:1}}>
        <View style={{ backgroundColor: 'white' }}>
    				<WingBlank>
    					<WhiteSpace size={'lg'} />
    					<View style={{ flexDirection: 'row' }}>
    						<View style={{ marginLeft: 10 }}>
    							<Text style={{ fontSize: 20, fontWeight: 'bold' }}>
    								{consumers[0].fullname}
    							</Text>
    							<Text style={{ fontSize: 18 }}>
    								{consumers[0].address}
    							</Text>
    						</View>
    					</View>
    					<WhiteSpace size={'lg'} />
    				</WingBlank>
    			</View>
        {/* <SearchBar
           value={this.state.value}
           placeholder="Search"
           onChange={this.onInputSearch}
         /> */}

        <FlatList
					data={data}
					renderItem={({ item }) => this.renderItem(item)}
					keyExtractor={this._keyExtractor}
				/>

        <Button
          type="primary"
          style={{
							bottom: 0,
							height: 47,
							justifyContent: 'center',
						}}
          onClick={this.newReading}
          >
            New Reading
          </Button>


      </View>
    )
  }
}

function mapStateToProps(state) {
    return {
      consumers:state.consumers,
      readings:state.readings
    }
}

function mapDispatchToProps(dispatch) {
    return {
      authAction: bindActionCreators(authAction, dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ReadingList);
