## Installation

# For installing packages for amazon

yarn add passport @nestjs/passport passport-amazon

# For installing packages for apple

yarn add passport @nestjs/passport passport-apple
yarn add -D @types/passport-apple

# For installing packages for microsoft

yarn add passport @nestjs/passport passport-microsoft
yarn add -D @types/passport-microsoft

# For installing packages for facebook

yarn add dotenv @nestjs/passport passport passport-facebook
yarn add -D @types/passport-facebook

# For installing packages for Google

yarn add @nestjs/passport passport passport-google-oauth20 dotenv
yarn add -D @types/passport-google-oauth20

# For installing packages for instagram

yarn add express express-session passport passport-instagram axios pug
yarn add -D @types/passport-instagram

# For installing packages for linkdin

yarn add passport-linkedin-oauth2
yarn add -D @types/passport-linkedin-oauth2

# For installing packages for twitter

yarn add passport @nestjs/passport passport-twitter
yarn add -D @types/passport-twitter

# For installing packages for wechat

yarn add passport @nestjs/passport passport-wechat

# For installing packages for weibo

yarn add passport @nestjs/passport passport-weibo

# For installing packages for tiktok

yarn add passport @nestjs/passport passport-oauth2

# For installing class-validator

yarn add class-validator
yarn add --dev @types/class-validator

# Step 1 : Go to project root dir.

$ yarn install
$ yarn run migrate

# Step 2 : Coply .env.dev to .env (set your database)

cp .env.dev .env

# Step 3 : Go to project backend dir.

cd backend
$ npm install

## Node js Running the app

# Step 1 : for root dir.

$ yarn run start:dev

# Step 2 : for backend dir.

$ cd admin
$ yarn install

# production mode

$ yarn start

## Test

@@ -33,7 +32,7 @@ $ yarn run test:e2e

# test coverage

yarn run test:cov

# CRUD generator

nest g resource /modules/row

# Create shared module

@@ -51,26 +50,3 @@ Service folder:
Create services folder under shared folder
Create folder by service name and move service file from modulw folder
Create index.ts file to include all services

# Common

Add config.service

# Create Migrations

Add orm.config.ts
yarn make:migration name_table
create migrations folder
add scripts of migration and typeorm in package.json for migration

# Run Migrations

yarn run migrate

# Create Seeders

Create seeder folder

# Run Seeders

yarn seed
