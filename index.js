require('dotenv').config;
const ccxt = require('ccxt'); // crypto trading library
const axios = require('axios');

const tick = async() => {
    const { asset, base, spread, allocation } = config;
    const market = `${asset}/${base}`;

    //maybe the market has moved so we may need to adjust
    const orders = await binanceClient.fetchOpenOrders(market);
    orders.forEach(async order => {
        await binanceClient.cancleOrder(order.id);
    });
//array. Use CoinGecko to get the marketcap and price of cryptos
    const results = await Promise.all([
        axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'), //bitcoin vs usd market
        axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd') //tether vs usd market
    ]);

    const marketPrice = result[0].data.bitcoin.usd / result[1].data.tether.usd; // divide one by the other

    const sellPrice = marketPrice * (1 + spread);
    const buyPrice = marketPrice * (1 - spread);
    const balances = await binanceClient.fetchBalance();
    const assetBalance = balances.free[assest];
    const baseBalance = balances.free[base];
    const sellVolume = assetBalance * allocation;
    const buyVolume = (baseBalance * allocation) / marketPrice;

    await binanceClient.createLimitSellOrder(market, sellVolume, sellPrice);
    await binanceClient.createLimitBuyOrder(market, buyVolume, buyPrice);
    
    console.log(`
    New tick for ${market}...
    Created limit sell order for ${sellVolume}@${sellPrice}
    Created limit buy order for ${buyVolume}@${buyPrice}
    `);
}

const run = () => {
    const config = {
        asset: 'BTC',
        base: 'USDT',
        allocation: 0.1, //how much of the potfollio per trade
        spread: 0.2, // midrate - create buy or sell limit order
        tickInterval: 2000 // 2 seconds, 
    };

    const binanceClient = new ccxt.binance({
        apiKey: process.env.API_ENV, //stored elsewhere
        secret: process.env.API_SECRET
    });

    tick(config, binanceClient);
    setInterval(tick, config.tickInterval, config, binanceClient);
};

run();

// run on a server like huroku 24/7 instead of computer. When the price changes we need to quickly cancel our buy and sell orders and create new ones. Otherwise someone will hit them at a bad time and we will lose money. 