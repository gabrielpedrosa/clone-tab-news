import database from "infra/database.js";

async function status(request, response) {
  const updateAt = new Date().toISOString();

  const versionResult = await database.query("SHOW server_version;")
  const version = versionResult.rows[0].server_version
 
  const maxConnectionsResult = await database.query("SHOW max_connections;")
  const maxConnections = maxConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB || "postgres";
  const openedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  })
  const openedConnections = openedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updateAt,
    dependencies: {
      database: { 
        version: version,
        max_connections: parseInt(maxConnections),
        opened_connections: openedConnections,
      },
    },
  });

  
}

export default status;
