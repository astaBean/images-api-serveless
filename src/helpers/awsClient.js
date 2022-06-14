import AWS from 'aws-sdk'
import { getAwsRegion, isLocalEnvironment } from './getEnvironmentVariables'

const getS3Client = () => {
  const endpoint = isLocalEnvironment === true ? 'http://localhost:4569' : undefined
  console.info(`Endpoint - ${endpoint}`)
  return new AWS.S3({ signatureVersion: 'v4', region: getAwsRegion(), endpoint })
}

export {
  getS3Client
}
