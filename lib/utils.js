var notp = require("notp");

module.exports = {

    parse_json: function(body){
        try{
            return JSON.parse(body);
        }
        catch(e){
            return;
        }
    },

    calculate_satoshis: function(rate, amount){
        return (100000000 / rate) * amount;
    },

    get_mfa_token: function(mfa_secret){
        return notp.totp.gen(mfa_secret);
    }

}
