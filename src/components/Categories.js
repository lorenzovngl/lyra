import React from 'react'
import currency from 'currency.js'
import moment from 'moment'

const EURO = value => currency(value, { symbol: '', decimal: ',', separator: '.' })

class Categories extends React.Component {

  days() {
    const a = moment([2021, 3, 1]) // 3 is April (n-1)
    const today = moment()
    const diff = today.diff(a, 'days')
    return diff
  }

  expensesCategories() {
    let cat = []
    if (this.props.data.expenses !== undefined) {
      let expenses = this.props.data.expenses
      expenses.forEach(function (e) {
        let tag = e.Tags.trim()
        if (tag !== "Affitto") {
          if (cat[tag] === undefined) {
            cat[tag] = 0
          }
          let key_notes = Object.keys(e)[4];
          if (e[key_notes] !== undefined && e[key_notes].indexOf("Spesa familiare") !== -1) {
            cat[tag] += parseFloat(e.Amount) * 0.4
          } else {
            cat[tag] += parseFloat(e.Amount)
          }
        }
      })
    }
    return cat
  }

  render() {
    let expenses = Object.entries(this.expensesCategories())
    let total = 0
    if (expenses.length > 1) {
      total = expenses.map(x => x[1]).reduce((acc, x) => acc + x)
      total = total / this.days() * 30
    }
    expenses = expenses.sort((a, b) => {
      if (a[1] > b[1]) {
        return -1
      }
      if (a[1] < b[1]) {
        return 1
      }
      return 0
    })
    return (
      <div>
        <h3>Expense categories</h3>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Category</th>
              <th scope="col">Amount</th>
              <th scope="col">Percent</th>
            </tr>
          </thead>
          <tbody>
            {
              expenses.map(function (item, index) {
                let amount = item[1] / this.days() * 30
                let perc = (amount / total * 100).toFixed(1)
                return <tr>
                  <td>{index + 1}.</td>
                  <td>{item[0]}</td>
                  <td>{EURO(amount).format()} €</td>
                  <td>{perc} %</td>
                </tr>
              }, this)
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export default Categories
