
#### working locally:
1. Get a dev key from https://developer.forecast.io/ and add a file to the top level of the project called forecast-dev-key.js that contains:
    var forecast_dev_key = 'xxx';
    module.exports = forecast_dev_key;
2. Make a similar file called geocode-key.js with a Google API token.
3. npm run-script webpack-start (serves the app on localhost:8080 )
4. npm run-script express-start (starts up the node backend)

#### run tests in the browser:
1. npm test
2. then go to localhost:8081/debug.html

#### deploying to heroku:
(running npm dist on heroku was timing out)

1. npm run-script dist
2. make a git commit
3. git push heroku master
