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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5382424735557364, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03909465020576132, 500, 1500, "Transaction Controller - tasklists"], "isController": true}, {"data": [0.5188679245283019, 500, 1500, "read one tasklist"], "isController": false}, {"data": [0.48327464788732394, 500, 1500, "create tasklist"], "isController": false}, {"data": [0.5129533678756477, 500, 1500, "read all tasks"], "isController": false}, {"data": [0.5165745856353591, 500, 1500, "update task name"], "isController": false}, {"data": [1.0, 500, 1500, "check jmeter variables for tasklist id"], "isController": false}, {"data": [0.22169811320754718, 500, 1500, "read all tasklists"], "isController": false}, {"data": [0.5490196078431373, 500, 1500, "delete task by id"], "isController": false}, {"data": [0.14705882352941177, 500, 1500, "Transaction Controller - tasks"], "isController": true}, {"data": [0.5436893203883495, 500, 1500, "create task"], "isController": false}, {"data": [1.0, 500, 1500, "check jmeter variables for task id"], "isController": false}, {"data": [0.5106382978723404, 500, 1500, "update tasklist name"], "isController": false}, {"data": [0.5363636363636364, 500, 1500, "read one task"], "isController": false}, {"data": [0.5432098765432098, 500, 1500, "delete tasklist by id"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3291, 0, 0.0, 980.4135521118188, 0, 8854, 659.0, 2465.8, 2945.399999999996, 4544.32, 101.97694595934556, 866.262531422363, 16.067890702466535], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Transaction Controller - tasklists", 243, 0, 0.0, 5543.251028806585, 710, 15919, 4682.0, 10520.8, 11643.199999999999, 14832.160000000002, 7.594699337417177, 632.0481832690024, 7.27578129883423], "isController": true}, {"data": ["read one tasklist", 265, 0, 0.0, 1137.8566037735848, 3, 8854, 851.0, 2459.8, 2742.7, 5176.059999999954, 8.57938357938358, 2.4883563701923075, 1.1478276859136234], "isController": false}, {"data": ["create tasklist", 568, 0, 0.0, 1243.3080985915483, 3, 6819, 986.0, 2557.5000000000014, 3388.649999999998, 5364.169999999918, 17.88131591374154, 5.25612899417598, 4.1385467495671335], "isController": false}, {"data": ["read all tasks", 193, 0, 0.0, 1148.259067357513, 11, 4622, 969.0, 2338.2, 3048.7999999999947, 4588.16, 6.247774432682658, 20.293285513984657, 0.787073146304749], "isController": false}, {"data": ["update task name", 181, 0, 0.0, 1115.0607734806629, 4, 4626, 941.0, 2442.800000000001, 2728.6000000000004, 4230.760000000003, 5.940464078243461, 1.7229666320686599, 1.6997616942630214], "isController": false}, {"data": ["check jmeter variables for tasklist id", 524, 0, 0.0, 0.06870229007633591, 0, 4, 0.0, 0.0, 1.0, 1.0, 17.987710686210566, 5.756224307867907, 0.0], "isController": false}, {"data": ["read all tasklists", 318, 0, 0.0, 1999.7106918238987, 601, 7639, 1709.0, 3348.1, 3692.65, 4977.17, 9.925403414588471, 828.3872536205873, 1.289139310683854], "isController": false}, {"data": ["delete task by id", 153, 0, 0.0, 1122.5490196078438, 3, 6640, 908.0, 2571.2, 3410.699999999991, 6513.100000000002, 4.981603881092697, 0.929185880164751, 1.06053676374825], "isController": false}, {"data": ["Transaction Controller - tasks", 153, 0, 0.0, 5240.235294117647, 36, 16286, 4544.0, 10803.0, 12275.399999999994, 14730.800000000023, 4.956107673868679, 25.06372283048816, 6.287093621440834], "isController": true}, {"data": ["create task", 206, 0, 0.0, 1052.849514563107, 3, 6671, 855.0, 2389.9, 2751.7, 4537.080000000001, 6.668393111485174, 1.9145581784928136, 1.88199766525314], "isController": false}, {"data": ["check jmeter variables for task id", 193, 0, 0.0, 0.06735751295336788, 0, 1, 0.0, 0.0, 1.0, 1.0, 6.773831250877439, 2.1685774735013337, 0.0], "isController": false}, {"data": ["update tasklist name", 282, 0, 0.0, 1171.2730496453898, 4, 6665, 871.0, 2535.3, 3516.1499999999924, 4676.720000000002, 9.11854103343465, 2.644733092705167, 2.2440159574468086], "isController": false}, {"data": ["read one task", 165, 0, 0.0, 1098.757575757576, 3, 4662, 864.0, 2390.8, 3122.999999999995, 4359.720000000001, 5.34794023271643, 1.551111571403105, 0.6946055185071144], "isController": false}, {"data": ["delete tasklist by id", 243, 0, 0.0, 1066.5925925925922, 4, 6403, 902.0, 2357.2, 2688.6, 4522.8, 7.861279156287406, 1.4663128113778265, 1.704300754585746], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3291, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
