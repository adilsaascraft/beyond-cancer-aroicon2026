import mongoose, { Schema, models } from 'mongoose'

// Atomic counter used to generate registration numbers safely
const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, required: true, default: 0 },
})

export default models.Counter || mongoose.model('Counter', CounterSchema)
