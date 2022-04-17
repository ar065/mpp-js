# MPP.JS
### Example Usage:
```js
import Client from "@wolfy01/mpp-js";

const client = new Client({
    token: "<YOUR_BOT_TOKEN>"
});

client.setChannel(decodeURI("✧𝓓𝓔𝓥%20𝓡𝓸𝓸𝓶✧"));
client.start();

client.on("hi", msg => {
    console.log(msg);
});

client.on("a", msg => {
    console.log(msg);
});
```

# Contributing is welcome!
### Please make a pullrequest to contribute to this project.
### If anyone is willing to work on the documentation for this, it would be greatly appreciated.