import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';
import pagination from './pagination.js';
const site = 'https://vue3-course-api.hexschool.io/v2';
const api_path = 'wlc';


let productModal = {};
let delProductModal = {};

const app = createApp({
    components:{
        pagination
    },
    data(){
        return{
            products:[],
            tempProduct:{
                imagesUrl:[], //做多圖用
            },
            isNew:false,
            pagination:{},
        }
    },
    methods:{
        checkLogin(){
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;
        //console.log(token);

        const url = `${site}/api/user/check`;
        axios.post(url)
            .then(()=>{
                // console.log(res);
                this.getProducts();
            })
        },
        getProducts(page=1){ //參數預設值 預設在第一頁
            // query代法?page=值
            const url = `${site}/api/${api_path}/admin/products/?page=${page}`; //有分頁API
            axios.get(url)
                .then(res=>{
                    this.products = res.data.products;
                    this.pagination =  res.data.pagination;
                    Object.values(this.products).forEach((item)=>{
                        console.log(item);
                    })                   
                })
        },
        openModel(status,product){
            console.log(status,product);
            if(status==='isNew'){    //新增
                this.tempProduct = {
                    imagesUrl:[],
                }
                productModal.show();
                this.isNew = true;
            }else if(status==='edit'){  //編輯
                this.tempProduct = {...product};  
                productModal.show();
                this.isNew = false;
            }else if(status==='delete'){
                delProductModal.show();
                this.tempProduct = {...product};
            }
           
        },       
        delProduct(){
            let url = `${site}/api/${api_path}/admin/product/${this.tempProduct.id}`;            
            axios.delete(url)
                .then(res=>{
                    console.log(res);
                    this.getProducts();
                    delProductModal.hide();                                 
                })
        }
    },
    mounted(){
        this.checkLogin();
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
       
        // productModal.show();
        // setTimeout(()=>{
        //     productModal.hide();  //Model在3秒後關掉
        // },3000);
    }
});

app.component('productModel',{
    props:['tempProduct'],
    template:`#templateForProductModel`,
    methods:{
        updataProduct(){
            let url = `${site}/api/${api_path}/admin/product`;
            let method = 'post';
            if(!this.isNew){
                url = `${site}/api/${api_path}/admin/product/${this.tempProduct.id}`;
                method = 'put';
            }
            axios[method](url,{data: this.tempProduct}) //{data:this.tempProduct}是因為後端規定所有資料必須放在data裡面
                .then(res=>{
                    console.log(res);
                    this.$emit('get-products');
                    //this.getProducts(); 沒有getProducts(外層的方法)
                    productModal.hide();                                 
                })
        },
    }
})
app.mount('#app');