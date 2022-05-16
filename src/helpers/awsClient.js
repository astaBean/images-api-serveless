import AWS from 'aws-sdk'
import { isLocalEnvironment, getAwsRegion } from './getEnvironmentVariables'

const getS3Client = () => {
  const endpoint = isLocalEnvironment() ? 'http://localhost:4569' : undefined
  return new AWS.S3({ signatureVersion: 'v4', region: getAwsRegion(), endpoint })
}

export {
  getS3Client
}
