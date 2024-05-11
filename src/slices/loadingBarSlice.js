import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    process : 0,
};

const loadingBarSlice = createSlice({
    name :"loadingBar",
    initialState,
    reducers:{
        setProgress : (state, action) =>{
            return action.payload;
        },
    },
});

export const {setProgress} = loadingBarSlice.actions;
export default loadingBarSlice.reducer;