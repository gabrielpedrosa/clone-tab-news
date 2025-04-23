import migrationRunner from 'node-pg-migrate';
import { join } from 'node:path';
import database from "infra/database";

export default async function migrations(request, response) {
  console.log(request.method);
  const method = request.method;

  const dbClient = await database.getNewClient();

  const defaultMigrationOptions = {
    dbClient: dbClient,
    dir: join('infra', 'migrations'),
    direction: 'up',
    dryRun: true,
    migrationsTable: 'pgmigrations',
    verbose: true,
  }

  if(method === "GET") {
    const pendingMigrations = await migrationRunner(defaultMigrationOptions);
    await dbClient.end();
    response.status(200).json(pendingMigrations);
    
  }

  if(method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });

    await dbClient.end();

    if(migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }
    response.status(200).json(migratedMigrations);
  }
  
  response.status(405).end();
}