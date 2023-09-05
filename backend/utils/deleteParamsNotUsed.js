module.exports = suppNotUsed = (prop) => {
  for (const property in prop) {
    if (!prop[property]) {
      delete prop[property]
    }
  }
  return prop
}