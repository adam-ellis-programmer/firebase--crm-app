import { formatPrice } from '../CrmFunctions'

const OrderCard = ({ item, auth, onEdit, EditIcon, isDeleting, onDelete }) => {
  return (
    <li className="order-item">
      <div className="order-item-top">
        <div className="order-item-div">
          <span> item</span>
          <span> {item.data.selectItem}</span>
        </div>
        <div className="order-item-div">
          <span>price</span>
          <span>{formatPrice(item.data.price)}</span>
        </div>
        <div className="order-item-div order-item-booked-by">
          <span>sold by</span>
          <span>{auth.currentUser.displayName}</span>{' '}
        </div>
        <div className="order-item-div">
          <span>order date</span>
          <span> {item.data.dateOfOrder.split(' ')[0]}</span>
        </div>
        <div className="order-item-div">
          <span>order time</span>
          <span> {item.data.dateOfOrder.split(' ')[1]}</span>
        </div>
      </div>

      <div className="order-btn-container">
        <button onClick={() => onEdit(item.id)}>
          <EditIcon className="order-edit" />
        </button>
        <button
          disabled={isDeleting}
          onClick={() => onDelete(item.id)}
          className="order-delete"
        >
          X
        </button>
      </div>
    </li>
  )
}

export default OrderCard
