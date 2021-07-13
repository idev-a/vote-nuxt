# votefromabroad

> VoteFromAbroad.org -- Absentee Ballots for US Citizens Abroad

## About
Nuxt server rendered Vue app with
- Auth0 authentication
  - rule during authentication pulls in DA account
  - after auth client makes federated auth call to aws cognito identity to gain access to graphql api
- AWS cognito identity pool IAM
  - Authenticated role for users logged in with Auth0 federated identity gives access to requests created with the same identity
  - Unauthenticated identity created for anonymous users to gain access to graphql api
- AppSync Graphql API with IAM access management. 
- NetlifyCMS content management (md && YAML files saved in content folder)
- localization: nuxt-18n es/en
- pages: each .vue in the pages dir is a unique page

## Sites
- vr.votefromabroad.org
- dems.votefromabroad.org

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).
