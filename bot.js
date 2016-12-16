var dateFormat = require('dateformat');
var read = require('read-file');
var twit = require('twit');
var config = require('./config.js');

var Twitter = new twit(config);

var intervalTime = 10; // By default, 10 minutes
var hashtags = '';

var exitOnError = function(errorMessage) {
    console.log();
    if(errorMessage) {
        console.log(errorMessage);
    }
    console.log('Usage : node bot.js <interval in minutes> <text file containing hashtags>\n');
    process.exit(-1);
}

var isNumber = function(value) {
    return /^\d+$/.test(value);
}

var isTextFile = function(filename) {
    var extension = filename.trim().split('.').pop();
    return extension && extension.toLowerCase() === 'txt'
}

var setIntervalTime = function(arg) {
    if (isNumber(arg)) {
        intervalTime = arg * 60000;
    }
    else {
        exitOnError("The second argument should be a positive integer.");
    }
}

var setHashtags = function(filename) {
    if(isTextFile(filename)) {
        var buffer = read.sync(filename, {encoding: 'utf8'});
        if(buffer) {
            var words = buffer.trim().split(/[#\s]+/g);
            if(words.length === 1 && words[0] === '') {
                exitOnError('The file is empty. It should contain hashtags.');
            }
            else {
                var hashwords = words.map(function(el) { return '#' + el; });
                hashtags = hashwords.join(', ');
                console.log('\n----- HASHTAGS -----');
                console.log(hashtags);
                console.log('--------------------\n');
            }
        }
        else {
            exitOnError('The file is empty. It should contain hashtags.');
        }
    }
    else {
        exitOnError('The file extension should be ".txt"');
    }
}

var processArguments = function(args) {
    if (args.length <= 3) {
        exitOnError('');
    }
    else {
        setIntervalTime(args[2]);
        setHashtags(args[3]);
    }
}

var rand = function(arr) {
  var index = Math.floor(Math.random()*arr.length);
  return arr[index];
};

var like = function() {
    var params = {
        q: hashtags,
        result_type: 'recent',
        lang: 'en'
    }

    Twitter.get('search/tweets', params, function(err, data) {
        if(err) {
            console.log('Cannot search for tweets. :(');
            console.log(err);
        }
        else {
            var randomTweet = rand(data.statuses);
            if(typeof randomTweet != 'undefined') {
                var tweetId = randomTweet.id_str;
                Twitter.post('favorites/create', {
                    id: tweetId
                }, function(err, response) {
                    var now = new Date();
                    if (response) {
                        console.log('> ' + dateFormat(now, 'yyyy-mm-dd h:MM:ss TT') + ' : Successfully liked the tweet ID ' + tweetId + '! :D\n');
                    }
                    if (err) {
                        console.log('> ' + dateFormat(now, 'yyyy-mm-dd h:MM:ss TT') + ' : Like failed. :(');
                        console.log(err + '\n');
                    }
                });
            }
        }
    });
}

processArguments(process.argv);

like();

setInterval(like, intervalTime);
