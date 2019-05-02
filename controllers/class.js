const { validationResult } = require('express-validator/check');
const models = require('../db/mongo');
const geolocationUtils = require('geolocation-utils')

// function for a lecturer to start a class
exports.class_lecturer = async (req, res) => {
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
            endTime: null,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            radius: req.body.radius
        };

        models.Session.create(newClass, (err, lecture) => {
            if (err) {
                console.log(err);                
            }

            lecture.save((err) => {
                 return res.redirect('/lecturer/class');
            });
        })
        console.log(newClass)


        // get a class that has just been created above 
        let classInSession = await models.Session.find({ startTime: newClass.startTime })
        // console.log(classInSession)

        // update end time of a class when lecturer clicks the End-Elass button
    //     models.Session.findById( classInSession._id, (err, session, next) => {
    //         session.endTime.push(new Date())
    //         session.save() 
    //   })
    }
}

// function for a student to join a class
exports.class_student_join = (req, res) => {
    const errors = validationResult(req);
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