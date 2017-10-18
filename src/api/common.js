import store from '../store';
import {fetch} from 'utils/fetch';

export function login(userName, password) {
  const data = {
      userName: userName,
      password: password
  };
  return fetch('/yxkj-shelf/common/login.jhtml', data)

}

export function logout(userName) {
  const data = {
      userName: userName
  };
  return fetch('/yxkj-shelf/common/logout.jhtml', data)
}

// 获取当前用户
export function getCurrentUser() {
  return store.getters.user
}

export function getAreaList() {
      const data = {
          userName: store.getters.user.userName
      };
      console.info("need get areas");
      return fetch('/yxkj-shelf/admin/company/getAreaList.jhtml', data)
}
export function getHomeData() {
      const data = {
          userName: store.getters.user.userName
      };
      return fetch('/yxkj-shelf/common//hp/statistics.jhtml', data)
}
