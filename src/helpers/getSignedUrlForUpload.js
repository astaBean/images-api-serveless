import { FailedToUploadToS3Error } from '../errors/FailedToUploadToS3Error'
import { getS3Client } from './awsClient'
import { getS3BucketName } from './getEnvironmentVariables'

const getSignedUrlForUpload = (client) => {
  // Default is set to 15 min. I am setting it to be 10 min
  const params = {
    Bucket: getS3BucketName(),
    Key: client,
    Expires: 600
  }

  try {
    const s3 = getS3Client()
    const signedURL = s3.getSignedUrl('putObject', params)
    console.info(`Signed url: ${JSON.stringify(signedURL)}`)
    return {
      signedURL
    }
  } catch (error) {
    console.error('Error', error)
    throw new FailedToUploadToS3Error()
  }
}

export {
  getSignedUrlForUpload
}
