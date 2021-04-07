jest.mock("word-maker", () => ({
    getRandomWord: jest.fn(),
    getRandomWordSync: jest.fn(),
}));

import * as fs from "fs";
import * as path from "path";
import { getRandomWord, getRandomWordSync } from "word-maker";
import {
    COUNT,
    createItems,
    getFizzBuzzWord,
    getRandomItemSyncWithError,
    getRandomItemWithError,
    RES_FILE_NAME,
    task1,
    task2,
    task3FizzBuzz,
    task3NoFizzBuzz,
    task4FizzBuzz,
    task4NoFizzBuzz,
} from "./index";

jest.mock("fs");

describe("Words generators", () => {
    let consoleObjectLink;
    const cb = () => ({});

    beforeAll(() => {
        consoleObjectLink = console;
        console = {
            log: cb,
        } as unknown as Console;
        (fs.writeFileSync as jest.Mock<any>).mockClear();
    });

    afterAll(() => {
        console = consoleObjectLink;
    });

    it("should generate and save report to a file", () => {
        expect((fs.writeFileSync as jest.Mock<any>).mock.calls).toHaveLength(1);
        expect((fs.writeFileSync as jest.Mock<any>).mock.calls[0][0]).toBe(path.join(__dirname, RES_FILE_NAME));
    });


    describe("createItems", () => {
        it("should generate items", () => {
            const cb = jest.fn();
            const res = createItems(10, cb);
            expect(res).toHaveLength(10);
            expect(cb).toHaveBeenCalledTimes(10);
        });
    });

    describe("getFizzBuzzWord", () => {
        it("should handle fizzbuzz cases", () => {
            expect(getFizzBuzzWord(15)).toBe("FizzBuzz");
            expect(getFizzBuzzWord(3)).toBe("Fizz");
            expect(getFizzBuzzWord(5)).toBe("Buzz");
            expect(getFizzBuzzWord(2)).toBeUndefined();
            expect(getFizzBuzzWord(1)).toBeUndefined();
            expect(getFizzBuzzWord(8)).toBeUndefined();
        });
    });

    describe("getRandomItemSyncWithError", () => {
        it("should generate random word in case of no errors", () => {
            getRandomWordSync.mockReturnValueOnce("random word");
            expect(getRandomItemSyncWithError()).toBe("random word");
        });
        it("should return fallback in case of error", () => {
            getRandomWordSync.mockImplementationOnce(() => {
                throw new Error();
            });
            expect(getRandomItemSyncWithError()).toBe("It shouldn't break anything!");
        });
    });

    describe("getRandomItemWithError", () => {
        it("should generate random word in case of no errors", () => {
            getRandomWord.mockResolvedValueOnce("random word");
            return getRandomItemWithError().then((res) => {
                expect(res).toBe("random word");
            });
        });
        it("should return fallback in case of error", () => {
            getRandomWord.mockRejectedValueOnce(() => {
                throw new Error();
            });
            return getRandomItemWithError().then((res) => {
                expect(res).toBe("It shouldn't break anything!");
            });
        });
    });

    describe("Task 1", () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        it(`should generate ${COUNT} random words`, () => {
            const res = task1();
            expect(getRandomWordSync).toHaveBeenCalledTimes(COUNT);
            expect(res).toHaveLength(COUNT);
        });
    });

    describe("Task 2", () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        it(`should generate ${COUNT} random and fizzbuzz words`, () => {
            const res = task2();
            expect(res).toHaveLength(COUNT);
            expect(getRandomWordSync).toHaveBeenCalled();
            expect(res[14]).toBe("FizzBuzz");
            expect(res[4]).toBe("Buzz");
            expect(res[2]).toBe("Fizz");
        });
    });

    describe("Task 3 without FizzBuzz", () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });
        it(`should generate ${COUNT} random words asynchronously`, () => {
            return task3NoFizzBuzz().then((res) => {
                expect(res).toHaveLength(COUNT);
                expect(getRandomWord).toHaveBeenCalledTimes(COUNT);
            });
        });
    });

    describe("Task 3 with FizzBuzz", () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });
        it(`should generate ${COUNT} random and fizzbuzz words asynchronously`, () => {
            return task3FizzBuzz().then((res) => {
                expect(res).toHaveLength(COUNT);
                expect(getRandomWord).toHaveBeenCalled();
                expect(res[14]).toBe("FizzBuzz");
                expect(res[4]).toBe("Buzz");
                expect(res[2]).toBe("Fizz");
            });
        });
    });

    describe("Task 4 without FizzBuzz", () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });
        it(`should generate ${COUNT} random words synchronously`, () => {
            getRandomWordSync.mockResolvedValue("random word");
            return task4NoFizzBuzz().then((res) => {
                expect(res).toHaveLength(COUNT);
                expect(getRandomWordSync).toHaveBeenCalledTimes(COUNT);
                expect(res.every(((r) => r === "random word"))).toBe(true);
            });
        });
        it(`should generate ${COUNT} random words synchronously with error fallback`, () => {
            getRandomWordSync.mockImplementation(() => {
                throw new Error("Random error");
            });
            return task4NoFizzBuzz().then((res) => {
                expect(res).toHaveLength(COUNT);
                expect(getRandomWordSync).toHaveBeenCalledTimes(COUNT);
                expect(res.every(((r) => r === "It shouldn't break anything!"))).toBe(true);
            });
        });
    });

    describe("Task 4 with FizzBuzz", () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });
        it(`should generate ${COUNT} random words and fizzbuzz asynchronously`, () => {
            getRandomWord.mockResolvedValue("random word");
            return task4FizzBuzz().then((res) => {
                expect(res).toHaveLength(COUNT);
                expect(getRandomWord).toHaveBeenCalled();
                expect(res[14]).toBe("FizzBuzz");
                expect(res[4]).toBe("Buzz");
                expect(res[2]).toBe("Fizz");
            });
        });
        it(`should generate ${COUNT} random words and fizzbuzz asynchronously with error fallback`, () => {
            getRandomWord.mockImplementation(() => {
                throw new Error("Random error");
            });
            return task4FizzBuzz().then((res) => {
                expect(res).toHaveLength(COUNT);
                expect(getRandomWord).toHaveBeenCalled();
                expect(res.some(((r) => r === "It shouldn't break anything!"))).toBe(true);
                expect(res[14]).toBe("FizzBuzz");
                expect(res[4]).toBe("Buzz");
                expect(res[2]).toBe("Fizz");
            });
        });
    });

});
