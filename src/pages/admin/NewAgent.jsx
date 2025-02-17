import { useState, useEffect } from 'react'
import FormRow from './FormRow'
import ComponentHeader from './ComponentHeader'
import { getManagers } from '../../crm context/CrmAction'
import { useAuthStatusTwo } from '../../hooks/useAuthStatusTwo'
import { getFunctions, httpsCallable } from 'firebase/functions'

const NewAgent = ({ data }) => {
  // console.log(data)
  const { claims } = useAuthStatusTwo()
  // console.log(claims)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: 'Fiona',
    lastName: 'Ellis',
    email: 'fiona@gmail.com',
    password: '111111',
    reportsTo: null,
  })

  // Update formData when claims load
  useEffect(() => {
    if (claims?.claims) {
      setFormData((prev) => ({
        ...prev,
        organizationId: claims.claims.organizationId,
        organization: claims.claims.organization,
        orgId: claims.claims.orgId,
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
    e.preventDefault()
    // const form = e.target
    // check for all values
    // prettier-ignore
    // We use && (AND) instead of || (OR) because we want ALL of these conditions to be true for each value.
    // If ANY of these conditions fails (i.e., if the value IS an empty string, or IS null, or IS undefined), the whole expression returns false.
    // loops
    // some and every
    const isFormComplete = Object.values(formData).every((value) => value !== '' && value !== null && value !== undefined)

    if (!isFormComplete) {
      console.log('please fill in all fields')
      return
    }
    setLoading(true)

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
    const authTest = httpsCallable(functions, 'simpleQuery')

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
                  data-manager-id={data.docId}
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
