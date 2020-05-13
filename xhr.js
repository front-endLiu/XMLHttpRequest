/**
 * 封装xmlHttpRequest请求
 * @param { 
 * withCredentials: cookie凭证， 默认false, 
 * type: 响应体类型 默认json,
 * timeout： 超时时间 默认20000ms 
 * success: 成功方法, 
 * error: 失败方法, 
 * ontimeout： 超时方法
 * url:  地址, 
 * method: 方法,GET或者POST
 * async: 同步异步 true表示异步 默认是异步
 * headerType：post请求设置请求主体的类型 from||json 不设置值||application/json;charset=utf-8
 * } options 
 */
export function xhr (options) {
  if (Object.prototype.toString.call(options) !== '[object Object]') return undefined;
  // 实例化XMLHttpRequest对象
  const xhr = new XMLHttpRequest();
  xhr.responseType = options.type || 'json'; // 定义响应类型的枚举值
  xhr.withCredentials = options.withCredentials || false; // 定义跨域时是否支持cookie凭证
  xhr.timeout = options.timeout || 20000; //  超时时间
  xhr.onreadystatechange = function () { // 处理返回值回调
    if (xhr.readyState === 4) { // readyState==4数据已经下载完成
      if (xhr.status === 200) { // http状态码
        if (options.success && typeof options.success === 'function') {
          options.success(xhr.response)
        }
      } else {
        if (options.error && typeof options.error === 'function') {
          options.error(new Error(xhr.statusText))
        }
      }
    }
  }
  xhr.ontimeout = function (e) {
    // XMLHttpRequest 超时
    if (options.ontimeout && typeof options.ontimeout === 'function') {
      options.ontimeout(e)
    }
  };
  options.method = options.method || 'POST';
  options.method = options.method.toUpperCase();
  options.data = options.data || {};
  options.headerType = options.headerType || 'from';
  let data = null;
  if (Object.keys(options.data).length > 0) {
    if (options.method === 'POST') {   // post请求设置请求主体的类型
      if (options.headerType === 'json') {
        xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        data = JSON.stringify(options.data);
      } else {
        data = new FormData();
        if (options.headerType === 'from') {
          for (let key in options.data) {  // Object.keys.forEach
            data.append(key, options.data[key])
          }
        }
      }
    } else {
      let params = [];
      for (let key in options.data) {
        params.push(''.concat(key, '=', options.data[key]))
      }
      options.url += ''.concat(options.url.indexOf('?') === -1 ? '?' : '&', params.join('&'));
    }
  }
  xhr.open(options.method, options.url, options.async === undefined ? true : options.async);
  xhr.send(data);
} 