import React from 'react'
import currency from 'currency.js'
import './Movement.css'

class Movement extends React.Component {

  render() {
    const EURO = value => currency(value, { symbol: '', decimal: ',', separator: '.' });
    let amount_class
    if (this.props.amount <= -100){
      amount_class = "e100"
    } else if (this.props.amount <= -50){
      amount_class = "e50"
    } else if (this.props.amount <= -10){
      amount_class = "e10"
    } else if (this.props.amount <= 0){
      amount_class = "e0"
    } else if (this.props.amount >= 1000){
      amount_class = "i1000"
    } else if (this.props.amount >= 100){
      amount_class = "i100"
    } else if (this.props.amount >= 50){
      amount_class = "i50"
    } else if (this.props.amount >= 10){
      amount_class = "i10"
    }
    return (
      <div className={"Movement " + amount_class}>
        <div>{this.props.label}</div>
        <div align="right">{EURO(this.props.amount).format()} €</div>
      </div>
    )
  }
}

export default Movement
