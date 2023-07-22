import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { useProtocolContract } from 'hooks/useContract'
import { Order } from 'interfaces'
import { IReduxState } from 'store/store'
import { setAll } from 'utils/setAll'

type ProtocolContractType = ReturnType<typeof useProtocolContract>
interface ILoadAppDetail {
  protocolContract: ProtocolContractType
}

export const loadAppDetails = createAsyncThunk(
  'app/loadAppDetails',
  async ({ protocolContract }: ILoadAppDetail) => {
    try {
      let orders = await protocolContract.read.getAllOrders()
      console.log(orders)
      return orders
    } catch (err) {
      console.log(err)
    }
  }
)

const initialState = {
  loading: true,
  orders: [],
}

export interface IAppSlice {
  loading: boolean
  orders: Array<Order>
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAppDetails.pending, (state, action) => {
        state.loading = true
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false
        console.log(error)
      })
  },
})

const baseInfo = (state: IReduxState) => state.app

export default appSlice.reducer

export const { fetchAppSuccess } = appSlice.actions

export const getAppState = createSelector(baseInfo, (app) => app)
