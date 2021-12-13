import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

let productModal;

createApp({
  data() {
    return {
      apiHex: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'travel590',
      products: [],
      tempProduct: {},
      isNew: false,
      isDelete: false,
    }
  },
  methods: {
    // 驗證 token
    checkToken(){
        const url = `${this.apiHex}/api/user/check`;
        axios.post(url).then((res) => {
            if(res.data.success){
                this.getData();
            } else {
                window.location = 'index.html';
            }
        }).catch((error) => {
            alert(error.data.message);
            window.location = 'index.html';
        })
    },
    // 開啟產品 modal
    checkModal(item, data){
        if(item === '新增資料'){
          this.tempProduct = {}
          this.isDelete = false;
          this.isNew = true
          productModal.show();
        } else if (item === '編輯資料'){
          this.tempProduct = { ...data };
          this.isNew = false;
          productModal.show();
        } else if (item === '刪除資料'){
          this.tempProduct = { ...data };
          this.isNew = false
          this.isDelete = true;
          productModal.show();
        }
    },
    // 取得資料
    getData(){
      const url = `${this.apiHex}/api/${this.apiPath}/admin/products`;
      axios.get(url).then((res) => {
        this.products = res.data.products;
      }).catch(() => {
        console.log('錯誤')
      })
    },
    // 產品細節
    openDetail(res){
      this.tempProduct = res;
    },
    // 更改狀態
    changeEnabled(res){
      res.is_enabled = !res.is_enabled;
      this.tempProduct = res;
      let id = this.tempProduct.id
      const url = `${this.apiHex}/api/${this.apiPath}/admin/product/${id}`;
      axios.put(url, { data: this.tempProduct }).then((res) => {
        console.log(res)
      })
    },
    // 新增產品
    addProduct(){
      const url = `${this.apiHex}/api/${this.apiPath}/admin/product`;
      // 轉換原價、售價型別
      this.tempProduct.origin_price = Number(this.tempProduct.origin_price);
      this.tempProduct.price = Number(this.tempProduct.price);
      console.log(this.tempProduct)

      axios.post(url, { data: this.tempProduct }).then((res) => {
        if (res.data.success) {
          productModal.hide();
          this.getData();
        } else {
          alert(res.data.message);
        }
      }).catch((error) => {
        alert(error.data.message);
      })
    },
    // 刪除產品
    deleteProduct(){
      let id = this.tempProduct.id;
      console.log(id)
      const url = `${this.apiHex}/api/${this.apiPath}/admin/product/${id}`;
      axios.delete(url).then(() => {
        this.getData()
      }).catch(() => {
        console.log('錯誤')
      })
    },
    // 編輯產品
    editProduct(){
      let id = this.tempProduct.id
      this.tempProduct.origin_price = Number(this.tempProduct.origin_price);
      this.tempProduct.price = Number(this.tempProduct.price);

      const url = `${this.apiHex}/api/${this.apiPath}/admin/product/${id}`;
      axios.put(url, { data: this.tempProduct }).then(() => {
        console.log('成功')
        productModal.hide();
        this.getData();
      }).catch(() => {
        console.log('錯誤')
      })
    },
    // 圖片上傳
    uploadImg(e){
      const file = e.target.files[0];

      const formData = new FormData();
      formData.append('file-to-upload', file);
      
      const url = `${this.apiHex}/api/${this.apiPath}/admin/upload`;
      axios.post(url, formData).then((res) => {
       this.tempProduct.imageUrl = res.data.imageUrl;
      })
    }
  },
  mounted(){
    // 選取產品 modal  
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {});
  },
  created(){
      // 取出 token
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

      // 在 axios 的抬頭加上 token
      axios.defaults.headers.common.Authorization = token;
      this.checkToken()
  }
}).mount('#app');