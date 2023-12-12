db = connect("mongodb://localhost/shop");
// Defino el schema para books, que va a contener
// un documento anidado para la categoría (no es necesario que sea un documento anidado, podría ser un string,
// pero por si quiero agregarle info extra a la categoría lo hago con documento anidado).
db.createCollection("books", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["title", "author", "price", "category"],
        properties: {
          title: {
            bsonType: "string",
          },
          author: {
            bsonType: "string",
          },
          price: {
            bsonType: "double",
          },
          category: {
            bsonType: "object",
            required: ["name"],
            properties: {
              name: {
                bsonType: "string",
              },
            },
          },
        },
      },
    },
  });
  
// Defino el schema para orders, que va a contener
// un arreglo de documentos anidados para los order_details.
// Y también voy a querer tener solamente el book_id para acceder al title, author y price.
// Yo podría copiar los valores del book en order_details, pero eso puede generar una
// inconsistencia si el valor de un book cambia (pero mejoraría la eficiencia de la consulta
// ya que no tendríamos que hacer un $lookup).
db.createCollection("orders", {
validator: {
    $jsonSchema: {
    bsonType: "object",
    required: ["deliveryName", "deliveryAddress", "listOfOrderDetails"],
    properties: {
        deliveryName: {
        bsonType: "string",
        },
        deliveryAddress: {
        bsonType: "string",
        },
        ccName: {
        bsonType: "string",
        },
        ccNumber: {
        bsonType: "string",
        },
        ccExpiry: {
        bsonType: "string",
        },
        listOfOrderDetails: {
        bsonType: "array",
        items: {
            bsonType: "object",
            required: ["bookId", "quantity"],
            properties: {
            bookId: {
                bsonType: "objectId",
            },
            quantity: {
                bsonType: "int",
            },
            },
        },
        minItems: 1,
        },
    },
    },
},
});
  
/* Agregando datos para los books */

// Objeto auxiliar para no harcodear las categorías.
const categoryNames = {
webDev: "Web Development",
sciFi: "Science Fiction",
historicalMysteries: "Historical Mysteries",
};

db.books.insertMany([
{
    title: "Learning MySQL",
    author: "Jesper Wisborg Krogh",
    price: 34.31,
    category: {
    name: categoryNames.webDev,
    },
},
{
    title: "JavaScript Next",
    author: "Raju Gandhi",
    price: 36.7,
    category: {
    name: categoryNames.webDev,
    },
},
{
    title: "The Complete Robot",
    author: "Isaac Asimov",
    price: 12.13,
    category: {
    name: categoryNames.sciFi,
    },
},
{
    title: "Foundation and Earth",
    author: "Isaac Asimov",
    price: 11.07,
    category: {
    name: categoryNames.sciFi,
    },
},
{
    title: "The Da Vinci Code",
    author: "Dan Brown",
    price: 7.99,
    category: {
    name: categoryNames.historicalMysteries,
    },
},
{
    title: "A Column of Fire",
    author: "Ken Follett",
    price: 6.99,
    category: {
    name: categoryNames.historicalMysteries,
    },
},
]);

/* Agregando datos para las orders */

const deliveryNames = {
amazon: "Amazon",
};

db.orders.insertMany([
{
    deliveryName: deliveryNames.amazon,
    deliveryAddress: "calle Elm",
    listOfOrderDetails: [
    {
        bookId: db.books.findOne({ title: "Learning MySQL" })._id,
        quantity: 10,
    },
    {
        bookId: db.books.findOne({ title: "A Column of Fire" })._id,
        quantity: 22,
    },
    ],
},
]);

/* Realizar primera query. */

const authorName = "Isaac Asimov";

const firstQuery = db.books.aggregate([
{
    $match: {
    author: authorName,
    },
},
{
    $group: {
    _id: "$author",
    listOfBooks: {
        $addToSet: {
        title: "$title",
        price: "$price",
        category: "$category",
        },
    },
    },
},
{
    $project: {
    _id: 0,
    author: "$_id",
    listOfBooks: "$listOfBooks",
    },
},
]);

printjson(firstQuery);

/* Realizar segunda query. */

const secondQuery = db.books.aggregate([
{
    $group: {
    _id: "$category.name",
    total: { $count: {} },
    },
},
{
    $project: {
    _id: 0,
    categoryName: "$_id",
    total: "$total",
    },
},
]);

printjson(secondQuery);

/* Realizar tercera query. */

const orderId = db.orders.findOne({ deliveryAddress: "calle Elm" })._id;

const thirdQuery = db.orders.aggregate([
{ $match: { _id: orderId } },
{
    $unwind: "$listOfOrderDetails",
},
{
    $lookup: {
    from: "books",
    localField: "listOfOrderDetails.bookId",
    foreignField: "_id",
    as: "bookInfo",
    },
},
{
    $unwind: "$bookInfo",
},
{
    $group: {
    _id: "$deliveryName",
    deliveryAddress: { $first: "$deliveryAddress" },
    totalAmount: {
        $sum: {
        $multiply: ["$listOfOrderDetails.quantity", "$bookInfo.price"],
        },
    },
    },
},
{
    $project: {
    _id: 0,
    deliveryName: "$_id",
    deliveryAddress: "$deliveryAddress",
    totalAmount: "$totalAmount",
    },
},
]);

printjson(thirdQuery);