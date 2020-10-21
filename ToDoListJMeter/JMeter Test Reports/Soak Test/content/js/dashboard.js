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

    var data = {"OkPercent": 99.92897390974952, "KoPercent": 0.07102609025048534};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2837753184380873, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0016191709844559584, 500, 1500, "Transaction Controller - tasklists"], "isController": true}, {"data": [0.14850223072020396, 500, 1500, "read one tasklist"], "isController": false}, {"data": [0.14170542635658914, 500, 1500, "create tasklist"], "isController": false}, {"data": [0.11738227146814405, 500, 1500, "read all tasks"], "isController": false}, {"data": [0.13354700854700854, 500, 1500, "update task name"], "isController": false}, {"data": [1.0, 500, 1500, "check jmeter variables for tasklist id"], "isController": false}, {"data": [0.09393939393939393, 500, 1500, "read all tasklists"], "isController": false}, {"data": [0.09009360374414976, 500, 1500, "delete task by id"], "isController": false}, {"data": [3.90015600624025E-4, 500, 1500, "Transaction Controller - tasks"], "isController": true}, {"data": [0.1315077755240027, 500, 1500, "create task"], "isController": false}, {"data": [1.0, 500, 1500, "check jmeter variables for task id"], "isController": false}, {"data": [0.21664588528678305, 500, 1500, "update tasklist name"], "isController": false}, {"data": [0.10817843866171004, 500, 1500, "read one task"], "isController": false}, {"data": [0.13860103626943004, 500, 1500, "delete tasklist by id"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 21119, 15, 0.07102609025048534, 2047.922913016714, 0, 10589, 2141.5, 4118.9000000000015, 4831.0, 6341.710000000046, 226.95180269732953, 813.8590857725269, 35.907758684380205], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Transaction Controller - tasklists", 1544, 7, 0.4533678756476684, 13013.711787564775, 1294, 26686, 13212.0, 18395.0, 19826.0, 22028.1, 16.62950876172628, 600.4437660209808, 15.90288492089136], "isController": true}, {"data": ["read one tasklist", 1569, 0, 0.0, 2530.7444231994973, 2, 7805, 2476.0, 4329.0, 4847.0, 6333.9999999999945, 17.441472687254052, 5.051402460036906, 2.3261723526534603], "isController": false}, {"data": ["create tasklist", 3225, 4, 0.12403100775193798, 2573.1606201550417, 3, 10353, 2462.0, 4363.8, 4955.0, 6490.48, 34.863357260226586, 10.236233872319035, 8.068960615892285], "isController": false}, {"data": ["read all tasks", 1444, 1, 0.06925207756232687, 2564.97922437673, 6, 9528, 2486.5, 4056.0, 4798.25, 6031.55, 16.200327596652233, 107.93474177572531, 2.040861582000135], "isController": false}, {"data": ["update task name", 1404, 2, 0.14245014245014245, 2545.8169515669524, 3, 10214, 2444.5, 4164.5, 4906.75, 6177.750000000001, 15.790006410472689, 4.567560635902021, 4.493722903100644], "isController": false}, {"data": ["check jmeter variables for tasklist id", 3129, 0, 0.0, 0.10450623202301028, 0, 211, 0.0, 0.0, 0.0, 1.0, 35.84356671554252, 11.457012545677923, 0.0], "isController": false}, {"data": ["read all tasklists", 1650, 2, 0.12121212121212122, 3204.140606060608, 34, 9795, 3115.0, 5225.000000000003, 5880.45, 7819.84, 18.052713924660008, 667.842746416126, 2.344737257792755], "isController": false}, {"data": ["delete task by id", 1282, 2, 0.15600624024961, 2817.2480499219964, 3, 10138, 2694.0, 4461.7, 5077.7, 6831.190000000015, 14.549333817554531, 2.7137917569852688, 3.085147951091767], "isController": false}, {"data": ["Transaction Controller - tasks", 1282, 7, 0.5460218408736349, 15155.033541341663, 865, 27961, 15038.5, 20890.3, 22557.6, 25453.83000000003, 14.323542227634828, 120.78220972690859, 18.117147609577334], "isController": true}, {"data": ["create task", 1479, 1, 0.0676132521974307, 2511.791075050709, 3, 10352, 2435.0, 3964.0, 4815.0, 6276.200000000003, 16.525508949920667, 4.732549452920735, 4.6592019688987465], "isController": false}, {"data": ["check jmeter variables for task id", 1444, 0, 0.0, 0.026315789473684157, 0, 1, 0.0, 0.0, 0.0, 1.0, 16.94139731331026, 5.40851900261043, 0.0], "isController": false}, {"data": ["update tasklist name", 1604, 2, 0.12468827930174564, 2272.443890274316, 3, 9550, 2041.0, 4074.5, 4831.0, 6420.6, 17.811535301041598, 5.158742861921736, 4.368711238534657], "isController": false}, {"data": ["read one task", 1345, 1, 0.07434944237918216, 2647.8364312267654, 2, 10589, 2619.0, 4056.4, 4807.4000000000015, 5758.639999999998, 15.171340266654635, 4.388087219696799, 1.9583022551153926], "isController": false}, {"data": ["delete tasklist by id", 1544, 0, 0.0, 2514.6101036269456, 3, 8635, 2427.5, 4114.0, 4763.75, 6200.299999999997, 17.167572856555147, 3.20215470273636, 3.7145685139319746], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 10,138 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 6.666666666666667, 0.0047350726833656894], "isController": false}, {"data": ["The operation lasted too long: It took 9,795 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 6.666666666666667, 0.0047350726833656894], "isController": false}, {"data": ["The operation lasted too long: It took 9,799 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 6.666666666666667, 0.0047350726833656894], "isController": false}, {"data": ["The operation lasted too long: It took 9,150 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 6.666666666666667, 0.0047350726833656894], "isController": false}, {"data": ["The operation lasted too long: It took 9,528 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 6.666666666666667, 0.0047350726833656894], "isController": false}, {"data": ["The operation lasted too long: It took 9,110 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 6.666666666666667, 0.0047350726833656894], "isController": false}, {"data": ["The operation lasted too long: It took 10,214 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 6.666666666666667, 0.0047350726833656894], "isController": false}, {"data": ["The operation lasted too long: It took 10,353 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 6.666666666666667, 0.0047350726833656894], "isController": false}, {"data": ["The operation lasted too long: It took 9,244 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 6.666666666666667, 0.0047350726833656894], "isController": false}, {"data": ["The operation lasted too long: It took 10,589 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 6.666666666666667, 0.0047350726833656894], "isController": false}, {"data": ["The operation lasted too long: It took 9,178 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 6.666666666666667, 0.0047350726833656894], "isController": false}, {"data": ["The operation lasted too long: It took 10,352 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 6.666666666666667, 0.0047350726833656894], "isController": false}, {"data": ["The operation lasted too long: It took 9,550 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 6.666666666666667, 0.0047350726833656894], "isController": false}, {"data": ["The operation lasted too long: It took 9,569 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 6.666666666666667, 0.0047350726833656894], "isController": false}, {"data": ["The operation lasted too long: It took 9,572 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 6.666666666666667, 0.0047350726833656894], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 21119, 15, "The operation lasted too long: It took 10,138 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,795 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,799 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,150 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,528 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["create tasklist", 3225, 4, "The operation lasted too long: It took 9,244 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,110 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 10,353 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,569 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, null, null], "isController": false}, {"data": ["read all tasks", 1444, 1, "The operation lasted too long: It took 9,528 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["update task name", 1404, 2, "The operation lasted too long: It took 9,799 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 10,214 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["read all tasklists", 1650, 2, "The operation lasted too long: It took 9,795 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,572 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, null, null, null, null, null, null], "isController": false}, {"data": ["delete task by id", 1282, 2, "The operation lasted too long: It took 10,138 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,150 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["create task", 1479, 1, "The operation lasted too long: It took 10,352 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["update tasklist name", 1604, 2, "The operation lasted too long: It took 9,178 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,550 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, null, null, null, null, null, null], "isController": false}, {"data": ["read one task", 1345, 1, "The operation lasted too long: It took 10,589 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
