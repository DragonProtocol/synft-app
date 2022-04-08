/*
 * @Author: HuangBoWen
 * @Date: 2022-03-23 10:01:58
 * @LastEditors: HuangBoWen
 * @LastEditTime: 2022-04-07 17:37:24
 * @Description:
 */
import { BigNumber, ethers } from 'ethers'
import { formatUnits, parseUnits } from '@ethersproject/units'

import { network, contractAddress } from './index'
import syntheticNft from '../abi/synthetic-nft.json'

// eslint-disable-next-line import/prefer-default-export
export const backToTop = () => {
  document.getElementById('layoutMainScroll')?.scrollTo({ top: 0, behavior: 'smooth' })
}

export const formatAddress = (address: string): string =>
  `${address.substring(0, 6)}...${address.substring(address.length - 4)}`

export const zeropad = (str: string, byte: number, preFix?: string) => {
  const content = str.slice(preFix?.length || 0)
  const diff = byte * 2 - content.length
  return (preFix || '') + '0'.repeat(diff) + content
}

export const getBytes32 = (assetContract: string, tokenId: string) =>
  ethers.utils.keccak256(
    zeropad(assetContract, 32, '0x') + zeropad(BigNumber.from(tokenId).toHexString().replace('0x', ''), 32),
  )

export const formatBigNumber = (value: BigNumber, decimals: number, precision = 2): string =>
  Number(formatUnits(value, decimals)).toFixed(precision)

// 查询合约是否
export const getHasCopied = async (assetContract: string, tokenId: string): Promise<boolean> => {
  // 构建合约
  const provider = ethers.getDefaultProvider(network)
  const contract = new ethers.Contract(contractAddress, syntheticNft.abi, provider)

  // 获取 32 字节的串
  const bytes32 = getBytes32(assetContract, tokenId)

  /* eslint no-underscore-dangle: 0 */
  const isUniques = await contract._uniques(bytes32)

  // isUniques 为零不做下次查询
  if (BigNumber.from(isUniques).isZero()) return false

  // 查询是否有余额
  const balances = await contract._etherBalances(formatBigNumber(isUniques, 0, 0))

  return !BigNumber.from(balances).isZero()
}
