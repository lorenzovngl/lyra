import React from 'react'
import moment from 'moment'
import currency from 'currency.js'
import { Bar } from 'react-chartjs-2'

const EURO = value => currency(value, { symbol: '', decimal: ',', separator: '.' })

class Summary extends React.Component {

  mean(a) {
    let sum = 0
    for (let i = 0; i < a.length; i++) {
      sum += a[i]
    }
    return sum / a.length
  }

  std(a) {
    let mean = this.mean(a)
    let sum = 0
    for (let i = 0; i < a.length; i++) {
      sum += Math.pow(a[i] - mean, 2)
    }
    return Math.sqrt(sum / a.length)
  }

  daily(sum) {
    const a = moment([2021, 3, 1]) // 3 is April (n-1)
    const today = moment()
    const diff = today.diff(a, 'days')
    return sum / diff
  }

  days() {
    const a = moment([2021, 3, 1]) // 3 is April (n-1)
    const today = moment()
    const diff = today.diff(a, 'days')
    return diff
  }

  period_covered() {
    let balance = this.props.balance
    let daily_exp = Math.abs(this.daily(this.props.totalExpenses))
    let days = Math.floor(balance / daily_exp)
    let months = Math.floor(days / 30)
    let years = Math.floor(months / 12)
    months -= years * 12
    days -= years * 365 + months * 30
    let deadline = moment().add(years * 365 + months * 30 + days, 'days').format("DD/MM/YYYY")
    let result = ""
    if (years > 0) {
      result += years
      if (years > 1) {
        result += " years"
      } else {
        result += " year"
      }
    }
    if (months > 0) {
      if (result !== "") {
        result += ", "
      }
      result += months
      if (months > 1) {
        result += " months"
      } else {
        result += " month"
      }
    }
    if (days > 0) {
      if (result !== "") {
        result += ", "
      }
      result += days
      if (days > 1) {
        result += " days"
      } else {
        result += " day"
      }
    }
    return result + " (until " + deadline + ")"
  }

  render() {
    let avgMonthlyBalance
    let stdMonthlyBalance
    let avgMonthlyExpenses
    let stdMonthlyExpenses
    let avgMonthlyIncomes
    let stdMonthlyIncomes
    if (this.props.monthlyBalances) {
      avgMonthlyBalance = this.mean(Object.entries(this.props.monthlyBalances).slice(1).map(x => x[1].balance))
      stdMonthlyBalance = this.std(Object.entries(this.props.monthlyBalances).slice(1).map(x => x[1].balance))
      avgMonthlyExpenses = this.mean(Object.entries(this.props.monthlyBalances).slice(1).map(x => x[1].expenses))
      stdMonthlyExpenses = this.std(Object.entries(this.props.monthlyBalances).slice(1).map(x => x[1].expenses))
      avgMonthlyIncomes = this.mean(Object.entries(this.props.monthlyBalances).slice(1).map(x => x[1].incomes))
      stdMonthlyIncomes = this.std(Object.entries(this.props.monthlyBalances).slice(1).map(x => x[1].incomes))
    }
    let chartData = {
      labels: Object.entries(this.props.monthlyBalances).map(x => x[0]).reverse().map(x => moment(x).format('MMMM YYYY')),
      datasets: [
        {
          label: 'Incomes',
          data: Object.entries(this.props.monthlyBalances).map(x => x[1].incomes).reverse(),
          backgroundColor: 'rgb(100, 99, 255)',
        },
        {
          label: 'Expenses',
          data: Object.entries(this.props.monthlyBalances).map(x => x[1].expenses).reverse(),
          backgroundColor: 'rgb(255, 99, 132)',
        },
        {
          label: 'Balance',
          data: Object.entries(this.props.monthlyBalances).map(x => x[1].balance).reverse(),
          backgroundColor: 'rgb(75, 192, 192)',
        },
      ]
    }
    return (
      <div>
        <h1>Summary</h1>
        <table id="table-total" className="table table-striped table-hover">
          <tbody>
            <tr>
              <td>Total incomes</td>
              <td id="total-inc" align="right">{EURO(this.props.totalIncomes).format()} ???</td>
            </tr>
            <tr>
              <td>Total expenses</td>
              <td id="total-exp" align="right">{EURO(this.props.totalExpenses).format()} ???</td>
            </tr>
            <tr>
              <td>Current balance</td>
              <td id="balance" align="right"><b>{EURO(this.props.balance).format()} ???</b></td>
            </tr>
            <tr>
              <td>Period of coverage</td>
              <td align="right">{this.period_covered()}</td>
            </tr>
            <tr>
              <td>Daily incomes</td>
              <td id="daily-inc" align="right">{EURO(this.daily(this.props.totalIncomes)).format()} ???</td>
            </tr>
            <tr>
              <td>Daily expenses</td>
              <td id="daily-exp" align="right">{EURO(this.daily(this.props.totalExpenses)).format()} ???</td>
            </tr>
            <tr>
              <td>Daily balance</td>
              <td id="daily-balance" align="right"><b>{EURO(this.daily(this.props.balance)).format()} ???</b></td>
            </tr>
            <tr>
              <td>Average monthly incomes</td>
              <td id="daily-balance" align="right">
                {EURO(avgMonthlyIncomes).format()} ({EURO(avgMonthlyIncomes - stdMonthlyIncomes).format()} - {EURO(avgMonthlyIncomes + stdMonthlyIncomes).format()}) ???
              </td>
            </tr>
            <tr>
              <td>Average monthly expenses</td>
              <td id="daily-balance" align="right">
                {EURO(avgMonthlyExpenses).format()} ({EURO(avgMonthlyExpenses - stdMonthlyExpenses).format()} - {EURO(avgMonthlyExpenses + stdMonthlyExpenses).format()}) ???
              </td>
            </tr>
            <tr>
              <td>Average monthly balance</td>
              <td id="daily-balance" align="right">
                {EURO(avgMonthlyBalance).format()} ({EURO(avgMonthlyBalance - stdMonthlyBalance).format()} - {EURO(avgMonthlyBalance + stdMonthlyBalance).format()}) ???
              </td>
            </tr>
          </tbody>
        </table>
        <Bar data={chartData} />
      </div>
    )
  }
}

export default Summary
