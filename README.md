A small PoC to fluidify Community Solid Server Sign up process.

![image](https://user-images.githubusercontent.com/60817856/140051238-3b85d0ba-ff9a-4c37-830a-733cbaaa16ba.png)


When signing up with an external WebID, CSS ask the user to add a triple with a token to they WebID, to prove the ownership of their WebID .  This small script does this operation for the user, to give them a more fluid user experience.

based on:
https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/getting-started-part2/


### install 
```
npm install
```

### usage
To the full PoC, with a web interface:
```
npm run start
```
The website should run on `http://localhost:8008` by default
