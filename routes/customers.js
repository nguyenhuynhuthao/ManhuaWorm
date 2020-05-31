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
        // res.redirect(`customers/${newCustomer.id}`)
        // res.redirect(`customers`)
        res.redirect('/customers/')
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


//biến id: dùng để gọi lại đúng vị trí customer mình cần thao tác chỉnh sửa, xóa
router.get('/:id',async (req, res) => {
    // res.send('Show Customer ' + req.params.id)

    // tham số này trên đối tượng(object) sẽ cung cấp tất cả tham số mà minhf xác định bên trong các đường dẫn URL 
    //vì vậy trong trường hợp ID của mình là những gì mình đã xác định (chọn) ngay tại vị trí để nó sẽ cung cấp cho chúng ta ID từ URL
    try {
        const customer = await Customer.findById(req.params.id)
        res.render('customers/show', {
          customer: customer
        })
        // res.redirect('/customers/')
      } catch {
        res.redirect('/')
      }
})


//thực hiện sửa đổi khách hàng
router.get('/:id/edit', async (req, res) => {
    try {
        //.findById tìm kiếm dựa vào vào id của mỗi khách hàng
        const customer = await Customer.findById(req.params.id)
        //res.send('Edit Customer ' + req.params.id)

        res.render('customers/edit', {
            customer: customer
        })
    } catch {
        res.redirect('/customers/')
    }
    
})

//cập nhật lại thông tin của khách hàng sau khi đã sửa đổi
router.put('/:id', async (req, res) => {
    // res.send('Update Customer ' + req.params.id)
    let customer 
    //phòng tránh không cho có lỗi nữa
    try{
        customer = await Customer.findById(req.params.id)
        customer.name = req.body.name
        customer.email = req.body.email
        customer.phone = req.body.phone
        customer.password = req.body.password
        await customer.save('customers/')
        // res.redirect(`/customers/${customer.id}`)
        // res.redirect(`customers`)
        //sau khi chỉnh sửa xong thì quay lại trang chứa khách hàng
        res.redirect('/customers')
    } catch{
        if (customer == null) {
            res.redirect('/')
        }
        else {
            res.render('customers/edit', {
                customer: customer,
                errorMessage: 'Error updating Customer'
            })
        }  
    }
})

//thực hiện xóa khách hàng
//khi hệ thống bị lối thì ta có thể thêm async vào trước (req, res)
router.delete('/:id', async (req, res) => {
    // res.send('Delete Customer ' + req.params.id)
    let customer 
    //phòng tránh không cho có lỗi nữa
    try{
        customer = await Customer.findById(req.params.id)
        await customer.remove()
        res.redirect('/customers')
        // res.redirect(`customers`)
    } catch{
        if (customer == null) {
            res.redirect('/')
        }
        else {
            res.redirect(`/customers/${customer.id}`)
        }  
    }
})

// thực hiện chức năng login
// router.get('/login', (req, res) => {
//     res.redirect('customers/login')
// })



module.exports = router