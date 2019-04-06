import mongoose from 'mongoose'

const KeyValuePairSchema = mongoose.Schema({
  k: {
    type: String,
    required: true
  },
  v: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  type: String,
  title: String,
  description: String
})

KeyValuePairSchema.statics.findByKey = function (key, callback) {
  return this.findOne({ 'k': key }, callback)
}

KeyValuePairSchema.statics.findByKeys = function (keys, callback) {
  return this.find({ 'k': { $in: keys } }, callback)
}

export default mongoose.model('KeyValuePairSchema', KeyValuePairSchema)
