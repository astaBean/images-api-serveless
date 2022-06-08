import { handler } from './getImages'
import { getRecords } from '../../helpers/databaseTransactions'
import { getFailureResponse, getSuccessResponse } from '../../helpers/generateResponseValue'

jest.mock('../../helpers/databaseTransactions')
jest.mock('../../helpers/generateResponseValue')
jest.mock('../../helpers/getEnvironmentVariables')

describe('getImages request handler', () => {
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
    const errorThrown = new Error('foo')
    beforeEach(() => {
      getRecords.mockImplementationOnce(() => {
        throw errorThrown
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
      expect(getFailureResponse.mock.calls[0][0]).toEqual(errorThrown)
      expect(console.error.mock.calls.length).toEqual(1)
    })
  })
})
