class ImUtil {
    constructor(config = {}) {

    }

    /**
     * 获取登录token
     * @returns {string}
     */
    getToken() {
        return 'ABCDEFG0';
    }

    /**
     * 获取url参数
     * @param url
     * @param name
     * @returns {string}
     */
    queryString(url, name) {
        let result = url.match(new RegExp('[\?\&]' + name + '=([^\&]+)', 'i'));
        if (!result) {
            return '';
        }
        return decodeURIComponent(result[1]);
    }

    /**
     * 获取Cookies
     * @param sName
     * @returns {*}
     */
    getCookie(sName) {
        let aCookie = document.cookie.split('; ');
        for (let i = 0; i < aCookie.length; i += 1) {
            let aCrumb = aCookie[i].split('=');
            if (sName === aCrumb[0]) {
                if (!aCrumb[1]) {
                    return this.queryString('token');
                }
                return unescape(aCrumb[1]);
            }
        }
        return null;
    }

    /**
     * 转换时间
     * @param text
     * @param displaySecond
     * @param format
     * @returns {string}
     */
    parseTime(text, displaySecond, format) {
        let d = new Date(text);
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let hour = d.getHours();
        let minute = d.getMinutes();
        let second = d.getSeconds();
        let result = '';
        month = month > 9 ? month : '0' + month;
        day = day > 9 ? day : '0' + day;
        hour = hour > 9 ? hour : '0' + hour;
        minute = minute > 9 ? minute : '0' + minute;
        second = second > 9 ? second : '0' + second;

        if (format) {
            result = format.replace(/yy/g, year);
            result = result.replace(/mm/g, month);
            result = result.replace(/dd/g, day);
            result = result.replace(/hh/g, hour);
            result = result.replace(/MM/g, minute);
            result = result.replace(/ss/g, second);
            return result;
        }

        return `${[year, month, day].join('-')} ${displaySecond ? [hour, minute, second].join(':') : [hour, minute].join(':')}`;
    }

    /**
     * 请求参数 params 转
     * @param obj
     * @param arr
     * @param idx
     * @returns {string}
     */
    obj2String(obj, arr = [], idx = 0) {
        for (let item in obj) {
            arr[idx++] = [item, obj[item]];
        }
        return new URLSearchParams(arr).toString();
    }

    /**
     * 请求fetch的封装
     * @param url
     * @param method
     * @param params
     * @param extra
     * @returns {Promise<Response>}
     */
    request({url, method = 'GET', params = {}, extra = {}}) {
        let options = {};
        if (params) {
            url += '?' + ImUtil.obj2String(params);
        }
        if (extra.data) {
            options.body = JSON.stringify(options.data);
        }
        return fetch(url, options).then(rs => {
            return rs.json();
        }).then(data => {
            return new Promise((resolve, reject) => {
                if (0 === data.code) {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
        });
    }
}

export default ImUtil;