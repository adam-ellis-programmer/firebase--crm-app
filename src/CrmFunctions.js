import { getAllOrdersStructured } from './crm context/CrmAction'

export function getCustomerRating(amountSpent, rating) {
  while (amountSpent > 0) {
    if (amountSpent >= 100) {
      rating++
      amountSpent -= 100

      if (rating >= 5) {
        rating = 5
      }
    } else {
      break
    }
  }
  return rating
}

export function getPointsEarned(amountSpent, points) {
  while (amountSpent > 0) {
    if (amountSpent >= 100) {
      points += 10
      amountSpent -= 100
    } else {
      break
    }
  }
  return points
}

export function getPointsEarned1(amountSpent) {
  const pointsPerHundred = 1 // Assuming 1 point for every $100 spent
  return Math.floor(amountSpent / 100) * pointsPerHundred
}

export function getRating(amountSpent) {
  const ratingPerTwelveHundred = 1 // 1 rating point for every $500 spent
  return Math.floor(amountSpent / 500) * ratingPerTwelveHundred
}

export const formatPrice = (price) => {
  // Handle null, undefined, or invalid inputs
  if (!price && price !== 0) return '-'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

// aggregate up to a year + down to a week
// The issue with starting at 0 becomes clear when we think about what these numbers represent:

// If a coffee costs $5, that's a real price
// If a coffee costs $0, that's also theoretically a real price (though unlikely)
// But undefined means "we haven't seen any prices yet"

// This is why we made the following modification when switching to 0:
// aggeregated SPELLING ****
export const aggeregatedData = async () => {
  const data = await getAllOrdersStructured()
  const yearOrders = data?.yearOrders
  const monthData = data?.monthOrders
  const weekhData = data?.weekOrders
  const todayData = data?.todayOrders
  const hourData = data?.hourOrders

  const getMonthly = monthData.reduce(
    (acc, item) => {
      acc.prices.push(item.price)
      acc.total += item.price
      acc.count += 1
      // Update min price - if it's the first item or if current price is lower
      acc.min = acc.min === undefined ? item.price : Math.min(acc.min, item.price)
      // Update max price - if it's the first item or if current price is higher
      acc.max = acc.max === undefined ? item.price : Math.max(acc.max, item.price)
      // Calculate the running average
      acc.average = acc.total / acc.count
      return acc
    },
    {
      prices: [],
      count: 0,
      total: 0,
      min: undefined, // Initialize min as undefined
      max: undefined, // Initialize max as undefined
      average: 0,
    }
  )

  const getWeekly = weekhData.reduce(
    (acc, item) => {
      acc.prices.push(item.price)
      acc.total += item.price
      acc.count += 1
      acc.min = acc.min === undefined ? item.price : Math.min(acc.min, item.price)
      acc.max = acc.max === undefined ? item.price : Math.max(acc.max, item.price)
      acc.average = acc.total / acc.count

      return acc
    },
    {
      prices: [],
      count: 0,
      total: 0,
      min: undefined,
      max: undefined,
      average: 0,
    }
  )

  const getYearly = yearOrders.reduce(
    (acc, item) => {
      acc.prices.push(item.price)
      acc.total += item.price
      acc.count += 1
      acc.min = acc.min === undefined ? item.price : Math.min(acc.min, item.price)
      acc.max = acc.max === undefined ? item.price : Math.max(acc.max, item.price)
      acc.average = acc.total / acc.count
      return acc
    },
    {
      prices: [],
      count: 0,
      total: 0,
      min: undefined,
      max: undefined,
      average: 0,
    }
  )

  // count loop:
  // Loop 1: (undefined || 0) + 1 = 1
  // Loop 2: (1 || 0) + 1 = 2
  const getToday = () => {
    // Define our default values object
    const defaultValues = {
      prices: [],
      count: 0,
      total: 0,
      min: 0,
      max: 0,
      average: 0,
      medianPrice: 0,
    }

    // If the array is empty, return our default values
    if (!todayData || todayData.length === 0) {
      return defaultValues
    }

    // Otherwise, proceed with the reduction
    return todayData.reduce((acc, item) => {
      // console.log(item)
      return {
        // First evaluates what's in parentheses
        prices: [...(acc.prices || []), item.price],
        count: (acc.count || 0) + 1,
        total: (acc.total || 0) + item.price,
        min: acc.min === 0 ? item.price : Math.min(...acc.prices),
        max: acc.max === 0 ? item.price : Math.max(acc.max, item.price),
        average: ((acc.total || 0) + item.price) / ((acc.count || 0) + 1),
        // look this up
        medianPrice: (acc.medianPrice = acc.prices.sort((a, b) => a - b)[
          Math.floor(acc.prices.length / 2)
        ]),
      }
    }, defaultValues) // Use defaultValues as initial accumulator
  }

  // TRACK BY POPULAR PRODUCT
  //  ADD IN A SELECT BOX IN THE ADD ORDER BAR

  const td = getToday()
  // console.log(td)
  // MEDIAN

  const getByHour = () => {
    const defaultValues = {
      prices: [],
      count: 0,
      total: 0,
      min: 0,
      max: 0,
      average: 0,
    }

    // if (!hourData || hourData.length === 0) {
    //   return defaultValues
    // }

    return hourData.reduce((acc, item, i, arr) => {
      // console.log(item)
      // First evaluates what's in parentheses
      // If acc.prices exists, use it
      // Then spreads the result:
      return {
        prices: [...(acc.prices || []), item.price],
        count: (acc.count || 0) + 1,
        total: (acc.total || 0) + item.price,
        min: acc.min === 0 ? item.price : Math.min(acc.min, item.price),
        // medianPrice
      }
    }, defaultValues)
  }

  // TODO:
  // make a func that aggeregates down to
  // the half hours
  // array with two objects, each represents
  // half hour
  const data1 = getByHour()
  // console.log(data1)

  return {
    monthData: getMonthly,
    weekData: getWeekly,
    yearData: getYearly,
    todayData: getToday,
    hourData: getByHour,
  }
}
// we aggregate the data once on the server fetch
// and aggregate again here to provide object data
//

// dayly data

// console.log(getToday)
// what are the benifits of
// 1: Using Map and Set

