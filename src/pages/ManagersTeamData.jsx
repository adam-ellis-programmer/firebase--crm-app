import { getFunctions, httpsCallable } from 'firebase/functions'
import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase.config'
import DataAllItem from '../components/DataAllItem'
import { useAuthStatusTwo } from '../hooks/useAuthStatusTwo'
import Loader from '../assets/Loader'

const DataAll = () => {
  const { loggedInUser, claims } = useAuthStatusTwo()
  const [customers, setCustomers] = useState(null)
  const [loading, setLoading] = useState(true)
  const [agentClaims, setAgentClaims] = useState(null)

  // make sure we get correct company data
  useEffect(() => {
    if (claims?.claims) {
      setAgentClaims(claims?.claims)
    }
    return () => {}
  }, [claims?.claims])

  useEffect(() => {
    const getData = async () => {
      // guard clause to exit the function early if loggedInUser is not defined (stops error in console)
      if (!loggedInUser || !loggedInUser.uid) {
        setLoading(false)
        return
      }

      try {
        const functions = getFunctions()
        const getManagersData = httpsCallable(functions, 'getManagersData')
        const data = {
          orgId: agentClaims?.reportsTo.id,
          managersId: agentClaims?.reportsTo.id,
        }
        const res = await getManagersData({ data })
        const clients = res.data.clients
        console.log(clients)
        setCustomers(clients)
      } catch (error) {
        console.error('Error fetching data: ', error)
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [loggedInUser, agentClaims])

  if (loading) {
    return <Loader />
  }
  // reports to is their manager
  // console.log(agentClaims)
  console.log(claims)

  return (
    <div className="page-container all-data-page-container">
      <section className="all-data-section-top">
        <p className="all-data-header-p">
          {`${claims?.name}'s`} <span>team data</span>{' '}
        </p>
        <p className="all-data-header-p">
          {' '}
          <span>Org Name:</span> {`${claims?.claims?.organization}`}{' '}
        </p>
        <p className="all-data-header-p">
          {' '}
          <span>Number on team</span> {`10`}{' '}
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

        {customers &&
          customers.map((customer, i) => (
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
