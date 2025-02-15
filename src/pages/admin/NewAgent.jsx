import { useState, useEffect } from 'react'
import FormRow from './FormRow'
import ComponentHeader from './ComponentHeader'
import { getManagers } from '../../crm context/CrmAction'
import { useAuthStatusTwo } from '../../hooks/useAuthStatusTwo'

const NewAgent = () => {
  const { claims } = useAuthStatusTwo()
  console.log(claims?.claims?.organizationId)
  const [managers, setManagers] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    reportsTo: '',
  })

  useEffect(() => {
    const getData = async () => {
      const data = await getManagers(claims?.claims?.organizationId)
      setManagers(data)
      console.log(data)
    }

    getData()
    return () => {}
  }, [claims?.claims?.organizationId])

  const formArr = Object.entries(formData)

  const handleFormInput = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  // on submit we have to check for
  // 1: -- organization id
  // 2: -- claims.manager = true

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="admin-form">
        <ComponentHeader text={`new agent`} />
        {/* Slice from index 0 to 4 to get only firstName, lastName, email, and password */}
        {formArr.slice(0, 4).map((item) => {
          const [key, value] = item
          return (
            <FormRow
              key={key}
              type={'text'}
              name={key}
              value={value}
              placeholder={`Enter ${key}`}
              onChange={handleFormInput}
              // added to stop duplicate on page
              formId="new-agent"
            />
          )
        })}
        {/* Add select box for reportsTo separately */}
        <div className="select-row">
          <label className='admin-label' htmlFor="">Select Who Reports To</label>
          <select
            className="admin-select"
            name="reportsTo"
            value={formData.reportsTo}
            onChange={handleFormInput}
          >
            <option value="">Select Manager</option>
            {/* Add your options here */}
            {managers?.map((item) => {
              const { data } = item
              const fullName = `${data.firstName} ${data.lastName}`
              return <option key={item.id}>{fullName}</option>
            })}
          </select>
        </div>

        <div className="admin-btn-container">
          <button className="admin-add-agent-btn">submit</button>
        </div>
      </form>
    </div>
  )
}

export default NewAgent
