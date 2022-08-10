//import jsonwebtoken
const jwt = require('jsonwebtoken')


//import db.js
const db = require('./db')


//database- bank
userDetails = {
  1000: { acno: 1000, username: 'Neer', password: 1000, balance: 50000, transaction: [] },
  1001: { acno: 1001, username: 'Devika', password: 1001, balance: 4000, transaction: [] },
  1002: { acno: 1002, username: 'Ammu', password: 1002, balance: 6000, transaction: [] }
}

//register
const register = (acno, username, password) => {
  return db.User.findOne({ acno })
    .then(user => {
      if (user) {
        return {
          statusCode: 401,
          status: false,
          message: 'User already exist.... please Login'
        }
      }
      else {
        const newUser = new db.User({
          acno,
          username,
          password,
          balance: 0,
          transaction: []
        })
        newUser.save()
        return {
          statusCode: 200,
          status: true,
          message: 'successfully register'
        }
      }
    })


}


//login
const login = (acno, pswd) => {
  return db.User.findOne({
    acno,
    password: pswd
  })
    .then(user => {
      if (user) {
        currentUser = user.username
        currentAcno = acno
        //token generation
        const token = jwt.sign({
          currentAcno: acno
        }, 'supersecretkey12345')
        return {
          statusCode: 200,
          status: true,
          message: "Successfully logged in",
          currentUser,
          currentAcno,
          token
        }
      }
      else {

        return {
          statusCode: 401,
          status: false,
          message: "Incorrect password / account number"
        }
      }
    })
}

//deposit
const deposit = (acno, pswd, amt) => {
  var amount = parseInt(amt)

  return db.User.findOne({
    acno,
    password: pswd
  })
    .then(user => {
      if (user) {
        user.balance += amount
        user.transaction.push({
          type: 'CREDIT',
          amount
        })
        user.save()
        return {
          statusCode: 200,
          status: true,
          message: `${amount} credited and new balance is ${user.balance}`
        }
      }
      else {

        return {
          statusCode: 401,
          status: false,
          message: "incorrect password/account number"
        }
      }
    })
}


//withdrawal
const withdrawal = (acno, pswd, amt) => {
  var amount = parseInt(amt)

  return db.User.findOne({
    acno,
    password: pswd
  })
    .then(user => {
      if (user) {
        if (user.balance > amount) {


          user.balance -= amount
          user.transaction.push({
            type: 'DEBIT',
            amount
          })
          user.save()
          return {
            statusCode: 200,
            status: true,
            message: `${amount} debited and new balance is ${user.balance}`
          }

        }
        else{
          return {
            statusCode: 401,
            status: false,
            message: "insufficent balance"
          }
        }
      }
      else {

        return {
          statusCode: 401,
          status: false,
          message: "Incorrect password/account number"
        }

      }
    })

}


//transaction
const getTransaction = (acno) => {
  
  return db.User.findOne({
    acno
  })
    .then(user => {
      if (user) {
        return {
          statusCode: 200,
          status: true,
          transaction: user['transaction']
        }
      }
      else{
        return{
          statusCode:401,
          status:false,
          message: "User doesnot exist"
        }
      }
    })


  

}
//export all function- should be defined at last
module.exports = {
  register,
  login,
  deposit,
  withdrawal,
  getTransaction
}
