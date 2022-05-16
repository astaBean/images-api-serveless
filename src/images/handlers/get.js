import { getRecords } from '../../transaction/databaseTransactions'
import { getFailureResponse, getSuccessResponse } from '../../response/generateReturnValue'

const handler = async () => {
  try {
    const result = await getRecords()
    return getSuccessResponse(result)
  } catch (error) {
    console.error('Error: ' + error)
    return getFailureResponse(error.message, 500)
  }
}

export {
  handler
}
