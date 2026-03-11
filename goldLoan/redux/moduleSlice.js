import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedModule: null,
  isLoggedIn: false,
  uid: null,
  roleCode: null,
  isAdmin: false,
  bootstrapped: false,
  userHydrated: false,
  uiTheme: "current",
};

const moduleSlice = createSlice({
  name: "module",
  initialState,
  reducers: {
    setModule: (state, action) => {
      if (!action.payload) return;
      state.selectedModule = action.payload;
    },

    // loginSuccess: (state, action) => {
    //   state.isLoggedIn = true;
    //   state.uid = action.payload?.uid ?? null;
    //   state.bootstrapped = true;
    // },

    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.uid = action.payload?.uid ?? null;
      state.roleCode = action.payload?.roleCode ?? null;
      state.isAdmin = action.payload?.isAdmin ?? false;
      state.bootstrapped = true;
    },


    setUserHydrated: (state) => {
      state.userHydrated = true;
    },

    logout: (state) => {
      state.isLoggedIn = false;
      state.uid = null;
      state.selectedModule = null;
      state.roleCode = null;
      state.userHydrated = false;
      state.bootstrapped = true;
    },

    logoutOnly: (state) => {
      state.isLoggedIn = false;
      state.uid = null;
      state.selectedModule = null;
      state.roleCode = null;
      state.isAdmin = false;
      state.userHydrated = false;
      state.bootstrapped = true;
    },


    finishBootstrap: (state) => {
      state.bootstrapped = true;
    },

    setUITheme: (state, action) => {
      state.uiTheme = action.payload;
    },
  },
});

export const {
  setModule,
  loginSuccess,
  logout,
  logoutOnly,
  finishBootstrap,
  setUserHydrated,
  setUITheme,
} = moduleSlice.actions;

export default moduleSlice.reducer;
