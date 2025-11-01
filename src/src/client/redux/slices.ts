import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { eOIDCFLOW } from '../services/identity';
import { _logger } from '../index';

// ajm: slice => reducers/actions
// ajm: store configureStore() slices/middleware
// ajm <Provider store=
// ajm: Component class => react-redux connect( mapStateToProps() )  
// functional component: Global Context => React.createContext() then component useContext() 

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

export type StateOIDCFlow = { 
  OIDCFlow: eOIDCFLOW
}

export const OIDCFlowSlice = createSlice({
  name: "OIDCFlow",
  initialState: {
    OIDCFlow: eOIDCFLOW.eSIGNEDOUT
  },
  reducers: {
    OIDCFlow: (state: StateOIDCFlow, action: PayloadAction<eOIDCFLOW>) => {
      _logger.LogDebug(`OIDCFLOWSlice.reducer.OIDCFlow: (state: ${JSON.stringify(state)}, action.payload: ${action.payload})`);
      state.OIDCFlow = action.payload;
    }
  },
});
