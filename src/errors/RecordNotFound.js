class RecordNotFound extends Error {
  constructor () {
    super('Image not found')
  }
}

export {
  RecordNotFound
}
