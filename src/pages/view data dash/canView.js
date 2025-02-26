const ROLES = {
  SALES: 1,
  MANAGER: 2,
  ADMIN: 3,
  CEO: 4,
}
// run in a loop
export const canViewData = (viewer, targetId) => {
  // if (targetId === ROLES['CE0']) {
  //   return true
  // }
  // Same level can view each other
  // if (viewer === targetId) {
  //   return true
  // }
  // Higher roles can view lower roles (looking down)
  
  // if (viewer > targetId) {
  //   return true
  // }

  // Check if targetId is a direct subordinate
  // if (viewer.subordinates.includes(targetId)) {
  //   return true
  // }

  // Lower roles cannot view higher roles (looking up)
  return false
}

// /**
//  * Check if target is anywhere in the viewer's reporting chain
//  *
//  * @param {string} viewerId - ID of the potential manager
//  * @param {string} targetId - ID of the potential subordinate
//  * @returns {boolean} Whether target is in viewer's reporting chain
//  */
// export function isInReportingChain(viewer, target) {
//   // const viewer = agents.find((agent) => agent.id === viewerId)

//   // Check direct subordinates
//   if (viewer.subordinates.includes(target)) {
//     return true
//   }

//   // Check each subordinate's subordinates recursively
//   for (const subId of viewer.subordinates) {
//     if (isInReportingChain(subId, target)) {
//       return true
//     }
//   }

//   return false
// }
