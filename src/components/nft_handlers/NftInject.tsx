import { Alert, AlertTitle, Dialog, DialogContent, DialogTitle, ImageList, ImageListItem } from '@mui/material'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { NftDataItem, NFTListWrapper } from '../NFTList'
import DialogCloseIcon from '../icons/dialogClose.svg'
import CheckedIcon from '../icons/checked.svg'
import AddIcon from '../icons/add.svg'
import NFTCard from '../NFTCard'
import { CursorPointerUpCss } from '../../GlobalStyle'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { ButtonDanger, ButtonPrimary, ButtonWarning } from '../common/ButtonBase'
import { MOBILE_BREAK_POINT } from '../../utils/constants'
import { InjectType } from '../../synft'

export type Token = {
  name: string
  address: string
  symbol: string
  image: string
  volume?: string
}
const TOKEN_DEFAULT = {
  name: '',
  address: '',
  symbol: '',
  image: '',
  volume: '',
}
export enum InjectMode {
  Reversible = 'Reversible',
  Irreversible = 'Irreversible',
}

export interface OnInjectProps {
  injectMode: InjectMode
  injectType: InjectType
  token: Token
  nft: NftDataItem
}

type Nft = { mint: string; image: string; name: string }
interface Props {
  withCopyInit: boolean
  nftOptions: NftDataItem[]
  onInject?: (props: OnInjectProps) => void
  onCopyWithInject?: (props: OnInjectProps) => void
  onExtract?: () => void
  mintMetadata?: any
}

interface RefProps extends Props {
  nft: Nft
  setNft: (n: Nft) => void
}
const INJECT_MODES = [InjectMode.Reversible, InjectMode.Irreversible]

const NftInject: React.FC<RefProps> = ({
  nftOptions,
  onInject,
  withCopyInit,
  onCopyWithInject,
  mintMetadata,
  onExtract,
  nft,
  setNft,
}: RefProps) => {
  const { connection } = useConnection()
  const wallet = useWallet()
  const [balance, setBalance] = useState(0)
  const [injectMode, setInjectMode] = useState<InjectMode>(InjectMode.Reversible)
  const [token, setToken] = useState<Token>(TOKEN_DEFAULT)
  const [visibleNftList, setVisibleNftList] = useState(false)
  // const [nftJsonData, setNftJsonData] = useState<any[]>([])
  const [checkTip, setCheckTip] = useState({ visible: false, msg: '' })
  const disabledToken = nft?.name ? true : false
  const disabledNft = token?.volume ? true : false
  const injectType = disabledToken ? InjectType.NFT : InjectType.SOL
  const handleOpenNftList = () => {
    setVisibleNftList(true)
  }
  const handleCloseNftList = () => {
    setVisibleNftList(false)
  }
  const handleCheckedNft = (nft: NftDataItem) => {
    setNft(nft)
    setVisibleNftList(false)
  }
  const handleDeleteNft = () => setNft({ mint: '', image: '', name: '' })
  const showValidate = (msg: string) => {
    setCheckTip({ visible: true, msg })
    setTimeout(() => {
      setCheckTip({ visible: false, msg: '' })
    }, 5000)
  }
  const validateVolume = (): boolean => {
    setCheckTip({ visible: false, msg: '' })
    // 如果是金额判断余额是否足够
    if (!Number(token.volume) || Number(token.volume) * Math.pow(10, 9) > balance) {
      showValidate('Insufficient balance')
      return false
    } else {
      return true
    }
  }
  // useEffect(() => {
  //   if (token.volume) validateVolume()
  // }, [token.volume])
  const handleInject = () => {
    if (!onInject) return
    // 验证是否输入金额或选择其它nft
    if (!Number(token.volume) && !nft.mint) {
      showValidate('Please enter an asset or select an NFT')
      return
    }
    // if (!validateVolume()) return
    onInject({ injectMode, injectType, token, nft })
  }
  const handleCopyWithInject = () => {
    if (!onCopyWithInject) return
    // if (!validateVolume()) return
    onCopyWithInject({ injectMode, injectType, token, nft })
  }
  // 获取nft列表
  // useEffect(() => {
  //   ;(async () => {
  //     const promises = nftOptions.map(async (item) => {
  //       const response = await fetch(item.uri || '')
  //       const jsonData = await response.json()
  //       return { ...item, ...jsonData }
  //     })
  //     const res = await Promise.allSettled(promises)
  //     const jsonData = res.filter((item) => item.status === 'fulfilled').map((item: any) => item.value)
  //     setNftJsonData(jsonData)
  //   })()
  // }, [nftOptions])
  // 获取当前账户余额
  // useEffect(() => {
  //   if (!wallet.publicKey) return
  //   ;(async (publicKey) => {
  //     const _balance = await connection.getBalance(publicKey)
  //     setBalance(_balance)
  //   })(wallet.publicKey)
  // }, [wallet])

  return (
    <NftInjectWrapper>
      {withCopyInit && (
        <div className="form-item">
          <div className="form-label">Create synthetic NFTs</div>
          <div className="form-value">
            <input
              type="number"
              className={`token-value ${disabledToken ? 'disabled' : ''}`}
              placeholder="0.00"
              value={token.volume}
              onChange={(e) => setToken({ ...token, volume: Number(e.target.value) < 0.01 ? String(0.01) : e.target.value})}
            />
          </div>
        </div>
      )}
      {!withCopyInit && (
        <div className="form-item">
          <div className="form-label">Embed other NFTs</div>
          <div className={`form-value select-nft-btn ${disabledNft ? 'disabled' : ''}`} onClick={handleOpenNftList}>
            {nft?.image ? (
              <>
                <div className="delete-btn" onClickCapture={handleDeleteNft}>
                  x
                </div>
                <img src={nft.image} alt="" className="nft-img" />
              </>
            ) : (
              <img src={AddIcon} alt="" />
            )}
          </div>
        </div>
      )}
      {/* <div className="form-item">
        <div className="form-label">Select Mode</div>
        <div className="form-value mode-selector">
          {INJECT_MODES.map((item) => (
            <div
              key={item}
              className={`mode-item ${injectMode === item ? 'mode-checked' : ''}`}
              onClick={() => setInjectMode(item)}
            >
              <div className="mode-checked-icon">{injectMode === item && <img src={CheckedIcon} alt="" />}</div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div> */}
      {checkTip.visible && (
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          {checkTip.msg}
        </Alert>
      )}

      {(withCopyInit && (
        <ButtonWarning className="form-submit" onClick={handleCopyWithInject}>
          {' '}
          EnchaNFT!
        </ButtonWarning>
      )) || (
        <ButtonPrimary className="form-submit" onClick={handleInject}>
          {/* {'> Embed SOL <'} */}
          {'> Embed NFT<'}
        </ButtonPrimary>
      )}
      {mintMetadata && (
        <ButtonDanger className="form-submit" onClick={onExtract}>
          {' '}
          {`> extract (${mintMetadata.lamports / 1000000000} SOL) <`}{' '}
        </ButtonDanger>
      )}

      <Dialog fullWidth={true} maxWidth="md" onClose={handleCloseNftList} open={visibleNftList}>
        <DialogTitle>
          <span>Select NFT</span>
          <img
            className="close-btn"
            src={DialogCloseIcon}
            style={{ position: 'absolute', top: '16px', right: '24px' }}
            onClick={() => setVisibleNftList(false)}
          />
        </DialogTitle>
        <DialogContent className="nft-list-content">
          {nftOptions.length > 0 ? (
            <NFTListWrapper>
              {nftOptions.map((item, idx) => (
                <div className="list-item nft-item" key={idx} onClick={() => handleCheckedNft(item)}>
                  <NFTCard data={item}></NFTCard>
                </div>
              ))}
            </NFTListWrapper>
          ) : (
            <div style={{ textAlign: 'center', height: '50px', lineHeight: '50px' }}>You have no NFT!</div>
          )}
        </DialogContent>
      </Dialog>
    </NftInjectWrapper>
  )
}
export default React.forwardRef((props: Props, ref: any) => {
  const init = { mint: '', image: '', name: '' }
  const [nft, setNft] = useState<NftDataItem>(init)

  useImperativeHandle(ref, () => ({
    resetSelect: () => {
      setNft(init)
    },
  }))
  return <NftInject {...props} nft={nft} setNft={setNft} />
})

const NftInjectWrapper = styled.div`
  .disabled {
    pointer-events: none;
  }
  .form-item {
    margin-bottom: 24px;
    .form-label {
      font-size: 16px;
      text-transform: uppercase;
      color: rgba(34, 34, 34, 0.5);
      margin-bottom: 12px;
      @media (max-width: ${MOBILE_BREAK_POINT}px) {
        font-size: 14px;
      }
    }
  }
  .token-value {
    width: 100%;
    height: 60px;
    background: #ffffff;
    border: 2px solid #222222;
    box-sizing: border-box;
    padding: 12px 16px;
  }
  .select-nft-btn {
    width: 120px;
    height: 120px;
    background: #ffffff;
    border: 2px solid #222222;
    box-sizing: border-box;
    box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .nft-img {
      width: 100%;
      height: 100%;
    }
    .delete-btn {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
      background: red;
      text-align: center;
      color: #ffffff;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      line-height: 30px;
      text-align: center;
      ${CursorPointerUpCss}
    }
  }
  .mode-selector {
    background: #ffffff;
    border: 2px solid #222222;
    box-sizing: border-box;
    display: flex;
    color: rgba(34, 34, 34, 0.5);
    justify-content: space-around;
    align-items: center;
    .mode-item {
      display: flex;
      padding: 18px 0;
      ${CursorPointerUpCss}
      @media (max-width: ${MOBILE_BREAK_POINT}px) {
        font-size: 12px;
      }
    }
    .mode-checked {
      color: #222222;
    }
    .mode-checked-icon {
      width: 10px;
      height: 15px;
      margin-right: 16px;
      @media (max-width: ${MOBILE_BREAK_POINT}px) {
        margin-right: 5px;
      }
    }
  }
  .close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
  }
  .nft-list-content {
    display: flex;
    .nft-item {
      ${CursorPointerUpCss}
    }
  }
  .form-submit {
    height: 60px;
    margin-bottom: 20px;
  }
`
