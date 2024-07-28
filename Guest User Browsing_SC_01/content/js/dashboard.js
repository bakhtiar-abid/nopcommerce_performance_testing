/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7666666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8, 500, 1500, "Catalog/shoes-105"], "isController": false}, {"data": [1.0, 500, 1500, "Catalog/computers-157"], "isController": false}, {"data": [1.0, 500, 1500, "Catalog/notebooks-165"], "isController": false}, {"data": [0.5, 500, 1500, "Products/build-your-own-computer-16"], "isController": false}, {"data": [0.5, 500, 1500, "Catalog/apple-macbook-pro-13-inch-176"], "isController": false}, {"data": [0.5, 500, 1500, "Products/apple-icam-72"], "isController": false}, {"data": [1.0, 500, 1500, "Products/-59"], "isController": false}, {"data": [1.0, 500, 1500, "Products/-10"], "isController": false}, {"data": [1.0, 500, 1500, "Catalog/-83"], "isController": false}, {"data": [0.4, 500, 1500, "Home/-4"], "isController": false}, {"data": [0.5, 500, 1500, "Products/25-virtual-gift-card-63"], "isController": false}, {"data": [1.0, 500, 1500, "Catalog/apparel-91"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 60, 0, 0.0, 539.9000000000001, 330, 1533, 396.5, 1158.3, 1194.3999999999999, 1533.0, 4.343419719125525, 44.378099210945415, 3.3264911276603444], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Catalog/shoes-105", 5, 0, 0.0, 550.0, 345, 1134, 359.0, 1134.0, 1134.0, 1134.0, 0.7269555103227683, 6.786101292163419, 0.5906513521372492], "isController": false}, {"data": ["Catalog/computers-157", 5, 0, 0.0, 381.6, 344, 469, 346.0, 469.0, 469.0, 469.0, 0.8210180623973727, 6.061101703612479, 0.6983464183087028], "isController": false}, {"data": ["Catalog/notebooks-165", 5, 0, 0.0, 387.4, 360, 430, 388.0, 430.0, 430.0, 430.0, 0.8259002312520648, 7.9625170341922695, 0.6758831970597952], "isController": false}, {"data": ["Products/build-your-own-computer-16", 5, 0, 0.0, 705.4, 546, 1275, 564.0, 1275.0, 1275.0, 1275.0, 0.616827041697508, 8.449446204971625, 0.4831008666419936], "isController": false}, {"data": ["Catalog/apple-macbook-pro-13-inch-176", 5, 0, 0.0, 602.8, 572, 664, 572.0, 664.0, 664.0, 664.0, 0.8069722401549386, 9.124145113783086, 0.6730022393479664], "isController": false}, {"data": ["Products/apple-icam-72", 5, 0, 0.0, 577.6, 566, 596, 572.0, 596.0, 596.0, 596.0, 0.694058856191005, 9.5217554917407, 0.5727341147279289], "isController": false}, {"data": ["Products/-59", 5, 0, 0.0, 363.0, 348, 389, 355.0, 389.0, 389.0, 389.0, 0.6963788300835655, 7.073277550487465, 0.5161636055013927], "isController": false}, {"data": ["Products/-10", 5, 0, 0.0, 362.4, 353, 373, 364.0, 373.0, 373.0, 373.0, 0.6310740880979427, 6.411441570427868, 0.44865423450713116], "isController": false}, {"data": ["Catalog/-83", 5, 0, 0.0, 360.8, 344, 377, 362.0, 377.0, 377.0, 377.0, 0.719320961012804, 7.305182033160697, 0.540193182635592], "isController": false}, {"data": ["Home/-4", 5, 0, 0.0, 1247.2, 1161, 1533, 1183.0, 1533.0, 1533.0, 1533.0, 0.5498735290883097, 5.725558121632025, 0.2448655559221379], "isController": false}, {"data": ["Products/25-virtual-gift-card-63", 5, 0, 0.0, 591.8, 553, 731, 558.0, 731.0, 731.0, 731.0, 0.678886625933469, 6.28354654616429, 0.5502694331296674], "isController": false}, {"data": ["Catalog/apparel-91", 5, 0, 0.0, 348.8, 330, 387, 339.0, 387.0, 387.0, 387.0, 0.7240081088908196, 5.346771602591949, 0.5847213926295974], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 60, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
