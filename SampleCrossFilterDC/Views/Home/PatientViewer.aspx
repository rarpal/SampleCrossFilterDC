<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="PatientViewer.aspx.cs" Inherits="BIReporting_PatientViewer" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitlePlaceHolder" runat="Server">
    Clarity Patient Viewer
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="Server">

    <script src="../Scripts/jquery-1.10.2.min.js"></script>
    <script src="../Scripts/d3.v3.min.js" type="text/javascript"></script>
    <script src="../Scripts/crossfilter.js"></script>
    <script src="../Scripts/dc-mod.js"></script>
    <script src="../Scripts/PageFunctions.js"></script>
    <link href="../Styles/dcSollis.css" rel="stylesheet" />
    <link href="../Styles/jquery.dataTables.css" rel="stylesheet" />
    <script src="../Scripts/jquery.dataTables.js"></script>
    <style>
        div.tooltip {
            position: absolute;
            text-align: center; /*width: 60px;*/
            width: auto; /*height: 28px;*/
            height: auto;
            padding: 5px;
            font: 12px sans-serif;
            background: lightsteelblue;
            border: 0px;
            border-radius: 8px;
            pointer-events: none;
        }

        th {
            background-color: #99CCFF;
        }

        /*td {
            background-color: #C6E2FF;
        }*/
        td.details-control {
            background: url('images/details_open.png') no-repeat center center;
            cursor: pointer;
        }

        tr.shown td.details-control {
            background: url('images/details_close.png') no-repeat center center;
        }

    </style>

    <h2>Activity TimeLine</h2>

    <div id="TimeLine" style="display: inline; width: 900px; height: 200px"></div>
    <div id="TimeLineSource" style="display: inline; width: 900px; height: 200px"></div>
    <div id="TimeLine2"></div>
    <div id="legend" style="width: 900px; height: 30px"></div>
    <%--<div id="TimePlaceHolder"><a href="#" onclick="javascript:ExpandTimeLine()">Expand</a></div>--%>
    <div id="eventschart" style="width:600px;height:300px></div>
    <div id="TableData" style="width:80%">
        <table id="dc-data-table" class="stripe">
            <thead>
                <tr>
                    <th></th>
                    <th align="left">Activity Type</th>
                    <th align="left">Activity Source</th>
                    <th align="left">Event Date</th>
                </tr>
            </thead>
        </table>
    </div>


    <script language="javascript">
        var tl;
        var td;

        var cross;
        var dimen;
        var sourceDimen;
        var sourceGroup;

        var group;
        var pc;
        var mid;
        var mxd;
        var detailsRowAE = { AE_DisposalMethod: "Ambulance", AE_ArrivalTime: "15:31", AE_DepartureTime: "19:12" };
        var data = [
        { "DT_RowId": "1", "UniqueKey": "115976/OP/TST173092", "ActivityType": "OP", "ActivitySource": "Epsom & St Hellier", "EventDate": "2013-06-20", "AE_DisposalMethod": "", "AE_ArrivalTime": "", "AE_DepartureTime": "", "IP_DischargeDate": "", "IP_AdmissionMethod": "", "IP_PrimaryDiagnosis": "", "IP_EpisodesInSpell": "", "OP_Consultant": "Dr Moore", "OP_Specialty": "Kidneys", "OP_FirstFUP": "First", "OP_AttendedOrDidNotAttend": "Attended on time" },
        { "DT_RowId": "2", "UniqueKey": "13687/IP/TST100954", "ActivityType": "IP", "ActivitySource": "St Georges", "EventDate": "2013-07-21", "AE_DisposalMethod": "", "AE_ArrivalTime": "", "AE_DepartureTime": "", "IP_DischargeDate": "2013-06-20", "IP_AdmissionMethod": "Main door", "IP_PrimaryDiagnosis": "Broken Leg", "IP_EpisodesInSpell": "3", "OP_Consultant": "", "OP_Specialty": "", "OP_FirstFUP": "", "OP_AttendedOrDidNotAttend": "" },
        { "DT_RowId": "3", "UniqueKey": "3834/IP/TST52450", "ActivityType": "IP", "ActivitySource": "Surbiton", "EventDate": "2013-08-23", "AE_DisposalMethod": "Ambulance", "AE_ArrivalTime": "15:31", "AE_DepartureTime": "19:12", "IP_DischargeDate": "2013-06-20", "IP_AdmissionMethod": "", "IP_PrimaryDiagnosis": "", "IP_EpisodesInSpell": "", "OP_Consultant": "", "OP_Specialty": "", "OP_FirstFUP": "", "OP_AttendedOrDidNotAttend": "" },
        { "DT_RowId": "4", "UniqueKey": "154539/AE/TST127800", "ActivityType": "AE", "ActivitySource": "St Georges", "EventDate": "2013-12-30", "AE_DisposalMethod": "Ambulance", "AE_ArrivalTime": "15:31", "AE_DepartureTime": "19:12", "IP_DischargeDate": "2013-06-20", "IP_AdmissionMethod": "", "IP_PrimaryDiagnosis": "", "IP_EpisodesInSpell": "", "OP_Consultant": "", "OP_Specialty": "", "OP_FirstFUP": "", "OP_AttendedOrDidNotAttend": "" },
        { "DT_RowId": "5", "UniqueKey": "100112/OP/TST208196", "ActivityType": "OP", "ActivitySource": "Surbiton", "EventDate": "2014-01-24", "AE_DisposalMethod": "Ambulance", "AE_ArrivalTime": "15:31", "AE_DepartureTime": "19:12", "IP_DischargeDate": "2013-06-20", "IP_AdmissionMethod": "", "IP_PrimaryDiagnosis": "", "IP_EpisodesInSpell": "", "OP_Consultant": "Dr Moore", "OP_Specialty": "Kidneys", "OP_FirstFUP": "First", "OP_AttendedOrDidNotAttend": "Attended on time" },
        { "DT_RowId": "6", "UniqueKey": "871017/GP/954967", "ActivityType": "GP", "ActivitySource": "Tadworth Medical Centre", "EventDate": "2014-11-29", "AE_DisposalMethod": "Ambulance", "AE_ArrivalTime": "15:31", "AE_DepartureTime": "19:12", "IP_DischargeDate": "2013-06-20", "IP_AdmissionMethod": "", "IP_PrimaryDiagnosis": "", "IP_EpisodesInSpell": "", "OP_Consultant": "", "OP_Specialty": "", "OP_FirstFUP": "", "OP_AttendedOrDidNotAttend": "" },
        { "DT_RowId": "7", "UniqueKey": "871014/GP/139985", "ActivityType": "GP", "ActivitySource": "Tadworth Medical Centre", "EventDate": "2015-01-09", "AE_DisposalMethod": "Ambulance", "AE_ArrivalTime": "15:31", "AE_DepartureTime": "19:12", "IP_DischargeDate": "2013-06-20", "IP_AdmissionMethod": "", "IP_PrimaryDiagnosis": "", "IP_EpisodesInSpell": "", "OP_Consultant": "", "OP_Specialty": "", "OP_FirstFUP": "", "OP_AttendedOrDidNotAttend": "" },
        { "DT_RowId": "8", "UniqueKey": "871016/GP/787121", "ActivityType": "GP", "ActivitySource": "Tadworth Medical Centre", "EventDate": "2015-03-14", "AE_DisposalMethod": "Ambulance", "AE_ArrivalTime": "15:31", "AE_DepartureTime": "19:12", "IP_DischargeDate": "2013-06-20", "IP_AdmissionMethod": "", "IP_PrimaryDiagnosis": "", "IP_EpisodesInSpell": "", "OP_Consultant": "", "OP_Specialty": "", "OP_FirstFUP": "", "OP_AttendedOrDidNotAttend": "" },
        { "DT_RowId": "9", "UniqueKey": "871015/GP/658358", "ActivityType": "GP", "ActivitySource": "Tadworth Medical Centre", "EventDate": "2015-05-06", "AE_DisposalMethod": "Ambulance", "AE_ArrivalTime": "15:31", "AE_DepartureTime": "19:12", "IP_DischargeDate": "2013-06-20", "IP_AdmissionMethod": "", "IP_PrimaryDiagnosis": "", "IP_EpisodesInSpell": "", "OP_Consultant": "", "OP_Specialty": "", "OP_FirstFUP": "", "OP_AttendedOrDidNotAttend": "" },
        { "DT_RowId": "10", "UniqueKey": "115976/OP/TST173092", "ActivityType": "OP", "ActivitySource": "Epsom & St Hellier", "EventDate": "2013-06-20", "AE_DisposalMethod": "Ambulance", "AE_ArrivalTime": "15:31", "AE_DepartureTime": "19:12", "IP_DischargeDate": "2013-06-20", "IP_AdmissionMethod": "", "IP_PrimaryDiagnosis": "", "IP_EpisodesInSpell": "", "OP_Consultant": "Dr Moore", "OP_Specialty": "Kidneys", "OP_FirstFUP": "First", "OP_AttendedOrDidNotAttend": "Attended on time" },
        { "DT_RowId": "12", "UniqueKey": "13687/IP/TST100954", "ActivityType": "IP", "ActivitySource": "St Georges", "EventDate": "2013-07-21", "AE_DisposalMethod": "", "AE_ArrivalTime": "", "AE_DepartureTime": "", "IP_DischargeDate": "2013-06-20", "IP_AdmissionMethod": "Main door", "IP_PrimaryDiagnosis": "Broken Leg", "IP_EpisodesInSpell": "3", "OP_Consultant": "", "OP_Specialty": "", "OP_FirstFUP": "", "OP_AttendedOrDidNotAttend": "" },
        { "DT_RowId": "13", "UniqueKey": "3834/IP/TST52450", "ActivityType": "IP", "ActivitySource": "Surbiton", "EventDate": "2013-08-23", "AE_DisposalMethod": "", "AE_ArrivalTime": "", "AE_DepartureTime": "", "IP_DischargeDate": "2013-06-20", "IP_AdmissionMethod": "Main door", "IP_PrimaryDiagnosis": "Broken Leg", "IP_EpisodesInSpell": "3", "OP_Consultant": "", "OP_Specialty": "", "OP_FirstFUP": "", "OP_AttendedOrDidNotAttend": "" },
        { "DT_RowId": "14", "UniqueKey": "154539/AE/TST127800", "ActivityType": "AE", "ActivitySource": "St Georges", "EventDate": "2013-12-30", "AE_DisposalMethod": "Ambulance", "AE_ArrivalTime": "15:31", "AE_DepartureTime": "19:12", "IP_DischargeDate": "2013-06-20", "IP_AdmissionMethod": "", "IP_PrimaryDiagnosis": "", "IP_EpisodesInSpell": "", "OP_Consultant": "", "OP_Specialty": "", "OP_FirstFUP": "", "OP_AttendedOrDidNotAttend": "" },
        { "DT_RowId": "15", "UniqueKey": "100112/OP/TST208196", "ActivityType": "OP", "ActivitySource": "Surbiton", "EventDate": "2014-01-24", "AE_DisposalMethod": "Ambulance", "AE_ArrivalTime": "15:31", "AE_DepartureTime": "19:12", "IP_DischargeDate": "2013-06-20", "IP_AdmissionMethod": "", "IP_PrimaryDiagnosis": "", "IP_EpisodesInSpell": "", "OP_Consultant": "Dr Moore", "OP_Specialty": "Kidneys", "OP_FirstFUP": "First", "OP_AttendedOrDidNotAttend": "Attended on time" },
        { "DT_RowId": "16", "UniqueKey": "871017/GP/954967", "ActivityType": "GP", "ActivitySource": "Tadworth Medical Centre", "EventDate": "2014-11-29", "AE_DisposalMethod": "Ambulance", "AE_ArrivalTime": "15:31", "AE_DepartureTime": "19:12", "IP_DischargeDate": "2013-06-20", "IP_AdmissionMethod": "", "IP_PrimaryDiagnosis": "", "IP_EpisodesInSpell": "", "OP_Consultant": "", "OP_Specialty": "", "OP_FirstFUP": "", "OP_AttendedOrDidNotAttend": "" },
        { "DT_RowId": "17", "UniqueKey": "871014/GP/139985", "ActivityType": "GP", "ActivitySource": "Tadworth Medical Centre", "EventDate": "2015-01-09", "AE_DisposalMethod": "Ambulance", "AE_ArrivalTime": "15:31", "AE_DepartureTime": "19:12", "IP_DischargeDate": "2013-06-20", "IP_AdmissionMethod": "", "IP_PrimaryDiagnosis": "", "IP_EpisodesInSpell": "", "OP_Consultant": "", "OP_Specialty": "", "OP_FirstFUP": "", "OP_AttendedOrDidNotAttend": "" },
        { "DT_RowId": "18", "UniqueKey": "871016/GP/787121", "ActivityType": "GP", "ActivitySource": "Tadworth Medical Centre", "EventDate": "2015-03-14", "AE_DisposalMethod": "Ambulance", "AE_ArrivalTime": "15:31", "AE_DepartureTime": "19:12", "IP_DischargeDate": "2013-06-20", "IP_AdmissionMethod": "", "IP_PrimaryDiagnosis": "", "IP_EpisodesInSpell": "", "OP_Consultant": "", "OP_Specialty": "", "OP_FirstFUP": "", "OP_AttendedOrDidNotAttend": "" },
        { "DT_RowId": "19", "UniqueKey": "871015/GP/658358", "ActivityType": "GP", "ActivitySource": "Tadworth Medical Centre", "EventDate": "2015-05-06", "AE_DisposalMethod": "Ambulance", "AE_ArrivalTime": "15:31", "AE_DepartureTime": "19:12", "IP_DischargeDate": "2013-06-20", "IP_AdmissionMethod": "", "IP_PrimaryDiagnosis": "", "IP_EpisodesInSpell": "", "OP_Consultant": "", "OP_Specialty": "", "OP_FirstFUP": "", "OP_AttendedOrDidNotAttend": "" }];




        function JSONData(data) {
            var d;
            if (typeof (JSON) !== 'undefined' &&
        typeof (JSON.parse) === 'function')
                d = JSON.parse(data.d);
            else
                d = eval('(' + data.d + ')'); return d;

        }
        function GetData(ccg, nhsnumber) {

            var aj = $.ajax({
                type: "POST",
                dataType: "json",
                url: "GetData.asmx/GetPatientViewerData",
                data: "{'ccg':'" + ccg + "','nhsNumber':'" + nhsnumber + "'}",
                contentType: "application/json; charset=utf-8"
            });
            aj.fail(function (jqXHR, textStatus, errorThrown) {
                alert("Problem getting Viewer data: " + textStatus + " " + errorThrown);

            });

            return aj;

        }
        _toolTipDiv = d3.select("body").append("div")
       .attr("class", "tooltip")
       .style("opacity", 0).style("position", "absolute");
        dc.tooltipActive(true);

        //var d = GetData('08T', '1005604428');


        //d.done(function (data) {
        //    var d = eval(data.d);
        //    cross = crossfilter(d);
        //    dimen = cross.dimension(function (d) { return d.ActivityType });

        //    group = dimen.group().reduceCount();

        //    mid = d3.min(d, function (d) { return new Date(d.EventDate) });
        //    mxd = d3.max(d, function (d) { return new Date(d.EventDate) });

        //    pc = dc.pieChart("#TimeLine").width("400").height("200").dimension(dimen).group(group);
        //    //.x(d3.time.scale().domain([new Date(mid), new Date(mxd)]).rangeRound([10, 890]))

        //    var events = cross.dimension(function (d) { return d3.time.day(new Date(d.EventDate)) });
        //    var event_c = events.group().reduceCount();

        //    sourceDimen = cross.dimension(function (d) { return d.ActivitySource; });
        //    sourceGroup = sourceDimen.group().reduceCount();

        //    var tls = dc.pieChart("#TimeLineSource").width("400").height("200").dimension(sourceDimen).group(sourceGroup);

        //    var rc = dc.timeLine("#TimeLine2").width("800").height("200").dimension(events).group(event_c).x(d3.time.scale().domain([new Date(mid), new Date(mxd)]).rangeRound([10, 800]));


        //    var dt = dc.dataTableDetail("#TableData").width(400).height(400).dimension(events).group(event_c);
        //    dt.enhanceTable(true);
        //    dc.renderAll();
        //});

        var d = eval(data);
        cross = crossfilter(d);
        dimen = cross.dimension(function (d) { return d.ActivityType });

        group = dimen.group().reduceCount();

        mid = d3.min(d, function (d) { return new Date(d.EventDate) });
        mxd = d3.max(d, function (d) { return new Date(d.EventDate) });

        pc = dc.pieChart("#TimeLine").width("400").height("200").dimension(dimen).group(group);
        //.x(d3.time.scale().domain([new Date(mid), new Date(mxd)]).rangeRound([10, 890]))

        var events = cross.dimension(function (d) { return d3.time.day(new Date(d.EventDate)) });
        var event_c = events.group().reduceCount();

        sourceDimen = cross.dimension(function (d) { return d.ActivitySource; });
        sourceGroup = sourceDimen.group().reduceCount();

        var tls = dc.pieChart("#TimeLineSource").width("400").height("200").dimension(sourceDimen).group(sourceGroup);

        var rc = dc.timeLine("#TimeLine2").dimension(events).group(event_c).x(d3.time.scale().domain([new Date(mid), new Date(mxd)]).rangeRound([10, 800]));
        rc.legendDiv("#legend");
        

        var eventsChart = dc.barChart('#eventschart');
        var eventsDim = cross.dimension(function (d) {
            return d3.time.day(new Date(d.EventDate))
        });


        var ip = eventsDim.group().reduceSum(function (d) {            if (d.ActivityType == "IP") return 1;   } );
        var op = eventsDim.group().reduceSum(function (d) { if (d.ActivityType == "OP") return 1; });
        var ae = eventsDim.group().reduceSum(function (d) { if (d.ActivityType == "AE") return 1; });
        var gp = eventsDim.group().reduceSum(function (d) { if (d.ActivityType == "GP") return 1; });

        var eventsByAcType = eventsDim.group().reduce(
           function (p, v) {
               switch (v.ActivityType) {
                   case "IP":
                       p.ip += 1;
                       
                       break;
                   case "OP":
                       p.op += 1;
                       break;
                   case "AE":
                       p.ae += 1;
                       break;
                   case "GP":
                       p.gp += 1;
                       break;
                   default:
                       break;
               }
               return p;
           },
           function (p, v) {
               switch (v.ActivityType) {
                   case "IP":
                       p.ip -= 1;
                       break;
                   case "OP":
                       p.op -= 1;
                       break;
                   case "AE":
                       p.ae -= 1;
                       break;
                   case "GP":
                       p.gp -= 1;
                       break;
                   default:
                       break;
               }
               return p;
           },
           function () {
               return {
                   ip: 0,
                   op: 0,
                   ae: 0,
                   gp: 0
               };
           }
       );

      


        eventsChart
            .margins({ top: 50, right: 20, left: 50, bottom: 50 })
            .width(600)
            .height(150)
            //.gap(50)
            .dimension(eventsDim)
            .group(event_c)
            //.valueAccessor(function (d) {
            //    return d.value.ip;
            //})

                .showYAxis(false)
            //.x(d3.time.scale().domain([new Date(minEventDate), new Date(minEventDate.setMonth(minEventDate.getMonth() + 3))]))
            //.x(d3.time.scale().domain([new Date(minEventDate), new Date(maxEventDate)]))
            .x(d3.time.scale().domain([new Date(mid), new Date(mxd)]))
            .xUnits(d3.time.month)
            //.xUnits(function () { return 12; })
            .elasticX(false)
            //.xAxisPadding(-50)
           // .yAxisLabel("# events")
            //.y(d3.scale.linear().domain([0, 10]))
            .centerBar(true)
           // .elasticY(true)
            .brushOn(true);
            //.renderlet(colorRenderlet)
           // .legend(dc.legend().x(100).y(0).itemHeight(13).gap(5))
           //.mergeStacks(true)
           //.xAxis().ticks(d3.time.month, 1).tickFormat(d3.time.format("%b %y")).tickSize(0).tickPadding(4);


    

        var table = $("#dc-data-table").dataTable({
            "paging": false,
            "filter": false,
            "sort": true,
            "scrollY": "500px",
            //"aaData": countryDimension.top(Infinity),
            "aaData": events.top(Infinity),
            "columns": [
                {
                    "className": 'details-control',
                    "orderable": false,
                    "data": null,
                    "defaultContent": ''
                },
                { "data": "ActivityType" },
                { "data": "ActivitySource" },
                { "data": "EventDate" }
            ],
            "order": [[1, 'asc']]
        });
        

        // Add event listener for opening and closing details
        $('#dc-data-table tbody').on('click', 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var row = table.api().row(tr);

            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child(format(row.data())).show();
                tr.addClass('shown');
            }
        });


        //Don't know why this event doesn't get called when items are removed from the filter, so have to use onclick event instead
        //pc.on("filtered", RefreshTable);
        //tls.on("filtered", RefreshTable);
        //Clear row highlight when table clicked
        $("#dc-data-table").click(function () {
            $("tr").css("background-color", "");
        });
        $("#TimeLine").click(function () {
            RefreshTable();
        });

        $("#eventschart").click(function () {
            RefreshTable();
        });
        $("#TimeLineSource").click(function () {
            RefreshTable();
        });
        dc.renderAll();

        //eventsChart.selectAll("g.axis.x").selectAll(".tick").select("text").attr("transform", "rotate(90)");

        $("#TimeLine2").animate({
            scrollLeft: 1000
        }, 800);
        
        function ExpandTimeLine() {
            //Need to create additional timeline controls for each source identified in dimension

            var sources = sourceDimen.group().all();

            sources.forEach(function (d, i) {
                var thisD = sourceDimen.top(Infinity).filter(function (d2) { return d2.ActivitySource == d.key; });
                var thisCF = crossfilter(thisD);
                var thisS = thisCF.dimension(function (d) { return d.ActivitySource; });
                var thisSG = thisS.group().reduceCount();
                var mid = d3.min(thisD, function (d) { return new Date(d.EventDate) });
                var mxd = d3.max(thisD, function (d) { return new Date(d.EventDate) });
                var dv = d3.select("#TimePlaceHolder").append("div").append("p").text(d.key).append("div").attr("id", "TL" + i).style("width", "400px").style("height", "200px");
                var a = dc.timeLine("#TL" + i).width("400").height("200").dimension(thisS).group(thisSG).x(d3.time.scale().domain([new Date(mid), new Date(mxd)]).rangeRound([10, 800]));
                a.render();
            });
        }

        function RefreshTable() {
            console.log("clicked on chart");
            dc.events.trigger(function () {
                //alldata = countryDimension.top(Infinity);
                alldata = events.top(Infinity);
                table.fnClearTable();
                table.fnAddData(alldata);
                table.fnDraw();
            });
        }


        function format(d) {
            switch (d.ActivityType) {
                case 'IP':
                    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
                '<tr>' +
                    '<td>Discharge Date:</td>' +
                    '<td>' + d.IP_DischargeDate + '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td>Admission Method:</td>' +
                    '<td>' + d.IP_AdmissionMethod + '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td>Primary Diagnosis:</td>' +
                    '<td>' + d.IP_PrimaryDiagnosis + '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td>Episodes In Spell:</td>' +
                    '<td>' + d.IP_EpisodesInSpell + '</td>' +
                '</tr>' +
            '</table>';
                    break;
                case 'OP':
                    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
                '<tr>' +
                    '<td>Consultant:</td>' +
                    '<td>' + d.OP_Consultant + '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td>Specialty:</td>' +
                    '<td>' + d.OP_Specialty + '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td>First/FUP:</td>' +
                    '<td>' + d.OP_FirstFUP + '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td>Attended or Did Not Attend:</td>' +
                    '<td>' + d.OP_AttendedOrDidNotAttend + '</td>' +
                '</tr>' +
            '</table>';
                    break;
                case 'AE':
                    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
                '<tr>' +
                    '<td>Disposal Method:</td>' +
                    '<td>' + d.AE_DisposalMethod + '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td>Arrival Time:</td>' +
                    '<td>' + d.AE_ArrivalTime + '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td>Departure Time:</td>' +
                    '<td>' + d.AE_DepartureTime + '</td>' +
                '</tr>' +
            '</table>';
                    break;
                default:
        
            }
           
            // `d` is the original data object for the row
            
        }


    </script>

</asp:Content>

