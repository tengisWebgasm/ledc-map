import locationData from "./input_data/locations.json" assert { type: 'json' };
import { generateCity } from "./cityGenerator.js";
import { generateCityLines } from "./lineGenerator.js";
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
function main(){
    var citiesArray = Object.values(locationData);

    /**
     * Generate stuff
     */
    
    // Generate city HTML
    var cityHTML = "";
    citiesArray.forEach(city => {
        cityHTML += generateCity(city);
    })

    // Generate city lines HTML
    var cityLinesHTML = generateCityLines(citiesArray);



    /**
     *  Write to file
     */

    // city pin data to cities.html
    fs.writeFile('./output_data/cities.html', cityHTML, err => {
        if (err) {
          console.error(err);
        }
    });

    // city lines to cityLines.html
    fs.writeFile('./output_data/cityLines.html', cityLinesHTML, err => {
        if (err) {
          console.error(err);
        }
    });
}

main()