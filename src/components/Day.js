import React from 'react'
import './Day.css';
import Movement from './Movement';

class Day extends React.Component {

  render() {
    let items = []
    if (this.props.data.incomes !== undefined) {
      items.push(this.props.data.incomes.filter(function (item) {
        return item["Date"].format("YYYY-MM-DD") === this.props.date
      }, this).map(function (item) {
        return <Movement label={item["Label"]} amount={Number(item["Amount"])} />
      }))
    }
    if (this.props.data.expenses !== undefined) {
      items.push(this.props.data.expenses.filter(function (item) {
        return item["Date"].format("YYYY-MM-DD") === this.props.date
      }, this).map(function (item) {
        let key_notes = Object.keys(item)[4];
        if (item[key_notes] !== undefined && item[key_notes].indexOf("Spesa familiare") !== -1) {
          return <Movement label={item["Label"]} amount={-Number(item["Amount"]) * 0.4} />
        } else {
          return <Movement label={item["Label"]} amount={-Number(item["Amount"])} />
        }
      }))
    }
    return (
      <div
        id={this.props.date}
        className={this.props.disabled ? 'Day d-none d-md-block col-md disabled' : 'Day col-sm-12 col-md'}
      >
        <div>
          <div className="number">{this.props.number}</div>
          {items}
        </div>
      </div>
    )
  }
}

export default Day
