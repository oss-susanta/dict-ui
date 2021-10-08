import React from 'react';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { Provider, shallowEqual, useDispatch, useSelector } from 'react-redux';
import thunk from 'redux-thunk';
import produce from 'immer';
import { fetchWord } from '../api';
import Dictionary from './Dictionary';

const initialState = {
  word: '',
  status: 'init',
  error: null,
  data: null,
};

const WORD_STORE = 'dictionary';
const WORD_REQUEST = `${WORD_STORE}/request`;
const WORD_SUCCESS = `${WORD_STORE}/success`;
const WORD_ERROR = `${WORD_STORE}/error`;
const WORD_CHANGE = `${WORD_STORE}/change`;
const constants = {
  WORD_STORE,
  WORD_REQUEST,
  WORD_SUCCESS,
  WORD_ERROR,
  WORD_CHANGE,
};

const actions = {
  requestWord() {
    return { type: constants.WORD_REQUEST };
  },
  resolveWord(payload) {
    return { type: constants.WORD_SUCCESS, payload };
  },
  rejectWord(payload) {
    return { type: constants.WORD_ERROR, payload };
  },
  changeWord(payload) {
    return { type: constants.WORD_CHANGE, payload };
  },
  getWord: (word) => async (dispatch) => {
    dispatch(actions.requestWord());
    try {
      const data = await fetchWord(word);
      dispatch(actions.resolveWord(data));
    } catch (error) {
      dispatch(actions.rejectWord(error));
    }
  },
};

const reducer = produce((draft, action) => {
  switch (action.type) {
    case constants.WORD_REQUEST:
      draft.status = 'loading';
      draft.error = null;
      break;
    case constants.WORD_SUCCESS:
      draft.status = 'success';
      draft.data = action.payload;
      break;
    case constants.WORD_ERROR:
      draft.status = 'error';
      draft.error = action.payload;
      break;
    case constants.WORD_CHANGE:
      draft.word = action.payload;
      break;
  }
}, initialState);

const selector = (state) => state[constants.WORD_STORE];

const store = createStore(
  combineReducers({
    [constants.WORD_STORE]: reducer,
  }),
  applyMiddleware(thunk)
);

function DictionaryContainer() {
  const state = useSelector(selector, shallowEqual);
  const dispatch = useDispatch();
  return (
    <Dictionary
      {...state}
      refetch={() => dispatch(actions.getWord(state.word))}
      onSearch={(word) => {
        dispatch(actions.changeWord(word));
        dispatch(actions.getWord(word));
      }}
    />
  );
}

export default function ReduxApp() {
  return (
    <Provider store={store}>
      <DictionaryContainer />
    </Provider>
  );
}
