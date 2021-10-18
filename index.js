var request = require('request');
var axios = require('axios');
var cheerio = require('cheerio');
var async = require('async');
//const tough = require('tough-cookie');


var url = 'https://rent.591.com.tw';

//Set cookie
//let jar = request.jar();
//jar.setCookie(request.cookie('urlJumpIp=1; urlJumpIpByTxt=%E5%8F%B0%E5%8C%97%E5%B8%82; T591_TOKEN=oprmsrmi7a3390briaqjlafor5; tw591__privacy_agree=0; webp=1; PHPSESSID=uo149eii722q42kqhdicl64v24; is_new_index=1; is_new_index_redirect=1; new_rent_list_kind_test=0; newUI=1; XSRF-TOKEN=eyJpdiI6IlBhVEVSSTNYUXlVRlhCTlZmaGQwT0E9PSIsInZhbHVlIjoiWTR4SWZrdExMUUFNS1BCZmwzMXFBZjYxZUpjY1hxRGpNSlQyaEFUa3BoaGdOb3NXZGRscjZMVG5jb1Z4OTVyUzV2XC9LT2xQdkZrSGsxWU82MjdJeFRRPT0iLCJtYWMiOiJhYmJjZDY5OWZiYjYxYmQ4MWNhYTA2ZjE5YTU2NDExNDRiNGJlNDA4ZDgxYWQzMGM3M2U3NTk2NzI5ZTcwMjUxIn0%3D; 591_new_session=eyJpdiI6Ilwvbk9ZNDE0UjJHMXZseDliYnUyVGlRPT0iLCJ2YWx1ZSI6ImViS2hZUTJ2bTF2QlwvUjRwUUthb0FJcE1CK3NFOFY3QnJrN3VXV2QyT2d0bXJXc1EzT1dOcGI5SGloUXhpZTg4ZFVaZ0R3SDlDcTl1M3NPWXRwYXhQdz09IiwibWFjIjoiYTQyN2MxYjkxYTM0MGNiOTc4OTJiNjM3ZWRjNWZkOTk2YTUxMDhmZGNmN2EwYWNkMmJjOTc3MGNhMjVhNWNkNSJ9'), url);
//request = request.defaults({jar: jar});

function getPagesCount(callback){
  /*
  //https://rent.591.com.tw/?multiPrice=10000_20000&section=2&searchtype=1
  //https://rent.591.com.tw/home/search/rsList?is_format_data=1&is_new_list=1&type=1&section=2&searchtype=1&multiPrice=10000_20000
    request('https://rent.591.com.tw/home/search/rsList', (err, res, body)=>{
      if(err===null){
        //const $ =cheerio.load(body);
        //const result =$('.switch-amount').text();
        let result = JSON.parse(body);
        //get data total rows.
        //const pagecount = $('.switch-amount').html();
        let pagesCount =Math.floor(result.records/30);

        callback(Array.from(new Array(pagesCount), (val, index) => index));
      }
      else{
        console.log(err);
      }
      })
      */

      axios.get('https://www.twse.com.tw/exchangeReport/STOCK_DAY',{
      /*headers: {
        'Cookie': "urlJumpIp=1",
        withCredentials: true,
      },*/
      params:{
        response:'json',
        date:'20211018',
        stockNo:'2330'
      },
      
    })
      .then( (response) => {
        //let result = JSON.stringify(response.data);
        let data = response.data.data;
        let fields= response.data.fields;
        let notes= response.data.notes;
        let title= response.data.title;

        //result = JSON.parse(result);
        console.log(result);
        //callback(Array.from(new Array(pagesCount), (val, index) => index));
      })
      .catch( (error) => console.log(error));
}

//Call the api of each page.
function getPage(pageNumber, callback){
    request('https://rent.591.com.tw/home/search/rsList?firstRow='+pageNumber*30, (err, res, body)=>{
      var result = JSON.parse(body)
      callback(result.data.data)
    })
  }

getPagesCount((pages)=>{
    async.map(pages, (page, callback)=>{
      getPage(page, (result)=>{
       callback(null, result);
     })
    }, (err, results)=>{
      console.log([].concat.apply([], results));
    })
});
  