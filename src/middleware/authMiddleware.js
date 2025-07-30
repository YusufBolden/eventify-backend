import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const protect = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      let token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      next()
    } else {
      res.status(401)
      throw new Error('Not authorized, no token')
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error.message)
    res.status(401)
    throw new Error('Not authorized, token failed')
  }
}

export default protect
