const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const _=require("lodash")

const app = express();
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});


app.post("/",function(req,res){
  const query = req.body.City;
  console.log(query);
  const key  = "e5c16dd7bb448322e9f65af8120a049d";
  const units = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+key+"&units="+units;


  https.get(url,function(response){
   
    response.on("data",function(data){  
    const weatherData = JSON.parse(data);
    if(weatherData.cod==='404') {
      console.error("City Not found!");
      res.sendFile(__dirname+"/index.html");
    }
    else{
    const description = _.capitalize(weatherData.weather[0].description);
    const temp = weatherData.main.temp;
    const feels_like = _.capitalize(weatherData.main.feels_like);
    const humidity = weatherData.main.humidity;
      const icon = weatherData.weather[0].icon;
     
    res.render("card",{city:_.capitalize(query),descriptn:description,temperature:temp,feels:feels_like,humid:humidity,icon:icon});
    }
  });
  
  });
});



app.listen(process.env.PORT||3000,function(){
  console.log("Server has started at port 3000");
});
