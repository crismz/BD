// Select the database to use.
use('mflix')

// Ejercicio 1
const theatersStates = db.theaters.aggregate(
    {
        $group:
        {
            "_id": "$location.address.state",
            count: {$count: {}}     // alternativa: count:{$sum:1}
        }
    }
);

// Ejercicio 2
const statesWithTwoTeathers = db.theaters.aggregate([
    {   
        // agrupamos por estados y contamos cantidad de cines
        $group:
        {
            "_id": "$location.address.state",
            amountOfTheaters: {$count: {}}
        }
    },
    {   
        // Filtramos los que tienen 2 o mas
        $match:
        {
            amountOfTheaters: {$gte: 2}
        }
    },
    {   // Cuento la cantidad de resultado que me quedaron
        $count: "total"
    }
]);

// Ejercicio 3 
// Sin pipeline de agregacion
const moviesDirectedByLouis = db.movies.find(
    {directors: {$elemMatch: {$eq: "Louis Lumière"}}}
)
.count();

// Con pipeline de agregacion
const moviesDirectedByLouis2 = db.movies.aggregate([
    {
        $match: {
            directors: {$elemMatch: {$eq: "Louis Lumière"}}
        }
    },
    {
        $count: "total"
    }
]);


// Ejercicio 4
// Sin pipeline de agregacion
const moviesPremiered50 = db.movies.find(
    {year: {$gte: 1950, $lte: 1959} }
)
.count();

// Con pipeline de agregacion
const moviesPremiered502 = db.movies.aggregate([
    {
        $match: {year: {$gte: 1950, $lte: 1959}} 
    },
    {
        $count: "Total"
    }
]);

// Ejercicio 5
const genresMovies = db.movies.aggregate([
    {
        // Creo un documento por cada genero
        $unwind: "$genres"
    },
    {
        // Cuento la cantidad de peliculas por genero y lo ordeno de mayor a menor
        $sortByCount: "$genres"
    },
    {
        $limit: 10
    }
]);

// Ejercicio 6
const topTenUsersComments = db.comments.aggregate([
    {
        $group: {
            _id: {
                email: "$email",
                name: "$name"
            },
            amountOfComments: {$count: {}}
        }
    },
    {
        $sort: {amountOfComments: -1}
    },
    {  
        $limit: 10
    }
]);

// Ejercicio 7
const imdbPerYear = db.movies.aggregate([
    {   // Me quedo con las peliculas de las decadas de los 80 y cuyo imdb.rating sea un numero
        $match: {
            year: {$gte: 1980, $lte: 1989},
            "imdb.rating": {$type: "double"}        
        }
    },
    {
        $group:{
            _id: "$year",
            avgRating: {$avg: "$imdb.rating"},
            minRating: {$min: "$imdb.rating"},
            maxRating: {$max: "$imdb.rating"}
        }
    },
    {
        $sort: {avgRating: -1}
    }
]);

// Ejercicio 8
const commentsPerMovie = db.movies.aggregate([
    {
        $project: {
            _id: 0,
            title: 1,
            year: 1,
            num_mflix_comments: 1
        }
    },
    {
        $sort: {
            num_mflix_comments: -1
        }
    },
    {
        $limit: 10
    }
]);

// Ejercicio 9
/*
*   OJO: el campo num_mflix_comments no es muy fiable, ya que hay peliculas
*   repetidas y valores que pueden estar desactualizados (inconsistencias en la bd)
*/

db.fiveGenresWithMoreComments.drop()

db.createView("fiveGenresWithMoreComments", "movies",[
    {
        // Por cada pelicula le hago un join con sus respectivos comentarios
        $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "movie_id",
            as: "listOfComments"
        }
    },
    {
        // Creo un documento por cada genero de pelicula
        $unwind: "$genres"
    },
    {
        // Sumo la cantidad de comentarios por cada genero
        $group:{
            _id: "$genres",
            amountOfComments: { $sum: {$size: "$listOfComments"}}
        }
    },
    {
        $sort: {amountOfComments: -1}
    },
    {
        $limit: 5
    }
]);

// Ejercicio 10

/**
 * OJO: Hay peliculas repetidas por eso uso el $addToSet para agregar elementos sin duplicar
 */

const actors = db.movies.aggregate([
    {   
        // Filtro para quedarme con las peliculas que fueron dirigas por Jules Bass
        $match: {
            directors: {$elemMatch: {$eq: "Jules Bass"}}
        }
    },
    {
        // Creo un documento por cada elemento del arreglo cast en cada pelicula
        $unwind: "$cast"
    },
    {
        // Agrupo por $cast y agrego sin repetir la lista de peliculas
        $group: {
            _id: "$cast",
            listOfMovies: {$addToSet: {title: "$title", year: "$year"}}
        }
    },
    {
        // veo si tiene dos o mas elementos
        $match: {
            "listOfMovies.1": {$exists: true}
        }
    },
    {
        // Manipulo la proyeccion para que se vea mejor
        $project: {
            _id: 0,
            name: "$_id",
            listOfMovies: "$listOfMovies"
        }
    }
]);

// Ejercicio 11

const commentsPremiered = db.comments.aggregate([
    {
        $lookup: {
            from: "movies",
            let: { comments_movie_id: "$movie_id", comment_date: "$date"},
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                            {
                                // Compara la pelicula y el comentario por sus IDs
                                $eq: ["$_id", "$$comments_movie_id"]
                            },
                            {
                                $eq: [{$year: "$released"}, {$year: "$$comment_date"}]
                            },
                            {
                                // Compara las peliculas lanzadas en el mismo mes que el comentario
                                $eq: [{$month: "$released"}, {$month: "$$comment_date"}]
                            }
                            ]
                        }   
                    }
                }
            ],
            as: "movie"
        }
    },
    {   
        // Elimino los documentos que no satisfacen las condiciones anteriores
        $match:{
            movie: {$ne: []}
        }
    },
    {
        $project: {
            _id:0,
            name:1,
            email:1,
            date:1,
            "movie.title": 1,
            "movie.released": 1
        }
    }
]);

// Cambio de bd
use('restaurantdb')

// Ejercicio 12

// Version a
const statsRestaurant1 = db.restaurants.aggregate([
    {
        $unwind: "$grades"
    },
    {
        $group: {
            _id: "$_id",
            name: {$first: "$name"},
            sumScore: {$sum: "$grades.score"},
            maxScore: {$max: "$grades.score"},
            minScore: {$min: "$grades.score"}
        }
    }
]);

// Version b
const statsRestaurant2 = db.restaurants.aggregate([
    {
        $project:{
            name: 1,
            sumScore: { $sum: "$grades.score"},
            maxScore: { $max: "$grades.score"},
            minscore: { $min: "$grades.score"}
        }
    }
]);

// Version c
const statsRestaurant3 = db.restaurants.aggregate([
    {
        $project:{
            name: 1,
            sumScore: {
                $reduce: {
                    input: "$grades.score",
                    initialValue: 0,
                    in: {$add : ["$$value", "$$this"]}
                }
            },
            maxScore: {
                $reduce: {
                    input: "$grades.score",
                    initialValue: 0,
                    in: {$max : ["$$value", "$$this"]}
                }
            },
            minScore: {
                $reduce: {
                    input: "$grades.score",
                    initialValue: Infinity,
                    in: {$min : ["$$value", "$$this"]}
                }
            }
        }
    }
])

// Version d

// Sin hacer

// Ejercicio 13

db.restaurants.updateMany({}, [
    {
        $set: {
            average_score: { $avg: "$grades.score"}
        }
    },
    {
        $set: {
            grade: {
                $switch: {
                    branches: [
                        {
                            case: {
                                $gte: ["$average_score",28]
                            },
                            then: "C"
                        },
                        {
                            case: {
                                $gte: ["$average_score",14]
                            },
                            then: "B"
                        },
                        {
                            case: {
                                $gte: ["$average_score", 0]
                            },
                            then: "A"
                        }
                    ],
                    default: ""
                }
            }
        }
    }
])
