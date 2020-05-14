import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group' // ES6

// 4*3*3*2*4*3*2 = 1728 possibilities
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

function getNewSeed() {
    return Math.floor(Math.random() * 100000) + 1; // 100k possible seeds, gives chance of one combination not occurring of: (1727/1728)^100000=7.24e-26
}

function myRandom(seed) {
  // Taken from https://stackoverflow.com/a/19303725 by Antti Kissaniemi
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function randomElement(items, seed) {
  const r = myRandom(seed)
  console.log(r)
  return items[Math.floor(r*items.length)];
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
    this.handleSeedChange = this.handleSeedChange.bind(this);
    this.handleSeedKeyPress = this.handleSeedKeyPress.bind(this);
    this.state = {
      started: false,
      inverted: false,
      startSeed: null,
      currentSeed: null,
      bloomSeconds: BLOOM_SECONDS[0],
      bloomWaterG: BLOOM_WATER_G[0],
      brewTempC: BREW_TEMP_C[0],
      coffeeWaterRatio: COFFEE_WATER_RATIOS[0],
      grindBrewTime: GRIND_BREWTIME_RATIOS[0],
      clockwiseStirTimes: CLOCKWISE_STIR_TIMES[0],
      anticlockwiseStir: true,
      seedAutoGenerate: true
    };
  }

  handleClick() {
    this.setState({ started: false });
    this.timer = setTimeout(_ => {
      if (this.state.seedAutoGenerate) {
          const s = getNewSeed();
          this.setState({
              startSeed: s,
              currentSeed: s
          })
      } else {
          this.setState({
              currentSeed: this.state.startSeed
          })
      }
      console.log('New click')
      this.setState({
        started: true,
        inverted: this.randomElement([true, false]),
        bloomSeconds: this.randomElement(BLOOM_SECONDS),
        bloomWaterG: this.randomElement(BLOOM_WATER_G),
        brewTempC: this.randomElement(BREW_TEMP_C),
        coffeeWaterRatio: this.randomElement(COFFEE_WATER_RATIOS),
        grindBrewTime: this.randomElement(GRIND_BREWTIME_RATIOS),
        clockwiseStirTimes: this.randomElement(CLOCKWISE_STIR_TIMES),
        anticlockwiseStir: this.randomElement([true, false]),
      })}, 400);
  }
  
  randomElement(element) {
      const e = randomElement(element, this.state.currentSeed)
      // Seed for the next randomElement by getting new random with current seed.
      this.setState({
          currentSeed: myRandom(this.state.currentSeed)
      })
      return e;
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
      return <li>Place the aeropress in the <strong>upside-down</strong> orientation.</li>
    } else {
      return <li>Place the aeropress on the mug in the <strong>normal</strong> orientation with wet filter and cap on.</li>
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
  
  handleSeedChange(event) {
      this.setState({startSeed: event.target.value, seedAutoGenerate: false});
  }
  
  handleSeedKeyPress(event) {
      if (event.key === "Enter") {
          this.handleClick()
      }
  }
  
  renderSeedControls() {
      if (this.state.started || !this.state.seedAutoGenerate) {
          return <div className="seed">
          <label>
              seed:
              <input type="number" min="1" max="100000" value={this.state.startSeed} onChange={this.handleSeedChange} onKeyPress={this.handleSeedKeyPress}/>
          </label>
          </div>;
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
              { this.renderSeedControls() }
              { this.renderRecipe() }
            </CSSTransitionGroup>
          </div>
        </div>
      </div>
    );
  }
}

export default Recipe;
