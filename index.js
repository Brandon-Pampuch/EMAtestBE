//import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const authConfig = require('./authconfig.json')
// graph ql dependencies
const graphqlHTTP = require("express-graphql")
const schema = require('./schema/schema')


// how mongoose brings in the REAL db
const DB = require('./models');
const User = require('./models/user')
// define the Express app
const app = express();
// the fake database
// const users = [
//     { id: 1, user: "Brandon", description: "I am people", mood: ["good", "bad"] },
//     { id: 2, user: "Squeakers", description: "I am a cat", mood: ["cat", "cat"] }
// ];
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



app.use(
    '/graphql', checkJwt,
    graphqlHTTP((request, response, graphQLParams) => ({
        schema: schema,
        graphiql: true,

    }))
);

//server connection with mongoDB
const PORT = process.env.PORT || 8080

DB.connectDb().then(async () => {
    app.listen(PORT, () =>
        console.log(`Example app listening on port ${PORT}!`),
    );
});


