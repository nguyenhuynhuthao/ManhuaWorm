if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
// khai báo method để sử dụng bên routes/customers.js
const methodOverride = require('method-override')

////////

const indexRouter = require('./routes/index')
const customerRouter = require('./routes/customers')

// import api doc json
const swaggerJsDoc=require('swagger-jsdoc');
const swaggerUi=require('swagger-ui-express');

const customerRoutes = require("../ApiServer/routes/customers");

//
app.use("/customers", customerRoutes);

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

//Câu lệnh cho main APIDoc hiện lên đầu tiên
app.get("/", (req, res, next) => {
    res.status(200).json({
      message: "Welcome to ManhuaWorm Api Documents"
    });
});

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
    apis: ["server.js"]
  };
const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/apidocs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));

//Make APIDocs for all routes

/**
 * @swagger
 * /:
 *  get:
 *    tags: [/]
 *    summary: Return main page status
 *    descripion: Use to Get requesst in main-path http://localhost:8080
 *    responses:
 *      '200':
 *        description: This is an Api document for ManhuaWorm Cooking.
 */
/**
 * @swagger
 * /customers:
 *  get:
 *    tags: [customers]
 *    summary: Fetch a list of all customers
 *    description: Use to Get request to path /customers
 *    responses:
 *      '200':
 *        description: List of all customers
 *  post:
 *    tags: [customers]
 *    summary: Create a new customer
 *    description: Use to Post request to path /customers
 *    responses:
 *      '201':
 *        description: Create a customer
 *  put:
 *    tags: [customers]
 *    summary: Update a customer
 *    description: Use to Put request to path /customers
 *    responses:
 *      '200':
 *        description: Update a customer
 *  delete:
 *    tags: [customers]
 *    summary: Delete a customer
 *    description: Use to Delete request to path /customers
 *    responses:
 *      '200':
 *        description: Delete a customer
 * /customers/{customerID}:
 *  get:
 *    tags: [customers]
 *    summary: Fetch a specific customer
 *    description: Use to Get request to path customers/{customerid}
 *    parameters:
 *    - name: customersID
 *      description: Input the {customersID}
 *      in: path
 *      required: true
 *      type: string
 *    responses:
 *      '200':
 *        description: Display detail of {customerID}
 *  patch:
 *    tags: [customers]
 *    summary: Update a specific customer
 *    description: Use to Patch request to path customers/{customersID}
 *    parameters:
 *      - name: customerID
 *        description: Input the {customerID}
 *        in: path
 *        required: true
 *        tyoe: string
 *    responses:
 *      '200':
 *        description: Display detail of {customerID} be changed
 *  delete:
 *    tags: [customers]
 *    summary: Delete a specific customer
 *    description: Use to Delete request to path /customers/{customerID}
 *    parameters:
 *      - name: customerID
 *        desription: Input the {customerID}
 *        in: path
 *        required: true
 *        type: string
 *    responses:
 *      '200':
 *        description: Display announcement that {customerID} be deleted
 */

app.listen(process.env.PORT || 8080, () =>{
    console.log('Server is running')
})