require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var passport = require("passport");
// Require cookie packages
var cookieParser = require("cookie-parser");
var cookieSession = require("cookie-session");
var db = require("./models");
// var Travis = require("travis-ci");
// eslint-disable-next-line no-unused-vars
// var travis = new Travis({
//   version: "2.0.0",
//   pro: true
// });


var app = express();
var PORT = process.env.PORT || 3000;

// START GOOGS STUFF ----------------------------------------------------------------------/
require("./config/passport-config")(passport);
// END GOOGLE STUFF -------------------------------------------------------------------------------/
// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(express.static("public"));
app.use(
  cookieSession({
    name: "session",
    keys: ["123"]
  })
);
app.use(cookieParser());
  
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
require("./routes/googleRoutes/auth-routes")(app);
require("./routes/student-api-routes")(app);
require("./routes/teacher-api-routes")(app);
require("./routes/task-api-routes")(app);
require("./routes/htmlRoutes")(app);
var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function () {
  app.listen(PORT, function () {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
