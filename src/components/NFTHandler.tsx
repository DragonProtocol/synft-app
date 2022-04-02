import React, { useEffect, useState, useCallback, useRef, createRef } from 'react'
// import { Alert, Snackbar } from '@mui/material'

import { useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { useNavigate } from 'react-router-dom'

import { clearMyNFT } from '../features/my/mySlice'
import LoadingIcon from '../components/imgs/Loading.gif'

import NftInject, { Token } from './nft_handlers/NftInject'
import { MOBILE_BREAK_POINT } from '../utils/constants'
import { getBytes32,formatBigNumber } from '../utils/tools'
import { useWeb3Context } from './ConnectedWeb3'

import log from 'loglevel'
interface Props {
  info: any
}

const NFTHandler: React.FC<Props> = (props: Props) => {
  const { info } = props

  const injectRef = useRef<{ resetSelect: Function }>()
  // const [open,setOpen] = useState(false)
  const { account, signer, contract } = useWeb3Context()
  const navigate = useNavigate()

  const owner = info?.owner?.address
  const showBelongToMe = owner.toUpperCase() === account.toUpperCase()
  const showViewOnly = info.hasCopied
  const showCopy = !showBelongToMe && !showViewOnly

  function reloadWindow() {
    window.location.reload()
  }
  // 执行销毁 让出坑位
  const onBurn = async () => {
    try {
      const contractWithSigner = contract.connect(signer)

      const tx = await contractWithSigner.refund(
        info.token_id, // copy NFT的 tokenid
      )
      const response = await tx.wait()
      // console.log(response, 'response')
      navigate(`/`)
    } catch (err) {
      console.log(err, 'err')
    }
  }

  // copy 并注入至少 0.1 eth
  const onCopyWithInject = async (token:Token) => {
    try {
      const contractWithSigner = contract.connect(signer)
      const address = await signer.getAddress()
      const value = ethers.utils.parseEther(token.volume || '0.1')

      const tx = await contractWithSigner.mint(
        address, // address to 合成NFT的接收人
        info.asset_contract.address, // address contractAddr 原始NFT的合约地址
        info.token_id, // tokenId 原始NFT的tokenid
        {
          value,
        },
      )
      const response = await tx.wait()

      // 获取 copy 后的 token id 用以跳转新的链接
      const bytes32 = getBytes32(info.asset_contract.address,info.token_id)
      const hexId = await contract._uniques(bytes32)
      const tokenId = formatBigNumber(hexId,0,0)

      const { to:contractAddress } = response
      navigate(`/info/${contractAddress}/${tokenId}`)
      reloadWindow()

      //TODO 成功/失败提示的 ui 可以用一个统一的

    } catch (err) {
      console.log(err, 'err')
    }
  }

  return (
    (!account && <div>Connect wallet first</div>) || (
      <NFTHandlerWrapper>
        <div className="top">
          <div className="nft-title">{info.name}</div>
          <div className="nft-creator">
            <span className="creator-label">creator</span>
            <span className="creator-value">{owner}</span>
          </div>
          <div className="dividing-line"></div>
        </div>
        {/* {belongLoading || hasInjectLoading ? (
          <p>
            <img src={LoadingIcon} alt="" />
          </p>
        ) : ( */}
        <>
          {showViewOnly && (
            <div className="only-view">
              <span className="expression">😯</span> <span className="description">This NFT has been synthesized</span>
            </div>
          )}
          {showBelongToMe && <NftInject withCopyInit={false} onBurn={onBurn} ref={injectRef}></NftInject>}
          {showCopy && <NftInject withCopyInit={true} onCopyWithInject={onCopyWithInject}></NftInject>}
        </>
        {/* )} */}
      </NFTHandlerWrapper>
    )
  )
}
export default NFTHandler

const NFTHandlerWrapper = styled.div`
  width: 100%;
  .top {
    text-transform: uppercase;
    .nft-title {
      font-size: 30px;
      color: #222222;
      @media (max-width: ${MOBILE_BREAK_POINT}px) {
        font-size: 20px;
      }
    }
    .nft-creator {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      font-size: 16px;
      @media (max-width: ${MOBILE_BREAK_POINT}px) {
        font-size: 14px;
      }
      .creator-label {
        color: rgba(34, 34, 34, 0.5);
      }
      .creator-value {
        color: #222222;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        @media (max-width: ${MOBILE_BREAK_POINT}px) {
          font-size: 12px;
        }
      }
    }
    .dividing-line {
      width: 40px;
      height: 4px;
      background: #222222;
      margin: 40px 0;
      @media (max-width: ${MOBILE_BREAK_POINT}px) {
        margin: 20px 0;
      }
    }
  }
  .only-view {
    width: 100%;
    height: 308px;
    background: #ffffff;
    border: 2px solid #222222;
    box-sizing: border-box;
    box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    text-transform: uppercase;
    color: rgba(34, 34, 34, 0.5);
    @media (max-width: ${MOBILE_BREAK_POINT}px) {
      height: auto;
      padding: 20px 8px;
    }
    .expression {
      font-size: 40px;
    }
    .description {
      font-size: 18px;
      text-align: center;
      line-height: 24px;
    }
  }
`
