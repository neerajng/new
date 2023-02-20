const router = require('express').Router()
const adminController = require('../controllers/adminController')
const adminAuth = require('../middlewares/admin')
const verifyLogout = adminAuth.isLoggedOut
const verifyLogin = adminAuth.isLoggedIn
const { uploadOptions } = require('../config/multer')

router.get('/login', verifyLogout, adminController.getAdminLogin)
router.get('/home', verifyLogin, adminController.getAdminHome)
router.get('/users', verifyLogin, adminController.getAdminUser)
router.get('/category', verifyLogin, adminController.getAdminCategory)
router.get('/addcategory', verifyLogin, adminController.getAddCategory)
router.get('/products', verifyLogin, adminController.getAdminProduct)
router.get('/addproduct', verifyLogin, adminController.getAddProducts)
router.get('/updateproduct/:_id', verifyLogin, adminController.getUpdateProduct)
router.get('/offers', verifyLogin, adminController.getAdminOffers)
router.get('/logout', verifyLogin, adminController.LogoutAdmin)
// ------------------------------------------------------//some get methods

router.post('/login', adminController.LoginAdmin)
router.put('/users/block/:_id', adminController.blockUser)
// -----------------------------------------------------------//admin_user

router.post('/category/add', adminController.addCategory)
router.put('/category/delete/:_id', adminController.deleteCategory)
// ------------------------------------------------------------//admin_category

router.post('/products/add', uploadOptions.single('fileName'), adminController.addProduct)
router.put('/products/delete/:_id', adminController.deleteProduct)
router.put('/products/edit/:_id', uploadOptions.single('fileName'), adminController.editProduct)
// ------------------------------------------------------------//admin_products

router.get('/chart', adminController.showChart)
router.post('/chart', adminController.getchartData)
// ------------------------------------------------------------//admin_chart

router.get('/coupons', verifyLogin, adminController.getcouponDash)
router.get('/add-coupon', verifyLogin, adminController.addCoupons)
router.post('/add-coupon', adminController.postaddCoupon)
router.put('/updatecoupon/:id', adminController.updateCoupon)

// ------------------------------------------------------------//admin_coupon

router.get('/generateTable', adminController.generateTable)
router.get('/report-Download', adminController.getreportDownload)
router.get('/excel-Data', adminController.excelTable)
router.get('/sales', adminController.getSales)
// ------------------------------------------------------------//admin_sales_rpt

router.get('/orders', verifyLogin, adminController.getAdminOrder)
router.put('/admin-order-cancel/:_id', adminController.cancelOrder)
router.put('/admin-deliver-order/:_id', adminController.deliverOrder)
router.put('/admin-return-order/:_id', adminController.returnOrder)
router.get('/view-order/:_id', verifyLogin, adminController.viewAdminOrder)
// ------------------------------------------------------------//admin_order

module.exports = router
