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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.56235624840276, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0373073803730738, 500, 1500, "Transaction Controller - tasklists"], "isController": true}, {"data": [0.5839328537170264, 500, 1500, "read one tasklist"], "isController": false}, {"data": [0.5644339992166079, 500, 1500, "create tasklist"], "isController": false}, {"data": [0.5361952861952862, 500, 1500, "read all tasks"], "isController": false}, {"data": [0.5550811272416738, 500, 1500, "update task name"], "isController": false}, {"data": [1.0, 500, 1500, "check jmeter variables for tasklist id"], "isController": false}, {"data": [0.2923018292682927, 500, 1500, "read all tasklists"], "isController": false}, {"data": [0.5336538461538461, 500, 1500, "delete task by id"], "isController": false}, {"data": [0.06861888111888112, 500, 1500, "Transaction Controller - tasks"], "isController": true}, {"data": [0.5631753948462178, 500, 1500, "create task"], "isController": false}, {"data": [1.0, 500, 1500, "check jmeter variables for task id"], "isController": false}, {"data": [0.5656446540880503, 500, 1500, "update tasklist name"], "isController": false}, {"data": [0.5297927461139896, 500, 1500, "read one task"], "isController": false}, {"data": [0.5774533657745337, 500, 1500, "delete tasklist by id"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 17188, 0, 0.0, 818.2764719571801, 0, 8894, 781.0, 2018.2000000000007, 2596.0, 4060.9900000000052, 216.7355997175426, 800.9975113566151, 34.35177794862176], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Transaction Controller - tasklists", 1233, 0, 0.0, 5404.490673154912, 294, 17995, 5468.0, 8616.6, 9624.499999999998, 11959.920000000002, 15.57034436601043, 666.8875130818359, 14.909901568557503], "isController": true}, {"data": ["read one tasklist", 1251, 0, 0.0, 925.9032773780975, 2, 8443, 940.0, 1992.7999999999993, 2557.199999999999, 4239.08, 16.040929373749808, 4.650818174751244, 2.1444229601028364], "isController": false}, {"data": ["create tasklist", 2553, 0, 0.0, 966.424990207598, 3, 8004, 943.0, 2090.0, 2699.2999999999997, 4156.200000000001, 32.31359246649031, 9.495845700380979, 7.478829506404495], "isController": false}, {"data": ["read all tasks", 1188, 0, 0.0, 1036.3131313131312, 5, 8681, 980.5, 2250.2000000000003, 2652.2, 4045.6499999999987, 15.248950671955024, 39.423482284967974, 1.921010387384959], "isController": false}, {"data": ["update task name", 1171, 0, 0.0, 988.9487617421, 3, 7393, 951.0, 2162.5999999999995, 2627.199999999998, 4408.879999999993, 15.03518052488316, 4.353216301647322, 4.286911765413949], "isController": false}, {"data": ["check jmeter variables for tasklist id", 2515, 0, 0.0, 0.08588469184890668, 0, 114, 0.0, 0.0, 0.0, 1.0, 31.984840584502294, 10.221099979651791, 0.0], "isController": false}, {"data": ["read all tasklists", 1312, 0, 0.0, 1581.8147865853657, 116, 6747, 1528.5, 2784.2000000000007, 3367.199999999999, 4902.789999999998, 16.623376623376622, 713.6375885928096, 2.159090909090909], "isController": false}, {"data": ["delete task by id", 1144, 0, 0.0, 1039.3951048951044, 3, 6952, 979.5, 2189.0, 2720.5, 4470.449999999991, 14.718748391745148, 2.745391545725902, 3.1258945917605887], "isController": false}, {"data": ["Transaction Controller - tasks", 1144, 0, 0.0, 6050.537587412578, 34, 17608, 6267.0, 9814.5, 10772.25, 13246.449999999975, 14.651639344262295, 66.95996894211066, 18.555250324186733], "isController": true}, {"data": ["create task", 1203, 0, 0.0, 976.8852867830419, 3, 8894, 958.0, 2169.8, 2645.399999999999, 4068.6400000000003, 15.437326763165998, 4.424632152435581, 4.35588379658146], "isController": false}, {"data": ["check jmeter variables for task id", 1188, 0, 0.0, 0.0260942760942761, 0, 1, 0.0, 0.0, 0.0, 1.0, 15.251104036150764, 4.867567814778679, 0.0], "isController": false}, {"data": ["update tasklist name", 1272, 0, 0.0, 961.6297169811313, 3, 7071, 949.0, 2037.7, 2571.3999999999996, 3896.2299999999955, 16.259746900166178, 4.714288995589927, 3.9980765850696662], "isController": false}, {"data": ["read one task", 1158, 0, 0.0, 1068.649395509499, 2, 6767, 974.0, 2334.9000000000015, 2753.999999999999, 4528.910000000029, 14.900981817713895, 4.314276769974136, 1.9277914007308945], "isController": false}, {"data": ["delete tasklist by id", 1233, 0, 0.0, 932.0446066504468, 3, 7068, 928.0, 2090.2000000000003, 2626.6, 4116.620000000004, 15.814383008195776, 2.9497530806302668, 3.4268304218451395], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 17188, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
