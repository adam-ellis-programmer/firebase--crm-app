import React from 'react'

const SelectRow = ({ data, onChange, name, text, labelText, value, id }) => {
  const uniqueId = `${id}-${value}`
  return (
    <div className="select-row-wrap">
      <label htmlFor={id} className="admin-label">
        {labelText}
      </label>
      <select className="admin-select" onChange={onChange} name={name} id={id}>
        <option value="select-agent">{text}</option>
        {data?.map((item) => {
          const { id, data } = item
          // console.log(data)
          const fullName = `${data.firstName} ${data.lastName}`
          return (
            <option key={id} data-id={id} value={data.value} name={'data.fullName'}>
              {fullName}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default SelectRow
