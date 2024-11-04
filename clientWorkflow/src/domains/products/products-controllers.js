// controllers/productController.js
const Product = require('../../../../authWorkflow/src/models/Products/products');
const VendingMachine = require('../../../../authWorkflow/src/models/Vending-Machines/vendingMachines');
const { createErrorResponse } = require('../../../../authWorkflow/src/utils/errorHandle'); 

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500));
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500));
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json(createErrorResponse('Product not found', 404));
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500));
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json(createErrorResponse('Product not found', 404));
    }
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500));
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json(createErrorResponse('Product not found', 404));
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500));
  }
};
exports.getProductsByVendingMachineId = async (req, res) => {
    try {
      const vendingMachine = await VendingMachine.findById(req.params.id).populate('products');
      if (!vendingMachine) {
        return res.status(404).json(createErrorResponse('Vending machine not found', 404));
      }
      res.status(200).json(vendingMachine.products);
    } catch (error) {
      res.status(500).json(createErrorResponse('Server error', 500));
    }
  };