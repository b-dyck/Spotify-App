# Spotify-App

This is a Spotify Companion app with a Related Artists game built in. The game is similar to the Six Degrees of Kevin Bacon parlour game in that the point is to connect two artists who are not directly related by jumping between their related artists on spotify. Following the basic Spotify Tutorial from Newline and adding my own game implementation has taught me basic React and Express skills, gave me some initial exposure to styled components and the OAuth flow, as well as deploying a webpage via heroku. 

## Local Installation & Set Up

1. Register a Spotify App in your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) and add `http://localhost:8888/callback` as a Redirect URI in the app settings

2. Create a `.env` file at the root of the project based on `.env.example` and add your unique `CLIENT_ID` and `CLIENT_SECRET` from the Spotify dashboard

3. Ensure [nvm](https://github.com/nvm-sh/nvm) and [npm](https://www.npmjs.com/) are installed globally

4. Install the correct version of Node

    ```shell
    nvm install
    ```

5. Install dependencies

    ```shell
    npm install
    ```

6. Run the React app on <http://localhost:3000> and the Node server on <http://localhost:8888>

    ```shell
    npm start
    ```

