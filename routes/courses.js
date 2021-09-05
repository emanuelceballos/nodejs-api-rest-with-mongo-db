const express = require('express');
const routes = express.Router();
const Course = require('../models/course_model');
const verifyToken = require('../middlewares/auth');

routes.get('/', verifyToken, (req, res) => {
    
    let result = listActiveCourses();

    result
        .then(courses => {
            return res.json(courses);
        })
        .catch(err => {
            return res.status(400).json({
                err
            });
        });
});

routes.post('/', verifyToken, (req, res) => {
    let result = createCourse(req);

    result
        .then(course => {
            res.json({
                course
            });
        })
        .catch(err => {
            res.status(400).json({
                err
            })
        });
});

routes.put('/:id', verifyToken, (req, res) => {
    
    let result = updateCourse(req.params.id, req.body);

    result
        .then(course => {
            res.json({
                course
            })
        })
        .catch(err => {
            res.status(400).json({
                err
            })
        });    
});

routes.delete('/:id', verifyToken, (req, res) => {
    let result = deactivateCourse(req.params.id);

    result
        .then(course => {
            res.json({
                course
            })
        })
        .catch(err => {
            res.status(400).json({
                error: err
            })
        });
});

async function listActiveCourses() {
    let courses = await Course.find({ 'status': true });
        
    return courses;
}

async function createCourse(req) {
    
    let course = new Course({
        title:         req.body.title,
        description:    req.body.description,
        author: req.user
    });

    return await course.save();
}

async function updateCourse(id, body) {
    let course = await Course.findByIdAndUpdate(id, {
        $set: {
            title: body.title,
            description: body.description
        }
    }, {
        new: true
    });

    return course;
}

async function deactivateCourse(id) {
    let course = await Course.findByIdAndUpdate(id, {
        $set: {
            status: false
        }
    }, {
        new: true
    });

    return course;
}

module.exports = routes;