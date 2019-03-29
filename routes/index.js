const express = require('express')
const router = express.Router()  
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')
const models = require('../db/mongo')



// pages routes
router.get('/', function(req,res) {res.render('dashboard', {title: 'Class Attendance Tracking System'})})
router.get('/login', function(req,res) {res.render('login',{title: 'Login page'})})
router.get('/account', function(req,res) {res.render('account', {title: 'Login page'})})

// lecturers routes
router.get('/lecturer', function(req,res) {res.render('lecturerHome', {title: 'Welcome Lecturer'})})
router.get('/lecturer/class', function(req,res){
    models.Units.find({}, function (err, data) {
        res.render('class', {
            title: 'Welcome To a Class',
            data: data,
        })
    })
})

// students routes
router.get('/student', function(req,res) {res.render('studentHome', {title: 'Welcome Student'})})
router.get('/student/class', function(req,res) {
    models.Session.find({}, function (err, data) {
        res.render('studentClass', {
            title: 'Welcome To a Class',
            data: data,
        })
    })
})

// register units to system
router.get('/register-units', function(req,res) {res.render('registerUnits', {title: 'Units'})})

router.get('/session', function(req,res) {res.render('session', {title: 'Class'})})

// student's route
router.get('/student', function(req,res){res.render('index', {title: 'Welcome student'})})

// post new user
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
    // body('passwordConfirmation')
    // .custom((value, { req }) => value === req.body.password).withMessage('password confirmation does not match password')
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
        models.Users.create(newUser, function (err, user) {
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

// post new unit
router.post ('/register-units', function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    } else {
        let newUnit = {
            code: req.body.code,
            name: req.body.name
        };
        models.Units.create(newUnit, function (err, unit) {
            if (err) {
                console.log(err);                
            }
            unit.save((err) => {
                return res.redirect('/register-units');
            });
        })
        console.log(newUnit);
    }
})

// post class details
router.post ('/lecturer/class', function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    } else {
        let newClass = {
            unit: req.body.viewUnits,
            lecturer: req.body.lecturer,
            student: req.body.student,
            startTime: req.body.time,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            radius: req.body.radius
        };

        models.Session.create(newClass, function (err, lecture) {
            if (err) {
                console.log(err);                
            }

            lecture.save((err) => {
                //  return res.redirect('/lecturer/class');
            });
        })
        console.log(newClass);
    }
})

router.post ('/student/class', function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    } else {
        models.Session.findById( req.body._id, function (err, session, next) {

              //test whether a student is within class dimention
            const center = {
                lat: parseFloat(session.latitude), 
                lon: parseFloat(session.longitude)
            }
            const radius = parseInt(session.radius) // meters

            if (geolocationUtils.insideCircle({lat: parseFloat(req.body.latitude), lon: parseFloat(req.body.longitude)}, center, radius) === true) {
                console.log('within radius')
                session.student.push(req.body.student)
                session.save();
                // console.log(session);
                // console.log(req.body)

            }else{
                console.log('outside radius');
                return res.status(500).json({
                    message: 'failed to join because you are outside the reach of your class'
                })
            }
        })
    }
})

    module.exports = router