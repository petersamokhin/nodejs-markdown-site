import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'

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
    callback(err, docs.flatMap(item => item.roles))
  })
}

export default mongoose.model('User', UserSchema)

Array.prototype.flatMap = function (f) {
  return this.map(f).reduce((x, y) => x.concat(y), [])
}