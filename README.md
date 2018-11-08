# Project Title
This is a testing version of our FYP, consisting of two parts:
- demo_app: an web application using MERN framework
- decentral_app: an simple web app (HTML CSS JS) building on Ethereum

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


## demo_app

I build the thing following this:
https://medium.com/javascript-in-plain-english/full-stack-mongodb-react-node-js-express-js-in-one-simple-app-6cc8ed6de274

You should be able to start deploying by:
```
$ cd demo_app
$ npm start
```

See if work and try play around!

## dencentral_app
ref: http://www.dappuniversity.com/articles/the-ultimate-ethereum-dapp-tutorial
(note that i changed some of the name i.e Candidate contract --> Upload contract)

Please install all the dependency:
1. NPM (you should have got it from demo_app)
2. Truffle
3. Ganache
4. Metamask extension

You should be able to start deploying by:
```
$ cd decentral_app
$ truffle migrate --reset
$ npm start dev
```

Brief Notes
- contacts:  for writing Solidity contracts
- migrations: for deploying contracts
- test: for writing test cases and to be ran by ```truffle test```
- src: web resources
