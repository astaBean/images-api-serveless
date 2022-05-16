import { getFailureResponse } from '../response/generateReturnValue'
import { RequestValidationErrors } from '../errors/RequestValidationErrors'
import { RecordNotFound } from '../errors/RecordNotFound'
import { RequestValidationError } from '../errors/RequestValidationError'

describe('getFailureResponse ', () => {
  beforeAll(() => {
    console.error = jest.fn()
  })

  afterAll(() => {
    console.error.mockRestore()
  })

  beforeEach(() => {
    console.error.mockClear()
  })

  describe('when error is RequestValidationErrors', () => {
    const error = new RequestValidationErrors()
    error.messages[0] = 'err1'
    it('should return object with status 400 and messages', () => {
      const res = getFailureResponse(error)
      expect(res.statusCode).toEqual(400)
      expect(res.body).toEqual(JSON.stringify({ message: ['err1'] }))
      expect(console.error.mock.calls.length).toEqual(0)
    })
  })

  describe('when error is RequestValidationError', () => {
    const error = new RequestValidationError('message')
    it('should return object with status 400 and message', () => {
      const res = getFailureResponse(error)
      expect(res.statusCode).toEqual(400)
      expect(res.body).toEqual(JSON.stringify({ message: 'message' }))
      expect(console.error.mock.calls.length).toEqual(0)
    })
  })

  describe('when error is RecordNotFound', () => {
    const error = new RecordNotFound()
    it('should return object with status 404 and message', () => {
      const res = getFailureResponse(error)
      expect(res.statusCode).toEqual(404)
      expect(res.body).toEqual(JSON.stringify({ message: 'Image not found' }))
      expect(console.error.mock.calls.length).toEqual(0)
    })
  })

  describe('when error is Error or other error', () => {
    const error = new Error('other error')
    it('should return object with status 500 and message', () => {
      const res = getFailureResponse(error)
      expect(res.statusCode).toEqual(500)
      expect(res.body).toEqual(JSON.stringify({ message: 'other error' }))
      expect(console.error.mock.calls.length).toEqual(1)
      expect(console.error.mock.calls[0]).toEqual(['Internal server error', error])
    })
  })
})
