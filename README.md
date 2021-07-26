# THE BIRTHDAY CROWDFUNDER

Based off the design of kickstarter, this repository was designed to keep gifts more relevant and limited. Instead of multiple unrelated gifts, people choosing to spend money on something special could pledge it for the same item.

## Requirements
- docker-compose
- nodejs
- npm

## Usage

1. Create a sandbox account from this [link](https://developer.paypal.com/developer/accounts/create).
2. Open a file called 'paypal_cred.json' and save the client ID and secret of your **Business Sandbox account**  in the following format:
```
{
    "client_id": "XXXXXXXXXXXXXXX",
    "client_secret": "XXXXXXXXXXXXXXX"
}
```
3. Open a terminal and launch the app using:
```
docker-compose up
```
4. Navigate to [localhost:3000](http://localhost:3000) in your browser.
5. While signing into your Paypal account to make the test payment, use your **Personal Sandbox account** credentials.

### TODO
- Cleanup app.js
- Implement option for checkout and cancel payment
- Alter the style of form.ejs, success.ejs and err.ejs to be similar to index.ejs
- Test with live account 
- Launch app on Heroku