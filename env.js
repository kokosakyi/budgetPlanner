const fs = require('fs');

if (fs.existsSync('./public')) {
    process.env.NODE_ENV = 'production';
    process.env.databaseUri = '...';
    process.env.databaseName = 'production database: budget-planner';
}
else {
    process.env.NODE_ENV = 'development';
    process.env.databaseUri = 'mongodb://localhost:27017/budget-planner';
    process.env.databaseName = 'development database: budget-planner';
}

