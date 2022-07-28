const express = require('express')//easy variable name that tells node to use express module
const app = express()//easy variable name that calls express function exported by express modude
const MongoClient = require('mongodb').MongoClient//easy variable name that tells node to use mongodb module
const PORT = 2121//easy variable name that defines the port were using
require('dotenv').config()//tells node to use config function in dotenv module... i think


let db,// declares db variable to assign later 
    dbConnectionStr = process.env.DB_STRING, //declare variable to 
    dbName = 'todo'// declare variable to store db name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })// connects server to db
    .then(client => {// if connection successful will execute code in curly braces
        console.log(`Connected to ${dbName} Database`)// logs successful connection to dbname
        db = client.db(dbName)// reassigns db variable
    })
    
app.set('view engine', 'ejs')// sets view engine in express to ejs
app.use(express.static('public'))// tells express to use the static files in the public folder
app.use(express.urlencoded({ extended: true }))// tells express to parse urlencoded data
app.use(express.json())// tells express to parse json data


app.get('/',async (request, response)=>{//responds to get requests from client from urls ending in /
    const todoItems = await db.collection('todos').find().toArray()// connects to db to grabs todos collection and places in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})// connects to db to count all of the documents in the todos collection with completed value of false
    response.render('index.ejs', { items: todoItems, left: itemsLeft })// renders the ejs file in the public folder and slots the previous to requests to the db in to the dom
    
    //looks like all of the commented out stuff below is just a way to do the same thing but with then and catch instead of async await
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {// handles post requests for url ending in /addTodo
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})// inserts one new document into the todos collection with stats of completed false
    .then(result => {//once server responds following code runs
        console.log('Todo Added')//console logs message todo added
        response.redirect('/')// refresh page
    })
    .catch(error => console.error(error))// if server doesnt respond throws error
})

app.put('/markComplete', (request, response) => {// responds to put requests sent to url endingin /markComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//updates an item in the todos collection, that client specified
        $set: {//sets completed value of object in db to true
            completed: true
          }
    },{
        sort: {_id: -1}, //sorts items in db in descending order
        upsert: false //prevents db from adding new item if it doesn't already exist
    })
    .then(result => {//promise waiting for server response, if successful following code executes
        console.log('Marked Complete')// logs marked complete
        response.json('Marked Complete')// tells the client that the update was completed
    })
    .catch(error => console.error(error))// if db doesnt respond throws error

})

app.put('/markUnComplete', (request, response) => {// responds to put requests sent to url endingin /markUnComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//updates an item in the todos collection, that client specified
        $set: {//sets completed value of object in db to false
            completed: false
          }
    },{
        sort: {_id: -1}, //sorts items in db in descending order
        upsert: false //prevents db from adding new item if it doesn't already exist
    })
    .then(result => {//promise waiting for server response, if successful following code executes
        console.log('Marked Incomplete')// logs marked incomplete
        response.json('Marked Incomplete') //tells client incomplete
    })
    .catch(error => console.error(error))// if db doesnt respond throws error 

})

app.delete('/deleteItem', (request, response) => {// responds to delete requests sent to url ending in /deleteItem
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//delete an item in the todos collection, that client specified
    .then(result => {//promise waiting for server response, if successful following code executes
        console.log('Todo Deleted')// logs todo deleted
        response.json('Todo Deleted')// logs todo deleted
    })
    .catch(error => console.error(error))// if db doesnt respond throws error 

})

app.listen(process.env.PORT || PORT, ()=>{// server smurf listening at the port we defined or the port the env file defines
    console.log(`Server running on port ${PORT}`)//log port were using
})