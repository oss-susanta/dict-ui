import axios from 'redaxios';

const PROXY_API = 'https://thingproxy.freeboard.io/fetch';
const DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export async function fetchWord(word) {
  return axios
    .get(`${PROXY_API}/${DICTIONARY_API}/${word}`)
    .then((response) => response.data)
    .catch((response) => {
      throw {
        status: response.status,
        message: response.data.message,
        title: response.data.title,
      };
    });
}
