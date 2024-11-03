const Client = require('../../models/client');

exports.updateRecentSearch = async (clientId, searchTerm) => {
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
  