let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const usersSchema = new Schema({
    user_id: String, 
    email: String, 
    password: String, 
    confirm_password: String
  });

const unitssSchema = new Schema({
  code : String, 
  name: String, 
});

module.exports =  mongoose.model('User', usersSchema);

  