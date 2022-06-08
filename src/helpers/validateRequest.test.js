import { imageCreateSchema, imageUpdateSchema, pathParamsWithUuidSchema } from '../images/schemas/image.schema'
import { validateImageCreateEvent, validateImageUpdateEvent, validateUuidPathParam } from './validateRequest'

jest.mock('../images/schemas/image.schema')

describe('validateRequest', () => {
  beforeAll(() => {
  })

  beforeEach(() => {
    imageUpdateSchema.validate.mockClear()
    imageCreateSchema.validate.mockClear()
    pathParamsWithUuidSchema.validate.mockClear()
  })

  describe('validateImageUpdateEvent', () => {
    it('should return RequestValidationError error when request body is undefined', () => {
      expect.assertions(3)
      try {
        validateImageUpdateEvent()
      } catch (err) {
        expect(err.constructor.name).toEqual('RequestValidationError')
        expect(err.message).toEqual('request body can not be empty')
        expect(imageUpdateSchema.validate.mock.calls.length).toEqual(0)
      }
    })

    it('should return RequestValidationError error when request body is empty string', () => {
      expect.assertions(3)
      try {
        validateImageUpdateEvent('')
      } catch (err) {
        expect(err.constructor.name).toEqual('RequestValidationError')
        expect(err.message).toEqual('request body can not be empty')
        expect(imageUpdateSchema.validate.mock.calls.length).toEqual(0)
      }
    })

    it('should return RequestValidationError error when request body is empty object', () => {
      expect.assertions(2)
      try {
        validateImageUpdateEvent({})
      } catch (err) {
        expect(err.constructor.name).toEqual('RequestValidationError')
        expect(err.message).toEqual('request body can not be empty')
      }
    })

    describe('when there are validation errors', () => {
      beforeEach(() => {
        imageUpdateSchema.validate.mockReturnValueOnce({
          error: {
            details: [
              { message: 'err1' },
              { message: 'err2' }
            ]
          }
        })
      })

      it('should thrown an error ', () => {
        expect.assertions(2)
        try {
          validateImageUpdateEvent({ uuid: 'foo' })
        } catch (err) {
          expect(err.constructor.name).toEqual('RequestValidationErrors')
          expect(err.messages).toEqual(['err1', 'err2'])
        }
      })
    })

    describe('when there are no validation errors', () => {
      beforeEach(() => {
        imageUpdateSchema.validate.mockReturnValueOnce({})
      })

      it('should return an input ', () => {
        // expect.assertions(2)
        const res = validateImageUpdateEvent({ uuid: 'foo' })
        expect(res).toEqual({ uuid: 'foo' })
      })
    })
  })

  describe('validateImageCreateEvent', () => {
    it('should return RequestValidationError error when request body is undefined', () => {
      expect.assertions(2)
      try {
        validateImageCreateEvent()
      } catch (err) {
        expect(err.constructor.name).toEqual('RequestValidationError')
        expect(err.message).toEqual('request body can not be empty')
      }
    })

    it('should return RequestValidationError error when request body is empty string', () => {
      expect.assertions(2)
      try {
        validateImageCreateEvent('')
      } catch (err) {
        expect(err.constructor.name).toEqual('RequestValidationError')
        expect(err.message).toEqual('request body can not be empty')
      }
    })

    it('should return RequestValidationError error when request body is empty object', () => {
      expect.assertions(2)
      try {
        validateImageCreateEvent({})
      } catch (err) {
        expect(err.constructor.name).toEqual('RequestValidationError')
        expect(err.message).toEqual('request body can not be empty')
      }
    })

    describe('when there are validation errors', () => {
      beforeEach(() => {
        imageCreateSchema.validate.mockReturnValueOnce({
          error: {
            details: [
              { message: 'err1' },
              { message: 'err2' }
            ]
          }
        })
      })

      it('should thrown an error ', () => {
        expect.assertions(2)
        try {
          validateImageCreateEvent({ uuid: 'foo' })
        } catch (err) {
          expect(err.constructor.name).toEqual('RequestValidationErrors')
          expect(err.messages).toEqual(['err1', 'err2'])
        }
      })
    })

    describe('when there are no validation errors', () => {
      beforeEach(() => {
        imageCreateSchema.validate.mockReturnValueOnce({})
      })

      it('should return an input ', () => {
        expect.assertions(2)
        const res = validateImageCreateEvent({ uuid: 'foo' })
        expect(res).toEqual({ uuid: 'foo' })
        expect(imageCreateSchema.validate.mock.calls.length).toEqual(1)
        // expect(imageUpdateSchema.validate.mock.calls.length).toEqual(0)
        // expect(pathParamsWithUuidSchema.validate.mock.calls.length).toEqual(0)
      })
    })
  })

  describe('validateUuidPathParam', () => {
    describe('when there are validation errors', () => {
      beforeEach(() => {
        pathParamsWithUuidSchema.validate.mockReturnValueOnce({
          error: {
            details: [
              { message: 'err1' },
              { message: 'err2' }
            ]
          }
        })
      })

      it('should thrown an error ', () => {
        expect.assertions(2)
        try {
          validateUuidPathParam({})
        } catch (err) {
          expect(err.constructor.name).toEqual('RequestValidationErrors')
          expect(err.messages).toEqual(['err1', 'err2'])
        }
      })
    })
  })
})
