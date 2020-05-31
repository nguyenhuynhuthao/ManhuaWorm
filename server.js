if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
// khai báo method để sử dụng bên routes/customers.js
const methodOverride = require('method-override')



const indexRouter = require('./routes/index')
const customerRouter = require('./routes/customers')

// import api doc json
const swaggerJsDoc=require('swagger-jsdoc');
const swaggerUi=require('swagger-ui-express');


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
// khai báo cho việc sử dụng chức năng update, delete
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: false
}))


const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connect to Mongoose'))


app.use('/', indexRouter)
app.use('/customers', customerRouter)


// viết documents
const swaggerOptions={
    swaggerDefinition: {
        info: {
            title: 'My document',
            description: "Nguyễn Huỳnh Như Thảo",
            version: "1.0.0",
            contact: {
                name: "Nguyễn Huỳnh Như Thảo",
                email: "17521064@gm.edu.vn",
            },
            servers: ["localhost:8080"]
        }
    },
    apis: ["app.js"]
  };
  const swaggerDocs=swaggerJsDoc(swaggerOptions);
  app.use('/apidocs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));
  
  
  
  /**
  * @swagger
  * /:
  *  get:
  *      summary: ...
  *      description: ...
  *      produces:
  *          - application/json
  *      responses:
  *          '200': 
  *              description: ....
  */


app.listen(process.env.PORT || 8080, () =>{
    console.log('Server is running')
})