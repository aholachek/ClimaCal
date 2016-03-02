
#### working locally:
1. npm run-script webpack-start
2. npm run-script express-start
3. in weather.js, set 'weatherEndpoint' var as localhost

#### run tests in the browser:
1. npm test
2. then go to localhost:8081/debug.html

#### deploying to heroku:
(running npm dist on heroku was timing out)

1. npm run-script dist
2. git commit -m 'commit msg'
3. git push heroku master
