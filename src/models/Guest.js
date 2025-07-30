import mongoose from 'mongoose'

const guestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    rsvpStatus: {
      type: String,
      enum: ['Yes', 'No', 'Maybe'],
      default: 'Maybe',
    },
    mealChoice: {
      type: String,
      enum: ['Chicken', 'Beef', 'Vegan', 'Fish', 'Other'],
      default: 'Chicken',
    },
    message: { type: String },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
  },
  { timestamps: true }
)

const Guest = mongoose.model('Guest', guestSchema)
export default Guest
