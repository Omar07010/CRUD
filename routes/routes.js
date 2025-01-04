const express = require('express');
// const { default: mongoose } = require('mongoose');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const fs = require('fs');
const { type } = require('os');

// image upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
    }
})
var upload = multer({ storage: storage }).single('image');
 //dak image li f single kayna f add-users.ejs o hya name dyal image

// routes
router.post('/add', upload, (req, res) => {
    const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename,
    })
    user.save()
    .then(() => {
        req.session.message = {
            type: 'success',
            message: 'User added successfully!'
        };
        res.redirect('/');
    })
    .catch(err => {
        res.json({ message: err.message, type: 'danger' });
    });

//     user.save((err) => {
//         if(err){
//             res.json({message: err.message, type: 'danger'})
//         } else {
//             req.session.message = {
//                 type: 'success',
//                 message: 'User added seccessfully!'
//             };
//             res.redirect('/')
//     }
// })    
});



router.get('/',  (req, res) => {
    User.find()
    .then((result) => {
        res.render('index', {title: 'Home Page', result: result})
    })
    .catch((err) => {
        console.log(err);
    })
})
router.get('/add', (req, res) => {
    res.render('add-users', {title: 'Add User'})
})

router.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    User.findById(id)
    .then((result) => {
        if (result == null) {
            res.redirect('/')
        } else {
            res.render('edit-users', {title: 'Edit User', result: result})
        }
    })
})

router.post('/update/:id', upload, (req, res) => {
    let id = req.params.id;
    let new_image = '';
    if (req.file) {
        new_image = req.file.filename;       
        try{
            fs.unlinkSync('./uploads/'+req.body.old_image);
        }catch(err){
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }
    User.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: new_image,
    })
    .then((result) => {
        req.session.message = {
            type: 'seccess',
            message: 'User updated seccessfully!'
        }
        res.redirect('/')
    })
    .catch((err) => {
        res.json({message: err.message, type: 'danger'})
    })
})

// router.get('/delete/:id', (req, res) => {
//     let id = req.params.id;
//     User.findByIdAndDelete(id, (err, result) => {
//         if (result.image != '') {
//           try{
//             fs.unlinkSync('./uploads/'+result.image)
//           } catch(err){
//             console.log(err);
//         } 
//         }
//     })
//     if(err){
//         res.json({message: err.message, type: 'danger'}) 
//     }
//     else{
//         req.session.message = {
//             type: 'info',
//             message: 'User deleted seccessfully!'
//         }
//         res.redirect('/')
//     }
// })


router.get('/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.image && user.image !== '') {
            try {
                fs.unlinkSync('./uploads/' + user.image);
                console.log('Deleted image:', user.image);
            } catch (err) {
                console.error('Error deleting image:', err);
            }
        }

        // Continue with redirect and session message
        req.session.message = {
            type: 'info',
            message: 'User deleted seccessfully!'
        };
        res.redirect('/');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: err.message, type: 'danger' });
    }
});

// مسار الحذف بواسطة طلب DELETE
// router.delete('/:id', async (req, res) => {
//     const id = req.params.id;

//     try {
//         // حذف المستخدم بناءً على الـ id المُعطى
//         const user = await User.findByIdAndDelete(id);

//         if (!user) {
//             // إذا لم يُعثر على المستخدم، يُرسل استجابة برمز 404
//             return res.status(404).json({ message: 'المستخدم غير موجود' });
//         }

//         // إذا كان هناك صورة للمستخدم، يتم حذفها
//         if (user.image && user.image !== '') {
//             try {
//                 fs.unlinkSync('./uploads/' + user.image); // حذف الصورة من مجلد الرفع
//                 console.log('تم حذف الصورة:', user.image);
//             } catch (err) {
//                 console.error('خطأ في حذف الصورة:', err);
//             }
//         }

//         // إعداد رسالة للجلسة لعرضها بعد التحويل
//         req.session.message = {
//             type: 'info',
//             message: 'تم حذف المستخدم بنجاح!'
//         };
        
//         // الرد برمز 200 عند نجاح الحذف
//         res.status(200).json({ message: 'تم حذف المستخدم بنجاح!' });
//     } catch (err) {
//         // إذا حدث خطأ أثناء حذف المستخدم، يُرسل استجابة برمز 500 ويُعرض خطأ الخادم
//         console.error('خطأ في حذف المستخدم:', err);
//         res.status(500).json({ message: err.message, type: 'danger' });
//     }
// });

module.exports = router;



module.exports = router;