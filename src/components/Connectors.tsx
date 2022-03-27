/*
 * @Author: HuangBoWen
 * @Date: 2022-03-24 22:45:06
 * @LastEditTime: 2022-03-27 21:05:12
 * @LastEditors: HuangBoWen
 * @Description:
 */
import React, { useState } from 'react'

import { useWeb3React } from '@web3-react/core'
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

let web3ModelInstance: any
if (typeof window !== 'undefined') {
  web3ModelInstance = new Web3Modal({
    network: 'rinkeby',
    cacheProvider: true,
    providerOptions,
  })
}

let provider: any
let signer: any
let instance: any
let contract: any

export async function connectWallet() {
  if (!instance) {
    instance = await web3ModelInstance.connect()
    // https://docs.ethers.io/v5/api/providers/
    provider = new ethers.providers.Web3Provider(instance)
    // https://docs.ethers.io/v5/api/signer/
    signer = provider.getSigner()
    contract = new ethers.Contract(
      '0x720850d3e49a96d51168680f31ff35108f67ef69',
      syntheticNft.abi,
      provider,
    )
  }

  return { provider, signer, web3Instance: instance, contract }
}

async function disconnectWallet() {
  provider = undefined
  signer = undefined
  instance = undefined
  contract = undefined
  await web3ModelInstance.clearCachedProvider()
}

export default function Connectors() {
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState(null)

  const { active, account, library, connector, activate, deactivate } = useWeb3React()

  if (address && !loading) {
    return (
      <ButtonConnect
        onClick={async () => {
          await disconnectWallet()
          setAddress(null)
        }}
      >
        {formatAddress(address)}
      </ButtonConnect>
    )
  }

  return (
    <ButtonConnect
      onClick={async () => {
        setLoading(true)
        try {
          const { provider, signer, web3Instance } = await connectWallet()
          const address = await signer.getAddress()
          // const ens = await provider.lookupAddress(address)
          setAddress(address)
          web3Instance.on('accountsChanged', async (accounts: any) => {
            if (accounts.length === 0) {
              await disconnectWallet()
              setAddress(null)
            } else {
              const address = accounts[0]
              // const ens = await provider.lookupAddress(address)
              setAddress(address)
            }
          })
        } catch (err) {
          await disconnectWallet()
          setAddress(null)
        }
        setLoading(false)
      }}
    >
      {loading ? 'Connecting...' : 'Connect Wallet'}
    </ButtonConnect>
  )
}

const ButtonConnect = styled.div`
  // 重置solana按钮默认样式 - start
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  &:hover {
    background: #3dd606 !important;
  }
  // 重置solana按钮默认样式 - end

  ${ButtonBaseCss}
  width: 204px;
  background: #3dd606 !important;
`
