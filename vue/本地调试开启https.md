### vue2+webpack3
server: {
    https: true
}

### vue3+vite
参考文档：server.https配置 https://cn.vitejs.dev/config/server-options.html

npm i @vitejs/plugin-basic-ssl
// vite.config.js
import basicSsl from '@vitejs/plugin-basic-ssl'
export default {
  plugins: [
    basicSsl()
  ],
  server: {
    https: true
  }
}