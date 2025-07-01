create database aalie;
create table sales_data(
id int PRIMARY KEY AUTO_INCREMENT,
product_name VARCHAR(255),
q1_sales decimal(10,2),
q2_sales decimal(10,2),
q3_sales decimal(10,2),
q4_sales decimal(10,2),
target decimal(10,2),
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp);
insert into sales_data(product_name,q1_sales,q2_sales,q3_sales,q4_sales,target) value ('T-shirt',10,10,10,10,50);
insert into sales_data(product_name,q1_sales,q2_sales,q3_sales,q4_sales,target) value ('Laptop',100,200,50,300,500);
insert into sales_data(product_name,q1_sales,q2_sales,q3_sales,q4_sales,target) value ('Scooter',10,10,10,10,40);