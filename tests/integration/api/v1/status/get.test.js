import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
})

test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const body = await response.json()
  expect(body.updated_at).toBeDefined()
  
  const expectedDate = new Date(body.updated_at).toISOString()
  expect(body.updated_at).toBe(expectedDate);

  expect(body.dependencies.database.version).toEqual("17.4")
  expect(body.dependencies.database.max_connections).toEqual(100)
  expect(body.dependencies.database.opened_connections).toEqual(1)
  expect(body.dependencies.database).toEqual({
    version: "17.4",
    max_connections: 100,
    opened_connections: 1,
  });
});
