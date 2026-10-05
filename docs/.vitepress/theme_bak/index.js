export default {
  enhanceApp({ app }) {
    if(localStorage.getItem('blogAuth') !== 'ok'){
      const pwd = prompt("请输入博客访问密码：")
      if(pwd === "123456"){
        localStorage.setItem("blogAuth","ok")
      }else{
        document.body.innerHTML = `<h1 style="text-align:center;margin-top:100px">密码错误，拒绝访问</h1>`
      }
    }
  }
}