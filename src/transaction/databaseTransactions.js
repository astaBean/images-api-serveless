import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { RecordNotFound } from '../errors/RecordNotFound'
import { randomUUID } from 'crypto'
import { isLocalEnvironment, getAwsRegion, getDynamoDbTableName } from '../helpers/getEnvironmentVariables'

const _getDbClient = () => {
  const endpoint = isLocalEnvironment() === 'true' ? 'http://localhost:8009' : undefined
  return new DocumentClient({ apiVersion: '2012-08-10', region: getAwsRegion(), endpoint })
}

const ddb = _getDbClient()

const getRecords = async () => {
  const params = {
    TableName: getDynamoDbTableName()
  }

  console.info(`getRecords params [${JSON.stringify(params)}]`)
  const records = await ddb.scan(params).promise()
  console.info(`retrieved records [${JSON.stringify(records)}]`)
  return records.Items
}

const getRecord = async (uuid) => {
  const params = {
    TableName: getDynamoDbTableName(),
    Key: {
      uuid
    }
  }

  try {
    console.info(`getRecord params [${JSON.stringify(params)}]`)
    const record = await ddb.get(params).promise()
    console.info(`retrieved record: ${JSON.stringify(record)}`)
    return record.Item
  } catch (error) {
    console.error('error in getRecord', error)
    throw error
  }
}

const deleteRecord = async (uuid) => {
  const params = {
    TableName: getDynamoDbTableName(),
    Key: {
      uuid
    }
  }

  console.info(`deleteRecord params [${JSON.stringify(params)}]`)
  const obj = await ddb.delete(params).promise()
  if (obj !== undefined) {
    throw new RecordNotFound()
  }
}

const putRecord = async (recordUuid, title, description, path) => {
  const uuidInDb = recordUuid === undefined ? randomUUID() : recordUuid
  const dateUpdated = new Date().getTime()
  const dateAdded = recordUuid === undefined ? dateUpdated : undefined

  const params = {
    TableName: getDynamoDbTableName(),
    Item: {
      uuid: uuidInDb,
      title,
      description,
      path,
      dateAdded,
      dateUpdated
    }
  }

  try {
    console.info(`putRecord params ${JSON.stringify(params)}`)
    await ddb.put(params).promise()
    console.info('record was successfully created or updated')
    return await getRecord(uuidInDb)
  } catch (error) {
    console.error('Error in putRecord', error)
    throw error
  }
}

export {
  getRecords,
  getRecord,
  deleteRecord,
  putRecord
}
