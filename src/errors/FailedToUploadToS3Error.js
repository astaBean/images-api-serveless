class FailedToUploadToS3Error extends Error {
  constructor () {
    super('Image failed to upload to s3')
  }
}

export {
  FailedToUploadToS3Error
}
