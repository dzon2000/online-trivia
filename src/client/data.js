const MongoClient = require("mongodb").MongoClient;

async function connect(uri) {
    let mongoClient;

    try {
        mongoClient = new MongoClient(uri);
        console.log('Connecting to MongoDB...');
        await mongoClient.connect();
        console.log('Successfully connected to MongoDB!');

        return mongoClient;
    } catch (error) {
        console.error('Connection to MongoDB failed!', error);
        process.exit();
    }
}

async function findByGame(game) {
    let mongoClient;
    try {
        mongoClient = await connect("mongodb://root:yolo123@mongodb:27017/");
        const db = mongoClient.db('trivia');
        const collection = db.collection('players');
        console.log("Finding...")
        collection.find({ game }).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
        });
    } finally {

    }
}

async function test() {
    let mongoClient;
    try {
        mongoClient = await connect("mongodb://root:yolo123@mongodb:27017/");
        const db = mongoClient.db('trivia');
        const collection = db.collection('players');

        const player = {
            name: 'John Smith',
            game: 'npo123X',
        };
        collection.insertOne(player).then((res) => {
            console.log("New player inserted...")
            mongoClient.close();
        })
    } finally {
        // mongoClient.close();
    }
}

// test();
// findByGame("npo123X")
async function findAll() {
    return connect("mongodb://root:yolo123@mongodb:27017/").then((client) => {
        try {
            const db = client.db("trivia");
            const collection = db.collection("players");

            return collection.find({});
        } finally {
            // client.close();
        }
    });
}

findAll().then((curs) => {
    curs.forEach(doc => {
        console.log(doc);
    });
})