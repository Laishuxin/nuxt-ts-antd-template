const baseConfigGen = require('./tailwind-base')
const { palette } = require('./config')

module.exports = baseConfigGen({
  ...palette,
})
