# Finding Waldo

This is an assignment about event emitter.

## About

In this assignment, you should write a file searching class in Node.js using the class EventEmitter. The class should be able to search in several text files after the phrase "waldo" (case-insensitive) and emit an event with the phrase and the name of the file where it was found.

You can find the files to search in this repo.

## Requirements

- Create a class `TextCrawler`, inherited from `EventEmitter`, that have two public methods, `addFile` and `find`.
- There must be a constructor making it possible to pass a regular expression when instantiating an object of the class.
- The method `addFile` takes a string with a file path to add files to search.
- The method `find` searches for the phrase "waldo" in all the files and emits the event "found" whenever it finds the phrase in a file. If an error occurs, be sure to emit an “error” event.
- Your `app.js`, that is using an instance of your `TextCrawler` class, should present well-suited text string whenever it finds "waldo" in a file.

## Example use and output

Example of command line to run the application.

```shell
npm start

> exercise-finding-waldo@1.2.0 start /exercise-finding-waldo
> node app.js

ERROR: ENOENT: no such file or directory, open 'file5.json'
Matched "waldo" in file file1.txt
Matched "Waldo" in file file4.json
```

## Hints

- [Events](https://nodejs.org/api/events.html)
- [Regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
- In the method `find` loop through all files added. Use a regular expression to find the phrase and emit on the first hit.
- The book "Node.js Design Patterns, Second Edition", page 64-69.

## Solution

- <https://github.com/CS-LNU-Learning-Objects/SOLUTION-the-node-platform-finding-waldo>
