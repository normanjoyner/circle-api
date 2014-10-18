circle-api
====================

##About

###Description
A nodejs module for interacting with the Circle API.

Donations welcomed at: 1CniXdfgpAbM3pYbbLvooRZAGhTEpTMjkN

![1CniXdfgpAbM3pYbbLvooRZAGhTEpTMjkN]
(http://chart.apis.google.com/chart?chs=250x250&cht=qr&chld=|1&chl=bitcoin%3A1CniXdfgpAbM3pYbbLvooRZAGhTEpTMjkN)

###Author
Norman Joyner - norman.joyner@gmail.com

##Getting Started

###Installation
```npm install circle-api```

###Configuration
Simply require the circle-api module, instantiate a new Circle-Api object, configure it if necessary, and start making calls. The mfa secret and api version are configurable. Your Circle account must be set up to use Google Authenticator, rather than text messaged based MFA.

New Circle-Api objects can be instantiated with configuration parameters. Here is an example:
```javascript
var CircleApi = require("circle-api");
var circle_api = new CircleApi({
    api_version: "v2",
    mfa_secret: "NVTGCX3TMVRXEZLU"
});
```

Circle-Api objects can also be configured via the ```.configure(options)``` method. Here is an exmaple:
```javascript
var CirlceApi = require("circle-api");
var circle_api = new CircleApi();

var options = {
    mfa_secret: "NVTGCX3TMVRXEZLU"
}

circle_api.configure(options);
```

####Options
```api_version``` - [optional, defaults to "v2"] version of the API to use

```mfa_secret``` - [required] totp secret

####Finding MFA Secret
Before scanning the Google Authenticator code with your application of choice, first scan the QR code with a QR code app. View the url the QR contains and you will see something similar to: otpauth://totp/Circle%3Ayour%40email.com?secret=NVTGCX3TMVRXEZLU&issuer=Circle

Take notice to what 'secret' is equal to in the url and use this as the ```mfa_secret```.

###Supported API versions
* v2

###Supported API Methods
* Logging In - ```circle_api.login(options, fn)```
* Getting Account Information - ```circle_api.get_account(fn)```
* Getting Activities - ```cirlce_api.get_activities(fn)```
* Getting History - ```cirlce_api.get_history(fn)```
* Getting Bitcoin Address - ```circle_api.get_address(fn)```
* Getting Personal Information - ```circle_api.get_personal_information(fn)```
* Getting Fiat Accounts - ```circle_api.get_fiat_accounts(fn)```
* Depositing Money - ```circle_api.deposit(options, fn)```
* Sending Money - ```circle_api.send(options, fn)```
* Requesting Money - ```circle_api.request(options, fn)```

###Examples
Before making future API calls, you must first login:
```javascript
circle_api.login({email: "your@email.com", password: "yourpassword"}, function(err){
    if(err)
        throw err;
});
```

Once logged in you can make additional calls.

Fetch account information, and print response:
```javascript
circle_api.get_account(function(err, account_info){
    if(err)
        throw err;

    console.log(account_info);
});
```

Fetch account activities, and print response:
```javascript
circle_api.get_activities(function(err, activities){
    if(err)
        throw err;

    console.log(activities);
});
```

Fetch account history, and print response:
```javascript
circle_api.get_history(function(err, history){
    if(err)
        throw err;

    console.log(history);
});
```

Get bitcoin address, and print response:
```javascript
circle_api.get_address(function(err, address){
    if(err)
        throw err;

    console.log(address);
});
```

Get personal information, and print response:
```javascript
circle_api.get_personal_information(function(err, pii){
    if(err)
        throw err;

    console.log(pii);
});
```

Get fiat accounts, and print response:
```javascript
circle_api.get_fiat_accounts(function(err, accounts){
    if(err)
        throw err;

    console.log(accounts);
});
```

Deposit $1 from fiat account, and print response:
```
circle_api.deposit({"fiat_address": "fiat-account-address", amount: 1.0}, function(err, response){
    if(err)
        throw err;

    console.log(response);
});
```

Send $1 to bitcoin address (or email address), and print response:
```
circle_api.send({"address": "1CniXdfgpAbM3pYbbLvooRZAGhTEpTMjkN", amount: 1.0}, function(err, response){
    if(err)
        throw err;

    console.log(response);
});
```

Request $1 from email address, and print response:
```
circle_api.request({"email": "someones@email.com", amount: 1.0}, function(err, response){
    if(err)
        throw err;

    console.log(response);
});
```
