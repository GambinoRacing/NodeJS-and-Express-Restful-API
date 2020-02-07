// Create express app
var express = require("express")
var app = express()
var mysql = require('mysql')
var express = require("express")
var cors = require('cors')

app.use(cors())

// Server port
var HTTP_PORT = 3000

var pool = mysql.createPool({
  connectionLimit: 10,
  host: '195.96.246.36',
  user: 'apache',
  port: '3307',
  password: 'webpage',
  database: 'aladin_surfex'
});

var aladinModel = '';
var aladinModelStations = '';

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

var dateNow = formatDate(Date());

app.route('/')
  .get(function (req, res) {
    // omitted
    res.setHeader('Access-Control-Allow-Origin', '*', 'Cache-Control', 'private, no-cache, no-store, must-revalidate');
    //const date = req.query.date;
    const id = req.query.id;
    const daysForward = req.query.daysForward;

    pool.query(`CALL aladin_surfex.Get_mod_cell_values_meteogram_cell('${dateNow}', ${id}, ${daysForward})`, function (error, result, fields) {
      if (error)
      return res.status(500).json({ error: "Грешна заявка. Опитай отново !"})
      aladinModel = result;
      res.json({ aladinModel })
    });
  });

app.route('/stations')
  .get(function (req, res) {
    // omitted
    res.setHeader('Access-Control-Allow-Origin', '*', 'Cache-Control', 'private, no-cache, no-store, must-revalidate');
    const id2 = req.query.id2;
    
    pool.query(`SELECT Station,Ime FROM aladin_surfex.stations_cells WHERE Station=${id2}`, function (error, result2, fields) {
      if (error)
      return res.status(500).json({ error: "Грешна заявка. Опитай отново !"})
      aladinModelStations = result2;
      res.json({ aladinModelStations })
    });
  });

// Start server
app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

pool.on('error', function (err) {
  console.log(err.code); // 'ER_BAD_DB_ERROR'
});

app.use(function (req, res) {
  res.status(404);
});


