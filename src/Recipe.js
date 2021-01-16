import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group' // ES6

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
      started: false,
      inverted: false,
      bloomSeconds: BLOOM_SECONDS[0],
      bloomWaterG: BLOOM_WATER_G[0],
      brewTempC: BREW_TEMP_C[0],
      coffeeWaterRatio: COFFEE_WATER_RATIOS[0],
      grindBrewTime: GRIND_BREWTIME_RATIOS[0],
      clockwiseStirTimes: CLOCKWISE_STIR_TIMES[0],
      anticlockwiseStir: true,
      bloomTimerSeconds: 0,
      brewTimerSeconds: 0
    };
  }

  handleClick() {
    this.setState({ started: false });
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
        bloomTimerSeconds: 0,
        brewTimerSeconds: 0
      })}, 400);
  }

  renderHeatWaterStep() {
    return <li>
      Heat <strong>{this.state.coffeeWaterRatio.water}g</strong> of water
      to <strong>{this.state.brewTempC}°C</strong> /
      <strong>{toFahrenheit(this.state.brewTempC)}°F</strong>.
    </li>;
  }

  renderGrindCoffeeStep() {
    return <li>
      Grind <strong>{this.state.coffeeWaterRatio.coffee}g</strong> of coffee to a {this.state.grindBrewTime.grind} grind.
    </li>;
  }

  renderPourCoffeeStep() {
    return <li>
      Pour in the ground coffee.
    </li>;
  }

  renderInvertStep() {
    if (this.state.inverted) {
      return <li>Place the aeropress in the upside-down orientation.</li>
    } else {
      return <li>Place the aeropress on the mug in the normal orientation with wet filter and cap on.</li>
    }
  }

  renderBloomStep() {
    if (this.state.bloomWaterG > 0) {
      return <li>
        Add <strong>{this.state.bloomWaterG}g</strong> of water and wait
        <strong> {this.state.bloomSeconds}</strong> seconds
        for the coffee to bloom.
      </li>;
    }
  }

  renderAddWaterStep() {
    if (this.state.bloomWaterG > 0) {
      return <li>
        Add the remaining <strong>{this.state.coffeeWaterRatio.water - this.state.bloomWaterG}g</strong> of water.
      </li>;
    } else {
      return <li>
        Add all the water (<strong>{this.state.coffeeWaterRatio.water}g</strong>).
      </li>;
    }
  }

  renderBrewStep() {
    return <li>
      Wait <strong>{this.state.grindBrewTime.time}s</strong> to brew.
    </li>;
  }

  renderStirStep() {
    if (this.state.clockwiseStirTimes > 0) {
      let instruction = ''
      instruction += 'Stir ' + formatTimeEnglish(this.state.clockwiseStirTimes) + ' in one direction.';
      if (this.state.anticlockwiseStir) {
        instruction += ' Repeat in the other direction.'
      }
      return <li>
        { instruction }
      </li>
    }
  }

  renderEndInvertStep() {
    if (this.state.inverted) {
      return <li>
        Wet the filter paper, and put the cap on.
        Place the mug upside-down on the aeropress and flip to be the normal orientation.
      </li>
    }
  }

  renderRecipe() {
    if (this.state.started) {
      return <ol key="k">
        { this.renderHeatWaterStep() }
        { this.renderGrindCoffeeStep() }
        { this.renderInvertStep() }
        { this.renderPourCoffeeStep() }
        { this.renderBloomStep() }
        { this.renderAddWaterStep() }
        { this.renderStirStep() }
        { this.renderBrewStep() }
        { this.renderEndInvertStep() }
        <li>
          Press.
        </li>
      </ol>;
    }
  }
   
  startBlooming() {
      let interval = setInterval(() => {
          if (this.state.bloomTimerSeconds < this.state.bloomSeconds) {
              this.setState({
                  bloomTimerSeconds: this.state.bloomTimerSeconds + 0.1
              })
          } else {
              clearInterval(interval)
          }
      }, 100)
  }
  
  renderBloomTimer() {
      if (this.state.started) {
          let remainingSeconds = this.state.bloomSeconds - this.state.bloomTimerSeconds
          if (remainingSeconds < 0) {
              remainingSeconds = 0;
          }
          let displaySeconds = remainingSeconds.toLocaleString(
                      undefined,
                      { minimumFractionDigits: 1 }
          )
          return (
              <button className="btn btn-secondary" onClick={this.startBlooming.bind(this)}>
                Start Blooming {displaySeconds}
              </button>
          )
      }
  }
  
  startBrewing() {
      let interval = setInterval(() => {
          if (this.state.brewTimerSeconds < this.state.grindBrewTime.time) {
              this.setState({
                  brewTimerSeconds: this.state.brewTimerSeconds + 0.1
              })
          } else {
              clearInterval(interval)
          }
      }, 100)
  }
  
  renderBrewTimer() {
      if (this.state.started) {
          let remainingSeconds = this.state.grindBrewTime.time - this.state.brewTimerSeconds
          if (remainingSeconds < 0) {
              remainingSeconds = 0;
          }
          let displaySeconds = remainingSeconds.toLocaleString(
                      undefined,
                      { minimumFractionDigits: 1 }
          )
          return (
              <button className="btn btn-secondary" onClick={this.startBrewing.bind(this)}>
                Start Brewing {displaySeconds}
              </button>
          )
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
            <CSSTransitionGroup
            transitionName="example"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}>
              { this.renderRecipe() }
            <div className="button-block">
              <span>
                { this.renderBloomTimer() }
              </span>
              <span>&nbsp;</span>
              <span>
                { this.renderBrewTimer() }
              </span>
            </div>
            </CSSTransitionGroup>
          </div>
        </div>
      </div>
    );
  }
}

export default Recipe;
