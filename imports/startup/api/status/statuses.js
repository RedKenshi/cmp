import { Mongo } from 'meteor/mongo';

const Statuses = new Mongo.Collection("statuses");

export default Statuses;