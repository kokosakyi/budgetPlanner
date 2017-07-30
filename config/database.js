const crypto = require('crypto').randomBytes(256).toString('hex');

// Export config object
module.exports = {
    uri: process.env.databaseUri,
    secret: crypto,
    db: process.env.databaseName
}

