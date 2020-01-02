import axios from '@/libs/api.request'
import axiosOrigin from 'axios'

export const getCategoryPage = (access) => {
  return axios.request({
    url: '/manage/category/page',
    method: 'get',
    params: access,
  })
}
export const getCategoryList = () => {
  return axios.request({
    url: '/manage/category/list',
    method: 'get'
  })
}

export const addCategory = (access) => {
  return axiosOrigin.post('/manage/category/add',access)
}

export const updateCategory = (access) => {
  return axiosOrigin.put('/manage/category/update',access)
}

export const deleteCategory = (id) => {
  return axios.request({
    url: '/manage/category/'+id,
    method: 'DELETE',
  })
}

export const getVideoPage = (access) => {
  return axios.request({
    url: '/manage/video/page',
    method: 'get',
    params: access,
  })
}

export const addVideo = (access) => {
  return axiosOrigin.post('/manage/video/save',access)
}

export const updateVideo = (access) => {
  return axiosOrigin.put('/manage/video/update',access)
}

export const stickyVideo = (access) => {
  return axiosOrigin.put('/manage/video/sticky',access)
}
export const cancelStickyVideo = (access) => {
  return axiosOrigin.put('/manage/video/cancel-sticky',access)
}

export const deleteVideo = (id) => {
  return axios.request({
    url: '/manage/video/'+id,
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

export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}
