const request = require("supertest");
const app = require("./app");

it("GET/objects/findUserObject/:owner", async () => {
  const res = await request(app).get(
    "/objects/findUserObject/67c96476251e1620eea3c6f5"
  );

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
});
