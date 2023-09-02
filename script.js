import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref,push ,onValue , remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-5e101-default-rtdb.asia-southeast1.firebasedatabase.app/"
}
const app = initializeApp(appSettings)             //app is the key thing that connect our project to the database i.e firebase
const database = getDatabase(app)
const shoppingListInDB = ref(database,"shoppingList")      //ref take database then we call this ref as shopping list

const inputFieldEl=document.getElementById("input-field");
const addButtonEl= document.getElementById("add-button");
const shoppingListEl= document.getElementById("shopping-list")

addButtonEl.addEventListener("click",()=>{
    // console.log("ALL WELL");
    // console.log(inputFieldEl);     //idhar ye likne se hamri html print ho raha we want values so .value
    let inputValue=inputFieldEl.value;

    push(shoppingListInDB, inputValue)  //firebase fun push in list the inputValue
    // console.log(inputValue);
    clearInputFieldEl();
    // appendItemToShoppingListEl(inputValue)       commented this to solve BUG112

})
onValue(shoppingListInDB, function(snapshot){
    //SOLUTION TO CHALLENGE 2 that last element get deleted without ERROR use snapshot.exists()

    if(snapshot.exists()){
        let itemsArray = Object.entries(snapshot.val())     //value -> entires so both UNIQUE key and value will show 

        // console.log(snapshot.val())             //we get both the ID and the Item in the console like in below comment
        // -NdK_qJDO-X0wK6xXnNv: 'momo', -NdKyDs4v7zHlrmPAYiu: 'pizza', -NdL-NXfk-ohojY6y4QG: 'pasta', -NdL-eN8fKXxhXSYaIUQ: 'chilli sauce', -NdL04v7eSKBo6nGWrRg: 'Idli Sambar'}
    
    
        // console.log(itemsArray)                           //we get the array of all the elements present in our list 
    
        clearShoppingListEl()                     //SOLVED BUG111 but another BUG112 happend as pasta added twice 
    
        for(let i=0; i< itemsArray.length; i++){
            // console.log(itemsArray[i])     
            //now is array ki wajh se baar baar momos and jo element add kar rahe(say pizza ) baar baar aa raha -----BUG111
    
            let currentItem = itemsArray[i]
    
            let currentItemID= currentItem[0]        //will give only key UNIQUE ID
            let currentItemValue= currentItem[1]     //will give the value of the item only
            // appendItemToShoppingListEl(currentItemValue)    sirf value jaa rahi thi but we want both val and key
    
            appendItemToShoppingListEl(currentItem)
        }
    }
    else{
        shoppingListEl.innerHTML= "No items here....yet"
    }

})

function clearShoppingListEl(){
    shoppingListEl.innerHTML = ""   
}

function clearInputFieldEl(){
    inputFieldEl.value = ""
}
// WE NEED TO REPLACE INNER-HTML WITH CREATE ELEMENT  ------CHALLENGES IN PROJECT
//AS jab delete karenge toh hame har ek key mai same function rakhna hai ki click karne pe vo key delete ho jaye
//but since ham inner html se daal rahe hai we can't have that thing done with one single function har ek elemnt ke liye
//baar baar vohi cheez likni padegi si isiliye create element

//STEP1   new <li>
//STEP2    give <li>text<li>    give text
//STEP3    put the <li> in <ul>
function appendItemToShoppingListEl(item){
    // shoppingListEl.innerHTML += `<li>${itemValue}</li>`
    let itemID= item[0]
    let itemValue=item[1]
    //1
    let newEl= document.createElement("li")

    //2
    newEl.textContent = itemValue

    newEl.addEventListener("click", ()=>{
        // console.log(itemID)

        // will go in shoppingList then the key of the element that to be deleted the key would be found using (/itemID)
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)     //so this give the exact location of the item in database

        remove(exactLocationOfItemInDB)          //will remove the database itself
    })

    //3
    shoppingListEl.append(newEl)
}










//FIre base generate the IDs automatically!!

//Database for first time toh kahli ko add item kar deti thi or sochti thi ye empty boxes kaha se aa rahe hai

//CHALLENGES IN PROJECT-----------2
//Cannot convert undefined or null to object ==========when we tried to remove all the elements from the list it show this ERROR

// SOLUTION ==
// Whwn we delete the last item we also delete the shoppingList REFERENCE SO When the reference no longer exist 
//this onValue function fails so we don't get snapshot as snapshot exist hi nhi karta 