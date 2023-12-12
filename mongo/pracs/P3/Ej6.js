/*
  Ejemplo de como se ve un documento de comments:

  {
    _id: ObjectId("5a9427648b0beebeb69579cc"),
    name: 'Andrea Le',
    email: 'andrea_le@fakegmail.com',
    movie_id: ObjectId("573a1390f29313caabcd418c"),
    text: 'Rem officiis eaque repellendus amet eos doloribus. Porro dolor voluptatum voluptates neque culpa molestias. Voluptate unde nulla temporibus ullam.',
    date: ISODate("2012-03-26T23:20:16.000Z")
  }

*/ 

/*
  ejemplo de como se ve un documento de movies:

  {
    _id: ObjectId("573a1390f29313caabcd4132"),
    title: 'Carmencita',
    year: 1894,
    runtime: 1,
    cast: [ 'Carmencita' ],
    poster: 'http://ia.media-imdb.com/images/M/MV5BMjAzNDEwMzk3OV5BMl5BanBnXkFtZTcwOTk4OTM5Ng@@._V1_SX300.jpg',
    plot: 'Performing on what looks like a small wooden stage, wearing a dress with a hoop skirt and white high-heeled pumps, Carmencita does a dance with kicks and twirls, 
  a smile always on her face.',
    fullplot: 'Performing on what looks like a small wooden stage, wearing a dress with a hoop skirt and white high-heeled pumps, Carmencita does a dance with kicks and twirls, a smile always on her face.',
    lastupdated: '2015-08-26 00:03:45.040000000',
    type: 'movie',
    directors: [ 'William K.L. Dickson' ],
    imdb: { rating: 5.9, votes: 1032, id: 1 },
    countries: [ 'USA' ],
    rated: 'NOT RATED',
    genres: [ 'Documentary', 'Short' ]
  }

 */

/*
  Documentos anidados:

  [] Para comments: no hay.

  [] Para movies:
   1. imdb: Tiene una relación de One-to-One donde cada película
            está relacionada con un documento anidado que es el imdb.
            Esta característica de diseño se debe a que cada imdb va a
            ser única para cada película, además es un documento pequeño
            (es decir, ocupa poca memoria) y nos permite evitar tener
            que hacer un $lookup.
*/

/*
  referencia a documentos:

  [] Para comments: 
    1. movie_id: tiene una referencia de One-to-Many donde cada comentario
                 tiene una referencia de una película (o también cada película
                 es referenciada por 0 o más comentarios).
                 Esto se hace de esa manera, ya que así podemos tener una buena
                 consistencia en la bases de datos si se agrega información de
                 una película (y no tenemos que cambiar la info por cada comentario,
                 lo que sería muy costoso).

  [] Para movies: No tiene.
   
*/