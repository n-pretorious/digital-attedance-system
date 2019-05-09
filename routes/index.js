const express = require('express')
const router = express.Router()
const { validationResult } = require('express-validator/check');
const models = require('../db/mongo');
const sanitize = require('../middleware/sanitize')
const verifyToken = require('../middleware/auth');
const ClassController = require('../controllers/class')
const UserController = require('../controllers/user')





// pages routes
router.get('/signup', (req, res) => { res.render('signup', { title: 'Signup page' }) })
router.get('/login', (req, res) => { res.render('login', { title: 'Login page' }) })

// lecturers routes
router.get('/lecturer', (req, res) => { res.render('lecturerHome', { title: 'Welcome Lecturer' }) })
router.get('/lecturer/add-new-unit', (req, res) => { res.render('registerUnits', { title: 'Add New unit' }) })
router.get('/lecturer/startClass', (req, res) => {
    models.Units.find({}, function (err, data) {
        res.render('startClass', {
            title: 'Set up a class',
            data: data,
        })
    })
})


//  get request to end a class
router.get('/lecturer/endClass', (req, res) => {
    models.Session.find({}, function (err, data) {
        res.render('endClass', {
            title: 'End a class',
            data: data,
        })
        console.log(data)
    })
})



router.get('/student', (req, res) => { res.render('studentHome', { title: 'Welcome Student' }) })
router.get('/student/class', (req, res) => {
    models.Session.find({}, function (err, data) {
        res.render('studentClass', {
            title: 'Welcome To a Class',
            data: data,
        })
        // console.log(data)
    })
})

router.get('/session', (req, res) => { res.render('session', { title: 'Class' }) })

// student's route
router.get('/student', (req, res) => { res.render('index', { title: 'Welcome student' }) })

router.post('/signup', sanitize, UserController.user_signup)

router.post('/login', sanitize, UserController.user_login)




// post new unit
router.post('/lecturer/add-new-unit', (req, res) => {
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
                return res.redirect('/lecturer/startClass');
            });
        })
        console.log(newUnit);
    }
})

// lecturer to delete unit
router.post('/lecturer/delete-unit', (req, res) => {
    models.Units.countDocuments({ code: req.body.code }, (err, result) => {
        if (err) {
            console.log(err)
        } else {

            console.log(result)

            if (result > 0) {
                models.Units.deleteOne({ code: req.body.code }, function (err, result) {
                    if (err) {
                        console.log(err)

                    }
                    else {
                        console.log(result)
                        console.log("Unit has been deleted successfully");
                        res.redirect('/lecturer/add-new-unit');
                    }


                }
                )

            } else {
                console.log('Sorry, No Lectures available')
            }
        }

    })
})


//  get request to delete a unit
router.get('/lecturer/delete-unit', (req, res) => {
    models.Units.find({}, function (err, data) {
        res.render('deleteUnit', {
            title: 'Delete Unit',
            data: data,
        })
        // console.log(data)
    })
})

// lecturer to view report
router.post('/lecturer/reports', (req, res) => {

    // models.Session.find({ _id: req.body.CategoryOfUnitsAttendance, lectureDate: req.body.CategoryOfLectureDates }, function (err, Session) {


    var inputData = {
        _id: req.body.CategoryOfUnitsAttendance,
        lectureDate: req.body.CategoryOfLectureDates
    };
    console.log(inputData);

    models.Session.countDocuments(inputData, (err, results) => {
        console.log(err);
        console.log('wertyjhgf');

        if (results > 0) {
            console.log(results);
            models.Session.find(inputData,
                (req, retrievedData) => {
                    console.log(retrievedData);
                    res.render('studentsReport',
                        {
                            title: 'Students Attendance Report',
                            data: retrievedData,
                            message: ''
                        }
                        )
                })
        } else {
            console.log('No Records found');
            res.redirect('/lecturer/reports/single'
                )
        }
    }
    )
})

// router.get('/lecturer/reports/single', (req, res) => { res.render('index', ) })
//lecturer generating reports

router.get('/lecturer/reports', (req, res) => {
    models.Session.find({}, function (err, data) {
        res.render('report', {
            title: 'Lectures report',
            data: data,
        })
    })
})


// to  view generated report table

router.get('/lecturer/viewReport', (req, res) => {
    models.Session.find({}, function (err, data) {
        let data = req.body.reportTable

        res.render('report', {
            title: 'Class Report',
            data: data,
        })
        // console.log(data)
    })
})



// begin a lecture 
router.post('/lecturer/startClass', ClassController.class_lecture_start)


// end a lecture 
router.post('/lecturer/endClass', ClassController.lecturer_ends_class)

// students to join lecturers
router.post('/student/class', ClassController.class_student_join)


// lecturer to generate report
// router.post('/lecturer/reports', ClassController.lecturer_view_report)


module.exports = router