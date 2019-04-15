<template>
<div class="wrapper">
     <div class="searchCard card grey darken-2">
         <div class="section white-text">
            <h6 class="center">Enter a coin identifier to search and add to your collection (example: btc)</h6>
         </div>
            <div class="card-content">
                <form @submit.prevent="getCoin">
                    <input class="white-text" type="text" placeholder="Enter a crypto id and press enter" v-model="searchTerm" >
                </form>
                <h4 v-if="feedBack" class="red-text">{{feedBack}}</h4>
                <div class="searchDisplay card" v-if="show">
                    
                    <div class="card-content blue lighten-5">
                         <i class="cc medium right" :class="coinID"></i>
                        <ul>
                            <li v-if="coinID">{{coinID}}</li>
                            <li v-if="coinName">{{coinName}}</li>
                            <li v-if="lastPrice">Last Price: ${{parseFloat(lastPrice) < 1.0 ? parseFloat(lastPrice).toFixed(4) : parseFloat(lastPrice).toFixed(2)}}</li>
                            
                        </ul>
                        <div class="card-action" v-if="coinID">
                            <a class="btn-flat" @click="addCoin">Add Coin</a>
                        </div>
                       
                    </div>
                </div>
            </div>
        </div>
        
            <h3 v-if="feedBack2" class="red-text">{{feedBack2}}</h3>
             
           
        
        
        <div class="block">
            <div class="coinDisplay card z-depth-3" v-for="(coin, index) in coins" :key="index">
                
                    <i class="material-icons right" @click="deleteCoin(index)">delete_forever</i>
               
                    <div class="card-content blue lighten-5">
                        <i class="cc medium right" :class="coin.coin_id"></i>
                        <ul>
                            <li>{{coin.coin_id}}</li>
                            <li>{{coin.coin_name}}</li>
                            <li>Last Price: ${{parseFloat(coin.last_price) < 1.0 ? parseFloat(coin.last_price).toFixed(4) : parseFloat(coin.last_price).toFixed(2)}}</li>
                        </ul>
                    </div>
            </div>
        </div>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import slugify from 'slugify'



export default {
    data(){
        return{
            profile: null,
            feedback: null,
            user: null,
            coinID: null,
           coinName: null,
           lastPrice: null,
           searchTerm: null,
           feedBack: null,
           feedBack2: null,
           show: false,
           response: null,
           coins: []
        }
    },
    methods:{
        // This method will get coin data from api and display it
        getCoin(){
            if(this.searchTerm){
               let s = "https://bravenewcoin-v1.p.rapidapi.com/ticker?show=usd&coin=" + this.searchTerm
               var unirest = require('unirest')
            unirest.get(s)
            .header("X-RapidAPI-Host", "bravenewcoin-v1.p.rapidapi.com")
            .header("X-RapidAPI-Key", "7516ddf706msh11c5f5dd27811f7p112ac4jsn1b6eab937f51")
           .then(response => {
               if(response.body.success){
                this.coinID = response.body.coin_id
                this.coinName = response.body.coin_name
                this.lastPrice = response.body.last_price
                this.response = response.body
                this.show = true
                this.feedBack = null
               } else {
                    this.coinID = null
                    this.coinName = null
                    this.lastPrice = null
                    this.show = null
                   this.feedBack = "The coin specified is not available"
               }
               console.log(response.body)
           })
        }
    },
    // adds coin into users list of coins being tracked
    addCoin(){
           let add = true
            this.coins.forEach(c => {
                if(c.coin_id == this.coinID){
                    add = false
                }
            })

            if(add){
                this.coins.push(this.response)
                this.coins.sort(this.compare)
                this.writeToFireStore()
                this.show = false
            } 

            
    },
    // deletes coin from usrs coin being tracked
    deleteCoin(ind){
        let newCoins = this.coins.filter((value, index, arr) => {
            return index!=ind
        })

        this.coins = newCoins
        this.writeToFireStore()
    },
    // writes user coin data to firestore
    writeToFireStore(){
        let db = firebase.firestore()
            let ref = db.collection('users')
            
            let slug = slugify(this.profile.alias, {
                    replacement: '-',
                    remove: /[$*_+~.()'"!\-:@]/g,
                    lower: true
                })

            ref.doc(slug).set({
                coins: this.coins
            }, {merge: true})
    },
    compare(a,b) {
        if (a.coin_id < b.coin_id)
            return -1;
        if (a.coin_id > b.coin_id)
            return 1;
        return 0;
}    
            
    },
    // hook to run when page is created
    // loads in all user data from firestore
    created(){
        console.log('created')
        let db = firebase.firestore()
        let ref = db.collection('users')
        let user = firebase.auth().currentUser
        var unirest = require('unirest')
        ref.where('user_id', '==', user.uid).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                this.user = doc.data()
                this.user.id = doc.id               
            })
        })

        
    
        setTimeout(() => {
        ref.doc(this.user.id).get()
        .then(user => {
            this.profile = user.data()
            //console.log(this.profile)
        })
        .then(() => {
            this.profile.coins.forEach(coin => {//console.log('here')
                let s = "https://bravenewcoin-v1.p.rapidapi.com/ticker?show=usd&coin=" + coin.coin_id
                unirest.get(s)
                .header("X-RapidAPI-Host", "bravenewcoin-v1.p.rapidapi.com")
                .header("X-RapidAPI-Key", "7516ddf706msh11c5f5dd27811f7p112ac4jsn1b6eab937f51")
                .then(response => {//console.log(response)
                    if(response.body.success){
                        this.coins.push(response.body)
                        //console.log(response.body)
               } else {
                   console.log('here 3')
                    this.coinID = null
                    this.coinName = null
                    this.lastPrice = null
                   this.feedBack2 = "Failed to load in user data"
               }
            })
            
        })
        console.log(this.coins)
        
            }
        )
    }
    , 800)
        
    },
}

</script>

<style>
    .searchCard{
       width: 400px;
       margin-top: 50px;
       display: inline-block;
   }
   .searchCard .searchDisplay{
        max-width: 300px;
        margin: 10px auto;
        text-align: left;   
   }
   .wrapper{
       text-align: center;
       position: relative;
   }
   .searchDisplay .card-action{
       padding: 4px;
   }
   .searchDisplay .card-content{
       padding-top: 12px;
       padding-bottom: 12px;
   }
   .card-action a{
       width:100%;
       text-align: center;
       
   }
   .card-action a:hover{
       background-color: #616161;
   }
   .coinDisplay{
        width: 300px;
        margin: 20px;
        text-align: left;
        display: inline-block;
   }
   .block{
       display: block;
       margin: 10px 30px;
   }
   .coinDisplay .material-icons{
       margin-right: 7px;
       margin-top: 7px;
       cursor: pointer;
   }
   .coinDisplay div.card-content i{
       margin: none;
   }
</style>

