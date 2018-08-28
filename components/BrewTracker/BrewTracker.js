// @flow
import { PureComponent } from 'react';
import { type UnitType } from '../../FlowTypes';
import {
  getTimeToNextStep,
  sumArrayTo,
  TIME_BETWEEN_POURS,
  POUR_TIME,
} from './utils';
import stateMachine from './brewStateMachine';

// eslint doesnt seem to understand getDerivedStateFromProps...

export type Props = {
  children: ({|
    activity: string,
    pourNumber: number,
    currentWeight: number,
    targetWeight: number,
    timeToNextStep: number,
  |}) => React$Node,
  onFinished: () => void,
  time: number, // eslint-disable-line
  taste: number, // eslint-disable-line
  strength: number, // eslint-disable-line
  baseWeight: number, // eslint-disable-line
  baseMesurement: ?UnitType, // eslint-disable-line
  resetWeight?: number,
};

export type State = {|
  pourNumber: number,
  pouringTimeTarget: number,
  waitingTimeTarget: number,
  weightSteps: Array<number>,
  activity: 'start' | 'pouring' | 'waiting' | 'done',
|};

class BrewTracker extends PureComponent<Props, State> {
  static defaultProps = {
    resetWeight: 0,
  };

  static getDerivedStateFromProps(
    nextProps: Props,
    prevState: State,
  ): State | null {
    return stateMachine(nextProps, prevState);
  }

  state = {
    pourNumber: 0,
    pouringTimeTarget: POUR_TIME, // eslint-disable-line
    waitingTimeTarget: TIME_BETWEEN_POURS + POUR_TIME, // eslint-disable-line
    weightSteps: [],
    activity: 'start',
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { onFinished, time } = this.props;
    const { activity, pouringTimeTarget, waitingTimeTarget } = this.state;

    if (prevState.pouringTimeTarget !== pouringTimeTarget) {
      console.log(
        `${time} pour target changed from ${
          prevState.pouringTimeTarget
        } to ${pouringTimeTarget}`,
      );
    }
    if (prevState.waitingTimeTarget !== waitingTimeTarget) {
      console.log(
        `${time} waiting target changed from ${
          prevState.waitingTimeTarget
        } to ${waitingTimeTarget}`,
      );
    }

    if (prevState.activity !== activity) {
      console.log('activity changed to', activity);
    }
    if (activity === 'done' && prevState.activity !== 'done') {
      onFinished();
    }
  }

  render() {
    const { children, resetWeight, time } = this.props;
    const { activity, pourNumber, weightSteps } = this.state;

    if (typeof children !== 'function') {
      throw new Error(
        'This component uses render props, children must be invokable',
      );
    }

    return children({
      activity,
      pourNumber: pourNumber + 1, // For non-zero indexed people
      currentWeight:
        activity === 'done'
          ? sumArrayTo(weightSteps, pourNumber + 1 + resetWeight)
          : sumArrayTo(weightSteps, pourNumber) + resetWeight,
      targetWeight:
        activity === 'done'
          ? 0
          : sumArrayTo(weightSteps, pourNumber + 1) + resetWeight,
      timeToNextStep: getTimeToNextStep(this.state, time),
    });
  }
}

export default BrewTracker;
