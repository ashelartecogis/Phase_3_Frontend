import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    screenNumber: 1,
    singlePlayerData: {},
    isError: false,
    errorMsg: ""
};

export const savePlayerData = createAsyncThunk(
    "screenType/savePlayerData",
    async (
        { playerData },
        thunkAPI
    ) => {

        try {
            return {
                singlePlayerData: playerData
            };
            //   return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            //   thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const setScreenNo = createAsyncThunk(
    "screenType/setScreenNo",
    async (
        { screenNumber },
        thunkAPI
    ) => {

        try {
            return {
                screenNumber
            };
            //   return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            //   thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const screenTypeSlice = createSlice({
    name: "screenType",
    initialState,
    reducers: {
        screenType: (state) => initialState,
    },
    extraReducers: {
        [savePlayerData.fulfilled]: (state, action) => {
            state.singlePlayerData = action.payload.singlePlayerData;
        },
        [savePlayerData.rejected]: (state, action) => {
            state.isError = true
            state.errorMsg = 'Something Went Wrong'
        },
        [setScreenNo.fulfilled]: (state, action) => {
            state.screenNumber = action.payload.screenNumber;
        },
        [setScreenNo.rejected]: (state, action) => {
            state.isError = true
            state.errorMsg = 'Something Went Wrong'
        }
    },
});