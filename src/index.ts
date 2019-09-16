// tslint:disable no-console
import { getRandomWord, getRandomWordSync } from "word-maker";

console.log("It works!");

// Task 1
export function task1() {
    const printRandomItemSync = (i: number) => {
        console.log(`${i + 1}. ${getRandomWordSync()}`);
    };
    // Need to separate data generation and logging for sending
    return doTimesSync(100, printRandomItemSync);
}

// Task 2
export function task2() {
    function printRandomOrAndFizzBuzzItemSync(i: number) {
        const result = checkFizzBuzz(i + 1) || getRandomWordSync();
        console.log(`${i + 1}. ${result}`);
    }
    return doTimesSync(100, printRandomOrAndFizzBuzzItemSync);
}

// Task 3 Without fizz buzz
export function task3NoFizzBuzz() {
    const createTask = () => getRandomWord();
    return doTimes(100, createTask, printResults);
}

// Task 3 With fizz buzz
export function task3FizzBuzz() {
    const createTask = (i) => getRandomOrFizzBuzzItem(i);
    return doTimes(100, createTask, printResults);
}

// Task 4 Without fizz buzz
export function task4NoFizzBuzz() {
    const createTask = (i) => getRandomItemWithError(i);
    return doTimes(100, createTask, printResults);
}

// Task 4 With fizz buzz
export function task4FizzBuzz() {
    const createTask = (i) => getRandomOrFizzBuzzItemWithError(i);
    return doTimes(100, getRandomOrFizzBuzzItemWithError, printResults);
}

(function sendItems() {
    Promise.all([
        task1(),
        task2(),
        task3NoFizzBuzz(),
        task3FizzBuzz(),
        task4NoFizzBuzz(),
        task4FizzBuzz(),
    ])
    .then((data) => fetch("/api/postExample", {
        body: JSON.stringify(data),
        method: "POST",
    }))
    .catch((err) => console.log("My bad"));
})();

function doTimesSync(times = 0, cb: (i: number) => void) {
    for (let i = 0; i < times; i += 1) {
        cb(i);
    }
}

function doTimes(
    times = 100,
    taskCreator: (index: number) => Promise<any>,
    cb: (items: number|string[]) => void,
) {
    const tasksArray = [];
    doTimesSync(100, (i) => tasksArray.push(taskCreator(i)));
    return Promise.all(tasksArray).then(printResults);
}

function checkFizzBuzz(i: number): string | undefined {
    if (i % 3 === 0 && i % 5 === 0) {
        return "FizzBuzz";
    } else if (i % 3 === 0) {
        return "Fizz";
    } else if (i % 5 === 0) {
        return "Buzz";
    }
}

async function getRandomOrFizzBuzzItem(i) {
    let result = checkFizzBuzz(i + 1);
    if (!result) {
        result = await getRandomWord();
    }
    return result;
}

async function getRandomItemWithError(i) {
    try {
        const result = await getRandomWord({ withErrors: true });
        return result;
    } catch (e) {
        return e;
    }
}

async function getRandomOrFizzBuzzItemWithError(i) {
    let result = checkFizzBuzz(i + 1);
    if (!result) {
        result = await getRandomItemWithError(i);
    }
    return result;
}

function printResults(results) {
    const printResult = (result, i) => {
        console.log(`${i + 1}. ${result}`);
    };
    results.forEach(printResult);
    return results; // for chaining
}
