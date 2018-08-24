
let baseUrl = 'http://10.0.15.35:8080/jx';
// let baseUrl = 'http://101.200.192.212:8010/jx';

/**
 * 施工缝位置列表
 * post 
 */
let PostionList = baseUrl + '/manage/verify/api/position/list'

/**
 * 检验数据表及录入状态
 * post
 */

 let dataList = baseUrl + '/manage/verify/api/data/list'

/**
 * 数据录入
 * post
 */
 let  dataCreate = baseUrl +'/manage/verify/api/data/save'

/**
 *  操作
 * post
 *   status=0时，提交，该值仅能为1
 *   status=1时，撤消/审核，-1撤消，0审核不通过；1审核通过，
 *   Status=2时，归档，0驳回，1归档
 */

 let operate = baseUrl +'/manage/verify/api/data/operate'


 /**
  * 质量检查员列表
  * post
  */
let fillers = baseUrl +'/manage/verify/api/data/fillers'


/**
 *   预览
 *   post
 * @param id:数据id（dataId）
 */
let preview = baseUrl +'/manage/verify/api/data/view'


/**
 * 登录 
 * post
 */

// let LoginArl = baseUrl + '/login/'
let LoginArl = baseUrl + '/manage/verify/api/login'

/**
 * 退出
 */

let Logout = baseUrl + '/logout/' 
/**
 * 权限
 */

let perm = baseUrl + '/manage/verify/api/perm'

/**
 *  修改密码
 */
let changePassword  = baseUrl + '/manage/verify/api/changePassword'
// let changePassword  = baseUrl + '/change_password/'

/**
 * 刷新修改密码
 */
let changePasswordTo = baseUrl + '/manage/verify/api/changePasswordTo'

/**
 * 消息webSocketListener
 */

let DoubleUrl = baseUrl+'/portfolio'

export {
    PostionList,
    dataList,
    dataCreate,
    operate,
    fillers,
    preview,
    LoginArl,
    perm,
    Logout,
    changePassword,
    changePasswordTo,
    DoubleUrl
}