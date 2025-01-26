import { useEffect, useState } from 'react'
import { getAllOrders, getAllOrdersStructured } from '../../crm context/CrmAction'
import { aggeregatedData, formatPrice } from '../../CrmFunctions'
import Loader from '../../assets/Loader'

const OtherData = () => {
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(true)

  //   prettier-ignore
  const processOrderData = (orders) => {
    // Use reducer to collect prices and count orders simultaneously
    const processedData = orders.reduce((acc, item) => {
        // Add price to prices array
        acc.prices.push(item.price)
        // Increment order count
        acc.orderCount += 1
        return acc
      },{ prices: [], orderCount: 0 })

    // Calculate average using our order count
    // add it all up and divide by length
    const totalSpend = processedData.prices.reduce((sum, price) => sum + price, 0)
    const averageSpend = totalSpend / processedData.orderCount

    return {
      minPrice: Math.min(...processedData.prices),
      maxPrice: Math.max(...processedData.prices),
      averageSpend: averageSpend,
      totalOrders: processedData.orderCount,
    }
  }

  // const newData = Object.values(data)
  // console.log(newData)
  //  prettier-ignore

  useEffect(() => {
    const getData = async () => {
      try {
        const orders = await getAllOrders()
        const testD = await getAllOrdersStructured()
        const data = await aggeregatedData(testD)
        // console.log(data)
        const processedData = processOrderData(orders)
        setOrderData(processedData)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }

    getData()
  }, [])

  if (loading) {
    return <Loader />
  }
  return (
    <>
      <div className="chart-page-sub-header-div">
        <p>at a glance</p>
      </div>
      <div className="other-data-container">
        <div className="other-data-box">
          <p>max spend</p>
          <p>{formatPrice(orderData.maxPrice)}</p>
        </div>
        <div className="other-data-box">
          <p>min spend</p>
          <p>{formatPrice(orderData.minPrice)}</p>
        </div>

        <div className="other-data-box">
          <p>avg spend</p>
          <p>{formatPrice(orderData.averageSpend)}</p>
        </div>
        <div className="other-data-box">
          <p> orders</p>
          <p>{orderData.totalOrders}</p>
        </div>
        <div className="other-data-box">
          <p> month</p>
          <p>10</p>
        </div>
        <div className="other-data-box">
          <p> week</p>
          <p>5</p>
        </div>
      </div>
    </>
  )
}

export default OtherData
