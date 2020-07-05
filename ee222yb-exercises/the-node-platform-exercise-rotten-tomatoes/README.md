# Rotten Tomatoes

In this exercise, you will get started with a simple node application. The application will read from two files; one JSON file and one XML file.

The files contain famous movie titles and some metadata about those movies. You are supposed to write an application that reads the data from the files and calculates the average rating of the movies. The data in the JSON file stems from [IMDB](http://www.imdb.com/) whereas the XML file stems from [Rotten Tomatoes](http://www.rottentomatoes.com/). One average is calculated for the IMDB data and one average for the Rotten Tomatoes data. (The focus of this exercise is promises and callbacks, not calculating stuff.)

Let’s get started!

## Getting started guide

Before you begin, make sure you have a laboratory environment set up according to your course specification.

1. Start by creating a `package.json` identifying your project. (`$ npm init`).
1. Create a `.ignore` file for your environment (`$ git ignore node,visualstudiocode,windows >> .gitignore`, if you created the ignore alias, if necessary replace `visualstudiocode` with your IDE and/or `windows` with `macos` or `linux`).
1. Create an `app.js` file in the root directory. (`$ touch app.js`)
1. Create a directory called `lib`. (`$ mkdir lib`)
1. Create a directory in the `lib` directory called `movies` (`$ mkdir lib/movies`)
1. Create a file called `reviewer.js`  in the `lib` directory (`$ touch lib/reviewer.js`)
1. Export a function from `reviewer.js` and require it in `app.js`. Add `console.log('Hello World)` to the function in `reviewer.js`. Call the function from `app.js` and run the application using `$ node app.js`. If the console greets you with "Hello World" you are good to go. Otherwise, debug!
1. Copy the [JSON file](movies.json) and the [XML file](movies.xml) into the folder `./lib/movies`:
    - `wget -O ./lib/movies/movies.xml 'https://raw.githubusercontent.com/CS-LNU-Learning-Objects/the-node-platform-exercise-rotten-tomatoes/master/movies.xml'`
    - `wget -O ./lib/movies/movies.json 'https://raw.githubusercontent.com/CS-LNU-Learning-Objects/the-node-platform-exercise-rotten-tomatoes/master/movies.json'`
1. Find a package at npm that can convert xml to JavaScript objects. ([xml2js](https://www.npmjs.com/package/xml2js))
1. Add the package to your project. (`$ npm install xml2js`)

Now you are good to go.

In this exercise, the main goal is to train your skills in handling callbacks and promises. The recommended path to follow is, therefore:

1. Solve the exercise using the `fs` module (`const fs = require('fs')`) to read the content of the files and the module `xml2js` to convert the XML content to a JavaScript object.
1. Wrap the fs callback interface behind a promise module, i.e. create a module called `fs-promise.js` with functions returning promises. Make use of `Promise.all()` to be able to read the XML and JSON files in parallel.
1. Search the [npm library](https://www.npmjs.com/search?q=fs+promise) and discover that someone else already made a [promise wrapper](https://www.npmjs.com/package/fs-extra). Remove your `fs-promise.js` and use `fs-extra` instead. (`npm install fs-extra` `const fs = require('fs-extra')`)
1. Use async/await and promises for even slicker program flow.

### Example use and output

```shell
$ node app.js
Average rating
IMDB: 9.08
Rotten Tomatoes: 94.8 %
```

### Bonus exercise

Using the built-in time measurement tool `console.time('What I am measuring')` and corresponding `console.timeEnd('What I am measuring')` you can measure the execution time of parts of your code. Use that to analyze which parts of your code are the bottlenecks. How could that be avoided?

## Solution

https://github.com/CS-LNU-Learning-Objects/SOLUTION-the-node-platform-exercise-rotten-tomatoes
