import { configureStore } from '@reduxjs/toolkit'
import { containerReducer } from './containers/slice';

export const store = configureStore({
  reducer: {
    container: containerReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch