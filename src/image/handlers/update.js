import { putRecord } from '../../transaction/databaseTransactions'
import { validateImageUpdateEvent } from '../../helpers/validateRequest'
import { getFailureResponse, getSuccessResponse } from '../../response/generateReturnValue'

const handler = async (event) => {
  try {
    console.info(`Event with body [${JSON.stringify(event.body)}]`)
    const eventBody = JSON.parse(event.body)
    validateImageUpdateEvent(eventBody)
    const item = await putRecord(eventBody.uuid, eventBody.title, eventBody.description, eventBody.fileLocation)
    return getSuccessResponse(item)
  } catch (error) {
    return getFailureResponse(error)
  }
}
export {
  handler
}
