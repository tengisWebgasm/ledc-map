import { generateCityLines } from "./lineGenerator.js";
import fs from  "fs"

const locationData = {
    "albury": {
        "x": 830.58,
        "y": 565,
        "capitalizedName": "Albury",
        "isOpen": false,
        "labelDirection": "d",
        "connections": [
            "nextDcMelbourne",
            "equinixSydney",
        ]
    },
    "nextDcMelbourne": {
        "x": 792.58,
        "y": 621,
        "capitalizedName": "NextDC Melbourne",
        "isOpen": false,
        "labelDirection": "d",
        "connections": [
            "albury"
        ]
    },
    "equinixSydney": {
        "x": 928,
        "y": 513.4,
        "capitalizedName": "Equinix Sydney",
        "isOpen": false,
        "labelDirection": "r",
        "connections": [
            "albury",
            "tamworth"
        ]
    },
    "bathurst": {
        "x": 895.58,
        "y": 494,
        "capitalizedName": "Bathurst",
        "isOpen": false,
        "labelDirection": "d",
        "connections": [
            "nextDcSydney",
        ]
    },
    "nextDcSydney": {
        "x": 915,
        "y": 524.4,
        "capitalizedName": "NextDC Sydney",
        "isOpen": false,
        "labelDirection": "r",
        "connections": [
            "bathurst"
        ]
    },
    "nextDcBrisbane": {
        "x": 957.58,
        "y": 355,
        "capitalizedName": "NextDC Brisbane",
        "isOpen": false,
        "labelDirection": "r",
        "connections": [
            "dubbo"
        ]
    },
    "dubbo": {
        "x": 867.58,
        "y": 469,
        "capitalizedName": "Dubbo",
        "isOpen": true,
        "labelDirection": "d",
        "connections": [
            "nextDcBrisbane"
        ]
    },
    "mildura": {
        "x": 729.58,
        "y": 519,
        "capitalizedName": "Mildura",
        "isOpen": false,
        "labelDirection": "d",
        "connections": [
            "horsham"
        ]
    },
    "horsham": {
        "x": 729.58,
        "y": 587,
        "capitalizedName": "Horsham",
        "isOpen": false,
        "labelDirection": "d",
        "connections": [
            "mildura"
        ]
    },
    "tamworth": {
        "x": 924.58,
        "y": 438,
        "capitalizedName": "Tamworth",
        "isOpen": true,
        "labelDirection": "d",
        "connections": [
            "equinixSydney"
        ]
    }
}

function main(){
    var citiesArray = Object.values(locationData);

    /**
     * Generate stuff
     */
    
    // Generate city lines HTML
    var cityHTML = "";
    var cityLinesHTML = generateCityLines(citiesArray);



    /**
     *  Write to file
     */

    // city lines to cityLines.html
    fs.writeFile('./output_data/cityLines.html', cityLinesHTML, err => {
        if (err) {
          console.error(err);
        }
    });
}

main()