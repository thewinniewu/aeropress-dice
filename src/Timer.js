import React from 'react';

class Timer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      key: props.key,

      // immutable, passed in
      startTimerSeconds: props.startTimerSeconds,
      startMessage: props.startMessage,
      timerRunningMessage: props.timerRunningMessage,
      finishedMessage: props.finishedMessage,

      // mutable
      started: false,
      finished: false,
      paused: false,
      currentTimerSeconds: props.startTimerSeconds,
    };

    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  toggleTimer() {
    // Do not restart interval if timer was already started, but pause it
    if (this.state.started && !this.state.paused) {
      this.setState({
        paused: true,
      });
      return;
    } else if (this.state.started && this.state.paused) {
      this.setState({
        paused: false,
      });
      return;
    }

    let interval = setInterval(() => {
      if (!this._isMounted || this.state.paused) { return; }

      if (this.state.currentTimerSeconds >= 0) {
        this.setState({
          started: true,
          currentTimerSeconds: this.state.currentTimerSeconds - 0.1
        })
      } else {
        this.setState({finished: true});
        clearInterval(interval)
      }
    }, 100)
  }

  render() {
    let displaySeconds = this.state.currentTimerSeconds.toLocaleString(
      undefined,
      { minimumFractionDigits: 1 }
      )
    let message;
    let buttonClasses = ['btn', 'btn-timer']
    if (!this.state.started) {
      message = <span><strong>{displaySeconds}</strong>s {this.state.startMessage}</span>
      buttonClasses = buttonClasses.concat(['btn-timer--start'])
    }  else if (this.state.currentTimerSeconds > 0) {
      message = <span><strong>{displaySeconds}</strong>s {this.state.timerRunningMessage}</span>
    } else {
      message = <span>{this.state.finishedMessage}</span>
      buttonClasses = buttonClasses.concat(['btn-timer--finished'])
    }

    return (
      <button
        className={buttonClasses.join(' ')}
        onClick={this.toggleTimer.bind(this)}>
        {message}
      </button>
      )
  }
}

export default Timer;
