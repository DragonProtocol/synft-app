/*
 * @Author: HuangBoWen
 * @Date: 2022-03-23 10:01:58
 * @LastEditors: HuangBoWen
 * @LastEditTime: 2022-03-29 21:34:36
 * @Description: 
 */
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Link } from 'react-router-dom'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect } from 'react'
import { useState } from 'react'

export default function Nav() {
  const { connection } = useConnection()
  // const wallet = useWallet()
  // const [balance, setBalance] = useState(0)
  // useEffect(() => {
  //   if (!wallet.publicKey) return
  //   ;(async (publicKey) => {
  //     const _balance = await connection.getBalance(publicKey)
  //     setBalance(_balance)
  //   })(wallet.publicKey)
  // }, [wallet])

  return (
    <div style={{ display: 'flex' }}>
      <Link style={{ display: 'block', margin: '1rem 0' }} to={`/`}>
        SYNFT
      </Link>
      {/* <span>{balance}</span>
      <WalletMultiButton />
      <WalletDisconnectButton /> */}
    </div>
  )
}
