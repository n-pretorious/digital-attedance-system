const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator/check');
const models = require('../db/mongo');
const sanitize = require('../middleware/sanitize')
const verifyToken = require('../middleware/auth');
const ClassController = require('../controllers/class')
const UserController = require('../controllers/user')





// pages routes
router.get('/signup', (req,res) => {res.render('signup',{title: 'Signup page'})})
router.get('/login', (req,res) => {res.render('login', {title: 'Login page'})})

// lecturers routes
router.get('/views/lecturerHome',  (req,res) => {res.render('lecturerHome')})
router.get('/lecturer',  (req,res) => {res.render('lecturerHome', {title: 'Welcome Lecturer'})})
router.get('/lecturer/startClass', (req,res) => {
    models.Units.find({}, function (err, data) {
        res.render('startClass', {
            title: 'Set up a class',
            data: data,
        })
    })
})
router.get('/lecturer/endClass', (req,res) => {res.render('endClass')})
router.get('/lecturer/reports',  (req,res) => {
    models.Session.find({}, function (err, data) {
        res.render('report', {
            title: 'Lectures report',
            data: data,
        })
    })
})

// students routes


router.get('/student',  (req,res) => {res.render('studentHome', {title: 'Welcome Student'})})
router.get('/student/class', (req,res) => {
    models.Session.find({}, function (err, data) {
        res.render('studentClass', {
            title: 'Welcome To a Class',
            data: data,
        })
    })
})

// register units to system
router.get('/register-units', (req,res) => {res.render('registerUnits', {title: 'Units'})})

router.get('/session', (req,res) => {res.render('session', {title: 'Class'})})

// student's route
router.get('/student', (req,res) => {res.render('index', {title: 'Welcome student'})})

router.post ('/signup', sanitize, UserController.user_signup)

router.post('/login', sanitize, UserController.user_login)

// post new unit
router.post ('/register-units', (req, res) => {
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

// begin a lecture 
router.post ('/lecturer/class', ClassController.class_lecturer)

// students to join lecturers
router.post ('/student/class', ClassController.class_student_join)


module.exports = router