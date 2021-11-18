import React from 'react'
import currency from 'currency.js'
import moment from 'moment'
import { Doughnut } from 'react-chartjs-2';

const EURO = value => currency(value, { symbol: '', decimal: ',', separator: '.' })

class ChartCategories extends React.Component {

    expensesCategories() {
        let cat = []
        if (this.props.expenses != undefined) {
            let expenses = this.props.expenses
            expenses.forEach(function (e) {
                let tag = e.Tags.trim()
                if (cat[tag] === undefined) {
                    cat[tag] = 0
                }
                cat[tag] += parseFloat(e.Amount)
            })
        }
        return cat
    }

    render() {
        let expenses = Object.entries(this.expensesCategories())
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
                    data: expenses.map(x => x[1]),
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
                <h3>Categories</h3>
                <Doughnut data={chartData} options={options}/>
            </div>
        )
    }
}

export default ChartCategories
