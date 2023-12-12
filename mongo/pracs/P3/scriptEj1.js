use('mflix')

// Ejercicio 1

db.runCommand({
    collMod: "users",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "email", "password"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "name must be a string and is required",
                    maxLength: 30
                },
                email: {
                    bsonType: "string",
                    description: "email must be a string and is required",
                    pattern: "^(.*)@(.*)\\.(.{2,4})$"
                },
                password: {
                    bsonType: "string",
                    description: "password must be a string and is required",
                    minLength: 50
                }
            }
        }
    }
})

/* Probando metiendo datos incorrectos. */

// Big name length.
db.users.insertOne({
    name: "a".repeat(31),
    email: "hola@fake.gmail.com",
    password: "hola".repeat(20),
  });

// bad email.
db.users.insertOne({
  name: "L Lawliet",
  email: "lightIsKira",
  password: "hola".repeat(20),
});

// small password.
db.users.insertOne({
  name: "L Lawliet",
  email: "lightIsKira@fake.gmail.com",
  password: "1234",
});

// name required.
db.users.insertOne({
  email: "lightIsKira@fake.gmail.com",
  password: "iAmTheJustice".repeat(20),
});

// email required.
db.users.insertOne({
  name: "L Lawliet",
  password: "iAmTheJustice".repeat(20),
});

// password required.
db.users.insertOne({
  name: "L Lawliet",
  email: "lightIsKira@fake.gmail.com",
});

/* Probando metiendo datos correctos */

db.users.insertOne({
  name: "L Lawliet",
  email: "lightIsKira@fake.gmail.com",
  password: "iAmTheJustice".repeat(20),
});

db.users.insertOne({
  name: "Kira",
  email: "god@fake.gmail.com",
  password: "iAmGod".repeat(20),
});

db.users.insertOne({
  name: "Ryuk",
  email: "shinigami@fake.gmail.com",
  password: "apple".repeat(20),
});

db.users.insertOne({
  name: "Near",
  email: "near@fake.gmail.com",
  password: "iAmNotL".repeat(20),
});

db.users.insertOne({
  name: "Amane Misa",
  email: "misa@fake.gmail.com",
  password: "iLoveYouLight".repeat(20),
});
