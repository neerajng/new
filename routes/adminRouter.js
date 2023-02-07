const router= require('express').Router();
const adminController=require('../controllers/adminController')
const adminAuth=require('../middlewares/admin')
const {uploadOptions} = require('../config/multer')
router.get('/login',adminAuth.isLoggedOut,adminController.getAdminLogin)
router.get('/home',adminAuth.isLoggedIn,adminController.getAdminHome)
router.get('/users',adminAuth.isLoggedIn,adminController.getAdminUser)
router.get('/category',adminAuth.isLoggedIn,adminController.getAdminCategory)
router.get('/addcategory',adminAuth.isLoggedIn,adminController.getAddCategory)
router.get('/products',adminAuth.isLoggedIn,adminController.getAdminProduct)
router.get('/addproduct',adminAuth.isLoggedIn,adminController.getAddProducts)
router.get('/updateproduct/:_id',adminAuth.isLoggedIn,adminController.getUpdateProduct)
router.get('/orders',adminAuth.isLoggedIn,adminController.getAdminOrders)
router.post('/chart',adminController.getchartData)
router.get('/chart',adminAuth.isLoggedIn,adminController.showChart)
router.get('/logout',adminAuth.isLoggedIn,adminController.LogoutAdmin)
//------------------------------------------------------//get methods only

router.post('/login',adminController.LoginAdmin)
router.put('/users/block/:_id',adminController.blockUser)
//-----------------------------------------------------------//a_user

router.post('/category/add',adminController.addCategory)
router.put('/category/delete/:_id',adminController.deleteCategory)
//------------------------------------------------------------//a_category

router.post('/products/add',uploadOptions.single('fileName'),adminController.addProduct)
router.put('/products/delete/:_id',adminController.deleteProduct)
router.put('/products/edit/:_id',uploadOptions.single('fileName'),adminController.editProduct)
  
//------------------------------------------------------------//a_products



module.exports = router;