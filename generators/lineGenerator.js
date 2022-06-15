/*

<path dc="paya-lebar" city="guangzhou"
    d="M911.946 368.506C898.783 346.148 885.129 280.79 928.135 225.676"
    stroke="#05A8D0" />

*/

import camelcase from "camelcase"

// var cities = [
//     {
//         name: "albury",
//         pinX: 822, 
//         pinY: 564,
//         connections: [
//             "nowra",
//             "waggaWagga",
//             "shepparton",
//             "traralgon"
//         ]
//     },
//     {
//         name: "dubbo",
//         pinX: 871.6, 
//         pinY: 461,
//         connections: [
//             "waggaWagga",
//             "sydneyNextDc",
//             "tamworth",
//             "bathurst"
//         ]
//     },
//     {
//         name: "newcastle",
//         pinX: 941.4, 
//         pinY: 479,
//         connections: [
//             "bathurst",
//             "tamworth",
//             "coffsHabour",
//             "sydneyEquinix"
//         ]
//     },
//     {
//         name: "tamworth",
//         pinX: 933, 
//         pinY: 418,
//         connections: [
//             "dubbo",
//             "bathurst",
//             "newcastle",
//             "coffsHabour",
//             "brisbaneNextDc"
//         ]
//     },
//     {
//         name: "cairns",
//         pinX: 811.6, 
//         pinY: 90,
//         connections: [
//             "bundaberg",
//             "brisbaneNextDc"
//         ]
//     },
//     {
//         name: "bundaberg",
//         pinX: 951.6, 
//         pinY: 279,
//         connections: [
//             "cairns",
//             "brisbaneNextDc"
//         ]
//     },
//     {
//         name: "brisbaneNextDc",
//         pinX: 971, 
//         pinY: 344,
//         connections: [
//             "cairns",
//             "bundaberg",
//             "coffsHabour",
//             "tamworth"
//         ]
//     },
//     {
//         name: "coffsHabour",
//         pinX: 976, 
//         pinY: 403.6,
//         connections: [
//             "brisbaneNextDc",
//             "newcastle",
//             "tamworth"
//         ]
//     },
//     {
//         name: "bathurst",
//         pinX: 898, 
//         pinY: 489.6,
//         connections: [
//             "dubbo",
//             "tamworth",
//             "newcastle"
//         ]
//     },
//     {
//         name: "sydneyEquinix",
//         pinX: 932.6, 
//         pinY: 496.5,
//         connections: [
//             "newcastle",
//             "sydneyNextDc",
//             "nowra"
//         ]
//     },
//     {
//         name: "sydneyNextDc",
//         pinX: 930.5, 
//         pinY: 506.7,
//         connections: [
//             "waggaWagga",
//             "sydneyEquinix",
//             "nowra",
//             "dubbo"
//         ]
//     },
//     {
//         name: "nowra",
//         pinX: 912.9, 
//         pinY: 540.4,
//         connections: [
//             "traralgon",
//             "sydneyEquinix",
//             "sydneyNextDc",
//             "waggaWagga",
//             "albury"
//         ]
//     },
//     {
//         name: "waggaWagga",
//         pinX: 833.5, 
//         pinY: 540,
//         connections: [
//             "dubbo",
//             "sydneyNextDc",
//             "mildura",
//             "nowra",
//             "albury"
//         ]
//     },
//     {
//         name: "traralgon",
//         pinX: 816, 
//         pinY: 618.4,
//         connections: [
//             "melbourne",
//             "shepparton",
//             "albury",
//             "nowra"
//         ]
//     },
//     {
//         name: "melbourne",
//         pinX: 789.6, 
//         pinY: 611,
//         connections: [
//             "geelong",
//             "traralgon",
//             "bendigo"
//         ]
//     },
//     {
//         name: "bendigo",
//         pinX: 780, 
//         pinY: 589,
//         connections: [
//             "melbourne",
//             "geelong",
//             "ballarat",
//             "horsham",
//             "shepparton",
//             "adeleide",
//             "mildura"
//         ]
//     },
//     {
//         name: "shepparton",
//         pinX: 777.9, 
//         pinY: 564,
//         connections: [
//             "albury",
//             "traralgon",
//             "bendigo",
//             "mildura"
//         ]
//     },
//     {
//         name: "geelong",
//         pinX: 776.5, 
//         pinY: 621.4,
//         connections: [
//             "ballarat",
//             "melbourne",
//             "bendigo",
//         ]
//     },
//     {
//         name: "ballarat",
//         pinX: 763.3, 
//         pinY: 605.3,
//         connections: [
//             "horsham",
//             "geelong",
//             "bendigo",
//         ]
//     },
//     {
//         name: "horsham",
//         pinX: 731.8, 
//         pinY: 584,
//         connections: [
//             "adeleide",
//             "ballarat",
//             "bendigo",
//         ]
//     },
//     {
//         name: "mildura",
//         pinX: 726, 
//         pinY: 514.5,
//         connections: [
//             "adeleide",
//             "shepparton",
//             "bendigo",
//             "waggaWagga"
//         ]
//     },
//     {
//         name: "adeleide",
//         pinX: 650.6, 
//         pinY: 532.8,
//         connections: [
//             "mildura",
//             "horsham",
//             "bendigo"
//         ]
//     },
// ]

/**
 * Generate lines connecting cities. Generates 2 between 2 cities.
 * @param {*} cities 
 * @returns 
 */
export function generateCityLines(cities){
    // Store the results here
    var generatedHTML = ""

    for (let i=0; i<cities.length; i++) {
        for (let j=i; j<cities.length; j++) {
            // same object cancellation
            if (i === j) 
                continue
                
            let iCamelName = camelcase(cities[i].capitalizedName)
            let jCamelName = camelcase(cities[j].capitalizedName)

            // not in city connections list
            if (!cities[i].connections.includes(jCamelName)
                || !cities[j].connections.includes(iCamelName)) 
                continue

            // middle points, used for curve
            let x1 = cities[j].x + (cities[i].x - cities[j].x)*2/3
            let y1 = cities[j].y + (cities[i].y - cities[j].y)*2/3
            let x2 = cities[j].x + (cities[i].x - cities[j].x)/3
            let y2 = cities[j].y + (cities[i].y - cities[j].y)/3
    
            // rounding
            x1 = Math.round(x1 * 100) / 100
            y1 = Math.round(y1 * 100) / 100
            x2 = Math.round(x2 * 100) / 100
            y2 = Math.round(y2 * 100) / 100
    
            generatedHTML += `<path dc="${iCamelName}" city="${jCamelName}" 
                d="M${cities[i].x} ${cities[i].y}C${x1} ${y1} ${x2} ${y2} ${cities[j].x},${cities[j].y}" />
            `
        }
    }

    return generatedHTML;
}