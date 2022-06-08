import { getRecords } from '../../helpers/databaseTransactions'
import { getFailureResponse, getSuccessResponse } from '../../helpers/generateResponseValue'

const handler = async () => {
  try {
    const result = await getRecords()
    return getSuccessResponse(result)
  } catch (error) {
    console.error('Error: ' + error)
    return getFailureResponse(error)
  }
}

export {
  handler
}
