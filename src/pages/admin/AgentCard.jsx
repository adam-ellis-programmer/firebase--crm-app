import React from 'react'
// const totalLength = agentData.length + claimsData.length
// const arr = Array.from({ length: totalLength }, (_, i) => {
//   return i + 1
// })

const AgentCard = ({ item, i }) => {
  const { data: agent } = item
  const { data } = item
  const { claims } = data

  //   console.log(data?.reportsTo)

  const structuredData = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    organization: data.organization,
    claims: data.claims,
    reportsTo: data?.reportsTo,
  }

  // console.log(structuredData)

  const agentData = Object.entries(structuredData)
  const claimsData = Object.entries(structuredData.claims)
  const reportsToData = Object.entries(structuredData?.reportsTo ?? [])

  function formatField(fieldName) {
    const findCaps = /([A-Z])/g
    const findFirstLetter = /^./

    return fieldName
      .replace(findCaps, ' $1')
      .replace(findFirstLetter, (str) => str.toUpperCase())
  }

  return (
    <div className="agent-card">
      <div className="agent-card-inner-div">
        <span className="item-num-span">{i + 1}</span>
        {agentData.slice(0, 2).map(([key, value]) => {
          return (
            <React.Fragment key={`agent-${formatField(key)}`}>
              <span className="card-key-value-pair">
                <div className="agent-card-name-info key">{formatField(key)}:</div>{' '}
                <div className="agent-card-name-info value">{value}</div>
              </span>
            </React.Fragment>
          )
        })}
      </div>
      <div>
        <div className="agent-card-inner-div">
          {agentData.slice(2, 4).map(([key, value]) => {
            //   console.log(key)
            return (
              <span key={key} className="card-key-value-pair">
                <div className="agent-card-name-info key">{formatField(key)}:</div>{' '}
                <div className="agent-card-name-info value">{value}</div>
              </span>
            )
          })}
        </div>
      </div>
      <div>
        <div className="agent-card-inner-div-claims">
          {claimsData.slice(0, 3).map(([key, value]) => {
            return (
              <span key={key} className="card-key-value-pair">
                <div className="agent-card-name-info key">
                  <span className="agent-card-claims-key">{formatField(key)}</span>
                </div>
                <div className="agent-card-name-info value">
                  {value ? (
                    <i className="fa-solid fa-check text-green-500"></i>
                  ) : (
                    <i className="fa-solid fa-xmark text-red-500"></i>
                  )}
                </div>
              </span>
            )
          })}
        </div>
      </div>
      <div className="agent-card-inner-div-claims">
        {claimsData.slice(3, 5).map(([key, value]) => {
          return (
            <span key={key} className="card-key-value-pair">
              <div className="agent-card-name-info key">
                <span className="agent-card-claims-key">{key}</span>
              </div>
              <div className="agent-card-name-info value">
                {value ? (
                  <i className="fa-solid fa-check text-green-500"></i>
                ) : (
                  <i className="fa-solid fa-xmark text-red-500"></i>
                )}
              </div>
            </span>
          )
        })}
      </div>

      <div className="agent-card-inner-div-claims">
        {reportsToData.slice(1, 2).map(([key, value]) => {
          return (
            <span key={key} className="card-key-value-pair">
              <div className="agent-card-name-info key">{formatField('reportsTo')}:</div>{' '}
              <div className="agent-card-name-info value">{value}</div>
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default AgentCard
