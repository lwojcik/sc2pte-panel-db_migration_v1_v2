require('dotenv').config();
const mongoose = require('mongoose');
const LegacyChannelConfigSchema = require('./models/LegacyChannelConfig');
// const ChannelConfigV2 = require('./models/ChannelConfigV2');

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB error: ${err}`);
});

mongoose.connection.once('open', () => {
  console.info('MongoDB open');
});

mongoose.connection.on('connected', () => {
  console.info('MongoDB connected');
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.info('MongoDB reconnected');
});

const {
  V1_DATABASE_CONNECTION_STRING,
  V2_DATABASE_CONNECTION_STRING,
} = process.env;

const connectToDb = (connectionString) =>
  mongoose.createConnection(
    connectionString,
    {
      family: 4,
      useNewUrlParser: true,
      keepAlive: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    },
  );

const iterateDocuments = async () => {
  const oldDb = connectToDb(V1_DATABASE_CONNECTION_STRING);

  const oldConfigs = oldDb.model('ChannelConfig', LegacyChannelConfigSchema);
  const data = await oldConfigs.find({});
  console.log(data);
  process.exit(0);
}

iterateDocuments();
