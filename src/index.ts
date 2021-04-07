/// <reference types="node" />

import * as fs from "fs";
import * as path from "path";

import { getRandomWord, getRandomWordSync } from "word-maker";

export const COUNT = 100;
export const RES_FILE_NAME = "results.json";

// 1. Print numbers from 1 to 100 to the console, but for each number also
// print a random word using the function `getRandomWordSync`. E.g.
//
// 1: four
// 2: firm
// 3: shape
// 4: choice
// 5: coach
// 6: purple
// ...
// 100: buffalo

export const createItems = (count: number, cb: (_: any, i: number) => any) =>
    new Array(count).fill(undefined).map(cb);

export const task1 = () => createItems(COUNT, getRandomWordSync);

// 2. Modify your code to be a "Fizz Buzz" program. That is, print the numbers
//  as in the previous step, but for multiples of three, print "Fizz"
// (instead of the random word), for multiples of five, print "Buzz"
// and for numbers which are both multiples of three and five, print "FizzBuzz".

export function getFizzBuzzWord(i: number): string | undefined {
    if (i % 3 === 0 && i % 5 === 0) {
        return "FizzBuzz";
    } else if (i % 3 === 0) {
        return "Fizz";
    } else if (i % 5 === 0) {
        return "Buzz";
    }
}

export const task2 = () => createItems(COUNT, (_, i) => getFizzBuzzWord(i + 1) || getRandomWordSync());

// 3. Create a version of steps *1* and *2* using the **asynchronous**
// function, `getRandomWord`. This function returns a Promise, which resolves
// to a random word string. Ideally, the numbers should be in numerical order.

export const task3NoFizzBuzz = () => Promise.all(createItems(COUNT, getRandomWord));
export const task3FizzBuzz = () => Promise.all(createItems(COUNT, (_, i) => getFizzBuzzWord(i + 1) || getRandomWord()));

// 4. Add error handling to both the synchronous and asynchronous solutions
// (calling `getRandomWord({ withErrors: true })` will intermitently throw
// an error instead of return a random word). When an error is caught,
// the program should print "It shouldn't break anything!" instead
// of the random word, "Fizz", "Buzz" or "FizzBuzz"

export const getRandomItemSyncWithError = (): string => {
    try {
        return getRandomWordSync({ withErrors: true });
    } catch (e) {
        return "It shouldn't break anything!";
    }
};

export const task4NoFizzBuzz = () =>
    Promise.all(createItems(COUNT, getRandomItemSyncWithError));

export const getRandomItemWithError = async (): Promise<string> => {
    try {
        const word = await getRandomWord({ withErrors: true });
        return word;
    } catch (e) {
        return "It shouldn't break anything!";
    }
};

export const task4FizzBuzz = () =>
    Promise.all(createItems(COUNT, (_, i) => getFizzBuzzWord(i + 1) || getRandomItemWithError()));

// 5. For **Node.JS developers**: Instead of printing the console.
// Write the information to a file in the root of this project.
// For **Frontend** developers, send your result to an HTTP endpoint
// (since there is no running endpoint, this part of your solution
// does not need to actually run)

(async function sendItems() {
    const res = await Promise.all([
        task1(),
        task2(),
        task3NoFizzBuzz(),
        task3FizzBuzz(),
        task4NoFizzBuzz(),
        task4FizzBuzz(),
    ]);

    printResults(res);

    try {
        fetch("/api/postExample", {
            body: JSON.stringify(res),
            method: "POST",
        });
    } catch (e) {
        saveResults(res, RES_FILE_NAME);
    }
})();

function printResults(res: string[][]): void {
    res.forEach((r) => {
        // tslint:disable-next-line no-console
        console.log("\n");
        // tslint:disable-next-line no-console
        console.log(r.map((item, i) => `${i + 1}. ${item}`).join("\n"));
    });
}

function saveResults(res: any, filename: string): void {
    fs.writeFileSync(path.join(__dirname, filename), res.toString());
}
