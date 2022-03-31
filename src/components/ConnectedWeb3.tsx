/*
 * @Author: HuangBoWen
 * @Date: 2022-03-24 22:45:06
 * @LastEditTime: 2022-03-31 18:40:53
 * @LastEditors: HuangBoWen
 * @Description:
 */
import React, { useState, useEffect } from 'react'

import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import Portis from '@portis/web3'
import styled from 'styled-components'

import syntheticNft from '../abi/synthetic-nft.json'

import { ButtonBaseCss, ButtonProps } from '../components/common/ButtonBase'
import { formatAddress } from '../utils/tools'

const providerOptions = {
  portis: {
    package: Portis, // required
    options: {
      id: '8e23465f-c9a7-410a-92df-18b2e3d1c38f',
      network: 'maticMumbai',
    },
  },
}

const ConnectedWeb3Context = React.createContext<any>(null)

/**
 * This hook can only be used by components under the `ConnectedWeb3` component. Otherwise it will throw.
 */
export const useWeb3Context = () => {
  const context = React.useContext(ConnectedWeb3Context)

  if (!context) {
    throw new Error('Component rendered outside the provider tree')
  }

  return context
}

interface Props {
  children?: React.ReactNode
}
export const ConnectedWeb3: React.FC<Props> = (props: Props) => {

  const [web3ModelInstance, setWeb3ModelInstance] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [web3Model, setWeb3Model] = useState<any>({
    address: undefined,
    provider: undefined,
    signer: undefined,
    instance: undefined,
    contract: undefined
  })

  const { address, provider, signer, instance, contract } = web3Model

  useEffect(() => {
    setWeb3ModelInstance(
      new Web3Modal({
        network: 'rinkeby',
        cacheProvider: true,
        providerOptions,
      }),
    )    
  }, [])

  useEffect(() => {
    const currentConnectorName = localStorage.getItem('CONNECTOR')
    if(currentConnectorName) connectWallet()
  },[web3ModelInstance])

  const disconnectWallet = async () => {
    setWeb3Model({
      provider: undefined,
      signer: undefined,
      instance: undefined,
      contract: undefined,
      address: undefined,
    })
    await web3ModelInstance.clearCachedProvider()
  }

  const connectWallet = async () => {
    setLoading(true)
    const connectObj = { ...web3Model }
    if (!connectObj.instance) {

      connectObj.instance = await web3ModelInstance.connect()

      connectObj.provider = new ethers.providers.Web3Provider(connectObj.instance)

      connectObj.signer = connectObj.provider.getSigner()

      connectObj.contract = new ethers.Contract(
        // '0xf02dec16c21cc25cd033e9cf066c5ffcdab37beb',
        '0x6305348eed237ac2a24668e085c388e8794ece20',
        syntheticNft.abi,
        connectObj.provider,
      )

      connectObj.address = await connectObj.signer.getAddress()
      
    }

    try {
      connectObj.instance.on('accountsChanged', async (accounts: any) => {
        if (accounts.length === 0) {
          await disconnectWallet()
          connectObj.address = null
        } else {
          connectObj.address = accounts[0]
        }
      })
    } catch (err) {
      await disconnectWallet()
      connectObj.address = null
    }

    // 自动连接钱包
    localStorage.setItem('CONNECTOR', 'MetaMask')

    setLoading(false)
    setWeb3Model(connectObj)
  }

  const value = {
    account: address,
    provider,
    signer,
    web3Instance: instance,
    contract,
    loading,
    connectWallet,
    disconnectWallet,
  }

  return <ConnectedWeb3Context.Provider value={value}>{props.children}</ConnectedWeb3Context.Provider>
}
