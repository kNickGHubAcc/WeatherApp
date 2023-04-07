const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public/"));


//Μόλις ο server λάβει ένα GET request επιστρέφει ένα ολόκληρο html αρχείο
app.get("/", function(req,res)
{
  res.sendFile(__dirname + "/index.html");
})

//Μόλις ο server λάβει ένα POST request επιστρέφει την θερμοκρασία και τον καιρό της πόλης που εισάγαμε
app.post("/", function(req,res)
{
  const city = req.body.cityName;   //Η πόλη που εισάγουμε στο input αποθηκεύεται στη μεταβλητή city
  const apiKey = "49bdba8f09a3cedb6fe0fd685477aeeb";
  const unit = "metric";   //Θερμοκρασία σε βαθμούς Κελσίου
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" +city+ "&appid=" +apiKey+ "&units=" +unit;
  https.get(url, function(response)
  {
    response.on("data", function(data)
    {
      const weatherData = JSON.parse(data);   //Τα data σε JSON format
      const temp = weatherData.main.temp;   //Η τιμή της θερμοκρασίας
      const weather = weatherData.weather[0].description;   //Η τιμή του καιρού
      const icon = weatherData.weather[0].icon;   //Η τιμή της εικόνας του καιρού
      const imageURL = "http://openweathermap.org/img/wn/" +icon+ "@2x.png";  //Το λινκ της εικόνας του καιρού

      res.write(
      `<style>
        body 
        {
          background-color: #4169E1;
          text-align: center;
          font-size: 30px;
        }
      </style>`);


      res.write("<h1>Temperature & Weather</h1>")
      res.write("<h2>"+city+ " has "+temp+"&#8451 and " +weather+ "</h2>");
      res.write("<img src=" +imageURL+ ">");
      res.send();   //Server responses στον browser τις παραπάνω write()
    })
  })
})


app.listen(4000, function()
{
  console.log("Server is running on port 3000...");
})


module.export = app;