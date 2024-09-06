//manejo de la interacción con la API del Museo Metropolitano y la traducción
const axios = require('axios');
const translate = require('node-google-translate-skidz'); 
const MET_API_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

//traduccion del texto
async function translateText(text) {
    try {
        if (!text) return '';
        const result = await translate({
            text: text,
            source: 'en',
            target: 'es'
        });
        return result.translation || text;
    } catch (error) {
        console.error('Error during translation:', error);
        return text;
    }
}

// busqueda de objetos en la api del museo 
async function searchObjects({ keyword, department, location }) {
    let searchUrl = `${MET_API_URL}/search?hasImages=true&q=${keyword || ''}`;//si hay un valor en el campo keyword, se agrega a la url
    //si hay un valor en el campo departamento, se agrega a la url
    if (department) {
        searchUrl += `&department=${department}`;
    }

    //si hay un valor en el campo location, se agrega a la url
    if (location) {
        searchUrl += `&country=${location}`;
    }

    //limita las busquedas a los 500 primeros objetos debido a la demora de la api
    searchUrl += `&limit=${500}`;

    const searchResponse = await axios.get(searchUrl);
    const objectIDs = searchResponse.data.objectIDs;

    //si no se encuentran objetos, devuelve vacio el arreglo de respuestas
    if (!objectIDs || objectIDs.length === 0) {
        return [];
    }

    //obtiene la informacion de cada objeto mediante una promise
    return Promise.all(objectIDs.map(async id => {
        try {
            const objectResponse = await axios.get(`${MET_API_URL}/objects/${id}`);
            const objectData = objectResponse.data;

            const translatedTitle = await translateText(objectData.title);
            const translatedCulture = await translateText(objectData.culture);
            const translatedDynasty = await translateText(objectData.dynasty);

            return {
                id: objectData.objectID,
                title: translatedTitle,
                culture: translatedCulture,
                dynasty: translatedDynasty,
                imageUrl: objectData.primaryImageSmall,
                date: objectData.objectDate,
                additionalImages: objectData.additionalImages || []
            };
        } catch (error) { //manejo de los errors
            console.error('Error retrieving object data:', error);
            return null;
        }
    }));
}

//exporta las funciones
module.exports = { searchObjects, translateText };
