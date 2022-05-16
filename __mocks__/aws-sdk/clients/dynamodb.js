const awsSdkPromiseResponseForScan = jest.fn().mockReturnValue(Promise.resolve(true))
const awsSdkPromiseResponseForGet = jest.fn().mockReturnValue(Promise.resolve(true))
const awsSdkPromiseResponseForDelete = jest.fn().mockReturnValue(Promise.resolve(true))
const awsSdkPromiseResponseForPut = jest.fn().mockReturnValue(Promise.resolve(true))

const scanFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponseForScan }))
const getFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponseForGet }))
const deleteFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponseForDelete }))
const putFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponseForPut }))

class DocumentClient {
  scan = scanFn
  get = getFn
  delete = deleteFn
  put = putFn
}

export {
  DocumentClient,
  awsSdkPromiseResponseForScan,
  awsSdkPromiseResponseForGet,
  awsSdkPromiseResponseForDelete,
  awsSdkPromiseResponseForPut
}
