/*
 * @Author: HuangBoWen
 * @Date: 2022-03-29 21:17:30
 * @LastEditors: HuangBoWen
 * @LastEditTime: 2022-04-06 17:50:27
 * @Description: 
 */
import { stringify } from 'query-string'
import log from 'loglevel'

import { NFT, GetNFTPayload } from '../../synft'
import { isProd } from '../../utils'

const endpoint = isProd
  ? 'https://testnets-api.opensea.io/api/v1/assets'
  : 'https://testnets-api.opensea.io/api/v1/assets'

log.log('WONKALABS_ENDPORINT', endpoint)

export async function loadExploreNFT(payload: GetNFTPayload,init?:any): Promise<any[]> {
// export async function loadExploreNFT(payload: GetNFTPayload,init?:RequestInit): Promise<any[]> {
  log.info(`Fetching NFTs by collectionID: `)
  const result = await (
    await fetch(`${endpoint}?${stringify({ ...payload, order_direction: 'desc', offset: 0, limit: 20 })}`, init)
  ).json()

  return result.assets.map((o: any) => ({
    ...o,
    image: o.image_url,
  }))
}

export default {}
