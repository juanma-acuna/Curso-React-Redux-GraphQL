import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANco-U1Ai84ThmAO-wc5B4Jfsfb9NeOTw",
  authDomain: "authtestrickmorty.firebaseapp.com",
  projectId: "authtestrickmorty",
  storageBucket: "authtestrickmorty.appspot.com",
  messagingSenderId: "989268260852",
  appId: "1:989268260852:web:317a23d02a3f5abf5feba1",
  measurementId: "G-L93M2LJ7VX",
};

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore().collection("favs");

export function updateDB(array, uid) {
  return db.doc(uid).set({
    array,
  });
}

export function loginWithGoogle() {
  let provider = new firebase.auth.GoogleAuthProvider();
  return firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      return result.user;
    });
}

export function logoutGoogle() {
  firebase.auth().signOut();
}

// export function getFavs(uid) {
//   return db
//     .doc(uid)
//     .get()
//     .then((doc) => {
//       return doc.data().array;
//     });
// }

export async function getFavs(uid) {
  const doc = await db.doc(uid).get();
  return doc.data().array;
}
