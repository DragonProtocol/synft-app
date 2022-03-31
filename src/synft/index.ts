/*
 * @Author: HuangBoWen
 * @Date: 2022-03-24 07:25:05
 * @LastEditors: HuangBoWen
 * @LastEditTime: 2022-03-29 21:26:58
 * @Description: 
 */
export { default as Contract } from './Contract'
export type { Node, MetaInfo, BelongTo, NFT, NFTDataItem } from './v2/types'
export type { Synft } from './v2'
export { InjectType } from './v2/types'
export type GetNFTPayload = {
    owner?: string
    offset?: number
    limit?: number
    collection?: string
  }