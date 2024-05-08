// selecting all trash icons
const deleteBtn = document.querySelectorAll('.fa-trash')
// select span elements within a li tag
const item = document.querySelectorAll('.item span')
// selects span elements with class completed within the li.item tag
const itemCompleted = document.querySelectorAll('.item span.completed')

// iterates thru nodeList of trash icons adding an event listener to each. Array.from() is unneccessary since .querySelectorAll() already returns an array like object: a NodeList 
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// iterates thru nodeList of spans adding an event listener to each. Array.from() is unneccessary since .querySelectorAll() already returns an array like object: a NodeList
Array.from(item).forEach((element)=>{
    // when clicked happens markComplete triggers 
    element.addEventListener('click', markComplete)
})
// iterates thru nodeList of span.completed adding an event listener to each. Array.from() is unneccessary since .querySelectorAll() already returns an array like object: a NodeList
Array.from(itemCompleted).forEach((element)=>{
    // when clicked, calls markUnCompleete
    element.addEventListener('click', markUnComplete)
})

// Asynchronous fn to delete items. Async fns return a promise that is resolve whenever the fn returns something and rejected if the body throws an exception. // NOT WORKING
async function deleteItem(){
    // childNodes contains an array of nodes that exists within parentNode and spaces and breaklines can change the amount of nodes. this.parentNode.children[1].innerText is a better option because only accounts for HTML elements
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // fetch(endpoint, options) - endpoint is where we want to send our request for our API to handle it in the backserver and options give our API neccessary info to response with the correct info
        const response = await fetch('deleteItem', {
            // setting Fetch's method to delete
            method: 'delete',
            // telling the server we are sending JSON data
            headers: {'Content-Type': 'application/json'},
            // so we need to convert our js object into JSON data via the body property
            
            body: JSON.stringify(
                // the object we're converting
                // Our server gets the request.body from this object
                {
                    'itemFromJS': itemText
                }
            )
          })
        // waiting for server to respond with JSON data and converts to JS object
        const data = await response.json()
        // we can see it
        console.log(data)
        // refresh the page (new GET req)
        location.reload()

    } catch(err){ // handles errors
        console.log(err)
    }
}
// Async fn to mark items as completed. // NOT WORKING
async function markComplete(){
    // selecting item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // fetch request to our server
        const response = await fetch('markComplete', {
            // tells our API is a PUT request
            method: 'put',
            // defines the type of data we are sending - JSON
            headers: {'Content-Type': 'application/json'},
            // converts the data in the body of our req into JSON
            body: JSON.stringify(
                // the object
                {
                'itemFromJS': itemText
                }
            )
          })
        const data = await response.json()
        console.log(data)
        // refresh the page (new GET req)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// Async fn to mark items as Uncompleted.
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // fetch request to our API with markUncomplete as endpoint and options to interact with it
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          // handles response
        const data = await response.json()
        console.log(data)
        // refresh the page (new GET req)
        location.reload()

    }catch(err){
        console.log(err)
    }
}