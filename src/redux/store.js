import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import userReducer from "./userDuck";
import charactersReducer, {
  getCharactersAction,
  getCharactersActionGQL,
} from "./charactersDuck";
import { restoreSessionAction } from "./userDuck";
import thunk from "redux-thunk";

let rootReducer = combineReducers({
  user: userReducer,
  characters: charactersReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// export default function generateStore() {
//   let store = createStore(
//     rootReducer,
//     composeEnhancers(applyMiddleware(thunk))
//   );
//   return store;
// }

export const generateStore = () => {
  let store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
  );
  // this action runs when the store is created
  getCharactersActionGQL(store.dispatch, store.getState);
  restoreSessionAction();
  return store;
};
