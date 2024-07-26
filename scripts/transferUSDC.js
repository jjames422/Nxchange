const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the sender user ID: ', (fromUserId) => {
  rl.question('Enter the receiver user ID: ', (toUserId) => {
    rl.question('Enter the amount of USDC to transfer: ', async (amount) => {
      const body = {
        fromUserId: parseInt(fromUserId),
        toUserId: parseInt(toUserId),
        amount: parseFloat(amount),
        network: 'ethereum',
        symbol: 'USDC'
      };

      try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('http://localhost:3000/api/wallet/transfer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log('Transfer response:', data);
      } catch (error) {
        console.error('Error performing transfer:', error);
      } finally {
        rl.close();
      }
    });
  });
});
