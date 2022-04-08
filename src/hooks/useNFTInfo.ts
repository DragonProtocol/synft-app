/*
 * @Author: HuangBoWen
 * @Date: 2022-03-24 07:25:05
 * @LastEditors: HuangBoWen
 * @LastEditTime: 2022-04-08 10:01:45
 * @Description:
 */
import { useEffect, useState } from 'react'

import { getHasCopied } from '../utils/tools'

import { NFT } from '../../src/synft/index'
import { loadExploreNFT } from '../features/explore/exploreData'

import { useAppSelector } from '../store/hooks'
import { selectMyNFTData } from '../features/my/mySlice'
import { selectExploreData } from '../features/explore/exploreSlice'

/**
 * 获取 NFTInfo
 */
export default (contractAddress?: string, tokenId?: string) => {
  const [info, setInfo] = useState<NFT | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const exploreNFTData = useAppSelector(selectExploreData)

  const myNFTData = useAppSelector(selectMyNFTData)

  useEffect(() => {
    ;(async () => {
      if (!contractAddress || !tokenId) return
      setLoading(true)

      const NFTInfo =
        myNFTData?.find(
          ({ asset_contract: nftAssetContract, token_id: nftTokenId }) =>
            nftAssetContract?.address === contractAddress && nftTokenId === tokenId,
        ) ||
        exploreNFTData?.find(
          ({ asset_contract: nftAssetContract, token_id: nftTokenId }) =>
            nftAssetContract?.address === contractAddress && nftTokenId === tokenId,
        )

      let item
      if (!NFTInfo) {
        const result = await loadExploreNFT(
          {
            asset_contract_address: contractAddress,
            token_ids: tokenId,
          },
          {
            cache: 'no-cache',
          },
        )
        item = result?.[0]
        item.hasCopied = await getHasCopied(item.asset_contract.address, item.token_id)
      }

      setInfo(NFTInfo || item)
      setLoading(false)
    })()
  }, [contractAddress, tokenId])

  return { info, loading }
}
