import {
  MongoDBContainer,
  StartedMongoDBContainer,
} from '@testcontainers/mongodb';

jest.setTimeout(60000);

let mongoContainer: StartedMongoDBContainer;

async function startMongoContainer(): Promise<StartedMongoDBContainer> {
  const container = await new MongoDBContainer('mongo:6.0.1')
    .withExposedPorts(27017)
    .withStartupTimeout(120000)
    .start();

  return container;
}

async function seedSecrets(): Promise<void> {
  const mongoUri = `${mongoContainer.getConnectionString()}/testdb?directConnection=true`;
  process.env.MICROSERVICES_COUNTDOWN_QUERIES_SERVICE_MONGODB_URI = mongoUri;

  process.env.SUPABASE_URL = 'https://toeichust.supabase.co';
}

beforeAll(async () => {
  try {
    [mongoContainer] = await Promise.all([startMongoContainer()]);

    await seedSecrets();
  } catch (error) {
    console.error('Failed to setup test environment:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await Promise.all([
      mongoContainer?.stop().catch((err) => {
        console.warn('Warning: Failed to stop MongoDB container:', err.message);
      }),
    ]);
  } catch (error) {
    console.error('Failed to cleanup test environment:', error);
  }

  const app = (global as any).app;
  if (app) {
    await app.close();
    (global as any).app = null;
  }
});
