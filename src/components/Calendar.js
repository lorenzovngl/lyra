import React from 'react'
import moment from 'moment'
import Month from './Month'
import Predictions from './Predictions'
import Categories from './Categories'
import currency from 'currency.js'
import { Bar } from 'react-chartjs-2';

const EURO = value => currency(value, { symbol: '', decimal: ',', separator: '.' })

class Calendar extends React.Component {

  constructor(props) {
    super(props)
    this.computeMonthlyBalances()
  }

  computeMonthlyBalances() {
    let monthlyBalances = []
    let incomes = this.props.data.incomes
    if (incomes !== undefined) {
      for (let i = 0; i < incomes.length; i++) {
        let m = this.props.data.incomes[i]['Date'].format("YYYY-MM")
        if (/*m !== moment().format("YYYY-MM") &&*/ m !== "2021-04") {
          if (!monthlyBalances[m]) {
            monthlyBalances[m] = {}
          }
          if (!monthlyBalances[m]['incomes']) {
            monthlyBalances[m]['incomes'] = 0
          }
          monthlyBalances[m]['incomes'] += Number(incomes[i]['Amount'])
        }
      }
    }
    let expenses = this.props.data.expenses
    if (expenses !== undefined) {
      for (let i = 0; i < expenses.length; i++) {
        let m = this.props.data.expenses[i]['Date'].format("YYYY-MM")
        if (/*m !== moment().format("YYYY-MM") &&*/ m !== "2021-04") {
          let tmp = Number(expenses[i]['Amount'])
          let key_notes = Object.keys(expenses[i])[4];
          if (expenses[i][key_notes] !== undefined && expenses[i][key_notes].indexOf("Spesa familiare") !== -1) {
            tmp = Number(expenses[i]['Amount']) * 0.4
          }
          if (!monthlyBalances[m]) {
            monthlyBalances[m] = {}
          }
          if (!monthlyBalances[m]['expenses']) {
            monthlyBalances[m]['expenses'] = 0
          }
          monthlyBalances[m]['expenses'] += tmp
        }
      }
    }
    for (let i = 0; i < Object.entries(monthlyBalances).length; i++) {
      let item = monthlyBalances[Object.entries(monthlyBalances)[i][0]]
      item.balance = item.incomes - item.expenses
    }
    this.state = {
      monthlyBalances: monthlyBalances,
      chartData: {
        labels: Object.entries(monthlyBalances).map(x => x[0]).reverse(),
        datasets: [
          {
            label: 'Incomes',
            data: Object.entries(monthlyBalances).map(x => x[1].incomes).reverse(),
            backgroundColor: 'rgb(100, 99, 255)',
          },
          {
            label: 'Expenses',
            data: Object.entries(monthlyBalances).map(x => x[1].expenses).reverse(),
            backgroundColor: 'rgb(255, 99, 132)',
          },
          {
            label: 'Balance',
            data: Object.entries(monthlyBalances).map(x => x[1].balance).reverse(),
            backgroundColor: 'rgb(75, 192, 192)',
          },
        ]
      }
    }
  }

  incomes() {
    let res = 0
    let incomes = this.props.data.incomes
    if (incomes !== undefined) {
      for (let i = 0; i < incomes.length; i++) {
        res += Number(incomes[i]['Amount'])
      }
    }
    return res
  }

  expenses() {
    let res = 0
    let expenses = this.props.data.expenses
    if (expenses !== undefined) {
      for (let i = 0; i < expenses.length; i++) {
        let key_notes = Object.keys(expenses[i])[4];
        if (expenses[i][key_notes] !== undefined && expenses[i][key_notes].indexOf("Spesa familiare") !== -1) {
          res -= Number(expenses[i]['Amount']) * 0.4
        } else {
          res -= Number(expenses[i]['Amount'])
        }
      }
    }
    return res
  }

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

  balance() {
    return this.incomes() + this.expenses()
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

  period_covered(){
    let balance = this.balance()
    let daily_exp = Math.abs(this.daily(this.expenses()))
    let days = Math.floor(balance/daily_exp)
    let months = Math.floor(days/30)
    let years = Math.floor(months/12)
    months -= years * 12
    days -= years * 365 + months * 30
    let deadline = moment().add(years * 365 + months * 30 + days, 'days').format("DD/MM/YYYY")
    let result = ""
    if (years > 0){
      result += years
      if (years > 1){
        result += " years"
      } else {
        result += " year"
      }
    } 
    if (months > 0){
      if (result !== ""){
        result += ", "
      }
      result += months
      if (months > 1){
        result += " months"
      } else {
        result += " month"
      }
    }
    if (days > 0){
      if (result !== ""){
        result += ", "
      }
      result += days
      if (days > 1){
        result += " days"
      } else {
        result += " day"
      }
    }
    return result + " (until " + deadline + ")"
  }

  render() {
    this.computeMonthlyBalances()
    let avgMonthlyBalance = this.mean(Object.entries(this.state.monthlyBalances).slice(1).map(x => x[1].balance))
    let stdMonthlyBalance = this.std(Object.entries(this.state.monthlyBalances).slice(1).map(x => x[1].balance))
    this.props.data.dailyExpenses = this.daily(this.expenses())
    return (
      <div>
        <div className="row">
          <div className="col-lg-6">
            <table id="table-total" className="table table-striped table-hover">
              <tbody>
                <tr>
                  <td>Total incomes</td>
                  <td id="total-inc" align="right">{EURO(this.incomes()).format()} €</td>
                </tr>
                <tr>
                  <td>Total expenses</td>
                  <td id="total-exp" align="right">{EURO(this.expenses()).format()} €</td>
                </tr>
                <tr>
                  <td>Current balance</td>
                  <td id="balance" align="right"><b>{EURO(this.balance()).format()} €</b></td>
                </tr>
                <tr>
                  <td>Period of coverage</td>
                  <td align="right">{this.period_covered()}</td>
                </tr>
                <tr>
                  <td>Daily incomes</td>
                  <td id="daily-inc" align="right">{EURO(this.daily(this.incomes())).format()} €</td>
                </tr>
                <tr>
                  <td>Daily expenses</td>
                  <td id="daily-exp" align="right">{EURO(this.daily(this.expenses())).format()} €</td>
                </tr>
                <tr>
                  <td>Daily balance</td>
                  <td id="daily-balance" align="right"><b>{EURO(this.daily(this.balance())).format()} €</b></td>
                </tr>
                <tr>
                  <td>Average monthly balance</td>
                  <td id="daily-balance" align="right">
                  {EURO(avgMonthlyBalance).format()} ({EURO(avgMonthlyBalance - stdMonthlyBalance).format()} - {EURO(avgMonthlyBalance + stdMonthlyBalance).format()}) €
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-lg-6">
            <Bar data={this.state.chartData} />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <Categories expenses={this.props.data.expenses} days={this.days()}/>
          </div>
          <div className="col-lg-6">
            <Predictions
              balance={this.balance()}
              monthlyBalances={Object.entries(this.state.monthlyBalances).map(x => ({ 'month': x[0], ...x[1] }))}
              avgMonthlyBalance={avgMonthlyBalance}
              stdMonthlyBalance={stdMonthlyBalance} />
          </div>
        </div>
        <Month name={moment().format('MMMM')} data={this.props.data} />
      </div>
    )
  }
}

export default Calendar
