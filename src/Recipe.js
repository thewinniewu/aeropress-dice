import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Timer from './Timer.js';

const COFFEE_WATER_RATIOS = [
  { coffee: 23, water: 200 },
  { coffee: 18, water: 250 },
  { coffee: 15, water: 250 },
  { coffee: 12, water: 200 }
];

const GRIND_BREWTIME_RATIOS = [
  { grind: 'fine', time: 60 },
  { grind: 'medium', time: 90 },
  { grind: 'coarse', time: 120 }
];

const BLOOM_SECONDS = [20, 30, 40];
const BLOOM_WATER_G = [30, 60];
const BREW_TEMP_C = [80, 85, 90, 95];
const CLOCKWISE_STIR_TIMES = [0, 1, 2];

function randomElement(items) {
  return items[Math.floor(Math.random()*items.length)];
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

function formatTimeEnglish(times) {
  if (times === 1) {
    return 'once';
  } else {
    return '' + times + ' times';
  }
}

function hashToRecipe(hash) {
  if (!hash) { return {} }
  return JSON.parse(atob(hash));
}

class Recipe extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

    let recipe = hashToRecipe(props.recipeHash);

    this.state = {
      numOfRefreshes: 0,
      started: props.recipeHash != null,
      inverted: recipe[0] || false,
      bloomSeconds: BLOOM_SECONDS[recipe[1]] || BLOOM_SECONDS[0],
      bloomWaterG: BLOOM_WATER_G[recipe[2]] || BLOOM_WATER_G[0],
      brewTempC: BREW_TEMP_C[recipe[3]] || BREW_TEMP_C[0],
      coffeeWaterRatio: COFFEE_WATER_RATIOS[recipe[4]] || COFFEE_WATER_RATIOS[0],
      grindBrewTime: GRIND_BREWTIME_RATIOS[recipe[5]] || GRIND_BREWTIME_RATIOS[0],
      clockwiseStirTimes: CLOCKWISE_STIR_TIMES[recipe[6]] || CLOCKWISE_STIR_TIMES[0],
      anticlockwiseStir: recipe[7] || true,
      recipeHash: hashToRecipe(props.recipeHash),
    };
  }

  recipeToHash() {
    let recipe = [
      this.state.inverted ? 1 : 0, // 0
      BLOOM_SECONDS.indexOf(this.state.bloomSeconds), // 1
      BLOOM_WATER_G.indexOf(this.state.bloomWaterG), // 2
      BREW_TEMP_C.indexOf(this.state.brewTempC), // 3
      COFFEE_WATER_RATIOS.indexOf(this.state.coffeeWaterRatio), // 4
      GRIND_BREWTIME_RATIOS.indexOf(this.state.grindBrewTime), // 5
      CLOCKWISE_STIR_TIMES.indexOf(this.state.clockwiseStirTimes), // 6
      this.state.anticlockwiseStir ? 1 : 0, // 7
    ]
    return btoa(JSON.stringify(recipe));
  }

  recipeUrl() {
    return "https://thewinniewu.github.io/aeropress-dice?recipe=" + this.recipeToHash();
  }

  handleClick() {
    this.setState({ started: false, animating: true, numOfRefreshes: this.state.numOfRefreshes + 1 });
    this.timer = setTimeout(_ => {
      this.setState({
        started: true,
        inverted: randomElement([true, false]),
        bloomSeconds: randomElement(BLOOM_SECONDS),
        bloomWaterG: randomElement(BLOOM_WATER_G),
        brewTempC: randomElement(BREW_TEMP_C),
        coffeeWaterRatio: randomElement(COFFEE_WATER_RATIOS),
        grindBrewTime: randomElement(GRIND_BREWTIME_RATIOS),
        clockwiseStirTimes: randomElement(CLOCKWISE_STIR_TIMES),
        anticlockwiseStir: randomElement([true, false]),
      });
    }, 400);
  }

  renderHeatWaterStep() {
    return <div className="recipe__instruction">
      Heat <strong>{this.state.coffeeWaterRatio.water}g</strong> of water
      to <strong>{this.state.brewTempC}°C</strong> /
      <strong>{toFahrenheit(this.state.brewTempC)}°F</strong>.
    </div>;
  }

  renderGrindCoffeeStep() {
    return <div className="recipe__instruction">
      Grind <strong>{this.state.coffeeWaterRatio.coffee}g</strong> of coffee to a {this.state.grindBrewTime.grind} grind.
    </div>;
  }

  renderPourCoffeeStep() {
    return <div className="recipe__instruction">
      Pour in the ground coffee.
    </div>;
  }

  renderInvertStep() {
    if (this.state.inverted) {
      return <div className="recipe__instruction">Place the aeropress in the upside-down orientation.</div>
    } else {
      return <div className="recipe__instruction">Place the aeropress on the mug in the normal orientation with wet filter and cap on.</div>
    }
  }

  renderBloomStep() {
    if (this.state.bloomWaterG > 0) {
      return <div className="recipe__instructions__row">
        <div className="recipe__button-col">
          <Timer
            key={this.state.numOfRefreshes}
            startMessage={'⌛'}
            timerRunningMessage={'⌛'}
            finishedMessage={'Done! ✅'}
            startTimerSeconds={this.state.bloomSeconds} />
        </div>
        <div className="recipe__instruction">
          Add <strong>{this.state.bloomWaterG}g</strong> of water and wait
          <strong> {this.state.bloomSeconds}</strong> seconds
          for the coffee to bloom.
        </div>
      </div>;
    }
  }

  renderAddWaterStep() {
    if (this.state.bloomWaterG > 0) {
      return <div className="recipe__instruction">
        Add the remaining <strong>{this.state.coffeeWaterRatio.water - this.state.bloomWaterG}g</strong> of water.
      </div>;
    } else {
      return <div className="recipe__instruction">
        Add all the water (<strong>{this.state.coffeeWaterRatio.water}g</strong>).
      </div>;
    }
  }

  renderBrewStep() {
    return <div className="recipe__instructions__row">
      <div className="recipe__button-col">
        <Timer
          key={this.state.numOfRefreshes}
          startMessage={'⌛'}
          timerRunningMessage={'⌛'}
          finishedMessage={'Done! ✅'}
          startTimerSeconds={this.state.grindBrewTime.time} />
      </div>
      <div className="recipe__instruction">
        Wait <strong>{this.state.grindBrewTime.time}s</strong> to brew.
      </div>
    </div>;
  }

  renderStirStep() {
    if (this.state.clockwiseStirTimes > 0) {
      let instruction = ''
      instruction += 'Stir ' + formatTimeEnglish(this.state.clockwiseStirTimes) + ' in one direction.';
      if (this.state.anticlockwiseStir) {
        instruction += ' Repeat in the other direction.'
      }
      return <div className="recipe__instruction">
        { instruction }
      </div>
    }
  }

  renderEndInvertStep() {
    if (this.state.inverted) {
      return <div className="recipe__instruction">
        Wet the filter paper, and put the cap on.
        Place the mug upside-down on the aeropress and flip to be the normal orientation.
      </div>
    }
  }

  renderInstructions() {
    return <div className="recipe__instructions">
      <div className="recipe__instructions__row">
        <div className="recipe__button-col"/>
        { this.renderHeatWaterStep() }
      </div>
      <div className="recipe__instructions__row">
        <div className="recipe__button-col"/>
        { this.renderGrindCoffeeStep() }
      </div>
      <div className="recipe__instructions__row">
        <div className="recipe__button-col"/>
        { this.renderInvertStep() }
      </div>
      <div className="recipe__instructions__row">
        <div className="recipe__button-col"/>
        { this.renderPourCoffeeStep() }
      </div>
      { this.renderBloomStep() }
      <div className="recipe__instructions__row">
        <div className="recipe__button-col"/>
        { this.renderAddWaterStep() }
      </div>
      <div className="recipe__instructions__row">
        <div className="recipe__button-col"/>
        { this.renderStirStep() }
      </div>
      { this.renderBrewStep() }
      <div className="recipe__instructions__row">
        <div className="recipe__button-col"/>
        { this.renderEndInvertStep() }
      </div>
      <div className="recipe__instructions__row">
        <div className="recipe__button-col"/>
        <div className="recipe__instruction">Press.</div>
      </div>
    </div>
  }

  renderShare() {
    return <div className="recipe-share">
      <strong>Liked this recipe?</strong>
      <div className="recipe-share__text">Save or share this URL to find it again!</div>
      <input className="recipe-share__textbox" readOnly={true} value={this.recipeUrl()} onFocus={(e) => e.target.select()} />
    </div>;
  }

  renderRecipe() {
    if (this.state.started) {
      return <CSSTransition
          key={0}
          classNames="example"
          timeout={500}
          unmountOnExit
          appear>
            <div className="recipe">
              { this.renderInstructions() }
              { this.renderShare() }
            </div>
        </CSSTransition>;
    } else {
      return <CSSTransition
          key={1}
          classNames="example"
          timeout={500}
          unmountOnExit
          appear>
        <div/>
      </CSSTransition>;
    }
  }

  render() {
    return (
      <div className="App-recipe">
        <h1>
          <button className="btn btn-primary" onClick={this.handleClick.bind(this)}>
            Generate a Recipe
          </button>
        </h1>
        <div className="card">
          <div className="card-block">
            <TransitionGroup>
              { this.renderRecipe() }
            </TransitionGroup>
          </div>
        </div>
      </div>
    );
  }
}

export default Recipe;
