import React from 'react'
import moment from 'moment'
import Week from './Week'
import currency from 'currency.js'
import './Month.css';

const EURO = value => currency(value, { symbol: '', decimal: ',', separator: '.' })

class Month extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      month: Number(moment().format('M')) - 1,
      year: Number(moment().format('YYYY'))
    }
    this.prev = this.prev.bind(this)
    this.next = this.next.bind(this)
  }

  firstWeek() {
    return moment().year(this.state.year).month(this.state.month).day('01').week();
  }

  lastWeek() {
    return moment().year(this.state.year).month(this.state.month).day('01').add(1, 'month').subtract(1, 'days').week()+1;
  }

  prev() {
    this.setState((prevState) => ({
      month: (prevState.month > 0) ? prevState.month - 1 : 11,
      year: (prevState.month > 0) ? prevState.year : prevState.year-1
    }))
  }

  next() {
    this.setState((prevState) => ({
      month: (prevState.month + 1) % 12,
      year: (prevState.month + 1 > 11) ? prevState.year+1 : prevState.year
    }))
  }

  incomes() {
    let res = 0
    let incomes = this.props.data.incomes
    if (incomes !== undefined) {
      incomes = incomes.filter(function (item) {
        return item['Date'].year() === this.state.year && item['Date'].month() === this.state.month
      }, this)
      for (let i = 0; i < incomes.length; i++) {
        res += Number(incomes[i]['Amount'])
      }
    }
    return res
  }

  expenses() {
    let res = 0
    let expenses = this.props.data.expenses
    if (expenses) {
      expenses = expenses.filter(function (item) {
        return item['Date'].year() === this.state.year && item['Date'].month() === this.state.month
      }, this)
      for (let i = 0; i < expenses.length; i++) {
        let key_notes = Object.keys(expenses[i])[4];
        if (expenses[i][key_notes]?.indexOf("Spesa familiare") !== -1) {
          res -= Number(expenses[i]['Amount']) * 0.4
        } else {
          res -= Number(expenses[i]['Amount'])
        }
      }
    }
    return res
  }

  balance() {
    return this.incomes() + this.expenses()
  }

  predictBalance(){
    const today = moment()
    const endOfMonth = moment().endOf('month')
    return this.balance() + this.props.data.dailyExpenses * endOfMonth.diff(today, 'days')
  }

  render() {
    let weeks = []
    let lastWeek = this.lastWeek()
    if (lastWeek < this.firstWeek()) {
      lastWeek += 52
    }
    for (let i = this.firstWeek(); i < lastWeek; i++) {
      weeks.push(i)
    }
    let prediction
    if (moment().month() === this.state.month){
      prediction = (
        <div>Balance of the month (predicted): <div style={{ float: "right" }}><b>{EURO(this.predictBalance()).format() + ' €'}</b></div></div>
      )
    }
    return (
      <div className="Month">
        <header>
          <button className="btn btn-primary" onClick={this.prev}>Prev</button>
          <h1 className="name">
            {moment().month(this.state.month).year(this.state.year).format('MMMM YYYY')}
          </h1>
          <button className="btn btn-primary" onClick={this.next}>Next</button>
        </header>
        <div>Incomes of the month: <div style={{ float: "right" }}>{EURO(this.incomes()).format() + ' €'}</div></div>
        <div>Expenses of the month: <div style={{ float: "right" }}>{EURO(this.expenses()).format() + ' €'}</div></div>
        <div>Balance of the month (current): <div style={{ float: "right" }}><b>{EURO(this.balance()).format() + ' €'}</b></div></div>
        {prediction}
        {
          weeks.map(function (week) {
            return <Week number={week} month={this.state.month} year={this.state.year} data={this.props.data} />
          }, this)
        }
      </div>
    )
  }
}

export default Month
