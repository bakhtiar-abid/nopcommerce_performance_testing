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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9166666666666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.75, 500, 1500, "SuccessLogin/login?returnurl=%2F-88"], "isController": false}, {"data": [1.0, 500, 1500, "AddProduct/addproducttocart/catalog/34/1/1-144"], "isController": false}, {"data": [1.0, 500, 1500, "AddProduct/addproducttocart/catalog/19/1/1-146"], "isController": false}, {"data": [1.0, 500, 1500, "LoginPage/login-99"], "isController": false}, {"data": [1.0, 500, 1500, "SuccessLogin/login?returnurl=%2F-88-1"], "isController": false}, {"data": [1.0, 500, 1500, "SuccessLogin/login?returnurl=%2F-88-0"], "isController": false}, {"data": [1.0, 500, 1500, "UpdateQTY/shoppingcart/selectshippingoption-220"], "isController": false}, {"data": [0.5, 500, 1500, "Details/iphone-13"], "isController": false}, {"data": [0.875, 500, 1500, "UpdateQTY/cart-226"], "isController": false}, {"data": [0.875, 500, 1500, "Home/-67"], "isController": false}, {"data": [1.0, 500, 1500, "Details/catalog/searchtermautocomplete-52"], "isController": false}, {"data": [0.875, 500, 1500, "Details/search-53"], "isController": false}, {"data": [1.0, 500, 1500, "Details/shoppingcart/productdetails_attributechange?productId=48&validateAttributeConditions=False&loadPicture=True-64"], "isController": false}, {"data": [1.0, 500, 1500, "AddProduct/addproducttocart/details/18/1-143"], "isController": false}, {"data": [0.875, 500, 1500, "UpdateQTY/cart-219"], "isController": false}, {"data": [0.875, 500, 1500, "UpdateQTY/shoppingcart/checkoutattributechange?isEditable=True-228"], "isController": false}, {"data": [1.0, 500, 1500, "UpdateQTY/shoppingcart/selectshippingoption-227"], "isController": false}, {"data": [0.5, 500, 1500, "Details/build-your-own-computer"], "isController": false}, {"data": [0.5, 500, 1500, "Details/xiaomi-amazfit-gts-2-smart-watch"], "isController": false}, {"data": [1.0, 500, 1500, "UpdateQTY/shoppingcart/checkoutattributechange?isEditable=True-221"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 72, 0, 0.0, 403.5277777777778, 281, 1478, 323.5, 642.7, 896.2999999999997, 1478.0, 2.5478608584875615, 17.292852221858524, 3.563300629887823], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["SuccessLogin/login?returnurl=%2F-88", 4, 0, 0.0, 503.75, 300, 722, 496.5, 722.0, 722.0, 722.0, 0.1918925401775006, 2.0090155762772848, 0.3593300251858959], "isController": false}, {"data": ["AddProduct/addproducttocart/catalog/34/1/1-144", 4, 0, 0.0, 333.75, 323, 342, 335.0, 342.0, 342.0, 342.0, 0.20577190184680283, 0.7949547301815937, 0.2817809075826946], "isController": false}, {"data": ["AddProduct/addproducttocart/catalog/19/1/1-146", 4, 0, 0.0, 284.25, 282, 288, 283.5, 288.0, 288.0, 288.0, 0.20638769929312212, 0.24689934729890098, 0.28262417122439504], "isController": false}, {"data": ["LoginPage/login-99", 4, 0, 0.0, 322.75, 307, 347, 318.5, 347.0, 347.0, 347.0, 0.1914425193835551, 1.297798934502728, 0.1491905570977314], "isController": false}, {"data": ["SuccessLogin/login?returnurl=%2F-88-1", 2, 0, 0.0, 399.5, 377, 422, 399.5, 422.0, 422.0, 422.0, 0.14500108750815632, 1.533910430109476, 0.21141271840788808], "isController": false}, {"data": ["SuccessLogin/login?returnurl=%2F-88-0", 2, 0, 0.0, 301.5, 300, 303, 301.5, 303.0, 303.0, 303.0, 0.14624159110851126, 0.2717751444135712, 0.16752088512723018], "isController": false}, {"data": ["UpdateQTY/shoppingcart/selectshippingoption-220", 4, 0, 0.0, 289.5, 281, 303, 287.0, 303.0, 303.0, 303.0, 0.20650490449148168, 0.2569211409395973, 0.30698446373257615], "isController": false}, {"data": ["Details/iphone-13", 1, 0, 0.0, 921.0, 921, 921, 921.0, 921.0, 921.0, 921.0, 1.0857763300760044, 15.859332586862106, 1.4971837676438653], "isController": false}, {"data": ["UpdateQTY/cart-226", 4, 0, 0.0, 434.75, 359, 646, 367.0, 646.0, 646.0, 646.0, 0.20587781151886356, 3.3190760268155852, 0.5036869016676103], "isController": false}, {"data": ["Home/-67", 8, 0, 0.0, 541.7499999999999, 353, 1478, 365.0, 1478.0, 1478.0, 1478.0, 0.34349506225848003, 3.566402895556033, 0.2492351867754401], "isController": false}, {"data": ["Details/catalog/searchtermautocomplete-52", 4, 0, 0.0, 291.25, 287, 296, 291.0, 296.0, 296.0, 296.0, 0.1983143282102132, 0.2912741695587506, 0.2064483143282102], "isController": false}, {"data": ["Details/search-53", 4, 0, 0.0, 426.75, 348, 623, 368.0, 623.0, 623.0, 623.0, 0.19780437147660965, 1.8778859348729107, 0.21267833300365938], "isController": false}, {"data": ["Details/shoppingcart/productdetails_attributechange?productId=48&validateAttributeConditions=False&loadPicture=True-64", 4, 0, 0.0, 286.5, 283, 291, 286.0, 291.0, 291.0, 291.0, 0.20602626834921453, 0.2937483904197785, 0.31753999806850375], "isController": false}, {"data": ["AddProduct/addproducttocart/details/18/1-143", 4, 0, 0.0, 316.0, 307, 326, 315.5, 326.0, 326.0, 326.0, 0.20582484305855717, 0.6999853671400638, 0.2876824283472265], "isController": false}, {"data": ["UpdateQTY/cart-219", 4, 0, 0.0, 437.75, 361, 631, 379.5, 631.0, 631.0, 631.0, 0.20554984583761562, 3.313989433453237, 0.5028845227389517], "isController": false}, {"data": ["UpdateQTY/shoppingcart/checkoutattributechange?isEditable=True-228", 4, 0, 0.0, 452.25, 306, 883, 310.0, 883.0, 883.0, 883.0, 0.2035727009008092, 0.6208569774543233, 0.3064027590462619], "isController": false}, {"data": ["UpdateQTY/shoppingcart/selectshippingoption-227", 4, 0, 0.0, 287.75, 281, 295, 287.5, 295.0, 295.0, 295.0, 0.2098525785635591, 0.261086118251928, 0.31196102316247837], "isController": false}, {"data": ["Details/build-your-own-computer", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 23.87814405487805, 1.398491942508711], "isController": false}, {"data": ["Details/xiaomi-amazfit-gts-2-smart-watch", 2, 0, 0.0, 947.0, 593, 1301, 947.0, 1301.0, 1301.0, 1301.0, 0.09785214540828809, 1.7962653352659133, 0.10826804760506874], "isController": false}, {"data": ["UpdateQTY/shoppingcart/checkoutattributechange?isEditable=True-221", 4, 0, 0.0, 315.25, 304, 327, 315.0, 327.0, 327.0, 327.0, 0.20632382524372003, 0.6292473693712282, 0.31054355044617526], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 72, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
