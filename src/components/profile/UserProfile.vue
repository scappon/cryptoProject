<template>
<div class="wrapper">
    <prediction v-if="makePrediction" :coinName="predictionName"></prediction>
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

        <div class="block">
            <CoinCard v-for="(c, index) in user.coins" :key=index :coin="c">
                <i class="material-icons right" @click="deleteCoin(index)">delete_forever</i>
                <!--<template v-slot:actionButton>
                    <div class="card-action">
                        <a class="btn-flt black-text" @click="showPrediction(c.coin_name)">Make a Prediction</a>
                    </div>
                </template>-->
            </CoinCard> 
        </div>
        
        
        
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import slugify from 'slugify'
import axios from 'axios'
import Prediction from '@/components/profile/Prediction'
import CoinCard from '@/components/profile/CoinCard'


export default {
    components: {
        Prediction,
        CoinCard
    },
    data(){
        return{
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
           coins: [],
           makePrediction: false,
           date: null,
           predictionName: null,
            likes: null
        }
    },
    methods:{
        showPrediction(name){
            this.makePrediction = true
            this.predictionName = name
        },
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
            
            db.collection('users').doc(this.$route.params.id).set({
                coins:this.coins
            }, {merge:true})
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
        var unirest = require('unirest')
        
      
        
        db.collection('users').doc(this.$route.params.id).get()
        .then(doc => {
            doc.data().coins.forEach(coin => {
                let s = "https://bravenewcoin-v1.p.rapidapi.com/ticker?show=usd&coin=" + coin.coin_id
                unirest.get(s)
                .header("X-RapidAPI-Host", "bravenewcoin-v1.p.rapidapi.com")
                .header("X-RapidAPI-Key", "7516ddf706msh11c5f5dd27811f7p112ac4jsn1b6eab937f51")
                .then(response => {
                    if(response.body.success){
                        this.coins.push(response.body)
                       this.writeToFireStore()
               } else {
                    this.coinID = null
                    this.coinName = null
                    this.lastPrice = null
                   this.feedBack2 = "Failed to load in user data"
               }
            })
            })          
        })
    },
    update(){
        this.coins.sort(this.compare)
        console.log("UPDATE")
    },
    firestore(){
       return{
              user: db.collection('users').doc(this.$route.params.id)
       }
    }
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
  .card-action {
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
 
   .block{
       display: block;
       margin: 10px 30px;
   }

</style>

