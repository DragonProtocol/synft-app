/*
 * @Author: HuangBoWen
 * @Date: 2022-03-24 07:25:05
 * @LastEditors: HuangBoWen
 * @LastEditTime: 2022-04-02 13:33:54
 * @Description:
 */
import { useEffect, useState } from 'react'
import { ethers, BigNumber } from 'ethers'

import { zeropad,formatBigNumber } from '../utils/tools'
import { network, contractAddress as ethersContract } from '../utils'
import syntheticNft from '../abi/synthetic-nft.json'
import { loadExploreNFT } from '../features/explore/exploreData'

/**
 * 获取 NFTInfo
 */
export default (contractAddress?: string, tokenId?: string) => {
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (!contractAddress || !tokenId) return
      setLoading(true)

      const result = await loadExploreNFT({ asset_contract_address: contractAddress, token_ids: tokenId })
      const item = result?.[0]

      const bytes32 = ethers.utils.keccak256(
        zeropad(item.asset_contract.address, 32, '0x') +
          zeropad(BigNumber.from(item.token_id).toHexString().replace('0x', ''), 32),
      )
      const provider = ethers.getDefaultProvider(network)
      const contract = new ethers.Contract(ethersContract, syntheticNft.abi, provider)
      /* eslint no-underscore-dangle: 0 */
      const hasCopied = await contract._uniques(bytes32)
      // 查询是否有余额
      const balances = await contract._etherBalances(formatBigNumber(hasCopied,0,0))
      item.hasCopied = !BigNumber.from(balances).isZero()

      setInfo(item)
      setLoading(false)
    })()
  }, [contractAddress, tokenId])

  return { info, loading }
}
