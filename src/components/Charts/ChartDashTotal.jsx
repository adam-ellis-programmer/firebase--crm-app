import { useState, useEffect } from 'react'
import { getAllOrders } from '../../crm context/CrmAction'
import { formatPrice } from '../../CrmFunctions'

const ChartDashTotal = () => {
  const [total, setTotal] = useState(0)
  const [displayTotal, setDisplayTotal] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const getOrders = async () => {
      const orders = await getAllOrders()
      const totalData = orders.reduce((acc, item) => {
        acc += item.price
        return acc
      }, 0)
      setTotal(totalData)
      setIsAnimating(true)
    }

    getOrders()
  }, []) // Removed total from dependency array to prevent infinite loop

  useEffect(() => {
    if (!isAnimating) return

    let startTimestamp
    let animationDuration = 2000 // 2 seconds duration

    const animate = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = timestamp - startTimestamp

      // Calculate the current value based on progress
      if (progress < animationDuration) {
        // Easing function for smoother animation
        // console.log(Math.min(progress / animationDuration))
        const easeOutQuart = 1 - Math.pow(1 - progress / animationDuration, 4)
        // console.log(easeOutQuart)
        const currentValue = Math.min(total * easeOutQuart, total)
        // console.log(currentValue)
        setDisplayTotal(Math.round(currentValue))
        requestAnimationFrame(animate)
      } else {
        setDisplayTotal(total)
        setIsAnimating(false)
      }
    }

    requestAnimationFrame(animate)

    return () => {
      setIsAnimating(false)
    }
  }, [total, isAnimating])

  return (
    <>
      <p>
        total spent: <span className="chart-dash-price">{formatPrice(displayTotal)}</span>
      </p>
      <p>this year!</p>
    </>
  )
}

export default ChartDashTotal
