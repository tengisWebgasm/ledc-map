import locationData from "./input_data/locations.json" assert { type: 'json' };
import { generateCity } from "./cityGenerator.js";
import fs from  "fs"

/**
 * Convert /data/locations.json city data from latitude and longitude to
 * pixels relative to the Map.svg file. 
 * Uses projections mapping from lat/long range to convert to pixels
 * 
 * @returns Object with x and y keys, representing position in pixels
 */
function mapLatLongToPixels(city, startLoc, endLoc, startXY, endXY){
    var cityData = locationData[city];
    var cityX = (cityData.long - startLoc.long) * (endXY.x - startXY.x) / (endLoc.long - startLoc.long) + startXY.x;
    var cityY = (cityData.lat - startLoc.lat) * (endXY.y - startXY.y) / (endLoc.lat - startLoc.lat) + startXY.y;
    return {
        capitalName: cityData.capitalizedName,
        camelCaseName: city,
        isOpen: cityData.isOpen,
        labelDirection: cityData.labelDirection,
        connections: cityData.connections,
        x: cityX,
        y: cityY
    };
}

/**
 * Main function for generation
 * @param {} startLoc 
 * @param {*} endLoc 
 * @param {*} startXY 
 * @param {*} endXY 
 * @returns Array of city positions
 */
function main(startLoc, endLoc, startXY, endXY){
    var citiesArray = []
    var startLoc = locationData.leftTopCorner
    var endLoc = locationData.bottomRightCorner
    var startXY = {
        x: 0,
        y: 0
    }
    var endXY = {
        x: 1440,
        y: 784
    }
    
    // Loop over all locationData keys, except the corner positions
    Object.keys(locationData).forEach(city => {
        if (city == "leftTopCorner" || city == "bottomRightCorner")
            return;
    
        citiesArray.push(mapLatLongToPixels(city, startLoc, endLoc, startXY, endXY))
    })
    
    // Generate city html
    var cityHTML = "";
    citiesArray.forEach(city => {
        cityHTML += generateCity(city);
    })
    fs.writeFile('./output_data/cities.html', cityHTML, err => {
        if (err) {
          console.error(err);
        }
        // file written successfully
      });
}

console.log(main())