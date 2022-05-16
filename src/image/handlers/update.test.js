import { handler } from './update'
import { putRecord } from '../../transaction/databaseTransactions'
import { validateImageUpdateEvent } from '../../helpers/validateRequest'
import { getFailureResponse, getSuccessResponse } from '../../response/generateReturnValue'
import { RequestValidationErrors } from '../../errors/RequestValidationErrors'
import { RecordNotFound } from '../../errors/RecordNotFound'

jest.mock('../../transaction/databaseTransactions')
jest.mock('../../response/generateReturnValue')
jest.mock('../../helpers/validateRequest')
jest.mock('../../helpers/getEnvironmentVariables')

const minimalEvent = {
  body: JSON.stringify({ uuid: '6c84fb90-12c4-11e1-840d-7b25c5ee775a' })
}

describe('update request handler', () => {
  beforeAll(() => {
    console.info = jest.fn()
  })

  beforeEach(() => {
    putRecord.mockClear()
    validateImageUpdateEvent.mockClear()
    getFailureResponse.mockClear()
    getSuccessResponse.mockClear()
    console.info.mockClear()
  })

  describe('when update has been successful', () => {
    const returnedMockValue = {
      uuid: 'some uuid',
      title: 'foo title',
      description: 'foo description',
      path: 'path',
      dateAdded: 1653973200000,
      updateDate: 1652749200000
    }

    beforeEach(() => {
      validateImageUpdateEvent.mockReturnValueOnce({})
      putRecord.mockReturnValueOnce(Promise.resolve(returnedMockValue))
      getSuccessResponse.mockReturnValueOnce('foo')
    })

    it('should return success response', async () => {
      const res = await handler(minimalEvent)
      expect.assertions(7)
      expect(res).toEqual('foo')
      expect(putRecord.mock.calls.length).toEqual(1)
      expect(getSuccessResponse.mock.calls.length).toEqual(1)
      expect(getSuccessResponse.mock.calls[0][0]).toEqual(returnedMockValue)
      expect(getFailureResponse.mock.calls.length).toEqual(0)
      expect(console.info.mock.calls.length).toEqual(1)
      expect(console.info.mock.calls[0][0]).toEqual(`Event with body [${JSON.stringify(minimalEvent.body)}]`)
    })
  })

  describe('when there are validation errors', () => {
    const expectedInputErr = new RequestValidationErrors()
    beforeEach(() => {
      validateImageUpdateEvent.mockImplementationOnce(() => {
        throw expectedInputErr
      })
      getFailureResponse.mockReturnValueOnce({
        statusCode: 400,
        body: '{message:["foo1", "foo2"]}'
      })
    })
    it('should return failure response', async () => {
      const res = await handler(minimalEvent)
      expect.assertions(8)
      expect(res.statusCode).toEqual(400)
      expect(res.body).toEqual('{message:["foo1", "foo2"]}')
      expect(putRecord.mock.calls.length).toEqual(0)
      expect(getFailureResponse.mock.calls.length).toEqual(1)
      expect(getFailureResponse.mock.calls[0][0]).toEqual(expectedInputErr)
      expect(getSuccessResponse.mock.calls.length).toEqual(0)
      expect(console.info.mock.calls.length).toEqual(1)
      expect(console.info.mock.calls[0][0]).toEqual(`Event with body [${JSON.stringify(minimalEvent.body)}]`)
    })
  })

  describe('when error has been thrown while updating an image', () => {
    const expectedInputErr = new RecordNotFound()
    beforeEach(() => {
      validateImageUpdateEvent.mockReturnValueOnce({})
      putRecord.mockImplementationOnce(() => {
        throw expectedInputErr
      })
      getFailureResponse.mockReturnValueOnce('foo')
    })
    it('should return failure response', async () => {
      const res = await handler(minimalEvent)
      expect.assertions(7)
      expect(res).toEqual('foo')
      expect(putRecord.mock.calls.length).toEqual(1)
      expect(getFailureResponse.mock.calls.length).toEqual(1)
      expect(getFailureResponse.mock.calls[0][0]).toEqual(expectedInputErr)
      expect(getSuccessResponse.mock.calls.length).toEqual(0)
      expect(console.info.mock.calls.length).toEqual(1)
      expect(console.info.mock.calls[0][0]).toEqual(`Event with body [${JSON.stringify(minimalEvent.body)}]`)
    })
  })
})
