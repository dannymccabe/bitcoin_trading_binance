# bitcoin_trading_binance
A simple bot using the binance API

Using the Binance API to create buy and sell limit orders on demand. Highly commented throughout. 

Using API from https://www.coingecko.com/en/api/documentation? to compare prices and get the market average. 
Feel free to use this code for your own project but know the risks. Comments at the bottom of the index.js file state:

'When the price changes we need to quickly cancel our buy and sell orders and create new ones. Otherwise someone will hit them at a bad time and we will lose money.'
