// Select the database to use.
use('restaurantdb')
// Ejercicio 10
const restaurantsHighScores = db.restaurants
    .find(
        {
            grades: {
                $elemMatch: {
                    date: {$gte: ISODate("2014-01-01"), $lt: ISODate("2016-01-01")},
                    score: {$gt: 70, $lte: 90} 
                }
            }
        },
        {restaurant_id:1, grades:1}
    );

// Ejercicio 11
db.restaurants.updateOne(
    {restaurant_id: "50018608"},
    {$addToSet: 
        {grades:
            {$each: [
                {
                    "date": ISODate("2019-10-10T00:00:00Z"),
                    "grade": "A",
                    "score": 18
                },
                {
                    "date": ISODate("2020-02-25T00:00:00Z"),
                    "grade": "A",
                    "score": 21
                }
                ]
            }
        }
    }
)
