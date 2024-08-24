const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;


  // A simple validation check
  if (!title || !imageUrl || !price || !description) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description
    })
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
  //!If you have a WEB UI 
  // .then(result => {
  //   res.status(201).json({ message: 'Product created successfully!', product: result });
  // })
  // .catch(err => {
  //   if (err.name === 'SequelizeValidationError') {
  //     return res.status(400).json({ message: 'Validation failed', errors: err.errors });
  //   } else if (err.name === 'SequelizeUniqueConstraintError') {
  //     return res.status(409).json({ message: 'Product with this title already exists' });
  //   }
  //   res.status(500).json({ message: 'Failed to create product.', error: err });
  // });
};

//* use of postAddProduct with async/await
// exports.postAddProduct = async (req, res, next) => {
//   const title = req.body.title;
//   const imageUrl = req.body.imageUrl;
//   const price = req.body.price;
//   const description = req.body.description;

//   // A simple validation check
//   if (!title || !imageUrl || !price || !description) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   try {
//     const result = await req.user.createProduct({
//       title: title,
//       price: price,
//       imageUrl: imageUrl,
//       description: description
//     });
//     console.log('Created Product');
//     res.redirect('/admin/products');
//     //!If you have a WEB UI
//     // res.status(201).json({ message: 'Product created successfully!', product: result });
//   } catch (err) {
//     console.log(err);
//     //!If you have a WEB UI
//     // if (err.name === 'SequelizeValidationError') {
//     //   return res.status(400).json({ message: 'Validation failed', errors: err.errors });
//     // } else if (err.name === 'SequelizeUniqueConstraintError') {
//     //   return res.status(409).json({ message: 'Product with this title already exists' });
//     // }
//     // res.status(500).json({ message: 'Failed to create product.', error: err });
//   }
// };



exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;

  req.user
    .getProducts({ where: { id: prodId } })
    // Product.findById(prodId)
    .then(products => {
      const product = products[0];
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
  //!If you have a WEB UI 
  // req.user
  // .getProducts({ where: { id: prodId } })
  // .then(products => {
  //   const product = products[0];
  //   if (!product) {
  //     return res.status(404).json({ message: 'Product not found' });
  //   }
  //   res.status(200).json({ product: product });
  // })
  // .catch(err => {
  //   res.status(500).json({ message: 'Failed to retrieve product.', error: err });
  // });
};


exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
  //!If you have a WEB UI
  //   .then(result => {
  //   res.status(200).json({ message: 'Product updated successfully!', product: result });
  // })
  // .catch(err => {
  //   res.status(500).json({ message: 'Failed to update product.', error: err });
  // });
};


//! If you have a WEB user interface then you will use the PUT method with the API (React, Vue.js, Angular)

// exports.putEditProduct = (req, res, next) => {
//   const prodId = req.params.productId;  // URL parametresinden productId'yi alıyoruz (PUT metodunda)
//   const updatedTitle = req.body.title;
//   const updatedPrice = req.body.price;
//   const updatedImageUrl = req.body.imageUrl;
//   const updatedDesc = req.body.description;

//   Product.findById(prodId)
//     .then(product => {
//       if (!product) {
//         return res.status(404).json({ message: 'Product not found' });
//       }
//       product.title = updatedTitle;
//       product.price = updatedPrice;
//       product.description = updatedDesc;
//       product.imageUrl = updatedImageUrl;
//       return product.save();  // Ürünü güncelliyoruz
//     })
//     .then(result => {
//       console.log('UPDATED PRODUCT!');
//       res.status(200).json({ message: 'Product updated successfully!', product: result });  // Başarıyla güncellendiğini JSON olarak döndürüyoruz
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({ message: 'Failed to update product.', error: err });
//     });
// };


exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
  //!If you have a WEB UI
  // then(products => {
  //   res.status(200).json({
  //     products: products,
  //     pageTitle: 'Admin Products',
  //     path: '/admin/products'
  //   });
  // })
  // .catch(err => {
  //   res.status(500).json({ message: 'Failed to fetch products.', error: err });
  // });
};


exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

//! If you have a WEB user interface then you will use the DELETE method with the API (React, Vue.js, Angular)

// exports.deleteProduct = (req, res, next) => {
//   const prodId = req.params.productId;  // URL parametresinden productId'yi alıyoruz (DELETE metodunda)

//   Product.findById(prodId)  // Veritabanında bu ID'ye sahip ürünü buluyoruz
//     .then(product => {
//       if (!product) {
//         return res.status(404).json({ message: 'Product not found' });
//       }
//       return product.destroy();  // Ürünü veritabanından siliyoruz
//     })
//     .then(result => {
//       console.log('DESTROYED PRODUCT');
//       res.status(200).json({ message: 'Product deleted successfully!' });  // Başarıyla silindiğini JSON olarak döndürüyoruz
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({ message: 'Failed to delete product.', error: err });
//     });
// };