import React, { useEffect, useState } from "react";
import Card from "../card/Card";
import styles from "./home.module.css";
import { connect } from "react-redux";

import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import {
  removeCharacterAction,
  addToFavoritesAction,
} from "../../redux/charactersDuck";

function GraphQlHome({ removeCharacterAction, addToFavoritesAction }) {
  const [chars, setChars] = useState([]);

  let query = gql`
    query {
      characters {
        info {
          count
          pages
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

  function addToFav() {
    addToFavoritesAction();
  }

  function nextCharacter() {
    chars.shift();
    setChars([...chars]);
  }

  function renderCharacter() {
    let char = chars[0];
    console.log({ char });
    return <Card leftClick={nextCharacter} rightClick={addToFav} {...char} />;
  }

  let { loading, error, data } = useQuery(query);

  useEffect(() => {
    if (data && !loading && !error) {
      setChars([...data.characters.results]);
    }
  }, [data, loading, error]);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className={styles.container}>
      <h2>Personajes de Rick y Morty</h2>
      <div>{renderCharacter()}</div>
    </div>
  );
}

export default connect(null, {
  removeCharacterAction,
  addToFavoritesAction,
})(GraphQlHome);
