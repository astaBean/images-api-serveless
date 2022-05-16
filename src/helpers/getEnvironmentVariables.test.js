import { getAwsRegion, getDynamoDbTableName, getS3BucketName, isLocalEnvironment } from './getEnvironmentVariables'

describe('getEnvironmentVariables', () => {
  describe('getS3BucketName', () => {
    describe('when S3_BUCKET_NAME environment variable not defined', () => {
      it('should throw an error', () => {
        expect.assertions(1)
        try {
          getS3BucketName()
        } catch (error) {
          expect(error.message).toEqual('S3_BUCKET_NAME env variable should be defined')
        }
      })
    })
  })

  describe('getAwsRegion', () => {
    describe('when AWS_REGION environment variable not defined', () => {
      it('should throw an error', () => {
        expect.assertions(1)
        try {
          getAwsRegion()
        } catch (error) {
          expect(error.message).toEqual('AWS_REGION env variable should be defined')
        }
      })
    })
  })

  describe('isLocalEnvironment', () => {
    describe('when IS_LOCAL environment variable not defined', () => {
      it('should throw an error', () => {
        expect.assertions(1)
        try {
          isLocalEnvironment()
        } catch (error) {
          expect(error.message).toEqual('IS_LOCAL env variable should be defined')
        }
      })
    })
  })

  describe('getDynamoDbTableName', () => {
    describe('when DYNAMODB_TABLE environment variable not defined', () => {
      it('should throw an error', () => {
        expect.assertions(1)
        try {
          getDynamoDbTableName()
        } catch (error) {
          expect(error.message).toEqual('DYNAMODB_TABLE env variable should be defined')
        }
      })
    })
  })
})
