const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3333;
console.log(port);