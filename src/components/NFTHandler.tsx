import React, { useEffect, useState, useCallback, useRef, createRef } from 'react'
import { Alert, AlertColor, Backdrop, CircularProgress, Snackbar } from '@mui/material'

import { useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { useNavigate } from 'react-router-dom'

import { clearMyNFT } from '../features/my/mySlice'
import LoadingIcon from '../components/imgs/Loading.gif'

import NftInject, { Token } from './nft_handlers/NftInject'
import { MOBILE_BREAK_POINT } from '../utils/constants'
import { getBytes32, formatBigNumber } from '../utils/tools'
import { useWeb3Context } from './ConnectedWeb3'

import log from 'loglevel'
interface Props {
  info: any
}

enum TransctionType {
  INJECT = 'inject',
  EXTRACT = 'extract',
  TRANSFER = 'transfer',
  BURN = 'burn',
}
const transactionMsg = {
  [TransctionType.INJECT]: {
    inProgress: 'enchanft transaction in progress ......',
    successful: 'enchanft successful!',
    failed: 'enchanft failed!',
    cancel: 'enchanft transaction was canceled by user',
  },
  [TransctionType.EXTRACT]: {
    inProgress: 'extract transaction in progress ......',
    successful: 'extract successful!',
    failed: 'extract failed!',
    cancel: 'extract transaction was canceled by user',
  },
  [TransctionType.TRANSFER]: {
    inProgress: 'transfer transaction in progress ......',
    successful: 'transfer successful!',
    failed: 'transfer failed!',
    cancel: 'transfer transaction was canceled by user',
  },
  [TransctionType.BURN]: {
    inProgress: 'burn transaction in progress ......',
    successful: 'burn successful!',
    failed: 'burn failed!',
    cancel: 'burn transaction was canceled by user',
  },
}

const NFTHandler: React.FC<Props> = (props: Props) => {
  const { info } = props

  const injectRef = useRef<{ resetSelect: Function }>()
  // 交易状态
  const [transactionState, setTransactionState] = useState({
    inProgress: false,
    msg: '',
  })
  // 提示状态
  const [snackbarState, setSnackbarState] = useState<{ open: boolean; alertColor: AlertColor; alertMsg: string }>({
    open: false,
    alertColor: 'info',
    alertMsg: '',
  })
  // const [open,setOpen] = useState(false)

  const { account, signer, contract } = useWeb3Context()
  const navigate = useNavigate()

  const owner = info?.owner?.address
  const showBelongToMe = owner.toUpperCase() === account.toUpperCase()
  const showViewOnly = info.hasCopied && !showBelongToMe
  const showCopy = !showBelongToMe && !showViewOnly

  function reloadWindow() {
    window.location.reload()
  }
  // 执行销毁 让出坑位
  const onBurn = async () => {
    transactionPublic(async () => {
      const contractWithSigner = contract.connect(signer)

      const tx = await contractWithSigner.refund(
        info.token_id, // copy NFT的 tokenid
      )
      const response = await tx.wait()
      navigate(`/`)
    }, TransctionType.BURN)
  }

  // copy 并注入至少 0.1 eth
  const onCopyWithInject = async (token: Token) => {
    transactionPublic(async () => {
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
      const bytes32 = getBytes32(info.asset_contract.address, info.token_id)
      const hexId = await contract._uniques(bytes32)
      const tokenId = formatBigNumber(hexId, 0, 0)

      const { to: contractAddress } = response
      navigate(`/info/${contractAddress}/${tokenId}`)
      reloadWindow()
    }, TransctionType.INJECT)
  }

  /**
   * @description: 合约交易的通用处理逻辑, 包括交易前置条件处理, 交易结果状态提示，及交易后置操作
   * @param {*} fn 交易执行过程的异步函数
   * @param {*} type 交易的类型
   * @return {*}
   */
  const transactionPublic = useCallback(async (fn: Function, type: TransctionType) => {
    // if (!showBelongToMe || !showCopy) return
    setTransactionState({ inProgress: true, msg: transactionMsg[type].inProgress })
    try {
      await fn()
      setSnackbarState({ open: true, alertColor: 'success', alertMsg: transactionMsg[type].successful })
      // refreshInject()
    } catch (error) {
      // 可以用来显示错误
      if ((error as any).code === 4001) {
        // 用户取消交易
        setSnackbarState({ open: true, alertColor: 'warning', alertMsg: transactionMsg[type].cancel })
      } else {
        setSnackbarState({ open: true, alertColor: 'error', alertMsg: transactionMsg[type].failed })
      }
    } finally {
      setTransactionState({ ...transactionState, inProgress: false })
    }
  }, [])

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
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={transactionState.inProgress}
          >
            <div style={{ textAlign: 'center' }}>
              <CircularProgress color="inherit" />
              <div style={{ marginTop: '20px' }}>{transactionState.msg}</div>
            </div>
          </Backdrop>
          {/* 交易结束后提示交易结果 */}
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={snackbarState.open}
            autoHideDuration={6500}
            onClose={() => setSnackbarState((v) => ({ ...v, open: false }))}
          >
            <Alert severity={snackbarState.alertColor} className="alert-msg">
              {snackbarState.alertMsg}
            </Alert>
          </Snackbar>
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
