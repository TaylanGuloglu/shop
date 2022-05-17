const nodemailer = require("nodemailer");
const Product = require('../models/Product')
const User = require('../models/User')


exports.getIndexPage = async (req, res) => {
  
  const products = await Product.find().sort('-createdAt').limit(2);
  const totalCourses = await Product.find().countDocuments();
  const totalStudents = await User.countDocuments({role: 'student'})
  const totalTeachers = await User.countDocuments({role: 'teacher'})


  res.status(200).render('index', {
    page_name: 'index',
    products,
    totalCourses,
    totalStudents,
    totalTeachers
  });
};

exports.getAboutPage = (req, res) => {
  res.status(200).render('about', {
    page_name: 'about',
  });
};

exports.getRegisterPage = (req, res) => {
  res.status(200).render('register', {
    page_name: 'register',
  });
};

exports.getLoginPage = (req, res) => {
  res.status(200).render('login', {
    page_name: 'login',
  });
};

exports.getContactPage = (req, res) => {
  res.status(200).render('contact', {
    page_name: 'contact',
  });
};

exports.sendEmail = async(req, res) => {

  try{

  const outputMessage = `
  
  <h1> Mail Details </h1>
  <ul> 
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
  </ul>
  <h1> Message </h1>
  <p> ${req.body.message}</p>
  
  `

  let transporter = nodemailer.createTransport({
    
   

    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "taylanodejs@gmail.com", // gmail account
      pass: "giskuwvkyoueshav", // gmail password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Smart Edu Contact Form " <taylanodejs@gmail.com> ', // sender address
    to: "ffchegg@gmail.com", // list of receivers
    subject: "Smart Edu Contact Form New Message", // Subject line
    html: outputMessage, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  req.flash('success', 'We Receieved Your Message Successfully')

  res.status(200).redirect('contact')
  } catch (err) {
    req.flash("error", `Something happened! ${err}`);
    //req.flash("error", `Something happened!`);
    res.status(200).redirect('contact');

  }
};
