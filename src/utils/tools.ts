/*
 * @Author: HuangBoWen
 * @Date: 2022-03-23 10:01:58
 * @LastEditors: HuangBoWen
 * @LastEditTime: 2022-04-02 11:32:23
 * @Description:
 */
import { BigNumber, ethers } from 'ethers'
import { formatUnits, parseUnits } from '@ethersproject/units'

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

export const getBytes32 = (contractAddress: string, tokenId: string) =>
  ethers.utils.keccak256(
    zeropad(contractAddress, 32, '0x') + zeropad(BigNumber.from(tokenId).toHexString().replace('0x', ''), 32),
  )

export const formatBigNumber = (value: BigNumber, decimals: number, precision = 2): string =>
  Number(formatUnits(value, decimals)).toFixed(precision)
