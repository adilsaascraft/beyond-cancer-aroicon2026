
import mongoose, { Schema, models } from 'mongoose'

const RegisterSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid Email ID',
      ],
    },

    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
      trim: true,
      match: [
        /^\+?[0-9]{10,13}$/,
        'Mobile number must contain 10 to 13 digits, with an optional + prefix',
      ],
    },

    affiliation: {
      type: String,
      required: [true, 'Affiliation / Organization is required'],
      trim: true,
    },

    // Generated automatically by backend
    regNum: {
      type: String,
      unique: true,
      required: [true, 'Registration number is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

export default models.Register ||
  mongoose.model('Register', RegisterSchema)
