import React from 'react'
import currency from 'currency.js'
import moment from 'moment'
import { Line } from 'react-chartjs-2';

const EURO = value => currency(value, { symbol: '', decimal: ',', separator: '.' })

class Predictions extends React.Component {

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

    render() {
        let monthlyBalances = Object.entries(this.props.monthlyBalances)
        monthlyBalances = monthlyBalances.map(x => (
            { 
                'month': x[0].split('-')[1], 
                'year': x[0].split('-')[0], 
                ...x[1] 
            }
        ))
        let avgMonthlyBalance = this.mean(Object.entries(monthlyBalances).slice(1).map(x => x[1].balance))
        let stdMonthlyBalance = this.std(Object.entries(monthlyBalances).slice(1).map(x => x[1].balance))
        let avgMonthlyBalances = {}
        let stdMonthlyBalances = {}
        let cMonth = moment().month('0')
        for (let i = 0; i < 12; i++){
            let key = cMonth.format('MM-MMM')
            avgMonthlyBalances[key] = []
            monthlyBalances.slice(1).forEach((e, i, array) => {
                if (e.month === cMonth.format('MM') && e.balance){
                    avgMonthlyBalances[key].push(e.balance)
                }
            })
            stdMonthlyBalances[key] = this.std(avgMonthlyBalances[key])
            avgMonthlyBalances[key] = this.mean(avgMonthlyBalances[key])
            if (isNaN(avgMonthlyBalances[key])){
                avgMonthlyBalances[key] = avgMonthlyBalance
            }
            if (isNaN(stdMonthlyBalances[key])){
                stdMonthlyBalances[key] = stdMonthlyBalance
            } 
            cMonth.add(1, 'months')
        }
        let minBalances = {}
        let maxBalances = {}
        cMonth = moment().month('0')
        for (let i = 0; i < 12; i++){
            let key = cMonth.format('MM-MMM')
            minBalances[key] = avgMonthlyBalances[key] - stdMonthlyBalances[key]
            maxBalances[key] = avgMonthlyBalances[key] + stdMonthlyBalances[key]
            cMonth.add(1, 'months')
        }
        let minB = 0
        let maxB = 0
        cMonth = moment()
        let labels = []
        let arrayMin = []
        let arrayMax = []
        let years = 3
        console.log(monthlyBalances.slice(1))
        monthlyBalances.slice(1).reverse().forEach((e, i, array) => {
            console.log(e.year)
            let m = moment().month(e.month-1).year(e.year)
            labels.push(m.format('MMMM YYYY'))
            minB += e.balance
            maxB += e.balance
            arrayMin.push(minB)
            arrayMax.push(maxB)
        })
        cMonth = moment()
        for (let i = 0; i < years * 12; i++) {
            minB += minBalances[cMonth.format('MM-MMM')]
            maxB += maxBalances[cMonth.format('MM-MMM')]
            labels.push(cMonth.format('MMMM YYYY'))
            arrayMin.push(minB)
            arrayMax.push(maxB)
            cMonth = cMonth.add(1, 'month')
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
                        callback: function (value, index, values) {
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
