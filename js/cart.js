// import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';


//vee 區域註冊元件的使用範例
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule("required", required);
defineRule("email", email);
defineRule("min", min);
defineRule("max", max);

loadLocaleFromURL(
  "https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json"
);

configure({
  // 用來做一些設定
  generateMessage: localize("zh_TW"), //啟用 locale
});


const site = 'https://vue3-course-api.hexschool.io/v2';
const api_path = 'wlc';

const app = Vue.createApp({
    data(){
        return{
            cartData:{
                carts:[], //購物車內資料要預設為空值，表單驗證才不會出現錯誤。
            },
            products:[],
            product: {},
            productId:'',
            isLoadingItem:'',
            form: {
                user: {
                  name: "",
                  email: "",
                  tel: "",
                  address: "",
                },
                message: "",
              },
              isLoading:false,
            };
          },
          components: {
            VForm: Form,
            VField: Field,
            ErrorMessage: ErrorMessage,
          },       
          methods:{
            getProducts(){
                axios.get(`${site}/api/${api_path}/products/all`)
                    .then((res)=>{
                        // console.log(res);                    
                        this.products = res.data.products;
                });
            },
            openProductModal(id){
                this.productId = id;
                this.$refs.productModal.openModal();
            },
            getCart(){
                axios.get(`${site}/api/${api_path}/cart`)
                    .then((res)=>{
                        console.log(res);                    
                         this.cartData = res.data.data;
                    });
            },
            addToCart(id,qty = 1){   //參數預設1
                const data = {
                    product_id:id,
                    qty,
                };
                this.isLoadingItem = id;
                axios.post(`${site}/api/${api_path}/cart`,{data}).then((res)=>{
                    console.log(res);
                    this.getCart();
                    this.$refs.productModal.closeModal();
                    this.isLoadingItem = '';
                });           
            },
            removeCartItem(id){
                this.isLoadingItem = id;
                axios.delete(`${site}/api/${api_path}/cart/${id}`).then((res)=>{
                    console.log(res);
                    this.getCart();
                    this.isLoadingItem = '';
                });
            },
            updateCartItem(item){   
                const data = {
                    product_id:item.id,
                    qty:item.qty,
                };
                this.isLoadingItem = item.id;
                axios.put(`${site}/api/${api_path}/cart/${item.id}`,{data}).then((res)=>{
                    console.log(res);
                    this.getCart();
                    this.isLoadingItem = '';
                });           
            },
            deleteAllCarts() {
                axios
                  .delete(`${site}/api/${api_path}/carts`)
                  .then((res) => {
                    console.log(res);
                    this.getCart();
                  })
                  .catch((error) => {
                    alert(error.data.message);
                  });
            },
            createOrder() {
                const order = this.form;
                axios
                  .post(`${apiUrl}/api/${apiPath}/order`, { data: order })
                  .then((res) => {
                    alert(res.data.message);
                    this.$refs.form.resetForm();
                    this.getCart();
                  });
              },
              addLoading() {
                this.isLoading = true;
                setTimeout(() => {
                  this.isLoading = false;
                }, 1000);
              }, 
          },
          mounted(){
            this.getProducts();
            this.getCart();
        }
});

//refs
app.component('product-modal',{
    props:['id'],
    template:'#userProductModal',
    data(){
        return{
            modal:{},
            product:{},
            qty:1,
        };
    },
    watch:{
        id(){            
            this.getProduct();
        }
    },
    methods:{
        openModal(){
            this.modal.show();
        },
        closeModal(){
            this.modal.hide();
        },
        getProduct(){
            axios.get(`${site}/api/${api_path}/product/${this.id}`)
                .then((res)=>{
                    console.log(res);                    
                    this.product = res.data.product;
                });
        },
        addToCart(){
            this.$emit('add-cart',this.product.id,this.qty)
        },
    },
    mounted(){        
        this.modal = new bootstrap.Modal(this.$refs.modal);
        
    },
})

app.component("Loading", VueLoading.Component);

app.mount('#app');