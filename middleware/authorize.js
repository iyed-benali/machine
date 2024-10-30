// middleware/authorize.js

const authorize = (requiredRole) => {
    return (req, res, next) => {
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Access forbidden:' });
      }
      next();
    };
  };
  
  module.exports = authorize;
  