
#### working locally:
1. Get a dev key from https://developer.forecast.io/ and add a file to the top level
of the project called forecast-dev-key.js that contains:

    var forecast_dev_key = 'xxx';
    module.exports = forecast_dev_key;

2. npm run-script webpack-start
3. npm run-script express-start

#### run tests in the browser:
1. npm test
2. then go to localhost:8081/debug.html

#### deploying to heroku:
(running npm dist on heroku was timing out)

1. npm run-script dist
2. git commit -m 'commit msg'
3. git push heroku master
