import { handler } from './get'
import { getSignedUrlForUpload } from '../../helpers/getSignedUrlForUpload'
import { getFailureResponse, getSuccessResponse } from '../../helpers/generateResponseValue'

jest.mock('../../helpers/getSignedUrlForUpload')
jest.mock('../../helpers/generateResponseValue')
jest.mock('../../helpers/getEnvironmentVariables')

describe('get request handler', () => {
  beforeAll(() => {
    console.error = jest.fn()
  })

  beforeEach(() => {
    console.error.mockClear()
    getSignedUrlForUpload.mockClear()
    getFailureResponse.mockClear()
    getSuccessResponse.mockClear()
  })

  describe('when got pre-signed url', () => {
    beforeEach(() => {
      getSignedUrlForUpload.mockReturnValueOnce({ signedURL: 'someUrl' })
      getSuccessResponse.mockReturnValueOnce('foo')
    })

    it('should successful response ', async () => {
      const res = await handler()
      expect.assertions(5)
      expect(res).toEqual('foo')
      expect(getSuccessResponse.mock.calls.length).toEqual(1)
      expect(getSuccessResponse.mock.calls[0][0]).toEqual({ signedURL: 'someUrl' })
      expect(getFailureResponse.mock.calls.length).toEqual(0)
      expect(console.error.mock.calls.length).toEqual(0)
    })
  })

  describe('when error thrown', () => {
    const errorThrown = new Error('error message')
    beforeEach(() => {
      getSignedUrlForUpload.mockImplementationOnce(() => {
        throw errorThrown
      })
      getFailureResponse.mockReturnValueOnce('foo')
    })

    it('should return failure response', async () => {
      expect.assertions(5)
      const res = await handler()
      expect(res).toEqual('foo')
      expect(getSuccessResponse.mock.calls.length).toEqual(0)
      expect(getFailureResponse.mock.calls.length).toEqual(1)
      expect(getFailureResponse.mock.calls[0][0]).toEqual(errorThrown)
      expect(console.error.mock.calls.length).toEqual(1)
    })
  })
})
