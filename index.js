const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    { id: 1, name: 'course 1'},
    { id: 2, name: 'course 2'},
    { id: 3, name: 'course 3'}
]

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {

    const { error } = validateCourse(req.body); // equals to result.error in case if we would use: const result = validateCourse(req.body);
    if (error) return  res.status(400).send(error.details[0].message);
  

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send(`The course with the given id=${req.params.id} was not found.`);

    // Validate
    // If invalid, return 400 - Bad request
 
    const { error } = validateCourse(req.body); // equals to result.error in case if we would use: const result = validateCourse(req.body);
    if (error) {
        // 400 Bad request
        res.status(400).send(error.details[0].message);
        return;
    }

    // Update course
    course.name = req.body.name;
    res.send(course);

});

function validateCourse(course){
    const shema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(course, shema);
}


// /api/courses/1
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send(`The course with the given id=${req.params.id} was not found.`); // 404
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send(`The course with the given id=${req.params.id} was not found.`);

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);

});

// PORT
const port = process.env.PORT || 3000;
app.listen(3000, () => {console.log(`Listening on port ${port}...`)});
