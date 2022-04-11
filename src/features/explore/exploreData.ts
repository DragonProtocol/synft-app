/*
 * @Author: HuangBoWen
 * @Date: 2022-03-29 21:17:30
 * @LastEditors: HuangBoWen
 * @LastEditTime: 2022-04-11 09:35:56
 * @Description:
 */
import { stringify } from 'query-string'
import log from 'loglevel'

import { createHashHistory } from 'history'
import { NFT, GetNFTPayload } from '../../synft'
import { isProd, collection as defaultCollection } from '../../utils'

const endpoint = isProd
  ? 'https://testnets-api.opensea.io/api/v1/assets'
  : 'https://testnets-api.opensea.io/api/v1/assets'

log.log('WONKALABS_ENDPORINT', endpoint)
const history = createHashHistory()

export async function loadExploreNFT(payload?: GetNFTPayload, init?: any): Promise<any[]> {
  // export async function loadExploreNFT(payload: GetNFTPayload,init?:RequestInit): Promise<any[]> {
  log.info(`Fetching NFTs by collectionID: `)
  const queryCollection = new URLSearchParams(window.location.hash.replace('#/',''))?.get("q")
  // const queryCollection = new URLSearchParams(history.location.search)?.get("q")
  console.log(queryCollection,'queryCollection')

  const collection = queryCollection || defaultCollection
  const result = await (
    await fetch(
      `${endpoint}?${stringify({ order_direction: 'desc', offset: 0, limit: 20, collection, ...(payload || {}) })}`,
      init,
    )
  ).json()

  return result.assets.map((o: any) => ({
    ...o,
    image: o.image_url,
  }))
}

export default {}
