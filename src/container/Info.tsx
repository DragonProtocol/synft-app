/*
 * @Author: HuangBoWen
 * @Date: 2022-03-24 07:25:05
 * @LastEditors: HuangBoWen
 * @LastEditTime: 2022-04-01 23:19:49
 * @Description:
 */
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import NFTHandler from '../components/NFTHandler'

import NFTShower from '../components/NFTShower'
import LoadingIcon from '../components/imgs/Loading.gif'
import { MOBILE_BREAK_POINT } from '../utils/constants'

import { useNFTInfo, useValidNFT } from '../hooks'

const Info: React.FC = () => {
  const { contractAddress, tokenId } = useParams()
  const { info, loading } = useNFTInfo(contractAddress, tokenId)
  
  // TODO 验证 NFT？
  // const { valid: validNFT, checking: validChecking } = useValidNFT(params.mint)
  const validNFT = true

  return (
    <InfoWrapper>
      {(loading && (
        <div className="tip">
          <img src={LoadingIcon} alt="" />
        </div>
      )) ||
        (validNFT && (
          <>
            <div className="left">
              <NFTShower info={info} />
            </div>
            <div className="right">{info && <NFTHandler info={info} />}</div>
          </>
        )) || <div className="tip">invalid NFT</div>}
    </InfoWrapper>
  )
}
export default Info
const InfoWrapper = styled.div`
  width: 100%;
  display: flex;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex-direction: column-reverse;
  }
  .left,
  .right {
    width: 50%;
    @media (max-width: ${MOBILE_BREAK_POINT}px) {
      width: 100%;
    }
  }
  .right {
    padding-left: 24px;
    box-sizing: border-box;
    @media (max-width: ${MOBILE_BREAK_POINT}px) {
      padding: 12px;
      background: #fff;
      margin-bottom: 12px;
      box-sizing: border-box;
    }
  }

  .tip {
    margin: 0 auto;
    margin-top: 40%;
  }
`
