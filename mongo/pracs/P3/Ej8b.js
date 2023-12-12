use("blog_b")

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
  
// Defino el schema de articles.
// Vamos a tener un arreglo anidado de categories y de tags.
// también va a tener un documento anidado para los comentarios.
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
        "comments",
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
        comments: {
        bsonType: "array",
        items: {
            bsonType: "object",
            required: ["commentUserId", "text", "date"],
            properties: {
            commentUserId: {
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
    comments: [
    {
        commentUserId: db.users.findOne({ name: "L Lawliet" })._id,
        text: "Muy interesante.",
        date: ISODate(),
    },
    ],
},
]);

/**
 * Ahora resuelvo las consultas.
 */

// valor auxiliar.
const heberUserId = db.users.findOne({ name: "Heber Alturria" })._id;

/* Primera consulta. */

const firstQuery = db.articles.find(
{ userId: heberUserId },
{ _id: 0, title: 1, url: 1, tags: 1, categories: 1 }
);

printjson(firstQuery);

/* Segunda consulta. */

const secondQuery = db.articles.find(
{ date: { $gte: ISODate("2023-11-11") } },
{
    _id: 0,
    title: 1,
    url: 1,
    comments: 1,
}
);

printjson(secondQuery);

/* tercera consulta. */

const thirdQuery = db.users.find({ _id: heberUserId }, { _id: 0 });

printjson(thirdQuery);