// @flow
import React from 'react';
import uuidv4 from 'uuid/v4';
import { withTheme } from 'emotion-theming';
import styled, { cx, css } from 'react-emotion';

import { timeToString } from '../lib/formatTime';
import { sumArrayTo } from './BrewTracker/utils';
import PixelShifter from './PixelShifter';
import Stat from './Stat';

type Props = {
  activity: string,
  pourNumber: number,
  currentWeight: number,
  targetWeight: number,
  timeToNextStep: number,
  weightSteps: Array<number>,
  time: number,
};

const getActivityDescription = activity => {
  if (activity === 'pouring') {
    return 'Pour water now';
  }
  if (activity === 'waiting') {
    return 'Wait, let it rest';
  }
  return null;
};

const LineSegment = withTheme(styled.span`
  width: ${props => Math.round(props.w)}%;
  height: 3px;
  background-color: ${props =>
    props.active ? props.theme.colors.peach : props.theme.colors.dusty};
`);

const BrewViz = ({
  activity,
  pourNumber,
  currentWeight,
  targetWeight,
  timeToNextStep,
  weightSteps,
  time = 0,
}: Props) => {
  const sum = sumArrayTo(weightSteps, weightSteps.length);
  const conversionFactor = 100 / sum;

  return (
    <div className="flex justify-between flex-wrap">
      <HelpText>Pour no. {pourNumber}</HelpText>
      <HelpText>{timeToString(time)}</HelpText>

      <div className="w-100">
        {weightSteps.map((el, index) => (
          <LineSegment
            active={pourNumber - 1 === index}
            className="dib br3"
            key={uuidv4()}
            w={el * conversionFactor}
          />
        ))}
      </div>
      <div className="relative w-100 tc">
        <div className="w4 ml5 tr tl-ns dib">
          <PixelShifter reason="Align large number with description" y={11}>
            <span
              className={cx(
                'f-headline lh-solid fw2',
                css`
                  color: ${activity === 'waiting' ? '#AAAAAA' : '#333333'};
                `,
              )}>
              {timeToNextStep}
            </span>
          </PixelShifter>
        </div>
        <HelpText className="bottom-0 absolute w3 ml2">
          {getActivityDescription(activity)}
        </HelpText>
      </div>

      <div className="relative w-100 bt bb flex flex-wrap pv4 mv4 b--light-gray">
        <div className="db ttu tracked tc w-100">Weight</div>
        <Stat desc="Current">{currentWeight}</Stat>
        <Stat desc="Target">{targetWeight}</Stat>
      </div>
    </div>
  );
};

type HelpTextProps = {
  children: React$Node,
  className?: string,
};

const HelpText = ({ children, className = '' }: HelpTextProps = {}) => (
  <span className={cx('dib f6 moon-gray', className)}>{children}</span>
);

export default BrewViz;
