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

class Recipe extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      numOfRefreshes: 0,
      started: false,
      inverted: false,
      bloomSeconds: BLOOM_SECONDS[0],
      bloomTimerSeconds: 0,
      bloomWaterG: BLOOM_WATER_G[0],
      brewTempC: BREW_TEMP_C[0],
      coffeeWaterRatio: COFFEE_WATER_RATIOS[0],
      grindBrewTime: GRIND_BREWTIME_RATIOS[0],
      clockwiseStirTimes: CLOCKWISE_STIR_TIMES[0],
      anticlockwiseStir: true,
    };
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
      this.setState({bloomTimerSeconds: this.state.bloomSeconds});
    }, 400);
  }

  renderHeatWaterStep() {
    return <div class="recipe__instruction">
      Heat <strong>{this.state.coffeeWaterRatio.water}g</strong> of water
      to <strong>{this.state.brewTempC}°C</strong> /
      <strong>{toFahrenheit(this.state.brewTempC)}°F</strong>.
    </div>;
  }

  renderGrindCoffeeStep() {
    return <div class="recipe__instruction">
      Grind <strong>{this.state.coffeeWaterRatio.coffee}g</strong> of coffee to a {this.state.grindBrewTime.grind} grind.
    </div>;
  }

  renderPourCoffeeStep() {
    return <div class="recipe__instruction">
      Pour in the ground coffee.
    </div>;
  }

  renderInvertStep() {
    if (this.state.inverted) {
      return <div class="recipe__instruction">Place the aeropress in the upside-down orientation.</div>
    } else {
      return <div class="recipe__instruction">Place the aeropress on the mug in the normal orientation with wet filter and cap on.</div>
    }
  }

  renderBloomStep() {
    if (this.state.bloomWaterG > 0) {
      return <div class="recipe__instructions__row">
        <div class="recipe__button-col">
          <Timer
            key={this.state.numOfRefreshes}
            startMessage={'⌛'}
            timerRunningMessage={'⌛'}
            finishedMessage={'Done! ✅'}
            startTimerSeconds={this.state.bloomSeconds} />
        </div>
        <div class="recipe__instruction">
          Add <strong>{this.state.bloomWaterG}g</strong> of water and wait
          <strong> {this.state.bloomSeconds}</strong> seconds
          for the coffee to bloom.
        </div>
      </div>;
    }
  }

  renderAddWaterStep() {
    if (this.state.bloomWaterG > 0) {
      return <div class="recipe__instruction">
        Add the remaining <strong>{this.state.coffeeWaterRatio.water - this.state.bloomWaterG}g</strong> of water.
      </div>;
    } else {
      return <div class="recipe__instruction">
        Add all the water (<strong>{this.state.coffeeWaterRatio.water}g</strong>).
      </div>;
    }
  }

  renderBrewStep() {
    return <div class="recipe__instructions__row">
      <div class="recipe__button-col">
        <Timer
          key={this.state.numOfRefreshes}
          startMessage={'⌛'}
          timerRunningMessage={'⌛'}
          finishedMessage={'Done! ✅'}
          startTimerSeconds={this.state.grindBrewTime.time} />
      </div>
      <div class="recipe__instruction">
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
      return <div class="recipe__instruction">
        { instruction }
      </div>
    }
  }

  renderEndInvertStep() {
    if (this.state.inverted) {
      return <div class="recipe__instruction">
        Wet the filter paper, and put the cap on.
        Place the mug upside-down on the aeropress and flip to be the normal orientation.
      </div>
    }
  }

  renderRecipe() {
    if (this.state.started) {
      return <CSSTransition
          key={0}
          classNames="example"
          timeout={500}
          unmountOnExit
          appear>
            <div class="recipe__instructions">
            <div class="recipe__instructions__row">
              <div class="recipe__button-col"/>
              { this.renderHeatWaterStep() }
            </div>
            <div class="recipe__instructions__row">
              <div class="recipe__button-col"/>
              { this.renderGrindCoffeeStep() }
            </div>
            <div class="recipe__instructions__row">
              <div class="recipe__button-col"/>
              { this.renderInvertStep() }
            </div>
            <div class="recipe__instructions__row">
              <div class="recipe__button-col"/>
              { this.renderPourCoffeeStep() }
            </div>
            { this.renderBloomStep() }
            <div class="recipe__instructions__row">
              <div class="recipe__button-col"/>
              { this.renderAddWaterStep() }
            </div>
            <div class="recipe__instructions__row">
              <div class="recipe__button-col"/>
              { this.renderStirStep() }
            </div>
            { this.renderBrewStep() }
            <div class="recipe__instructions__row">
              <div class="recipe__button-col"/>
              { this.renderEndInvertStep() }
            </div>
            <div class="recipe__instructions__row">
              <div class="recipe__button-col"/>
              <div class="recipe__instruction">Press.</div>
            </div>
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
