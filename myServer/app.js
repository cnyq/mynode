const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
// const createError = require('http-errors');
const cookieParser = require('cookie-parser');

const app = express()
const port = process.env.PORT || 9527

//自定义中间件
const myMiddleware = require('./middleware')

const cms = require('./router/cms/index')
const api = require('./router/api/index')

app.use(myMiddleware.sendD())

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')))

app.use('/cms', myMiddleware.verifyToken())
app.use('/cms', cms)
app.use('/api', api)

// app.use(function (req, res, next) {
//   next(createError(404));
// });

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});