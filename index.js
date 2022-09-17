require('dotenv').config()
const { green } = require('colors');
const { inquirerMenu,pausa,leerInput, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


const main = async() => {
    let opt;
    const busquedas = new Busquedas();

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                //Mostrar Mensaje
                const termino = await leerInput('Ciudad:');

                //Buscar ciudad
                const lugares = await busquedas.ciudad(termino);

                //Seleccionar el lugar
                const id = await listarLugares(lugares);
                if (id === '0') continue;

                const {nombre,lat,lng} = lugares.find(l => l.id == id);

                //Guardar en DB
                busquedas.agregarHistorial(nombre);

                //Clima
                const clima = await busquedas.climaLugar(lat,lng);

                //Mostrar resultados
                console.log(`\nInformación de la ciudad\n`.green);
                console.log('Ciudad: ',nombre.green);
                console.log('Lat: ',lat);
                console.log('Lng: ',lng);
                console.log('Temperatura: ',clima.temp);
                console.log('Mínima: ',clima.min);
                console.log('Máxima: ',clima.max);
                console.log('Como esta el clima: ',clima.desc.green);

                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar,i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                })
                break;
        }

        if(opt !== 0) await pausa();

    } while (opt != 0);
}


main();