DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(45) NOT NULL,
department_name VARCHAR(45) NOT NULL,
price DECIMAL (10,2) NOT NULL,
stock_quantity INT NOT NULL,
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity ) 

VALUES  ('Fenty Foil Highlighter Palette', 'Makeup', '54.00', '94'),
        ('NARS Velvet Lipstick Vault', 'Makeup', '150.49', '100'),
        ('Benefit they"re real', 'Makeup', '25.00', '62'),
        ('Urban Decay Naked3 Eyeshadow Palette', 'Makeup', '49.99', '2'),
        ('Farmacy Honey Drop Moisturizer', 'Skincare', '65.99', '55'),
        ('Kopari COconut Melt', 'Skincare', '28.00', '30'),
        ('Earth"s Nectar Scalp Oil', 'Hair', '18.50', '26'),
        ('DevaCurl Cleanser', 'Hair', '44.00', '62'),
        ('Marc Jacobs Daisy', 'Fragrance', '104.00', '88'),
        ('Ralph Lauren Romance', 'Fragrance', '76.99', '73');
