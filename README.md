# Justifier service (Node.js)

Takes a text, and then converts it to text with 80 chars maximum per line.

#### Usage
1. Create a user at `/api/create-user`
Body example:
```
{
	"email": "foo@bar.com",
	"password": "qwertyisnotsafestpasswordintheworld"
}
```
You will have a return from server like:
```
{
  "email": "foo@bar.com",
  "wordsQuota": 80000
}
```
Where is `email` - is your email
and `wordsQuota` - your words quota on this service


2. Get a token
   
This service using JWT sessions
Before using the justifier you have to request a token here `/api/token`. 
Body example:
```
{
	"email": "foo@bar.com",
	"password": "qwertyisnotsafestpasswordintheworld"
}
```
Example of response:
```
{
  "token": "eyJ0eXAi324.eyJpZCI6IkdwZFFQ3232CI6ImZvb0BiYXIuY29tbSIsImRhd32joxNjAzODQ0MDg13232wODU5NjgsImV4cGlyZXMiOjE2MDM4NDQ5ODU5Njh9.WHge090P-Am8OEArn8gnw5KBV_O0se71nhh_13moUmuorqUt6eQYBjLxy-tsDYx9323",
  "issued": 1603844085968,
  "expires": 1603844985968
}
```


3. Justify your text
Now we are ready to use the Justifier.

To form a request, set headers to:
```
Content-Type: text/plain
X-JWT-Token: yourtokenvaluefromthelaststep
```
Body example: 
```
"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
```

In response you will find the text in justified form
```
{
  "status": "success",
  "timestamp": 1603844128099,
  "text": "\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor\nincididunt  ut  labore  et  dolore  magna  aliqua. Ut enim ad minim veniam, quis\nnostrud  exercitation  ullamco  laboris nisi ut aliquip ex ea commodo consequat.\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu\nfugiat  nulla  pariatur. Excepteur sint occaecat cupidatat non proident, sunt in\n",
  "wordsQuota": 79611
}
```


After each usage your `wordsQuota` change.

If you will send a request to justify text and you dont have enough quota, then server will respond in this manner:
```
{
  "error": "You have to pay. Words to process: 5171, quota: 5029"
}
```



#### Pre-run instruction
Add your secret key to `.env` file or have it in-memory

You could find key names to use in `.env.example`



#### Run in development mode
```
npm run dev
```

#### Run in production mode
```
npm run build
npm run start
```



#### Insomnia
Also you could find insomnia file in this repo to test API from Insomnia client
