require('dotenv').config();
const mongoose = require('mongoose');

const {
  V1_DATABASE_CONNECTION_STRING,
  V2_DATABASE_CONNECTION_STRING,
} = process.env;

console.log({
  V1_DATABASE_CONNECTION_STRING,
  V2_DATABASE_CONNECTION_STRING,
});

const iterateDocuments = async () => {
  const oldDb = await mongoose.connect(
    V1_DATABASE_CONNECTION_STRING,
    {
      family: 4,
      useNewUrlParser: true,
      keepAlive: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    },
  );

  console.log(oldDb);
  process.exit(0);
}

iterateDocuments();
