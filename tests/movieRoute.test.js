const request = require('supertest');
const app = require("../app");


describe("POST /api/movie/get", () => {
    describe("given properties", () => {
        test("should respond with a 200 status and return a json object", async () => {
            const data = [
                {duration: 200},
                {genres: ["Action"]},
                {
                    duration: 200,
                    genres: ["Action"]
                }
            ]
            for (body of data){
                const res = await request(app).post("/api/movie/get").send(body)
                .expect(200)
                .expect('Content-Type', /json/);
            }
        })
    })
})

describe("POST /api/movie/add", () => {
    describe("when director field length is above 255 characters", () => {
        test("should respond with a 400 status code", async () => {
            const res = await request(app).post("/api/movie/add").send({
                genres: ["Action", "Documental"],
                title: "title",
                year: 2000,
                runtime: 200,
                director: `603379d43d0a123e98e8808e603379d43d0a123e98e8808e603379d43d0a123e98e8808e60337
                9d43d0a123e98e8808e603379d43d0a123e98e8808e603379d43d0a123e98e8808e603379d43d0a123e98e88
                08e603379d43d0a123e98e8808e603379d43d0a123e98e8808e603379d43d0a123e98e8808e603379d43d0a1rrr`
            });
            expect(res.statusCode).toBe(400);
        });
    });
    describe("when title field length is above 255 characters", () => {
        test("should respond with a 400 status code", async () => {
            const res = await request(app).post("/api/movie/add").send({
                genres: ["Action", "Documental"],
                title: `603379d43d0a123e98e8808e603379d43d0a123e98e8808e603379d43d0a123e98e8808e60337
                9d43d0a123e98e8808e603379d43d0a123e98e8808e603379d43d0a123e98e8808e603379d43d0a123e98e88
                08e603379d43d0a123e98e8808e603379d43d0a123e98e8808e603379d43d0a123e98e8808e603379d43d0a1rrr`,
                year: 2000,
                runtime: 200,
                director: "director"
            });
            expect(res.statusCode).toBe(400);
        });
    });
    describe("when specified genre is not supported", () => {
        test("should respond with a 400 status code", async () => {
            const res = await request(app).post("/api/movie/add").send({
                genres: ["Action", "Documental"],
                title: "title",
                year: 2000,
                runtime: 200,
                director: "director"
            });
            expect(res.statusCode).toBe(400);
        });
    });
    describe("when all required fields are specified", () => {
        test("should respond with a 200 status code", async () => {
            const fs = require('fs');
            const res = await request(app).post("/api/movie/add").send({
                genres: ["Action"],
                title: "title",
                year: 2000,
                runtime: 200,
                director: "director"
            });
            expect(res.statusCode).toBe(200);

            const rawdata = fs.readFileSync("./data/db.json");
            let moviefile = JSON.parse(rawdata);
            moviefile.movies.splice(moviefile.movies.length-1, 1);
            const updatedFile = JSON.stringify(moviefile, null, "\t");
            fs.writeFileSync('./data/db.json', updatedFile);
        });
    });

    describe("when specified movie is already in catalogue", () => {
        test("should respond with a 400 status code", async () => {
            const res = await request(app).post("/api/movie/add").send({
                genres: ["Action"],
                title: "Downfall",
                year: 2000,
                runtime: 200,
                director: "director"
            });
            expect(res.statusCode).toBe(400);
        });
    });

    describe("when one of required fields are missing", () => {
        test("should respond with a 400 status code", async () => {
            const data = [
                {},

                {
                    genres: ["Action", "Comedy"]
                },
            
                {
                    genres: ["Action", "Comedy"],
                    title: "title"
                },
            
                {
                    genres: ["Action", "Comedy"],
                    title: "title",
                    year: 2000
                },
            
                {
                    genres: ["Action", "Comedy"],
                    title: "title",
                    year: 2000,
                    runtime: 200
                }
            ]
            for (const body of data){
                const res = await request(app).post("/api/movie/add").send(body);
                expect(res.statusCode).toBe(400);
            }
        });
    });
})
