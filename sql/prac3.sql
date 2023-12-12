USE world;

# Ejercicio 1

SELECT city.Name, country.Name, country.Region, country.GovernmentForm 
FROM city
INNER JOIN country 
ON city.CountryCode  = country.Code  
ORDER BY city.Population DESC LIMIT 10;


# Ejercicio 2

SELECT DISTINCT country.Name AS NameCountry, country.Capital, country.Population
FROM country 
INNER JOIN city
ON city.ID  = country.Capital OR country.Capital IS NULL 
ORDER BY country.Population ASC LIMIT 10;


# Ejercicio 3

SELECT country.Name , country.Continent , countrylanguage.`Language` 
FROM country
INNER JOIN countrylanguage
ON countrylanguage.CountryCode = country.Code AND countrylanguage.IsOfficial = 'T';


# Ejercicio 4

SELECT country.Name AS Namecountry, city.Name  AS Namecity
FROM country
INNER JOIN city
ON country.Capital = city.ID 
ORDER BY country.SurfaceArea DESC LIMIT 20;


# Ejercicio 5

SELECT city.Name, countrylanguage.`Language`, countrylanguage.Percentage  
FROM city
INNER JOIN countrylanguage
INNER JOIN country
ON city.CountryCode = country.Code AND countrylanguage.CountryCode = country.Code 
	AND countrylanguage.IsOfficial = 'T'
ORDER BY city.Population DESC;


# Ejercicio 6
(
SELECT Name 
FROM country
ORDER BY Population DESC LIMIT 10
)
UNION
(
SELECT Name 
FROM country
WHERE Population > 100
ORDER BY Population ASC LIMIT 10
);


# Ejercicio 7

(
SELECT country.Name
FROM country
INNER JOIN countrylanguage
ON countrylanguage.CountryCode = country.Code AND 
	countrylanguage.`Language` = 'English' AND countrylanguage.IsOfficial = 'T'
)
INTERSECT
(
SELECT country.Name
FROM country
INNER JOIN countrylanguage
ON countrylanguage.CountryCode = country.Code AND 
	countrylanguage.`Language` = 'French' AND countrylanguage.IsOfficial = 'T'
);


# Ejercicio 8

(
SELECT country.Name
FROM country
INNER JOIN countrylanguage
ON countrylanguage.CountryCode = country.Code AND countrylanguage.`Language` = 'English'
)
EXCEPT
(
SELECT country.Name
FROM country
INNER JOIN countrylanguage
ON countrylanguage.CountryCode = country.Code AND countrylanguage.`Language` = 'Spanish'
);


-- Preguntas
/*
SELECT city.Name, country.Name 
FROM city 
INNER JOIN country ON city.CountryCode = country.Code AND country.Name = 'Argentina';

SELECT city.Name, country.Name 
FROM city 
INNER JOIN country ON city.CountryCode = country.Code
WHERE country.Name = 'Argentina';
*/
/*
 * Pregunta 1: Devuelven los mismos valores las siguientes consultas? Por que?
 * Si, devuelven los mismos valores porque ambos dan la condicion de que el pais tiene
 * que ser Argentina, uno lo hace con un AND y el otro con el WHERE
*/
/*
SELECT city.*, country.*
FROM city 
LEFT JOIN country ON city.CountryCode = country.Code AND country.Name = 'Argentina';

SELECT city.Name, country.Name 
FROM city 
LEFT JOIN country ON city.CountryCode = country.Code
WHERE country.Name = 'Argentina';
*/
/*
 * Pregunta 2: Y si en vez de INNER JOIN fuera un LEFT JOIN?
 * No, devuelven distintos valores porque con el LEFT JOIN, estas llamando a todos los elementos
 * de la tabla de city, y aplicando la condicion en la parte de B nada mas. En cambio con el WHERE
 * se aplica la condicion a todo.
*/
