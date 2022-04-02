/*
 * @Author: HuangBoWen
 * @Date: 2022-03-24 07:25:05
 * @LastEditors: HuangBoWen
 * @LastEditTime: 2022-04-01 23:04:44
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
    contract?: any
    asset_contract_address?: string
    token_ids?: string
  }