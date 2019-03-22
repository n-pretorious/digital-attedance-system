let mongoose = require('mongoose');
let Schema = mongoose.Schema;
// const bcrypt = require('bcrypt');

// schema to register new user
const usersSchema = new Schema({
  user_id: String, 
  email: String, 
  password: String, 
  confirm_password: String
});

// usersSchema.pre('save', function (next) {
//   const user = this
//   // bcrypt.hash(user, 10, function (err, hash) {
//     if (err) {
//       console.log(err);
//     }
//     user.password = hash
//     user.confirm_password = hash
//     // user.confirm_password = hash
//     next()
//   })
// })

let Users =  mongoose.model('Users', usersSchema);

// schema to register new unit
const unitsSchema = new Schema({
  code : String, 
  name: String, 
});

let Units =  mongoose.model('Units', unitsSchema);

// schema of a new class
const classSchema = new Schema({
  // _id: { type: String },
  unit: String,
  lecturer: String,
  student: [{
    type: String
  }],
  time: String
});

let Session = mongoose.model('Session', classSchema)

module.exports = {
  Users: Users,
  Units: Units,
  Session: Session
};

  