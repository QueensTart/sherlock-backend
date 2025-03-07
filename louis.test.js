const request = require('supertest');
const app = require('./app');

const testOwner = "67c5b0d9c950a318c0e98f56";
const testName = "Dark Moon";
const incorrectName = "Not an object";

it("DELETE/objects/deleteObject/:owner/:name", async() => {
    const res = await request(app).delete(`/objects/deleteObject/${testOwner}/${testName}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
});

it("DELETE/objects/deleteObject/:owner/:name", async() => {
    const res = await request(app).delete(`/objects/deleteObject/${testOwner}/${incorrectName}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(false);
});

it("DELETE/objects/deleteObject/:owner/:name", async() =>{
    const res = await request(app).delete(`/objects/deleteObject/${testOwner}`);

    expect(res.statusCode).toBe(404);
})