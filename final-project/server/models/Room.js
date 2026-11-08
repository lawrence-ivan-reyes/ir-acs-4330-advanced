import mongoose from 'mongoose'

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 50 },
  sunlight: { type: String, trim: true }
})

export default mongoose.model('Room', roomSchema)
