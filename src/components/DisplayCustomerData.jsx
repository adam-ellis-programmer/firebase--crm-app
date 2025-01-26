import { useState, useContext } from 'react'
import CrmContext from '../crm context/CrmContext'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import { getAuth } from 'firebase/auth' // only show if it's that agent's listing
import { onSubmit } from '../crm context/CrmAction'
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'

import ProfileControlButtons from './ProfileControlButtons'

function DisplayCustomerData({ customer }) {
  const { changeDetails } = useContext(CrmContext)

  const location = useLocation()

  const [data, setData] = useState({
    name: customer.name,
    phone: customer.email,
    fullData: customer,
  })
  //
  const { name, phone } = data

  const params = useParams()
  const navigate = useNavigate()
  const auth = getAuth()

  const onChange = (e) => {
    setData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  try {
    // if change details true
    changeDetails && onSubmit(params.uid, name, phone)
  } catch (error) {
    console.log(error)
  }

  if (!customer) {
    return <h1>Loading ... </h1>
  }

  return (
    <div>
      <div className="profile-card profile-page-card">
        <form>
          <input
            className={changeDetails ? 'profile-input' : 'profile-card-active'}
            type="text"
            id="name"
            onChange={onChange}
            value={name}
            disabled={!changeDetails}
          />
          <input
            className={changeDetails ? 'profile-input' : 'profile-card-active'}
            type="text"
            id="phone"
            onChange={onChange}
            value={phone}
            disabled={!changeDetails}
          />
        </form>
      </div>

      <div className="customer-details">
        <div className="customer-details-container">
          <p className="profile-extra-info">
            Cust ID <span>{customer.custId} </span>{' '}
          </p>
          <p className="profile-extra-info">
            Email <span>{customer.email} </span>
          </p>
          <p className="profile-extra-info">
            Date Of Signup <span>{customer.dateOfSignUp} </span>
          </p>
          <p className="profile-extra-info">
            Sign Up Agent
            <span>{customer.signUpagent ? customer.signUpagent : 'System'}</span>
          </p>
          <p className="profile-extra-info">
            Company
            <span>{customer.company}</span>
          </p>
          {/* prettier-ignore */}
          <p className="profile-extra-info profile-formatedAddress">
            Address
            <span>
              {customer.signUpagent ? customer.formattedAddress : 'System'}
            </span>
          </p>
          <p className="profile-extra-info">
            Postcode
            <span>ST5 1LT</span>
          </p>
          <p className="profile-extra-info">
            agent reports to
            <span>{customer.reportsTo.name}</span>
          </p>
        </div>

        {/* to be tested and completed */}
        {/* <UpdateReportToData /> */}
        <ProfileControlButtons />
      </div>

      <div className="map-container">
        <MapContainer
          style={{
            height: '100%',
            width: '100%',
            borderRadius: '2em',
          }}
          center={[customer.geoLocation.lat, customer.geoLocation.lng]}
          zoom={14}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[customer.geoLocation.lat, customer.geoLocation.lng]}>
            <Popup>
              <div
                className="box"
                style={{
                  width: '100%',
                  fontSize: '20px',
                }}
              >
                Customers Address <br /> Easily customizable.
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  )
}

export default DisplayCustomerData
