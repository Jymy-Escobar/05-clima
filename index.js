const { inquirerMenu,pausa,leerInput } = require("./helpers/inquirer")


const main = async() => {
    let opt;

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                
                break;
            case 2:
            
                break;
        }

        if(opt !== 0) await pausa();

    } while (opt != 0);
}


main();