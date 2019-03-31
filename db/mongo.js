let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 12


// schema to register new user
const usersSchema = new Schema({
  user_id: String, 
  email: String, 
  password: String, 
  role: String
});

usersSchema.pre('save', function(next) {
  let user = this
  console.log(user);
  

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(saltRounds, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);

          user.password = hash;
          console.log(user);
          
          next();
      });
  });
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
  // _id: { type: String },
  unit: String,
  lecturer: String,
  student: [{type: String}],
  time: String,
  latitude: String,
  longitude: String,
  radius: String
});

let Session = mongoose.model('Session', classSchema)

module.exports = {
  Users: Users,
  Units: Units,
  Session: Session
};

  