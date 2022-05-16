import { handler } from './get'
import { getRecords } from '../../transaction/databaseTransactions'
import { getFailureResponse, getSuccessResponse } from '../../response/generateReturnValue'

jest.mock('../../transaction/databaseTransactions')
jest.mock('../../response/generateReturnValue')
jest.mock('../../helpers/getEnvironmentVariables')

describe('get request handler', () => {
  beforeAll(() => {
    console.error = jest.fn()
  })

  afterAll(() => {
    console.error.mockRestore()
  })

  beforeEach(() => {
    getRecords.mockClear()
    getFailureResponse.mockClear()
    getSuccessResponse.mockClear()
    console.error.mockClear()
  })

  describe('when two images are present in database', () => {
    const returnedMockValue = [
      {
        item1: 'foo'
      },
      {
        image2: 'bar'
      }
    ]

    beforeEach(() => {
      getRecords.mockReturnValueOnce(Promise.resolve(returnedMockValue))
      getSuccessResponse.mockReturnValueOnce('foo')
    })

    it('should successful response', async () => {
      expect.assertions(6)
      const res = await handler()
      expect(res).toEqual('foo')
      expect(getRecords.mock.calls.length).toEqual(1)
      expect(getSuccessResponse.mock.calls.length).toEqual(1)
      expect(getSuccessResponse.mock.calls[0][0]).toEqual(returnedMockValue)
      expect(getFailureResponse.mock.calls.length).toEqual(0)
      expect(console.error.mock.calls.length).toEqual(0)
    })
  })

  describe('when an error', () => {
    beforeEach(() => {
      getRecords.mockImplementationOnce(() => {
        throw new Error('foo')
      })
      getFailureResponse.mockReturnValueOnce('foo')
    })

    it('should return failure response', async () => {
      expect.assertions(6)
      const res = await handler()
      expect(res).toEqual('foo')
      expect(getRecords.mock.calls.length).toEqual(1)
      expect(getSuccessResponse.mock.calls.length).toEqual(0)
      expect(getFailureResponse.mock.calls.length).toEqual(1)
      expect(getFailureResponse.mock.calls[0]).toEqual(['foo', 500])
      expect(console.error.mock.calls.length).toEqual(1)
    })
  })
})
