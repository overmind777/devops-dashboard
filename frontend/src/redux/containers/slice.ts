import { Container, State } from '../../types/types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: Container = {
  id: '',
  name: '',
  image: '',
  state: {
    Status: ''
  },
  status: '',
  ports: '',
}

export const containerSlice = createSlice({
  name: 'container',
  initialState,
  reducers: {}
})

export const {} = containerSlice.actions;
export const  containerReducer = containerSlice.reducer;