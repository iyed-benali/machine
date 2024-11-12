// controllers/vendingMachineOwnerController.js

const VendingMachineOwner = require('../../Models/Vending-machine-owner/Vending-machine-owner');
const Profile = require('../../Models/Profile/Profile');
const createErrorResponse = require('../../Utils/Error-handle');

exports.createVendingMachineOwner = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingProfile = await Profile.findOne({ email });
    if (existingProfile) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

  
    const newProfile = new Profile({
      fullName,
      email,
      password, 
      role: 'machine owner'
    });
    await newProfile.save();

   
    const newOwner = new VendingMachineOwner({
      fullName,
      email,
      vendingMachines: [], 
    });
    await newOwner.save();

    res.status(201).json({
      message: 'Vending Machine Owner created successfully',
      owner: {
        id: newOwner._id,
        fullName: newOwner.fullName,
        email: newOwner.email,
        profileId: newProfile._id,
      }
    });
  } catch (error) {
    res.status(500).json(createErrorResponse('Server error', 500));
  }
};
