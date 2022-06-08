import { updateRecord } from '../../helpers/databaseTransactions'
import { validateImageUpdateEvent } from '../../helpers/validateRequest'
import { getFailureResponse, getSuccessResponse } from '../../helpers/generateResponseValue'

const handler = async (event) => {
  try {
    console.info(`Event with body [${JSON.stringify(event.body)}]`)
    const eventBody = JSON.parse(event.body)
    validateImageUpdateEvent(eventBody)
    const item = await updateRecord(eventBody.uuid, eventBody.title, eventBody.description, eventBody.fileLocation)
    return getSuccessResponse(item)
  } catch (error) {
    return getFailureResponse(error)
  }
}
export {
  handler
}
