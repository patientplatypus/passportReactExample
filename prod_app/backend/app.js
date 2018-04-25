//BEGIN: LOAD EXPRESS AND EJS
    var express = require('express');
    var app = express();
    app.set('view engine', 'ejs');
//END: LOAD EXPRESS AND EJS

//BEGIN: LOAD FILE SYSTEM (TO OPEN CERTIFICATES) AND HTTPS
    var fs = require('fs');
    var https = require('https');
    var server = https.createServer({
        cert: fs.readFileSync('bracket.crt'),
        key: fs.readFileSync('bracket.key')
    }, app);
//END: LOAD FILE SYSTEM (TO OPEN CERTIFICATES) AND HTTPS

//BEGIN: LOAD PASSPORT DEPENDENCIES
    //body-parser: to read credentials from request body
    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({ extended: false }));
    //cookie-parser: to support cookies and hold session in user's browser
    var cookieParser = require('cookie-parser');
    app.use(cookieParser());
    //express-session: to support sessions on server side
    var expressSession = require('express-session');
    app.use(expressSession({ secret: process.env.SESSION_SECRET || 'Welcome1', resave: false, saveUninitialized: false }));
//END: LOAD PASSPORT DEPENDENCIES

//CORS
  var cors = require('cors');
  app.use(cors())
//CORS

//BEGIN: LOAD PASSPORT ENGINE
    var passport = require('passport');
    app.use(passport.initialize());
    app.use(passport.session());
//END: LOAD PASSPORT ENGINE

//BEGIN: IDCS INFORMATION

// Name      ucm-gse00014355
// Description      Platform - IaaS/AppDev GSE UCM Accounts
// Image Version      UCMVM06: UCM OCI Focus: 6 OCI VM + 4 DB VM cores + mini_Classic
// Environment Type      Allocated
// Primary Owner      moe.f.khan@oracle.com
// Secondary Owner      induraj.r.rangaswamy@oracle.com
// Paired Environment      No
// Access Details
// Status      Available
// Access End Date      -
// Login Username      lisa.jones / john.dunbar / bala.gupta / roland.dubois / cloud.admin
// Login Password      blisteryKlein@5    Copy to clipboard
// Identity Domain      gse00014355
// Notes    OCI Automation that requires API Keys (example: Terraform, Ansible, Chef Scripts etc), please use this user
// username = api.user
// password = StErile@6MiLE
// Direct URL : https://console.us-ashburn-1.oraclecloud.com/#/a/

//
// Client ID
// fa704febaa61406b862e9b489d00ca29
//
// Client Secret
// 0817b49d-01e4-4100-9096-b179085db943


// https://idcs-3ffe0d4a62c348cfaf9a563b55279d3b.identity.oraclecloud.com/ui/v1/adminconsole/?root=apps

// username - cloud.admin
// pw - blisteryKlein@5

  var idcsInfo = {
  discoveryURL: 'https://idcs-3ffe0d4a62c348cfaf9a563b55279d3b.identity.oraclecloud.com/.well-known/idcs-configuration',
  clientID: '7926d5f86fd54531a25680c78afcb49c',
  clientSecret: 'd471e66e-4272-426f-bf2c-9623315e4b88',
  callbackURL: 'https://www.yahoo.com',
  profileURL: 'https://idcs-3ffe0d4a62c348cfaf9a563b55279d3b.identity.oraclecloud.com/admin/v1/Me',
  passReqToCallback: true
};

  //example IDCS Information

  //   var idcsInfo = {
  //   discoveryURL: 'https://idcs-429d5a47665341b3b3fc1dda8ab6048b.identity.oraclecloud.com/.well-known/idcs-configuration',
  //   clientID: 'c8c34b2157044407aa258eea23e980b3',
  //   clientSecret: '6d51f671-247a-40d2-9466-1393d6fc85f0',
  //   callbackURL: 'https://129.146.124.133:3000/#/',
  //   profileURL: 'https://idcs-429d5a47665341b3b3fc1dda8ab6048b.identity.oraclecloud.com/admin/v1/Me',
  //   passReqToCallback: true
  // };
//END: IDCS INFORMATION

//BEGIN: LOAD IDCS STRATEGY
    var OIDCSStrategy = require('passport-oauth-oidcs').Strategy;
    var oidcsstrgt = new OIDCSStrategy(idcsInfo,
        function(req, accessToken, refreshToken, profile, done) {
                req.session.idcsAccessToken = accessToken;
                return done(null, profile);
        }
    );
    passport.use('idcs', oidcsstrgt);
//END: LOAD IDCS STRATEGY

//BEGIN: USER SERIALIZATION (REQUIRED BY PASSPORTJS)
    passport.serializeUser(function(user, done) { done(null, user); });
    passport.deserializeUser(function(user, done) { done(null, user); });
//END: USER SERIALIZATION (REQUIRED BY PASSPORTJS)

//BEGIN: PASSPORT ENDPOINTS FOR AUTHENTICATION AND CALLBACK (LINKED TO IDCS STRATEGY)
    app.get('/auth/idcs', passport.authenticate('idcs'));
    app.get('/auth/idcs/callback', passport.authenticate('idcs', { successRedirect: '/successRedirect', failureRedirect: '/failureRedirect' }));
//END: PASSPORT ENDPOINTS FOR AUTHENTICATION AND CALLBACK (LINKED TO IDCS STRATEGY)
//BEGIN: ENDPOINTS
    app.get('/', function(req, res) {
      res.render('home', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user
      });
    });
    app.get('/logout', function(req, res) {
        req.logout();//method added by passport to support logout
        res.redirect('/');
    });

    // app.get('/doctorRoute', passport.authenticate('idcs', { successRedirect: '/successRedirect', failureRedirect: '/' }));
    app.get('/doctorRoute', passport.authenticate('idcs', { display: 'popup' }));

//     router.get('/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));
//
// router.get('/facebook/callback',
//     passport.authenticate('facebook', { failureRedirect: "/" }), function (req, res) {
//         if (req.user || req.session.user)
//             return res.redirect('/' + req.user._id || req.session.user._id);
//         return res.redirect('/login');
//     });

    // app.get('/doctorRoute', passport.authenticate('idcs'), function(req, res) {
    //   console.log('in doctorRoute');
    //   res.redirect('/successRedirect');
    // });

    app.get('/insuranceRoute', function(req, res) {
        res.json({'insuranceRoute': 'success'})
    });

    app.get('/pharmacistRoute', function(req, res) {
        res.json({'pharmacistRoute': 'success'})
    });


    app.get('/successRedirect', function(req, res) {
        console.log('in successRedirect');
        res.json({'redirect': 'FAILURE'})
    });

    app.get('/failureRedirect', function(req, res) {
        console.log('in successRedirect');
        res.json({'redirect': 'SUCCESS'})
    });


//END: ENDPOINTS

//BEGIN: LOAD APP LISTENER
    var port = process.env.PORT || 8000;
    //var server = app.listen(port, function() {
    //    console.log('https://localhost:' + port + '/');
    //});
    server.listen(port, function() {
        console.log('https://localhost:' + port + '/');
    });

//END: LOAD APP LISTENER
