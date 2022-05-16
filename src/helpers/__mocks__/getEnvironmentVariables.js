const getS3BucketName = jest.fn().mockReturnValue('bucket')
const getAwsRegion = jest.fn().mockReturnValue('region')
const isLocalEnvironment = jest.fn().mockReturnValue(true)
const getDynamoDbTableName = jest.fn().mockReturnValue('dynamoDb')

export {
  getS3BucketName,
  getAwsRegion,
  isLocalEnvironment,
  getDynamoDbTableName
}
