import {
  DocumentClient,
  awsSdkPromiseResponseForScan,
  awsSdkPromiseResponseForGet
} from '../../../__mocks__/aws-sdk/clients/dynamodb'

import { handler } from '../../images/handlers/get'

const documentClient = new DocumentClient()

jest.mock('../../helpers/getEnvironmentVariables')

const basicApiGatewayEvent = {
  headers: {},
  multiValueHeaders: {},
  httpMethod: 'GET',
  isBase64Encoded: true,
  path: '/images',
  body: '',
  pathParameters: null,
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {
    accountId: 'abc',
    apiId: 'abc123',
    authorizer: {},
    protocol: 'foo',
    httpMethod: 'GET',
    identity: {
      accessKey: null,
      accountId: null,
      apiKey: null,
      apiKeyId: null,
      caller: null,
      clientCert: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      user: null,
      userAgent: null,
      userArn: null,
      sourceIp: '0.0.0.0'
    },
    path: '/',
    stage: 'dev',
    requestId: 'a',
    requestTimeEpoch: 1,
    resourceId: 'b',
    resourcePath: 'c'
  },
  resource: 'bar'
}

beforeAll(() => {
  console.info = jest.fn()
  console.error = jest.fn()
})

afterAll(() => {
  console.info.mockRestore()
  console.error.mockRestore()
})

beforeEach(() => {
  documentClient.scan.mockClear()
  documentClient.get.mockClear()
  awsSdkPromiseResponseForScan.mockClear()
  awsSdkPromiseResponseForGet.mockClear()
  console.info.mockClear()
  console.error.mockClear()
})

// These currently do not work and needs fixing
describe('images get request handler', () => {
  describe('when images present in database', () => {
    const recordsWithOneItem = {
      Items: [
        {
          uuid: 'd4cc6b9a-9f0b-45cf-befe-d04905bbd4a6',
          title: 'Image 1 title',
          description: 'Image 1 description',
          path: 'Image 1 path',
          dateAdded: '1653973200000',
          updateDate: '1652749200000'
        },
        {
          uuid: '62b90dfb-9af1-4563-8412-56421e2ae27a',
          title: 'image 2',
          description: 'image 2 description',
          path: 'image path',
          dateAdded: '1652801400000',
          dateUpdated: '1652872860000'
        }
      ]
    }

    beforeEach(() => {
      awsSdkPromiseResponseForScan.mockReturnValueOnce(Promise.resolve(recordsWithOneItem))
    })

    it('should return 200 response with all images', async () => {
      expect.assertions(2)
      const exampleEvent = Object.assign({}, basicApiGatewayEvent)
      const res = await handler(exampleEvent)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual(JSON.stringify(recordsWithOneItem.Items))
    })
  })

  describe('when there are no images in database', () => {
    beforeEach(() => {
      awsSdkPromiseResponseForScan.mockReturnValueOnce(Promise.resolve({}))
    })

    it('should return 200 response', async () => {
      expect.assertions(2)
      const exampleEvent = Object.assign({}, basicApiGatewayEvent)
      const res = await handler(exampleEvent)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual(0)
    })
  })

  describe('when an error happened', () => {
    awsSdkPromiseResponseForScan.mockImplementationOnce(() => {
      throw new Error('foo')
    })

    it('should return internal server error response code with message', async () => {
      const expectedErrorMessage = 'some message'
      const expected = JSON.stringify({
        message: expectedErrorMessage
      })

      expect.assertions(2)
      const exampleEvent = Object.assign({}, basicApiGatewayEvent)
      const res = await handler(exampleEvent)
      expect(res.statusCode).toEqual(500)
      expect(res.body).toEqual(expected)
    })
  })
})
