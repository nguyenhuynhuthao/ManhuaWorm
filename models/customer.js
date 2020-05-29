const mongoose = require('mongoose')

//bắt đầu tạo kiểu dữ liệu cho database trên mongoose
// nhớ kĩ khi muốn khách hàng mình có bao nhiêu trường thì cần phải nhớ rõ
// thuộc tính, tên tránh việc html gọi nhưng không đọc được
const customerSchema = new mongoose.Schema({
    name: {
        type: String,// kiểu dữ liệu cho biến name
        required: true
    },
    email: {
        type: String,// kiểu dữ liệu cho biến email
        required: true
    },
    phone: {
        type: String,// kiểu dữ liệu cho biến email
        required: true
    },
    password: {
        type: String,// kiểu dữ liệu cho biến email
        required: true
    }
})

//thực hiện chức năng xóa mà không ảnh hưởng đến những thằng có kết nối liên quan
// customerSchema.pre('remove', function(next) {

// })

module.exports = mongoose.model('Customer', customerSchema)