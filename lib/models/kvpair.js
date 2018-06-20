import mongoose from 'mongoose'

/**
 * TODO: move configs to database.
 */
const KeyValuePairSchema = mongoose.Schema({
  k: {
    type: String,
    required: true
  },
  v: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
})

KeyValuePairSchema.statics.findByKey = function (key, callback) {
  return this.findOne({'k': key}, callback)
}

export default mongoose.model('KeyValuePairSchema', KeyValuePairSchema)
