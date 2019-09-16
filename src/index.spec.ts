import { getRandomWord, getRandomWordSync } from "word-maker";
import { task1 } from "./index";

describe("task 1", () => {
    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "log");
    });

    it("should print 100 items into console", () => {
        task1();
        expect(consoleSpy).toHaveBeenCalledTimes(100);
    });
});
