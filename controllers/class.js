const { validationResult } = require('express-validator/check');
const models = require('../db/mongo');
const geolocationUtils = require('geolocation-utils')

// function for a lecturer to start a class
exports.class_lecture_start = (req, res) => {
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
            startTime: new Date().toString(),
            endTime: "",
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            radius: req.body.radius
        };

        models.Session.create(newClass, (err, lecture) => {
            if (err) {
                console.log(err)               
            }

            lecture.save((err) => {
                 return res.redirect('/lecturer/StartClass');
            });
        })
        console.log(newClass)
    }
}

// function to end class
exports.class_student_end = (req, res) => {
    models.Session.findById(req.body._id, (err, session) => {
        console.log(req.body._id)
            if (err) {
                console.log(err)
            }
            console.log(session)
            
            session.endTime = new Date()
            session.save((err) => {
                if (err) {
                    console.log(err)
                }

                console.log(session)
                res.redirect('/lecturer/startClass')
            })
    })
}

// function for a student to join a class
exports.class_student_join = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    } else {
        models.Session.findById( req.body._id, (err, session, next) => {

              //test whether a student is within class dimention
            const center = {
                lat: parseFloat(session.latitude), 
                lon: parseFloat(session.longitude)
            }
            const radius = parseInt(session.radius) // meters

            if (geolocationUtils.insideCircle({lat: parseFloat(req.body.latitude), lon: parseFloat(req.body.longitude)}, center, radius) === true) {
                console.log('within radius')
                session.student.push(req.body.student)
                session.save()
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
}