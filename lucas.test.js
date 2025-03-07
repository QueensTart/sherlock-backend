const request = require('supertest');
const app = require('./app');


it("POST /users/login", async () => {
  const res = await request(app).post("/users/login").send({
    username: "Trout",
    password: "Feeshlove",
  });
  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
});

// Utilisateur non trouvé
it("POST /users/login", async () => {
  const res = await request(app).post("/users/login").send({
    username: "UnknownUser",
    password: "passwordaléatoire",
  });
  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(false);
});

// MDP incorrect
it("POST /users/login", async () => {
  const res = await request(app).post("/users/login").send({
    username: "Trout",
    password: "passwordaléatoire",
  });
  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(false);
});

// Error 404 si User pas trouve 
it("POST /users/login", async () => {
  const res = await request(app).post("/users/login").send({
    username: "NoUser",
    password: "passwordaléatoire",
  });
  expect(res.statusCode).toBe(404);
  expect(res.body.result).toBe(false);
});