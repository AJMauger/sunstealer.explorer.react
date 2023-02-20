import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { _logger } from '../index';

export type StateStatus = { 
  error: string, 
  warning: string
}

export const statusSlice = createSlice({
  name: "status",
  initialState: {
    error: "none",
    warning: "none"
  },
  reducers: {
    error: (state: StateStatus, action: PayloadAction<string>) => {
      _logger.LogDebug(`statusSlice.reducer.error: (state: ${JSON.stringify(state)}, action.payload: ${action.payload})`);
      state.error = action.payload;
    },
    warning: (state: StateStatus, action: PayloadAction<string>) => {
      _logger.LogDebug(`statusSlice.reducer.warning: (state: ${JSON.stringify(state)}, action.payload: ${action.payload})`);
      state.warning = action.payload;
    }
  },
});
