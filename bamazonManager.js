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

    //Once connected prompt questions
    startPrompt()
});

function startPrompt() {

    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;

        //Using collected data, promt questions about products 
        inquirer
            .prompt([{
                name: "request",
                type: "list",
                message: "What would you like to do?",
                choices: [`View Products for Sale`, `View Low Inventory`, `Add to Inventory`, `Add New Product`, `Close App`]
            }])
            .then(function (answer) {
                if (answer.request === `View Products for Sale`) {
                    for (var i = 0; i < response.length; i++) {
                        console.log(response[i].item_id + ") " + response[i].product_name + " - Price: $" + response[i].price + " - Quantity: " + response[i].stock_quantity);
                    }
                    console.log("\n");
                    startPrompt();
                }
                if (answer.request === `View Low Inventory`) {
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].stock_quantity < 5)
                            console.log(response[i].item_id + ") " + response[i].product_name + " - Quantity: " + response[i].stock_quantity);
                    }
                    console.log("\n");
                    startPrompt();
                }

                if (answer.request === `Add to Inventory`) {
                    // your app should display a prompt that will let the manager "add more" of any item currently in the store.
                    for (var i = 0; i < response.length; i++) {
                        console.log(response[i].item_id + ") " + response[i].product_name + " - Price: $" + response[i].price + " - Quantity: " + response[i].stock_quantity);
                    }
                    console.log("\n");

                    addInventory();
                }

                   if (answer.request === `Add New Product`){
                    // it should allow the manager to add a completely new product to the store.
                    addProduct();
                   }

                   if (answer.request === `Close App`){
                    //this will end connection
                    
                   }
                   
            });
    });
}


function addInventory() {

    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;

        inquirer
            .prompt([{
                name: "id",
                type: "input",
                message: "What is the ID number of the product you wish to buy?"
            }, {
                name: "quantity",
                type: "input",
                message: "How many would you like to add?"
            }])
            .then(function (answer) {
                var chosenItem = parseInt(answer.id) - 1;

                var updateQuanity = response[chosenItem].stock_quantity;

                var newQuantity = updateQuanity += parseInt(answer.quantity);

                // Update quantity on database
                var query2 = connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [{
                            stock_quantity: updateQuanity
                        },
                        {
                            product_name: response[chosenItem].product_name
                        }
                    ],
                    function (err, res) {
                        console.log("The total quanity for " + response[chosenItem].product_name + " = " + newQuantity + "\n");
                        startPrompt();
                    }
                )
            });
    });
}

function addProduct() {
    // prompt  for adding item
    inquirer
      .prompt([
        {
          name: "item",
          type: "input",
          message: "What is the item you would like to add to inventory?"
        },
        {
          name: "department",
          type: "input",
          message: "What departmant would you like your item in?"
        },
        {
          name: "price",
          type: "input",
          message: "How much will the item be?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
          name: "quanity",
          type: "input",
          message: "How many will you add?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "INSERT INTO products SET ?",
          {
            product_name: answer.item,
            department_name: answer.department,
            price: answer.price,
            stock_quantity: answer.quanity
          },
          function(err) {
            if (err) throw err;
            console.log("Your product was added successfully!");
            // re-prompt the user for if they want to bid or post
            startPrompt();
          }
        );
      });
  }