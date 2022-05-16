import { handler } from './get'
import { getRecord } from '../../transaction/databaseTransactions'
import { validateUuidPathParam } from '../../helpers/validateRequest'
import { getFailureResponse, getSuccessResponse } from '../../response/generateReturnValue'
import { RequestValidationErrors } from '../../errors/RequestValidationErrors'
import { RecordNotFound } from '../../errors/RecordNotFound'

jest.mock('../../transaction/databaseTransactions')
jest.mock('../../helpers/validateRequest')
jest.mock('../../response/generateReturnValue')
jest.mock('../../helpers/getEnvironmentVariables')

const minimalEvent = {
  pathParameters: {
    uuid: '6c84fb90-12c4-11e1-840d-7b25c5ee775a'
  }
}

describe('get request handler', () => {
  beforeEach(() => {
    getRecord.mockClear()
    getFailureResponse.mockClear()
    getSuccessResponse.mockClear()
  })

  describe('when image is present', () => {
    const returnedMockValue = {
      uuid: 'some uuid',
      title: 'foo title',
      description: 'foo description',
      path: 'path',
      dateAdded: 1653973200000,
      updateDate: 1652749200000
    }

    beforeEach(() => {
      validateUuidPathParam.mockReturnValueOnce({})
      getRecord.mockImplementationOnce(() => {
        return returnedMockValue
      })
      getSuccessResponse.mockReturnValueOnce('foo')
    })

    it('should return 200 response with that image', async () => {
      const res = await handler(minimalEvent)
      expect.assertions(5)
      expect(res).toEqual('foo')
      expect(getRecord.mock.calls.length).toEqual(1)
      expect(getSuccessResponse.mock.calls.length).toEqual(1)
      expect(getSuccessResponse.mock.calls[0][0]).toEqual(returnedMockValue)
      expect(getFailureResponse.mock.calls.length).toEqual(0)
    })
  })

  describe('when there are validation errors', () => {
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
      expect(getRecord.mock.calls.length).toEqual(0)
      expect(getSuccessResponse.mock.calls.length).toEqual(0)
      expect(getFailureResponse.mock.calls.length).toEqual(1)
      expect(getFailureResponse.mock.calls[0][0]).toEqual(expectedInputErr)
    })
  })

  describe('when there is no image', () => {
    const expectedInputErr = new RecordNotFound()
    beforeEach(() => {
      validateUuidPathParam.mockReturnValueOnce({})
      getRecord.mockImplementationOnce(() => {
        throw expectedInputErr
      })
      getFailureResponse.mockReturnValueOnce('foo')
    })
    it('should return failure response', async () => {
      const res = await handler(minimalEvent)
      expect.assertions(5)
      expect(res).toEqual('foo')
      expect(getRecord.mock.calls.length).toEqual(1)
      expect(getSuccessResponse.mock.calls.length).toEqual(0)
      expect(getFailureResponse.mock.calls.length).toEqual(1)
      expect(getFailureResponse.mock.calls[0][0]).toEqual(expectedInputErr)
    })
  })
})
