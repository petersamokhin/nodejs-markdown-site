import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'

/**
 * Model for user.
 */
const UserSchema = mongoose.Schema({
  login: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    type: Array,
    required: true
  }
})

UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

UserSchema.statics.getAllRoles = function (callback) {
  return this.find({}, 'roles', (err, docs) => {
    callback(err, docs.map(item => item.roles).reduce((x, y) => x.concat(y), []))
  })
}

UserSchema.statics.getAllUsers = function (callback) {
  return this.find({}, callback)
}

UserSchema.statics.findByLogin = function (login, callback) {
  return this.findOne({'login': login}, callback)
}

export default mongoose.model('User', UserSchema)
