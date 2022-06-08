import { getFailureResponse, getSuccessResponse, getSuccessResponsePaginated } from './generateResponseValue'
import { RequestValidationErrors } from '../errors/RequestValidationErrors'
import { RecordNotFound } from '../errors/RecordNotFound'
import { RequestValidationError } from '../errors/RequestValidationError'
import RESPONSE_CODES from '../constants/responseCodes.json'
import CONTENT_STRINGS from '../constants/contentStrings.json'

describe('generateResponseValue ', () => {
  beforeAll(() => {
    console.error = jest.fn()
  })

  afterAll(() => {
    console.error.mockRestore()
  })

  beforeEach(() => {
    console.error.mockClear()
  })

  describe('getFailureResponse', () => {
    describe('when error is RequestValidationErrors', () => {
      const error = new RequestValidationErrors()
      error.messages[0] = 'err1'
      it('should return object with bad request status and messages', () => {
        const res = getFailureResponse(error)
        expect(res.statusCode).toEqual(RESPONSE_CODES.BAD_REQUEST)
        expect(res.body).toEqual(JSON.stringify({ message: ['err1'] }))
        expect(console.error.mock.calls.length).toEqual(0)
      })
    })

    describe('when error is RequestValidationError', () => {
      const error = new RequestValidationError('message')
      it('should return object with bad request status and message', () => {
        const res = getFailureResponse(error)
        expect(res.statusCode).toEqual(RESPONSE_CODES.BAD_REQUEST)
        expect(res.body).toEqual(JSON.stringify({ message: 'message' }))
        expect(console.error.mock.calls.length).toEqual(0)
      })
    })

    describe('when error is RecordNotFound', () => {
      const error = new RecordNotFound()
      it('should return object with not found status and message', () => {
        const res = getFailureResponse(error)
        expect(res.statusCode).toEqual(RESPONSE_CODES.NOT_FOUND)
        expect(res.body).toEqual(JSON.stringify({ message: CONTENT_STRINGS.ERROR__IMAGE_NOT_FOUND }))
        expect(console.error.mock.calls.length).toEqual(0)
      })
    })

    describe('when error is Error or other error', () => {
      const error = new Error('other error')
      it('should return object with internal server error status and message', () => {
        const res = getFailureResponse(error)
        expect(res.statusCode).toEqual(RESPONSE_CODES.INTERNAL_SERVER_ERROR)
        expect(res.body).toEqual(JSON.stringify({ message: 'other error' }))
        expect(console.error.mock.calls.length).toEqual(1)
        expect(console.error.mock.calls[0]).toEqual(['Internal server error', error])
      })
    })
  })

  describe('getSuccessResponse', () => {
    it('should return success response', () => {
      expect.assertions(2)
      const res = getSuccessResponse('foo')
      expect(res.statusCode).toEqual(RESPONSE_CODES.OK)
      expect(res.body).toEqual(JSON.stringify('foo'))
    })
  })

  describe('getSuccessResponsePaginated', () => {
    it('should return success response paginated', () => {
      expect.assertions(5)
      const res = getSuccessResponsePaginated('foo', 2, 90, 30)
      expect(res.statusCode).toEqual(RESPONSE_CODES.OK)
      expect(res.body.data).toEqual(JSON.stringify('foo'))
      expect(res.body.meta.pageNumber).toEqual(2)
      expect(res.body.meta.recordsCount).toEqual(90)
      expect(res.body.meta.pageSize).toEqual(30)
    })
  })
})
