// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "YOUR_KEY",
    authDomain: "YOUR_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const express = require('express');
const app     = express();
const cors    = require("cors");

app.use(express.json());
app.use(express.static(__dirname + '/static'));
app.use(cors({ origin: '*' }));

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(
    `Express started at \"http://localhost:${port}\"\n` +
    `press Ctrl-C to terminate.`)
);