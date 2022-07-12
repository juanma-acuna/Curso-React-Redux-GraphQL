import { loginWithGoogle, logoutGoogle, getFavs } from "../firebase";

// constants
const initialData = {
  loggedIn: false,
  fetching: false,
};

const LOGIN = "LOGIN";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_ERROR = "LOGIN_ERROR";
const LOGOUT = "LOGOUT";

const GET_FAVS = "GET_FAVS";
const GET_FAVS_SUCCESS = "GET_FAVS_SUCCESS";
const GET_FAVS_ERROR = "GET_FAVS_ERROR";

// reducer
export default function reducer(state = initialData, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        fetching: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        fetching: false,
        loggedIn: true,
        ...action.payload,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };
    case LOGOUT:
      logoutGoogle();
      localStorage.removeItem("storage");
      return {
        ...initialData,
      };
    case GET_FAVS:
      return {
        ...state,
        fetching: true,
      };
    case GET_FAVS_SUCCESS:
      return {
        ...state,
        fetching: false,
        favorites: action.payload,
      };
    case GET_FAVS_ERROR:
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };
    default:
      return state;
  }
}

function saveStorage(storage) {
  localStorage.setItem("storage", JSON.stringify(storage));
}

export const logoutAction = () => (dispatch) => {
  // logoutGoogle();
  // localStorage.removeItem("storage");
  dispatch({ type: LOGOUT });
};

export const restoreSessionAction = (dispatch) => {
  const storage = localStorage.getItem("storage");
  if (storage && storage.user) {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: JSON.parse(storage.user),
    });
  }
};

// actions or actions creators
export const doGoogleLoginAction = () => (dispatch, getState) => {
  dispatch({ type: LOGIN });
  return loginWithGoogle()
    .then((user) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
      });
      // saveStorage(getState().user);
      saveStorage(getState());
      retrieveFavs()(dispatch, getState);
    })
    .catch((error) => {
      dispatch({
        type: LOGIN_ERROR,
        payload: error,
      });
    });
};

export const retrieveFavs = () => (dispatch, getState) => {
  dispatch({ type: GET_FAVS });
  const uid = getState().user.uid;
  return getFavs(uid)
    .then((array) => {
      dispatch({
        type: GET_FAVS_SUCCESS,
        payload: [...array],
      });
    })
    .catch((error) => {
      dispatch({
        type: GET_FAVS_ERROR,
        payload: error,
      });
    });
};
