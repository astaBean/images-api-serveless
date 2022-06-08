import { deleteRecord } from '../../helpers/databaseTransactions'
import { validateUuidPathParam } from '../../helpers/validateRequest'
import { getFailureResponse, getSuccessResponse } from '../../helpers/generateResponseValue'

const handler = async (event) => {
  try {
    validateUuidPathParam(event)
    await deleteRecord(event.pathParameters.uuid)
    return getSuccessResponse('Record has been deleted successfully')
  } catch (error) {
    return getFailureResponse(error)
  }
}

export {
  handler
}
