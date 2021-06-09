const {isUrl, randomMovie} = require("../methods/movieMethods");

describe("randomMovie()", () => {
    describe("given two numbers (second greater than a first one)", () => {
        test("should return a number between specified range", () => {
            expect(randomMovie(1,5)).toBeGreaterThanOrEqual(1);
            expect(randomMovie(1,5)).toBeLessThanOrEqual(5);
        });
    });
});

describe("isUrl()", () => {
    describe("given valid url", () => {
        test("should return true", () => {
            expect(isUrl("https://www.youtube.com/")).toBe(true);
        });
    });
    
    describe("given invalid url", () => {
        test("should return false", () => {
            expect(isUrl("youtube")).not.toBe(true);
        });
    });
})
