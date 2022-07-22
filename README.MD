# Requirements

- Node v16+

# Getting Started

Before starting open two terminal screens at the project root if you wish to run the client beside the API service, or just one to run the Expess API solo.

## Clone dotenv => .env

Prior to running, you need to setup the environment files for both client and server. You can copy the defaults by running the following command from the project root, however you will need to provide any non-asterisked values noted below:

`cp server/dotenv server/.env && cp client/dotenv client/.env`

**For The Client -- You Will Need:**
- An AliceNet RPC Endpoint*
- The Faucet API location*

**For The Server -- You Will Need:**

- Private key that has ETH and Ownership on the provided ETH_RPC ( Owner.toml's PrivK )
- Port Number API should run on*
- Ethereum RPC Endpoint*
- The Factory Contract Address*
  
###### * Signifies a default dev environment variable provided in dotenv
## Starting The API

1. From project root in one screen run the following: 
   - `cd server && npm i && node index.js`

#### Available API Endpoints

- **GET** `/` - Health Check
- **GET** `/faucet` - Faucet Endpoint Helper Catch
- **GET** `/faucet/:address` - Request funds to :address

## Starting The Client ( Optional )

1. From project root run the following: 
   - `cd client && npm i && npm start`