import { getSignedUrlForUpload } from './getSignedUrlForUpload'
import { getS3Client } from './awsClient'
import { getS3BucketName } from './getEnvironmentVariables'
import { FailedToUploadToS3Error } from '../errors/FailedToUploadToS3Error'

jest.mock('./getEnvironmentVariables')
jest.mock('./awsClient')

describe('getSignedUrlForUpload', () => {
  beforeAll(() => {
    console.info = jest.fn()
    console.error = jest.fn()
  })

  beforeEach(() => {
    getS3Client.mockClear()
    getS3BucketName.mockClear()
    console.info.mockClear()
    console.error.mockClear()
  })

  describe('when call s3 to get pre-signed url', () => {
    beforeEach(() => {
      getS3Client.mockImplementationOnce(() => {
        return {
          getSignedUrl: () => {
            return 'signedUrl'
          }
        }
      })
    })

    it('should return url to s3', () => {
      expect.assertions(4)
      const res = getSignedUrlForUpload('clientA')
      expect(res).toEqual({ signedURL: 'signedUrl' })
      expect(console.info.mock.calls.length).toEqual(1)
      expect(console.info.mock.calls[0]).toEqual(['Signed url: "signedUrl"'])
      expect(console.error.mock.calls.length).toEqual(0)
    })
  })

  describe('when call s3 to get pre-signed url throws an error', () => {
    const errorToThrow = new Error('this is a message')
    beforeEach(() => {
      getS3Client.mockImplementationOnce(() => {
        throw errorToThrow
      })
    })

    it('should throw FailedToUploadToS3Error error', () => {
      try {
        expect.assertions(3)
        getSignedUrlForUpload('clientA')
      } catch (error) {
        expect(error).toEqual(new FailedToUploadToS3Error())
        expect(console.error.mock.calls[0][0]).toEqual('Error')
        expect(console.error.mock.calls[0][1]).toEqual(errorToThrow)
      }
    })
  })
})
