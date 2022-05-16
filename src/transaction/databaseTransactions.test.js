import {
  DocumentClient,
  awsSdkPromiseResponseForScan,
  awsSdkPromiseResponseForGet,
  awsSdkPromiseResponseForDelete,
  awsSdkPromiseResponseForPut
} from '../../__mocks__/aws-sdk/clients/dynamodb'

import { getRecords, getRecord, deleteRecord, putRecord } from './databaseTransactions'
import { RecordNotFound } from '../errors/RecordNotFound'

jest.mock('../helpers/getEnvironmentVariables')

const documentClient = new DocumentClient()

describe('databaseTransactions', () => {
  beforeAll(() => {
    console.info = jest.fn()
    console.error = jest.fn()
  })

  afterAll(() => {
    console.info.mockReset()
    console.error.mockReset()
  })

  describe('getRecords', () => {
    beforeEach(() => {
      awsSdkPromiseResponseForScan.mockClear()
      documentClient.scan.mockClear()
    })

    afterEach(() => {
      awsSdkPromiseResponseForScan.mockReset()
    })

    describe('when a record is present', () => {
      const recordsWithOneItem = {
        Items: [
          {
            uuid: 'd4cc6b9a-9f0b-45cf-befe-d04905bbd4a6',
            title: 'Image 1 title',
            description: 'Image 1 description',
            path: 'Image 1 path',
            dateAdded: '1653973200000',
            dateUpdated: '1652749200000'
          }
        ]
      }

      beforeEach(() => {
        awsSdkPromiseResponseForScan.mockReturnValueOnce(
          Promise.resolve(recordsWithOneItem))
      })
      it('should return a record in a list', async () => {
        expect.assertions(3)
        const res = await getRecords()
        expect(res.length).toEqual(1)
        expect(res[0]).toEqual(recordsWithOneItem.Items[0])
        expect(documentClient.scan.mock.calls.length).toEqual(1)
      })
    })

    describe('when no records present', () => {
      const recordsWithNoItems = {
        Items: []
      }

      beforeEach(() => {
        awsSdkPromiseResponseForScan.mockReturnValueOnce(
          Promise.resolve(recordsWithNoItems))
      })

      it('should return empty Items array', async () => {
        expect.assertions(2)
        const res = await getRecords()
        expect(res.length).toEqual(0)
        expect(documentClient.scan.mock.calls.length).toEqual(1)
      })
    })
  })

  describe('getRecord', () => {
    beforeEach(() => {
      console.info.mockClear()
      console.error.mockClear()
      awsSdkPromiseResponseForGet.mockClear()
      documentClient.get.mockClear()
    })

    afterEach(() => {
      awsSdkPromiseResponseForGet.mockRestore()
    })

    describe('when a record is present in dynamoDb table', () => {
      const uuid = 'some-uuid'
      const oneImageRecord = {
        Item: {
          uuid,
          title: 'Image 1 title',
          description: 'Image 1 description',
          path: 'Image 1 path',
          dateAdded: '1653973200000',
          dateUpdated: '1652749200000'
        }
      }
      beforeEach(() => {
        awsSdkPromiseResponseForGet.mockReturnValueOnce(Promise.resolve(oneImageRecord))
      })

      it('should return a record in a list', async () => {
        expect.assertions(4)
        const res = await getRecord(uuid)
        expect(res).toEqual(oneImageRecord.Item)
        expect(documentClient.get.mock.calls.length).toEqual(1)
        expect(console.error.mock.calls.length).toEqual(0)
        expect(console.info.mock.calls.length).toEqual(2)
      })
    })

    describe('when no Item object returned', () => {
      beforeEach(() => {
        awsSdkPromiseResponseForGet.mockReturnValueOnce(Promise.resolve({}))
      })

      it('should throw RecordNotFound error', async () => {
        try {
          await getRecord('some-uuid')
        } catch (error) {
          expect.assertions(3)
          expect(error).toEqual(new RecordNotFound())
          expect(documentClient.get.mock.calls.length).toEqual(1)
          expect(console.info.mock.calls.length).toEqual(1)
        }
      })
    })

    describe('when no images returned', () => {
      beforeEach(() => {
        awsSdkPromiseResponseForGet.mockReturnValueOnce(
          Promise.resolve({ Item: {} }))
      })

      it('should throw RecordNotFound error', async () => {
        try {
          await getRecord('some-uuid')
        } catch (error) {
          expect.assertions(3)
          expect(error).toEqual(new RecordNotFound())
          expect(documentClient.get.mock.calls.length).toEqual(1)
          expect(console.info.mock.calls.length).toEqual(1)
        }
      })
    })
  })

  describe('deleteRecord', () => {
    beforeEach(() => {
      console.info.mockClear()
      console.error.mockClear()

      awsSdkPromiseResponseForDelete.mockClear()
      documentClient.delete.mockClear()
    })

    afterEach(() => {
      awsSdkPromiseResponseForDelete.mockReset()
    })

    describe('when uuid is empty string', () => {
      beforeEach(() => {
        awsSdkPromiseResponseForDelete.mockReturnValue(Promise.resolve({}))
      })
      it('should throw RecordNotFound error', async () => {
        try {
          await deleteRecord('')
        } catch (error) {
          expect.assertions(2)
          expect(error).toEqual(new RecordNotFound())
          expect(documentClient.delete.mock.calls.length).toEqual(1)
        }
      })
    })

    describe('when uuid is undefined string', () => {
      it('should throw RecordNotFound error', async () => {
        try {
          await deleteRecord(undefined)
        } catch (error) {
          expect.assertions(2)
          expect(error).toEqual(new RecordNotFound())
          expect(documentClient.delete.mock.calls.length).toEqual(0)
        }
      })
    })

    describe('when recordUuid is a string', () => {
      it('should delete a record', async () => {
        expect.assertions(2)
        await deleteRecord('some-uuid')
        expect(documentClient.delete.mock.calls.length).toEqual(1)
        expect(console.info.mock.calls.length).toEqual(1)
      })
    })

    describe('when delete operation throws an error', () => {
      beforeEach(() => {
        awsSdkPromiseResponseForDelete.mockImplementationOnce(() => {
          throw new Error('error')
        })
      })

      it('should throw an error', async () => {
        try {
          expect.assertions(3)
          await deleteRecord('some-uuid')
        } catch (error) {
          expect(error.message).toEqual('error')
          expect(documentClient.delete.mock.calls.length).toEqual(1)
          expect(console.info.mock.calls.length).toEqual(1)
        }
      })
    })
  })

  describe('putRecord', () => {
    beforeEach(() => {
      documentClient.get.mockClear()
      documentClient.put.mockClear()
      awsSdkPromiseResponseForPut.mockClear()
      awsSdkPromiseResponseForGet.mockClear()
    })

    afterEach(() => {
      awsSdkPromiseResponseForPut.mockReset()
      awsSdkPromiseResponseForGet.mockReset()
      console.info.mockReset()
    })

    describe('when adding a valid record without uuid', () => {
      const record = {
        Item: {
          uuid: 'foo'
        }
      }

      beforeEach(() => {
        awsSdkPromiseResponseForPut.mockReturnValueOnce(Promise.resolve())
        awsSdkPromiseResponseForGet.mockReturnValueOnce(Promise.resolve(record))
      })

      it('should return a record', async () => {
        expect.assertions(4)
        const res = await putRecord(undefined, 'title', 'description', 'path')
        expect(res).toEqual(record.Item)
        expect(documentClient.put.mock.calls.length).toEqual(1)
        expect(documentClient.get.mock.calls.length).toEqual(1)
        expect(console.info.mock.calls.length).toEqual(5)
      })
    })

    describe('when adding a valid record with uuid', () => {
      const record = {
        Item: {
          uuid: 'foo'
        }
      }

      beforeEach(() => {
        awsSdkPromiseResponseForGet.mockImplementationOnce(() => {
          return Promise.resolve(record)
        })
      })

      it('should return added record', async () => {
        const res = await putRecord('uuid', 'title', 'description', 'path')
        expect.assertions(4)
        expect(res).toEqual(record.Item)
        expect(documentClient.put.mock.calls.length).toEqual(1)
        expect(documentClient.get.mock.calls.length).toEqual(1)
        expect(console.info.mock.calls.length).toEqual(4)
      })
    })

    describe('when error has been thrown', () => {
      beforeEach(() => {
        awsSdkPromiseResponseForPut.mockImplementationOnce(() => {
          throw new Error('error')
        })
      })

      it('should throw error ', async () => {
        try {
          await putRecord('foo')
        } catch (error) {
          expect.assertions(5)
          expect(error.message).toEqual('error')
          expect(documentClient.put.mock.calls.length).toEqual(1)
          expect(documentClient.get.mock.calls.length).toEqual(0)
          expect(console.info.mock.calls.length).toEqual(1)
          expect(console.error.mock.calls.length).toEqual(1)
        }
      })
    })
  })
})
