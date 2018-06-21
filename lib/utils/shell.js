export function exec (tool, params, callback) {
  const {spawn} = require('child_process')
  const child = spawn(tool, params)

  const chunks = []
  const errors = []

  child.on('exit', () => {
    let result = Buffer.concat(chunks).toString()
    let e = errors && errors.length > 0 ? Buffer.concat(errors).toString() : null

    callback(e ? new Error(e) : null, result)
  })

  child.stdout.on('data', (data) => {
    chunks.push(data)
  })

  child.stderr.on('data', (data) => {
    errors.push(data)
  })
}
