var mysql = require("mysql");
var inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon_db"
});

//Establishing connection
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    //Once connected display the items for sale
    displayProducts();
});


//Function for displaying the products
function displayProducts() {
    console.log("List of products \n");

    //Collect table data from database
    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;
        for (var i = 0; i < response.length; i++) {
            console.log(response[i].item_id + ") " + response[i].product_name +" $"+response[i].price);
        }
        console.log("\n");
        //Once data is collected start prompt to but porducts
        startPrompt();
    });
}

function startPrompt() {

    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;
 
        //Using collected data, promt questions about products 
        inquirer
            .prompt([{
                name: "id",
                type: "input",
                message: "What is the ID number of the product you wish to buy?"
            }, {
                name: "quantity",
                type: "input",
                message: "How many would you like to purchase?"
            }])
            .then(function (answer) {
                var chosenItem = parseInt(answer.id) -1;

                var updateQuanity = response[chosenItem].stock_quantity;


                if (updateQuanity > answer.quantity){
                    console.log("\n");
                    console.log("Your order is in stock!")
                    updateQuanity -= answer.quantity
                    
                    var totalPrice = answer.quantity * response[chosenItem].price;
                    console.log("The total price for " + response[chosenItem].product_name + " is $" +totalPrice)
                    
                }else{
                    console.log("We do not have enough " + response[chosenItem].product_name +" to fill your order." )
                }

                // Update quantity on database
                var query2 = connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                      {
                        stock_quantity: updateQuanity 
                      },
                      {
                        product_name: response[chosenItem].product_name
                      }
                    ],
                    function(err, res) {
                      console.log(response[chosenItem].stock_quantity + " products updated!\n");
                    }
                )
                
            });
            
    });

}

function updateData(){
    console.log("\n");
   
}