/*
 * @Author: HuangBoWen
 * @Date: 2022-03-23 10:01:58
 * @LastEditors: HuangBoWen
 * @LastEditTime: 2022-04-02 10:48:37
 * @Description:
 */
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import log from 'loglevel'

log.info({ env: process.env.NODE_ENV })

// TODO: 上生产接主网后改正
export const isProd = false // process.env.NODE_ENV === 'production'
export const logIsProd = process.env.NODE_ENV === 'production'

export const network = isProd ? 'mainnet' : 'rinkeby'
export const contractAddress = '0xc30306aefe81ea26ad9b839941516efdb62b9c97' // 老合约
// '0xf02dec16c21cc25cd033e9cf066c5ffcdab37beb', // bsc testnet
// '0x6305348eed237ac2a24668e085c388e8794ece20', // eth rinkeby

// explore 数据源
export const collection = isProd ? 'azuki-god' : 'azuki-god'

export function lamportsToSol(lamportsAmount: number) {
  return lamportsAmount / LAMPORTS_PER_SOL
}

export function solToLamports(solAmount: number) {
  return solAmount * LAMPORTS_PER_SOL
}
