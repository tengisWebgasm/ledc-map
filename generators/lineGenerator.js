/*

<path dc="paya-lebar" city="guangzhou"
    d="M911.946 368.506C898.783 346.148 885.129 280.79 928.135 225.676"
    stroke="#05A8D0" />

*/

var cities = [
    {
        name: "albury",
        pinX: 822, 
        pinY: 564
    },
    {
        name: "dubbo",
        pinX: 871.6, 
        pinY: 461
    },
    {
        name: "newcastle",
        pinX: 941.4, 
        pinY: 479
    },
    {
        name: "tamworth",
        pinX: 933, 
        pinY: 418
    },
]

// Store the results here
var generatedHTML = ""
var count = 0

/**
 *  City generation script
 */

for (let i=0; i<cities.length; i++) {
    for (let j=0; j<cities.length; j++) {
        if (i === j) 
            continue

        // middle points, used for curve
        let x1 = cities[j].pinX + (cities[i].pinX - cities[j].pinX)*2/3
        let y1 = cities[j].pinY + (cities[i].pinY - cities[j].pinY)*2/3
        let x2 = cities[j].pinX + (cities[i].pinX - cities[j].pinX)/3
        let y2 = cities[j].pinY + (cities[i].pinY - cities[j].pinY)/3

        // rounding
        x1 = Math.round(x1 * 100) / 100
        y1 = Math.round(y1 * 100) / 100
        x2 = Math.round(x2 * 100) / 100
        y2 = Math.round(y2 * 100) / 100

        generatedHTML += `<path dc="${cities[i].name}" city="${cities[j].name}" 
            d="M${cities[i].pinX + 5} ${cities[i].pinY + 7}C${x1} ${y1} ${x2} ${y2} ${cities[j].pinX + 5},${cities[j].pinY + 7}" 
            stroke="#83ADFF" />
        `
        count++
    }
}

console.log("-----------------------\nTotal lines generated: " + count + "\n-------------------------")
console.log(generatedHTML)