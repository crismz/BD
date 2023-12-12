// Ejercicio 1
db.sales.aggregate([
    {
        $match: {
            storeLocation: {
                $in : ["London", "Austin", "San Diego"]
            },
            "customer.age": {
                $gte: 18
            },
            items: {
                $elemMatch: {
                    price: {$gte: 1000},
                    tags: {$in: ["kids", "school"]}
                }
            }    
        }
    },
    {
        $project: {
            _id: 0, 
            sales: "$_id", 
            saleDate: 1, 
            storeLocation: 1,
            customer_email: "$customer.email" 
        }
    }
])

// Fin Ejercicio 1

// Ejercicio 2

// Consideramos el monto total facturado a la suma de precio*cantidad 
// de los items del arreglo  
db.sales.aggregate([
    {
        $match: {
            storeLocation: {$eq: "Seattle"},
            purchaseMethod: {
                $in: ["In store", "Phone"]
            },
            saleDate: {
                $gte: ISODate("2014-02-01"),
                $lte: ISODate("2015-01-31")
            }
        }
    },
    {
        $unwind: "$items"
    },
    {
        $group: {
            _id: {
                "email": "$customer.email", 
                "satisfaction" : "$customer.satisfaction"
            },
            tamount: {$sum: {$multiply: ["$items.price", "$items.quantity"]}}
        }
    },
    {
        $project: {
            _id: 0,
            email: "$_id.email",
            satisfaction: "$_id.satisfaction",
            tamount: 1
        }
    },
    {
        $sort: {
            satisfaction: -1,
            email: 1
        }
    }
])

// Fin ejercicio 2

// Ejercicio 3

db.createView("salesInvoiced", "sales",[
    {
        $unwind: "$items"
    },
    {
        $group: {
            _id: {
                $dateToString: {
                    "date": "$saleDate",
                    "format": "%Y.%m",
                }
            },
            minAmount: {$min: "$items.price"},
            maxAmount: {$max: "$items.price"},
            sumAmount: {$sum: "$items.price"},
            avgAmount: {$avg: "$items.price"}
        }
    },
    {
        $sort: {"_id": -1}
    }
]);

// Fin ejercicio 3

// Ejercicio 4

const sales = db.sales.aggregate([
    {
        $unwind: "$items"
    },
    {
        $group: {
            _id: "$storeLocation",
            avgSales: {$avg: "$items.price"}
        }
    },
    {
        $lookup: {
            from: "storeObjectives",
            localField: "_id",
            foreignField: "_id",
            as: "objective"
        }
    },
    {
        $project: {
            _id: 0,
            storeLocation: "$_id", 
            avgSales: 1,
            objective: {$arrayElemAt: ["$objective.objective", 0]},
            diffAvgObj: {
                $subtract: ["$avgSales", {$arrayElemAt: ["$objective.objective", 0]}] 
            }
        }
    }
])

// Fin ejercicio 4

// Ejercicio 5

db.runCommand({
    collMod: "sales",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["saleDate", "storeLocation", "purchaseMethod", "customer"],
            properties: {
                saleDate: {
                    bsonType: "date",
                    description: "saleDate must be a string and is required",
                },
                storeLocation: {
                    enum: [
                        "London",
                        "New York",
                        "Denver",
                        "San Diego",
                        "Austin",
                        "Seattle"
                    ],
                    description: "storeLocation is required and must be one location where are stores"
                },
                purchaseMethod: {
                    enum: [
                        "Phone",
                        "In store",
                        "Online"
                    ],
                    description: "purchaseMethod is required and must be one of the three next methods: 'Phone', 'In store' or 'Online'"
                },
                customer: {
                    bsonType: "object",
                    description: "customer must be a object and is required",
                    required: ["gender", "age", "email"],
                    properties: {
                        gender: {
                            enum: ["M", "F", "X"],
                            description: "gender is required and must be M, F or X"
                        },
                        age: {
                            bsonType: "int",
                            minimum: 16,
                            description: "age is required and must be a int greater than 15"
                        },
                        regex: {
                            bsonType: "string",
                            description: "email is required and must be a string",
                            pattern: "^(.*)@(.*)\\.(.{2,4})$"
                        },
                        satisfaction: {
                            bsonType: "int",
                            description: "satisfacion must be a int between 1 and 5 and is not required",
                            minimum: 1,
                            maximum: 5
                        }
                    }
                }
            }
        }
    }
})

// Caso de exito
db.sales.insertOne({
    saleDate: ISODate("2015-05-05"),
    items: [{
        name: "Car",
        tags: [
            "general"
        ],
        price: {$numberDecimal: "1000"},
        quantity: 1
    }],
    storeLocation: "London",
    purchaseMethod: "In store",
    customer: {
        gender: "M",
        age: 30,
        email: "pepe@fakemail.com",
    } 
})


// Caso de falla
db.sales.insertOne({
    saleDate: "2015-05-05",
    items: [{
        name: "Car",
        tags: [
            "general"
        ],
        price: {$numberDecimal: "1000"},
        quantity: 1
    }],
    storeLocation: "Cordoba",
    purchaseMethod: "Aplicattion",
    customer: {
        gender: "P",
        age: 10,
        email: "pepe@fakemail.com",
    } 
})

// Fin ejercicio 5