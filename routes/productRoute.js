const express = require('express')
const productController = require('../controllers/productController')
const roleMiddleware = require('../middlewares/roleMiddleware')

const router = express.Router();

router.route('/').post(roleMiddleware(['teacher', 'admin']), productController.createProduct); // http://localhost:3000/courses
router.route('/').get(productController.getAllProducts);
router.route('/:slug').get(productController.getProduct);
router.route('/:slug').delete(productController.deleteProduct);
router.route('/:slug').put(productController.updateProduct);
router.route('/enroll').post(productController.addToCart);
router.route('/drop').post(productController.dropFromCart);

module.exports = router;