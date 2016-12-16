# Twitter Bot built with Node.js

The Twitter bot likes tweets based on hashtags.


## Getting Started

* Clone the repository and install packages :

```
$ npm install
```

* Set keys and tokens in config.js.

* Create a text file in the same directory and type hashtags in the file.

* Run the program with the following command :

```
$ node bot.js <interval in minutes> <text file containing hashtags>
```

* The program can also be run with `npm scripts`. In `package.json`, set the default command in `start` and then run the following command :

```
$ npm start
```
