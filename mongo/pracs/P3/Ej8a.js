use("blog_a")

// Defino el schema de users.
db.createCollection("users", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "email"],
        properties: {
          name: {
            bsonType: "string",
          },
          email: {
            bsonType: "string",
            pattern: "^(.*)@(.*)\\.(.{2,4})$",
          },
        },
      },
    },
});
  
// Defino el schema de comments.
db.createCollection("comments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "articleId", "text", "date"],
      properties: {
        userId: {
          bsonType: "objectId",
        },
        articleId: {
          bsonType: "objectId",
        },
        text: {
          bsonType: "string",
        },
        date: {
          bsonType: "date",
        },
      },
    },
  },
});

// Creo un índice compuesto para mejorar la performance.
db.comments.createIndex({ userId: 1, articleId: 1 });

// Defino el schema de articles.
// Vamos a tener un arreglo anidado de categories y de tags.
db.createCollection("articles", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "userId",
        "title",
        "date",
        "text",
        "url",
        "tags",
        "categories",
      ],
      properties: {
        userId: {
          bsonType: "objectId",
        },
        title: {
          bsonType: "string",
        },
        date: {
          bsonType: "date",
        },
        text: {
          bsonType: "string",
        },
        url: {
          bsonType: "string",
          pattern: "^https?://[a-zA-Z0-9-._~:/?#[\\]@!$&'()*+,;=%]+$",
        },
        tags: {
          bsonType: "array",
          items: {
            bsonType: "string",
          },
          uniqueItems: true,
          minItems: 1,
        },
        categories: {
          bsonType: "array",
          items: {
            bsonType: "string",
          },
          uniqueItems: true,
          minItems: 1,
        },
      },
    },
  },
});

// Defino un índice simple para el userId.
db.articles.createIndex({ userId: 1 });

/**
 * Agrego datos para los usuarios.
 */

db.users.insertMany([
  {
    name: "Heber Alturria",
    email: "heber.alturria@mi.unc.edu.ar",
  },
  {
    name: "L Lawliet",
    email: "lawliet@fake.mail.com",
  },
]);

/**
 * Agrego datos para los articles.
 */

db.articles.insertMany([
  {
    userId: db.users.findOne({ name: "Heber Alturria" })._id,
    title: "Resolviendo el juego de SQL Murder.",
    date: ISODate(),
    text: "A continuación voy a explicar como se resuelve el juego de SQL Murder...",
    url: "https://heber_alturria.com.ar",
    tags: ["SQL"],
    categories: ["Programación"],
  },
]);

/**
 * Agrego datos para los comments.
 */

db.comments.insertMany([
  {
    userId: db.users.findOne({ name: "L Lawliet" })._id,
    articleId: db.articles.findOne({
      title: "Resolviendo el juego de SQL Murder.",
    })._id,
    text: "Muy interesante.",
    date: ISODate(),
  },
]);