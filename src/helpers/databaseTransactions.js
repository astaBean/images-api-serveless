import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { RecordNotFound } from '../errors/RecordNotFound'
import { randomUUID } from 'crypto'
import { isLocalEnvironment, getAwsRegion, getDynamoDbTableName } from './getEnvironmentVariables'

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
    console.info(`Getting record with uuid ${uuid}`)
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
  const params = {
    TableName: getDynamoDbTableName(),
    Item: await _getParamsForPut(recordUuid, title, description, path)
  }

  try {
    console.info(`putRecord params ${JSON.stringify(params)}`)
    await ddb.put(params).promise()
    console.info('record was successfully created or updated')
    return await getRecord(params.Item.uuid)
  } catch (error) {
    console.error('Error in putRecord', error)
    throw error
  }
}

const _getParamsForPut = async (recordUuid, title, description, path) => {
  const now = new Date().getTime()

  if (recordUuid !== undefined) {
    const definedValueInDb = await getRecord(recordUuid)
    return {
      uuid: recordUuid,
      title: title === undefined ? definedValueInDb.title : title,
      description: description === undefined ? definedValueInDb.description : description,
      path: path === undefined ? definedValueInDb.path : path,
      dateAdded: definedValueInDb.dateAdded,
      dateUpdated: now
    }
  }

  return {
    uuid: randomUUID(),
    title,
    description,
    path,
    dateAdded: now,
    dateUpdated: now
  }
}

export {
  getRecords,
  getRecord,
  deleteRecord,
  putRecord
}
