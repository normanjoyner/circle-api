var _ = require("lodash");
var async = require("async");
var request = require([__dirname, "request"].join("/"));
var utils = require([__dirname, "utils"].join("/"))

module.exports = {

    login: function(body, fn){

        if(_.has(body, "email") && _.has(body, "password")){


            var options = {
                uri: ["", "api", this.api_version, "customers", "0", "sessions"].join("/"),
                body: body,
                method: "POST",
                version: this.version
            }

            var self = this;

            request.create(options, function(err, response){
                if(!_.isUndefined(response) && response.statusCode != 200)
                    err = new Error("Invalid username / password combination ... login Failed.");

                if(err)
                    return fn(err);

                self.auth.customer_id = response.body.response.sessionToken.customerId;
                self.auth.token = response.body.response.sessionToken.value;

                self.mfa(utils.get_mfa_token(self.auth.mfa_secret), function(err){
                    return fn(err);
                });
            });

        }
        else
            return fn(new Error("Insufficient parameters provided!"));
    },

    mfa: function(mfa_pin, fn){
        var options = {
            uri: ["", "api", this.api_version, "customers", this.auth.customer_id, "mfa"].join("/"),
            method: "PUT",
            version: this.version,
            headers: {
                "x-customer-id": this.auth.customer_id,
                "x-customer-session-token": this.auth.token
            },
            body: {
                action: "signin",
                mfaPin: mfa_pin,
                trusted: false
            }
        }

        var self = this;

        request.create(options, function(err, response){
            if(!_.isUndefined(response) && response.statusCode != 200)
                err = new Error("Invalid MFA pin provided ... login Failed!");
            else if(_.isEmpty(response.body.response.customer.accounts) && !_.has(response.body.response.customer.accounts[0], "id"))
                err = new Error("Customer does not have a linked account!");
            else
                self.auth.account_id = response.body.response.customer.accounts[0].id;

            return fn(err);
        });
    },

    get_account: function(fn){
        var options = {
            uri: ["", "api", this.api_version, "customers", this.auth.customer_id].join("/"),
            method: "GET",
            version: this.version,
            headers: {
                "x-customer-id": this.auth.customer_id,
                "x-customer-session-token": this.auth.token
            }
        }

        request.create(options, function(err, response){
            if(err)
                return fn(err);
            else if(!_.isUndefined(response) && response.statusCode != 200)
                return fn(new Error(["Received", response.statusCode, "when attempting to fetch account information!"].join(" ")));
            else{
                var body = utils.parse_json(response.body);
                if(_.isUndefined(body))
                    return fn(new Error("Failed to parse response when fetching account information!"))
                else
                    return fn(null, body.response.customer);
            }
        });
    },

    get_activities: function(fn){
        var options = {
            uri: ["", "api", this.api_version, "customers", this.auth.customer_id, "activities"].join("/"),
            method: "GET",
            version: this.version,
            headers: {
                "x-customer-id": this.auth.customer_id,
                "x-customer-session-token": this.auth.token
            }
        }

        request.create(options, function(err, response){
            if(err)
                return fn(err);
            else if(!_.isUndefined(response) && response.statusCode != 200)
                return fn(new Error(["Received", response.statusCode, "when attempting to fetch account activities!"].join(" ")));
            else{
                var body = utils.parse_json(response.body);
                if(_.isUndefined(body))
                    return fn(new Error("Failed to parse response when fetching account activities!"))
                else
                    return fn(null, body.response.activities);
            }
        });
    },

    get_history: function(fn){
        var options = {
            uri: ["", "api", this.api_version, "customers", this.auth.customer_id, "history"].join("/"),
            method: "GET",
            version: this.version,
            headers: {
                "x-customer-id": this.auth.customer_id,
                "x-customer-session-token": this.auth.token
            }
        }

        request.create(options, function(err, response){
            if(err)
                return fn(err);
            else if(!_.isUndefined(response) && response.statusCode != 200)
                return fn(new Error(["Received", response.statusCode, "when attempting to fetch account history!"].join(" ")));
            else{
                var body = utils.parse_json(response.body);
                if(_.isUndefined(body))
                    return fn(new Error("Failed to parse response when fetching account history!"))
                else
                    return fn(null, _.omit(body.response, "status"));
            }
        });
    },

    get_address: function(fn){
        var options = {
            uri: ["", "api", this.api_version, "customers", this.auth.customer_id, "accounts", this.auth.account_id, "address"].join("/"),
            method: "GET",
            version: this.version,
            headers: {
                "x-customer-id": this.auth.customer_id,
                "x-customer-session-token": this.auth.token
            }
        }

        request.create(options, function(err, response){
            if(err)
                return fn(err);
            else if(!_.isUndefined(response) && response.statusCode != 200)
                return fn(new Error(["Received", response.statusCode, "when attempting to fetch account address!"].join(" ")));
            else{
                var body = utils.parse_json(response.body);
                if(_.isUndefined(body))
                    return fn(new Error("Failed to parse response when fetching account address!"))
                else
                    return fn(null, _.omit(body.response, "status"));
            }
        });
    },

    get_personal_information: function(fn){
        var options = {
            uri: ["", "api", this.api_version, "customers", this.auth.customer_id, "pii"].join("/"),
            method: "GET",
            version: this.version,
            headers: {
                "x-customer-id": this.auth.customer_id,
                "x-customer-session-token": this.auth.token
            }
        }

        request.create(options, function(err, response){
            if(err)
                return fn(err);
            else if(!_.isUndefined(response) && response.statusCode != 200)
                return fn(new Error(["Received", response.statusCode, "when attempting to fetch personal information!"].join(" ")));
            else{
                var body = utils.parse_json(response.body);
                if(_.isUndefined(body))
                    return fn(new Error("Failed to parse response when fetching personal information!"))
                else
                    return fn(null, body.response.pii);
            }
        });
    },

    get_fiat_accounts: function(fn){
        var options = {
            uri: ["", "api", this.api_version, "customers", this.auth.customer_id, "fiatAccounts"].join("/"),
            method: "GET",
            version: this.version,
            headers: {
                "x-customer-id": this.auth.customer_id,
                "x-customer-session-token": this.auth.token
            }
        }

        request.create(options, function(err, response){
            if(err)
                return fn(err);
            else if(!_.isUndefined(response) && response.statusCode != 200)
                return fn(new Error(["Received", response.statusCode, "when attempting to fetch fiat accounts!"].join(" ")));
            else{
                var body = utils.parse_json(response.body);
                if(_.isUndefined(body))
                    return fn(new Error("Failed to parse response when fetching fiat accounts!"))
                else
                    return fn(null, body.response.fiatAccounts);
            }
        });

    },

    deposit: function(body, fn){
        if(_.has(body, "fiat_address") && _.has(body, "amount")){
            var options = {
                uri: ["", "api", this.api_version, "customers", this.auth.customer_id, "accounts", this.auth.account_id, "deposits"].join("/"),
                body: {
                    deposit: {
                        fiatAccountId: body.fiat_address,
                        fiatValue: body.amount
                    }
                },
                method: "POST",
                version: this.version,
                headers: {
                    "x-customer-id": this.auth.customer_id,
                    "x-customer-session-token": this.auth.token
                }
            }

            request.create(options, function(err, response){
                if(err)
                    return fn(err);
                else if(!_.isUndefined(response) && response.statusCode != 200)
                    return fn(new Error(["Received", response.statusCode, "when attempting to deposit!"].join(" ")));
                else
                    return fn(null, _.omit(response.body.response, "status"));
            });
        }
        else
            return fn(new Error("Insufficient parameters provided!"));
    },

    send: function(body, fn){
        if(_.has(body, "address") && _.has(body, "amount")){
            var self = this;
            this.get_account(function(err, response){
                if(err)
                    return fn(new Error("Could not fetch current exchange rate!"));

                var options = {
                    uri: ["", "api", self.api_version, "customers", self.auth.customer_id, "accounts", self.auth.account_id, "transactions"].join("/"),
                    body: {
                        mfaPin: utils.get_mfa_token(self.auth.mfa_secret),
                        transaction: {
                            bitcoinOrEmailAddress: body.address,
                            currencyCode: "USD",
                            exchangeRate: response.exchangeRate.USD,
                            fiatValue: body.amount,
                            satoshiValue: utils.calculate_satoshis(response.exchangeRate.USD.rate, body.amount)
                        }
                    },
                    method: "POST",
                    version: self.version,
                    headers: {
                        "x-customer-id": self.auth.customer_id,
                        "x-customer-session-token": self.auth.token
                    }
                }

                request.create(options, function(err, response){
                    if(err)
                        return fn(err);
                    else if(!_.isUndefined(response) && response.statusCode != 200){ console.log(response.body.response.errors);
                        return fn(new Error(["Received", response.statusCode, "when attempting to send!"].join(" ")));
                    }
                    else
                        return fn(null, _.omit(response.body.response, "status"));
                });
            });
        }
        else
            return fn(new Error("Insufficient parameters provided!"));
    },

    request: function(body, fn){
        if(_.has(body, "email") && _.has(body, "amount")){
            var self = this;
            this.get_account(function(err, response){
                if(err)
                    return fn(new Error("Could not fetch current exchange rate!"));

                var options = {
                    uri: ["", "api", self.api_version, "customers", self.auth.customer_id, "accounts", self.auth.account_id, "transactions", "request"].join("/"),
                    body: {
                        activityMethod: "email",
                        email: body.email,
                        currency: {
                            baseCode: "USD",
                            fiatValue: body.amount,
                            satoshiValue: Math.ceil(utils.calculate_satoshis(response.exchangeRate.USD.rate, body.amount))
                        },
                        exchangeRate: response.exchangeRate.USD,
                        message: body.message || ""
                    },
                    method: "POST",
                    version: self.version,
                    headers: {
                        "x-customer-id": self.auth.customer_id,
                        "x-customer-session-token": self.auth.token
                    }
                }

                request.create(options, function(err, response){
                    if(err)
                        return fn(err);
                    else if(!_.isUndefined(response) && response.statusCode != 200){
                        console.log(response.body);
                        return fn(new Error(["Received", response.statusCode, "when attempting to request!"].join(" ")));
                    }
                    else
                        return fn(null, _.omit(response.body.response, "status"));
                });
            });
        }
        else
            return fn(new Error("Insufficient parameters provided!"));
    }

}
