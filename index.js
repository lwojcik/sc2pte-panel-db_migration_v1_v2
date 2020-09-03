require('dotenv').config();
const mongoose = require('mongoose');
const LegacyChannelConfigSchema = require('./models/LegacyChannelConfig');
const ChannelConfigSchema = require('./models/ChannelConfig');

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

const saveNewConfig = async (NewConfig, legacyConfigObject) => {
  const newConfigObject = new NewConfig({
    channelId: legacyConfigObject.channelId,
    createdAt: legacyConfigObject.createdAt,
    updatedAt: legacyConfigObject.updatedAt,
    profiles: [
      {
        regionId: legacyConfigObject.regionId,
        realmId: legacyConfigObject.realmId,
        profileId: legacyConfigObject.playerId,
        locale: 'en-us',
      },
    ]
  });
  console.log(`Saving document: ${legacyConfigObject.channelId}`);
  await newConfigObject.save();
}

const start = async () => {
  console.log('Starting...');
  console.log('Connecting to old db...');
  const oldDb = await connectToDb(V1_DATABASE_CONNECTION_STRING);
  const LegacyConfigs = oldDb.model('ChannelConfig', LegacyChannelConfigSchema); 
  console.log('Old db connected!');

  console.log('Connecting to new db...');
  const newDb = await connectToDb(V2_DATABASE_CONNECTION_STRING);
  const NewConfig = newDb.model('ChannelConfig', ChannelConfigSchema); 
  console.log('New db connected!');

  // cleaning new database before the operation to avoid duplicate id errors
  console.log('Cleaning new Db...')
  await NewConfig.deleteMany({});

  let i = 0;

  // here we goooooooo
  for await (const legacyConfig of LegacyConfigs.find()) {
    await saveNewConfig(NewConfig, legacyConfig);
    i++;
    console.log(`Documents processed: ${i}`);
  }
}

(async function() {
  await start();
  console.log('Done!');
  process.exit();
})();
