import CONTENT_STRINGS from '../constants/contentStrings.json'

class FailedToUploadToS3Error extends Error {
  constructor () {
    super(CONTENT_STRINGS.ERROR__IMAGE_FAILED_TO_UPLOAD_TO_S3)
  }
}

export {
  FailedToUploadToS3Error
}
