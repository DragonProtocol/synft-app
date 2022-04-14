/*
 * @Author: HuangBoWen
 * @Date: 2022-03-29 21:17:30
 * @LastEditors: HuangBoWen
 * @LastEditTime: 2022-04-11 09:35:56
 * @Description:
 */
import { stringify } from 'query-string'
import log from 'loglevel'

import { NFT, GetNFTPayload } from '../../synft'
import { isProd, collection as defaultCollection } from '../../utils'

const endpoint = isProd
  ? 'https://deep-index.moralis.io/api/v2/nft/search'
  : 'https://deep-index.moralis.io/api/v2/nft/search'
// const endpoint = isProd
//   ? 'https://testnets-api.opensea.io/api/v1/assets'
//   : 'https://testnets-api.opensea.io/api/v1/assets'

log.log('WONKALABS_ENDPORINT', endpoint)

export async function loadExploreNFT(payload?: GetNFTPayload, init?: any): Promise<any[]> {
  // export async function loadExploreNFT(payload: GetNFTPayload,init?:RequestInit): Promise<any[]> {
  log.info(`Fetching NFTs by collectionID: `)
  const queryCollection = new URLSearchParams(window.location.hash.replace('#/', ''))?.get('q')
  // const queryCollection = new URLSearchParams(history.location.search)?.get("q")
  // console.log(queryCollection, 'queryCollection')

  const collection = queryCollection || defaultCollection

  // chain=eth&format=decimal&q={q}&filter=name
  const result = await (
    await fetch(
      `${endpoint}?${stringify({
        chain: 'eth',
        q: collection,
        filter: 'global',
        // offset: 0,
        limit: 30,
        ...(payload || {}),
      })}`,
      // `${endpoint}?${stringify({ order_direction: 'desc', offset: 0, limit: 20, collection, ...(payload || {}) })}`,
      {
        headers: {
          // 'X-API-Key': '5b8f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f',
          'X-API-Key': 'U7IawHOdky460kutWY4czDd1GZHd2H0gujOQgMxnB9z3b4MKQLkOdtcRQOYvEK1o',
        },
        ...init,
      },
    )
  ).json()
  const res = result.result.map((item:any) => {
    const metadata = JSON.parse(item?.metadata || '')
    return ({
      ...item,
      asset_contract: {
        address: item.token_address
      },
      ...metadata,
      image: metadata?.image || metadata?.image_url
    })
  })
  console.log(res, 'resultresultresultresultresultresultresult')

  return res
  // return result.assets.map((o: any) => ({
  //   ...o,
  //   image: o.image_url,
  // }))
}

export default {}
