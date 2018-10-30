


// ===== MODULES ===============================================================
import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

// ===== MESSENGER =============================================================
import ThreadSetup from './messenger-api-helpers/thread-setup';

// ===== ROUTES ================================================================
import index from './routes/index';
import users from './routes/users';
import webhooks from './routes/webhooks';


const app = express();


/* =============================================
   =           Basic Configuration             =
   ============================================= */

/* ----------  Views  ---------- */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/* =============================================
   =                   Routes                  =
   ============================================= */

/* ----------  Primary / Happy Path  ---------- */
app.use('/', index);
app.use('/users', users);
app.use('/webhook', webhooks)

/* ----------  Errors  ---------- */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/* ----------  Messenger setup  ---------- */

ThreadSetup.setDomainWhitelisting();
ThreadSetup.setPersistentMenu();
ThreadSetup.setGetStarted();

/* =============================================
   =                 Port Setup                =
   ============================================= */

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app; // eslint-disable-line
