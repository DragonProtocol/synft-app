/*
 * @Author: HuangBoWen
 * @Date: 2022-03-24 07:25:05
 * @LastEditors: HuangBoWen
 * @LastEditTime: 2022-03-30 17:51:52
 * @Description:
 */
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import ReactJson from 'react-json-view'

import NFTHandler from '../components/NFTHandler'

import NFTShower from '../components/NFTShower'
import useInjectTree from '../hooks/useInjectTree'
import LoadingIcon from '../components/imgs/Loading.gif'
import { MOBILE_BREAK_POINT } from '../utils/constants'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { getExploreData, selectExploreData, selectExploreStatus } from '../features/explore/exploreSlice'

import { useInfoFromMint, useValidNFT } from '../hooks'

const Info: React.FC = () => {
  const params = useParams()
  const dispatch = useAppDispatch()

  const exploreNFTStatus = useAppSelector(selectExploreStatus)

  useEffect(() => {
    if (exploreNFTStatus === 'init') {
      const payload = {
        // owner: '0xc30306aefe81ea26ad9b839941516efdb62b9c97',
        order_direction: 'desc',
        offset: 0,
        limit: 20,
        collection: 'superfakeboredapeyachtclub',
      }
      dispatch(getExploreData(payload))
      // 分步取数据的 DEMO，collections 可与 selectExploreDataHasGetCollectionIds 做 diff
      // setTimeout(() => {
      //   dispatch(getExploreDataWithCollectionId({ collectionId: collections[1] }))
      // }, 15000)
    }
  }, [])
  // const { info, loading: infoLoading } = useInfoFromMint(params.mint)
  // const { valid: validNFT, checking: validChecking } = useValidNFT(params.mint)
  // const { injectTree, loading: injectTreeLoading, refresh: reloadInjectTree } = useInjectTree(params.mint)
  const validNFT = true
  const exploreNFTData = useAppSelector(selectExploreData)
  const info = exploreNFTData.find(({ id }) => id === Number(params?.mint))
  const metadata = info
  // console.log(params?.mint, '------------------------params?.mint')
  // console.log(exploreNFTData, '------------------------exploreNFTData')
  // console.log(info, '------------------------111111111')

  const loading = false
  // const metadata = info?.metadata
  // const loading = validChecking || infoLoading
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
              <NFTShower data={info} />
            </div>
            <div className="right">
              {metadata && (
                <NFTHandler
                  metadata={metadata}
                  // refreshInject={reloadInjectTree}
                />
              )}
            </div>
          </>
        )) || <div className="tip">invalid NFT</div>}
      {/* {!injectTreeLoading && <ReactJson src={injectTree} />} */}
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
