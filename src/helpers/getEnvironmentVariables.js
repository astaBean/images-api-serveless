const { IS_LOCAL, AWS_REGION, S3_BUCKET_NAME, DYNAMODB_TABLE } = process.env

const getS3BucketName = () => {
  if (S3_BUCKET_NAME === undefined) {
    throw new Error('S3_BUCKET_NAME env variable should be defined')
  }
  return S3_BUCKET_NAME
}

const getAwsRegion = () => {
  if (AWS_REGION === undefined) {
    throw new Error('AWS_REGION env variable should be defined')
  }

  return AWS_REGION
}

const isLocalEnvironment = () => {
  if (IS_LOCAL === undefined) {
    throw new Error('IS_LOCAL env variable should be defined')
  }

  return IS_LOCAL
}

const getDynamoDbTableName = () => {
  if (DYNAMODB_TABLE === undefined) {
    throw new Error('DYNAMODB_TABLE env variable should be defined')
  }

  return DYNAMODB_TABLE
}

export {
  getS3BucketName,
  getAwsRegion,
  isLocalEnvironment,
  getDynamoDbTableName
}
