import React, { useState } from 'react';
import { QueryClientProvider, QueryClient, useQuery } from 'react-query';
import Dictionary from './Dictionary';
import { fetchWord } from '../api';

function DictionaryContainer() {
  const [word, setWord] = useState('');
  const query = useQuery(['meaning', word], () => fetchWord(word), {
    enabled: word.trim().length > 0,
  });
  return <Dictionary {...query} onSearch={(newWord) => setWord(newWord)} />;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: false,
    },
  },
});

export default function ReactQueryApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <DictionaryContainer />
    </QueryClientProvider>
  );
}
