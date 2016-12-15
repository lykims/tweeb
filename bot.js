var dateFormat = require('dateformat');
var twit = require('twit');
var config = require('./config.js');

var Twitter = new twit(config);

var intervalTime = 10; // By default, 10 minutes
var hashtags = '';

var isNumber = function(value) {
    return /^\d+$/.test(value);
}

var setArguments = function(args) {
    if (args.length <= 3) {
        console.log("Usage: node bot.js <interval in minutes> <hashtags separated by space>");
        process.exit(-1);
    }
    else {
        if (isNumber(args[2])) {
            intervalTime = args[2] * 60000;
        }
        else {
            console.log("The second argument should be a positive integer.");
            console.log("Usage: node bot.js <interval in minutes> <hashtags separated by space>");
            process.exit(-1);
        }

        for (i = 3; i < args.length; i++) {
            hashtags += '#' + args[i];
            if(i < (args.length-1) ) {
                hashtags += ', '
            }
        }
    }
}

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
            var tweetId = data.statuses[0].id_str;
            Twitter.post('favorites/create', {
                id: tweetId
            }, function(err, response) {
                var now = new Date();
                if (response) {
                    console.log(dateFormat(now, 'yyyy-mm-dd h:MM:ss TT') + ' : Successfully liked the tweet ID ' + tweetId + '! :D');
                }
                if (err) {
                    console.log(dateFormat(now, 'yyyy-mm-dd h:MM:ss TT') + ' : Like failed. :(');
                    console.log(err);
                }
            });
        }
    });
}

setArguments(process.argv);

like();

setInterval(like, intervalTime);
