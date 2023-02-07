const { Category } = require('../model/category')
const { Product } = require('../model/product')
const { User } = require('../model/users')
const Order = require('../model/order')
const adminEmail = "neerajng@gmail.com"
const adminPass = "admin"
module.exports = {
  getAdminLogin: (req, res) => {
    res.render('adminLogin')
  },
  getAdminHome: (req, res) => {
    try {
      res.render('adminHome')
    } catch (e) {
      console.log(e)
    }
  },
  getAdminUser: async (req, res) => {
    try {
      const users = await User.find()
      console.log(users)
      return res.render("adminUsers", { users: users })
    } catch (err) {
      console.log(err);
    }
  },

  getAdminCategory: async (req, res) => {
    try {
      const categoryList = await Category.find();
      res.render('adminCategory', { categoryList })
    } catch (e) {
      console.log(e)
      res.render('adminCategory')
    }
  },

  getAddCategory: (req, res) => {
    try {
      if (req.session.message) {        
        const message = req.session.message
        req.session.message = null
        res.render('adminAddCategory', { message })
      } else {
        res.render('adminAddCategory')
      }
    } catch (e) {
      console.log(e);
    }
  },

  getAdminProduct: async (req, res) => {
    console.log("getAdminProduct listing")
    const productList = await Product.find().populate('category');
    if (!productList) {
      res.status(500).json({ success: false })
    }
    res.render('adminProducts', { productList })
  },
  getAddProducts: async (req, res) => {
    const category = await Category.find();
    if (!category) {
      res.staus(500).json({ success: false })
    }
    res.render('adminAddproducts', { category })
  },
  getUpdateProduct: async (req, res) => {
    try {
      console.log("getUpdateProduct")
      const id = req.params._id
      const product = await Product.findById(id).populate('category');
      const categories = await Category.find();
      if (!product) {
        res.status(500).json({ success: false })
      }
      res.render('adminUpdateProducts', { categories, product })
    } catch (e) {
      res.render('adminUpdateProducts', { message: "error happend" })
    }
  },
  getAdminOrders: (req, res) => {
    res.render('adminOrders')
  },

  //for chart
  getchartData: async (req, res, next) => {
    console.log('getchartData controller works');
    try {

      const productWiseSale = await Order.aggregate(
        [
          {
            '$lookup': {
              'from': 'products',
              'localField': 'orderItems.id',
              'foreignField': '_id',
              'as': 'test'
            }
          }, {
            '$unwind': {
              'path': '$test'
            }
          }, {
            '$group': {
              '_id': '$test.name',
              'totalAmount': {
                '$sum': '$totalAmount'
              }
            }
          }
        ]
      )

      console.log(productWiseSale);
      return res.json({ productWiseSale: productWiseSale })
    } catch (err) {
      console.log(err)
    }
  },
  showChart: (req, res) => {
    res.render('adminChart')
  },
  //--------------------------------------------------------//
  LoginAdmin: (req, res) => {
    req.session.admin = true; ``
    return res.redirect('/admin/home')
  },
  blockUser: async (req, res) => {
    console.log("007")
    const id = req.params._id
    const user = await User.findById(id)
    console.log(id)
    console.log(user)
    if (user.isBlocked) {
      try {
        await User.findOneAndUpdate({ _id: id }, {
          $set: {
            isBlocked: false
          }
        })
        return res.json({
          redirect: "/admin/users"
        })
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        const user = await User.findOneAndUpdate({ _id: id }, {
          $set: {
            isBlocked: true
          }
        })
        return res.json({
          redirect: "/admin/users"
        })
      } catch (error) {
      }
    }
  },
  LogoutAdmin: (req, res) => {
    req.session.admin = null;
    res.redirect('/admin/login')
  },
  //----------------------------------------------------------------//
  addCategory: async (req, res) => {
    try {
      let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
      })
      category = await category.save();
      res.redirect('/admin/category')
    } catch (e) {
      console.log(e)
      const index = e.message.indexOf('name:') + 6;
      const message = e.message.substring(index)
      if (e.code === 11000) {
      req.session.message = 'Category Name already exists'
      }else{
      req.session.message = message
      }
      res.redirect('/admin/addcategory')
    }
  },

  deleteCategory: async (req, res) => {
    console.log("1")
    const id = req.params._id
    const category = await Category.findById(id)
    console.log(id)
    console.log(category)
    // try {
    //   await Category.findByIdAndRemove(id)
    //     .then((category) => {
    //       if (category) {
    //         return res.status(200).json({ redirect: "/admin/category" })
    //       } else {
    //         return res.status(404).json({ redirect: "/admin/category" })
    //       }
    //     }).catch(err => {
    //       return res.status(400).json({ redirect: "/admin/category" })
    //     })

    // } catch (error) {
    //   console.log(error)
    // }
    if (category.isBlocked) {
      try {
        await Category.findOneAndUpdate({ _id: id }, {
          $set: {
            isBlocked: false
          }
        })
        return res.json({
          redirect: "/admin/category"
        })
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        await Category.findOneAndUpdate({ _id: id }, {
          $set: {
            isBlocked: true
          }
        })
        return res.json({
          redirect: "/admin/category"
        })
      } catch (error) {
      }
    }
    

  },
  //--------------------------------------------------------------//
  addProduct: async (req, res) => {
    const category = await Category.findById(req.body.category)
    console.log(category)
    if (!category) return res.status(400).send('Invalid Category')

    const fileName = await req.file.filename;
    console.log(fileName)
    const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
    let product = new Product({
      name: req.body.name,
      price: req.body.price,
      image: `${basePath}${fileName}`,
      description: req.body.description,
      category: req.body.category,
      stock: req.body.stock
    })

    product = await product.save();

    if (!product)
      return res.status(500).send('The product cannot be created')
    res.redirect('/admin/products')

  },

  editProduct: async (req, res) => {
    const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
    const fileName = await req.file.filename;
    const img = `${basePath}${fileName}`
    const id = await req.params._id
    console.log(id);
    try {
      const product = await Product.findByIdAndUpdate(
        id,
        {
          name: req.body.name,
          price: req.body.price,
          image: img,
          description: req.body.description,
          category: req.body.category,
          stock: req.body.stock
        },
        { new: true }
      )
      console.log(product)
      return res.status(200).json({ redirect: "/admin/products/" })
    } catch (e) {
      console.log(e)
      return res.status(200).json({ redirect: "/admin/updateproduct/" })
    }
  },

  deleteProduct: async (req, res) => {
    console.log("007")
    const id = req.params._id
    const product = await Product.findById(id)
    console.log(id)
    console.log(product)

    if (product.isBlocked) {
      try {
        await Product.findOneAndUpdate({ _id: id }, {
          $set: {
            isBlocked: false
          }
        })
        return res.json({
          redirect: "/admin/products"
        })
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        const product = await Product.findOneAndUpdate({ _id: id }, {
          $set: {
            isBlocked: true
          }
        })
        return res.json({
          redirect: "/admin/products"
        })
      } catch (error) {
      }
    }



  }
}
