const models = require('../db/mongo')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { validationResult } = require('express-validator/check')

exports.user_signup = (req, res) => {
    // models.Users.findOne({email : req.body.email}, (err, data) => {
    //      if (data.length > 1) {
    //         return res.status(409).json({
    //             message: "Email exists"
    //           });
    //      } else {}
    // })

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    } else {
        let newUser = {
            user_id: req.body.user_id,
            email: req.body.email,
            password: req.body.password,
            confirm_password: req.body.confirm_password,
            role: req.body.role
        };
        models.Users.create(newUser, function (err, user) {
            if (err) {
                console.log(err);                
            }
            try {
                user.save(() => {
                    return res.redirect('/signup');
                    });
            } catch (error) {
                console.log(error)
            }

        })
    }        
}

exports.user_login = (req, res, next) => {  
    let user = {
        email : req.body.email,
        password : req.body.password
    }


    models.Users.findOne({email : user.email}, function (err, data) {
        if(err){
            console.log(err)
        }     
        console.log(data)
        console.log(user.password)
        
        console.log(data.password)
        

        bcrypt.compare(user.password, data.password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message : 'Auth failed'
                })
            }
        console.log(result)

            if (result) {                
                const token = jwt.sign(
                    {
                        email: data.email,
                        user_id : data._id
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn : "2h"
                    }

                )
                // return res.status(200).json({
                //     message: "Auth successful",
                //     token: token
                //   });
                if (data.role === "lecturer") {
                    return res.redirect(200,'/lecturer')
                } else if (data.role === "student") {
                    return res.redirect(200, '/student')
                } else {
                    return res.status(401).json({
                        message: 'Unauthorized'
                    })
                }
            }

            // if password is inccorect          
            return res.status(401).json({
                message : 'Auth failed'
            })
        })
    })
}