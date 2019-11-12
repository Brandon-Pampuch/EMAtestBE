//import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const authConfig = require('./authconfig.json')


// how mongoose brings in the REAL db
const DB = require('./models');
const User = require('./models/user')
// define the Express app
const app = express();
// the fake database
const users = [
    { id: 1, user: "Brandon", description: "I am people", mood: ["good", "bad"] },
    { id: 2, user: "Squeakers", description: "I am a cat", mood: ["cat", "cat"] }
];
// enhance your app security with Helmet
app.use(helmet());
// use bodyParser to parse application/json content-type
app.use(bodyParser.json());
// enable all CORS requests
app.use(cors());
// log HTTP requests
app.use(morgan('combined'));



//checks web token middleware
const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: authConfig.audience, // name of api //identifier in settings
    issuer: `https://${authConfig.domain}/`, //local host
    algorithms: ['RS256']
});

// retrieve all users
app.get('/', checkJwt, (req, res) => {

    //user id exists on the request and in the  jwt token
    console.log(req.user.sub)

    //creates new user and saves to db
    var char = new User({
        name: "new_user",
        sub: req.user.sub

    })

    char.save()

    const allUsers = users.map(u => ({
        id: u.id,
        user: u.user,
        description: u.description,
        mood: u.mood.length
    }));
    res.send(allUsers);
});

//server connection with mongoDB
const PORT = process.env.PORT || 8080

DB.connectDb().then(async () => {
    app.listen(PORT, () =>
        console.log(`Example app listening on port ${PORT}!`),
    );
});




// code to be deleted below


















// get a specific question
// app.get('/:id', checkJwt, (req, res) => {
//     const question = questions.filter(q => (q.id === parseInt(req.params.id)));
//     if (question.length > 1) return res.status(500).send();
//     if (question.length === 0) return res.status(404).send();
//     res.send(question[0]);
// });

// insert a new question
// app.post('/', checkJwt, (req, res) => {
//     const { title, description } = req.body;
//     const newQuestion = {
//         id: questions.length + 1,
//         title,
//         description,
//         answers: [],
//         author: req.user.name,
//     };
//     questions.push(newQuestion);
//     res.status(200).send();
// });







// insert a new answer to a question
// app.post('/answer/:id', checkJwt, (req, res) => {
//     const { answer } = req.body;

//     const question = questions.filter(q => (q.id === parseInt(req.params.id)));
//     if (question.length > 1) return res.status(500).send();
//     if (question.length === 0) return res.status(404).send();

//     question[0].answers.push({
//         answer,
//         author: req.user.name,
//     });

//     res.status(200).send();
// });



//server

// const PORT = process.env.PORT || 8080



// DB.connectDb().then(async () => {
//     app.listen(PORT, () =>
//         console.log(`Example app listening on port ${PORT}!`),
//     );
// });


// start the server
// app.listen(PORT, () => {
//     console.log(`listening on port ${PORT}`);
// });