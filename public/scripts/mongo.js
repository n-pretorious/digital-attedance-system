let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// schema to register new user
const usersSchema = new Schema({
  user_id: String, 
  email: String, 
  password: String, 
  confirm_password: String
});

let Users =  mongoose.model('Users', usersSchema);

// schema to register new unit
const unitsSchema = new Schema({
  code : String, 
  name: String, 
});

let Units =  mongoose.model('Units', unitsSchema);

// schema of a new class
const classSchema = new Schema({
  unit: String,
  lecturer: String,
  student: [],
  time: String
});

let Session = mongoose.model('Session', classSchema)

module.exports = {
  Users: Users,
  Units: Units,
  Session: Session
};

  