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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8142857142857143, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "WishList/cart-91-1"], "isController": false}, {"data": [1.0, 500, 1500, "WishList/cart-91-0"], "isController": false}, {"data": [0.5, 500, 1500, "WishList/cart-91"], "isController": false}, {"data": [0.5, 500, 1500, "SuccessLogin/login?returnurl=%2F-88"], "isController": false}, {"data": [1.0, 500, 1500, "WishList/addproducttocart/catalog/37/2/1-66"], "isController": false}, {"data": [1.0, 500, 1500, "WishList/shoppingcart/selectshippingoption-84"], "isController": false}, {"data": [1.0, 500, 1500, "WishList/onepagecheckout-93"], "isController": false}, {"data": [1.0, 500, 1500, "WishList/checkout/OpcSavePaymentMethod/-106"], "isController": false}, {"data": [1.0, 500, 1500, "WishList/shoppingcart/checkoutattributechange?isEditable=True-85"], "isController": false}, {"data": [0.5, 500, 1500, "WishList/checkout-92"], "isController": false}, {"data": [1.0, 500, 1500, "SuccessLogin/login?returnurl=%2F-88-1"], "isController": false}, {"data": [1.0, 500, 1500, "SuccessLogin/login?returnurl=%2F-88-0"], "isController": false}, {"data": [1.0, 500, 1500, "WishList/logout-114-0"], "isController": false}, {"data": [1.0, 500, 1500, "WishList/country/getstatesbycountryid-98"], "isController": false}, {"data": [1.0, 500, 1500, "WishList/checkout/OpcSaveBilling/-101"], "isController": false}, {"data": [1.0, 500, 1500, "WishList/logout-114-1"], "isController": false}, {"data": [1.0, 500, 1500, "Home/-67"], "isController": false}, {"data": [1.0, 500, 1500, "Details/catalog/searchtermautocomplete-52"], "isController": false}, {"data": [1.0, 500, 1500, "WishList/books-63"], "isController": false}, {"data": [1.0, 500, 1500, "WishList/wishlist-69"], "isController": false}, {"data": [1.0, 500, 1500, "WishList/wishlist/094702b6-884b-4c96-bae3-58c14c7c4058-75"], "isController": false}, {"data": [1.0, 500, 1500, "WishList/checkout/OpcSaveShippingMethod/-103"], "isController": false}, {"data": [1.0, 500, 1500, "WishList/checkout/OpcSavePaymentInfo/-108"], "isController": false}, {"data": [0.5, 500, 1500, "WishList/checkout/OpcConfirmOrder/-109"], "isController": false}, {"data": [0.5, 500, 1500, "WishList/cart-81"], "isController": false}, {"data": [1.0, 500, 1500, "WishList/checkout/completed-110"], "isController": false}, {"data": [0.5, 500, 1500, "LoginPage/login-99"], "isController": false}, {"data": [1.0, 500, 1500, "WishList/checkout-92-0"], "isController": false}, {"data": [0.5, 500, 1500, "WishList/checkout-92-1"], "isController": false}, {"data": [0.5, 500, 1500, "WishList/logout-114"], "isController": false}, {"data": [0.5, 500, 1500, "Details/search-53"], "isController": false}, {"data": [1.0, 500, 1500, "Details/shoppingcart/productdetails_attributechange?productId=48&validateAttributeConditions=False&loadPicture=True-64"], "isController": false}, {"data": [0.0, 500, 1500, "Details/xiaomi-amazfit-gts-2-smart-watch"], "isController": false}, {"data": [0.5, 500, 1500, "WishList/wishlist/094702b6-884b-4c96-bae3-58c14c7c4058-80"], "isController": false}, {"data": [0.5, 500, 1500, "WishList/cart-91-2"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 35, 0, 0.0, 546.5142857142857, 285, 1676, 341.0, 1234.2, 1447.1999999999987, 1676.0, 2.1755345599204374, 15.629249090937344, 3.854653895760815], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WishList/cart-91-1", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 3.251953125, 4.850260416666667], "isController": false}, {"data": ["WishList/cart-91-0", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 3.31763698630137, 9.62181613869863], "isController": false}, {"data": ["WishList/cart-91", 1, 0, 0.0, 1220.0, 1220, 1220, 1220.0, 1220.0, 1220.0, 1220.0, 0.819672131147541, 11.459400614754099, 4.69390368852459], "isController": false}, {"data": ["SuccessLogin/login?returnurl=%2F-88", 1, 0, 0.0, 689.0, 689, 689, 689.0, 689.0, 689.0, 689.0, 1.4513788098693758, 18.1422351233672, 3.807034651669086], "isController": false}, {"data": ["WishList/addproducttocart/catalog/37/2/1-66", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 4.291054428807947, 5.561879139072848], "isController": false}, {"data": ["WishList/shoppingcart/selectshippingoption-84", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 4.365405701754386, 6.40076754385965], "isController": false}, {"data": ["WishList/onepagecheckout-93", 1, 0, 0.0, 339.0, 339, 339, 339.0, 339.0, 339.0, 339.0, 2.949852507374631, 35.360780789085545, 4.191440818584071], "isController": false}, {"data": ["WishList/checkout/OpcSavePaymentMethod/-106", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 6.948741749174918, 5.769131600660066], "isController": false}, {"data": ["WishList/shoppingcart/checkoutattributechange?isEditable=True-85", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 10.330346445686901, 5.887455071884984], "isController": false}, {"data": ["WishList/checkout-92", 1, 0, 0.0, 903.0, 903, 903, 903.0, 903.0, 903.0, 903.0, 1.1074197120708749, 14.333731312292358, 3.1394916251384273], "isController": false}, {"data": ["SuccessLogin/login?returnurl=%2F-88-1", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 27.850020559210527, 3.8908305921052633], "isController": false}, {"data": ["SuccessLogin/login?returnurl=%2F-88-0", 1, 0, 0.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 6.244274226384365, 3.7281148208469057], "isController": false}, {"data": ["WishList/logout-114-0", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 4.550438596491229, 5.657209429824562], "isController": false}, {"data": ["WishList/country/getstatesbycountryid-98", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 18.657124125874127, 4.8725688374125875], "isController": false}, {"data": ["WishList/checkout/OpcSaveBilling/-101", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 10.678150614754099, 7.111296106557377], "isController": false}, {"data": ["WishList/logout-114-1", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 26.944835875331563, 2.6421584880636604], "isController": false}, {"data": ["Home/-67", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 28.420337769541778, 3.5614260444743935], "isController": false}, {"data": ["Details/catalog/searchtermautocomplete-52", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 4.995748299319728, 4.6137595663265305], "isController": false}, {"data": ["WishList/books-63", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 25.56340144230769, 3.48056891025641], "isController": false}, {"data": ["WishList/wishlist-69", 1, 0, 0.0, 340.0, 340, 340, 340.0, 340.0, 340.0, 340.0, 2.941176470588235, 21.854894301470587, 4.161879595588235], "isController": false}, {"data": ["WishList/wishlist/094702b6-884b-4c96-bae3-58c14c7c4058-75", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 21.117806085043988, 4.26422745601173], "isController": false}, {"data": ["WishList/checkout/OpcSaveShippingMethod/-103", 1, 0, 0.0, 342.0, 342, 342, 342.0, 342.0, 342.0, 342.0, 2.923976608187134, 11.153371710526315, 5.094115497076023], "isController": false}, {"data": ["WishList/checkout/OpcSavePaymentInfo/-108", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 41.35027258566978, 5.253967095015576], "isController": false}, {"data": ["WishList/checkout/OpcConfirmOrder/-109", 1, 0, 0.0, 909.0, 909, 909, 909.0, 909.0, 909.0, 909.0, 1.1001100110011, 1.2934887238723871, 2.068077901540154], "isController": false}, {"data": ["WishList/cart-81", 1, 0, 0.0, 1221.0, 1221, 1221, 1221.0, 1221.0, 1221.0, 1221.0, 0.819000819000819, 11.250063984438984, 1.1877111486486485], "isController": false}, {"data": ["WishList/checkout/completed-110", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 20.31818871359223, 5.277862055016182], "isController": false}, {"data": ["LoginPage/login-99", 1, 0, 0.0, 1390.0, 1390, 1390, 1390.0, 1390.0, 1390.0, 1390.0, 0.7194244604316546, 5.0563455485611515, 0.36954811151079137], "isController": false}, {"data": ["WishList/checkout-92-0", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 3.2451406786941583, 4.859321305841925], "isController": false}, {"data": ["WishList/checkout-92-1", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 19.638336231587562, 2.3255293576104745], "isController": false}, {"data": ["WishList/logout-114", 1, 0, 0.0, 663.0, 663, 663, 663.0, 663.0, 663.0, 663.0, 1.5082956259426847, 17.27764423076923, 3.9342359539969833], "isController": false}, {"data": ["Details/search-53", 1, 0, 0.0, 1254.0, 1254, 1254, 1254.0, 1254.0, 1254.0, 1254.0, 0.7974481658692185, 7.744748056220096, 1.108951355661882], "isController": false}, {"data": ["Details/shoppingcart/productdetails_attributechange?productId=48&validateAttributeConditions=False&loadPicture=True-64", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 4.768499163879599, 6.280701295986622], "isController": false}, {"data": ["Details/xiaomi-amazfit-gts-2-smart-watch", 1, 0, 0.0, 1676.0, 1676, 1676, 1676.0, 1676.0, 1676.0, 1676.0, 0.5966587112171838, 11.427995413186158, 0.8483741050119332], "isController": false}, {"data": ["WishList/wishlist/094702b6-884b-4c96-bae3-58c14c7c4058-80", 1, 0, 0.0, 594.0, 594, 594, 594.0, 594.0, 594.0, 594.0, 1.6835016835016834, 15.176175820707071, 3.117108585858586], "isController": false}, {"data": ["WishList/cart-91-2", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 19.227049221246006, 2.3353259784345046], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 35, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
