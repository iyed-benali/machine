const Admin = require('../../Models/Admin/Admin');
const Profile = require('../../Models/Profile/Profile');
const VendingMachineOwner = require('../../Models/Vending-machine-owner/Vending-machine-owner')

exports.createAdmin = async (req, res) => {
  try {

    const profileData = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      role: 'admin'
    };

    const profile = new Profile(profileData);
    await profile.save();

    
    const adminData = {
      profileId: profile._id,
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      accessLevel: req.body.accessLevel || 'moderator' 
    };

    const newAdmin = new Admin(adminData);
    await newAdmin.save();

    res.status(201).json({
      message: 'Admin created successfully',
      admin: newAdmin,
      profile: profile
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.getAllOwnersWithVendingMachineCount = async (req, res) => {
  try {
    const owners = await VendingMachineOwner.aggregate([
      {
        $lookup: {
          from: 'vendingmachines',
          localField: 'vendingMachines',
          foreignField: '_id',
          as: 'vendingMachineDetails',
        },
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          email: 1,
          vendingMachineCount: { $size: '$vendingMachineDetails' },
        },
      },
    ]);

    res.status(200).json({
      ok: true,
      owners,
    });
  } catch (error) {
    console.error('Error fetching owners:', error.message);
    res.status(500).json({
      ok: false,
      message: 'Server error',
    });
  }
};
exports.searchOwnerByNameOrEmail = async (req, res) => {
  const { query } = req.query; 
  const { adminId } = req.params; 
  if (!query) {
    return res.status(400).json({ ok: false, message: 'Query parameter is required' });
  }

  try {
    
    const owners = await VendingMachineOwner.find({
      $or: [
        { fullName: new RegExp(query, 'i') }, 
        { email: new RegExp(query, 'i') },  
      ],
    }).select('fullName email vendingMachines');

    if (owners.length > 0) {
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return res.status(404).json({ ok: false, message: 'Admin not found' });
      }

      
      if (!admin.searchList.includes(query)) {
        admin.searchList.push(query);
        await admin.save();
      }
    }

    res.status(200).json({ ok: true, owners });
  } catch (error) {
    console.error('Error searching for owners:', error.message);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
};


exports.viewAdminSearchList = async (req, res) => {
  const { adminId } = req.params; 
  if (!adminId) {
    return res.status(400).json({ ok: false, message: 'Admin ID is required' });
  }

  try {
    const admin = await Admin.findById(adminId).select('searchList');
    if (!admin) {
      return res.status(404).json({ ok: false, message: 'Admin not found' });
    }

    res.status(200).json({ ok: true, searchList: admin.searchList });
  } catch (error) {
    console.error('Error fetching search list:', error.message);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
};

exports.deleteAdminSearchListItem = async (req, res) => {
  const { adminId } = req.params; 
  const { item } = req.body; 

  if (!adminId || !item) {
    return res.status(400).json({ ok: false, message: 'Admin ID and search item are required' });
  }

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ ok: false, message: 'Admin not found' });
    }
    admin.searchList = admin.searchList.filter(searchItem => searchItem !== item);
    await admin.save();

    res.status(200).json({ ok: true, message: 'Search item deleted successfully', searchList: admin.searchList });
  } catch (error) {
    console.error('Error deleting search item:', error.message);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
};

exports.clearAdminSearchList = async (req, res) => {
  const { adminId } = req.params;

  if (!adminId) {
    return res.status(400).json({ ok: false, message: 'Admin ID is required' });
  }

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ ok: false, message: 'Admin not found' });
    }

    admin.searchList = [];
    await admin.save();

    res.status(200).json({ ok: true, message: 'Search list cleared successfully', searchList: admin.searchList });
  } catch (error) {
    console.error('Error clearing search list:', error.message);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
};
