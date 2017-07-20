const Inquirer = require('inquirer');
const Promises = require('bluebird');
const MySQL = Promises.promisifyAll(require('mysql'));
const Product = require("./includes/Product.js");
Promises.promisifyAll(require("mysql/lib/Connection").prototype);
Promises.promisifyAll(require("mysql/lib/Pool").prototype);
// Promises.promisifyAll(require("./includes/Product.js").prototype);



var connection = MySQL.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "dataguard",
  database: "bamazon"
});
let product = new Product(connection);

let selectQuery = "SELECT * FROM products";

const question = [{
  name: "customerOption",
  type: "list",
  message: "What would you like to do?",
  choices: [{
      name: "View products",
      value: "view"
    },
    {
      name: "Purchase product",
      value: "purchase"
    },
    {
      name: "Exit",
      value: "exit"
    }
  ]
}];

function askQuestion() {
  console.log("------------------------------")
  Inquirer.prompt(question).then((data) => {
    if (!data.customerOption) {
      throw "Error: Choice invalid";
    }

    switch (data.customerOption) {
      case "view":
        // Promises.promisify(product.viewForSale()).then( () => { askQuestion(); })
        product.viewForSale().then(() => { askQuestion(); })
        break;
      case "purchase":
        connection.queryAsync(selectQuery).then(response => {
          let choices = response.map(item => {
            return {
              name: item.product_name,
              value: item.id,
              cost: item.price,
              department: item.department_name,
              quantity: item.stock_quantity
            }
          });
          Inquirer.prompt([{
              name: "customerPurchase",
              message: "Which item do you wish to purchase?",
              type: "list",
              choices: choices,
              pageSize: 10
            }])
            .then(data => {
              var itemIndex = choices.findIndex(i => i.value == data.customerPurchase);
              Inquirer.prompt({
                  name: "purchaseQuantity",
                  type: "text",
                  message: "How many do you wish to purchase?"
                })
                .then(data => {
                  // Check to make sure quantity is valid
                  if (choices[itemIndex].quantity >= data.purchaseQuantity) {
                    // Update database
                    console.log("We can make your purchase");
                    connection.queryAsync("UPDATE products SET stock_quantity = ?", (choices[itemIndex].quantity - data.purchaseQuantity)).then(() => {
                      var total = data.purchaseQuantity * choices[itemIndex].cost;
                      console.log(`Your total is $${total}`);
                      askQuestion();
                    })
                  } else {
                    console.log("Insufficient Quantity");
                    askQuestion();
                  }
                })
            })
            .catch(err => { throw err; })
        })
        // let choices = [];
        // product.getAllItems().then(item => {
        //     choices = response.map(item => {
        //       return {
        //         name: item.product_name,
        //         value: item.id,
        //         cost: item.price,
        //         department: item.department_name,
        //         quantity: item.stock_quantity
        //       }
        //     });
        //   })
        //   
        // connection.queryAsync(selectQuery).then(response => {
        //     let choices = response.map(item => {
        //       return {
        //         name: item.product_name,
        //         value: item.id,
        //         cost: item.price,
        //         department: item.department_name,
        //         quantity: item.stock_quantity
        //       }
        //     });

        //     let purchaseQuestion = [{
        //       name: "customerPurchase",
        //       message: "Which item do you wish to purchase?",
        //       type: "list",
        //       choices: choices
        //     }];

        //     Inquirer.prompt(purchaseQuestion)
        //       .then(data => {
        //         var itemIndex = choices.findIndex(i => i.value == data.customerPurchase);
        //         Inquirer.prompt({
        //             name: "purchaseQuantity",
        //             type: "text",
        //             message: "How many do you wish to purchase?"
        //           })
        //           .then(data => {
        //             // Check to make sure quantity is valid
        //             if (choices[itemIndex].quantity >= data.purchaseQuantity) {
        //               // Update database
        //               console.log("We can make your purchase");
        //               connection.queryAsync("UPDATE products SET stock_quantity = ?", (choices[itemIndex].quantity - data.purchaseQuantity)).then(() => {
        //                 var total = data.purchaseQuantity * choices[itemIndex].cost;
        //                 console.log(`Your total is $${total}`);
        //                 askQuestion();
        //               })
        //             } else {
        //               console.log("Insufficient Quantity");
        //               askQuestion();
        //             }
        //           })
        //       })
        //   })

        break;
      case "exit":
        connection.end();
        console.log("Thank you for shopping on bAmazon!");
        return;
        break;

    }
  });
}

askQuestion();



// if (data.customerOption === "view") {
//   console.log("Available Items");
//   console.log("---------------");
//   connection.queryAsync(selectQuery)
//       .then(data => {
//       	data.forEach(function(item) {
//       		console.log(item.id + " " + item.product_name + " $" + item.price);
//       	})
//       }) //console.log(JSON.stringify(data, null, 2))
//       .then(() => { askQuestion(); })
//       .catch((err) => { throw err });
// }

// if (data.customerOption === "purchase") {
//   connection.queryAsync(selectQuery).then(response => {
//     let choices = response.map(item => {
//       return {
//         name: item.product_name,
//         value: item.id,
//         cost: item.price,
//         department: item.department_name,
//         quantity: item.stock_quantity
//       }
//     });
//     Inquirer.prompt([{
//         name: "customerPurchase",
//         message: "Which item do you wish to purchase?",
//         type: "list",
//         choices: choices
//       }])
//       .then(data => {
//         var itemIndex = choices.findIndex(i => i.value == data.customerPurchase);
//         Inquirer.prompt({
//             name: "purchaseQuantity",
//             type: "text",
//             message: "How many do you wish to purchase?"
//           })
//           .then(data => {
//             // Check to make sure quantity is valid
//             if (choices[itemIndex].quantity >= data.purchaseQuantity) {
//               // Update database
//               console.log("We can make your purchase");
//               connection.queryAsync("UPDATE products SET stock_quantity = ?", (choices[itemIndex].quantity - data.purchaseQuantity)).then(() => {
//                 var total = data.purchaseQuantity * choices[itemIndex].cost;
//                 console.log(`Your total is $${total}`);
//                 askQuestion();
//               })
//             } else {
//               console.log("Insufficient Quantity");
//               askQuestion();
//             }
//           })
//       })
//       .catch(err => { throw err; })
//   })
// }

// if (data.customerOption === "exit") {
//   connection.end();
//   console.log("Thank you for shopping on bAmazon!")
//   return;
// }