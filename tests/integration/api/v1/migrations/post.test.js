import database from "infra/database";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response.status).toBe(201);

        const responseBody = await response.json();
        expect(Array.isArray(responseBody)).toBe(true);

        const responseMigrations = Array.from(responseBody);

        const migrations = await database.query("SELECT * FROM pgmigrations");
        expect(migrations.rowCount).toBeGreaterThan(0);
        expect(migrations.rowCount).toBe(responseMigrations.length);
      });
      test("For the second time", async () => {
        const response2 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response2.status).toBe(200);

        const response2Body = await response2.json();
        expect(Array.isArray(response2Body)).toBe(true);
        expect(response2Body.length).toBe(0);
      });
    });
  });
});
