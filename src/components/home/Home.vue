<template>
    <div class="wrapper">
        
            
             <h2 class="center">Home Page</h2>
             <p class="center intro">Crypto tracker allows you to track all of your favorite cryptocurrencies as their prices rise and fall. 
                 Sign up and choose which coins to follow. Feel free to use our search tool below to explore some of the over 500 crypto
                  currencies that we offer up to date info on.</p>
           
       
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

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'


export default {
    name: 'Home',
    data(){
        return {
           coinID: null,
           coinName: null,
           lastPrice: null,
           searchTerm: null,
           feedBack: null,
           show: false
        }
    },
 
    methods:{
        // Gets coin data from api and displays
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

   .searchDisplay .card-content{
       padding-top: 12px;
       padding-bottom: 12px;
   }
   .intro{ 
       margin: 10px 100px;
       font-size: 1.1em;
   }
</style>

