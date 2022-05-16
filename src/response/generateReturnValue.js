import { RequestValidationErrors } from '../errors/RequestValidationErrors'
import { RecordNotFound } from '../errors/RecordNotFound'
import { RequestValidationError } from '../errors/RequestValidationError'

const getFailureResponse = (error) => {
  switch (error.constructor) {
    case RequestValidationErrors:
      return _generateFailureResponse(error.messages, 400)
    case RequestValidationError:
      return _generateFailureResponse(error.message, 400)
    case RecordNotFound:
      return _generateFailureResponse(error.message, 404)
    default:
      console.error('Internal server error', error)
      return _generateFailureResponse(error.message, 500)
  }
}

const _generateFailureResponse = (message, statusCode) => {
  return {
    statusCode,
    body: JSON.stringify({
      message
    })
  }
}

const getSuccessResponse = (objectToReturn) => {
  return {
    statusCode: 200,
    body: JSON.stringify(objectToReturn)
  }
}

const getSuccessResponsePaginated = (objectToReturn, pageNumber, recordsCount, pageSize) => {
  return {
    statusCode: 200,
    body: {
      data: JSON.stringify(objectToReturn),
      meta: {
        pageSize,
        pageNumber,
        recordsCount
      }
    }
  }
}

export {
  getFailureResponse,
  getSuccessResponse,
  getSuccessResponsePaginated
}
