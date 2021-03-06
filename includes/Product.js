class ProductController {
  constructor(connection) {
    this.connection = connection;
  }

  getAllItems() {
    return this.connection.queryAsync("SELECT * FROM products");
  }

  getList() {
    return this.getAllItems().then(
      data => data.map(item => {
        return {
          name: item.product_name,
          value: item.id,
          cost: item.price,
          department: item.department_name,
          quantity: item.stock_quantity
        }
      })
    );
  }

  updateInventory(id, quantity) {
    return this.connection
      .queryAsync("UPDATE products SET quantity = ? WHERE id = ?", [id, quantity])
      .then(() => {
        this.connection.end();
        console.log("Inventory updated");
      })
      .catch(err => { throw err; });
  }

  viewForSale() {
    console.log("================");
    console.log(" Items For Sale ");
    console.log("================");
    return this.getAllItems()
      .then(data =>
        data.forEach(
          item => console.log(item.id + " " + item.product_name + " $" + item.price)
        )
      );
  }
}

module.exports = ProductController;