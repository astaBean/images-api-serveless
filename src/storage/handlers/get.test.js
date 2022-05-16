import { handler } from './get'
import { getSignedUrlForUpload } from '../../helpers/getSignedUrlForUpload'
import { getFailureResponse, getSuccessResponse } from '../../response/generateReturnValue'

jest.mock('../../helpers/getSignedUrlForUpload')
jest.mock('../../response/generateReturnValue')
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
    beforeEach(() => {
      getSignedUrlForUpload.mockImplementationOnce(() => {
        throw new Error('error message')
      })
      getFailureResponse.mockReturnValueOnce('foo')
    })

    it('should failure response', async () => {
      expect.assertions(5)
      const res = await handler()
      expect(res).toEqual('foo')
      expect(getSuccessResponse.mock.calls.length).toEqual(0)
      expect(getFailureResponse.mock.calls.length).toEqual(1)
      expect(getFailureResponse.mock.calls[0]).toEqual(['error message', 500])
      expect(console.error.mock.calls.length).toEqual(1)
    })
  })
})
