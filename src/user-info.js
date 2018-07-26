module.service('userInfo', ['$http', '$q', function ($http, $q) {
  /**
   * 用户访问kuxiao.cn时自动使用基于url/cookies的token获取用户信息
   */
  var userInfo = {valid: false};

  this.enrolled=function(){
    return userInfo;
  }

  /**
   * get user information from
   *   1. instance variable userInfo
   *   2. cookie 'userInfo'
   *   3. url?token=
   *   4. else login as anonymous
   */
  this.get = function () {
    // token of anonymous or registered user.
    var token = window.location.search.match(new RegExp('[\?\&]token=([^\&]+)', 'i'));
    //var token = rcpAid.getToken();
    if(token && token.length && token.length == 2){
      token=token[1];
    }else{
      token=null;
    }

    var defer = $q.defer();

    // get it from settled, if no token or token is
    //   valid by equal to stored, the token from url always valid and
    //   priority to instance/cookie
    if (userInfo.valid && (!token || token == userInfo.token)) {
      defer.resolve(userInfo);
      return defer.promise;
    }

    // get it from cookie

    var u = Cookies.getJSON('userInfo');
    if (u && (!token || token == u.token)) {
      userInfo = u;
      defer.resolve(userInfo);
      return defer.promise;
    }

    // get token from url query string then get userInfo from server by token
    if (token && token.length > 0) {
      console.log("-----------------------------------");
      var url = g_conf.sso.srv + 'sso/api/uinfo?selector=default,role&token=' + token;
      console.log("--------------------------------------");
      $http.get(url).then(function (respData) {
        if (respData.data.code != 0) {
          defer.reject(respData.data);
          return;
        }

        var usr = respData.data.data.usr;

        // 令牌
        userInfo.token = respData.data.data.token;

        // 用户唯一标识,不能用于登录,只用于查询数据等
        userInfo.uid = usr.id;

        // 用户长帐号,一般是电话号码,匿名用户是随机串,可用于登录
        userInfo.account = usr.usr[0];

        // 用户短帐号,可用于登录
        userInfo.shortAccount = usr.usr[1];

        // 呢称,用于界面显示
        userInfo.nickName = usr.attrs.basic.nickName;

        // 头像
        userInfo.avatar = usr.attrs.basic.avatar;

        // 用户描述
        userInfo.desc = usr.attrs.basic.desc;

        // 用户角色: UCS管理员,课程管理员,首页编辑管理员
        userInfo.role = (usr.attrs.role ? usr.attrs.role : {});

        // 帐号类型, anonymous: 匿名帐号,normal: 注册帐号
        userInfo.type = (userInfo.account.substring(0, 5) == 'anony' ? 'anonymous' : 'normal');

        // 用户信息有效, 防止userInfo被赋值前些被访问
        userInfo.valid = true;

        // 帐号创建时间/用户注册时间
        var d = new Date(usr.time);
        userInfo.createTime= d.getFullYear() + "-" + (d.getMonth() + 1) +"-" + d.getDate() + " " +
          d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

        // 保存用户信息于cookie中,便于用户下次直接使用,而不必登录
        Cookies.set('userInfo', userInfo, {expires: 30});
        defer.resolve(userInfo);
      }, function (err) {
        defer.reject({code: -1, msg: err.message});
      });

      return defer.promise;
    }





    console.log( g_conf.sso.srv + 'sso/api/createAnonymous');

    // it is the user's first time visit, using anonymous login for
    //   user using Messenger contact with our customer service.
    $http({
      method: 'GET',
      url: g_conf.sso.srv + 'sso/api/createAnonymous'
    }).then(function (respData) {
      if (respData.data.code !== 0) {
        defer.reject(respData.data);
        return;
      }
      var usr = respData.data.data.usr;

      // 令牌
      userInfo.token = respData.data.data.token;

      // 用户唯一标识,不能用于登录,只用于查询数据等
      userInfo.uid = usr.id;

      // 用户长帐号,一般是电话号码,匿名用户是随机串,可用于登录
      userInfo.account = usr.usr[0];

      // 用户短帐号,可用于登录
      userInfo.shortAccount = usr.usr[1];

      // 呢称,用于界面显示
      userInfo.nickName = usr.attrs.basic.nickName;

      // 头像
      userInfo.avatar = usr.attrs.basic.avatar;

      // 用户描述
      userInfo.desc = '尊贵的客人';

      // 用户角色: UCS管理员,课程管理员,首页编辑管理员
      userInfo.role = {};

      // 帐号类型, anonymous: 匿名帐号,normal: 注册帐号
      userInfo.type = (userInfo.account.substring(0, 5) == 'anony' ? 'anonymous' : 'normal');

      // 用户信息有效, 防止userInfo被赋值前些被访问
      userInfo.valid = true;

      // 帐号创建时间/用户注册时间
      var d = new Date(usr.time);
      userInfo.createTime= d.getFullYear() + "-" + (d.getMonth() + 1) +"-" + d.getDate() + " " +
        d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

      //// 保存用户信息于cookie中,便于用户下次直接使用,而不必登录,即使匿名用户
      //Cookies.set('userInfo', userInfo, {expires: 30});

      defer.resolve(userInfo);
    }, function (err) {
      defer.reject({code: -1, msg: err.message});
    });

    return defer.promise;
  }

  // 清除用户登录信息,如果用户是使用他人设备,则需要在使用完成之后注销/清除用户登录信息
  this.clean = function () {
    Cookies.remove('userInfo');
    userInfo = {};
  }
}]);