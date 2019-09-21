// @flow
import React, { PureComponent } from 'react';

import { coffeeConverter, coffeeToWater } from '../lib/conversion';

import { COFFE_CUP_SIZE } from '../lib/constants';
import InlineInput from './InlineInput';
import ColorButton from './ColorButton';

type Props = {
  onCompleted: ({ baseWeight: number }) => void,
};
type State = {
  value: number,
  inputError: boolean,
};

class SetAmountStep extends PureComponent<Props, State> {
  state = {
    value: 0,
    inputError: false,
  };

  completeStep = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { onCompleted } = this.props;
    const { value } = this.state;
    if (value) {
      onCompleted({
        baseWeight: value,
      });
    } else {
      this.setState({
        inputError: true,
      });
    }
  };

  handleChange = (event: SyntheticInputEvent<HTMLFormElement>) => {
    const { value } = event.target;
    if (!Number.isNaN(Number(value))) {
      this.setState({
        value: Number(value),
        inputError: false,
      });
    }
  };

  getType = (value: number) => (value > 100 ? 'water' : 'coffee');

  render() {
    const { value, inputError } = this.state;
    const converted = coffeeConverter(value) || 0;
    const cups =
      Math.round(Number(coffeeToWater(value) / COFFE_CUP_SIZE) * 10) / 10;

    return (
      <form onSubmit={this.completeStep}>
        <p className="f3">
          Please let me know how much coffee (or water) you are going to use:
          <InlineInput
            type="number"
            className="ph1"
            value={value}
            onChange={this.handleChange}
            error={inputError}
          />{' '}
          {`g of ${this.getType(value)}.`}
        </p>
        <span className="db lh-copy fw5">That is...</span>
        <span className="ml3 db lh-copy">
          {converted} grams of {this.getType(converted)}
        </span>
        <span className="ml3 db mb3 lh-copy">{cups} cups of coffee</span>
        <ColorButton type="submit">Next</ColorButton>
      </form>
    );
  }
}

export default SetAmountStep;
