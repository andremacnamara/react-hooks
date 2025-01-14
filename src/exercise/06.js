// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary';

import {fetchPokemon, PokemonInfoFallback, PokemonDataView, PokemonForm} from '../pokemon'

// class ErrorBoundary extends React.Component {
//   state = {error: null};

//   static getDerivedStateFromError(error) {
//     return {error};
//   }

//   render(){
//     const {error} = this.state;
//     if(error){
//       return <this.props.FallbackComponent error={error} />
//     }

//     return this.props.children;
//   }

// }

function PokemonInfo({pokemonName}) {
  // const [pokemon, setPokemon] = React.useState(null);
  // const [error, setError] = React.useState('');
  // const [status, setStatus] = React.useState('idle');

  const [state, setState] = React.useState({ 
    pokemon: null,
    error: null,
    status: 'idle' 
  });
  
  const {pokemon, error, status} = state;

  React.useEffect(() => {
    if(!pokemonName) return;

    setState({status: 'pending'});
    // setError(null);
    // setPokemon(null);

    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({status: 'resolved', pokemon});
      }, 
      
      error => {
        setState({status: 'rejected', error});
      }
    );

  }, [pokemonName]);
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => { /* update all the state here */},
  //   )
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  // 💣 remove this
  if(status === 'idle') {
    return 'Submit a pokemon';
  } else if(status === 'pending'){
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected'){
    throw error // This will be handled by our error boundary.
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('This should be impossible')
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}


function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
