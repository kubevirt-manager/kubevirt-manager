/* Node Modules */
const express = require('express');
var morgan = require('morgan')
var app = express();

/* Local Modules */
const myRouter = require('./lib/router/router.js');

const PORT = process.env.PORT || 15001;

/*
 * Logging & JSON Support
 */
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
 * Set App Routes
 */
var myRouterSetup = myRouter.startRouter(app);

/*
 * Start the listener
 */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});