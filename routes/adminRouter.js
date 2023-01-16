const router= require('express').Router();
const adminController=require('../controllers/adminController')
const adminAuth=require('../auth/admin')
const {uploadOptions} = require('../config/multer')

router.get('/login',adminAuth.isLoggedOut,adminController.getAdminLogin)
router.get('/home',adminAuth.isLoggedIn,adminController.getAdminHome)
router.get('/users',adminAuth.isLoggedIn,adminController.getAdminUser)
router.get('/category',adminAuth.isLoggedIn,adminController.getAdminCategory)
router.get('/addcategory',adminAuth.isLoggedIn,adminController.getAddCategory)
router.get('/products',adminAuth.isLoggedIn,adminController.getAdminProduct)
router.get('/addproduct',adminAuth.isLoggedIn,adminController.getAddProducts)

router.get('/updateproduct',adminAuth.isLoggedIn,adminController.getUpdateProduct)

router.get('/logout',adminAuth.isLoggedIn,adminController.LogoutAdmin)
//------------------------------------------------------//

router.post('/login',adminController.LoginAdmin)
router.put('/users/block/:_id',adminController.blockUser)
//-----------------------------------------------------------//

router.post('/category/add',adminController.addCategory)
router.delete('/category/delete/:_id',adminController.deleteCategory)
//------------------------------------------------------------//

router.post('/products/add',uploadOptions.single('fileName'),adminController.addProduct)
router.put('/products/edit/:_id',adminController.editProduct)
router.delete('/products/delete/:_id',adminController.deleteProduct)  


module.exports = router;