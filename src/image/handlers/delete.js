import { deleteRecord } from '../../transaction/databaseTransactions'
import { validateUuidPathParam } from '../../helpers/validateRequest'
import { getFailureResponse, getSuccessResponse } from '../../response/generateReturnValue'

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
