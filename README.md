#Pinkman

##Installation
Install npm: https://www.npmjs.com/package/npm

In config/:
* Create config.json according to the example.
Find fb_page_access_token under Products -> Messenger -> Token Generation in the settings of your app on https://developers.facebook.com/
Set fb_verify_token under Products -> Webhooks -> callback URL -> Edit
* Create firebase_config.json according to the [Firebase docs](https://firebase.google.com/docs/server/setup#prerequisites).

```
$ npm install
```


## Starting
```
$ npm start
```