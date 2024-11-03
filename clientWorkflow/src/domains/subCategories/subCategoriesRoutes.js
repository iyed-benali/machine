const express = require('express');
const router = express.Router();
const subCategoryController = require("../subCategories/subCategoryControllers");

router.post('/', subCategoryController.createSubCategory);


router.get('/', subCategoryController.getAllSubCategories);


router.get('/:id', subCategoryController.getSubCategoryById);


router.put('/:id', subCategoryController.updateSubCategory);

router.delete('/:id', subCategoryController.deleteSubCategory);


router.get('/category/:categoryId', subCategoryController.getSubCategoriesByCategoryId);


router.get('/subcategories/type/:type', subCategoryController.getSubCategoriesByType);


module.exports = router;
