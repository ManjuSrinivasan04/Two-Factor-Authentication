const Express = require("express");
const BodyParser = require("body-parser");
const Speakeasy = require("speakeasy");

let app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

//PORT
app.listen(3000, () => {
    console.log("Listening at :3000...");
});

//Time based one time password-generate secret code

app.post("/totp-secret", (request, response, next) => {
    let secret = Speakeasy.generateSecret({ length: 20 });  //length is 20
    response.send({ "secret": secret.base32 });
});

//generating token 

app.post("/totp-generate", (request, response, next) => {
    response.send({
        "token": Speakeasy.totp({
            secret: request.body.secret,
            encoding: "base32"
        }),//gives 6 digit code 
        "remaining": (30 - Math.floor((new Date()).getTime() / 1000.0 % 30))  //shows remaining [26 seconds] the valid timing 
    });
});

// validation of totp with secret and token only within the remaining seconds
//returns true or false

app.post("/totp-validate", (request, response, next) => {
    response.send({
        "valid": Speakeasy.totp.verify({
            secret: request.body.secret,
            encoding: "base32",
            token: request.body.token,
            window: 0
        })
    });
});