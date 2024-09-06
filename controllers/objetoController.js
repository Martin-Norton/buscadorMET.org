//manejo de la lógica para cuando se obtiene utilizando el boton VER en una card de objeto de los resultados de la busqueda
const { translateText } = require('../models/metmuseum'); //importa la lógica de traducción
const axios = require('axios'); 
const MET_API_URL = 'https://collectionapi.metmuseum.org/public/collection/v1'; //URL de la API

async function getObject(req, res) { 
    //obtiene el id del objeto de arte
    const { id } = req.params; 
    //obtiene el valor del query single para saber si se requiere solo la imagen del objeto
    const { single } = req.query;
    try {
        const objectResponse = await axios.get(`${MET_API_URL}/objects/${id}`);// mediante esta url se accede a un objeto de arte especifico
        const objectData = objectResponse.data; // se obtiene la informacion del objeto

        //traducciones
        const translatedTitle = await translateText(objectData.title);
        const translatedCulture = await translateText(objectData.culture);
        const translatedDynasty = await translateText(objectData.dynasty);

        res.render('object', {
            id: objectData.objectID,
            title: translatedTitle,
            culture: translatedCulture,
            dynasty: translatedDynasty,
            imageUrl: objectData.primaryImageSmall,
            date: objectData.objectDate,
            additionalImages: objectData.additionalImages || [],// devuelve las imagenes adicionales si existen, sino devuelve la imagen principal
            single: single === 'true'
        });
    } catch (error) { // manejo de errors
        console.error('Error retrieving object data:', error);
        res.render('error', { error: 'No se pudo recuperar la información del objeto.' });
    }
}

//exporta las funciones
module.exports = { getObject };
