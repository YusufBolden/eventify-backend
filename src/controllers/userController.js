import User from '../models/User.js'
import Event from '../models/Event.js'
import jwt from 'jsonwebtoken'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// Register
export const registerUser = async (req, res) => {
  const { name, email, password, isAdmin } = req.body
  const normalizedEmail = email.toLowerCase().trim()

  try {
    const userExists = await User.findOne({ email: normalizedEmail })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      isAdmin,
    })

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePic: user.profilePic,
        token: generateToken(user._id),
      })
    } else {
      return res.status(400).json({ message: 'Invalid user data' })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body
  const normalizedEmail = email.toLowerCase().trim()

  try {
    const user = await User.findOne({ email: normalizedEmail })

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePic: user.profilePic,
        token: generateToken(user._id),
      })
    } else {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

// Get logged-in user's profile
export const getUserProfile = (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    isAdmin: req.user.isAdmin,
    profilePic: req.user.profilePic,
  })
}

// Update logged-in user's profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.name = req.body.name || user.name
    user.email = req.body.email?.toLowerCase().trim() || user.email
    if (req.body.profilePic) user.profilePic = req.body.profilePic
    if (req.body.password) user.password = req.body.password

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      profilePic: updatedUser.profilePic,
      token: generateToken(updatedUser._id),
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

// Admin — Get all users
export const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password')
  res.json(users)
}

// Admin — Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const events = await Event.find({ owner: user._id })
    res.json({ user, events })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Admin — Get events for a specific user
export const getUserEvents = async (req, res) => {
  try {
    const { id } = req.params
    const events = await Event.find({ owner: id })
    res.json(events)
  } catch (error) {
    console.error('Get User Events Error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Admin — Update user by ID
export const updateUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.name = req.body.name || user.name
    user.email = req.body.email?.toLowerCase().trim() || user.email
    if (typeof req.body.isAdmin !== 'undefined') {
      user.isAdmin = req.body.isAdmin
    }
    if (req.body.profilePic) user.profilePic = req.body.profilePic
    if (req.body.password) user.password = req.body.password

    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      profilePic: updatedUser.profilePic
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Admin — Delete user by ID
export const deleteUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    await user.deleteOne()
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
