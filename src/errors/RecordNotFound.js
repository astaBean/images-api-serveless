import CONTENT_STRINGS from '../constants/contentStrings.json'

class RecordNotFound extends Error {
  constructor () {
    super(CONTENT_STRINGS.ERROR__IMAGE_NOT_FOUND)
  }
}

export {
  RecordNotFound
}
