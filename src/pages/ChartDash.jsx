import LineChartJS from '../components/Charts/LineChartJS'
import Chart from '../components/Charts/Chart'
import PieChartJS from '../components/Charts/PieChartJS'
import { Link } from 'react-router-dom'
import CrmContext from '../crm context/CrmContext'
import { useState, useEffect } from 'react'
import { getAllCustomers, getAllOrders } from '../crm context/CrmAction'
import { formatPrice } from '../CrmFunctions'
import ProgressChart from '../components/Charts/ProgressChart'
import ChartDashTotal from '../components/Charts/ChartDashTotal'
import OtherData from '../components/Charts/OtherData'
import ChartTopSalesReps from '../components/Charts/ChartTopSalesReps'
import AggeregatedYear from '../components/Charts/aggeregated data/AggeregatedYear'
import AggeregatedMonths from '../components/Charts/aggeregated data/AggeregatedMonths'
import AggeregatedWeeks from '../components/Charts/aggeregated data/AggeregatedWeeks'
import AggeregatedDaily from '../components/Charts/aggeregated data/AggeregatedDaily'
import AggeregatedHour from '../components/Charts/aggeregated data/AggeregatedHour'

const url = new URL(window.location.href)
const id = url.pathname.split('/')[2]
console.log(id)

const ChartDash = () => {
  const [total, setTotal] = useState(0)
  const [customerData, setCustomerData] = useState(null)

  useEffect(() => {
    const getOrders = async () => {
      const orders = await getAllOrders()

      // setOrderData()
      // toatl for main page
      const totalData = orders.reduce((acc, item) => {
        acc += item.price
        return acc
      }, 0)

      setTotal(totalData)
    }

    getOrders()
    return () => {}
  }, [total])

  useEffect(() => {
    const getCustomers = async () => {
      const customers = await getAllCustomers()

      const progressData = customers.reduce((acc, item) => {
        if (!acc[item.custId]) {
          acc[item.custId] = {
            id: item.custId,
            progress: item.progress,
            company: item.company,
            url: item.urlData.url,
            name: item.name,
          }
        }
        return acc
      }, {})

      // set customer data
      const data = Object.values(progressData)
      setCustomerData(data)
    }

    getCustomers()
    return () => {}
  }, [])

  const getProgressColor = (progress) => {
    if (progress === 0) return '#e74c3c'
    if (progress <= 10) return '#f39c12'
    if (progress <= 50) return '#3498db'
    return '#2ecc71'
  }

  return (
    <div className="page-container ">
      <section className="chart-dash-header">
        <h1>Your Dashboard</h1>
      </section>

      {/* test className='test open-test' */}
      {/* .test.open{} */}
      {/* do some vanilla date tests in ms */}
      {/* sort admin out */}
      {/* orders for this month and week */}
      <section className="chart-dash-page-info">
        <ChartDashTotal />
        {/* prettier-ignore */}
        <div className="chart-dash-btn-container">
        <Link className='chart-dash-btn' to={`/data/${id}`}>my data</Link>
        <Link className='chart-dash-btn' to={`/all-data/${id}`}>team data</Link>
        <Link className='chart-dash-btn' to={`/profile/${id}`}>my profile</Link>
       </div>
      </section>

      <section className="chart-dash-section">
        <div>
          <Chart />
        </div>
        <div>
          <LineChartJS />
        </div>
        <div>
          <PieChartJS />
        </div>
        <div>
          <ProgressChart />
        </div>
        <div>
          <OtherData />
        </div>
        <div>
          <ChartTopSalesReps />
        </div>
        <div>
          <AggeregatedYear />
        </div>
        <div>
          <AggeregatedMonths />
        </div>
        <div>
          <AggeregatedWeeks />
        </div>
        <div>
          <AggeregatedDaily />
        </div>
        <div>
          <AggeregatedHour />
        </div>
      </section>
    </div>
  )
}

export default ChartDash
