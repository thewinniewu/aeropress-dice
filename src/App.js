import './App.css';
import Recipe from './Recipe.js';
import aeropress from './aeropress.svg';
import React from 'react';
// import useQueryParam from './useQueryParam';
// import { useState } from 'react';

class App extends React.Component {

  render() {
    const recipeHash = new URLSearchParams(window.location.search).get('recipe');

    return (
      <div className="App">
          <header className="App-header">
            <img src={aeropress} className="App-logo" alt="logo" />
            <h1 className="App-title">Random Aeropress Recipe</h1>
          </header>
          <Recipe recipeHash={recipeHash}/>
          <footer className="App-footer">
            <p>
              Built with &hearts; by <a href="https://github.com/thewinniewu">thewinniewu</a>
              <br/>
               Inspired by <a href="https://web.archive.org/web/20171208104650/https://jimseven.com/2017/12/06/coffee-brewing-dice/" target="_blank" rel="noopener noreferrer">
                 James Hoffmann’s Coffee Brewing Dice
               </a> | Aeropress icon made by <a href="https://www.flaticon.com/authors/monkik" target="_blank" rel="noopener noreferrer">
                 monkik
               </a>
            </p>
          </footer>
        </div>
    );
  }
}

export default App;
