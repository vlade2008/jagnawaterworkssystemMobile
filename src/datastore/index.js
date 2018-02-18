'use strict';

import Realm from 'realm';

const UserPrivilegesSchemaObject = {
  name: 'user_privileges',
  primaryKey: 'id',
  properties: {
    id: {type: 'int', default: ''},
    username: {type: 'string', default: ''},
    userlevel: {type: 'string', default: ''},
    password: {type: 'string', default: ''}
  }
}

const ConsumersSchemaObject = {
  name: 'consumers',
  primaryKey: 'account_no',
  properties: {
    account_no: {type: 'int', default: ''},
    fname: {type: 'string', default: ''},
    lname: {type: 'string', default: ''},
    mname: {type: 'string', default: ''},
    meter_number: {type: 'int', default: ''},
    address:{type:'string',default:''},
    fullname:{type: 'string', default: ''}
  }
}


const ReadingSchemaObject = {
  name: 'readings',
  properties: {
    id: {type: 'int', default: ''},
    service_period_end: {type: 'string', default: ''},
    account_no: {type: 'int', default: ''},
    reading_date: {type: 'date', default: ''},
    meter_number: {type: 'int', default: ''},
    current_reading:{type:'int',default:''},
    previous_reading:{type:'int',default:''},
    status:{type:'int',default:''}
  }
}

const BillSchemaObject = {
  name: 'bill',
  primaryKey: 'id',
  properties: {
    id: {type: 'int', default: ''},
    current_reading: {type: 'int', default: ''},
    account_no: {type: 'int', default: ''}
  }
}


class ReadingSchema extends Realm.Object {}
ReadingSchema.schema = ReadingSchemaObject;

class UserPrivilegesSchema extends Realm.Object {}
UserPrivilegesSchema.schema = UserPrivilegesSchemaObject;

class ConsumersSchema extends Realm.Object {}
ConsumersSchema.schema = ConsumersSchemaObject;


class BillSchema extends Realm.Object {}
BillSchema.schema = BillSchemaObject;

export default new Realm({schema: [UserPrivilegesSchema,ConsumersSchema,ReadingSchema,BillSchema]});
