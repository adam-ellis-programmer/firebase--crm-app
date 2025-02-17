import { useState, useEffect } from 'react'
import FormRow from './FormRow'
import ComponentHeader from './ComponentHeader'
import { getManagers } from '../../crm context/CrmAction'
import { useAuthStatusTwo } from '../../hooks/useAuthStatusTwo'
import { getFunctions, httpsCallable } from 'firebase/functions'

const NewAgent = ({ data }) => {
  // console.log(data)
  const { claims } = useAuthStatusTwo()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: 'Fiona',
    lastName: 'Ellis',
    email: 'fiona@gmail.com',
    password: '111111',
  })

  // Update formData when claims load
  useEffect(() => {
    if (claims?.claims) {
      setFormData((prev) => ({
        ...prev,
        organizationId: claims.claims.organizationId,
        organization: claims.claims.organization,
      }))
    }
  }, [claims])

  const formArr = Object.entries(formData)

  const handleFormInput = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const onSelectChange = (e) => {
    // const selectedFullName = e.target
    const selectedOption = e.target.selectedOptions[0] // Get the selected option
    const managerId = selectedOption.dataset.managerId // Get the data-manager-id value
    const managerName = selectedOption.value
    console.log({ managerId, managerName })
    setFormData((prev) => ({
      ...prev,
      reportsTo: {
        id: managerId,
        name: managerName,
      },
    }))
  }

  // on submit we have to check for
  // 1: -- organization id
  // 2: -- claims.manager = true

  const handleSubmit = async (e) => {
    if (!formData.reportsTo || formData.reportsTo.name === '') {
      console.log('Please select a reports to!')
      return
    }
    setLoading(true)
    e.preventDefault()
    // const form = e.target
    // console.log(formData)

    const functions = getFunctions()

    // Create a reference to your function
    const authTest = httpsCallable(functions, 'adminAddUser')

    // Call the function
    try {
      const result = await authTest({ data: formData })
      console.log(result.data)
      resetForm()
    } catch (error) {
      setLoading(false)
      console.error('Error:', error)
    }
  }

  function resetForm() {
    setFormData((prev) => ({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      reportsTo: { id: '', name: '' },
      organizationId: prev.organizationId,
      organization: prev.organization,
    }))
    setLoading(false)
  }

  const handleTest = async () => {
    const functions = getFunctions()

    // Create a reference to your function
    const authTest = httpsCallable(functions, 'singleUpdate')

    // Call the function
    try {
      const result = await authTest({ id: 'HEL--9223343305' })
      console.log(result.data)
      resetForm()
    } catch (error) {
      setLoading(false)
      console.error('Error:', error)
    }
  }
  return (
    <div>
      <button onClick={handleTest}>test me</button>
      <form onSubmit={handleSubmit} className="admin-form">
        <ComponentHeader text={`add new agent`} />
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
          <label className="admin-label" htmlFor="admin-label">
            Select Who Reports To
          </label>
          <select
            className="admin-select"
            id="admin-label"
            name="reportsTo"
            value={formData.reportsTo?.name || ''} // Change this to use the name property
            onChange={onSelectChange}
          >
            <option data-manager-id={'please-select'} value="">
              Select Manager
            </option>
            {data?.map((item) => {
              const { data } = item
              const fullName = `${data.firstName} ${data.lastName}`
              return (
                <option
                  data-manager-id={data.id}
                  key={item.id}
                  value={fullName} // Add value here
                >
                  {fullName}
                </option>
              )
            })}
          </select>
        </div>

        <div className="admin-btn-container">
          <button disabled={loading} className="admin-add-agent-btn">
            {loading ? 'making user' : 'submit'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewAgent
