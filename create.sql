CREATE SCHEMA IF NOT EXISTS bamazon;

USE bamazon;
CREATE TABLE IF NOT EXISTS products(
	id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    deparment_name VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER NOT NULL,
    
    PRIMARY KEY (id)
)

INSERT INTO bamazon (product_name, deparment_name, price, stock_quantity)
VALUES 
	("Chair", "Furniture", 50.00, 10),
	("Pencil", "Office Products", 5.00, 100),
	("Sharpie", "Office Products", 1.99, 100),
	("Water Jug", "Sports & Outdoors", 25.00, 25),
	("Laptop", "Electronics", 450.00, 10)