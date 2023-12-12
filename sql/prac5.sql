# Ejercicio 1
DROP TABLE IF EXISTS directors;
CREATE TABLE directors (
	Nombre VARCHAR(50) NOT NULL,
	Apellido VARCHAR(50) NOT NULL,
	Numero_Peliculas INT NOT NULL
);

# Ejercicio 2

INSERT INTO directors 
SELECT first_name, last_name, count(ac.actor_id) AS count FROM actor AS ac
	INNER JOIN film_actor AS fa
	WHERE ac.actor_id  = fa.actor_id 
	GROUP  BY ac.actor_id 
	ORDER BY count DESC LIMIT 5;

# EJercicio 3
ALTER TABLE customer ADD premium_customer enum('T','F') NOT NULL DEFAULT 'F';

# Ejercicio 4
/*
UPDATE customer 
SET premium_customer = 'T'
WHERE customer_id IN (
	SELECT customer_id FROM ( 
		SELECT c.customer_id, SUM(p.amount) AS totalAmount 
		FROM customer AS c
		INNER JOIN payment AS p 
		ON c.customer_id = p.customer_id 
		GROUP BY c.customer_id 
		ORDER BY totalAmount DESC LIMIT 10
	) as t1
); 
*/

WITH TopCustomers AS (
    SELECT c.customer_id, SUM(p.amount) AS totalAmount
    FROM customer AS c
    INNER JOIN payment AS p ON c.customer_id = p.customer_id
    GROUP BY c.customer_id
    ORDER BY totalAmount DESC
    LIMIT 10
)
UPDATE customer 
SET premium_customer = 'T'
WHERE customer_id IN (SELECT customer_id FROM TopCustomers);

# Ejercicio 5
SELECT rating, COUNT(film_id) AS total FROM film 
GROUP BY rating 
ORDER BY total DESC;

# Ejercicio 6
SELECT MIN(payment_date) AS earliest_payment_date
FROM payment
UNION
SELECT MAX(payment_date) AS latest_payment_date
FROM payment;

/*
(
  SELECT payment_date 
  FROM payment
  ORDER BY payment_date
  LIMIT 1
)
UNION 
(
  SELECT payment_date 
  FROM payment
  ORDER BY payment_date DESC
  LIMIT 1
);
*/

# Ejercicio 7
SELECT MONTH(payment_date) AS month, AVG(amount) AS promedio_pago
FROM payment
GROUP BY month;

# Ejercicio 8
SELECT district, COUNT(rental_id) AS cantidad 
FROM address AS addr
INNER JOIN customer c 
ON addr.address_id = c.address_id
INNER JOIN rental r
ON r.customer_id = c.customer_id 
GROUP BY district
ORDER BY cantidad DESC LIMIT 10;

# Ejercicio 9
ALTER TABLE inventory ADD stock INT NOT NULL DEFAULT 5;

# Ejercicio 10
CREATE TRIGGER update_stock
AFTER INSERT ON rental
FOR EACH ROW
	UPDATE inventory
	SET stock=stock-1
	WHERE inventory.inventory_id = NEW.inventory_id;

# Ejercicio 11
DROP TABLE IF EXISTS fines;
CREATE TABLE fines (
	rental_id INT DEFAULT NULL,
	amount DECIMAL(5, 2) NOT NULL,
	KEY idx_fk_rental_id (rental_id),
	CONSTRAINT fk_fines_rental FOREIGN KEY (rental_id) 
		REFERENCES rental (rental_id) 
		ON DELETE SET NULL ON UPDATE CASCADE
);

# Ejercicio 12
DROP PROCEDURE IF EXISTS check_date_and_fine;

CREATE PROCEDURE check_date_and_fine()
INSERT INTO fines
SELECT rental_id, DATEDIFF(return_date, rental_date) * 1.5
FROM rental
WHERE DATEDIFF(return_date, rental_date) > 3;

CALL check_date_and_fine();

#Ejercicio 13
CREATE ROLE employee;
GRANT INSERT, DELETE, UPDATE ON rental TO employee;

# Ejercicio 14
REVOKE DELETE ON rental FROM employee;

CREATE ROLE administrator;
GRANT ALL ON sakila.* TO administrator;

# Ejercicio 15
CREATE ROLE subemp, subadm;
GRANT employee to subemp;
GRANT administrator to subadm;

