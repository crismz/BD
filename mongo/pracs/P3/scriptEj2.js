use("mflix")

const userCollectionInfo = db.getCollectionInfos({ name: "users"});

console.log(userCollectionInfo);