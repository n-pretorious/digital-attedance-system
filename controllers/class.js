const { validationResult } = require('express-validator/check');
const models = require('../db/mongo');
const geolocationUtils = require('geolocation-utils')
const alert = require('alert-node')

// function for a lecturer to start a class
exports.class_lecture_start = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        })
    }
    else {
        //set todays date

        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        var todaysdate = [year, month, day].join('-');

        //end set todays date
        let newClass = {
            unit: req.body.viewUnits,
            lecturer: req.body.lecturer,
            student: req.body.student,
            startTime: new Date().toString(),
            endTime: "",
            lectureDate: todaysdate,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            radius: req.body.radius
        };

        models.Session.create(newClass, (err, lecture) => {
            if (err) {
                console.log(err)
            }

            lecture.save((err) => {
                alert("The class has been added succesfully");
                return res.redirect('/lecturer/endClass');
            });
        })
        console.log(newClass)

    }
}
// function to delete unit



// function to end class
//end class as a lecturer

exports.lecturer_ends_class = (req, res) => {

    models.Session.findById(req.body.EndClassSession, (err, Session) => {

        console.log('Fetching the Class Session....')
        console.log(req.body.EndClassSession)
        if (err) {
            console.log(err)
        }
        console.log(Session)

        Session.endTime = new Date()
        Session.save((err) => {
            if (err) {
                console.log(err)
            } else {
                alert("Lecture has been ended successfully")
            }

            console.log(Session)
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
        models.Session.findById(req.body._id, (err, session, next) => {

            //test whether a student is within class dimention
            const center = {
                lat: parseFloat(session.latitude),
                lon: parseFloat(session.longitude)
            }
            const radius = parseInt(session.radius) // meters

            if (geolocationUtils.insideCircle({ lat: parseFloat(req.body.latitude), lon: parseFloat(req.body.longitude) }, center, radius) === true) {
                console.log('within radius')
                console.log(req.body.admNumber)
                session.student.push(req.body.admNumber)
                session.save()
                res.redirect('/student')
            } else {
                console.log('outside radius');
                return res.status(500).json({
                    message: 'failed to join because you are outside the reach of your class'
                })
            }
        })
    }
}




