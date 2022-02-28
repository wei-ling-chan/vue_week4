import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

const site = 'https://vue3-course-api.hexschool.io/v2';

const app = createApp({
    data(){
        return{
            user:{
                username:'',
                password:''
            }
        }
    },
    methods:{
        login(){
            const url = `${site}/admin/signin`;
            axios.post(url, this.user)
                .then(res=>{
                    console.log(res);
                    const{token,expired} = res.data;
                    console.log(token,expired);
                    document.cookie = `hexToken=${token}; expires=${new Date(expired)};`; //unix time 轉型
                    window.location = 'products.html'; //轉址
                })
                .catch( (err)=>{
                    console.log(err);
                })
            // console.log(this.user);
        }
    }
});

app.mount('#app');