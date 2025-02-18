import React from 'react'
import FormRow from './FormRow'
import { useState } from 'react'
import ComponentHeader from './ComponentHeader'
import { getFunctions, httpsCallable } from 'firebase/functions'

const DeleteAgent = () => {
  const [loading, setLoading] = useState({
    delete: false,
  })
  const [formData, setFormData] = useState({
    email: '',
  })

  const onChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const formArr = Object.entries(formData)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      handleLoading('delete', true)
      const functions = getFunctions()
      const deleteAgent = httpsCallable(functions, 'deleteAgent')
      const data = await deleteAgent({ email: formData.email })
      handleReset()
      console.log(data)
      handleLoading('delete', false)
    } catch (error) {
      handleLoading('delete', false)
      console.log(error)
    }
  }

  function handleLoading(field, value) {
    setLoading((prevState) => ({
      ...prevState,
      [field]: value,
    }))
  }

  function handleReset() {
    setFormData((prev) => {
      const resetData = Object.entries(prev).reduce((acc, [key, _]) => {
        acc[key] = ''
        return acc
      }, {})
      return resetData
    })
  }
  return (
    <div>
      <form id="form" onSubmit={handleSubmit} className="admin-form">
        <ComponentHeader text={`delete agent`} />

        {formArr.map((item) => {
          const [key, value] = item
          return (
            <FormRow
              key={key}
              type={'text'}
              name={key}
              value={value}
              placeholder={`Enter ${key}`}
              onChange={onChange}
              // added to stop duplicate on page
              formId="delete-agent"
            />
          )
        })}

        <div className="admin-btn-container">
          <button
            disabled={loading.delete}
            className={`${
              loading.delete
                ? 'admin-add-agent-btn admin-btn-disabled'
                : 'admin-add-agent-btn'
            }`}
          >
            {loading.delete ? 'deleting...' : 'delete'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DeleteAgent
