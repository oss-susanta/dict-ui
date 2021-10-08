import React, { useReducer } from 'react';
import Dictionary from './Dictionary';
import { fetchWord } from '../api';

const initialState = {
  word: '',
  status: 'init',
  error: null,
  data: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'request':
      return {
        ...state,
        status: 'loading',
        error: null,
      };
    case 'success':
      return {
        ...state,
        status: 'success',
        data: action.payload,
      };
    case 'error':
      return {
        ...state,
        status: 'error',
        error: action.payload,
      };
    case 'word':
      return {
        ...state,
        word: action.payload,
      };
    default:
      return state;
  }
}

export default function ReactApp() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getWord = async (word) => {
    if (word.trim().length === 0) return;
    dispatch({ type: 'request' });
    try {
      const data = await fetchWord(word);
      dispatch({ type: 'success', payload: data });
    } catch (error) {
      dispatch({ type: 'error', payload: error });
    }
  };

  return (
    <Dictionary
      {...state}
      refetch={() => getWord(state.word)}
      onSearch={(word) => {
        dispatch({ type: 'word', payload: word });
        getWord(word);
      }}
    />
  );
}
