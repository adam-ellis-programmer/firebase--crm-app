import { createContext, useReducer } from 'react'
import { CrmReducer } from './CrmReducer'

const CrmContext = createContext()

export const CrmDataContextProvider = ({ children }) => {
  const initialState = {
    deleteBtn: false,
    totalAmountSpent: 0,
    custOrders: null,
    editPurchase: false,
    editNote: false,
    toggleEmail: false,
    ordersData: null,
    notesData: null,
    ordersLength: 0,
    notesLength: 0,
    changeDetails: false,
    submitDetails: false,
    navLoginLogoutControl: true,
    sendMessageModal: false,
    readMessageModal: false,
    messageCounter: 0,
    showPasswordResetModal: false,
    customerStats: null,
    profileChartType: 'lineChart',

    nameAndPhoneNumber: {
      name: '',
      phome: '',
    },

    subscriptionInfo: {
      firstName: 'Marina',
      lastName: 'Hyde',
      email: 'hello@waxcandles.com',
      phone: '078966543118',
      orgName: 'waxcandles',
      signUpDate: '',
      expDate: '',
      password: '111111',
    },
  }

  const [state, dispatch] = useReducer(CrmReducer, initialState)

  return (
    <CrmContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </CrmContext.Provider>
  )
}

export default CrmContext
