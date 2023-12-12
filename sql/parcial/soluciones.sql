/* Ejercicio 1 */

ALTER TABLE person 
ADD COLUMN total_medals INT NOT NULL DEFAULT 0;


/* Ejercicio 2 */

WITH medals_not_NA AS (
	SELECT id 
	FROM medal
	WHERE medal_name != "NA"
), medals_per_person AS (
	SELECT p.id AS id, COUNT(*) AS total_medals
	FROM medals_not_NA m
	INNER JOIN competitor_event ce
	ON m.id = ce.medal_id
	INNER JOIN games_competitor gc
	ON ce.competitor_id = gc.id
	INNER JOIN person p
	ON p.id = gc.person_id
	GROUP BY p.id
)
UPDATE person
INNER JOIN medals_per_person 
ON person.id = medals_per_person.id
SET person.total_medals = medals_per_person.total_medals
WHERE person.id = medals_per_person.id;


/* Ejercicio 3 */

WITH medals_not_NA AS (
	SELECT id, medal_name 
	FROM medal
	WHERE medal_name != "NA"
), argentines AS (
	SELECT p.full_name, p.id 
	FROM person p
	INNER JOIN person_region pr 
	ON p.id = pr.person_id 
	INNER JOIN noc_region nr 
	ON pr.region_id = nr.id 
	WHERE nr.region_name = "Argentina"
)
SELECT a.full_name, medal_name, COUNT(*) AS quantity
FROM argentines a
INNER JOIN  games_competitor gc
ON a.id = gc.person_id 
INNER JOIN competitor_event ce 
ON gc.id = ce.competitor_id
INNER JOIN medals_not_NA m 
ON m.id = ce.medal_id 
GROUP BY a.full_name, medal_name;


/* Ejercicio 4 */

WITH medals_not_NA AS (
	SELECT id, medal_name 
	FROM medal
	WHERE medal_name != "NA"
), argentines AS (
	SELECT p.id 
	FROM person p
	INNER JOIN person_region pr 
	ON p.id = pr.person_id 
	INNER JOIN noc_region nr 
	ON pr.region_id = nr.id 
	WHERE nr.region_name = "Argentina"
), medals_per_sport AS (
	SELECT s.sport_name, ce.competitor_id, m.id
	FROM sport s
	INNER JOIN event e
	ON s.id = e.sport_id 
	INNER JOIN competitor_event ce
	ON e.id = ce.event_id 
	INNER JOIN medals_not_NA m
	ON ce.medal_id = m.id
)
SELECT ms.sport_name, COUNT(*) AS medals
FROM medals_per_sport ms
INNER JOIN games_competitor gc
ON gc.id  = ms.competitor_id
INNER JOIN argentines a
ON a.id = gc.person_id 
GROUP BY s.sport_name;


/* Ejercicio 5 */
WITH medals_not_NA AS (
	SELECT id, medal_name 
	FROM medal
	WHERE medal_name != "NA"
), medals_per_region AS (
	SELECT nr.region_name, ce.medal_id 
	FROM noc_region nr
	INNER JOIN person_region pr 
	ON nr.id = pr.region_id 
	INNER JOIN person p 
	ON pr.person_id  = p.id 
	INNER JOIN games_competitor gc 
	ON gc.person_id = p.id 
	INNER JOIN competitor_event ce 
	ON gc.id = ce.competitor_id 
)
SELECT mr.region_name, 
	   SUM(CASE WHEN m.medal_name = "Gold"
		THEN 1 ELSE 0 END) AS totalGold,
	   SUM(CASE WHEN m.medal_name = "Silver"
		THEN 1 ELSE 0 END) AS totalSilver,
	   SUM(CASE WHEN m.medal_name = "Bronze"
		THEN 1 ELSE 0 END) AS totalBronze
FROM medals_per_region mr
INNER JOIN medals_not_NA m
ON mr.medal_id = m.id
GROUP BY nr.region_name;


/* Ejercicio 6 */

WITH medals_per_region AS (
	SELECT nr.region_name, ce.medal_id 
	FROM noc_region nr
	INNER JOIN person_region pr 
	ON nr.id = pr.region_id 
	INNER JOIN person p 
	ON pr.person_id  = p.id 
	INNER JOIN games_competitor gc 
	ON gc.person_id = p.id 
	INNER JOIN competitor_event ce 
	ON gc.id = ce.competitor_id 
), total_medals_per_region AS (
	SELECT mr.region_name, 
		   SUM(CASE WHEN m.medal_name != "NA"
			THEN 1 ELSE 0 END) AS total_medals
	FROM medals_per_region mr
	INNER JOIN medal m
	ON mr.medal_id = m.id
	GROUP BY nr.region_name
), max_min_medals AS (
    SELECT MAX(t.total_medals) AS max_medals, MIN(t.total_medals) AS min_medals
    FROM total_medals_per_region t
), region_max_medals AS (
    SELECT t.region_name, t.total_medals, mmr.max_medals
    FROM total_medals_per_region t
    INNER JOIN max_min_medals mmr
    WHERE t.total_medals = mmr.max_medals
), region_min_medals AS (
    SELECT t.region_name,  t.total_medals, mmr.min_medals
    FROM total_medals_per_region t
    INNER JOIN max_min_medals mmr
    WHERE t.total_medals = mmr.min_medals
)
SELECT region_name, total_medals
FROM region_max_medals
UNION
SELECT region_name, total_medals
FROM region_min_medals LIMIT 2;


/* Ejercicio 7 */

DELIMITER $$

DROP TRIGGER IF EXISTS increase_number_of_medals;
CREATE TRIGGER increase_number_of_medals
    AFTER INSERT ON competitor_event
    FOR EACH ROW
BEGIN
	DECLARE person_id INT;
	SELECT gc.person_id INTO person_id
		FROM games_competitor gc
		INNER JOIN competitor_event ce 
		ON gc.id = ce.competitor_id 
		WHERE gc.id = NEW.competitor_id
		LIMIT 1;
	UPDATE person p
    SET p.total_medals = p.total_medals + 1
    WHERE p.id = person_id;
END;
$$

DROP TRIGGER IF EXISTS decrease_number_of_medals;
CREATE TRIGGER decrease_number_of_medals
    AFTER DELETE ON competitor_event
    FOR EACH ROW
BEGIN
	DECLARE person_id INT;
	SELECT gc.person_id INTO person_id
		FROM games_competitor gc
		INNER JOIN competitor_event ce 
		ON gc.id = ce.competitor_id 
		WHERE gc.id = OLD.competitor_id
		LIMIT 1;
	UPDATE person p
    SET p.total_medals = p.total_medals - 1
    WHERE p.id = person_id;
END;
$$

DELIMITER ;


/* Ejercicio 8 */

DELIMITER $$

DROP PROCEDURE IF EXISTS add_new_medalists;
CREATE PROCEDURE add_new_medalists(
    IN event_id INT,
    IN g_id INT,
    IN s_id INT,
    IN b_id INT
)
BEGIN
	INSERT INTO competitor_event(event_id, medal_id)
	SELECT event_id, g_id
	FROM medal m
	WHERE m.id = g_id;
	
	INSERT INTO competitor_event(event_id, medal_id)
	SELECT event_id, s_id
	FROM medal m
	WHERE m.id = s_id;

	INSERT INTO competitor_event(event_id, medal_id)
	SELECT event_id, b_id
	FROM medal m
	WHERE m.id = b_id;
END;
$$

DELIMITER ;


/* Ejercicio 9 */

DROP ROLE organizer;
CREATE ROLE organizer;
GRANT DELETE, UPDATE (games_name) ON games TO organizer;


