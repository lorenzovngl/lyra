import React from 'react'
import currency from 'currency.js'
import moment from 'moment'
import { Line } from 'react-chartjs-2';

const EURO = value => currency(value, { symbol: '', decimal: ',', separator: '.' })

class Predictions extends React.Component {

    render() {
        let minBalance = this.props.avgMonthlyBalance - this.props.stdMonthlyBalance
        let maxBalance = this.props.avgMonthlyBalance + this.props.stdMonthlyBalance
        let minB = 0
        let maxB = 0
        let cMonth = moment()
        let labels = []
        let arrayMin = []
        let arrayMax = []
        let years = 3
        this.props.monthlyBalances.slice(1).reverse().forEach((e, i, array) => {
            let m = moment(e.month)
            labels.push(m.format('MMMM YYYY'))
            minB += e.balance
            maxB += e.balance
            arrayMin.push(minB)
            arrayMax.push(maxB)
            console.log(i)
        });
        for (let i = 0; i < years * 12; i++) {
            minB += minBalance
            maxB += maxBalance
            labels.push(cMonth.format('MMMM YYYY'))
            arrayMin.push(minB)
            arrayMax.push(maxB)
            cMonth = cMonth.add(1, 'month')
            if (cMonth.format('M') === '12'){
                minB += 1400
                maxB += 1400
            }
        }
        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Min balance',
                    data: arrayMin,
                    fill: false,
                    backgroundColor: 'rgb(0, 200, 0)',
                    borderColor: 'rgba(0, 200, 0, 0.8)',
                },
                {
                    label: 'Max balance',
                    data: arrayMax,
                    fill: false,
                    backgroundColor: 'rgb(255, 127, 0)',
                    borderColor: 'rgba(255, 127, 0, 0.8)',
                }
            ]
        }
        const chartOptions = {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            return EURO(value).format() + ' €';
                        }
                    }
                }
            }
        }
        return (
            <div>
                <h3>Predictions</h3>
                <Line data={chartData} options={chartOptions} />
            </div>
        )
    }
}

export default Predictions
