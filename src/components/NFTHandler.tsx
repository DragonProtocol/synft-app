import React, { useEffect, useState, useCallback, useRef, createRef } from 'react'
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
// import { PublicKey } from '@solana/web3.js'
import { ethers } from 'ethers'
import { useNavigate } from 'react-router-dom'

import { getMyNFTokens, selectMyNFTData, selectMyNFTDataStatus } from '../features/my/mySlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearMyNFT } from '../features/my/mySlice'
import LoadingIcon from '../components/imgs/Loading.gif'

import NftInject, { InjectMode, OnInjectProps } from './nft_handlers/NftInject'
import { useBelongTo, useHasInjectV1 } from '../hooks'
import { useContract } from '../provider/ContractProvider'
import { MOBILE_BREAK_POINT } from '../utils/constants'
import { solToLamports } from '../utils'
import { MetadataData } from '@metaplex-foundation/mpl-token-metadata'
import log from 'loglevel'
import { InjectType } from '../synft'

import { connectWallet } from '../components/Connectors'

interface Props {
  // metadata: MetadataData
  metadata: any
  refreshInject?: () => void
}

const NFTHandler: React.FC<Props> = (props: Props) => {
  const { metadata, refreshInject } = props

  const injectRef = useRef<{ resetSelect: Function }>()
  const params = useParams()
  const wallet: WalletContextState = useWallet()
  const navigate = useNavigate()

  const { contract } = useContract()
  const { belong, loading: belongLoading } = useBelongTo(params.mint)
  const {
    checkLoading: hasInjectLoading,
    hasInject,
    injectData: mintMetadata,
    refresh: refreshInjectV1,
  } = useHasInjectV1(params.mint)

  const [injectType] = useState<InjectType>(InjectType.SOL)
  // 写合约交互状态。modal or toast
  const [writing, setWriting] = useState(false)

  const dispatch = useAppDispatch()
  const myNFTData = useAppSelector(selectMyNFTData)
  const myNFTDataStatus = useAppSelector(selectMyNFTDataStatus)
  // useEffect(() => {
  //   if (!wallet.publicKey) {
  //     dispatch(clearMyNFT())
  //     return
  //   }
  //   const owner = wallet.publicKey
  //   if (belong.me) dispatch(getMyNFTokens({ owner }))
  // }, [wallet, belong])

  function reloadWindow() {
    window.location.reload()
  }
  // 执行注入
  const onInject = useCallback(
    ({ injectType, injectMode, token, nft }: OnInjectProps) => {
      // ;(async () => {
      //   const mint = params.mint
      //   if (!mint) return

      //   try {
      //     setWriting(true)
      //     const reversible = injectMode === InjectMode.Reversible
      //     switch (injectType) {
      //       case InjectType.SOL:
      //         // TODO 目前固定代币输入输出的转换 500000000 = 0.5 sol , 后面要调整
      //         // const { volume } = token
      //         // const formatVolume = Number(volume) * 1000000000
      //         // await injectSol(params.mint, formatVolume, reversible, { wallet, program, connection })
      //         break
      //       case InjectType.NFT:
      //         const childMint = nft.mint || ''
      //         if (!childMint) return
      //         const mintKey = new PublicKey(mint)
      //         const childMintKey = new PublicKey(childMint)
      //         if (belong.parent) {
      //           await contract.injectNFTToNonRoot(mintKey, [childMintKey], {
      //             rootPDA: new PublicKey(belong.parent.rootPDA),
      //             parentMintKey: new PublicKey(belong.parent.mint),
      //           })
      //         } else {
      //           await contract.injectNFTToRoot(mintKey, [childMintKey])
      //         }
      //         break
      //     }
      //     setWriting(false)
      //     wallet.publicKey && dispatch(getMyNFTokens({ owner: wallet.publicKey }))
      //     injectRef.current && injectRef.current.resetSelect({ mint: '', image: '', name: '' })
      //     // refreshInject()
      //   } catch (error) {
      //     log.error(error)
      //     // 可以用来显示错误
      //     if ((error as any).code === 4001) {
      //       // 用户取消交易
      //     } else {
      //       // -32003 "Transaction creation failed."
      //     }
      //     setWriting(false)
      //   }
      // })()
    },
    [belong],
  )
  // 执行提取
  const onExtract = async () => {
    if (!params.mint) return
    // try {
    //   setWriting(true)
    //   const mintKey = new PublicKey(params.mint)
    //   switch (injectType) {
    //     case InjectType.SOL:
    //       await contract.extractSolV1(mintKey)
    //       break
    //     // case InjectType.NFT:
    //     //   await extractNFT(params.mint, { wallet, program, connection })
    //     //   break
    //   }
    //   refreshInjectV1()
    // } catch (error) {
    //   log.error(error)
    //   setWriting(false)
    // }
  }

  const onCopyWithInject = async ({ injectType, injectMode, token, nft }: OnInjectProps) => {
    try {
      const { signer, contract } = await connectWallet()
      const contractWithSigner = contract.connect(signer)
      const address = await signer.getAddress()
      const value = ethers.utils.parseEther('0.1')

      console.log(address, 'address')
      console.log(metadata.asset_contract.address, 'metadata.asset_contract.address')
      console.log(metadata.token_id, 'metadata.token_id')
      console.log(value, 'value')

      const tx = await contractWithSigner.mint(
        address, // address to 合成NFT的接收人
        metadata.asset_contract.address,// address contractAddr 原始NFT的合约地址
        metadata.token_id,// tokenId 原始NFT的tokenid
        {
          value,
        },
      )
      const response = await tx.wait()
      console.log(response, 'responseresponseresponse')
    } catch (err) {
      console.log(err, 'err')
    }

    // ---------------------------------------------------------------------------------------

    // const { name, symbol, uri } = metadata.data
    // console.log(metadata)
    // if (!params.mint) return

    // // TODO: could add UI loading status in here
    // let newMint = ''
    // const mintKey = new PublicKey(params.mint)
    // const reversible = injectMode === InjectMode.Reversible
    // switch (injectType) {
    //   case InjectType.SOL:
    //     // TODO 目前固定代币输入输出的转换 500000000 = 0.5 sol , 后面要调整
    //     const { volume } = token
    //     const lamportsVolume = solToLamports(Number(volume))
    //     newMint = await contract.copyWithInjectSOLv1(mintKey, lamportsVolume, { name, uri, symbol })
    //     break
    //   // case InjectType.Nft:
    //   //   const childMint = nft.mint || ''
    //   //   newMint = await nftCopyWithInjectNFT(
    //   //     params.mint,
    //   //     childMint,
    //   //     reversible,
    //   //     { name, uri, symbol },
    //   //     { connection, wallet, program },
    //   //   )
    //   //   break
    // }
    // if (!newMint) {
    //   // TODO: alert something wrong
    //   return
    // }
    // navigate(`/info/${newMint}`)
    // reloadWindow()
  }

  const showBelongToMe = false
  const showViewOnly = false
  const showCopy = true
  // const showBelongToMe = belong.me
  // const showViewOnly = !belong.me && belong.program
  // const showCopy = !belong.me && !belong.program

  return (
    // TODO 未连接钱包
    // (!wallet.publicKey && <div>Connect wallet first</div>) || (
    <NFTHandlerWrapper>
      <div className="top">
        <div className="nft-title">{metadata.name}</div>
        <div className="nft-creator">
          <span className="creator-label">creator</span>
          <span className="creator-value">{metadata?.owner?.address}</span>
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
        {showBelongToMe && (
          <NftInject
            withCopyInit={false}
            nftOptions={myNFTData.filter((item) => item?.mint != params.mint)}
            onInject={onInject}
            mintMetadata={mintMetadata}
            onExtract={onExtract}
            ref={injectRef}
          ></NftInject>
        )}
        {showCopy && (
          <NftInject
            withCopyInit={true}
            nftOptions={myNFTData.filter((item) => item?.mint != params.mint)}
            onCopyWithInject={onCopyWithInject}
          ></NftInject>
        )}
      </>
      {/* )} */}
    </NFTHandlerWrapper>
    // )
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
