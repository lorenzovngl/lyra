import React from 'react'
import moment from 'moment'
import Month from './Month'

class Calendar extends React.Component {

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

  render() {
    this.props.data.dailyExpenses = this.daily(this.expenses())
    return (
      <Month name={moment().format('MMMM')} data={this.props.data} />
    )
  }
}

export default Calendar
