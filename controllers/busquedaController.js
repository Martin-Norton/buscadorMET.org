//manejo de la lógica de búsqueda de objetos
const { searchObjects } = require('../models/metmuseum'); //indica el archivo de la lógica de traducción

//funcion asincronica que obtiene los resultados
async function search(req, res) {
    const { keyword, department, location, page = 1 } = req.query; //obtiene los valores del formulario

    try {
        const objects = await searchObjects({ keyword, department, location }); 

        const filteredObjects = objects.filter(obj => obj !== null && obj.imageUrl); //filtra los objetos que no tienen imagen o no existen
        const totalPages = Math.ceil(filteredObjects.length / 20); //obtiene el total de paginas 
        const objectsToShow = filteredObjects.slice((page - 1) * 20, page * 20); //obtiene los objetos a mostrar

        res.render('results', { 
            objects: objectsToShow, 
            page: parseInt(page), 
            totalPages,
            keyword,
            department,
            location 
        });
    } catch (error) { //manejo de los errors
        console.error(error);
        res.render('error', { error: 'No se pudieron recuperar los objetos de arte.' });
    }
}

//exporta las funciones
module.exports = { search };
