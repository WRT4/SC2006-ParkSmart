# 2006-FDAE-D2

## Description

This website aims to improve the parking experience at HDB car parks in Singapore by allowing users to view real-time availability of parking lots and access detailed information about each car park, such as location, operating hours, gantry height, night parking options and payment types.

## Technologies Used

This project uses the typical MERN stack:

- MongoDB
- Express
- React
- Node.js

## Requirements

- Node.js
- MongoDB (if cloud server is no longer working / password has been changed)

## Installation

### 1. Clone the repository

```
git clone https://github.com/softwarelab3/2006-FDAE-D2.git
cd 2006-FDAE-D2
```

### 2. Install dependencies

```
cd lab4/app
npm i
```

### 3. Set up MongoDB (Optional, if cloud database is not working local server will be used automatically instead)

Local MongoDB: If you don’t have MongoDB server installed, you can download it from [here](https://www.mongodb.com/try/download/community).

### 4. Set up environment variables

If you do not have the .env file in the repository, enter the following commands.

```
echo LOCAL_MONGO_URI="mongodb://localhost:27017/sc2006" > .env
echo CLOUD_MONGO_URI="mongodb+srv://wenrongtan16:7F5vZcLpytTXXl9z@wr.re7utjp.mongodb.net/sc2006?retryWrites=true&w=majority" >> .env
echo ONEMAP_EMAIL="brandon02.lee@gmail.com" >> .env
echo ONEMAP_PASSWORD="WQ!*PJwF7a#k*@" >> .env
echo JWT_SECRET=123456 >> .env
echo JWT_EXPIRATION=1h >> .env
```

Note that `sc2006` in the mongo URI depends on what you named the database when setting up MongoDB.

### 5. Start the application

```
node server/server.js
npx vite
```

- Frontend: Open your browser and go to http://localhost:5173 (or the port you're using for the React app).
- Backend: Saved data should be viewable on MongoDB Compass, connect using local/cloud URIs.

## Usage

Routes are protected by authentication, so the user is required to signup/login. The user is able to search and filter for carpark information and availability at /searchpage.

## Issues

If you encounter persistent problems, feel free to raise an issue on the GitHub repository. Do provide a clear description of the problem, along with steps to reproduce.
