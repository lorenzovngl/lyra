import React from 'react'
import moment from 'moment'
import './App.css'
import Calendar from './components/Calendar'
import expenses from './data/expenses.csv'
import incomes from './data/incomes.csv'
import './DataController'

class App extends React.Component {

  constructor() {
    super();
    this.state = { data: {} };
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
      return result; //JavaScript object
      //return JSON.stringify(result); //JSON
    }

    function parseCSV(csv) {
      let array = csvToJSON(csv)
      for (let i = 0; i < array.length; i++) {
        let key_notes = Object.keys(array[i])[1];
        array[i]['Date'] = moment(array[i]['Date'], "YYYY-MM-DD");
        if (array[i][key_notes].indexOf("Buoni pasto") !== -1 && array[i]['Date'].date() > 15){
          array[i]['Date'] = array[i]['Date'].add(1, 'M')
        }
      }
      return array/*.filter(function(x) {
        let key_notes = Object.keys(x)[1];
        return (//Number(moment(x['Date'], "YYYY-MM-DD").format('MM')) > 4 && 
        x[key_notes].indexOf("Rimborso mamma") === -1 && 
        x[key_notes].indexOf("Regalo laurea") === -1 && 
        x[key_notes].indexOf("Assicurazione") === -1 && 
        x[key_notes].indexOf("Celestron") === -1) 
      })*/
    }

    fetch(expenses)
      .then(res => res.text())
      .then(csv => {
        this.setState(prevState => ({
          data: {
            ...prevState.data,
            expenses: parseCSV(csv)
          }
        })
        )
      })
    fetch(incomes)
      .then(res => res.text())
      .then(csv => this.setState(prevState => ({
        data: {
          ...prevState.data,
          incomes: parseCSV(csv)
        }
      })
      )
      )
  }

  render() {
    return (
      <div className="container-fluid" >
        <h1>Lyra</h1>
        <Calendar data={this.state.data} />
      </div>
    )
  }
}

export default App;
