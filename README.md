### 1) mongo

Connect to mongo and create new user
```
> mongo
...
$ use issue_db

>>>>switched to db issue_db

$ db.createUser( {user: "issueUser", pwd: "ojokjfoqjfoiqjdpoqwjd2131jrdj12098dj1208dj120", roles:["dbOwner"]} )

>>>>Successfully added user: { "user" : "issueUser", "roles" : [ "dbOwner" ] }
```

### 2) change configs in config.local.json
```
{
  "PORT": 3003,
  "MONGO_DB_NAME": "issue_db",
  "MONGO_USER": "issueUser",
  "MONGO_PASSWORD": "ojokjfoqjfoiqjdpoqwjd2131jrdj12098dj1208dj120",
  "MONGO_PORT": "27017",
  "MONGO_HOST": "localhost"
}

```

### 3) start server
To start server run:
```
npm run start 
```
### 4) run tests

```
npm run test
```

The tests are located in folder ./tests/ 
