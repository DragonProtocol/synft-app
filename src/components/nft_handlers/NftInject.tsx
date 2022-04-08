import { Alert, AlertTitle } from '@mui/material'
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
import { useWeb3Context } from '../ConnectedWeb3'
import { formatBigNumber } from '../../utils/tools'

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
  // nftOptions: NftDataItem[]
  onInject?: (props: OnInjectProps) => void
  onCopyWithInject?: (token: Token) => void
  onBurn?: () => void
  mintMetadata?: any
}

interface RefProps extends Props {
  nft: Nft
  setNft: (n: Nft) => void
}
// evm 只有不可逆的 mode
// const INJECT_MODES = [InjectMode.Reversible, InjectMode.Irreversible]

const NftInject: React.FC<RefProps> = ({
  // nftOptions,
  onInject,
  withCopyInit,
  onCopyWithInject,
  mintMetadata,
  onBurn,
  nft,
  setNft,
}: RefProps) => {
  const { account, signer, contract } = useWeb3Context()
  // let i = await connectObj.signer.getBalance()
  // const contractWithSigner = contract.connect(signer)
  // const address = await signer.getAddress()

  const [balance, setBalance] = useState(0)
  const [injectMode, setInjectMode] = useState<InjectMode>(InjectMode.Reversible)
  const [token, setToken] = useState<Token>(TOKEN_DEFAULT)
  // const [nftJsonData, setNftJsonData] = useState<any[]>([])
  const [checkTip, setCheckTip] = useState({ visible: false, msg: '' })
  const disabledToken = nft?.name ? true : false
  const injectType = disabledToken ? InjectType.NFT : InjectType.SOL

  const showValidate = (msg: string) => {
    setCheckTip({ visible: true, msg })
    setTimeout(() => {
      setCheckTip({ visible: false, msg: '' })
    }, 5000)
  }
  const validateVolume = (): boolean => {
    setCheckTip({ visible: false, msg: '' })
    // 如果是金额判断余额是否足够
    if (!Number(token.volume) || Number(token.volume) > balance) {
      // if (!Number(token.volume) || Number(token.volume) * Math.pow(10, 9) > balance) {
      showValidate('Insufficient balance')
      return false
    } else if (Number(token.volume) < 0.1) {
      showValidate('Amount must be greater than 0.1')
      return false
    } else {
      return true
    }
  }

  useEffect(() => {
    if (token.volume) validateVolume()
  }, [token.volume])

  const handleCopyWithInject = () => {
    if (!onCopyWithInject) return
    if (!validateVolume()) return
    onCopyWithInject(token)
  }

  // 获取当前账户余额
  useEffect(() => {
    if (!account) return
    ;(async () => {
      const _balance = await signer.getBalance()
      setBalance(Number(formatBigNumber(_balance, 0, 2)) / 1000000000000000000)
    })()
  }, [account])

  return (
    <NftInjectWrapper>
      {withCopyInit && (
        <div className="form-item">
          <div className="form-label">Create synthetic NFTs</div>
          <div className="form-value">
            <input
              type="number"
              className={`token-value ${disabledToken ? 'disabled' : ''}`}
              placeholder="0.10"
              value={token.volume}
              // TODO 处理非法输入
              onChange={(e) => setToken({ ...token, volume: e.target.value })}
            />
          </div>
        </div>
      )}
      {/* evm 去掉下面这两个功能 */}
      {/* {!withCopyInit && (
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
      )} */}
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

      {withCopyInit && (
        <ButtonWarning className="form-submit" onClick={handleCopyWithInject}>
          {' '}
          EnchaNFT!
        </ButtonWarning>
      )}
      {!withCopyInit && (
        <ButtonDanger className="form-submit" onClick={onBurn}>
          {' '}
          {`> BurnNFT`}{' '}
        </ButtonDanger>
      )}
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
