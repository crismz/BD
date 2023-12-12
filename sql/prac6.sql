# Ejercicio 1
SELECT officeCode from employees
GROUP BY officeCode
ORDER BY COUNT(officeCode) DESC LIMIT 1;


# Ejercicio 2
SELECT AVG(orders) as averageOrders 
FROM (SELECT COUNT(orderNumber) as orders, e.officeCode  FROM orders o
	INNER JOIN customers c 
	ON o.customerNumber = c.customerNumber 
	INNER JOIN employees e 
	ON c.salesRepEmployeeNumber = e.employeeNumber
	GROUP BY e.officeCode 
) as orderCounts;

WITH Products_Office AS (
	SELECT SUM(od.quantityOrdered) AS quantityProducts, e.officeCode FROM orderdetails AS od 
	INNER JOIN orders AS o
	ON od.orderNumber = o.orderNumber 
	INNER JOIN customers c 
	ON o.customerNumber = c.customerNumber 
	INNER JOIN employees e 
	ON e.employeeNumber = c.salesRepEmployeeNumber 
	GROUP BY e.officeCode 
	ORDER BY quantityProducts DESC
)
SELECT officeCode FROM Products_Office LIMIT 1;

# Ejercicio 3
SELECT MAX(amount), MIN(amount), AVG(amount), MONTH(paymentDate) AS month 
FROM payments p
GROUP BY month;

# Ejercicio 4
DROP PROCEDURE IF EXISTS UpdateCredit;
CREATE PROCEDURE UpdateCredit(in client int(11), 
							  in newLimit decimal(10,2))
UPDATE customers SET creditLimit = newLimit
WHERE client = customers.customerNumber;


# Ejercicio 5
DROP VIEW IF EXISTS PremiumCustomers;
CREATE VIEW PremiumCustomers AS 
	SELECT c.customerName, c.city, SUM(p.amount) AS totalAmount 
	FROM customers c 
	INNER JOIN payments p 
	ON c.customerNumber = p.customerNumber 
	GROUP BY c.customerName, c.city 
	ORDER BY totalAmount DESC LIMIT 10;

# Ejercicio 6
DROP FUNCTION IF EXISTS EmployeeOfTheMonth;

DELIMITER &&
CREATE FUNCTION EmployeeOfTheMonth(inputMonth INTEGER,
        						   inputYear INTEGER)
RETURNS VARCHAR(100)
DETERMINISTIC
BEGIN
	DECLARE employeeFullName varchar(100);

	SELECT CONCAT(e.firstName, ' ', e.lastName)
	INTO employeeFullName
	FROM employees e 
	INNER JOIN customers c 
	ON e.employeeNumber = c.salesRepEmployeeNumber 
	INNER JOIN orders o 
	ON c.customerNumber = o.customerNumber 
	WHERE MONTH(o.orderDate) = inputMonth 
	AND YEAR(o.orderDate) = inputYear
	GROUP BY e.employeeNumber 
	ORDER BY COUNT(o.orderNumber) DESC LIMIT 1;

	return employeeFullName;
END&&
DELIMITER ;

# Ejercicio 7
DROP TABLE IF EXISTS ProductRefillment;

CREATE TABLE ProductRefillment (
	refillmentID INT NOT NULL AUTO_INCREMENT,
	productCode varchar(15) NOT NULL,
	orderDate date NOT NULL,
	quantity INT(6),
	CONSTRAINT ProductRefillmentPK PRIMARY KEY (`refillmentID`),
 	CONSTRAINT `ProductRefillment_ibfk_1` 
 	FOREIGN KEY (`productCode`) REFERENCES `products` (`productCode`)
);

# Ejercicio 8
DROP TRIGGER IF EXISTS RestockProduct;
DELIMITER &&
CREATE TRIGGER RestockProduct
AFTER INSERT ON orderdetails
FOR EACH ROW
BEGIN
 	DECLARE condicion INT;
    
    -- Obtener las condiciones de las otras tablas
   	SELECT p.quantityInStock INTO condicion
    FROM products p WHERE p.productCode = NEW.productCode;
    
    -- Verificar la condición
    IF (condicion - NEW.quantityOrdered) < 10 THEN
        -- Insertar un nuevo pedido
        INSERT INTO ProductRefillment (productCode, orderDate, quantity) 
        VALUES (NEW.productCode, CURDATE(), 10);
    END IF;
END&&
DELIMITER ;


# Ejercicio 9
CREATE ROLE Empleado;
GRANT SELECT ON * TO Empleado;
GRANT CREATE VIEW ON * TO Empleado;



