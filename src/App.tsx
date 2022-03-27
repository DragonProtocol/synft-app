/*
 * @Author: your name
 * @Date: 2022-03-23 10:01:58
 * @LastEditTime: 2022-03-27 10:38:53
 * @LastEditors: HuangBoWen
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /synft-app/src/App.tsx
 */
import React, { FC, useEffect, useMemo, useState } from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'

// import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
// import {
//   ConnectionProvider,
//   useConnection,
//   useWallet,
//   WalletContextState,
//   WalletProvider,
// } from '@solana/wallet-adapter-react'
// import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
// import {
//   LedgerWalletAdapter,
//   PhantomWalletAdapter,
//   SlopeWalletAdapter,
//   SolflareWalletAdapter,
//   SolletExtensionWalletAdapter,
//   SolletWalletAdapter,
//   TorusWalletAdapter,
// } from '@solana/wallet-adapter-wallets'

// import { clusterApiUrl } from '@solana/web3.js'
import { Provider } from 'react-redux'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import log from 'loglevel'

import ContractProvider, { useContract } from './provider/ContractProvider'
import GlobalStyle from './GlobalStyle'
import Layout from './components/Layout'

import { isProd, logIsProd } from './utils'
import { store } from './store/store'

log.setLevel(logIsProd ? 'warn' : 'trace')

const getLibrary = (provider: any) => {
  // special monkey patch for special abey wallet
  // if (provider.chainId === chainIds.abey.toString()) {
  //   provider.chainId = 0xb3
  // }
  // eslint-disable-next-line no-console
  // console.info({ provider, connector })
  const library = new ethers.providers.Web3Provider(provider)
  const POLLING_INTERVAL = 12000
  library.pollingInterval = POLLING_INTERVAL
  return library
}

function AppLayout() {
  // const wallet: WalletContextState = useWallet()
  const { contract } = useContract()

  // useEffect(() => {
  //   contract.setWallet(wallet)
  // }, [wallet])

  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  )
}
// const network = isProd ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet

const App: FC = () => (
  <Web3ReactProvider getLibrary={getLibrary}>
    <Provider store={store}>
      <ContractProvider>
        <GlobalStyle />
        <AppLayout />
      </ContractProvider>
    </Provider>
  </Web3ReactProvider>
)

export default App
