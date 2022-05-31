/*

<path dc="paya-lebar" city="guangzhou"
    d="M911.946 368.506C898.783 346.148 885.129 280.79 928.135 225.676"
    stroke="#05A8D0" />

*/

var cities = [
    {
        name: "albury",
        pinX: 822, 
        pinY: 564,
        connections: [
            "nowra",
            "waggaWagga",
            "shepparton",
            "traralgon"
        ]
    },
    {
        name: "dubbo",
        pinX: 871.6, 
        pinY: 461,
        connections: [
            "waggaWagga",
            "sydneyNextDc",
            "tamworth",
            "bathurst"
        ]
    },
    {
        name: "newcastle",
        pinX: 941.4, 
        pinY: 479,
        connections: [
            "bathurst",
            "tamworth",
            "coffsHabour",
            "sydneyEquinix"
        ]
    },
    {
        name: "tamworth",
        pinX: 933, 
        pinY: 418,
        connections: [
            "dubbo",
            "bathurst",
            "newcastle",
            "coffsHabour",
            "brisbaneNextDc"
        ]
    },
    {
        name: "cairns",
        pinX: 811.6, 
        pinY: 90,
        connections: [
            "bundaberg",
            "brisbaneNextDc"
        ]
    },
    {
        name: "bundaberg",
        pinX: 951.6, 
        pinY: 279,
        connections: [
            "cairns",
            "brisbaneNextDc"
        ]
    },
    {
        name: "brisbaneNextDc",
        pinX: 971, 
        pinY: 344,
        connections: [
            "cairns",
            "bundaberg",
            "coffsHabour",
            "tamworth"
        ]
    },
    {
        name: "coffsHabour",
        pinX: 976, 
        pinY: 403.6,
        connections: [
            "brisbaneNextDc",
            "newcastle",
            "tamworth"
        ]
    },
    {
        name: "bathurst",
        pinX: 898, 
        pinY: 489.6,
        connections: [
            "dubbo",
            "tamworth",
            "newcastle"
        ]
    },
    {
        name: "sydneyEquinix",
        pinX: 932.6, 
        pinY: 496.5,
        connections: [
            "newcastle",
            "sydneyNextDc",
            "nowra"
        ]
    },
    {
        name: "sydneyNextDc",
        pinX: 930.5, 
        pinY: 506.7,
        connections: [
            "waggaWagga",
            "sydneyEquinix",
            "nowra",
            "dubbo"
        ]
    },
    {
        name: "nowra",
        pinX: 912.9, 
        pinY: 540.4,
        connections: [
            "traralgon",
            "sydneyEquinix",
            "sydneyNextDc",
            "waggaWagga",
            "albury"
        ]
    },
    {
        name: "waggaWagga",
        pinX: 833.5, 
        pinY: 540,
        connections: [
            "dubbo",
            "sydneyNextDc",
            "mildura",
            "nowra",
            "albury"
        ]
    },
    {
        name: "traralgon",
        pinX: 816, 
        pinY: 618.4,
        connections: [
            "melbourne",
            "shepparton",
            "albury",
            "nowra"
        ]
    },
    {
        name: "melbourne",
        pinX: 789.6, 
        pinY: 611,
        connections: [
            "geelong",
            "traralgon",
            "bendigo"
        ]
    },
    {
        name: "bendigo",
        pinX: 780, 
        pinY: 589,
        connections: [
            "melbourne",
            "geelong",
            "ballarat",
            "horsham",
            "shepparton",
            "adeleide",
            "mildura"
        ]
    },
    {
        name: "shepparton",
        pinX: 777.9, 
        pinY: 564,
        connections: [
            "albury",
            "traralgon",
            "bendigo",
            "mildura"
        ]
    },
    {
        name: "geelong",
        pinX: 776.5, 
        pinY: 621.4,
        connections: [
            "ballarat",
            "melbourne",
            "bendigo",
        ]
    },
    {
        name: "ballarat",
        pinX: 763.3, 
        pinY: 605.3,
        connections: [
            "horsham",
            "geelong",
            "bendigo",
        ]
    },
    {
        name: "horsham",
        pinX: 731.8, 
        pinY: 584,
        connections: [
            "adeleide",
            "ballarat",
            "bendigo",
        ]
    },
    {
        name: "mildura",
        pinX: 726, 
        pinY: 514.5,
        connections: [
            "adeleide",
            "shepparton",
            "bendigo",
            "waggaWagga"
        ]
    },
    {
        name: "adeleide",
        pinX: 650.6, 
        pinY: 532.8,
        connections: [
            "mildura",
            "horsham",
            "bendigo"
        ]
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
        // same object cancellation
        if (i === j) 
            continue

        // not in city connections list
        if (!cities[i].connections.includes(cities[j].name) || !cities[j].connections.includes(cities[i].name)) 
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
            d="M${cities[i].pinX + 5} ${cities[i].pinY + 7}C${x1} ${y1} ${x2} ${y2} ${cities[j].pinX + 5},${cities[j].pinY + 7}" />
        `
        count++
    }
}

console.log("-----------------------\nTotal lines generated: " + count + "\n-------------------------")
console.log(generatedHTML)