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

  useEffect(() => {
    const getData = async () => {
      // guard clause to exit the function early if loggedInUser is not defined (stops error in console)
      if (!loggedInUser || !loggedInUser.uid) {
        setLoading(false)
        return
      }

      try {
        const data = []
        const q = query(
          collection(db, 'customers'),
          // only get data that belongs to manager of that agent
          where('reportsTo.id', '==', loggedInUser.uid)
        )

        if (!q) return // Skip execution if `q` is not constructed

        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          data.push({ data: doc.data(), id: doc.id })
        })
        setCustomers(data)
      } catch (error) {
        console.error('Error fetching data: ', error)
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [loggedInUser])

  if (loading) {
    return <Loader />
  }

  return (
    <div className="page-container all-data-page-container">
      <section className="all-data-section-top">
        <p className="all-data-header-p">managers page all data</p>
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
