const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price:req.body.price,
      user: req.session.userID,
    });

    req.flash('success', `${product.name} has been created successfully`);
    res.status(201).redirect('/products');
  } catch (error) {
    req.flash('error', `${product.name} something happened!!!`);
    res.status(400).redirect('/products');
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const categorySlug = req.query.categories;
    const query = req.query.search;

    const category = await Category.findOne({ slug: categorySlug });

    let filter = {};

    if (categorySlug) {
      filter = { category: category._id };
    }

    if (query) {
      filter = { name: query };
    }

    if (!query && !categorySlug) {
      (filter.name = ''), (filter.category = null);
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: '.*' + filter.name + '.*', $options: 'i' } },
        { category: filter.category },
      ],
    })
      .sort('-createdAt')
      .populate('user');

    const categories = await Category.find();

    res.status(200).render('products', {
      products,
      categories,
      page_name: 'products',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    const product = await Product.findOne({ slug: req.params.slug }).populate(
      'user'
    );
    const categories = await Category.find();

    res.status(200).render('product', {
      product,
      page_name: 'products',
      user,
      categories,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.products.push({ _id: req.body.product_id });
    await user.save();

    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.dropFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.products.pull({ _id: req.body.product_id });
    await user.save();

    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndRemove({slug:req.params.slug})
    req.flash('error', `${product.name} has been removed successfully`);
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({slug:req.params.slug});
    product.name = req.body.name;
    product.description = req.body.description;
    product.category = req.body.category;
    product.price = req.body.price

    course.save();

    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
