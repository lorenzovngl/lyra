import React from 'react'
import moment from 'moment'
import './App.css'
import Summary from './components/Summary'
import Calendar from './components/Calendar'
import Categories from './components/Categories'
import Predictions from './components/Predictions'
import expenses from './data/expenses.csv'
import incomes from './data/incomes.csv'
import './DataController'
import { Container, Nav, Navbar } from 'react-bootstrap'

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      tabs_visibility: {
        summary: true,
        calendar: false,
        categories: false,
        predictions: false
      },
      data: {}
    }
    this.toggleSummary = this.toggleSummary.bind(this)
    this.toggleCalendar = this.toggleCalendar.bind(this)
    this.toggleCategories = this.toggleCategories.bind(this)
    this.togglePredictions = this.togglePredictions.bind(this)
  }

  componentDidMount() {
    function csvToJSON(csv) {
      var lines = csv.split("\n");
      var result = [];
      var headers = lines[0].split(",");
      for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(",");
        for (var j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j];
        }
        result.push(obj);
      }
      return result;
    }

    function parseCSV(csv) {
      let array = csvToJSON(csv)
      for (let i = 0; i < array.length; i++) {
        array[i]['Date'] = moment(array[i]['Date'], "YYYY-MM-DD");
      }
      return array
    }

    function preprocessIncomes(incomes) {
      for (let i = 0; i < incomes.length; i++) {
        let key_notes = Object.keys(incomes[i])[1];
        if (incomes[i][key_notes].indexOf("Buoni pasto") !== -1 && incomes[i]['Date'].date() > 15) {
          incomes[i]['Date'] = incomes[i]['Date'].add(1, 'M')
        }
      }
      return incomes
    }

    function preprocessExpenses(expenses) {
      for (let i = 0; i < expenses.length; i++) {
        let key_notes = Object.keys(expenses[i])[4];
        expenses[i]['Amount'] = Number(expenses[i]['Amount'])
        let val = expenses[i][key_notes]?.indexOf("Spesa familiare")
        if (val !== undefined && val !== -1) {
          expenses[i]['Amount'] = expenses[i]['Amount'] * 0.4
        }
      }
      return expenses
    }

    fetch(expenses)
      .then(res => res.text())
      .then(csv => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            expenses: preprocessExpenses(parseCSV(csv))
          }
        })
        )
      })
    fetch(incomes)
      .then(res => res.text())
      .then(csv => this.setState(prevState => ({
        ...prevState,
        data: {
          ...prevState.data,
          incomes: preprocessIncomes(parseCSV(csv))
        }
      })
      )
      )
  }

  toggleSummary() {
    this.setState((prevState) => ({
      ...prevState,
      tabs_visibility: {
        summary: true,
        calendar: false,
        categories: false,
        predictions: false
      }
    }))
  }

  toggleCalendar() {
    this.setState((prevState) => ({
      ...prevState,
      tabs_visibility: {
        summary: false,
        calendar: true,
        categories: false,
        predictions: false
      }
    }))
  }

  toggleCategories() {
    this.setState((prevState) => ({
      ...prevState,
      tabs_visibility: {
        summary: false,
        calendar: false,
        categories: true,
        predictions: false
      }
    }))
  }

  togglePredictions() {
    this.setState((prevState) => ({
      ...prevState,
      tabs_visibility: {
        summary: false,
        calendar: false,
        categories: false,
        predictions: true
      }
    }))
  }

  computeMonthlyBalances() {
    let monthlyBalances = []
    let incomes = this.state.data.incomes
    if (incomes) {
      for (let i = 0; i < incomes.length; i++) {
        let m = this.state.data.incomes[i]['Date'].format("YYYY-MM")
        if (!monthlyBalances[m]) {
          monthlyBalances[m] = {}
        }
        if (!monthlyBalances[m]['incomes']) {
          monthlyBalances[m]['incomes'] = 0
        }
        monthlyBalances[m]['incomes'] += Number(incomes[i]['Amount'])
      }
    }
    let expenses = this.state.data.expenses
    if (expenses) {
      for (let i = 0; i < expenses.length; i++) {
        let m = this.state.data.expenses[i]['Date'].format("YYYY-MM")
        let tmp = Number(expenses[i]['Amount'])
        if (!monthlyBalances[m]) {
          monthlyBalances[m] = {}
        }
        if (!monthlyBalances[m]['expenses']) {
          monthlyBalances[m]['expenses'] = 0
        }
        monthlyBalances[m]['expenses'] += tmp
      }
    }
    for (let i = 0; i < Object.entries(monthlyBalances).length; i++) {
      let item = monthlyBalances[Object.entries(monthlyBalances)[i][0]]
      item.balance = item.incomes - item.expenses
    }
    return monthlyBalances
  }

  totalIncomes() {
    let res = 0
    let incomes = this.state.data.incomes
    if (incomes !== undefined) {
      for (let i = 0; i < incomes.length; i++) {
        res += Number(incomes[i]['Amount'])
      }
    }
    return res
  }

  totalExpenses() {
    let res = 0
    let expenses = this.state.data.expenses
    if (expenses !== undefined) {
      for (let i = 0; i < expenses.length; i++) {
        res -= Number(expenses[i]['Amount'])
      }
    }
    return res
  }

  balance() {
    return this.totalIncomes() + this.totalExpenses()
  }

  render() {
    this.computeMonthlyBalances()
    let content;
    if (this.state.tabs_visibility.summary) {
      content = (
        <Summary data={this.state.data} monthlyBalances={this.computeMonthlyBalances()}
          totalIncomes={this.totalIncomes()} totalExpenses={this.totalExpenses()} balance={this.balance()} />
      )
    } else if (this.state.tabs_visibility.calendar) {
      content = (
        <Calendar data={this.state.data} />
      )
    } else if (this.state.tabs_visibility.categories) {
      content = (
        <Categories data={this.state.data} />
      )
    } else if (this.state.tabs_visibility.predictions) {
      content = (
        <Predictions monthlyBalances={this.computeMonthlyBalances()} />
      )
    }
    return (
      <div>
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand href="#home">Lyra</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link onClick={this.toggleSummary}>Summary</Nav.Link>
                <Nav.Link onClick={this.toggleCalendar}>Calendar</Nav.Link>
                <Nav.Link onClick={this.toggleCategories}>Categories</Nav.Link>
                <Nav.Link onClick={this.togglePredictions}>Predictions</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container>
          {content}
        </Container>
      </div>
    )
  }
}

export default App;
