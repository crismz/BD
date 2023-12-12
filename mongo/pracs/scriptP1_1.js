// Select the database to use.
use('mflix')
// Ejercicio 1
/*
db.users.insertMany(
    [{"name": "Pepe Palacios",
      "email": "pepepalacion@fakegmail.com",
      "password": "pepe2023"},
      {"name": "Juan Stimolo",
      "email": "juanstimolo@fakegmail.com",
      "password": "2023juanS"},
      {"name": "Agustin Lapro",
      "email": "Laprofamaf@fakegmail.com",
      "password": "Adc2023"},
      {"name": "Gonzalo Peralta",
      "email": "simtechlabs@fakegmail.com",
      "password": "IngSotfware2023"},
      {"name": "Beta Ziliani",
      "email": "franciscoZiliani@fakegmail.com",
      "password": "BdParadigma2223"}, ]
)

//db.users.find({"name":{$regex:"Beta"}})

db.comments.insertMany(
    [{"name": "Pepe Palacios",
    "email": "pepepalacion@fakegmail.com",
    "movie_id": ObjectId("573a1390f29313caabcd418c"),
    "text": "Voluptate unde nulla temporibus ullam.",
    "date": new Date("2023-11-05T23:42:20.000Z")},
    {"name": "Juan Stimolo",
    "email": "juanstimolo@fakegmail.com",
    "movie_id": ObjectId("573a1390f29313caabcd418c"),
    "text": "Voluptate unde nulla temporibus ullam.",
    "date": new Date("2023-11-05T23:42:20.000Z")},
    {"name": "Agustin Lapro",
    "email": "Laprofamaf@fakegmail.com",
    "movie_id": ObjectId("573a1390f29313caabcd418c"),
    "text": "Voluptate unde nulla temporibus ullam.",
    "date": new Date("2023-11-05T23:42:20.000Z")},
    {"name": "Gonzalo Peralta",
    "email": "simtechlabs@fakegmail.com",
    "movie_id": ObjectId("573a1390f29313caabcd418c"),
    "text": "Voluptate unde nulla temporibus ullam.",
    "date": new Date("2023-11-05T23:42:20.000Z")},
    {"name": "Beta Ziliani",
    "email": "franciscoZiliani@fakegmail.com",
    "movie_id": ObjectId("573a1390f29313caabcd418c"),
    "text": "Voluptate unde nulla temporibus ullam.",
    "date": new Date("2023-11-05T23:42:20.000Z")}]
)

// db.comments.find({"date" : {$gte: new Date("2023-01-01T00:00:00.000Z")}})
*/
// Ejercicio 2
const tenBestRatingMovies = db.movies
    .find(
        {
            "imdb.rating": {$type: "double"},
            year: {$gte: 1990, $lte: 1999},
        },
        {"title": 1, "year": 1, "cast": 1, "directors": 1, "imdb.rating": 1 }
    )
    .sort({"imdb.rating":-1})
    .limit(10);

//console.log(tenBestRatingMovies);
// El valor de rating de la pelicula con mayor rating es 9.4

// Ejercicio 3

// a)
const commentsTheMask = db.comments
    .find(
        {
            "movie_id" : {$eq: ObjectId("573a1399f29313caabcee886")},
            "date" : {$gte: new Date("2014-01-01"), $lte: new Date("2017-01-01")}
        },
        {"name" : 1, "email":1, "text":1, "date":1}
    )
    .sort({"date":-1})

//console.log(commentsTheMask)

// b)
//console.log(commentsTheMask.count())

// Ejercicio 4
const commentsPatricia = db.comments
    .find(
        {
            "email" : {$eq: "patricia_good@fakegmail.com"}
        },
        {"name" : 1, "movie_id": 1, "text":1, "date":1}
    )
    .sort({"date":-1})
    .limit(3)

//console.log(commentsPatricia);

// Ejercicio 5
const moviesDramaAction = db.movies
    .find(
        {
            "genres" : {$all:["Action", "Drama"]},
            "languages" : {$size: 1},
            $or: [{"imdb.rating" : {$gt:9}}, {"runtime" : {$gte:180}}]
        },
        {"title":1, "languages":1, "genres":1, "released":1, "imdb.votes":1}
    )
    .sort({"released":-1, "imdb.votes":-1});

//console.log(moviesDramaAction);

// Ejercicio 6

const theatersStates = db.theaters
    .find(
        {
            "location.address.state" : {$in: ["CA", "NY", "TX"]},
            "location.address.city" : /^F/
        },
        {
            "theaterId":1,
            "location.address.state":1,
            "location.address.city":1,
            "location.geo.coordinates":1
        }
    )
    .sort(
        {"location.address.state":-1, "location.address.city":-1}
    );

//console.log(theatersStates);

// Ejercicio 7
db.comments.updateOne(
    {_id : ObjectId("5b72236520a3277c015b3b73")},
    {
        $set: {
            text: "mi mejor comentario",
            date: ISODate()
        }
    }
)

// Ejercicio 8
db.users.updateOne(
    {"mail": "joel.macdonel@fakegmail.com"},
    {
        $set: {
            "password": "some password"
        }
    },
    {upsert:true}
);

// Ejercicio 9
db.comments.deleteMany(
    {
        "email":"victor_patel@fakegmail.com",
        "date":{
            $gte: ISODate("1980-01-01"),
            $lte: ISODate("1981-01-01")
        }
    }
);

