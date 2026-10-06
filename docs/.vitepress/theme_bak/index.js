export default {
  enhanceApp() {
    // 延时执行，保证DOM加载完成
    setTimeout(()=>{
      if(localStorage.getItem('blogAuth') === 'ok'){
        return
      }
      const pwd = prompt("请输入博客访问密码：")
      if(pwd === "123456"){
        localStorage.setItem("blogAuth","ok")
        location.reload()
      }else{
        document.body.innerHTML = `<h1 style="text-align:center;margin-top:100px">密码错误，拒绝访问</h1>`
      }
    }, 100)
  }
}