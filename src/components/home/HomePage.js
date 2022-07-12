import React from "react";
import Card from "../card/Card";
import styles from "./home.module.css";
import { connect } from "react-redux";
import {
  removeCharacterAction,
  addToFavoritesAction,
} from "../../redux/charactersDuck";

function Home({ characters, removeCharacterAction, addToFavoritesAction }) {
  console.log({ characters });

  function addToFav() {
    addToFavoritesAction();
  }

  function nextCharacter() {
    removeCharacterAction();
  }

  function renderCharacter() {
    let char = characters[0];
    console.log({ char });
    return <Card leftClick={nextCharacter} rightClick={addToFav} {...char} />;
  }

  return (
    <div className={styles.container}>
      <h2>Personajes de Rick y Morty</h2>
      <div>{renderCharacter()}</div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    characters: state.characters.array,
  };
}

export default connect(mapStateToProps, {
  removeCharacterAction,
  addToFavoritesAction,
})(Home);
