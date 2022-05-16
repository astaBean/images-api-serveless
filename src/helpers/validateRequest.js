import { imageCreateSchema, imageUpdateSchema, pathParamsWithUuidSchema } from '../image/schemas/image.schema'
import { RequestValidationErrors } from '../errors/RequestValidationErrors'
import { RequestValidationError } from '../errors/RequestValidationError'

const validateImageUpdateEvent = (requestBody) => {
  console.info(`Validating request body [${JSON.stringify(requestBody)}]`)
  _validateRequestBody(requestBody)
  const validatedObj = imageUpdateSchema.validate(requestBody)
  if (validatedObj.error !== undefined) {
    throw _getValidationError(validatedObj.error)
  }
  return requestBody
}

const validateImageCreateEvent = (requestBody) => {
  console.info(`Validating request body [${JSON.stringify(requestBody)}]`)
  _validateRequestBody(requestBody)
  const validatedObj = imageCreateSchema.validate(requestBody)
  if (validatedObj.error !== undefined) {
    throw _getValidationError(validatedObj.error)
  }
  return requestBody
}

const validateUuidPathParam = (event) => {
  const validatedObj = pathParamsWithUuidSchema.validate(event)
  if (validatedObj.error !== undefined) {
    throw _getValidationError(validatedObj.error)
  }
}

const _validateRequestBody = (requestBody) => {
  if (requestBody === undefined || requestBody === '' || Object.keys(requestBody).length === 0) {
    throw new RequestValidationError('request body can not be empty')
  }
}

const _getValidationError = (errors) => {
  const err = new RequestValidationErrors()
  errors.details.forEach((error) => {
    err.messages.push(error.message)
  })
  return err
}

export {
  validateImageUpdateEvent,
  validateImageCreateEvent,
  validateUuidPathParam
}
