import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import log from 'loglevel'
import { ethers, BigNumber } from 'ethers'

import { RootState } from '../../store/store'
import { zeropad,formatBigNumber } from '../../utils/tools'
import { network, contractAddress } from '../../utils'

import { NFT, GetNFTPayload } from '../../synft'
import { loadExploreNFT } from './exploreData'

import syntheticNft from '../../abi/synthetic-nft.json'

interface ExploreNFT {
  hasGetCollectionIds: string[]
  data: NFT[]
  status: 'init' | 'loading' | 'done'
  err: string
}

const initialState: ExploreNFT = {
  hasGetCollectionIds: [],
  data: [],
  status: 'init',
  err: '',
}

export const getExploreData = createAsyncThunk('explore/nftdata', async (payload: GetNFTPayload) => {
  const provider = ethers.getDefaultProvider(network)
  const contract = new ethers.Contract(contractAddress, syntheticNft.abi, provider)

  // const currentValue = contract._uniques('0x07eaf1c54cd27e045bebfc0eb0f4d7c99dcfc777b11c6b18f5aa7250afb78063').then((res:any) => console.log(res,'res')).catch((err:any) => console.log(err,'err'))

  const d: NFT[] = await loadExploreNFT(payload)
  await Promise.all(
    d.map(async (item) => {
      try {
        const bytes32 = ethers.utils.keccak256(
          zeropad(item.asset_contract.address, 32, '0x') +
            zeropad(BigNumber.from(item.token_id).toHexString().replace('0x', ''), 32),
        )
        /* eslint no-underscore-dangle: 0 */
        const hasCopied = await contract._uniques(bytes32)
        // 查询是否有余额
        const balances = await contract._etherBalances(formatBigNumber(hasCopied,0,0))
        item.hasCopied = !BigNumber.from(balances).isZero()
      } catch (error) {
        log.error(error)
      }
    }),
  )

  return d
})

export const getExploreDataWithCollectionId = createAsyncThunk(
  'explore/nftDataWithCollectionId',
  async ({ collectionId }: { collectionId: string }, thunkAPI) => {
    // const contract = Contract.getInstance()
    // const d: NFT[] = await loadExploreNFT(collectionId)
    // await Promise.all(
    //   d.map(async (item) => {
    //     try {
    //       const mintKey = new PublicKey(item.mint)
    //       const hasCopied = await contract.getMintAccountInfo(mintKey)
    //       item.hasCopied = !!hasCopied
    //     } catch (error) {
    //       log.error(error)
    //     }
    //   }),
    // )
    // thunkAPI.dispatch(exploreSlice.actions.incrData({ data: d, collectionId }))
  },
)

export const exploreSlice = createSlice({
  name: 'explore/collection',
  initialState,
  reducers: {
    incrData: (state, action) => {
      // if (!state.hasGetCollectionIds.includes(action.payload.collectionId)) {
      state.data = state.data.concat(action.payload.data)
      // state.hasGetCollectionIds.push(action.payload.collectionId)
      // }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getExploreData.pending, (state) => {
        if (state.status === 'init') state.status = 'loading'
      })
      .addCase(getExploreData.fulfilled, (state, action) => {
        state.status = 'done'
        state.data = action.payload
      })
      .addCase(getExploreData.rejected, (state, action) => {
        state.status = 'done'
        state.err = action.error.message || 'failed'
      })
      .addCase(getExploreDataWithCollectionId.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getExploreDataWithCollectionId.fulfilled, (state, action) => {
        state.status = 'done'
      })
      .addCase(getExploreDataWithCollectionId.rejected, (state, action) => {
        log.error(action.error)
        state.status = 'done'
      })
  },
})

export const selectExploreDataHasGetCollectionIds = (state: RootState) => state.explore.hasGetCollectionIds
export const selectExploreData = (state: RootState) => state.explore.data
export const selectExploreStatus = (state: RootState) => state.explore.status
export const selectExploreErr = (state: RootState) => state.explore.err

export default exploreSlice.reducer
