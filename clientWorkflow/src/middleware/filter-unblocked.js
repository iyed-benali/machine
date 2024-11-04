
const VendingMachine = require('../../../authWorkflow/src/models/Vending-Machines/vendingMachines');


const filterUnblocked = async (req, res, next) => {
    try {
      req.unblockedFilter = { blocked: false }; 
      next();
    } catch (error) {
      res.status(500).json({ message: 'Error applying filter', error });
    }
  };
  
  module.exports = filterUnblocked;
  