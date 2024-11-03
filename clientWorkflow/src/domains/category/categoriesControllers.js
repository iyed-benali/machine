// controllers/categoryController.js
const Category = require('../models/Category');
const { createErrorResponse } = require('../../../../authWorkflow/src/utils/errorHandle'); 
exports.createCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500)); 
  }
};


exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500));
  }
};


exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json(createErrorResponse('Category not found', 404)); 
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500)); 
  }
};


exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      return res.status(404).json(createErrorResponse('Category not found', 404));
    }
    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500)); 
  }
};


exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json(createErrorResponse('Category not found', 404)); 
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500)); // Use createErrorResponse for error handling
  }
};
