# Client-API-v4

Repository containing the Client Allocation API for client requests. Built with NestJS, Passport, & Supabase.


## Getting started
For now, the API does not have a Docker image and runs only on the terminal.
Install + dev environment, please use ``make dev`` to use daemon (or watcher):
```
yarn && make dev
```
### Env
Copy/paste ``.env.example`` to ``.env.local`` or ``.env`` with keys:
```
PORT=4200
JWT_SECRET=
SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_JWT_SECRET=
```

### Prefix
By default, API is prefixed with ``/v4`` which means you call ``http(s)://XXXX/v4/...``

### Ping
```
curl --request GET \ --url http://localhost:4200/v4/ping
```

## Create a new route

I created a Makefile with a shortcut to make it easier for you to create a new route.
So, to create a new route, for example ``deals`` you can type:
```
make new NAME=deals

// will create folder src/routes/deals
// + files controller, module & service associated in folder
// + import module in app.module.ts (root)
```

note here that NAME= is mandatory variable to create the folder.

## Authentication
The general authentication is done through Supabase. You can find everything in ``auth/supabase``.
You need to use a Bearer token provided by Supabase in order to make requests.

### Strategy
**All routes must be protected by Supabase** except for the account creation route.
- The user sends their email/password and Supabase signs the returned access token to initiate the session on the Front-End side.
- On the Front-End, the client sets the token and calls auth/me to retrieve the current user profile. From then on, they can make calls to this API with their token as long as it is valid.


## Swagger
Available on:
```
http://localhost:4200/api
```