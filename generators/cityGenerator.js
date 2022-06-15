import camelCase from 'camelCase';
import pixelWidth from 'string-pixel-width';

/**
 * Generation scripts
 */

function wordToHalfLength(word) {
    return pixelWidth(word, { size: 10 }) / 2
}

function getLabelPos(word, pinX, pinY, labelDirection) {
    var labelX = 0
    var labelY = 0

    // label to value
    switch (labelDirection) {
        case 'd':
            labelX = pinX - wordToHalfLength(word)
            labelY = pinY + 14
            break
        case 'r':
            labelX = pinX + 9
            labelY = pinY + 3
    }

    return {
        x: labelX,
        y: labelY
    }
}

function generate(capitalName, camelCaseName, pinX, pinY, labelX, labelY, isOpen) {
    // generate html
    return `
        <g id="${camelCaseName}" class="city-group" ${isOpen ? 'dc onclick="handleCityClick(event)"' : "soon"}>
            ${isOpen ? `<ellipse pulse cx="${pinX}" cy="${pinY}" rx="16" ry="16"
                fill="url('#pulseFill')" restart="always">
                <animate attributeName="rx" values="6.5;16;6.5" dur="1.6s"
                    repeatCount="indefinite" keyTimes="0;0.5;1"
                    keySplines="0.61, 1, 0.88, 1; 0.12, 0, 0.39, 0" />
                <animate attributeName="ry" values="6.5;16;6.5" dur="1.6s"
                    repeatCount="indefinite" keyTimes="0;0.5;1"
                    keySplines="0.61, 1, 0.88, 1; 0.12, 0, 0.39, 0" />
            </ellipse>` : ""}
            <ellipse cx="${pinX}" cy="${pinY}" rx="7" ry="7" fill="white" />
            <ellipse cx="${pinX}" cy="${pinY}" rx="5" ry="5" identifier />
            <text x="${labelX}" y="${labelY}" class="city-name">${capitalName}</text>
        </g>
    `
}

/**
 * Generates city pins HTML based on city data
 * @param {*} city City data object containing the following keys: capitalizedName, x, y, labelDirection, isOpen
 * @returns HTML containing a single pulsating city pin
 */
export function generateCity(city) {
    let labelPos = getLabelPos(city.capitalizedName, city.x, city.y, city.labelDirection)
    let camelCaseName = camelCase(city.capitalizedName);
    return generate(city.capitalizedName, camelCaseName, city.x, city.y, labelPos.x, labelPos.y, city.isOpen)
}