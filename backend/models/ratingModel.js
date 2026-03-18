import mongoose from 'mongoose'

const ratingSchema = new mongoose.Schema({
  docId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  date: { type: Number, default: Date.now }
})

ratingSchema.index({ docId: 1, userId: 1 }, { unique: true })

const ratingModel = mongoose.models.rating || mongoose.model('rating', ratingSchema)

export default ratingModel
