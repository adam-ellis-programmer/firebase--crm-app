import { useEffect, useState, useContext } from 'react'
import { useSearchParams, useHistory } from 'react-router-dom'
import { ReactComponent as EditIcon } from '../icons/edit-icon.svg'

import { useParams, useNavigate, useLocation } from 'react-router-dom'
import CrmContext from '../crm context/CrmContext'
import {
  getCollection,
  newDataBaseEntry,
  getStatsObjToEdit,
  getSingleDoc,
  updateCustomerStats,
  getDocument,
  getProducts,
} from '../crm context/CrmAction'
import { doc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import {
  getPointsEarned1,
  getCustomerRating,
  getRating,
  formatPrice,
} from '../CrmFunctions'
import { db } from '../firebase.config'
import { getAuth } from 'firebase/auth'

import { toast } from 'react-toastify'
import DataSvgIcon from './DataSvgIcon'
import { useAuthStatusTwo } from '../hooks/useAuthStatusTwo'
// import { products } from '../utils'

// for testing
// const {history} = useHistory();

function DisplayOrders() {
  const { loggedInUser } = useAuthStatusTwo()

  const auth = getAuth()

  //  *** leave for testing *** //
  const navigate = useNavigate()
  const location = useLocation()
  const searchParamsTest = new URLSearchParams()
  //  *** leave for testing *** //

  const [searchParams, setSearchParams] = useSearchParams()

  const { dispatch, totalAmountSpent, editPurchase, ordersData } = useContext(CrmContext)

  const [isSelectOpen, setIsSelectOpen] = useState(false)

  const [initCustId, setInitCustId] = useState('')
  const [products, setProducts] = useState(null)
  const [formData, setFormData] = useState({
    item: '',
    price: '',
    selectItem: '',
  })

  const params = useParams()

  const { price, item, selectItem } = formData

  useEffect(() => {
    const getData = async () => {
      try {
        const custInfo = await getSingleDoc('customers', params.uid)
        const statsInfo = await getSingleDoc('stats', params.uid)
        dispatch({ type: 'SET_STATS', payload: statsInfo })

        setInitCustId(custInfo.custId)
      } catch (error) {
        console.log(error)
      }
    }

    getData()
  }, [])

  // get orders
  useEffect(() => {
    try {
      const getDbData = async () => {
        const data = await getCollection('orders', params.uid)
        const productsData = await getProducts()
        setProducts(productsData)
        dispatch({ type: 'ORDERS', payload: data })
        dispatch({ type: 'ORDERS_LENGTH', payload: data.length })
      }
      getDbData()
    } catch (error) {
      console.log(error)
    }
  }, [initCustId])

  // 1: make request for the updated array and ID
  // 2: make new stats object
  // 3: make request to update araay using the ID frompm previous request
  // 4: on delete and on edit make reqest to update
  const onDelete = async (id) => {
    try {
      // Filter out the order to be deleted for dom
      const updatedData = ordersData.filter((item) => item.id !== id)
      // get item to be deleted for the price info
      const deletedItem = ordersData.find((item) => item.id === id)
      // Get the price of the deleted order
      const deletedPrice = deletedItem.data.price

      // Dispatch to update the UI
      dispatch({ type: 'ORDERS', payload: updatedData })

      // Update the total amount spent using filtered item
      const newTotalAmountSpent = updatedData.reduce((value, item) => {
        return value + parseInt(item.data.price)
      }, 0)

      let goldCustomer

      if (newTotalAmountSpent <= 1000) {
        goldCustomer = false
      }

      // Dispatch to update the total amount spent and the number of orders for dom
      dispatch({ type: 'SET_TOTAL_AMOUNT_SPENT', payload: newTotalAmountSpent })
      dispatch({ type: 'ORDERS_LENGTH', payload: updatedData.length })

      // Get the current stats object
      const statsOBJ = await getDocument(initCustId, 'stats')

      // Calculate the new total points after deleting the order
      const newPointsForOrder = getPointsEarned1(statsOBJ.amountSpent - deletedPrice)
      const currentPointsForOrder = getPointsEarned1(statsOBJ.amountSpent)

      const rating = getRating(statsOBJ.amountSpent - deletedPrice)

      // Update the stats object
      const updatedStats = {
        ...statsOBJ,
        amountSpent: statsOBJ.amountSpent - deletedPrice,
        points: statsOBJ.points - (currentPointsForOrder - newPointsForOrder),
        numberOfOrders: statsOBJ.numberOfOrders - 1,
        rating,
        goldCustomer,
      }

      // Update the stats object in the database
      await updateCustomerStats('stats', initCustId, updatedStats)

      // Delete the actual order document from the database
      await deleteDoc(doc(db, 'orders', id))

      // update the state
      dispatch({ type: 'SET_STATS', payload: updatedStats })

      toast.success('Order deleted successfully')
    } catch (error) {
      console.error('Error deleting order: ', error)
      toast.error('Failed to delete order')
    }
  }

  const openModal = () => {
    if (editPurchase === false) {
      dispatch({ type: 'TOGGLE_EDIT_PURCHASE', payload: true })
    }
  }

  const onEdit = (id) => {
    openModal()
    setSearchParams((prev) => {
      prev.set('editItemId', id)
      return prev
    })
  }

  const onMutate = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if (selectItem === '' || price === '') {
      toast.error('please enter a item and price!')
      return
    }

    try {
      const newOrder = {
        ...formData,
        price: parseInt(price), //+= on to obj stats
        customerUid: params.uid,
        timestamp: serverTimestamp(),
        edited: false,
        agentId: params.agentUid,
        agentName: loggedInUser?.displayName?.split(' ')[0],
        dateOfOrder: new Date().toLocaleString('en-GB'),
        customerName: params.name,
        customerEmail: searchParams.get('email'),
        pointsForOrder: getPointsEarned1(parseInt(price), 0),
      }

      // console.log(newOrder)

      const data = await newDataBaseEntry('orders', newOrder, params.uid)

      const fetchOrdersWithNewOrder = await getCollection('orders', params.uid)
      // this getStatsObj to get the  UID index to update the document with
      const getStatsObj = await getStatsObjToEdit('stats', initCustId)

      const statsID = getStatsObj[0].id

      let sum = totalAmountSpent + parseInt(price)

      let points = 0
      let goldCustomer = false
      let rating = 0

      if (sum >= 1000) {
        goldCustomer = true
      }

      // console.log(goldCustomer)
      const totalPoints = getPointsEarned1(sum, points)
      const ratingAmount = getCustomerRating(sum, rating)

      const updatedStats = {
        ...getStatsObj[0].data,
        numberOfOrders: fetchOrdersWithNewOrder.length,
        amountSpent: totalAmountSpent + parseInt(price),
        points: totalPoints,
        goldCustomer,
        rating: ratingAmount,
      }

      // sum up batch updates for dom
      dispatch({ type: 'ORDERS', payload: data })
      dispatch({
        type: 'SET_TOTAL_AMOUNT_SPENT',
        payload: totalAmountSpent + parseInt(formData.price),
      })
      dispatch({ type: 'ORDERS_LENGTH', payload: data.length })

      await updateCustomerStats('stats', statsID, updatedStats)

      const getUpdStatsObj = await getStatsObjToEdit('stats', initCustId)

      // update the dom
      dispatch({ type: 'SET_STATS', payload: getUpdStatsObj[0].data })

      // reset form data
      setFormData({
        item: '',
        price: '',
        selectItem: 'please select',
      })
    } catch (error) {
      console.log(error)
    }
  }

  if (!ordersData) {
    return <h1>Loading ... </h1>
  }

  const handleSelect = (data) => {
    console.log(data)
    setIsSelectOpen(false)

    setFormData((prev) => ({
      ...prev,
      selectItem: data.name,
      price: data.price,
    }))

    // const selectedId =
    //   event.target.options[event.target.selectedIndex].getAttribute('data-id')
    // const selectedProduct = products.find((product) => product.id === selectedId)
    // console.log(selectedId)

    // console.log(event.target)

    // Get the data-id from the selected option
    // const test = event.target.selectedIndex
    // const selectedDataId = event.target.selectedOptions[0].dataset.id

    // console.log(test)
    // Or from the select element itself
    // const selectElement = event.target

    // console.log('Selected option data-id:', selectedDataId)
    // console.log('Select element:', selectElement)

    // set price here
    // enter qty
  }

  // if add new and there
  // amount += 1
  // else add new item if() else 

  return (
    <div>
      <div className="form-container">
        <form onSubmit={onSubmit} className="">
          <div className="custom-select-div">
            <button
              onClick={() => setIsSelectOpen((prev) => !prev)}
              type="button"
              className={`custom-select`}
            >
              <span>{selectItem || 'Select an option'}</span>
              <span className={`arrow ${'open'}`}>▼</span>
            </button>

            <div
              className={isSelectOpen ? 'select-dropdown show-select' : 'select-dropdown'}
            >
              {products &&
                products.map((prod) => {
                  const { id, data } = prod

                  return (
                    <div
                      onClick={() => handleSelect(data)}
                      key={id}
                      className="select-option"
                    >
                      <span>{data.name}</span>
                      <span>{formatPrice(data.price)}</span>
                    </div>
                  )
                })}
            </div>
          </div>

          <button className="booking-button" type="submit">
            Place Order
          </button>
        </form>
      </div>

      <div className="order-display-div">
        <ul>
          {ordersData &&
            ordersData.map((item) => {
              return (
                <li key={item.id} className="order-item">
                  <div className="order-item-top">
                    <div className="order-item-div"> {item.data.selectItem}</div>
                    <div className="order-item-div"> {formatPrice(item.data.price)}</div>
                    <div className="order-item-div order-item-booked-by">
                      {' '}
                      <span>{auth.currentUser.displayName}</span>{' '}
                      <span> {item.data.dateOfOrder}</span>
                    </div>
                  </div>

                  <div className="order-btn-container">
                    <button onClick={() => onEdit(item.id)}>
                      <EditIcon className="order-edit" />
                    </button>
                    <button onClick={() => onDelete(item.id)} className="order-delete">
                      X
                    </button>
                  </div>
                </li>
              )
            })}
        </ul>
      </div>

      {ordersData.length < 3 && <DataSvgIcon />}
    </div>
  )
}

export default DisplayOrders
