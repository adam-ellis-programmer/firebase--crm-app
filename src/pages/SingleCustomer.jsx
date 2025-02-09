import { useEffect, useState, useContext } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'

import DisplayCustomerData from '../components/DisplayCustomerData'
import DisplayOrders from '../components/DisplayOrders'
import DisplayNotes from '../components/DisplayNotes'
import DeleteModal from '../drop down modals/DeleteModal'

import CrmContext from '../crm context/CrmContext'
import OrdersSumUp from '../components/OrdersSumUp'
import OrderEdit from '../drop down modals/OrderEdit'
import NoteEdit from '../drop down modals/NoteEdit'
import SendEmail from '../drop down modals/SendEmail'

import ProgressBar from '../components/ProgressBar'
import DetailsPageStats from '../components/DetailsPageStats'
import Loader from '../assets/Loader'

function SingleCustomer() {
  const { deleteBtn, editPurchase, editNote, toggleEmail, ordersLength, notesLength } =
    useContext(CrmContext)

  const [searchParams, setSearchParams] = useSearchParams()

  const [customer, setCustomer] = useState(null)
  const [testing, setTesting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)
  const navigate = useNavigate()
  const params = useParams()

  const auth = getAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'customers', params.uid)
        const docSnap = await getDoc(docRef)
        // check if document exists
        if (docSnap.exists()) {
          // console.log(docSnap.data());
          setCustomer(docSnap.data())
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    // try / catch and finally to set loader 0
    fetchData()
  }, [navigate, params.uid])

  window.addEventListener('popstate', (e) => {
    // navigate(`/data/${params.uid}`);
  })
  const pathname = window.location.pathname

  window.addEventListener('popstate', (e) => {
    if (
      pathname === document.location.pathname &&
      pathname.includes('/single-customer/')
    ) {
      navigate(`/data/${params.uid}`)
    }
  })

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <ProgressBar />
      <div className="page-container grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3">
        {searchParams.get('name')}
        <div className="customer-box cusomer-info-box">
          {toggleEmail && <SendEmail />}
          {deleteBtn && <DeleteModal />}
          <div className="customer-page-heading">
            <h2 className="page-heading">Personal Details</h2>
            <div className="profile-pic-container">
              <img
                className="profile-pic"
                // src="https://i.pravatar.cc/300"
                src={customer && customer?.urlData.url}
                alt=""
              />
            </div>
          </div>
          <DisplayCustomerData customer={customer} setCustomer={setCustomer} />
        </div>
        <div className="customer-box customer-box-orders">
          {editPurchase && <OrderEdit />}
          <DetailsPageStats />
          <div className="customer-page-heading">
            <h2 className="page-heading">
              Orders
              <div className="number-of-sales"> {ordersLength}</div>
            </h2>
            <OrdersSumUp />
          </div>
          <DisplayOrders />
        </div>
        <div className="customer-box customer-box-notes">
          {editNote && <NoteEdit />}
          <div className="customer-page-heading ">
            <h2 className="page-heading">
              Notes
              <div className="number-of-notes"> {notesLength}</div>
            </h2>
          </div>
          <DisplayNotes />
        </div>
      </div>
    </>
  )
}

export default SingleCustomer
