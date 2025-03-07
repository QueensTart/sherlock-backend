const request = require('supertest');
const app = require('./app');
const User = require("./routes/users");


it("POST /users/login", async () => {
  const res = await request(app).post("/users/login").send({
    username: "Trout",
    password: "Feeshlove",
  });
  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
});