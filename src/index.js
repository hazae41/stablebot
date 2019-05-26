// Automatic bot for stablecoins market on Binance
// Copyright hazae41 https://www.patreon.com/hazae41

// ----- OPTIONS -----
const first = "TUSD";
const second = "USDT";
// -------------------

// Market symbol
const symbol = first + second;
// API key
const apiKey = process.env.API;
// Secret key
const apiSecret = process.env.KEY;

// Import Binance
const { default: Binance } = require("binance-api-node");

// Use API keys to connect to Binance
const client = Binance({ apiKey, apiSecret });

// Floor to x decimals
const toFixed = (num, fixed) => {
  const power = Math.pow(10, fixed || 0);
  return Math.floor(num * power) / power;
};

// Active wait promisifier
const watch = filter =>
  new Promise(callback => {
    const interval = setInterval(async () => {
      if (!(await filter())) return;
      clearInterval(interval);
      callback();
    }, 1000);
  });

// Wait for the given order to be filled
const watchFill = orderId =>
  watch(async () => {
    const args = { symbol, orderId };
    const { status } = await client.getOrder(args);
    return status === "FILLED";
  });

// Retrieve balances of given assets
const balances = async (...assets) => {
  const { balances } = await client.accountInfo();
  return assets.map(asset => {
    const { free } = balances.find(it => it.asset === asset);
    return Number(free);
  });
};

// Retrieve daily stats for low and high prices
const stats = async () => {
  const { highPrice, lowPrice } = await client.dailyStats({ symbol });
  const high = Number(highPrice);
  const low = Number(lowPrice);
  return { high, low };
};

const cancelOrders = async () => {
  const orders = await client.openOrders({ symbol });
  orders.forEach(order => {
    const { orderId } = order;
    client.cancelOrder(symbol, orderId);
  });
};

// Create a new order
const order = async (side, _quantity, _price) => {
  const quantity = toFixed(_quantity, 2);
  const price = _price.toFixed(4);

  console.log(`Ordering ${side} of ${quantity} ${first} at ${price}...`);

  const args = { symbol, side, quantity, price };
  const { orderId } = await client.order(args);

  console.log(`Waiting for the order to be filled...`);
  await watchFill(orderId);
  console.log(`${side} filled!`);
};

// Use this to start buying
const buy = async () => {
  // Get second asset balance
  const [balance] = await balances(second);

  // Choose a low buy price
  const price = (await stats()).low;

  // Order a buy with balance amount
  await order("buy", balance * price, price);

  // Start selling
  await sell();
};

// Use this to start selling
const sell = async () => {
  // Get first asset balance
  const [balance] = await balances(first);

  // Choose a high sell price
  const price = (await stats()).high;

  // Order a sell with balance amount
  await order("sell", balance, price);

  // Start buying
  await buy();
};

(async () => {
  try {
    console.log("Enjoy :)");

    // Cancel all open orders
    await cancelOrders();

    // Retrieve both assets balances
    const [bfirst, bsecond] = await balances(first, second);

    // Choose whether it should start buying or selling
    bfirst > bsecond ? await sell() : await buy();
  } catch (err) {
    console.error(err.message);
  }
})();
