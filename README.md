![](https://i.imgur.com/KPR5fJT.jpg)

https://codesandbox.io/s/github/hazae41/stablebot

#### What is the project about?
This project is about a nodejs bot for trading stablecoins on Binance. 💰

#### How it works
Using a given anchor price and a given range, it automatically make buy and sell orders to make profit on USD stablecoin/stablecoin markets. At start, it automatically choose between buy and sell depending on your balance.

#### Use cases
For example, the most useful case is for the TUSD/USDT market. Using an anchor price of 1.0000 and a range of 0.0005, the bot will buy at 0.9995 and sell at 1.0005 to make profit. 

#### Security
This bot is secure because it is open-source and hosted on codesandbox. 
Everything done by the bot is transparent, and logged in the console.
The code is commented for you to understand every action.
Plus, Binance API keys are stored in the environment variables of the sandbox, which are private and secure.

#### Installation
Installation is very easy, you just have to fork it and put your API keys in the environment variables.
If you want, you can download the code and run it on your nodejs machine for trading all day long.

#### Technology Stack
It uses nodejs for running itself, binance-api-node module for interacting with Binance, and codesandbox for the security layer and an easy installation.

#### Roadmap
I plan on making a GUI using React and Next.js for modifying options and viewing the console. 

#### How to contribute?
You can fork it on GitHub and on codesandbox 😎
You can become my patron https://www.patreon.com/hazae41
