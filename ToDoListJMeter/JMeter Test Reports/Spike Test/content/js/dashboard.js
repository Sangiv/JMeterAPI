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

    var data = {"OkPercent": 91.83572488866898, "KoPercent": 8.164275111331024};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2706376668314385, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Transaction Controller - tasklists"], "isController": true}, {"data": [0.2857142857142857, 500, 1500, "read one tasklist"], "isController": false}, {"data": [0.011, 500, 1500, "create tasklist"], "isController": false}, {"data": [0.1346153846153846, 500, 1500, "update tasklist name"], "isController": false}, {"data": [1.0, 500, 1500, "check jmeter variables for tasklist id"], "isController": false}, {"data": [0.09895833333333333, 500, 1500, "read all tasklists"], "isController": false}, {"data": [0.0, 500, 1500, "delete tasklist by id"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2021, 165, 8.164275111331024, 4955.628896585856, 0, 17955, 3967.0, 11467.4, 13008.699999999999, 14643.899999999998, 95.64147461076145, 709.3818675021296, 14.56843988098055], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Transaction Controller - tasklists", 2, 0, 0.0, 9902.5, 6974, 12831, 9902.5, 12831.0, 12831.0, 12831.0, 0.1558724962980282, 1.705844853285013, 0.14871819226872418], "isController": true}, {"data": ["read one tasklist", 7, 4, 57.142857142857146, 9252.571428571428, 5, 13858, 12701.0, 13858.0, 13858.0, 13858.0, 0.45898629598059143, 0.13267572618188972, 0.0609591174349223], "isController": false}, {"data": ["create tasklist", 1000, 22, 2.2, 5516.352, 1398, 17955, 4878.0, 9637.8, 10092.249999999998, 13999.640000000001, 47.82400765184122, 14.005942506575801, 11.068642395982783], "isController": false}, {"data": ["update tasklist name", 52, 14, 26.923076923076923, 7724.615384615385, 8, 13792, 9268.5, 13151.9, 13538.499999999998, 13792.0, 3.199803089040674, 0.9249430804258199, 0.7812019260353208], "isController": false}, {"data": ["check jmeter variables for tasklist id", 480, 0, 0.0, 0.07083333333333335, 0, 2, 0.0, 0.0, 1.0, 1.0, 82.48840006874033, 26.310966768345075, 0.0], "isController": false}, {"data": ["read all tasklists", 480, 125, 26.041666666666668, 8379.249999999996, 142, 17396, 8598.5, 13602.2, 13905.7, 15767.39, 26.135249918327343, 790.9480961763585, 3.3945197647827507], "isController": false}, {"data": ["delete tasklist by id", 2, 0, 0.0, 5226.0, 2352, 8100, 5226.0, 8100.0, 8100.0, 8100.0, 0.2469135802469136, 0.04605516975308642, 0.05328896604938272], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 12,013 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 17,578 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,603 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,972 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,416 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 2, 1.2121212121212122, 0.09896091044037605], "isController": false}, {"data": ["The operation lasted too long: It took 13,336 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,160 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,487 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 17,955 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,519 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,124 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,078 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 15,995 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,045 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,116 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 14,601 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,329 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,598 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 14,050 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,940 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,189 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,666 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 15,437 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,273 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 14,012 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,900 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,310 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,338 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,010 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 15,997 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 14,671 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,153 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 16,263 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 14,028 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,416 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,999 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,193 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,444 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,192 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 16,687 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,595 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,822 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,715 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 17,396 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 15,265 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,523 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 15,151 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,714 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 2, 1.2121212121212122, 0.09896091044037605], "isController": false}, {"data": ["The operation lasted too long: It took 12,338 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,038 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,761 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,706 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,847 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,977 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 14,001 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,627 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,230 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,223 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,865 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,502 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,398 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,672 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,074 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,631 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,898 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,009 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,160 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,322 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,854 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,264 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,766 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,719 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,299 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,121 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,997 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,227 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,737 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,475 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,371 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,201 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 15,252 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 15,618 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,508 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,467 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,472 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,175 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,686 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,701 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,851 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,623 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,732 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,796 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,019 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,850 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,206 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,254 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,725 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,978 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 14,771 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,538 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,780 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,251 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,803 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,498 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,814 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,917 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,212 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,586 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,771 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,222 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 16,581 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,471 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,539 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,788 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,514 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,906 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 15,132 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,443 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,841 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,290 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 14,773 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,677 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 14,065 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 15,714 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,795 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 14,656 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,054 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,749 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,204 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 14,753 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,529 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,166 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,976 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 2, 1.2121212121212122, 0.09896091044037605], "isController": false}, {"data": ["The operation lasted too long: It took 13,858 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,496 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,121 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,133 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,864 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,200 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,510 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,015 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,605 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,333 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,511 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,792 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,556 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,149 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 14,080 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,273 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,698 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 2, 1.2121212121212122, 0.09896091044037605], "isController": false}, {"data": ["The operation lasted too long: It took 13,986 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,176 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,756 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,265 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,871 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,807 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,957 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,668 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,034 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 13,765 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}, {"data": ["The operation lasted too long: It took 12,721 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, 0.6060606060606061, 0.04948045522018803], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2021, 165, "The operation lasted too long: It took 12,416 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 2, "The operation lasted too long: It took 13,714 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 2, "The operation lasted too long: It took 12,976 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 2, "The operation lasted too long: It took 12,698 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 2, "The operation lasted too long: It took 12,013 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["read one tasklist", 7, 4, "The operation lasted too long: It took 13,788 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, "The operation lasted too long: It took 13,858 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, "The operation lasted too long: It took 12,701 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, "The operation lasted too long: It took 13,121 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, null, null], "isController": false}, {"data": ["create tasklist", 1000, 22, "The operation lasted too long: It took 12,013 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, "The operation lasted too long: It took 14,001 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, "The operation lasted too long: It took 17,578 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, "The operation lasted too long: It took 12,230 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, "The operation lasted too long: It took 12,015 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1], "isController": false}, {"data": ["update tasklist name", 52, 14, "The operation lasted too long: It took 13,160 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, "The operation lasted too long: It took 13,766 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, "The operation lasted too long: It took 13,054 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, "The operation lasted too long: It took 13,212 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, "The operation lasted too long: It took 13,792 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": ["read all tasklists", 480, 125, "The operation lasted too long: It took 12,416 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 2, "The operation lasted too long: It took 13,714 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 2, "The operation lasted too long: It took 12,698 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 2, "The operation lasted too long: It took 13,603 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1, "The operation lasted too long: It took 13,972 milliseconds, but should not have lasted longer than 12,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
