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

    var data = {"OkPercent": 99.96138623419249, "KoPercent": 0.03861376580751038};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3218682114409848, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0048828125, 500, 1500, "Transaction Controller - tasklists"], "isController": true}, {"data": [0.20346598202824134, 500, 1500, "read one tasklist"], "isController": false}, {"data": [0.2012310606060606, 500, 1500, "create tasklist"], "isController": false}, {"data": [0.18692579505300352, 500, 1500, "read all tasks"], "isController": false}, {"data": [0.16826215022091312, 500, 1500, "update task name"], "isController": false}, {"data": [1.0, 500, 1500, "check jmeter variables for tasklist id"], "isController": false}, {"data": [0.1417636252296387, 500, 1500, "read all tasklists"], "isController": false}, {"data": [0.13777596075224857, 500, 1500, "delete task by id"], "isController": false}, {"data": [0.008176614881439084, 500, 1500, "Transaction Controller - tasks"], "isController": true}, {"data": [0.1781056966369252, 500, 1500, "create task"], "isController": false}, {"data": [1.0, 500, 1500, "check jmeter variables for task id"], "isController": false}, {"data": [0.26410906785034877, 500, 1500, "update tasklist name"], "isController": false}, {"data": [0.15605590062111802, 500, 1500, "read one task"], "isController": false}, {"data": [0.20149739583333334, 500, 1500, "delete tasklist by id"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 20718, 8, 0.03861376580751038, 1832.6124143257077, 0, 10498, 1863.5, 3931.0, 4516.0, 5844.970000000005, 232.33229416646108, 818.1127648789164, 36.70380817979456], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Transaction Controller - tasklists", 1536, 5, 0.3255208333333333, 11498.765624999982, 454, 23403, 12001.5, 17029.899999999998, 18333.45, 20612.499999999993, 17.205264631755814, 619.6468951274153, 16.451361663399606], "isController": true}, {"data": ["read one tasklist", 1558, 1, 0.06418485237483953, 2268.5539152759925, 2, 10312, 2198.0, 4007.2000000000003, 4521.449999999998, 6082.840000000002, 18.054139241679803, 5.228280424353388, 2.4073211678409194], "isController": false}, {"data": ["create tasklist", 3168, 0, 0.0, 2245.683396464648, 2, 8660, 2159.0, 3994.2, 4515.0, 5774.539999999998, 35.68853640951694, 10.478299559666771, 8.259944461968276], "isController": false}, {"data": ["read all tasks", 1415, 1, 0.0706713780918728, 2336.944876325093, 6, 10418, 2297.0, 4024.600000000001, 4671.6, 6097.359999999998, 16.487998135632722, 97.75217661238639, 2.077101327633419], "isController": false}, {"data": ["update task name", 1358, 0, 0.0, 2402.0810014727554, 4, 8660, 2267.5, 4141.4000000000015, 4773.25, 6283.960000000013, 15.82971977432741, 4.57863561555812, 4.50419930526414], "isController": false}, {"data": ["check jmeter variables for tasklist id", 3090, 0, 0.0, 0.305501618122977, 0, 162, 0.0, 0.0, 0.0, 1.0, 35.29734298965068, 11.281950735075736, 0.0], "isController": false}, {"data": ["read all tasklists", 1633, 2, 0.1224739742804654, 2761.5707287201444, 27, 9336, 2733.0, 4716.0, 5338.599999999999, 6603.720000000016, 18.568423446472227, 677.5920519394224, 2.4117190609187564], "isController": false}, {"data": ["delete task by id", 1223, 1, 0.08176614881439084, 2503.9345870809493, 3, 10215, 2469.0, 4107.6, 4485.4, 5740.879999999999, 14.275875754356885, 2.662785419025552, 3.026581140056497], "isController": false}, {"data": ["Transaction Controller - tasks", 1223, 3, 0.24529844644317253, 13996.336058871615, 48, 27607, 14534.0, 19779.40000000001, 21253.6, 24337.6, 14.215310226189645, 110.61796789641303, 17.97822118290443], "isController": true}, {"data": ["create task", 1457, 0, 0.0, 2322.866849691149, 3, 8856, 2263.0, 3997.2, 4586.799999999999, 6139.2800000000025, 16.949744067007913, 4.853854172725686, 4.779248705793393], "isController": false}, {"data": ["check jmeter variables for task id", 1415, 0, 0.0, 0.022614840989399282, 0, 1, 0.0, 0.0, 0.0, 1.0, 16.493956101598105, 5.264938723204606, 0.0], "isController": false}, {"data": ["update tasklist name", 1577, 0, 0.0, 1994.4584654407076, 3, 8878, 1765.0, 3857.6000000000004, 4558.5, 6154.4000000000015, 18.178674351585013, 5.26444299351585, 4.457492795389049], "isController": false}, {"data": ["read one task", 1288, 1, 0.07763975155279502, 2430.5892857142853, 2, 9079, 2335.0, 4196.800000000003, 4799.449999999999, 6139.649999999999, 15.023211328061212, 4.344708724805795, 1.9386475355459911], "isController": false}, {"data": ["delete tasklist by id", 1536, 2, 0.13020833333333334, 2289.921223958334, 3, 10498, 2234.5, 4098.299999999999, 4540.599999999999, 5793.569999999983, 17.804567056914337, 3.3209690506549205, 3.851846854352614], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 9,336 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 12.5, 0.004826720725938797], "isController": false}, {"data": ["The operation lasted too long: It took 9,279 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 12.5, 0.004826720725938797], "isController": false}, {"data": ["The operation lasted too long: It took 9,019 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 12.5, 0.004826720725938797], "isController": false}, {"data": ["The operation lasted too long: It took 10,418 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 12.5, 0.004826720725938797], "isController": false}, {"data": ["The operation lasted too long: It took 10,312 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 12.5, 0.004826720725938797], "isController": false}, {"data": ["The operation lasted too long: It took 10,215 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 12.5, 0.004826720725938797], "isController": false}, {"data": ["The operation lasted too long: It took 10,498 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 12.5, 0.004826720725938797], "isController": false}, {"data": ["The operation lasted too long: It took 9,079 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 12.5, 0.004826720725938797], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 20718, 8, "The operation lasted too long: It took 9,336 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,279 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,019 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 10,418 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 10,312 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["read one tasklist", 1558, 1, "The operation lasted too long: It took 10,312 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["read all tasks", 1415, 1, "The operation lasted too long: It took 10,418 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["read all tasklists", 1633, 2, "The operation lasted too long: It took 9,336 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,019 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, null, null, null, null, null, null], "isController": false}, {"data": ["delete task by id", 1223, 1, "The operation lasted too long: It took 10,215 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["read one task", 1288, 1, "The operation lasted too long: It took 9,079 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["delete tasklist by id", 1536, 2, "The operation lasted too long: It took 9,279 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 10,498 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
