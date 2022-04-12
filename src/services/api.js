import axios from 'axios';
import authHeader from './authHeader';
const API_URL = process.env.REACT_APP_API_URL;
class AdminService {
  //LoginAs
  loginAs(data) {
    return axios.post(API_URL + 'auth/login_as', data, { headers: authHeader() });
  }
  //Login
  login(data) {
    return axios.post(API_URL + 'auth/login', data, {});
  }
  //firstLogin
  firstLogin(data) {
    return axios.post(API_URL + 'auth/firstLogin', data, {});
  }
  //verifySMS
  verifySMS(data) {
    return axios.post(API_URL + 'auth/verifySMS', data, {});
  }
  //forgotPassword
  forgotPassword(data) {
    return axios.post(API_URL + 'auth/forgotPassword', data, {});
  }
  //resetPassword
  resetPassword(data) {
    return axios.post(API_URL + 'auth/resetPassword', data, {});
  }
  //verifyToken
  verifyToken(data) {
    return axios.post(API_URL + 'auth/verifyToken', data, {});
  }
  //My Account
  updateProfile(data) {
    return axios.post(API_URL + 'web/admin/profile', data, { headers: authHeader() });
  }
  getProfile() {
    return axios.get(API_URL + 'web/admin/profile', { headers: authHeader() });
  }

  //User
  getUserList(data) {
    return axios.post(API_URL + 'web/admin/userList', data, { headers: authHeader() });
  }
  getUser(id) {
    return axios.get(API_URL + 'web/admin/user/' + id, { headers: authHeader() });
  }
  createUser(data) {
    return axios.post(API_URL + 'web/admin/user', data, { headers: authHeader() });
  }
  updateUser(id, data) {
    return axios.put(API_URL + 'web/admin/user/' + id, data, { headers: authHeader() });
  }
  deleteUser(id, status) {
    return axios.post(API_URL + 'web/admin/user/' + id + '/delete', status, { headers: authHeader() });
  }
  emptyTrashUser(status) {
    return axios.post(API_URL + 'web/admin/trash/user/deleteAll', status, { headers: authHeader() });
  }
  //Company Part
  getCompanyList(data) {
    return axios.post(API_URL + 'web/admin/companyList', data, { headers: authHeader() });
  }
  addCompany(data) {
    return axios.post(API_URL + 'web/admin/company', data, { headers: authHeader() });
  }
  updateCompany(id, data) {
    return axios.put(API_URL + 'web/admin/company/' + id, data, { headers: authHeader() });
  }
  getCompany(id) {
    return axios.get(API_URL + 'web/admin/company/' + id, { headers: authHeader() });
  }
  deleteCompany(id, status) {
    return axios.post(API_URL + 'web/admin/company/' + id + '/delete', status, { headers: authHeader() });
  }
  emptyTrashCompany(status) {
    return axios.post(API_URL + 'web/admin/trash/company/deleteAll', status, { headers: authHeader() });
  }
  updateBankInfo(id, data) {
    return axios.put(API_URL + 'web/admin/company/' + id + '/bank', data, { headers: authHeader() });
  }
  updateBuildingBankInfo(id, data) {
    return axios.put(API_URL + 'web/admin/building/' + id + '/bank', data, { headers: authHeader() });
  }
  //Card Part
  getCardList(data) {
    return axios.post(API_URL + 'web/admin/cardList', data, { headers: authHeader() });
  }
  createCard(data) {
    return axios.post(API_URL + 'web/admin/card', data, { headers: authHeader() });
  }
  updateCard(id, data) {
    return axios.put(API_URL + 'web/admin/card/' + id, data, { headers: authHeader() });
  }
  getCard(id) {
    return axios.get(API_URL + 'web/admin/card/' + id, { headers: authHeader() });
  }
  deleteCard(id) {
    return axios.delete(API_URL + 'web/admin/card/' + id, { headers: authHeader() });
  }
  //Building Part
  getBuildingList(data) {
    return axios.post(API_URL + 'web/admin/buildingList', data, { headers: authHeader() });
  }
  createBuilding(data) {
    return axios.post(API_URL + 'web/admin/building', data, { headers: authHeader() });
  }
  updateBuilding(id, data) {
    return axios.put(API_URL + 'web/admin/building/' + id, data, { headers: authHeader() });
  }
  getBuilding(id) {
    return axios.get(API_URL + 'web/admin/building/' + id, { headers: authHeader() });
  }
  deleteBuilding(id, status) {
    return axios.post(API_URL + 'web/admin/building/' + id + '/delete', status, { headers: authHeader() });
  }
  emptyTrashBuilding(status) {
    return axios.post(API_URL + 'web/admin/trash/building/deleteAll', status, { headers: authHeader() });
  }
  importBuilding(data) {
    return axios.post(API_URL + 'web/admin/building/import_csv', data, { headers: authHeader() });
  }
  exportBuilding(data) {
    return axios.post(API_URL + 'web/admin/building/export_csv', data, { headers: authHeader() ,responseType: 'blob'});
  }
  //Owner Part
  getOwnerList(data) {
    return axios.post(API_URL + 'web/admin/ownerList', data, { headers: authHeader() });
  }
  createOwner(data) {
    return axios.post(API_URL + 'web/admin/owner', data, { headers: authHeader() });
  }
  setSuspendOwner(id, data) {
    return axios.put(API_URL + 'web/admin/owner/' + id + '/status', data, { headers: authHeader() });
  }
  updateOwner(id, data) {
    return axios.put(API_URL + 'web/admin/owner/' + id, data, { headers: authHeader() });
  }
  getOwner(id, data) {
    return axios.post(API_URL + 'web/admin/owner/' + id, data, { headers: authHeader() });
  }
  deleteOwner(id, status) {
    return axios.post(API_URL + 'web/admin/owner/' + id + '/delete', status, { headers: authHeader() });
  }
  emptyTrashOwner(status) {
    return axios.post(API_URL + 'web/admin/trash/owner/deleteAll', status, { headers: authHeader() });
  }
  importOwner(data) {
    return axios.post(API_URL + 'web/admin/owner_import_csv', data, { headers: authHeader() });
  }
  exportOwner(data) {
    return axios.post(API_URL + 'web/admin/owner_export_csv', data, { headers: authHeader() ,responseType: 'blob'});
  }
  //Manager Part
  getManagerList(data) {
    return axios.post(API_URL + 'web/admin/managerList', data, { headers: authHeader() });
  }
  createManager(data) {
    return axios.post(API_URL + 'web/admin/manager', data, { headers: authHeader() });
  }
  updateManager(id, data) {
    return axios.put(API_URL + 'web/admin/manager/' + id, data, { headers: authHeader() });
  }
  getManager(id) {
    return axios.get(API_URL + 'web/admin/manager/' + id, { headers: authHeader() });
  }
  setSuspendManager(id, data) {
    return axios.put(API_URL + 'web/admin/manager/' + id + '/status', data, { headers: authHeader() });
  }
  deleteManager(id, status) {
    return axios.post(API_URL + 'web/admin/manager/' + id + '/delete', status, { headers: authHeader() });
  }
  emptyTrashManager(status) {
    return axios.post(API_URL + 'web/admin/trash/manager/deleteAll', status, { headers: authHeader() });
  }
  //DiscountCode Part
  getDiscountCodesList(data) {
    return axios.post(API_URL + 'web/admin/discountCodeList', data, { headers: authHeader() });
  }
  createDiscountCode(data) {
    return axios.post(API_URL + 'web/admin/discountCode', data, { headers: authHeader() });
  }
  updateDiscountCode(id, data) {
    return axios.put(API_URL + 'web/admin/discountCode/' + id, data, { headers: authHeader() });
  }
  getDiscountCode(id) {
    return axios.get(API_URL + 'web/admin/discountCode/' + id, { headers: authHeader() });
  }
  deleteDiscountCode(id, status) {
    return axios.post(API_URL + 'web/admin/discountCode/' + id + '/delete', status, { headers: authHeader() });
  }
  emptyTrashCode(status) {
    return axios.post(API_URL + 'web/admin/trash/discountCode/deleteAll', status, { headers: authHeader() });
  }
  //Product Part
  getProductList(data) {
    return axios.post(API_URL + 'web/admin/productList', data, { headers: authHeader() });
  }
  createProduct(data) {
    return axios.post(API_URL + 'web/admin/product', data, { headers: authHeader() });
  }
  updateProduct(id, data) {
    return axios.put(API_URL + 'web/admin/product/' + id, data, { headers: authHeader() });
  }
  getProduct(id) {
    return axios.get(API_URL + 'web/admin/product/' + id, { headers: authHeader() });
  }
  deleteProduct(id, status) {
    return axios.post(API_URL + 'web/admin/product/' + id + '/delete', status, { headers: authHeader() });
  }
  emptyTrashProduct(status) {
    return axios.post(API_URL + 'web/admin/trash/product/deleteAll', status, { headers: authHeader() });
  }
  //Order Part
  getOrderList(data) {
    return axios.post(API_URL + 'web/admin/orderList', data, { headers: authHeader() });
  }
  createOrder(data) {
    return axios.post(API_URL + 'web/admin/order', data, { headers: authHeader() });
  }
  updateOrder(id, data) {
    return axios.put(API_URL + 'web/admin/order/' + id, data, { headers: authHeader() });
  }
  getOrder(id) {
    return axios.get(API_URL + 'web/admin/order/' + id, { headers: authHeader() });
  }
  deleteOrder(id, status) {
    return axios.post(API_URL + 'web/admin/order/' + id + '/delete', status, { headers: authHeader() });
  }
  emptyTrashOrder(status) {
    return axios.post(API_URL + 'web/admin/trash/order/deleteAll', status, { headers: authHeader() });
  }
  downloadInvoiceCompany(data) {
    return axios.post(API_URL + 'web/admin/downloadInvoiceCompany', data, { headers: authHeader() ,responseType: 'blob'});
  }
  downloadInvoiceBuilding(data) {
    return axios.post(API_URL + 'web/admin/downloadInvoiceBuilding', data, { headers: authHeader() ,responseType: 'blob'});
  }
  downloadInvoiceOwner(data) {
    return axios.post(API_URL + 'web/admin/downloadInvoiceOwner', data, { headers: authHeader() ,responseType: 'blob'});
  }
  downloadZipCompany(data) {
    return axios.post(API_URL + 'web/admin/downloadZipCompany', data, { headers: authHeader() ,responseType: 'blob'});
  }
  downloadZipBuilding(data) {
    return axios.post(API_URL + 'web/admin/downloadZipBuilding', data, { headers: authHeader() ,responseType: 'blob'});
  }
  downloadZipOwner(data) {
    return axios.post(API_URL + 'web/admin/downloadZipOwner', data, { headers: authHeader() ,responseType: 'blob'});
  }
  getBuyerList(data) {
    return axios.post(API_URL + 'web/admin/buyerList',data, { headers: authHeader() });
  }
  getBuyerList(data) {
    return axios.post(API_URL + 'web/admin/buyerList',data, { headers: authHeader() });
  }
  getCodeList(data) {
    return axios.post(API_URL + 'web/admin/discountCodeListByType',data, { headers: authHeader() });
  }
  //Common
  getBuildingListByCompany(data) {
    return axios.post(API_URL + 'web/admin/buildingListByCompany', data, { headers: authHeader() });
  }
  getCompanyListByUser() {
    return axios.get(API_URL + 'web/admin/companyListByUser', { headers: authHeader() });
  }
}

export default new AdminService();