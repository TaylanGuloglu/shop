const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).redirect('/login')
  } catch (error) {
    const errors = validationResult(req);
    console.log(errors);
    console.log(errors.array()[0].msg);

    for (let i = 0; i <errors.array().length; i++) {
      req.flash("error", `${errors.array()[i].msg}`);
    }

    res.status(400).redirect('/register');
  }
};

exports.loginUser = async (req, res) => {
	try {
		const {email,password} = req.body;

	    await User.findOne({email}).then((user) => {
			if(user){
				bcrypt.compare(password, user.password,(err,same) => {
					if(same){
						req.session.userID = user._id;
						res.redirect("/users/dashboard");
					}else{
            req.flash('error', 'Your Password is not correct!')
						res.redirect("/login")
					}
				});
		  	}else{
          req.flash('error', 'User is not exist');
				  res.redirect("/login")
			  }
		})
	} catch(error){
		res.status(400).json({
            status: "Failed",
            error
        })
	}
};

exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  })
}

exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({_id: req.session.userID}).populate('products')
  const categories = await Category.find();
  const products = await Product.find({user: req.session.userID})
  const users = await User.find()
  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
    categories,
    products,
    users
  });
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id)
    await Product.deleteMany({user: req.params.id})
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};


