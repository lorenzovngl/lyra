import React from 'react'
import moment from 'moment'
import Day from './Day'

class Week extends React.Component {

  render() {
    moment.updateLocale('en', {
      week: {
        dow : 1, // Monday is the first day of the week.
      }
    });
    let days = []
    for (let i = 0; i < 7; i++) {
      days.push({
        number: moment().day(i+1).week(this.props.number).format('D'),
        month: moment().day(i+1).week(this.props.number).month(),
        date: moment().day(i+1).week(this.props.number).format('YYYY-MM-DD')
      })
    }
    return (
      <div className="row">
        {
          days.map(function (day) {
            return <Day date={day.date} number={day.number} data={this.props.data} disabled={this.props.month !== day.month}/>
          }, this)
        }
      </div>
    )
  }
}

export default Week
