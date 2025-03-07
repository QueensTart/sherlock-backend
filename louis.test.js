const request = require('supertest');
const app = require('./app');

const testOwner = "67c6cfb1c06de258fe51b726";
const testName = "crab";

it("DELETE/objects/deleteObject/:owner/:name", async() => {
    const res = await request(app).delete(`/objects/deleteObject/${testOwner}/${testName}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
});