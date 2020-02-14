# mongodb-copy

## version
`
node 10.15.2
`

`
mongodb 4.2.2
`


## how to use

### 1. git clone
`
git clone https://github.com/TaeWooKang/mongodb-copy.git
`
### 2. npm install
`
npm install
`
### 3. edit config.json

    {
        "mongo": {
            "username" : "",
            "password" : "",
            "host" : "localhost",
            "port" : 27017,
            "dbName" : "",
            "collectionName" : ""
        },
        "fs": {
            "fileName": "./copied.json"
        }
    }

### 4. npm run start
`
npm run start
`