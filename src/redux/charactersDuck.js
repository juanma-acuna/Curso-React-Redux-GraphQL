import axios from "axios";
import { updateDB } from "../firebase";
import ApolloClient, { gql } from "apollo-boost";

// constants
const initialData = {
  fetching: false,
  array: [],
  current: {},
  favorites: [],
  nextPage: 40,
};

const URL = "https://rickandmortyapi.com/api/character";

const GET_CHARACTERS = "GET_CHARACTERS";
const GET_CHARACTER_SUCCESS = "GET_CHARACTER_SUCCESS";
const GET_CHARACTER_ERROR = "GET_CHARACTER_ERROR";
const REMOVE_CHARACTER = "REMOVE_CHARACTER";
const ADD_TO_FAVORITES = "ADD_TO_FAVORITES";
const UPDATE_PAGE = "UPDATE_PAGE";

const client = new ApolloClient({
  uri: "https://rickandmortyapi.com/graphql",
});

// reducer
export default function reducer(state = initialData, action) {
  switch (action.type) {
    case GET_CHARACTERS:
      return {
        ...state,
        fetching: true,
      };
    case GET_CHARACTER_SUCCESS:
      return {
        ...state,
        fetching: false,
        array: action.payload,
      };
    case GET_CHARACTER_ERROR:
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };
    case REMOVE_CHARACTER:
      return {
        ...state,
        ...action.payload,
      };
    case ADD_TO_FAVORITES:
      return {
        ...state,
        ...action.payload,
      };
    case UPDATE_PAGE:
      return {
        ...state,
        nextPage: action.payload,
      };
    default:
      return state;
  }
}

// actions (thunks)
export const getCharactersAction = async (dispatch, getState) => {
  dispatch({ type: GET_CHARACTERS });
  try {
    const response = await axios.get(URL);
    dispatch({
      type: GET_CHARACTER_SUCCESS,
      payload: response.data.results,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: GET_CHARACTER_ERROR,
      payload: error,
    });
  }
};

export const getCharactersActionGQL = async (dispatch, getState) => {
  dispatch({ type: GET_CHARACTERS });

  let query = gql`
    query Pages($page: Int) {
      characters(page: $page) {
        info {
          pages
          next
          prev
        }
        results {
          id
          name
          image
          species
          status
        }
      }
    }
  `;
  let { nextPage } = getState().characters;
  try {
    const response = await client.query({
      query,
      variables: { page: nextPage },
    });
    dispatch({
      type: GET_CHARACTER_SUCCESS,
      payload: response.data.characters.results,
    });
    dispatch({
      type: UPDATE_PAGE,
      payload: response.data.characters.info.next
        ? response.data.characters.info.next
        : 1,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: GET_CHARACTER_ERROR,
      payload: error,
    });
  }
};

export const removeCharacterAction = () => (dispatch, getState) => {
  let { array } = getState().characters;
  array.shift();
  if (array.length === 0) {
    getCharactersActionGQL(dispatch, getState);
  }
  dispatch({
    type: REMOVE_CHARACTER,
    payload: { array: [...array] },
  });
};

export const addToFavoritesAction = () => (dispatch, getState) => {
  console.log("addToFavoritesAction");
  let { array, favorites } = getState().characters;
  const char = array.shift();
  favorites.push(char);
  const { uid } = getState().user;
  updateDB(favorites, uid);
  dispatch({
    type: ADD_TO_FAVORITES,
    payload: { array: [...array], favorites: [...favorites] },
  });
};
