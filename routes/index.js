const express = require('express')
const router = express.Router()  
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const User = require('../public/scripts/mongo.js');





// pages routes
router.get('/', function(req,res){res.render('dashboard', {title: 'Class Attendance Tracking System'})})
router.get('/login', function(req,res){res.render('login',{title: 'Login page'})})
router.get('/account', function(req,res){res.render('account', {title: 'Login page'})})

// lecturers routes
router.get('/lecturer', function(req,res){res.render('lecturerHome', {title: 'Welcome Lecturer'})})
router.get('/lecturer/register-units', function(req,res){res.render('registerUnits', {title: 'Units'})})

router.get('/session', function(req,res){res.render('session', {title: 'Class'})})

// student's route
router.get('/student', function(req,res){res.render('index', {title: 'Welcome student'})})

router.post ('/account',[
    
    body('email')
    .isEmail()
    .normalizeEmail(),

    body('user_id')
    .not().isEmpty().withMessage('This field cannot be empty')
    .trim()
    .escape(),
    sanitizeBody('notifyOnReply').toBoolean(),

    // password must contain 8 characters and at least a number
    body('password')
    .isLength({
        min: 8
    }).withMessage('must be at least 8 chars long')
    .matches(/\d/).withMessage('must contain a number'),

    // checking if passwordConfirmation matches password
    body('passwordConfirmation')
    .custom((value, { req }) => value === req.body.password).withMessage('password confirmation does not match password')
], function (req, res) {
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
            confirm_password: req.body.confirm_password
        };
        User.create(newUser, function (err, user) {
            if (err) {
                console.log(err);                
            }
            user.save((err) => {
                return res.redirect('/account');
             });
        })
        console.log(newUser);  
    }
})

router.post ('/account', function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    } else {
        let newUnit = {
            code: req.body.code,
            name: req.body.name,
        };
        Unit.create(newUnit, function (err, unit) {
            if (err) {
                console.log(err);                
            }
            unit.save((err) => {
                return res.redirect('/account');
                });
        })
        console.log(newUser);  
    }
})
module.exports = router