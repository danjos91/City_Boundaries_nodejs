const Nominatim = require('nominatim-geocoder')
const fs = require('fs')
const axios = require('axios');
const geocoder = new Nominatim()

fs.readFile('src/cities.txt', (err, data) => {
    if (err) throw err;
    const dataString = Buffer.from(data)
    let cities = dataString.toString().split('\n')
    for (let i = 0; i < cities.length; i++) {
        findOSMID(cities[i])
    }
});

function findOSMID(city)
{
    geocoder.search( { q: city } )
        .then((response) => {
            let id = response[0].osm_id;
            console.log(city + '\nOSM ID : ' + id)
            openPolygonPage(id, city)
        })
        .catch((error) => {
            console.log(error)
        })
}

function openPolygonPage(id, city)
{
    let url = 'http://polygons.openstreetmap.fr/?id=' + id;
    axios.get(url)
        .then(function (response) {
            console.log('OK');
            getJsonLimits(id)
        })
        .catch(function (error) {
            console.log('Error reading http://polygons.openstreetmap.fr/?id=' + id + '\n Bad OSM ID, trying again...');
        })
        .then(function () {
        });
}

function getJsonLimits(id){
    let url = 'http://polygons.openstreetmap.fr/get_geojson.py?id=' + id + '&params=0';
    axios.get(url)
        .then(function (response) {
            let file_data = JSON.stringify(response.data)
            let path = 'Cities/CityLimits_' + id + '.json'
            console.log('saving file... ' + 'CityLimits_' + id + '.json');
            fs.writeFileSync( path, file_data);
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
        });
}

//269701
