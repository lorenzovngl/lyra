import React from 'react'
import currency from 'currency.js'

const EURO = value => currency(value, { symbol: '', decimal: ',', separator: '.' })

class Categories extends React.Component {

  expensesCategories() {
    let cat = []
    if (this.props.expenses !== undefined) {
      let expenses = this.props.expenses
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
      total = total / this.props.days * 30
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
    console.log(expenses)
    const chartData = {
      labels: expenses.map(x => x[0]),
      datasets: [
        {
          labels: 'Amount',
          data: expenses.map(x => x[1] / this.props.days * 30),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        }
      ]
    }
    const options = {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    };
    return (
      <div>
        <h3>Expense categories</h3>
        <table class="table">
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
                let amount = item[1] / this.props.days * 30
                let perc = (amount / total * 100).toFixed(1)
                return <tr>
                  <td>{index + 1}.</td>
                  <td>{item[0]}</td>
                  <td>{EURO(amount).format()} €</td>
                  <td>{perc} %</td>
                </tr>
              }, this).slice(0, 5)
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export default Categories
