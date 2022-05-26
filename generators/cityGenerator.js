const camelCase = require('camelCase');
const pixelWidth = require('string-pixel-width');

/**
 * User input data
 */
var capitalName = "Albury"
var pinX = 822
var pinY = 564
var labelDirection = "d" // can be d or r

// adjustments from user data
var camelName = camelCase(capitalName)
pinX += 5
pinY += 7
var labelX = 0
var labelY = 0

/**
 * Generation scripts
 */

function wordToHalfLength(word) {
    return pixelWidth(word, { size: 9 }) / 2
}

function getLabelPos(word) {
    // label to value
    switch (labelDirection) {
        case 'd':
            labelX = pinX - wordToHalfLength(word)
            labelY = pinY + 20
            break
        case 'r':
            labelX = pinX + 9
            labelY = pinY + 3
    }
}

function generate() {
    // generate html
    console.log(`
        <g id="${camelName}" class="city-group" dc onclick="handleCityClick(event)">
            <ellipse pulse cx="${pinX}" cy="${pinY}" rx="16" ry="16"
                fill="url('#pulseFill')" restart="always">
                <animate attributeName="rx" values="6.5;16;6.5" dur="1.6s"
                    repeatCount="indefinite" keyTimes="0;0.5;1"
                    keySplines="0.61, 1, 0.88, 1; 0.12, 0, 0.39, 0" />
                <animate attributeName="ry" values="6.5;16;6.5" dur="1.6s"
                    repeatCount="indefinite" keyTimes="0;0.5;1"
                    keySplines="0.61, 1, 0.88, 1; 0.12, 0, 0.39, 0" />
            </ellipse>
            <ellipse cx="${pinX}" cy="${pinY}" rx="7" ry="7" fill="white" />
            <ellipse cx="${pinX}" cy="${pinY}" rx="5" ry="5" identifier />
            <text x="${labelX}" y="${labelY}" class="city-name">${capitalName}</text>
        </g>
    `)
}

/**
 * Run scripts
 */

getLabelPos(camelName)
generate()