import { getAction, deleteAction, putAction, postAction } from './../utils/http'

// 基本配置
export const addConfig = (params) => postAction('/baseConfig/add', params)
export const getEffectedConfig = (params) => getAction('/baseConfig/getEffectedConfig', params)
export const updateConfig = (params) => postAction('/baseConfig/update', params)
export const getListPage = (params) => getAction('/baseConfig/getListPage', params)
export const onDelete = (params) => deleteAction('/baseConfig/delete', params)
export const getBaseConfigById = (params) => getAction('/baseConfig/getById', params)
export const setStatus = (params) => putAction('/baseConfig/setStatus', params)
export const backUp = (params) => getAction('/baseConfig/backUp', params)

// 设备组
export const deviceGroupGetListPage = (params) => getAction('/deviceGroup/getListPage', params)
export const updateGroup = (params) => postAction('/deviceGroup/update', params)
export const addGroup = (params) => postAction('/deviceGroup/add', params)
export const getGroup = (params) => getAction('/deviceGroup/getById', params)
export const deleteGroup = (params) => deleteAction('/deviceGroup/delete', params)
