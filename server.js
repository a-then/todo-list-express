// ADD NECESSARY PACKAGES:

// Importing Express - a fast, unopinionated, minimalist web framework for Node.js.
const express = require('express')
// cors allows clients to make request to an external back-end server.
var cors = require('cors')
// assign express to a variable to call all express methods on
const app = express()
// Importing the official MongoDB Node.js driver to connect to a MongoDB cluster hosted on MongoDB Atlas
const MongoClient = require('mongodb').MongoClient

// new recommended package over dotenv to handle enviroment variables
require('@dotenvx/dotenvx').config()



//defining port for our app to listen to: 
//whatever is in the env var PORT OR default 2121
const PORT =  process.env.PORT || 2121


// defining vars to interact with database
let db, // declared now, defined on line 28 ~ ideally this should be within MongoClient's then call along with all handlers
    dbConnectionStr = process.env.DB_STRING, // this enviroment variable contains connecting string
    dbName = 'todo' // defining a name for a database 'todo'

// MongoClient class allows for making Connections to Mongo. Connecting to mongoDB project using url (the env var) - you can also connect using programmatically provided options
MongoClient.connect(dbConnectionStr)
    // attaching function for resolution of the Promise.
    .then(client => { 
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) // creating a new database instance named 'todo'. We will apply MongoDb methods to db 
    }) // there's no catch for errors smh nononononoooooo

// Setting express to use Embedded JS templates to render the HTML. It needs to be placed before any handlers | .use, .get, .post methods |     
app.set('view engine', 'ejs')

// EXPRESS MIDDLEWARES:

// static serves static files and takes the file name and options as params
app.use(express.static('public'))
// express' body-parser to tidy up the request object before we use them. urlencoded extracts data from the <form> element and add them to the body property in the request object
app.use(express.urlencoded({ extended: true }))
// allows our server to handle json data
app.use(express.json())

// HANDLERS:
// http method to READ data from the server. Takes a route and a callback function as params
// using async/await syntax
app.get('/',async (request, response)=>{
    // getting the 'todos' collection from the database as an array of document objects using a mongoDB read operator .find()
    const todoItems = await db.collection('todos').find().toArray()
    // gets the count of items left to do in the database
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // render view with the given data options 
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
// old then/catch syntax handling the Promise the exact same way   
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// HTTP request to CREATE a document in our database. Takes a route and a callback function as params
app.post('/addTodo', (request, response) => {
    // grabs the collection and use mongoDb write operator .insertOne()
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // closing the response by refreshing (triggers a new get request) to root /
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    // handles any errors by console logging it
    .catch(error => console.error(error))
})

// http request to UPDATE a document in our database. Takes a route and a callback function as params
app.put('/markComplete', (request, response) => {
    // grabs the collection and use one of mongoDb write operations to modify a document. .updateOne() can modify fields and values. thing is the name of the property key in the db. itemFromJS is the innerText of the li element // NOT WORKING
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // update operator to replace the value of a field with a specified one
        $set: {
            completed: true
          }
    },{
        // sorts by id in descending order because of -1
        sort: {_id: -1},
        // updates docs that match your query and inserts a new one if the are no matches when set to true. We don't need to create it so it is set to false
        upsert: false
    })
    // handles response... however is not refreshing the view???
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // handles any errors by console logging it
    .catch(error => console.error(error))
})
// another http request to UPDATE a document in our database. Takes a route and a callback function as params
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        // do not add a new document if it does not exist
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})
// http request to DELETE a document in our database. Takes a route and a callback function as params
app.delete('/deleteItem', (request, response) => {
    // grabs the collection and use one of mongoDb delete operations to delete a document. thing is the name of the property key in the db. itemFromJS is the innerText of the li element // NOT WORKING
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // handling response object 
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
// Using Express' .listen() method to create the server that browsers can connect to. Takes port and a callback fn as params.
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})