
const axios = require('axios');

class Busquedas {
    historial = ['Tegusigalpa','Madrid','San José'];

    constructor(){
        
    }

    get paramsMapbox(){
        return{
            'proximity': 'ip',
            // 'types': 'place%2Cpostcode%2Caddress',
            'language':'es',
            'access_token': process.env.MAPBOX_KEY || ''
        }
    }

    async ciudad(lugar = ''){
        try {
            const intance = axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });
            const resp = await intance.get();
            console.log(resp.data.features);

            return [];
        } catch (error) {
            return [];
            
        }        
    }

}


module.exports = Busquedas;


