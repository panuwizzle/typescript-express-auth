# Typescript Express JWT Authentication

Lab project for typescript express

## Run
To run the MongoDB instance run
```
docker-composer up -d
```

Run the development env
```
cd api
npm install
npm run dev
```

The server will serve at http://localhost:8000

## Mongodb migration
```
use authy;
db.createUser({
  user: "authy",
  pwd: "abcd1234",
  roles: [
    { role: "readWrite", db: "authy" }
  ]
});

use authytest;
db.createUser({
  user: "authy",
  pwd: "abcd1234",
  roles: [
    { role: "readWrite", db: "authytest" }
  ]
})
```