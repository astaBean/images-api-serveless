import { handler } from './delete'
import { deleteRecord } from '../../helpers/databaseTransactions'
import { validateUuidPathParam } from '../../helpers/validateRequest'
import { getFailureResponse, getSuccessResponse } from '../../helpers/generateResponseValue'
import { RecordNotFound } from '../../errors/RecordNotFound'
import { RequestValidationErrors } from '../../errors/RequestValidationErrors'

jest.mock('../../helpers/databaseTransactions')
jest.mock('../../helpers/validateRequest')
jest.mock('../../helpers/generateResponseValue')
jest.mock('../../helpers/getEnvironmentVariables')

const minimalEvent = {
  pathParameters: {
    uuid: '6c84fb90-12c4-11e1-840d-7b25c5ee775a'
  }
}

describe('delete request handler', () => {
  beforeEach(() => {
    deleteRecord.mockClear()
    getFailureResponse.mockClear()
    getSuccessResponse.mockClear()
    validateUuidPathParam.mockClear()
  })

  afterEach(() => {
    deleteRecord.mockRestore()
    getFailureResponse.mockRestore()
    getSuccessResponse.mockRestore()
    validateUuidPathParam.mockRestore()
  })

  describe('when image was deleted successfully', () => {
    beforeEach(() => {
      deleteRecord.mockImplementationOnce(() => {
        return {}
      })
      validateUuidPathParam.mockReturnValueOnce({})
      getSuccessResponse.mockReturnValueOnce('foo')
    })

    it('should return 200 response', async () => {
      const res = await handler(minimalEvent)
      expect.assertions(4)
      expect(res).toEqual('foo')
      expect(deleteRecord.mock.calls.length).toEqual(1)
      expect(getSuccessResponse.mock.calls.length).toEqual(1)
      expect(getSuccessResponse.mock.calls[0][0]).toEqual('Record has been deleted successfully')
    })
  })

  describe('when there were validation errors', () => {
    const expectedInputErr = new RequestValidationErrors()
    beforeEach(() => {
      validateUuidPathParam.mockImplementationOnce(() => {
        throw expectedInputErr
      })
      getFailureResponse.mockReturnValueOnce({
        statusCode: 400,
        body: '{message:["foo1", "foo2"]}'
      })
    })
    it('should return failure response', async () => {
      const res = await handler({})
      expect.assertions(6)
      expect(res.statusCode).toEqual(400)
      expect(res.body).toEqual('{message:["foo1", "foo2"]}')
      expect(deleteRecord.mock.calls.length).toEqual(0)
      expect(getSuccessResponse.mock.calls.length).toEqual(0)
      expect(getFailureResponse.mock.calls.length).toEqual(1)
      expect(getFailureResponse.mock.calls[0][0]).toEqual(expectedInputErr)
    })
  })

  describe('when there was an error while deleting an image', () => {
    const expectedInputErr = new RecordNotFound()
    beforeEach(() => {
      validateUuidPathParam.mockReturnValueOnce({})
      deleteRecord.mockImplementationOnce(() => {
        throw expectedInputErr
      })
      getFailureResponse.mockReturnValueOnce('foo')
    })
    it('should return failure response', async () => {
      const res = await handler(minimalEvent)
      expect.assertions(5)
      expect(res).toEqual('foo')
      expect(deleteRecord.mock.calls.length).toEqual(1)
      expect(getSuccessResponse.mock.calls.length).toEqual(0)
      expect(getFailureResponse.mock.calls.length).toEqual(1)
      expect(getFailureResponse.mock.calls[0][0]).toEqual(expectedInputErr)
    })
  })
})
