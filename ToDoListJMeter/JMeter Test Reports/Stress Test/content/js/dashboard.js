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

    var data = {"OkPercent": 98.67540983606557, "KoPercent": 1.3245901639344262};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.38868329951056463, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.016605166051660517, 500, 1500, "Transaction Controller - tasklists"], "isController": true}, {"data": [0.3088923556942278, 500, 1500, "read one tasklist"], "isController": false}, {"data": [0.2400241837968561, 500, 1500, "create tasklist"], "isController": false}, {"data": [0.30505952380952384, 500, 1500, "read all tasks"], "isController": false}, {"data": [0.25435540069686413, 500, 1500, "update task name"], "isController": false}, {"data": [1.0, 500, 1500, "check jmeter variables for tasklist id"], "isController": false}, {"data": [0.20869565217391303, 500, 1500, "read all tasklists"], "isController": false}, {"data": [0.2261904761904762, 500, 1500, "delete task by id"], "isController": false}, {"data": [0.02142857142857143, 500, 1500, "Transaction Controller - tasks"], "isController": true}, {"data": [0.2824427480916031, 500, 1500, "create task"], "isController": false}, {"data": [1.0, 500, 1500, "check jmeter variables for task id"], "isController": false}, {"data": [0.3360323886639676, 500, 1500, "update tasklist name"], "isController": false}, {"data": [0.24801587301587302, 500, 1500, "read one task"], "isController": false}, {"data": [0.29704797047970477, 500, 1500, "delete tasklist by id"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 7625, 101, 1.3245901639344262, 2436.3022950819704, 0, 12356, 1404.0, 6963.0, 7963.7, 9505.74, 208.43014514938633, 660.2381752197059, 32.695156604502095], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Transaction Controller - tasklists", 542, 7, 1.2915129151291513, 9588.226937269374, 325, 25703, 8505.5, 18283.9, 20476.35, 23138.120000000006, 14.799442972995113, 222.7236598244273, 14.108972247631272], "isController": true}, {"data": ["read one tasklist", 641, 11, 1.71606864274571, 2904.9141965678623, 2, 10497, 2219.0, 7467.600000000007, 7938.099999999999, 9559.720000000001, 18.944879562583125, 5.473570036574553, 2.51343260492094], "isController": false}, {"data": ["create tasklist", 1654, 35, 2.1160822249093107, 3431.9492140266043, 3, 11579, 2762.0, 7823.5, 8060.5, 9625.45, 45.4770415177344, 13.338039378265055, 10.525448085647513], "isController": false}, {"data": ["read all tasks", 336, 5, 1.4880952380952381, 2764.291666666667, 7, 9794, 2044.0, 6932.0, 8016.799999999999, 9571.53, 10.405053883314752, 39.57240401066827, 1.3107929208472686], "isController": false}, {"data": ["update task name", 287, 4, 1.3937282229965158, 2943.0418118466896, 4, 9830, 2038.0, 7337.2, 7984.2, 9559.84, 8.898948869802487, 2.5690821602430933, 2.522360014030573], "isController": false}, {"data": ["check jmeter variables for tasklist id", 1313, 0, 0.0, 0.255902513328256, 0, 250, 0.0, 0.0, 1.0, 1.0, 49.13002806361085, 15.69011634705332, 0.0], "isController": false}, {"data": ["read all tasklists", 920, 15, 1.6304347826086956, 3537.7532608695637, 21, 12356, 2827.5, 8141.9, 8436.449999999999, 10091.07, 26.296984421895097, 601.8722309561241, 3.415526296984422], "isController": false}, {"data": ["delete task by id", 210, 4, 1.9047619047619047, 3133.4619047619044, 3, 9769, 2695.5, 7036.700000000001, 8021.4, 9715.179999999998, 6.538796861377506, 1.2196388676983436, 1.3823790127973596], "isController": false}, {"data": ["Transaction Controller - tasks", 210, 4, 1.9047619047619047, 10698.180952380946, 359, 27913, 9915.5, 19854.800000000003, 23015.549999999992, 26417.099999999984, 6.3725192692844566, 31.86597463509741, 8.04000107156946], "isController": true}, {"data": ["create task", 393, 8, 2.035623409669211, 2927.0025445292613, 3, 10733, 2194.0, 7115.200000000001, 7918.9, 9633.22, 11.976230382447053, 3.4235784416425417, 3.3706955660521105], "isController": false}, {"data": ["check jmeter variables for task id", 336, 0, 0.0, 0.068452380952381, 0, 1, 0.0, 0.0, 1.0, 1.0, 13.840260328706183, 4.413658632656424, 0.0], "isController": false}, {"data": ["update tasklist name", 741, 8, 1.0796221322537112, 2485.0620782726037, 3, 11211, 1639.0, 6264.400000000001, 7675.0, 9306.920000000016, 21.73849268049403, 6.28232193541526, 5.3043269794936485], "isController": false}, {"data": ["read one task", 252, 4, 1.5873015873015872, 3084.3968253968255, 3, 9871, 2538.5, 7569.900000000001, 7885.2, 9598.66, 7.838989641335116, 2.2626771160605967, 1.0072139313155193], "isController": false}, {"data": ["delete tasklist by id", 542, 7, 1.2915129151291513, 2920.158671586715, 3, 9557, 2274.0, 6914.2, 7887.5, 9076.400000000001, 16.10794103661436, 3.0045085331966237, 3.47337346387601], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 11,211 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,909 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,983 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,660 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 10,785 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,641 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,485 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 11,423 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 10,265 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 10,205 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,600 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,054 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 2, 1.9801980198019802, 0.02622950819672131], "isController": false}, {"data": ["The operation lasted too long: It took 9,061 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,090 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,723 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 2, 1.9801980198019802, 0.02622950819672131], "isController": false}, {"data": ["The operation lasted too long: It took 9,067 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 10,154 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,540 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,627 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,646 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 2, 1.9801980198019802, 0.02622950819672131], "isController": false}, {"data": ["The operation lasted too long: It took 9,437 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,932 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 10,065 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 11,220 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 10,497 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,735 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,552 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 2, 1.9801980198019802, 0.02622950819672131], "isController": false}, {"data": ["The operation lasted too long: It took 11,182 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,574 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 12,356 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,720 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,628 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,610 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 2, 1.9801980198019802, 0.02622950819672131], "isController": false}, {"data": ["The operation lasted too long: It took 9,665 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,506 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,036 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,553 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,058 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,416 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 10,359 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,580 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,085 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 10,009 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 10,731 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,618 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,644 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,048 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,040 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 10,135 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,051 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 11,579 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,026 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,104 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,598 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,722 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 2, 1.9801980198019802, 0.02622950819672131], "isController": false}, {"data": ["The operation lasted too long: It took 9,537 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,946 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,515 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 11,713 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,626 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,648 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,544 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,065 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,871 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,050 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,056 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,616 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 10,098 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 10,733 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,794 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,491 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,609 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,505 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,068 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,563 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,724 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,055 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,747 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 2, 1.9801980198019802, 0.02622950819672131], "isController": false}, {"data": ["The operation lasted too long: It took 9,769 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,557 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,219 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,579 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,584 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,562 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 2, 1.9801980198019802, 0.02622950819672131], "isController": false}, {"data": ["The operation lasted too long: It took 9,573 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 11,338 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 10,883 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,830 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,640 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,625 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,435 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,583 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}, {"data": ["The operation lasted too long: It took 9,715 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, 0.9900990099009901, 0.013114754098360656], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 7625, 101, "The operation lasted too long: It took 9,054 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 2, "The operation lasted too long: It took 9,723 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 2, "The operation lasted too long: It took 9,646 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 2, "The operation lasted too long: It took 9,552 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 2, "The operation lasted too long: It took 9,610 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 2], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["read one tasklist", 641, 11, "The operation lasted too long: It took 9,056 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,055 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,540 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,610 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,600 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1], "isController": false}, {"data": ["create tasklist", 1654, 35, "The operation lasted too long: It took 9,515 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,626 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 10,785 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,641 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,648 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1], "isController": false}, {"data": ["read all tasks", 336, 5, "The operation lasted too long: It took 9,747 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,794 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,435 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,583 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,552 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1], "isController": false}, {"data": ["update task name", 287, 4, "The operation lasted too long: It took 9,610 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,830 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,051 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,553 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["read all tasklists", 920, 15, "The operation lasted too long: It took 9,946 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 11,713 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,983 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 10,265 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 10,205 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1], "isController": false}, {"data": ["delete task by id", 210, 4, "The operation lasted too long: It took 9,769 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,660 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,506 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,722 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["create task", 393, 8, "The operation lasted too long: It took 9,628 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 10,733 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,609 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,715 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,054 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": ["update tasklist name", 741, 8, "The operation lasted too long: It took 11,211 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,909 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,747 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,485 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,061 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1], "isController": false}, {"data": ["read one task", 252, 4, "The operation lasted too long: It took 9,640 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,871 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,416 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,562 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, null, null], "isController": false}, {"data": ["delete tasklist by id", 542, 7, "The operation lasted too long: It took 9,537 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,040 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,544 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,065 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1, "The operation lasted too long: It took 9,557 milliseconds, but should not have lasted longer than 9,000 milliseconds.", 1], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
