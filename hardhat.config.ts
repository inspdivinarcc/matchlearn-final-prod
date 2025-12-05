import { config as dotenv } from 'dotenv'; dotenv();
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: '0.8.23',
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_RPC_URL!,
      accounts: [process.env.WALLET_PRIVATE_KEY!]
    }
  }
};
export default config;
