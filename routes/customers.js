const express = require('express')
const router = express.Router()
const Customer = require('../models/customer')

//all authors route: route dùng để load toàn bộ khách hàng vào trong database
//tạo chức năng tìm kiếm
router.get('/', async (req, res) => {
    let searchOptions = {}
    if(req.query.name != null && req.query.name !== '') {
        // cho nó tìm theo bất kì kí tự nào
        searchOptions.name = new RegExp(req.query.name, 'i')
    } 
    try{
        const customers = await Customer.find(searchOptions)
        res.render('customers/index', {
            customers: customers, 
            searchOptions: req.query
    })
    } catch {
        res.redirect('/')
    }   
})

//new authors route: route dùng để load 1 người dùng cụ thể trong databse
router.get('/new', (req, res) => {
    res.render('customers/new', {
        customer: new Customer()
    })
})

//create authors route: route dùng để tạo mới người dùng trong database
router.post('/', async (req, res) => {
    // tạo 1 class khách hàng
    // trường hợp tạo 1 khách hàng mới thì phải ghi dầy đủ các trường column
    // tránh trường hợp thiếu tên column khi post dữ liệu sẽ bị lỗi
    const customer = new Customer({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password
    })
    //phòng tránh không cho có lỗi nữa
    try{
        const newCustomer = await customer.save()
        //res.redirect(`customers/${newCustomer.id}`)
        res.redirect(`customers`)
    } catch{
        res.render('customers/new', {
            customer: customer,
            errorMessage: 'Error creating Customer'
        })
    }
    //kiểm tra lưu được khách hàng mới tạo không
        // customer.save((err, newCustomer) =>{
        //     if(err){
        //         res.render('customers/new', {
        //             customer: customer,
        //             errorMessage: 'Error creating Customer'
        //         })
        //     }else{
        //         //res.redirect(`customers/${newCustomer.id}`)
        //         res.redirect(`customers`)
        //     }
        // })
    //res.send(req.body.name)
})

module.exports = router