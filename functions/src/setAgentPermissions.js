function setAccess(role) {
  const RESOURCES = {
    CUSTOMERS: 'customers',
    ORDERS: 'orders',
    PRODUCTS: 'products',
    INVOICES: 'invoices',
    USERS: 'users',
    REPORTS: 'reports',
    ADMIN: 'admin',
  }
  let permissions
  // prettier-ignore
  switch (role) {
        case 'CEO':
            permissions = {
            [RESOURCES.CUSTOMERS]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.ORDERS]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.PRODUCTS]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.INVOICES]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.USERS]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.REPORTS]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.ADMIN]: { hasFullAccess: true, create: true, read: true, update: true, delete: true },
            }
            break;
    
            case 'ADMIN':
            permissions = {
            [RESOURCES.CUSTOMERS]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.ORDERS]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.PRODUCTS]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.INVOICES]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.USERS]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.REPORTS]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.ADMIN]: { hasFullAccess: true, create: true, read: true, update: true, delete: true },
            }
            break;

            case 'MANAGER':
            permissions = {
            [RESOURCES.CUSTOMERS]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.ORDERS]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.PRODUCTS]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.INVOICES]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.USERS]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.REPORTS]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.ADMIN]: { hasFullAccess: true, create: true, read: true, update: true, delete: true },
            }
            break;

            case 'SALES':
            permissions = {
            [RESOURCES.CUSTOMERS]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.ORDERS]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.PRODUCTS]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.INVOICES]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.USERS]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.REPORTS]: {hasFullAccess: true, create: true, read: true, update: true, delete: true },
            [RESOURCES.ADMIN]: { hasFullAccess: true, create: true, read: true, update: true, delete: true },
            }
            break;
        default:
            break;
    }
  return permissions
}

module.exports = {
  setAccess,
}
