use("mflix")


db.createCollection("userProfiles", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["user_id", "language"],
        properties: {
          user_id: {
            bsonType: "objectId",
          },
          language: {
            enum: ["English", "Spanish", "Portuguese"],
          },
          favorite_genres: {
            bsonType: "array",
            items: {
              bsonType: "string",
            },
            uniqueItems: true,
          },
        },
      },
    },
  });
  
  // Vamos a hacer que el campo user_id sea un índice único
  // y de paso, mejoramos la performance.
  // Esto lo hago, ya que quiero que user_id tenga una relación uno a uno
  // con el _id del documento users.
  db.userProfiles.createIndex({ user_id: 1 }, { unique: true });
  
  /* Agregando datos correctos. */
  
  db.userProfiles.insertMany([
    {
      user_id: ObjectId("59b99db4cfa9a34dcd7885b6"),
      language: "Spanish",
    },
    {
      user_id: ObjectId("59b99db4cfa9a34dcd7885b7"),
      language: "Portuguese",
      favorite_genres: ["Thriller", "Animation", "Drama"],
    },
  ]);