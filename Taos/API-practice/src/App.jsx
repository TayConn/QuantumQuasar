import { useState, useEffect, useRef } from "react";
import "./App.css";

// State variable for data
function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pokemonSearch, setPokemonSearch] = useState("");
  const [pokemonData, setPokemonData] = useState(null);
  const [pokemonNames, setPokemonNames] = useState([]);
  const debounceTimeout = useRef(null); // Reference for debounce timeout
  const formRef = useRef(null); // Reference for the form
  const apiToken = "https://pokeapi.co/api/v2/pokemon/";

  useEffect(() => {
    // Check if pokemonSearch is empty
    if (pokemonSearch.trim() === "") {
      setPokemonSearch(""); // Set default search term
    } else {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        fetchPokemonData(pokemonSearch);
      }, 1000);
    }
    fetchAllPokemonNames(); // Fetch all Pokémon names on component mount
  }, [pokemonSearch]);

  const fetchPokemonData = (pokemonName) => {
    fetch(apiToken + pokemonName)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Pokemon not found!"); // Throw an error if response is not ok
        }
        return res.json();
      })
      .then(
        (result) => {
          setIsLoaded(true);
          setPokemonData(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  const fetchAllPokemonNames = () => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
      .then((res) => res.json())
      .then((data) => {
        const names = data.results.map((pokemon) => pokemon.name).sort();
        setPokemonNames(names);
      })
      .catch((error) => {
        console.error("Error fetching Pokémon names:", error);
      });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetchPokemonData(pokemonSearch);
  };

  const handleInputChange = (e) => {
    setPokemonSearch(e.target.value);
  };

  const handleNameClick = (name, e) => {
    e.preventDefault();
    setPokemonSearch(name);
    //formRef.current.submit();
  };

  return (
    <div className="pokedex-body">
      <h1>Poke-search</h1>
      <form onSubmit={handleFormSubmit} ref={formRef}>
        <input
          id="pokemonSearch"
          type="text"
          name="pokemonSearch"
          value={pokemonSearch}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleFormSubmit(e);
            }
          }}
          required
        />
        <button type="submit">Show me a new Pokemon!</button>
      </form>
      <div className="dropdown">
        {pokemonNames.map((name, index) => (
          <div
            key={index}
            onClick={(e) => handleNameClick(name, e)} // Pass the name to handleNameClick
            className="list-hover"
          >
            {name}
          </div>
        ))}
      </div>
      {/* Display error message if error */}
      {error && error.message && (
        <div className="errorMessage">
          <strong>
            Oops! Something went wrong. Did you check your spelling?
          </strong>
          <br /> Error: {error.message}
          <button onClick={() => window.location.reload()}>Try again!</button>
        </div>
      )}
      {/* Display Pokémon details if loaded */}
      {isLoaded && pokemonData && (
        <div className="category-cols" key={pokemonData.id}>
          <div className="details-col">
            <h3>#</h3>
            <p>{pokemonData.id}</p>
          </div>
          <div className="details-col">
            <h3>Name:</h3>
            <p>{pokemonData.name}</p>
          </div>
          <div className="details-col">
            <h3>Weight:</h3>
            <p>{pokemonData.weight}</p>
          </div>
          <div className="details-col">
            <h3>Type:</h3>
            <p>
              {pokemonData.types.map((types) => types.type.name).join(", ")}
            </p>
          </div>
          <div className="details-col">
            <h3>Abilities:</h3>
            <p className="details-list">
              {pokemonData.abilities
                .map((ability) => ability.ability.name)
                .join(", ")}
            </p>
          </div>
          <div className="sprites">
            <div className="image-col">
              <h3>Normal</h3>
              <img
                className="pokemon-img"
                src={pokemonData.sprites.front_default}
                alt={pokemonData.name}
              />
            </div>
            <div className="image-col">
              <h3>Shiny</h3>
              <img
                className="pokemon-img"
                src={pokemonData.sprites.front_shiny}
                alt={pokemonData.name}
              />
            </div>
          </div>
        </div>
      )}
      {/* Display loading state if not loaded */}
      {!isLoaded && <div>Loading...</div>}
      {error && (
        <div className="errorMessage">
          <strong>
            Oops! Something went wrong. Did you check your spelling?
          </strong>
          <br /> Error: {error.message}
          <button onClick={() => window.location.reload()}>Try again!</button>
        </div>
      )}
    </div>
  );
}

export default App;
