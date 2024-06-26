const LAYOUT_PATH = '/content/';

export const routesConstant = {
  adminLogin: '/auth/admin/login',
  adminRegister: '/auth/admin/register',
  adminDashboard: '/content',
  admins: `${LAYOUT_PATH}users/admins`,
  customers: `${LAYOUT_PATH}users/customers`,
  addressList: `${LAYOUT_PATH}address/list`,
  userProfile: `${LAYOUT_PATH}users/profile`,
  userProfileUpdate: `${LAYOUT_PATH}users/profile-update`,
  userSecurity: `${LAYOUT_PATH}users/security`,
  category: `${LAYOUT_PATH}category`,
  categoryList: `${LAYOUT_PATH}category/list`,
  brandList: `${LAYOUT_PATH}brand/list`,
  productsList: `${LAYOUT_PATH}products/list`,
  defaultDashboard: `${LAYOUT_PATH}dashboard/default`,
  ordersList: `${LAYOUT_PATH}orders/list`,
};
