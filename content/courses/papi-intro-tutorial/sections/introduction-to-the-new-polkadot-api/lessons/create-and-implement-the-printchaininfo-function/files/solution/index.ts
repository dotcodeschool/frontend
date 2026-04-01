import process from "node:process";

import { createClient, type PolkadotClient } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider/web";

function makeClient(endpoint: string): PolkadotClient {
  console.log(`Connecting to endpoint: ${endpoint}`);
  const provider = getWsProvider(endpoint);
  const client = createClient(provider);
  return client;
}

async function printChainInfo(client: PolkadotClient) {
  // **IMPORTANT NOTE:** This method is used in this tutorial, but it should not be used in production apps.
  const chain = await client.getChainSpecData();
  const finalizedBlock = await client.getFinalizedBlock();
  console.log(
    `Connected to ${chain.name} at block ${finalizedBlock.number}.\n`,
  );
}

async function main() {
  const polkadotClient = makeClient("wss://rpc.polkadot.io");
  await printChainInfo(polkadotClient);

  console.log(`Done!`);
  process.exit(0);
}

main();
