// const express
// const router
// const adminControls
// const adminAuth
//---------------------------ADMINROUTES------------------///
router.get('/',adminAuth.isLoggedOut,adminControls.getLogin)

router.post('/',adminControls.Login)

router.get('/home',adminAuth.isLoggedIn,adminControls.gethome)

router.get('/users',adminAuth.isLoggedIn,adminControls.getUser)

router.get('/users/view/:id',adminAuth.isLoggedIn,adminControls.viewUser)

router.put('/users/:id',adminControls.blockUser)

router.get('/products',adminAuth.isLoggedIn,adminControls.getproducts)

router.get('/category',adminAuth.isLoggedIn,adminControls.getCategory)

router.post('/category/add',adminControls.addCategory)

router.patch('/category/:id',adminControls.deleteCategory)

router.get('/coupons',adminAuth.isLoggedIn,adminControls.getCoupon)

router.get('/banners',adminAuth.isLoggedIn,adminControls.getBanner)

router.get('/logout',adminAuth.isLoggedIn,adminControls.getLogout)

module.exports = router;




// const session 
// const adminModel 
// const categoryModel 
// const userModel 
//---------------------------ADMINCONTROLLER------------------///
module.exports = {
    getLogin: (req, res) => {
        if (req.session.message) {
            const message = req.session.message;
            req.session.message = "";
            return res.render("admin/login", { message })
        }
        const message = " "
        return res.render("admin/login", { message })
    },

    gethome: (req, res) => {
        return res.render("admin/home")
    },

    getproducts: (req, res) => {
        return res.render("admin/products/products")
    },

    getUser: async (req, res) => {
        try {
            const users = await userModel.find()
            return res.render("admin/users/users", { users })
        } catch (err) {
            console.log(err);
        }
    },

    getCategory: async (req, res) => {
        try {
            const category = await categoryModel.find({ isDeleted: false })
            if (req.session.message) {
                const message = req.session.message;
                req.session.message = ""
                return res.render("admin/category/category", { category, message })
            } else {
                const message = ""
                return res.render("admin/category/category", { category, message })
            }
        } catch (err) {
            console.log(err);
        }

    },

    addCategory: async (req, res) => {
        const category = new categoryModel({
            categoryName: req.body.category
        })
        try {
            await category.save()
            res.redirect('/admin/category')
        } catch (error) {
            req.session.message = error.errors.categoryName.properties.message
            res.redirect('/admin/category')
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const id = req.params.id
            await categoryModel.findOneAndUpdate({ _id: id }, {
                $set: {
                    isDeleted: true
                }
            })
            return res.json({
                successStatus: true,
                redirect: '/admin/category'
            })
        } catch (err) {
            console.log(err);
        }
    },

    blockUser: async (req, res) => {
        try {
            const id = req.params.id
            const user = await userModel.findById(id)
            if (user.isBlocked) {
                try {
                    await userModel.findOneAndUpdate({ _id: id }, {
                        $set: {
                            isBlocked: false
                        }
                    })
                    return res.json({
                        successStatus: true,
                        redirect: '/admin/users'
                    })
                } catch (error) {
                    console.log(error)
                    return res.json({
                        successStatus: false
                    })
                }
            } else {
                try {
                    await userModel.findOneAndUpdate({ _id: id }, {
                        $set: {
                            isBlocked: true
                        }
                    })
                    return res.json({
                        successStatus: true,
                        redirect: '/admin/users'
                    })
                } catch (error) {
                    console.log(error)
                    return res.json({
                        successStatus: false
                    })
                }
            }
        } catch (err) {
            console.log(err);
        }
    },

    viewUser: (req, res) => {
        try {
            const id = req.params.id
            userModel.findById(id, function (err, docs) {
                if (err) {
                    console.log(err);
                }
                else {
                    const users = docs
                    res.render('admin/users/viewUser', { users })
                }
            })
        }
        catch (err) {
            console.log(err);
        }
    },

    Login: async (req, res) => {
        try {
            const admin = await adminModel.find({ email: req.body.email, password: req.body.password })
            if (admin.length == 0) {
                req.session.Errmessage = "User does not exist"
                return res.redirect('/admin')
            } else {
                req.session.admin = admin;
                return res.redirect('/admin/home')
            }
        } catch (err) {
            console.log(err);
        }
    },
    getBanner: (req, res) => {
        res.render('admin/banners/banners')
    },

    getCoupon: (req, res) => {
        res.render('admin/coupons/coupons')
    },
    getLogout: (req, res) => {
        req.session.admin = null;
        res.redirect('/admin')
    }
}