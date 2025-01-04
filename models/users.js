const mongoose = require('mongoose');

// تعريف مخطط المستخدم
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    }
    
});

// تحديد واستخدام مخطط المستخدم في موديل
const User = mongoose.model('User', userSchema);

module.exports = User;
