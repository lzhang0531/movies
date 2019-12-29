import axios from '@/libs/api.request'
import axiosOrigin from 'axios'

export const getCategoryPage = (access) => {
  return axios.request({
    url: '/manage/category/page',
    method: 'get',
    params: access,
  })
}

export const addCategory = (access) => {
/*  return axios.request({
    url: '/manage/category/add',
    method: 'POST',
    params: access,
    headers: { 'Content-Type': 'application/json' }
  })*/
  return axiosOrigin.post('/manage/category/add',access)
}

export const updateCategory = (access) => {
  /*return axios.request({
    url: '/manage/category/update',
    method: 'PUT',
    params: access,
  })*/
  return axiosOrigin.put('/manage/category/update',access)

}

export const deleteCategory = (id) => {
  return axios.request({
    url: '/manage/category/'+id,
    method: 'DELETE',
  })
}

export const getDragList = () => {
  return axios.request({
    url: '/mock/get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: '/mock/error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: '/mock/save_error_logger',
    data: info,
    method: 'post'
  })
}

export const uploadImg = formData => {
  return axios.request({
    url: 'image/upload',
    data: formData
  })
}

export const getOrgData = () => {
  return axios.request({
    url: '/mock/get_org_data',
    method: 'get'
  })
}

export const getTreeSelectData = () => {
  return axios.request({
    url: '/mock/get_tree_select_data',
    method: 'get'
  })
}
