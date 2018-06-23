import mongoose from 'mongoose'

/**
 * Model for information about access to locations
 * and manual management.
 */
const PathSchema = mongoose.Schema({
  path: {
    type: String,
    required: true
  },
  roles: {
    type: Array,
    required: true
  }
})

PathSchema.statics.findByPath = function (path, callback) {
  return this.findOne({'path': path}, callback)
}

PathSchema.statics.findManyByPaths = function (paths, callback) {
  return this.find({
    'path': {
      $in: paths
    }
  }, callback)
}

PathSchema.statics.getAll = function (callback) {
  return this.find({}, (err, docs) => {
    callback(err, docs)
  })
}

PathSchema.statics.getAllRoles = function (callback) {
  return this.find({}, 'roles', (err, docs) => {
    callback(err, docs.map(item => item.roles).reduce((x, y) => x.concat(y), []))
  })
}

PathSchema.statics.deleteByPath = function (path) {
  return this.findOneAndDelete({path: path})
}

export default mongoose.model('PathSchema', PathSchema)
