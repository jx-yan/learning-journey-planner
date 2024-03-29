const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const config = require('./config/init');

const deptsRoutes = require('./api/routes/depts');
const skillsRoutes = require('./api/routes/skills');
const staffRoutes = require('./api/routes/staff');
const jobsRoutes = require('./api/routes/jobs');
const journeyRoutes = require('./api/routes/journey');
const coursesRoutes = require('./api/routes/courses');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(config.cors);

app.use('/depts', deptsRoutes );
app.use('/skills', skillsRoutes );
app.use('/staff', staffRoutes );
app.use('/jobs', jobsRoutes );
app.use('/journey', journeyRoutes );
app.use('/courses', coursesRoutes );

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// app.use(config.closePrisma);

module.exports = app;