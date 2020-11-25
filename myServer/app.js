const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
// const createError = require('http-errors');
const cookieParser = require('cookie-parser');

const app = express()
const port = process.env.PORT || 3000

const router = require('./router/index')
const user = require('./router/user')

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')))

app.use('/',router)
app.use('/api',user)
// app.use(function (req, res, next) {
//   next(createError(404));
// });

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});