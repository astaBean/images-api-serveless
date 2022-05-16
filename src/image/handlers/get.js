import { getRecord } from '../../transaction/databaseTransactions'
import { validateUuidPathParam } from '../../helpers/validateRequest'
import { getFailureResponse, getSuccessResponse } from '../../response/generateReturnValue'

const handler = async (event) => {
  try {
    validateUuidPathParam(event)
    const image = await getRecord(event.pathParameters.uuid)
    return getSuccessResponse(image)
  } catch (error) {
    return getFailureResponse(error)
  }
}

export {
  handler
}
