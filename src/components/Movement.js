import React from 'react'
import currency from 'currency.js'
import './Movement.css'

class Movement extends React.Component {

  render() {
    const EURO = value => currency(value, { symbol: '', decimal: ',', separator: '.' });
    return (
      <div className="row Movement">
        <div>{this.props.label}</div>
        <div align="right">{EURO(this.props.amount).format()} €</div>
      </div>
    )
  }
}

export default Movement
