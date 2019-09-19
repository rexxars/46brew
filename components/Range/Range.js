// @flow
import React, { PureComponent } from 'react';
import { cx } from 'react-emotion';
import uuid from 'uuid/v4';

import Line from '../Line';
import StyledRange from './StyledRange';

export function stengthToSegments(value: number) {
  const baseline = 3;
  if (value < 33) {
    return baseline - 1;
  }
  if (value > 66) {
    return baseline + 1;
  }
  return baseline;
}

export const createLineSegments = (segments: number) =>
  [...Array(segments)]
    .map((el, index, array) => Math.round(index * (100 / array.length)))
    .filter(Boolean);

type Props = {
  className?: string,
  idleSlider?: string,
  separators?: number,
  activeSliders?: Array<string>,
  onChange: (SyntheticInputEvent<HTMLFormElement>) => void,
  value: number,
};
type State = {
  hasChanged: boolean,
};

class Range extends PureComponent<Props, State> {
  static defaultProps = {
    className: '',
    separators: 1,
    activeSliders: ['😳'],
    idleSlider: '😴',
  };

  state = {
    hasChanged: true, // Disable idle state for now
  };

  onChange = (event: SyntheticInputEvent<HTMLFormElement>) => {
    const { onChange } = this.props;
    this.setState({
      hasChanged: true,
    });
    onChange(event);
  };

  render() {
    const {
      className,
      separators,
      activeSliders,
      idleSlider,
      value,
      onChange,
      ...rest
    } = this.props;

    const { hasChanged } = this.state;

    return (
      <div
        className={cx('relative br3 f4 f3-ns', className)}
        style={{
          backgroundColor: `hsla(48, ${value}%, ${100 - 0.25 * value}%, 1 )`,
        }}>
        {!!separators &&
          createLineSegments(separators).map(separator => (
            <Line key={uuid()} position={separator} />
          ))}
        <StyledRange
          type="range"
          value={value}
          activeSliders={activeSliders}
          idleSlider={idleSlider}
          onChange={this.onChange}
          hasChanged={hasChanged}
          {...rest}
        />
      </div>
    );
  }
}

export default Range;
