import React from 'react'
import FormRow from './FormRow'
import { useState } from 'react'
import CheckboxRow from './CheckboxRow'
import ComponentHeader from './ComponentHeader'
import { getFunctions, httpsCallable } from 'firebase/functions'
const ChangeAccess = () => {
  const [loading, setLoading] = useState({
    populate: false,
    submit: false,
  })

  const [formData, setFormData] = useState({
    superAdmin: false,
    admin: false,
    manager: false,
    ceo: false,
    sales: false,
    email: 'fiona@gmail.com',
  })

  // leave for reference ***
  const allChecked = Object.entries(formData)
    .filter(([key]) => key !== 'email') // Exclude email field
    .every(([_, value]) => value === true)
  // leave for reference ***

  // Check if any checkbox is true
  // if any value is true
  const anyChecked = Object.entries(formData)
    .filter(([key]) => key !== 'email')
    .some(([_, value]) => value === true)

  const handleSelectAll = () => {
    // If any checkboxes are true, set all to false
    const newValue = !anyChecked
    console.log(anyChecked)

    setFormData((prev) => ({
      ...prev,
      superAdmin: newValue,
      admin: newValue,
      manager: newValue,
      ceo: newValue,
      sales: newValue,
    }))
  }

  const onChange = (e) => {
    const { name, type, checked, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      // Use checked for checkboxes, value for text inputs
      [name]: type === 'checkbox' ? checked : value,
    }))
  }
  const formArr = Object.entries(formData)

  const onPopulate = async (e) => {
    e.preventDefault()
    handleLoading('populate', true)
    try {
      const functions = getFunctions()
      const getClaims = httpsCallable(functions, 'getClaims')
      const res = await getClaims({ email: formData.email })
      // Added optional chaining (?.) to safely access nested properties
      // Added nullish coalescing operator (??) to provide default values
      // Provides a fallback value if the result is null or undefined
      setFormData((prevState) => ({
        ...prevState,
        superAdmin: res.data.claims?.superAdmin ?? false,
        admin: res.data.claims?.admin ?? false,
        manager: res.data.claims?.manager ?? false,
        ceo: res.data.claims?.ceo ?? false,
        sales: res.data.claims?.sales ?? false,
        email: formData.email,
      }))
      handleLoading('populate', false)
    } catch (error) {
      handleLoading('populate', false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    handleLoading('submit', true)

    try {
      const functions = getFunctions()
      const updateAccess = httpsCallable(functions, 'updateAccess')
      const res = await updateAccess({ data: formData })
      console.log(res)
      handleLoading('submit', false)
      handleReset()
    } catch (error) {
      console.log(error)
      handleLoading('submit', false)
    }
  }

  function handleLoading(field, value) {
    setLoading((prevState) => ({
      ...prevState,
      [field]: value,
    }))
  }

  // first loops around all the entries
  // converts this into an array of key-value pairs:
  // method then loops through each pair:
  function handleReset() {
    setFormData((prev) => {
      const resetData = Object.entries(prev).reduce((acc, [key, _]) => {
        // Keep email field empty string, set all others to false
        acc[key] = key === 'email' ? '' : false
        return acc
      }, {})
      return resetData
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="admin-form">
        <ComponentHeader text={`change agent access`} />

        <div className="admin-checked-wrap check-text">
          {formArr.slice(5, 6).map((item) => {
            const [key, value] = item
            return (
              <FormRow
                key={key}
                type={'text'}
                name={key}
                placeholder={`Enter ${key}`}
                onChange={onChange}
                checked={value}
                labelext={key}
                value={formData.email}
                // id={key}
                // added to stop duplicate on page
                formId="change-agent"
              />
            )
          })}
        </div>

        {/* Select All checkbox */}
        <div className="admin-checked-wrap">
          <label className="admin-check-label" htmlFor="selectAll">
            {anyChecked ? 'Deselect All' : 'Select All'}
          </label>
          <input
            id="selectAll"
            className="admin-check-box"
            type="checkbox"
            checked={anyChecked}
            onChange={handleSelectAll}
          />
        </div>
        {/* Individual checkboxes */}

        <div className="admin-checked-wrap">
          {formArr.slice(0, 5).map((item) => {
            const [key, value] = item
            return (
              <CheckboxRow
                key={key}
                type={'checkbox'}
                name={key}
                placeholder={`Enter ${key}`}
                onChange={onChange}
                checked={value}
                labelext={key}
                id={key}
                // added to stop duplicate on page
                // formId="delete-agent"
              />
            )
          })}
        </div>

        <div className="admin-btn-container">
          <button
            disabled={loading.populate}
            onClick={onPopulate}
            type="button"
            className={`${
              loading.populate
                ? 'admin-add-agent-btn admin-btn-disabled'
                : 'admin-add-agent-btn'
            }`}
          >
            {loading.populate ? 'populating...' : 'populate'}
          </button>
          <button
            disabled={loading.submit}
            className={`${
              loading.submit
                ? 'admin-add-agent-btn admin-btn-disabled'
                : 'admin-add-agent-btn'
            }`}
          >
            {loading.submit ? 'submiting...' : 'submit'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChangeAccess
