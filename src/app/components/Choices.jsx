import React, {Component} from 'react';
import Choice from './Choice';

class Choices extends Component {
  state = {
    selections: []
  }

  constructor(props) {
    super(props);
  }

  handleChange = (event, index, value, rank) => {
    const selections = this.state.selections;
    const nextSelections = this.props.options.map((option, index) => {
      const selection = selections[index];
      if (index == rank) {
        return value;
      }
      // If value has already been selected elsewhere, null it out
      if (selection === value) {
        return null;
      }
      return selection;
    });
    this.setState({selections: nextSelections});
    this.props.onChange(nextSelections);
  }

  getChangeHandler = (rank) => (event, index, value) => this.handleChange(event, index, value, rank);

  render() {
    return (
      <div>
        {this.props.options.map((opt, i) => {
          return (
            <Choice
              key={i}
              rank={i}
              options={this.props.options}
              value={this.state.selections[i]}
              onChange={this.getChangeHandler(i)}
            />
          );
        })}
      </div>
    );
  }
}

export default Choices;
