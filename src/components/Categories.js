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

  expensesCategories(months) {
    let cat = []
    let starting_month = moment().startOf('month').subtract(months, 'months')
    if (this.props.data.expenses !== undefined) {
      let expenses = this.props.data.expenses
      expenses.filter(x => x.Date > starting_month).forEach(function (e) {
        let tag = e.Tags.trim()
        if (cat[tag] === undefined) {
          cat[tag] = {}
        }
        if (cat[tag]['total'] === undefined) {
          cat[tag]['total'] = 0
        }
        if (cat[tag][e['Date'].format('YYYY-MM')] === undefined) {
          cat[tag][e['Date'].format('YYYY-MM')] = 0
        }
        cat[tag][e['Date'].format('YYYY-MM')] += parseFloat(e.Amount)
        if (e['Date'].format('YYYY-MM') !== moment().format('YYYY-MM')){
          cat[tag]['total'] += parseFloat(e.Amount)
        }
      })
    }
    return cat
  }

  render() {
    let n_months = 4
    let expenses = Object.entries(this.expensesCategories(n_months))
    let total = 0
    if (expenses.length > 1) {
      total = expenses.map(x => x[1]['total']).reduce((acc, x) => acc + x)
      total = total / n_months
    }
    expenses = expenses.sort((a, b) => {
      if (a[1]['total'] > b[1]['total']) {
        return -1
      }
      if (a[1]['total'] < b[1]['total']) {
        return 1
      }
      return 0
    })
    let months = []
    let m = moment()
    for (let i = 0; i <= n_months; i++) {
      months.push(m.clone())
      m.subtract(1, 'months')
    }
    return (
      <div>
        <h3>Expense categories</h3>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Category</th>
              <th scope="col">Amount/month</th>
              <th scope="col">Percent</th>
              {
                months.map(function (item, index) {
                  return <th scope="col">{item.format('MMMM YYYY')}</th>
                })
              }
            </tr>
          </thead>
          <tbody>
            {
              expenses.map(function (item, index) {
                let avg_amount = item[1]['total'] / n_months
                let perc = (avg_amount / total * 100).toFixed(1)
                return <tr>
                  <td>{index + 1}.</td>
                  <td>{item[0]}</td>
                  <td>{EURO(avg_amount).format()} €</td>
                  <td>{perc} %</td>
                  {
                    months.map(function (i, index) {
                      let amount = item[1][i.format('YYYY-MM')]
                      if (amount > 0) {
                        let clName = "text-danger"
                        if (amount < avg_amount) {
                          clName = "text-success"
                        }
                        return <td>
                          <span className={clName}>{EURO(amount).format()} €</span>
                        </td>
                      } else {
                        return <td>
                          <span className="text-muted">-</span>
                        </td>
                      }
                    })
                  }
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
