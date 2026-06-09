const protect = (req, res, next) => {
  res.status(501).json({ message: 'Auth middleware not implemented' });
};

export default protect;
