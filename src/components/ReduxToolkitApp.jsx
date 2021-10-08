import React from 'react';
import { Provider, shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { fetchWord } from '../api';
import Dictionary from './Dictionary';

const getWord = createAsyncThunk(
  'getWord',
  async (word, { rejectWithValue }) => {
    try {
      return await fetchWord(word);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const slice = createSlice({
  name: 'dictionary',
  initialState: {
    word: '',
    status: 'init',
    error: null,
    data: null,
  },
  reducers: {
    changeWord(state, action) {
      state.word = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getWord.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(getWord.fulfilled, (state, action) => {
      state.status = 'success';
      state.data = action.payload;
    });
    builder.addCase(getWord.rejected, (state, action) => {
      state.status = 'error';
      state.error = action.payload;
    });
  },
});

const selector = (state) => state.dictionary;

const store = configureStore({
  reducer: {
    dictionary: slice.reducer,
  },
});

function DictionaryContainer() {
  const state = useSelector(selector, shallowEqual);
  const dispatch = useDispatch();
  return (
    <Dictionary
      {...state}
      refetch={() => getWord(state.word)}
      onSearch={(word) => {
        dispatch(slice.actions.changeWord(word));
        dispatch(getWord(word));
      }}
    />
  );
}

export default function ReduxToolkitApp() {
  return (
    <Provider store={store}>
      <DictionaryContainer />
    </Provider>
  );
}
