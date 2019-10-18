layui.define(function (exports) {

    var gateway = 'http://127.0.0.1:8084';
    // var gateway = 'http://z2732870m7.wicp.vip:25569';

    var config = {
        // base_server: 'json/', // 接口地址，实际项目请换成http形式的地址
        // base_server: 'http://localhost:8083', // 接口地址
        base_server: gateway, // 网关地址
        three_user_server: gateway + '/three-user-server', // 用户服务
        three_log_server: gateway + '/three-log-server', // 日志服务
        three_develop_server: gateway + '/three-develop-server', // 定时任务服务
        three_auth_server: gateway + '/three-auth-server', // 认证-授权服务
        default_script_server: 'three-develop-server', // 默认加载脚本的服务
        tableName: 'cswWeb',  // 存储表名
        autoRender: false,  // 窗口大小改变后是否自动重新渲染表格，解决layui数据表格非响应式的问题，目前实现的还不是很好，暂时关闭该功能
        pageTabs: true,   // 是否开启多标签
        client_id: 'system',
        client_secret: 'system',
        scope: 'system',
        grant_type: 'password',
        // 获取缓存的token
        getToken: function () {
            var t = layui.data(config.tableName).token;
            if (t) {
                return JSON.parse(t);
            }
        },
        // 清除user
        removeToken: function () {
            layui.data(config.tableName, {
                key: 'token',
                remove: true
            });
        },
        // 缓存token
        putToken: function (token) {
            layui.data(config.tableName, {
                key: 'token',
                value: JSON.stringify(token)
            });
        },
        // 当前登录的用户
        getUser: function () {
            var u = layui.data(config.tableName).login_user;
            if (u) {
                return JSON.parse(u);
            }
        },
        // 缓存user
        putUser: function (user) {
            layui.data(config.tableName, {
                key: 'login_user',
                value: JSON.stringify(user)
            });
        }
    };
    exports('config', config);
});
