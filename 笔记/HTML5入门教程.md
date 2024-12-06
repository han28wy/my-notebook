<!DOCTYPE> 作用是判断文档是哪个标准的

html5新增了一些标签：
<article> <aside> <section> <footer> <nav> <main> <figure> <header>
所以html5这种语义化标签的编码习惯，更加易读，易理解


Web Storage:
localStorage: 永久性储存，关闭浏览器也会保留数据
sessionStorage: 会话存储，关闭浏览器就清除

Web SQL Database:

HTML5 IndexedDB :



安全风险：
1、跨站脚本攻击（XSS）：XSS 攻击是指攻击者通过注入恶意脚本来攻击 Web 应用程序的漏洞。
HTML5 使得开发者可以在 Web 应用程序中使用更多的 JavaScript，但这也增加了 XSS 攻击的风险。
2、跨站请求伪造（CSRF）：CSRF 攻击是指攻击者利用用户已经登录的身份来执行一些恶意操作，如更改用户密码、转移用户资金等。
HTML5 使得 Web 应用程序可以使用更多的 AJAX 和 WebSockets，但这也增加了 CSRF 攻击的风险。
3、不安全的跨域资源共享（CORS）：CORS 是一种机制，允许 Web 应用程序向不同的域名请求资源。但如果不适当地配置 CORS，会导致安全风险，例如允许未经授权的域名访问敏感数据。
4、本地存储风险：HTML5 引入了本地存储机制，如 localStorage 和 sessionStorage，这些机制允许 Web 应用程序在客户端存储数据。但如果存储的数据包含敏感信息，例如用户密码、信用卡号码等，那么就会存在安全风险。
5、文件上传漏洞：HTML5 允许 Web 应用程序在客户端上传文件，但如果不适当地验证上传的文件，会导致安全风险，例如上传恶意文件、包含病毒的文件等。