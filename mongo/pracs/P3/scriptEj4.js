use("mflix")

db.runCommand({
    collMod: "movies",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["title", "year"],
        properties: {
          title: {
            bsonType: "string",
            description: "title must be a string and is required",
          },
          year: {
            bsonType: "int",
            minimum: 1900,
            maximum: 3000,
            description: "year must be a int and is required",
          },
          cast: {
            bsonType: "array",
            items: {
              bsonType: "string",
            },
            uniqueItems: true,
            description: "cast must be a array of strings and is not required",
          },
          directors: {
            bsonType: "array",
            items: {
              bsonType: "string",
            },
            uniqueItems: true,
            description:
              "directors must be a array of strings and is not required",
          },
          genres: {
            bsonType: "array",
            items: {
              bsonType: "string",
            },
            uniqueItems: true,
            description: "genres must be a array of strings and is not required",
          },
        },
      },
    },
  });
  
  /* Agregando elementos incorrectos. */
  
  // el tipo de year es incorrecto.
  db.movies.insertOne({
    title: "Perfect Blue",
    year: 1997.3,
    cast: ["Junko Iwao", "Rica Matsumoto"],
    directors: ["Satoshi Kon"],
    genres: ["Thriller", "Animation", "Horror"],
  });
  
  // el arreglo de genres no es único.
  db.movies.insertOne({
    title: "Perfect Blue",
    year: 1997,
    cast: ["Junko Iwao", "Rica Matsumoto"],
    directors: ["Satoshi Kon"],
    genres: ["Thriller", "Thriller", "Horror"],
  });
  
  // el arreglo de directors no es único.
  db.movies.insertOne({
    title: "Perfect Blue",
    year: 1997,
    cast: ["Junko Iwao", "Rica Matsumoto"],
    directors: ["Satoshi Kon", "Satoshi Kon"],
    genres: ["Thriller", "Animation", "Horror"],
  });
  
  // el arreglo de cast no es único.
  db.movies.insertOne({
    title: "Perfect Blue",
    year: 1997,
    cast: ["Junko Iwao", "Rica Matsumoto", "Junko Iwao"],
    directors: ["Satoshi Kon"],
    genres: ["Thriller", "Animation", "Horror"],
  });
  
  // el year es muy pequeño.
  db.movies.insertOne({
    title: "Perfect Blue",
    year: 1899,
    cast: ["Junko Iwao", "Rica Matsumoto"],
    directors: ["Satoshi Kon"],
    genres: ["Thriller", "Animation", "Horror"],
  });
  
  // el year es muy grande.
  db.movies.insertOne({
    title: "Perfect Blue",
    year: 3001,
    cast: ["Junko Iwao", "Rica Matsumoto"],
    directors: ["Satoshi Kon"],
    genres: ["Thriller", "Animation", "Horror"],
  });