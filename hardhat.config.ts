import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import '@typechain/hardhat'
import "@nomicfoundation/hardhat-foundry";
import "@nomicfoundation/hardhat-verify";
import "./task/deploy";
import * as fs from 'fs';
import * as dotenv from 'dotenv'
dotenv.config()

const mnemonicFileName = process.env.MNEMONIC_FILE ?? `${process.env.HOME}/.secret/testnet-mnemonic.txt`
let mnemonic = 'test '.repeat(11) + 'junk'
if (fs.existsSync(mnemonicFileName)) { mnemonic = fs.readFileSync(mnemonicFileName, 'ascii') }

function getNetwork1 (url: string): { url: string, accounts: { mnemonic: string } | string[] } {
  return {
    url,
    accounts: getAccounts()
  }
}

function getNetwork (name: string): { url: string, accounts: { mnemonic: string } | string[] } {
  return getNetwork1(`https://${name}.infura.io/v3/${process.env.INFURA_ID}`)
}

function getAccounts (): string[] | { mnemonic: string} {
  const accs = []
  if (process.env.DEPLOYER_PRIVATE_KEY !== undefined) {
    accs.push(process.env.DEPLOYER_PRIVATE_KEY)
  }
  if (process.env.PAYMASTER_OWNER_PRIVATE_KEY !== undefined) {
    accs.push(process.env.PAYMASTER_OWNER_PRIVATE_KEY)
  }
  if (accs.length === 0) {
    return { mnemonic }
  } else {
    return accs
  }
}

const config: HardhatUserConfig = {
  solidity: {
    version : "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000000,
      },
      viaIR : true,
    },
  },
  networks: {
    localhost: getNetwork1("http://127.0.0.1:8545"),
    mainnet: getNetwork('mainnet'),
    goerli: getNetwork('goerli'),
    sepolia: getNetwork('sepolia'),
    polygon: getNetwork('polygon-mainnet'),
    mumbai: getNetwork('polygon-mumbai'),
  },
  etherscan: {
    apiKey: "7G93WRBNWMMW5V4UD1CAGJ49WVAY5X6SAV"
  }
};

export default config;
