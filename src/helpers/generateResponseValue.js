import { RequestValidationErrors } from '../errors/RequestValidationErrors'
import { RecordNotFound } from '../errors/RecordNotFound'
import { RequestValidationError } from '../errors/RequestValidationError'
import RESPONSE_CODES from '../constants/responseCodes.json'

const getFailureResponse = (error) => {
  switch (error.constructor) {
    case RequestValidationErrors:
      return _generateFailureResponse(error.messages, RESPONSE_CODES.BAD_REQUEST)
    case RequestValidationError:
      return _generateFailureResponse(error.message, RESPONSE_CODES.BAD_REQUEST)
    case RecordNotFound:
      return _generateFailureResponse(error.message, RESPONSE_CODES.NOT_FOUND)
    default:
      console.error('Internal server error', error)
      return _generateFailureResponse(error.message, RESPONSE_CODES.INTERNAL_SERVER_ERROR)
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
    statusCode: RESPONSE_CODES.OK,
    body: JSON.stringify(objectToReturn)
  }
}

// TBC
const getSuccessResponsePaginated = (objectToReturn, pageNumber, recordsCount, pageSize) => {
  return {
    statusCode: RESPONSE_CODES.OK,
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
