import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

createApp({
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    login() {
      const api = 'https://vue3-course-api.hexschool.io/v2/admin/signin';
      axios.post(api, this.user).then((res) => {
        if (res.data.success) {

          // 取得 token + 有效時間
          const token = res.data.token
          const expired = res.data.expired

          // 儲存 token + 設置有效時間 + 切換到 admin.html
          document.cookie = `token=${token}; expires=${new Date(expired)}; path=/`;
          window.location = 'admin.html';
        } else {
          alert(res.data.message)
        }
      }).catch((error) => {
        alert(error.data.message)
      })
    },
  },
}).mount('#app');
