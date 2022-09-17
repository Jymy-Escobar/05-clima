const fs = require('fs');
const axios = require('axios');

class Busquedas {
    historial = ['Tegusigalpa','Madrid','San José'];
    dbPhath= './db/database.json'

    constructor(){
         this.leerDB();
    }

    get paramsMapbox(){
        return{
            'proximity': 'ip',
            // 'types': 'place%2Cpostcode%2Caddress',
            'language':'es',
            'access_token': process.env.MAPBOX_KEY || ''
        }
    }

    get historialCapitalizado(){        
        this.historial.forEach((nombre) => {
            const ciudad = nombre.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
            const indice = this.historial.indexOf(nombre);
            this.historial[indice] = ciudad;
        });
        return this.historial;
    }

    get paramsOpenWeather(){
        return{
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    async ciudad(lugar = ''){
        try {
            const intance = axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });
            const resp = await intance.get();
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
        } catch (error) {
            return [];
            
        }        
    }

    async climaLugar(lat, lon){
        try {
            const intance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {...this.paramsOpenWeather, lat ,lon}
            });

            const resp = await intance.get();
            const {weather,main} = resp.data;
            
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            };            
        } catch (error) {
            console.log(error);
            return{};
        }
    }


    agregarHistorial(lugar){
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }

        this.historial = this.historial.splice(0,5);

        this.historial.unshift(lugar.toLocaleLowerCase());

        this.guardarDB();
    }

    guardarDB(){

        const payload = {
            historial: this.historial,
        }

        fs.writeFileSync(this.dbPhath, JSON.stringify(payload));
    }

    leerDB(){

        if(fs.existsSync(this.dbPhath)){
            //Debe de existir.....
            const info = fs.readFileSync(this.dbPhath,{encoding:'utf-8'});

            const data = JSON.parse(info);

            this.historial = data.historial;
        }else{
            return;
        }
    }
        

}


module.exports = Busquedas;


