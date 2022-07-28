const deleteBtn = document.querySelectorAll('.fa-trash')// references delete buttons in the index.ejs
const item = document.querySelectorAll('.item span')// references spans that are children of elements classed item
const itemCompleted = document.querySelectorAll('.item span.completed')// references spans with class completed that are children of elements classed item

Array.from(deleteBtn).forEach((element)=>{// makes an array of all delete buttons
    element.addEventListener('click', deleteItem)// listen for user click on delete button
})

Array.from(item).forEach((element)=>{// makes an array of the all items
    element.addEventListener('click', markComplete)// listens for user click on items
})

Array.from(itemCompleted).forEach((element)=>{// makes an array of all the items completed
    element.addEventListener('click', markUnComplete)// listens for user clicks on completed items
})

async function deleteItem(){//function declaration
    const itemText = this.parentNode.childNodes[1].innerText//looks at the trash bin element, goes to the parent, then goes to child[1], grabs innertext
    try{
        const response = await fetch('deleteItem', {// making fetch request variable
            method: 'delete',// with method delete to delete item in the db
            headers: {'Content-Type': 'application/json'},//and the request is in json
            body: JSON.stringify({// converts json object to string
              'itemFromJS': itemText
            })
          })
        const data = await response.json()// converts json string into json object
        console.log(data) // console logs data from above
        location.reload()// reloads current url

    }catch(err){
        console.log(err)// logs if there is an error
    }
}

async function markComplete(){// function declaration
    const itemText = this.parentNode.childNodes[1].innerText//looks at element, goes to the parent, then goes to child[1], grabs innertext
    try{
        const response = await fetch('markComplete', {// making fetch request variable
            method: 'put',// put method to update item in db
            headers: {'Content-Type': 'application/json'},//and the request is in json
            body: JSON.stringify({// converts json object to string
                'itemFromJS': itemText
            })
          })
        const data = await response.json()// converts json string into json object
        console.log(data)// console logs data from abov
        location.reload()// reloads current url

    }catch(err){
        console.log(err)// logs if there is an error
    }
}

async function markUnComplete(){// function declaration
    const itemText = this.parentNode.childNodes[1].innerText//looks at element, goes to the parent, then goes to child[1], grabs innertext
    try{
        const response = await fetch('markUnComplete', {// making fetch request variable
            method: 'put',// put method to update item in db
            headers: {'Content-Type': 'application/json'},//and the request is in json
            body: JSON.stringify({// converts json object to string
                'itemFromJS': itemText
            })
          })
        const data = await response.json()// converts json string into json object
        console.log(data)// console logs data from abov
        location.reload()// reloads current url

    }catch(err){
        console.log(err)// logs if there is an error
    }
}