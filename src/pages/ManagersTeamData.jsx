import { getFunctions, httpsCallable } from 'firebase/functions'
import { useEffect, useState } from 'react'
import { db } from '../firebase.config'
import DataAllItem from '../components/DataAllItem'
import { useAuthStatusTwo } from '../hooks/useAuthStatusTwo'
import Loader from '../assets/Loader'

const DataAll = () => {
  const { loggedInUser, claims } = useAuthStatusTwo()
  const [customers, setCustomers] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  console.log(claims)
  useEffect(() => {
    // Reset states when dependencies change
    setLoading(true)
    setError(null)
    setCustomers(null)

    const getData = async () => {
      // Guard clauses for required data
      if (!loggedInUser?.uid || !claims?.claims?.reportsTo?.id) {
        setLoading(false)
        return
      }

      try {
        const functions = getFunctions()
        const getManagersData = httpsCallable(functions, 'getManagersData')

        const data = {
          orgId: claims.claims.reportsTo.id,
          managersId: claims.user_id, 
          // change here
        }

        const res = await getManagersData({ data })
        console.log(res)
        const clients = res.data.clients

        if (!clients || !Array.isArray(clients)) {
          throw new Error('Invalid data format received')
        }

        setCustomers(clients)
      } catch (error) {
        console.error('Error fetching data: ', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [loggedInUser?.uid, claims?.claims?.reportsTo?.id]) // More specific dependencies

  if (loading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="page-container">
        <p className="error-message">Error loading data: {error}</p>
      </div>
    )
  }

  if (!customers || customers.length === 0) {
    return (
      <div className="page-container">
        <p>No team data available.</p>
      </div>
    )
  }

  return (
    <div className="page-container all-data-page-container">
      <section className="all-data-section-top">
        <p className="all-data-header-p">
          {claims?.name ? `${claims.name}'s` : 'Team'} <span>team data</span>
        </p>
        <p className="all-data-header-p">
          <span>Org Name:</span> {claims?.claims?.organization || 'N/A'}
        </p>
        <p className="all-data-header-p">
          <span>Number on team:</span> {customers.length}
        </p>
      </section>

      <section className="all-data-section">
        <div className="data-header">
          <div className="data-header-div">ID</div>
          <div className="data-header-div">img</div>
          <div className="data-header-div">name</div>
          <div className="data-header-div">email</div>
          <div className="data-header-div">company</div>
          <div className="data-header-div">phone</div>
          <div className="data-header-div">reg</div>
          <div className="data-header-div">owner</div>
          <div className="data-header-div">rep to</div>
        </div>

        {customers.map((customer, i) => (
          <DataAllItem
            key={customer.id}
            customer={customer}
            i={i}
            loggedInUser={loggedInUser}
          />
        ))}
      </section>
    </div>
  )
}

export default DataAll
