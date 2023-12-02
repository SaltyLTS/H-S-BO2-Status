# H-S-BO2-Status

## Introduction
This Discord bot provides servers status updates for Honte-Servers BO2 services. It uses Discord.js and ping to check the status of specified hosts and displays the information in a Discord channel.

## Features
- Auto-updates system status in a Discord channel every 3 minutes.
- Provides status information for servers, using plutools api by mxve.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/SaltyLTS/H-S-BO2-Status.git
   cd H-S-BO2-Status

Install dependencies:
npm install

Create a .env file in the project root and add your Discord bot token:
TOKEN=your-bot-token

To launch the bot:
node index.js

Configuration:
Edit the servers keys to include the servers you want to monitor.
Replace channelId with the ID of your Discord channel.

Dependencies:
Discord.js
axios
dotenv

License:
This project is licensed under the MIT License.

Contributing:
Feel free to contribute by opening issues or pull requests.