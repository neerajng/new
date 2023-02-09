const router = require('express').Router();
const adminController = require('../controllers/adminController')
const adminAuth = require('../middlewares/admin')
const { uploadOptions } = require('../config/multer')
router.get('/login', adminAuth.isLoggedOut, adminController.getAdminLogin)
router.get('/home', adminAuth.isLoggedIn, adminController.getAdminHome)
router.get('/users', adminAuth.isLoggedIn, adminController.getAdminUser)
router.get('/category', adminAuth.isLoggedIn, adminController.getAdminCategory)
router.get('/addcategory', adminAuth.isLoggedIn, adminController.getAddCategory)
router.get('/products', adminAuth.isLoggedIn, adminController.getAdminProduct)
router.get('/addproduct', adminAuth.isLoggedIn, adminController.getAddProducts)
router.get('/updateproduct/:_id', adminAuth.isLoggedIn, adminController.getUpdateProduct)
router.get('/offers', adminAuth.isLoggedIn, adminController.getAdminOffers)
router.get('/logout', adminAuth.isLoggedIn, adminController.LogoutAdmin)
//------------------------------------------------------//some get methods 

router.post('/login', adminController.LoginAdmin)
router.put('/users/block/:_id', adminController.blockUser)
//-----------------------------------------------------------//admin_user

router.post('/category/add', adminController.addCategory)
router.put('/category/delete/:_id', adminController.deleteCategory)
//------------------------------------------------------------//admin_category

router.post('/products/add', uploadOptions.single('fileName'), adminController.addProduct)
router.put('/products/delete/:_id', adminController.deleteProduct)
router.put('/products/edit/:_id', uploadOptions.single('fileName'), adminController.editProduct)
//------------------------------------------------------------//admin_products

router.get('/chart', adminAuth.isLoggedIn, adminController.showChart)
router.post('/chart', adminController.getchartData)
//------------------------------------------------------------//admin_chart

router.get('/orders', adminAuth.isLoggedIn, adminController.getAdminOrder)
router.put('/admin-order-cancel/:_id', adminController.cancelOrder);
//------------------------------------------------------------//admin_order

router.get('/coupons', adminAuth.isLoggedIn, adminController.getcouponDash)
router.get('/add-coupon', adminAuth.isLoggedIn, adminController.addCoupons)
router.post('/add-coupon', adminController.postaddCoupon)
router.put('/updatecoupon/:_id', adminController.updateCoupon)

//------------------------------------------------------------//admin_coupon

router.get('/generateTable', adminController.generateTable)
router.get('/report-Download', adminAuth.isLoggedIn, adminController.getreportDownload)
router.get('/excel-Data', adminAuth.isLoggedIn, adminController.excelTable)
//------------------------------------------------------------//admin_sales_rpt
module.exports = router;