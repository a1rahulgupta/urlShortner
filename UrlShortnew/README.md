# MEAN Stack URL Shortener Web Application Developed By Rahul Gupta

URL Shortener Web Application V.1

## Development server

Run `ng serve` for a angular server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `node ./bin/www `for  node server. This app will automatically connected to database.(MongoDB)

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

All URLs and click analytics are public and can be accessed by anyone.

## Description

A URL shortener is an online application that converts a regular URL (the web address that starts with http://) into its condensed format.

The user only has to copy the full URL of a website and paste it into the URL shortening tool to come up with an abbreviated version that is around 10 to 20 characters long.
Regular URL - http://www.nytimes.com/2012/08/09/us/more-casinos-and-internet-gambling-threaten-shakopee-tribe.html?_r=1&hp


Shortened URL - http://nyti.ms/P7eg6B


A high level the URL shortener works by taking a long URL and applying a hashing algorithm to spit out a shorter version of the URL and stores them in a database for later lookup.


Test Cases of URL Shorton Web application:- 

## Test Cases for Social URL Shortner-

1- Verify that cursor is focused on url text box on the page load.

2- Verify that the url text box contains elements such as link , webUrl, with http or https.

3- Verify that User is able to make short url with Valid webUrl.

4- Verify that User is not able to make short url with invalid webUrl or invalid link.

5- Verify that User is not able to make short url with Valid protocol and invalid domain.

6- Verify that User is not able to make short url with invalid protocol and Valid domain.

7- Verify that User is not able to make short url with blank Url.

8- Verify that User is not able to get hours analytics with valid input.

9- Verify that User is not able to get date analytics with valid input.

10-Verify the Histogram with valid date. 

11- Verify the Histogram with valid hours. 

12- Verify the Histogram with valid years. 

12- Verify the Histogram with valid month. 

13- Verify the Histogram with valid click count. 

15- Verify the short url redirect to long url.

16- Verify the plateform value for short url.

17- Verify the referrar value for short Url.

18- Verify the click count for short Url.

19- Verify the date for short Url.

20- Verify the browser for short Url.

## Further help

Email: a1rahulgupta@gmail.com
Contact Us: 9927955351
