# Project Title
This is a testing version of our FYP, consisting of two parts:
- demo_app: an web application using MERN framework
- decentral_app: an responsive web application (ReactJS, NodeJS, html,css) building on Ethereum (Solidity)
    - image uploading platform
    - use of cloudinary, mongoDB, ethereum
## Git stuff
Hi, please set up git on your laptop to start working!

### Setting up git on terminal
1. Set up your account
```
$ git config --global user.name "Mona Lisa"
$ git config --global user.email "your email"
```

2. Pull the project to a location of your choice (try if okay there might be some authority issue)
```
$ cd myDir
$ git clone https://github.com/vanessay1309/FYP-demo
```
3. You can now start working


### Everytime you work on the project
1. check if there is any new update
```
$ git pull
```

2. Work on the Project

3. Upload you updates
```
$ git add *
$ git commit -m "CommitMessage i.e LayoutChange"
$ git push origin master
```

Done! We can use branching if u gonna try dangerous thing but i m not very familiar with it too so lets stick with master branch atm lol

### directory / document conflicts
```
  $ git reset --hard HEAD   //--> reset and point to the most updated part
  $ git pull
```
### check npm package update
```
  $ npm update   //--> run package.json --> validate the changes/updates for all packages
```
## demo_app
ref: 2.Design & analysis/Second Deliverable/Demo development notes


## dencentral_app
ref: implementation notes

Stat the app by:
```
$ cd decentral_app
$ truffle migrate --reset // reset local blockchain record 
$ cd client
$ npm start         // start server with default port 4000
$ npm run dev       // start web application
```
