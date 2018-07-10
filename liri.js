require("dotenv").config();



// calling npm modules and declaring variables.

var fs = require("fs"); //reads and writes files

var Twitter = require("twitter"); 

var Spotify = require("node-spotify-api");

var request = require("request");

var keys = require("./keys.js");

var liriArg = process.argv[2];
var userInput = process.argv[3];

var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
  });

// ---------------------------------------------------------------------------------------------------------------
// commands for liri
// ========================================================================================================
function liriMain(command, arg){
    switch(command) {
        case "my-tweets": myTweets(); break;
        case "spotify-this-song": spotifyThisSong(arg); break;
        case "movie-this": movieThis(arg); break;
        case "do-what-it-says": doWhatItSays(); break;
        // Instructions displayed in terminal to the user
        default: console.log("\r\n" +"Type one of the following commands after 'node liri.js' : " +"\r\n"+
            "1. my-tweets 'any twitter name' " +"\r\n"+
            "2. spotify-this-song 'any song name' "+"\r\n"+
            "3. movie-this 'any movie name' "+"\r\n"+
            "4. do-what-it-says."+"\r\n"+
            "If more than one word, put all in quotation marks!");
    }
}


// ---------------------------------------------------------------------------------------------------------------
// Functions
// ========================================================================================================

// Tweet function, uses the Twitter module to call the Twitter api
function myTweets() {
    var client = new Twitter({
        consumer_key: keys.twitter.consumer_key,
        consumer_secret: keys.twitter.consumer_secret,
        access_token_key: keys.twitter.access_token_key,
        access_token_secret: keys.twitter.access_token_secret
      });
    
    params = {screen_name: 'bootcampfiles'};
    
    // GET request for last 20 (default) tweets on my timeline
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for(var i = 0; i < tweets.length; i++) {
                
                var twitterResults = 
                "@" + tweets[i].user.screen_name + ": " + 
                tweets[i].text + "\r\n" + 
                tweets[i].created_at + "\r\n" + 
                "================================================================================" + "\r\n";
                console.log(twitterResults);
                log(twitterResults); 
            }
        }  else {
            console.log("Error :"+ error);
            return;
        }
    //     if(error) { 
    //         console.log('Error occurred: ' + error);
    //     } else { 
    //     console.log("My Recent Tweets");

    //     for(var i = 0; i < tweets.length; i++) {
    //         console.log("( #" + (i + 1) + " )  " + tweets[i].text);
    //         console.log("Created:  " + tweets[i].created_at);
    //         console.log("=======================================");
    //     }
    //   }
    });
    }


// ========================================================================================================

// Spotify function, uses the Spotify module to call the Spotify app

function spotifyThisSong(userInput) {
    if(!userInput){
        userInput = "who let the dogs out";
    }
    params = userInput;
    spotify.search({ type: "track", query: params }, function(err, data) {
        if(!err){
            var songInfo = data.tracks.items;
            for (var i = 0; i < 5; i++) {
                if (songInfo[i] != undefined) {
                    var spotifyResults =
                    "Artist: " + songInfo[i].artists[i].name + "\r\n" +
                    "Song: " + songInfo[i].name + "\r\n" +
                    "Album: " + songInfo[i].album.name + "\r\n" +
                    "Preview Url: " + songInfo[i].preview_url + "\r\n" +
                    "=====================================================" + "\r\n";
                    console.log(spotifyResults);
                    log(spotifyResults);
                }
            }
        }	else {
            console.log(data);
            // console.log("Error :"+ err);
            return;
        }
    });
}

// // ==========================================================================================================

// // Movie function, uses the Request module to call the OMDB api
function movieThis(userInput){
    var movie = userInput;
    if(!movie){
        movie = "minions";
    }
    params = movie;
    request("http://www.omdbapi.com/?apikey=a09ba9af&t=" + params + "&y=&plot=short&r=json&tomatoes=true", function (error, response, body) {
        if (!error && response.statusCode == 200) {

            var movieObject = JSON.parse(body);
            var movieResults =
            "Title: " + movieObject.Title+"\r\n"+
            "Year: " + movieObject.Year+"\r\n"+
            "Imdb Rating: " + movieObject.imdbRating+"\r\n"+
            "Rotten Tomatoes Rating: " + movieObject.tomatoRating+"\r\n"+
            "Country: " + movieObject.Country+"\r\n"+
            "Language: " + movieObject.Language+"\r\n"+
            "Plot: " + movieObject.Plot+"\r\n"+
            "Actors: " + movieObject.Actors+"\r\n";

            console.log(movieResults);
            log(movieResults);
        } else {
            console.log("Error :"+ error);
            return;
        }
    });
}

// ========================================================================================================

// Do What It Says function, uses the reads and writes module to access the random.txt file and do what's written in it
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data){
        if (!error) {
            doWhatItSaysResults = data.split(",");
            
            liriMain(doWhatItSaysResults[0],doWhatItSaysResults[1]);
            console.log(doWhatItSaysResults);
            log(doWhatItSaysResults);
        } else {
            console.log("Error occurred" + error);
        }
    });
}

// ========================================================================================================
// activating log function

function log(logResults) {
    fs.appendFile("log.txt", logResults, (error) => {
      if(error) {
        throw error;
      }
    });
  }

liriMain(liriArg, userInput);