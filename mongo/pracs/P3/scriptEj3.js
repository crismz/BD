use("mflix")

/**
 * OJO: Hay un problema de que no me respeta los tipos asignados a geo ya que es un índice de GeoJSON.
 *      Recomiendo para este ejercicio borrar dicho índice.
 **/

db.runCommand({
    collMod: "theaters",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["theaterId", "location"],
            properties: {
                theaterId: {
                    bsonType: "int",
                    description: "theaterId must be a int and is required"
                },
                location: {
                    bsonType: "object",
                    description: "location must be a object and is required",
                    required: ["address"],
                    properties: {
                        address: {
                            bsonType: "object",
                            description: "address must be a object and is required",
                            required: ["street1", "city", "state", "zipcode"],
                            properties: {
                                street1: {
                                    bsonType: "string",
                                    description: "street1 must be a string and is required",
                                },
                                city: {
                                    bsonType: "string",
                                    description: "city must be a string and is required"
                                },
                                state: {
                                    bsonType: "string",
                                    description: "state must be a string and is required"
                                },
                                zipcode: {
                                    bsonType: "string",
                                    description: "zipcode must be a string and is required"
                                }
                            }
                        },
                        geo: {
                            bsonType: "object",
                            description: "geo must be a object and is not required",
                            properties: {
                                type: {
                                    enum: ["Point", null],
                                    description: "type must be 'Point' or null"
                                },
                                coordinates: {
                                    bsonType: "array",
                                    items: {
                                        bsonType: "double"
                                    },
                                    minItems: 2,
                                    maxItems: 2,
                                    description: "coordinates must be an array with two doubles"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    validationAction: "warn"
});

/* Insertando valores incorrectos. Me debería dejar hacerlo. */

/* Tipo de theaterId incorrecto. */

db.theaters.insertOne({
    theaterId: 43690658.12,
    location: {
      address: {
        street1: "340 W Market",
        city: "Bloomington",
        state: "MN",
        zipcode: "55425",
      },
      geo: {
        type: "Point",
        coordinates: [-93.24565, 44.85466],
      },
    },
  });

printjson(db.theaters.findOne({ theaterId: 43690658.12 }));

/* El tipo enumerado de type es incorrecto. */

db.theaters.insertOne({
theaterId: 12345,
location: {
    address: {
    street1: "340 W Market",
    city: "Bloomington",
    state: "MN",
    zipcode: "55425",
    },
    geo: {
    type: "holaaloh",
    coordinates: [-93.24565, 44.85466],
    },
},
});

printjson(db.theaters.findOne({ theaterId: 12345 }));

/* La longitud del arreglo es incorrecta. */

db.theaters.insertOne({
theaterId: 54321,
location: {
    address: {
    street1: "340 W Market",
    city: "Bloomington",
    state: "MN",
    zipcode: "55425",
    },
    geo: {
    type: "Point",
    coordinates: [-93.24565, 44.85466, 1234.1],
    },
},
});

printjson(db.theaters.findOne({ theaterId: 54321 }));

/* Los tipos de coordinates son incorrectos. */

db.theaters.insertOne({
theaterId: 101010101,
location: {
    address: {
    street1: "340 W Market",
    city: "Bloomington",
    state: "MN",
    zipcode: "55425",
    },
    geo: {
    type: "Point",
    coordinates: ["-93.24565", "44.85466"],
    },
},
});

printjson(db.theaters.findOne({ theaterId: 101010101 }));

/* El tipo requerido location no está. */

db.theaters.insertOne({
theaterId: 9876,
});

printjson(db.theaters.findOne({ theaterId: 9876 }));