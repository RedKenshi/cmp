import { Mongo } from 'meteor/mongo';

const StatusFields = new Mongo.Collection("statusValues");

export default StatusFields;