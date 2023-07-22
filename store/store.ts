import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk'

import appReducer from './slices/app'
import actionReducer from './slices/action'
import pendingTransactionsReducer, { IPendingTxn } from './slices/pendingTxs'
import { IActionSlice } from './slices/action'
import { useDispatch } from 'react-redux'
import { IAppSlice } from './slices/app'

export interface IReduxState {
  pendingTransactions: IPendingTxn[]
  action: IActionSlice
  app: IAppSlice
}

const store = configureStore({
  reducer: {
    // account: accountReducer,
    app: appReducer,
    action: actionReducer,
    pendingTransactions: pendingTransactionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(thunkMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store
