import mongoose from 'mongoose'

const careEventSchema = new mongoose.Schema({
  kind: {
    type: String,
    required: true,
    enum: ['WATER', 'FERTILIZE', 'REPOT']
  },
  note: { type: String, trim: true },
  at: { type: Date, default: Date.now }
})

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 50 },
  species: { type: String, trim: true },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
    index: true
  },
  careEvents: [careEventSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

export default mongoose.model('Plant', plantSchema)
