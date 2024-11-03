
const VendingMachine = require('../../models/vendingMachines')
const Product = require('../../models/products')
const SubCategory = require('../../models/subCategories')
const Category = require('../../models/categories')
const { createErrorResponse } = require('../../../../authWorkflow/src/utils/errorHandle'); 
// const updateRecentSearch = require('../client/client-controller')
const Client = require('../../models/client')

const updateRecentSearch = async (clientId, searchTerm) => {
    try {
      await Client.findByIdAndUpdate(
        clientId,
        { $addToSet: { recent_search: searchTerm } },
        { new: true }
      );
    } catch (error) {
      console.error('Error updating recent searches:', error);
    }
  };
  

exports.createVendingMachine = async (req, res) => {
  try {
    const newVendingMachine = new VendingMachine(req.body);
    await newVendingMachine.save();
    res.status(201).json({ message: 'Vending Machine created successfully', vendingMachine: newVendingMachine });
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500));
  }
};

// Get all vending machines
exports.getAllVendingMachines = async (req, res) => {
  try {
    const vendingMachines = await VendingMachine.find().populate('categories').populate('subCategories').populate('products');
    res.status(200).json(vendingMachines);
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500));
  }
};

// Get a vending machine by ID
exports.getVendingMachineById = async (req, res) => {
  try {
    const vendingMachine = await VendingMachine.findById(req.params.id).populate('categories').populate('subCategories').populate('products');
    if (!vendingMachine) {
      return res.status(404).json(createErrorResponse('Vending Machine not found', 404));
    }
    res.status(200).json(vendingMachine);
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500));
  }
};

// Update a vending machine
exports.updateVendingMachine = async (req, res) => {
  try {
    const vendingMachine = await VendingMachine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vendingMachine) {
      return res.status(404).json(createErrorResponse('Vending Machine not found', 404));
    }
    res.status(200).json({ message: 'Vending Machine updated successfully', vendingMachine });
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500));
  }
};

// Delete a vending machine
exports.deleteVendingMachine = async (req, res) => {
  try {
    const vendingMachine = await VendingMachine.findByIdAndDelete(req.params.id);
    if (!vendingMachine) {
      return res.status(404).json(createErrorResponse('Vending Machine not found', 404));
    }
    res.status(200).json({ message: 'Vending Machine deleted successfully' });
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500));
  }
};

exports.searchVendingMachines = async (req, res) => {
    const { searchTerm, clientId } = req.query;
    if (!searchTerm || !clientId) {
      return res.status(400).json({ message: 'Search term and client ID are required' });
    }
  
    try {
      // Update the recent search for the client
      await updateRecentSearch(clientId, searchTerm);
  
      const categories = await Category.find({ title: new RegExp(searchTerm, 'i') });
      const subCategories = await SubCategory.find({ title: new RegExp(searchTerm, 'i') });
      const products = await Product.find({
        $or: [
          { name: new RegExp(searchTerm, 'i') },
          { subName: new RegExp(searchTerm, 'i') }
        ]
      });
  
      const categoryIds = categories.map(cat => cat._id);
      const subCategoryIds = subCategories.map(subCat => subCat._id);
      const productIds = products.map(prod => prod._id);
  
      const vendingMachines = await VendingMachine.find({
        $or: [
          { categories: { $in: categoryIds } },
          { subCategories: { $in: subCategoryIds } },
          { products: { $in: productIds } }
        ]
      }).populate('categories subCategories products');
  
      res.status(200).json(vendingMachines);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  