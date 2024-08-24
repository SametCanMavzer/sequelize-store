const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
  //!If you have a WEB UI 
  // .then(products => {
  //   res.status(200).json({
  //     products: products,
  //     pageTitle: 'All Products',
  //   });
  // })
  // .catch(err => {
  //   res.status(500).json({ message: 'Failed to fetch products.', error: err });
  // });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
  //!If you have a WEB UI 
  // .then(product => {
  //   if (!product) {
  //     return res.status(404).json({ message: 'Product not found' });
  //   }
  //   res.status(200).json({ product: product });
  // })
  // .catch(err => {
  //   res.status(500).json({ message: 'Failed to fetch product.', error: err });
  // });
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

//* use of getCart with async/await
// exports.getCart = async (req, res, next) => {
//   try {
//     const cart = await req.user.getCart();
//     const products = await cart.getProducts();
//     res.render('shop/cart', {
//       path: '/cart',
//       pageTitle: 'Your Cart',
//       products: products
//     });
//   } catch (err) {
//     console.log(err);
//     next(err); // Hata durumunu Express'e iletmek için
//   }
// };


exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findById(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
  //!If you have a WEB UI 
  // .then(() => {
  //   res.status(200).json({ message: 'Product added to cart successfully!' });
  // })
  // .catch(err => {
  //   res.status(500).json({ message: 'Failed to add product to cart.', error: err });
  // });
};


exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
  //!If you have a WEB UI 
  // .then(result => {
  //   res.status(200).json({ message: 'Order created successfully!' });
  // })
  // .catch(err => {
  //   res.status(500).json({ message: 'Failed to create order.', error: err });
  // });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
  //!If you have a WEB UI 
  // .then(orders => {
  //   res.status(200).json({ orders: orders });
  // })
  // .catch(err => {
  //   res.status(500).json({ message: 'Failed to fetch orders.', error: err });
  // });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

//! If you have a WEB user interface then you will use the DELETE method with the API (React, Vue.js, Angular)

// exports.deleteCartProduct = (req, res, next) => {
//   const prodId = req.params.productId;
//   req.user
//     .getCart()
//     .then(cart => {
//       return cart.getProducts({ where: { id: prodId } });
//     })
//     .then(products => {
//       const product = products[0];
//       return product.cartItem.destroy();
//     })
//     .then(result => {
//       res.status(200).json({ message: 'Product removed from cart successfully!' });
//     })
//     .catch(err => {
//       res.status(500).json({ message: 'Failed to remove product from cart.', error: err });
//     });
// };

