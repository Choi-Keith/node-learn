 // 引入公共方法
const Common = require ('./common');
// 引入company表的model
const CompanyModel = require ('../models/company');
// 引入常量
const Constant = require ('../constant/constant');
// 引入dateformat包
const dateFormat = require ('dateformat');
// 配置对象
let exportObj = {
  info,
  update,
};
// 导出对象，供其它模块调用
module.exports = exportObj;


// 获取企业信息方法
function info (req, res) {
  // 定义一个返回对象
  const resObj = Common.clone (Constant.DEFAULT_SUCCESS);
  // 定义一个async任务
  let tasks = {
    // 查询方法，依赖校验参数方法
    query: cb => {
      // 使用company的model中的方法查询
      CompanyModel
        // 查询指定id为1的数据
        .findByPk (1)
        .then (function (result) {
          // 查询结果处理
          // 如果查询到结果
          if(result){
            // 将查询到的结果给返回对象赋值
            resObj.data = {
              id: result.id,
              name: result.name,
              address: result.address,
              tel: result.tel,
              intro: result.intro,
              longitude: result.longitude,
              latitude: result.latitude,
              createdAt: dateFormat (result.createdAt, 'yyyy-mm-dd HH:MM:ss')
            };
            // 继续后续操作
            cb(null);
          }else{
            // 查询失败，传递错误信息到async最终方法
            cb (Constant.COMPANY_INFO_NOT_EXSIT);
          }
        })
        .catch (function (err) {
          // 错误处理
          // 打印错误日志
          console.log (err);
          // 传递错误信息到async最终方法
          cb (Constant.DEFAULT_ERROR);
        });

    }
  };
  // 执行公共方法中的autoFn方法，返回数据
  Common.autoFn (tasks, res, resObj)
}

// 修改企业信息方法
function update (req, res) {
  // 定义一个返回对象
  const resObj = Common.clone (Constant.DEFAULT_SUCCESS);
  // 定义一个async任务
  let tasks = {
    // 校验参数方法
    checkParams: (cb) => {
      // 调用公共方法中的校验参数方法，成功继续后面操作，失败则传递错误信息到async最终方法
      Common.checkParams (req.body, ['name','address','tel','intro','longitude','latitude'], cb);
    },
    // 更新方法，依赖校验参数方法
    update: ['checkParams', (results, cb) => {
      // 使用company的model中的方法更新
      CompanyModel
        .update ({
          name: req.body.name,
          address: req.body.address,
          tel: req.body.tel,
          intro: req.body.intro,
          longitude: req.body.longitude,
          latitude: req.body.latitude,
        }, {
          // 查询id为1的数据进行更新
          where: {
            id: 1
          }
        })
        .then (function (result) {
          // 更新结果处理
          if(result[0]){
            // 如果更新成功
            // 继续后续操作
            cb (null);
          }else{
            // 更新失败，传递错误信息到async最终方法
            cb (Constant.COMPANY_INFO_NOT_EXSIT);
          }
        })
        .catch (function (err) {
          // 错误处理
          // 打印错误日志
          console.log (err);
          // 传递错误信息到async最终方法
          cb (Constant.DEFAULT_ERROR);
        });
    }]
  };
  // 执行公共方法中的autoFn方法，返回数据
  Common.autoFn (tasks, res, resObj)
}
