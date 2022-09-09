const url = "/api/coffee";

var country_ids = [];
var table_data = [];
var total_rows = 0;
var myChart;
var ctx = document.getElementById('lineChart');
var year_ids = [];
var cat_ids = ["Total consumption", "Total Production", "Total Exports", "Total Imports",
    "Roast Ground consumption", "Soluble consumption",
    "Arabica Production", "Robusta Production", "Other Production",
    "Bean Exports", "Roast Ground Exports", "Soluble Exports",
    "Bean Imports", "Roast Ground Imports", "Soluble Imports"];
var cat_map = ["Total_consumption", "Total_Production", "Total_Exports", "Total_Imports",
    "Roast_Ground_consumption", "Soluble_consumption",
    "Arabica_Production", "Robusta_Production", "Other_Production",
    "Bean_Exports", "Roast_Ground_Exports", "Soluble_Exports",
    "Bean_Imports", "Roast_Ground_Imports", "Soluble_Imports"];


d3.json(url).then(function (csvData) {

    table_data = csvData[0];
    total_rows = table_data.Country_Name.length;

    var lines_legend = [];
    var lines_value = [[], [], [], []];
    var lines_year = [];
    var bar_value = {};
    var bar_value_sorted = [];
    var bar_country_sorted = [];
    var cat = cat_ids[0];
    //ready data to variable arrays
    for (var j = 0; j < total_rows; j++) {
        var duplicate = 0;
        //get unique values of country.
        if (j == 0) {
            country_ids.push(table_data.Country_Name[j]);
        }
        else {
            duplicate = 0;
            for (var i = 0; i < country_ids.length; i++) {
                if (table_data.Country_Name[j] == country_ids[i]) {
                    duplicate = 1;
                    break;
                }
                else {
                    continue;
                }
            };
            if (duplicate == 0) {
                country_ids.push(table_data.Country_Name[j]);
            }
        };
        //get unique values of years.

        if (j == 0) {
            year_ids.push(table_data.Market_Year[j]);
        }
        else {
            duplicate = 0;
            for (var i = 0; i < year_ids.length; i++) {
                if (table_data.Market_Year[j] == year_ids[i]) {
                    duplicate = 1;
                    break;
                }
                else {
                    continue;
                }
            };
            if (duplicate == 0) {
                year_ids.push(table_data.Market_Year[j]);
            }
        };

        //get default values country chart2
        if (table_data.Country_Name[j] == country_ids[0]) {
            lines_value[0].push(table_data.Arabica_Production[j]);
            lines_value[1].push(table_data.Robusta_Production[j]);
            lines_value[2].push(table_data.Other_Production[j]);
            lines_value[3].push(table_data.Total_Production[j]);
            lines_year.push(table_data.Market_Year[j]);
        };
        //get default values year chart3
        if (table_data.Market_Year[j] == year_ids[0]) {
            bar_value[`${table_data.Country_Name[j]}`] = table_data.Total_consumption[j];
        };


    };

    //sort bar value 
    // Create items array
    var items = Object.keys(bar_value).map(function (key) {
        return [key, bar_value[key]];
    });

    // Sort the array based on the second element
    items.sort(function (first, second) {
        return second[1] - first[1];
    });
    //get top 10 countries

    bar_country_sorted = items.slice(0, 10).map(x => x[0]);
    bar_value_sorted = items.slice(0, 10).map(x => x[1]);

    //populate countries to drop down box
    var dropDownOption = d3.select("#selDataset").selectAll("option").data(country_ids);
    dropDownOption.enter().append("option")
        .attr("value", function (d) {
            return d;
        })
        .text(function (d) {
            return d;
        });

    var dropDownOption1 = d3.select("#selYear").selectAll("option").data(year_ids);
    dropDownOption1.enter().append("option")
        .attr("value", function (d) {
            return d;
        })
        .text(function (d) {
            return d;
        });

    var dropDownOption2 = d3.select("#selCat").selectAll("option").data(cat_ids);
    dropDownOption2.enter().append("option")
        .attr("value", function (d) {
            return d;
        })
        .text(function (d) {
            return d;
        });

    //get default value
    var country = country_ids[0];
    var param = "Production";
    lines_legend = ["Arabica Production", "Robusta Production", "Other Production", "Total Production"];

    //draw default lines

    var labels = lines_year;
    var data = {
        labels: labels,
        datasets: [{
            label: lines_legend[0],
            data: lines_value[0],
            fill: false,
            borderColor: 'rgb(255, 60, 60)',
            tension: 0.1
        },
        {
            label: lines_legend[1],
            data: lines_value[1],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        },
        {
            label: lines_legend[2],
            data: lines_value[2],
            fill: false,
            borderColor: 'rgb(75, 192, 45)',
            tension: 0.1
        },
        {
            label: lines_legend[3],
            data: lines_value[3],
            fill: false,
            borderColor: 'rgb(150, 120, 240)',
            tension: 0.1
        }
        ]
    };
    var config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: `${param} of ${country}`,
                    font: {
                        size: 20
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year',
                        font: {
                            size: 20
                        }
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Tons',
                        font: {
                            size: 20
                        }
                    }
                }
            }
        }
    };
    myChart = new Chart(ctx,
        config
    );

    //draw default bar
    var trace1 = {
        x: bar_value_sorted,
        y: bar_country_sorted,
        type: "bar",
        orientation: "h",
        transforms: [{
            type: 'sort',
            target: 'y',
            order: 'descending'
        }]

    };
    var data = [trace1];
    var layout = {
        title: `<b>Top 10 countries in ${year_ids[0]} on ${cat}</b>`,
        yaxis: {
            automargin: true
        },
        xaxis: {
            title: "Tons"
        }
    };
    var config = { responsive: true }
    Plotly.newPlot("bar", data, layout, config);

    var map_countries = items.map(x => x[0]);
    var map_data = items.map(x => x[1]);


    var mdata = [{
        type: 'choropleth',
        locationmode: 'country names',
        locations: map_countries,
        z: map_data,
        text: map_countries,
        autocolorscale: true
    }];

    var mlayout = {
        title: `${cat} Worldwide in ${year_ids[0]}`,
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 70,
            pad: 2
        },
        geo: {
            projection: {
                type: 'robinson'
            }
        }
    };

    Plotly.newPlot("mymap", mdata, mlayout);

});

// update per country chosen
d3.selectAll("#selDataset").on("change", optionChanged);
function optionChanged() {
    //get dropdown value
    var country = d3.select("#selDataset").property("value");
    //get current param
    var param = d3.select('input[name="params"]:checked').node().value;
    var lines_legend = [];
    var lines_value = [[], [], [], []];
    var lines_year = [];
    //get updated values
    for (var j = 0; j < total_rows; j++) {
        if (table_data.Country_Name[j] == country) {
            switch (param) {
                case "Consumption":
                    lines_value[0].push(table_data.Roast_Ground_consumption[j]);
                    lines_value[1].push(table_data.Soluble_consumption[j]);
                    lines_value[2].push(table_data.Total_consumption[j]);
                    lines_year.push(table_data.Market_Year[j]);
                    lines_legend = ["Roast Ground consumption", "Soluble consumption", "Total consumption", ""];
                    break;
                case "Import":
                    lines_value[0].push(table_data.Bean_Imports[j]);
                    lines_value[1].push(table_data.Roast_Ground_Imports[j]);
                    lines_value[2].push(table_data.Soluble_Imports[j]);
                    lines_value[3].push(table_data.Total_Imports[j]);
                    lines_year.push(table_data.Market_Year[j]);
                    lines_legend = ["Bean Imports", "Roast Ground Imports", "Soluble Imports", "Total Imports"];
                    break;
                case "Export":
                    lines_value[0].push(table_data.Bean_Exports[j]);
                    lines_value[1].push(table_data.Roast_Ground_Exports[j]);
                    lines_value[2].push(table_data.Soluble_Exports[j]);
                    lines_value[3].push(table_data.Total_Exports[j]);
                    lines_year.push(table_data.Market_Year[j]);
                    lines_legend = ["Bean Exports", "Roast Ground Exports", "Soluble Exports", "Total Exports"];
                    break;
                default:
                    lines_value[0].push(table_data.Arabica_Production[j]);
                    lines_value[1].push(table_data.Robusta_Production[j]);
                    lines_value[2].push(table_data.Other_Production[j]);
                    lines_value[3].push(table_data.Total_Production[j]);
                    lines_year.push(table_data.Market_Year[j]);
                    lines_legend = ["Arabica Production", "Robusta Production", "Other Production", "Total Production"];
                    break;
            }
        };
    };
    //redraw
    myChart.destroy();
    var labels = lines_year;
    var data = {
        labels: labels,
        datasets: [{
            label: lines_legend[0],
            data: lines_value[0],
            fill: false,
            borderColor: 'rgb(255, 60, 60)',
            tension: 0.1
        },
        {
            label: lines_legend[1],
            data: lines_value[1],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        },
        {
            label: lines_legend[2],
            data: lines_value[2],
            fill: false,
            borderColor: 'rgb(75, 192, 45)',
            tension: 0.1
        },
        {
            label: lines_legend[3],
            data: lines_value[3],
            fill: false,
            borderColor: 'rgb(150, 120, 240)',
            tension: 0.1
        }
        ]
    };
    var config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: `${param} of ${country}`,
                    font: {
                        size: 20
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year',
                        font: {
                            size: 20
                        }
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Tons',
                        font: {
                            size: 20
                        }
                    }
                }
            }
        }
    };
    myChart = new Chart(ctx,
        config
    );

};

// update per parameters chosen
d3.selectAll('input[name="params"]').on("change", radioChanged);
function radioChanged() {
    //get dropdown value
    var country = d3.select("#selDataset").property("value");
    //get current param
    var param = d3.select('input[name="params"]:checked').node().value;
    var lines_legend = [];
    var lines_value = [[], [], [], []];
    var lines_year = [];

    //get updated values
    for (var j = 0; j < total_rows; j++) {
        if (table_data.Country_Name[j] == country) {
            switch (param) {
                case "Consumption":
                    lines_value[0].push(table_data.Roast_Ground_consumption[j]);
                    lines_value[1].push(table_data.Soluble_consumption[j]);
                    lines_value[2].push(table_data.Total_consumption[j]);
                    lines_year.push(table_data.Market_Year[j]);
                    lines_legend = ["Roast Ground consumption", "Soluble consumption", "Total consumption", ""];
                    break;
                case "Import":
                    lines_value[0].push(table_data.Bean_Imports[j]);
                    lines_value[1].push(table_data.Roast_Ground_Imports[j]);
                    lines_value[2].push(table_data.Soluble_Imports[j]);
                    lines_value[3].push(table_data.Total_Imports[j]);
                    lines_year.push(table_data.Market_Year[j]);
                    lines_legend = ["Bean Imports", "Roast Ground Imports", "Soluble Imports", "Total Imports"];
                    break;
                case "Export":
                    lines_value[0].push(table_data.Bean_Exports[j]);
                    lines_value[1].push(table_data.Roast_Ground_Exports[j]);
                    lines_value[2].push(table_data.Soluble_Exports[j]);
                    lines_value[3].push(table_data.Total_Exports[j]);
                    lines_year.push(table_data.Market_Year[j]);
                    lines_legend = ["Bean Exports", "Roast Ground Exports", "Soluble Exports", "Total Exports"];
                    break;
                default:
                    lines_value[0].push(table_data.Arabica_Production[j]);
                    lines_value[1].push(table_data.Robusta_Production[j]);
                    lines_value[2].push(table_data.Other_Production[j]);
                    lines_value[3].push(table_data.Total_Production[j]);
                    lines_year.push(table_data.Market_Year[j]);
                    lines_legend = ["Arabica Production", "Robusta Production", "Other Production", "Total Production"];
                    break;
            }

        }
    };
    //redraw

    myChart.destroy();
    var labels = lines_year;
    var data = {
        labels: labels,
        datasets: [{
            label: lines_legend[0],
            data: lines_value[0],
            fill: false,
            borderColor: 'rgb(255, 60, 60)',
            tension: 0.1
        },
        {
            label: lines_legend[1],
            data: lines_value[1],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        },
        {
            label: lines_legend[2],
            data: lines_value[2],
            fill: false,
            borderColor: 'rgb(75, 192, 45)',
            tension: 0.1
        },
        {
            label: lines_legend[3],
            data: lines_value[3],
            fill: false,
            borderColor: 'rgb(150, 120, 240)',
            tension: 0.1
        }
        ]
    };
    var config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: `${param} of ${country}`,
                    font: {
                        size: 20
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year',
                        font: {
                            size: 20
                        }
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Tons',
                        font: {
                            size: 20
                        }
                    }
                }
            }
        }
    };
    myChart = new Chart(ctx,
        config
    );

};

// update per year chosen
d3.selectAll("#selYear").on("change", yearChanged);
function yearChanged() {

    //get drop down bar chart values
    var year = d3.select("#selYear").property("value");
    var cat = d3.select("#selCat").property("value");
    //get index of category
    var cat_index = cat_ids.indexOf(cat);
    var bar_value = {};
    var bar_value_sorted = [];
    var bar_country_sorted = [];
    //get updated value bar chart
    for (var j = 0; j < total_rows; j++) {
        if (table_data.Market_Year[j] == year) {
            bar_value[`${table_data.Country_Name[j]}`] = table_data[cat_map[cat_index]][j];
        };
    };

    //sort bar value 
    // Create items array
    var items = Object.keys(bar_value).map(function (key) {
        return [key, bar_value[key]];
    });

    // Sort the array based on the second element
    items.sort(function (first, second) {
        return second[1] - first[1];
    });
    //get top 10 countries

    bar_country_sorted = items.slice(0, 10).map(x => x[0]);
    bar_value_sorted = items.slice(0, 10).map(x => x[1]);
    //redraw
    var trace1 = {
        x: bar_value_sorted,
        y: bar_country_sorted,
        type: "bar",
        orientation: "h",
        transforms: [{
            type: 'sort',
            target: 'y',
            order: 'descending'
        }]

    };
    var data = [trace1];
    var layout = {
        title: `<b>Top 10 countries in ${year} on ${cat}</b>`,
        yaxis: {
            automargin: true
        },
        xaxis: {
            title: "Tons"
        }
    };
    var config = { responsive: true }
    Plotly.newPlot("bar", data, layout, config);


    var map_countries = items.map(x => x[0]);
    var map_data = items.map(x => x[1]);


    var mdata = [{
        type: 'choropleth',
        locationmode: 'country names',
        locations: map_countries,
        z: map_data,
        text: map_countries,
        autocolorscale: true
    }];

    var mlayout = {
        title: `${cat} Worldwide in ${year}`,
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 70,
            pad: 2
        },
        geo: {
            projection: {
                type: 'robinson'
            }
        }
    };

    Plotly.newPlot("mymap", mdata, mlayout);
};


// update per category chosen
d3.selectAll("#selCat").on("change", categoryChanged);
function categoryChanged() {

    //get drop down bar chart values
    var year = d3.select("#selYear").property("value");
    var cat = d3.select("#selCat").property("value");
    //get index of category
    var cat_index = cat_ids.indexOf(cat);
    var bar_value = {};
    var bar_value_sorted = [];
    var bar_country_sorted = [];
    //get updated value bar chart
    for (var j = 0; j < total_rows; j++) {
        if (table_data.Market_Year[j] == year) {
            bar_value[`${table_data.Country_Name[j]}`] = table_data[cat_map[cat_index]][j];
        };
    };

    //sort bar value 
    // Create items array
    var items = Object.keys(bar_value).map(function (key) {
        return [key, bar_value[key]];
    });

    // Sort the array based on the second element
    items.sort(function (first, second) {
        return second[1] - first[1];
    });
    //get top 10 countries

    bar_country_sorted = items.slice(0, 10).map(x => x[0]);
    bar_value_sorted = items.slice(0, 10).map(x => x[1]);
    //redraw
    var trace1 = {
        x: bar_value_sorted,
        y: bar_country_sorted,
        type: "bar",
        orientation: "h",
        transforms: [{
            type: 'sort',
            target: 'y',
            order: 'descending'
        }]

    };
    var data = [trace1];
    var layout = {
        title: `<b>Top 10 countries in ${year} on ${cat}</b>`,
        yaxis: {
            automargin: true
        },
        xaxis: {
            title: "Tons"
        }
    };
    var config = { responsive: true }
    Plotly.newPlot("bar", data, layout, config);


    var map_countries = items.map(x => x[0]);
    var map_data = items.map(x => x[1]);
    console.log(map_countries);
    console.log(map_data);

    var mdata = [{
        type: 'choropleth',
        locationmode: 'country names',
        locations: map_countries,
        z: map_data,
        text: map_countries,
        autocolorscale: true
    }];

    var mlayout = {
        title: `${cat} Worldwide in ${year}`,
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 70,
            pad: 2
        },
        geo: {
            projection: {
                type: 'robinson'
            }
        }
    };

    Plotly.newPlot("mymap", mdata, mlayout);
};