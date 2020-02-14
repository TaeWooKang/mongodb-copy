const mongodb = require('mongodb')
const config = require('./config.json')
const fs = require('fs')
const path = require('path')
//config for db
const mongoClient = mongodb.MongoClient
const username = config.mongo.username
const password = config.mongo.password
const host = config.mongo.host
const port = config.mongo.port
const dbName = config.mongo.dbName
const collectionName = config.mongo.collectionName
const uri = `mongodb://${username}:${encodeURIComponent(password)}@${host}:${port}/${dbName}`;

//config for fs
const fileName = config.fs.fileName
const copiedPath = __dirname + '/' + fileName

// 클라이언트 연결을 생성하는 함수
function getClient(uri, cb = () => {}) {
    return new Promise ((resolve, reject) => {
        mongoClient.connect(uri, (error, client) => {
            if (error) {
                console.log(error)
                reject(error)
            }
            resolve(client, cb ? cb(client) : null)
        })
    })
}

// 특정 데이터베이스를 가져오는 함수
function getDb(client, dbName, cb = () => {}) {
    return new Promise ((resolve, reject) => {
        const db = client.db(dbName)
        if (db) resolve(db, cb ? cb(db) : null)
        console.log(`can not found db name:${dbName}`)
        reject(db)
    })
}

// 특정 컬렉션을 가져오는 함수
function getCollection(db, collectionName, cb = () => {}) {
    return new Promise((resolve, reject) => {
        db.collection(collectionName, (error, collection) => {
            if (error) {
                console.log(error)
                reject(error)
            }
            resolve(collection, cb ? cb(collection) : null)
        })
    })
}

// 위의 함수들을 사용하여 count와 rows를 가져오는 함수

async function getData(uri, dbName, collectionName ) {
    const client = await getClient(uri)
    const db = await getDb(client, dbName)
    const collection = await getCollection(db, collectionName)
    const count = await collection.countDocuments({ classify: 'working.request'})
    const rows = await collection.find({ classify: 'working.request'}).toArray()
    await closeClient(client)
    return { count, rows }
}

async function closeClient(client) {
    await client.close()
    console.log('mongodb client closed.')
}

// data를 파일로 작성하는 함수

function writeDocuments(count, rows) {
    const isExist = fs.existsSync()
    if (isExist) {
        console.log(`${copiedPath} is already exists. please delete and restart.`)
        return false
    } else {
        console.log('writing file start..')
    }
    console.log(`file path: ${copiedPath}`)
    const dataToJson = JSON.stringify({count, rows})
    fs.writeFile(filePath, dataToJson, (error) => {
        if (error) {
            console.log(error)
        }
        console.log('writing file end..')
        return false
    })
}
getData(uri, dbName, collectionName).then(({ count, rows }) => {
    writeDocuments(count, rows)
})