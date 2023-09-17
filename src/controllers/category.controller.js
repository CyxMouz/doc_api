const Category = require("../models/category");

// Create a new category
exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCategory = new Category({ name, description });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Update a category
exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json("Category not found");
    }

    res.json(updatedCategory);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get one category by ID
exports.getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json("Category not found");
    }

    res.json(category);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Read all categories
exports.getAll = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Delete a category by ID
exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json("Category not found");
    }

    res.json(deletedCategory);
  } catch (error) {
    res.status(400).json(error);
  }
};
