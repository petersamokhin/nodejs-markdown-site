import mongoose from 'mongoose'

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

PathSchema.statics.getAllRoles = function (callback) {
  return this.find({}, 'roles', (err, docs) => {
    callback(err, docs.map(item => item.roles).reduce((x, y) => x.concat(y), []))
  })
}

export default mongoose.model('PathSchema', PathSchema)
