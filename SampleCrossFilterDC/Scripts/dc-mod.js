/*
*  Copyright 2012 the original author or authors.
*  Licensed under the Apache License, Version 2.0 (the "License");
*  You may obtain a copy of the License at
*
*        http://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License.
*/


//This is a Sollis Modified Version of the DC Library
//(Barry Holland)

dc = {
    version: "1.4.0",
    sollisversion: "1.1.9",
    constants: {
        CHART_CLASS: "dc-chart",
        DEBUG_GROUP_CLASS: "debug",
        STACK_CLASS: "stack",
        DESELECTED_CLASS: "deselected",
        SELECTED_CLASS: "selected",
        NODE_INDEX_NAME: "__index__",
        GROUP_INDEX_NAME: "__group_index__",
        DEFAULT_CHART_GROUP: "__default_chart_group__",
        EVENT_DELAY: 40,
        NEGLIGIBLE_NUMBER: 1e-10
    },
    _renderlet: null
};

String.prototype.replaceAll = function(find, replace) {
    var str = this;
    return str.replace(new RegExp(find, 'g'), replace);
};

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement /*, fromIndex */) {
        'use strict';
        if (this == null) {
            throw new TypeError();
        }
        var n, k, t = Object(this),
        len = t.length >>> 0;

        if (len === 0) {
            return -1;
        }
        n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    };
}

//Global Items
var _toolTipDiv = null;
var _drillPopupDiv = null;
var _tooltipActive = false;


dc.tooltipActive = function(x) {
if (!arguments.length) return dc._tooltipActive;
dc._tooltipActive = x;
    return dc;
};

       
function getCurrentFiscalYear() {
//get current date
 var today = new Date();
//get current month
 var curMonth = today.getMonth(); //get current month
 var fiscalYr = "";
 if (curMonth > 3) { //
 var nextYr1 = (today.getFullYear() + 1).toString();
 fiscalYr = today.getFullYear().toString() + "-" + nextYr1.charAt(2) + nextYr1.charAt(3);
 }
 else {
 var nextYr2 = today.getFullYear().toString();
 fiscalYr = (today.getFullYear() - 1).toString() + "-" + nextYr2.charAt(2) + nextYr2.charAt(3);
 }
 return fiscalYr;
 }

function getStartCurrentFiscalYear() {
//get current date
 var today = new Date();
//get current month
 var curMonth = today.getMonth(); //get current month
 var fiscalYr = "";
 if (curMonth > 3) { // April
 //Simple set month back to April 1st and we're done
 today.setMonth(3);
 today.setDate(1);

 }
 else {
 //JAN/FEB/MAR , set month back to April and reduce year by 1
 var nextYr2 = today.getFullYear().toString();
 today.setMonth(3);
 today.setFullYear(today.getFullYear()-1);
 today.setDate(1);


 }
 return today;
 }


function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

var uniqueString = function(origArr, field) {
    var newArr = [],
        origLen = origArr.length,
        found,
        x, y; i = 1;

    for (x = 0; x < origLen; x++) {
        found = undefined;


        for (y = 0; y < newArr.length; y++) {
        if (origArr[x][field] === newArr[y].Name) {
                found = true;
                break;
            }
        }
        if (!found) {

            // if ( _filters.length > 0)
            //{

            //if (_chart.hasFilter(origArr[x][field]))
            //{
            var newOne = origArr[x][field];
            newArr.push(newOne);
            i++;
        }
        // }
        //else
        //{
        //var newOne =  origArr[x][field] ;

        //newArr.push(newOne);
        //i++;

        //}

        //}
    }
    return newArr;

};


dc.ShowToolTipCustom = function(d, l,x,y) {
var s = d;
s = s.replace("%SERIES%", l);
var left = x;
var top = y;

if (dc.tooltipActive()) {

    _toolTipDiv.transition()
                .duration(200)
                .style("opacity", .9).style("z-index", 100);
}
else {
    //Show helper tip?
    // _toolTipDiv.transition()
    //  .duration(200)
    //  .style("opacity", .4);


}

_toolTipDiv.html(s)
                .style("left", (left + 30) + "px")
                .style("top", (top - 20) + "px");
}
dc.ShowToolTip = function(d, l) {

    var s = d;
    s = s.replace("%SERIES%", l);
    var left = d3.event.pageX;
    var top = d3.event.pageY;

    if (dc.tooltipActive()) {

        _toolTipDiv.transition()
                .duration(200)
                .style("opacity", .9).style("z-index", 100);
    }
    else {
        //Show helper tip?
        // _toolTipDiv.transition()
        //  .duration(200)
        //  .style("opacity", .4);


    }
    
    _toolTipDiv.html(s)
                .style("left", (left + 10) + "px")
                .style("top", (top - 20) + "px");
}

dc.ToggleToolTip=function()
{
    dc.tooltipActive(!dc.tooltipActive());
    if (dc.tooltipActive())
    {
       _toolTipDiv.transition()
                .duration(200)
                .style("opacity", .9).style("z-index", 100);
    }
    else
    {
      dc.HideToolTip();
    }

}
dc.MoveToolTipCustom = function(x, y) {
var left = x;
var top = y;


_toolTipDiv.style("left", (left + 30) + "px")
                .style("top", (top - 20) + "px");

}
dc.MoveToolTip=function()
{
    var left = d3.event.pageX;
    var top = d3.event.pageY;

    
    _toolTipDiv.style("left", (left+10) + "px")
                .style("top", (top - 20) + "px");
}

dc.HideToolTip = function() {
    _toolTipDiv.transition()
                .duration(500)
                .style("opacity", 0);

}

var _doResize = false;


dc.doResize = function(x) {
    if (!arguments.length) return dc._doResize;
    dc._doResize = x;
    return dc;
};

//End global Items


dc.chartRegistry = function() {
    // chartGroup:string => charts:array
    var _chartMap = {};

    this.has = function(chart) {
        for (var e in _chartMap) {
            if (_chartMap[e].indexOf(chart) >= 0)
                return true;
        }
        return false;
    };

    function initializeChartGroup(group) {
        if (!group)
            group = dc.constants.DEFAULT_CHART_GROUP;

        if (!_chartMap[group])
            _chartMap[group] = [];

        return group;
    }

    this.register = function(chart, group) {
        group = initializeChartGroup(group);
        _chartMap[group].push(chart);
    };

    this.clear = function() {
        _chartMap = {};
    };

    this.list = function(group) {
        group = initializeChartGroup(group);
        return _chartMap[group];
    };

    return this;
} ();

dc.registerChart = function(chart, group) {
    dc.chartRegistry.register(chart, group);
};

dc.hasChart = function(chart) {
    return dc.chartRegistry.has(chart);
};

dc.deregisterAllCharts = function() {
    dc.chartRegistry.clear();
};

dc.filterAll = function(group) {
    var charts = dc.chartRegistry.list(group);
    for (var i = 0; i < charts.length; ++i) {
        charts[i].filterAll();
    }
};


dc.renderAll = function(group) {
    var charts = dc.chartRegistry.list(group);
    for (var i = 0; i < charts.length; ++i) {
        charts[i].render();
        if (dc._doResize == true) {
            charts[i].resize();
        }
    }

    if (dc._renderlet !== null)
        dc._renderlet(group);
};

dc.resizeAll = function(group) {
DetermineScreenSize();
    var charts = dc.chartRegistry.list(group);
    for (var i = 0; i < charts.length; ++i) {
        charts[i].resize();
    }
}

dc.redrawAll = function(group) {
    var charts = dc.chartRegistry.list(group);
    for (var i = 0; i < charts.length; ++i) {
//console.log(charts[i].anchor());
try
{
        charts[i].redraw();
        }
        catch (e)
        {
        }
    }

    if (dc._renderlet !== null)
        dc._renderlet(group);
};

dc.transition = function(selections, duration, callback) {
    if (duration <= 0 || duration === undefined)
        return selections;

    var s = selections
        .transition()
        .duration(duration);

    if (callback instanceof Function) {
        callback(s);
    }

    return s;
};

dc.units = {};
dc.units.integers = function(s, e) {
    return Math.abs(e - s);
};

dc.units.ordinal = function(s, e, domain) {
    return domain;
};
dc.units.float = {};
dc.units.float.precision = function(precision) {
    var _f = function(s, e, domain) { return Math.ceil(Math.abs((e - s) / _f.resolution)); };
    _f.resolution = precision;
    return _f;
};

dc.round = {};
dc.round.floor = function(n) {
    return Math.floor(n);
};
dc.round.ceil = function(n) {
    return Math.ceil(n);
};
dc.round.round = function(n) {
    return Math.round(n);
};

dc.override = function(obj, functionName, newFunction) {
    var existingFunction = obj[functionName];
    obj["_" + functionName] = existingFunction;
    obj[functionName] = newFunction;
};

dc.renderlet = function(_) {
    if (!arguments.length) return dc._renderlet;
    dc._renderlet = _;
    return dc;
};

dc.instanceOfChart = function(o) {
    return o instanceof Object && o.__dc_flag__;
};
dc.errors = {};

dc.errors.Exception = function(msg) {
    var _msg = msg != null ? msg : "Unexpected internal error";

    this.message = _msg;

    this.toString = function() {
        return _msg;
    };
};

dc.errors.InvalidStateException = function() {
    dc.errors.Exception.apply(this, arguments);
}; dc.dateFormat = d3.time.format("%m/%d/%Y");

dc.printers = {};

dc.printers.filters = function(filters) {
    var s = "";

    for (var i = 0; i < filters.length; ++i) {
        if (i > 0) s += ", ";
        s += dc.printers.filter(filters[i]);
    }

    return s;
};

dc.printers.filter = function(filter) {
    var s = "";

    if (filter) {
        if (filter instanceof Array) {
            if (filter.length >= 2)
                s = "[" + dc.utils.printSingleValue(filter[0]) + " -> " + dc.utils.printSingleValue(filter[1]) + "]";
            else if (filter.length >= 1)
                s = dc.utils.printSingleValue(filter[0]);
        } else {
            s = dc.utils.printSingleValue(filter)
        }
    }

    return s;
};

dc.utils = {};

dc.utils.printSingleValue = function(filter) {
    var s = "" + filter;

    if (filter instanceof Date)
        s = dc.dateFormat(filter);
    else if (typeof (filter) == "string")
        s = filter;
    else if (typeof (filter) == "number")
        s = Math.round(filter);

    return s;
};

dc.utils.add = function(l, r) {
    if (typeof r === "string")
        r = r.replace("%", "")

    if (l instanceof Date) {
        if (typeof r === "string") r = +r
        var d = new Date();
        d.setTime(l.getTime());
        d.setDate(l.getDate() + r);
        return d;
    } else if (typeof r === "string") {
        var percentage = (+r / 100);
        return l > 0 ? l * (1 + percentage) : l * (1 - percentage);
    } else {
        return l + r;
    }
};

dc.utils.subtract = function(l, r) {
    if (typeof r === "string")
        r = r.replace("%", "")

    if (l instanceof Date) {
        if (typeof r === "string") r = +r
        var d = new Date();
        d.setTime(l.getTime());
        d.setDate(l.getDate() - r);
        return d;
    } else if (typeof r === "string") {
        var percentage = (+r / 100);
        return l < 0 ? l * (1 + percentage) : l * (1 - percentage);
    } else {
        return l - r;
    }
};

dc.utils.StyleInfo=function() 
{

var _styles=[];

this.size = function() {
        return _groups.length;
    };

this.SetGroupStyle=function (groupIndex,style)
{
      _styles.push([groupIndex,style]);
       }

this.GetGroupStyle=function(groupIndex)
{
                  
                     for (var i = 0; i < _styles.length; i++) {
                     
                      if (_styles[i][0]==groupIndex )
                      {
                       return _styles[i][1];
                      }
                     
                     }
          
}

}

dc.utils.GroupStack = function() {
    var _dataPointMatrix = [];
    var _groups = [];
    var _defaultAccessor;

    function initializeDataPointRow(x) {
        if (!_dataPointMatrix[x])
            _dataPointMatrix[x] = [];
    }

    this.setDataPoint = function(x, y, data) {
        initializeDataPointRow(x);
        _dataPointMatrix[x][y] = data;
    };

    this.getDataPoint = function(x, y) {
        initializeDataPointRow(x);
        var dataPoint = _dataPointMatrix[x][y];
        if (dataPoint == undefined)
            dataPoint = 0;
        return dataPoint;
    };

    this.addGroup = function(group, retriever) {
        if (!retriever)
            retriever = _defaultAccessor;
        _groups.push([group, retriever]);
        return _groups.length - 1;
    };

    this.getGroupByIndex = function(index) {
        return _groups[index][0];
    };

    this.getAccessorByIndex = function(index) {
        return _groups[index][1];
    };

    this.size = function() {
        return _groups.length;
    };

    this.clear = function() {
        _dataPointMatrix = [];
        _groups = [];
    };

    this.setDefaultAccessor = function(retriever) {
        _defaultAccessor = retriever;
    };

    this.getDataPoints = function() {
        return _dataPointMatrix;
    };
};

dc.utils.isNegligible = function(max) {
    return max === undefined || (max < dc.constants.NEGLIGIBLE_NUMBER && max > -dc.constants.NEGLIGIBLE_NUMBER);
}

dc.utils.groupMax = function(group, accessor) {
    var max = d3.max(group.all(), function(e) {
        return accessor(e);
    });
    if (dc.utils.isNegligible(max)) max = 0;
    return max;
};

dc.utils.groupMin = function(group, accessor) {
    var min = d3.min(group.all(), function(e) {
        return accessor(e);
    });
    if (dc.utils.isNegligible(min)) min = 0;
    return min;
};

dc.utils.nameToId = function(name) {
    return name.toLowerCase().replace(/[\s]/g, "_").replace(/[\.']/g, "");
};

dc.utils.appendOrSelect = function(parent, name) {
    var element = parent.select(name);
    if (element.empty()) element = parent.append(name);
    return element;
};
dc.events = {
    current: null
};

dc.events.trigger = function(closure, delay) {
    if (!delay) {
        closure();
        return;
    }

    dc.events.current = closure;

    setTimeout(function() {
        if (closure == dc.events.current)
            closure();
    }, delay);
};
dc.cumulative = {};

dc.cumulative.Base = function() {
    this._keyIndex = [];
    this._map = {};

    this.sanitizeKey = function(key) {
        key = key + "";
        return key;
    };

    this.clear = function() {
        this._keyIndex = [];
        this._map = {};
    };

    this.size = function() {
        return this._keyIndex.length;
    };

    this.getValueByKey = function(key) {
        key = this.sanitizeKey(key);
        var value = this._map[key];
        return value;
    };

    this.setValueByKey = function(key, value) {
        key = this.sanitizeKey(key);
        return this._map[key] = value;
    };

    this.indexOfKey = function(key) {
        key = this.sanitizeKey(key);
        return this._keyIndex.indexOf(key);
    };

    this.addToIndex = function(key) {
        key = this.sanitizeKey(key);
        this._keyIndex.push(key);
    };

    this.getKeyByIndex = function(index) {
        return this._keyIndex[index];
    };
};

dc.cumulative.Sum = function() {
    dc.cumulative.Base.apply(this, arguments);

    this.add = function(key, value) {
        if (value == null)
            value = 0;

        if (this.getValueByKey(key) == null) {
            this.addToIndex(key);
            this.setValueByKey(key, value);
        } else {
            this.setValueByKey(key, this.getValueByKey(key) + value);
        }
    };

    this.minus = function(key, value) {
        this.setValueByKey(key, this.getValueByKey(key) - value);
    };

    this.cumulativeSum = function(key) {
        var keyIndex = this.indexOfKey(key);
        if (keyIndex < 0) return 0;
        var cumulativeValue = 0;
        for (var i = 0; i <= keyIndex; ++i) {
            var k = this.getKeyByIndex(i);
            cumulativeValue += this.getValueByKey(k);
        }
        return cumulativeValue;
    };
};
dc.cumulative.Sum.prototype = new dc.cumulative.Base();

dc.cumulative.CountUnique = function() {
    dc.cumulative.Base.apply(this, arguments);

    function hashSize(hash) {
        var size = 0, key;
        for (key in hash) {
            if (hash.hasOwnProperty(key)) size++;
        }
        return size;
    }

    this.add = function(key, e) {
        if (this.getValueByKey(key) == null) {
            this.setValueByKey(key, {});
            this.addToIndex(key);
        }

        if (e != null) {
            if (this.getValueByKey(key)[e] == null)
                this.getValueByKey(key)[e] = 0;

            this.getValueByKey(key)[e] += 1;
        }
    };

    this.minus = function(key, e) {
        this.getValueByKey(key)[e] -= 1;
        if (this.getValueByKey(key)[e] <= 0)
            delete this.getValueByKey(key)[e];
    };

    this.count = function(key) {
        return hashSize(this.getValueByKey(key));
    };

    this.cumulativeCount = function(key) {
        var keyIndex = this.indexOfKey(key);
        if (keyIndex < 0) return 0;
        var cumulativeCount = 0;
        for (var i = 0; i <= keyIndex; ++i) {
            var k = this.getKeyByIndex(i);
            cumulativeCount += this.count(k);
        }
        return cumulativeCount;
    };
};
dc.cumulative.CountUnique.prototype = new dc.cumulative.Base();
dc.baseChart = function(_chart) {
    _chart.__dc_flag__ = true;

    var __dc_custom__ = false;

    var _dimension;
    var _group;
    

    var _anchor;
    var _root;
    var _svg;

    var _width = 200, _height = 200;

    //New Variables
    var _widthtoheightRatio=[];
    var _originalWidth=-1,_originalHeight=-1;
    var _clickEffect = 'F';
    var _clickAction;
    var _initialFilter;
    var _parameterName;
    var _parameterKey;
    var _seriesLabels = [];
    var _keyLabel;
    var _seriesColours = [];
    var _drillLevels = [];
    var _originalDimension;
    var _originalGroup;
    var _currentDrillLevel = -1;
    var _showLegend = false;
    var _needLegendRefresh = true;
    var _legendPosition = "Horizontal";
    var _legendSpacing = 15;
    var _legendTitle = function(d) { return d.key + ": " + d.value; };
    var _legendBox;
    var _Lastlength = 0;
    var _fullLength = 0;
    var _legendContainer;
    var _removeZeroes = false;
    var _visible=true;
    //End New Variables
    var slideDiv;
    var slideDivFrame;
    var _popupDrill=false;


     _chart.getSafeAnchor=function() {
        return _chart.anchor().replace('#', '');
    }
    
    _chart.getSafeID=function(id)
    {
        return id.replaceAll(' ','_');
    }
    
    
    var _keyAccessor = function(d) {
        return d.key;
    };
    var _valueAccessor = function(d) {
        return d.value;
    };

    var _label = function(d) {
        return d.key;
    };
    var _renderLabel = false;

    var _title = function(d) {
        return d.key + ": " + d.value;
    };
    var _renderTitle = false;

    var _transitionDuration = 750;

    var _filterPrinter = dc.printers.filters;

    var _renderlets = [];

    var _chartGroup = dc.constants.DEFAULT_CHART_GROUP;

    var NULL_LISTENER = function(chart) {
    };
    var _listeners = {
        preRender: NULL_LISTENER,
        postRender: NULL_LISTENER,
        preRedraw: NULL_LISTENER,
        postRedraw: NULL_LISTENER,
        filtered: NULL_LISTENER,
        zoomed: NULL_LISTENER,
        clickaction: NULL_LISTENER
    };

    var _filters = [];
    var _filterHandler = function(dimension, filters) {
        dimension.filter(null);

        if (filters.length == 0)
            dimension.filter(null);
        else if (filters.length == 1)
            dimension.filter(filters[0]);
        else
            dimension.filterFunction(function(d) {
                return filters.indexOf(d) >= 0;
            });

        return filters;
    };

     
     _chart.CalcDomain=function(k)
     {
        
        return d3.extent(_chart.dimension().group().all(),function(d) {return d.key});
      
   
      
     };
     
      _chart.popupDrill = function(s) {
        if (!arguments.length) return _popupDrill;
        _popupDrill = s;
        return _chart;
    };
     
     _chart.initialFilter = function(d) {
        if (!arguments.length) return _initialFilter;
        _initialFilter = d;
        return _chart;
    };


    _chart.width = function(w) {
        if (!arguments.length) return _width;
        _width = w;
        if (w>0) {   _originalWidth=w;}
        return _chart;
    };

    _chart.height = function(h) {
        if (!arguments.length) return _height;
        _height = h;
        if (h>0) {  _originalHeight=h;}
        return _chart;
    };


    _chart.originalWidth = function(w) {
        if (!arguments.length) return _originalWidth;
        _originalWidth=w;
        return _chart;
    };

    _chart.originalHeight = function(h) {
        if (!arguments.length) return _originalHeight;
         _originalHeight=h;
        return _chart;
    };


    _chart.widthtoheightRatio = function(r) {
        if (!arguments.length) return _widthtoheightRatio;
        _widthtoheightRatio = r;
        return _chart;
    };



    

    _chart.dimension = function(d) {
        if (!arguments.length) return _dimension;
        _dimension = d;
        _chart.expireCache();
        return _chart;
    };

    _chart.group = function(g) {
        if (!arguments.length) return _group;
        _group = g;
        _chart.expireCache();
        return _chart;
    };

    _chart.orderedGroup = function() {
        return _group.order(function(p) {
            return p.key;
        });
    };

    _chart.filterAll = function() {
        return _chart.filter(null);
    };

    _chart.dataSet = function() {
        return _dimension != undefined && _group != undefined;
    };

    _chart.select = function(s) {
        return _root.select(s);
    };

    _chart.selectAll = function(s) {
        return _root ? _root.selectAll(s) : null;
    };

    _chart.anchor = function(a, chartGroup) {
        if (!arguments.length) return _anchor;
        if (dc.instanceOfChart(a)) {
            _anchor = a.anchor();
            _root = a.root();
        } else {
            _anchor = a;
            _root = d3.select(_anchor);
            _root.classed(dc.constants.CHART_CLASS, true);
            dc.registerChart(_chart, chartGroup);
        }
        _chartGroup = chartGroup;
        return _chart;
    };

    _chart.root = function(r) {
        if (!arguments.length) return _root;
        _root = r;
        return _chart;
    };

    _chart.svg = function(_) {
        if (!arguments.length) return _svg;
        _svg = _;
        return _chart;
    };

    _chart.resetSvg = function() {
        _chart.select("svg").remove();
        return _chart.generateSvg();
    };


    _chart.DetermineHeightRatioFromScreen=function()
    {
               
               if (_chart.widthtoheightRatio().length==1)
               {
                 return _chart.widthtoheightRatio()[0];
               }
               else
               {
                          
    switch (screenSize)
    {
               case "S":
                return _chart.widthtoheightRatio()[0];
                break;
     case "M":
          return _chart.widthtoheightRatio()[1];
          break;
case "L":
          return _chart.widthtoheightRatio()[2];
          break;          
          case "XL":
          return _chart.widthtoheightRatio()[3];
          break;
          case "XXL":
          return _chart.widthtoheightRatio()[4];
          break;
    default:
    return _chart.widthtoheightRatio()[0];
    break;
    
    
    }
    }
    
    }

   _chart.SlideOutDrill= function()
{

   $("body").css("overflow", "auto");
   $('body').off('wheel.modal mousewheel.modal');
    slideDiv.transition().duration(2000).style("opacity", 0).style("left", "6000px");
    document.getElementById('disablingDiv').style.display = 'none'
}


_chart.SlideInDrill=function(url)
        {
            
        var height = $(window).height();
      
var scrollTop = $(window).scrollTop();

var min_w = 960;
var h = document.body.offsetHeight;
var w = document.body.offsetWidth;
w = w < min_w ? min_w : w;

// d3.select(parent).append("div").attr("id","disablingDiv");
  $("body").css("overflow", "hidden");
   $('body').on('wheel.modal mousewheel.modal', function () {
      return false;
    });
  
document.getElementById('disablingDiv').style.height = height+ 2000 +"px";
document.getElementById('disablingDiv').style.width = w+"px";
document.getElementById('disablingDiv').style.display = 'block'

            
        
       if (slideDiv==undefined)
       {
       
         // d3.select("#disablingDiv").style("display", "block");
          slideDiv = d3.select(_chart.anchor())
            .append("foreignObject")
            .append("xhtml:div").style("position", "fixed")
 .style("left", "6000px")
 .style("top", "0px")
 .style("width", w + "px")
 .style("height",  "100%")
 .style("opacity","0")
 .style("padding","4px")
 .style("border","2px solid rgba(0,0,0,0.5)")
 //.style("margin","5px 5px")
.style("z-index","1002");
slideDiv.append("a").attr("class","slideClose")
//.style("background-image","url('../images/Close button 88x24.png')")
//.style("a:hover","background-position: 1px -15px")
        
.on("click",function() { _chart.SlideOutDrill(); });;
       //slideDiv.append("svg").attr("width","20px").attr("height","20px").append("rect").attr("width",20).attr("height",20).attr("fill","red").text("CLOSE").on("click",function() { SlideOutDrill(); });
       slideDivFrame=slideDiv.append("xhtml:iframe")
//            .style("position", "absolute")
//  .style("left", "6000px")
 //.style("top","0px" )
 .attr("width", "100%")
 .attr("height", "100%")
 //.style("z-index","1001")
 //.style("opacity", 1)
 .attr("frameborder", 0)
 .style("top", 0)
 .attr("src", url)}
 else
 
 {
  slideDivFrame.attr("src",url);
 }
  slideDiv.transition().duration(2000).style("opacity", 1).style("left", "0px");
        }
        
        


    _chart.generateSvg = function() {

        //var x = d3.select(_chart.root()[0][0].parentNode);
        //var ww = x[0][0].clientWidth;
        //var hh = x[0][0].clientHeight;
             DetermineScreenSize();
                                      
         if (_chart.widthtoheightRatio().length>0 )
             {
             
             var ratio=_chart.DetermineHeightRatioFromScreen();
      
                              //alert(_chart.anchor());
                              //alert(ratio);
                              //alert(_chart.widthtoheightRatio().length);
             _chart.height(_chart.width()*ratio);
              
              //_svg.attr("height",_chart.height()+ "px");
              }



        _svg = _chart.root().append("svg")
        //.attr("width", ww)
        //.attr("height", hh)


            .attr("width", _chart.width() )



            // if (_chart.widthtoheightRatio()>0)
             //{
            //_svg.attr("height",_chart.width()*_chart.widthtoheightRatio());
//               _chart.height( _chart.width()*_chart.widthtoheightRatio());
  //            }
    //        else
      //      {
            .attr("height", _chart.height() )
        //    }
        //.attr('preserveAspectRatio', 'none')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            //.attr('viewBox', '0 0 ' + _chart.originalWidth()+ ' ' + _chart.originalHeight());
             .attr('viewBox', '0 0 ' + _chart.width()+ ' ' + _chart.height());
            // .attr('viewBox', '0 0 ' + _chart.width()+ ' ' + _chart.height());

            if (_visible==false)
            {
             _svg.attr("display","none");
             _svg.attr("opacity",0);
            }

          
        if (_toolTipDiv == null) {
            _toolTipDiv = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0).style("position", "absolute").style("z-index", 100);


        }

        return _svg;
    };

    _chart.resize = function() {
    
        if (_chart.height() != undefined && _chart.width() != undefined) {
            try
        {
            var w=d3.select(_anchor)[0][0].clientWidth
                           
             _chart.width(w);
         
             if (_chart.widthtoheightRatio().length>0 )
             {
             
               var ratio=_chart.DetermineHeightRatioFromScreen();
                  
             _chart.height(w*ratio);
              _svg.attr("height",_chart.height()+ "px");
              }
                 else
                 
                 {
                  _svg.attr("height",_chart.height() + "px");
                 }
                          
                  _svg.attr("width",w + "px");
                  _chart.render();
                        }
                        
                        
            //var x=d3.select(_svg[0][0].parentNode);

            //var ww=x[0][0].clientWidth;
            //var hh=x[0][0].clientHeight;   

            //console.log(_svg[0][0].parentNode);
            //console.log("RESIZE",ww,hh);
            //svg.attr("viewBox","0 0 " + ww + " " + hh); 
            //alert(_svg.attr("viewBox"));  
            //var o=d3.select(_svg[0][0]);
            //console.log(o);
                                
              
               
                //_svg.attr("height", "100%");
                
          

            //}
            catch (err) {

            }
        }
    }

    _chart.filterPrinter = function(_) {
        if (!arguments.length) return _filterPrinter;
        _filterPrinter = _;
        return _chart;
    };

    _chart.turnOnControls = function() {
        if (_root) {
            _chart.selectAll(".reset").style("display", null);
            _chart.selectAll(".filter").text(_filterPrinter(_chart.filters())).style("display", null);
        }
        return _chart;
    };

    _chart.turnOffControls = function() {
        if (_root) {
            _chart.selectAll(".reset").style("display", "none");
            _chart.selectAll(".filter").style("display", "none").text(_chart.filter());
        }
        return _chart;
    };

    //New Properties + Methods

    _chart.SetVisibility=function(v)
    {
     if (v==false)
     {
     _chart.svg().transition().duration(600).style("opacity",0).each("end",function (d) {d3.select(this).style("display","none")});
     _visible=false;
     }
     else
     {
    _chart.svg().transition().duration(600).style("display","inline").style("opacity",1);
     _visible=true;
     }
    
    }
    

    _chart.GetOrdinalValues=function()
    {
        var t = uniqueString(_chart.dimension().group().all(), "key");
        return t;
    
    }

        _chart.visible = function(_) {
        if (!arguments.length) return _visible;
        _visible = _;
        return _chart;
    }
   
   _chart.BuildParameters=function(paramlist)
   {
        var params=getQueryVariable('Parameters');
                               var newParams="";
                                if (params)
                                {
                                  params=unescape(params);
                               newParams=params.replaceAll("'","");
                           
                           paramlist.forEach(function(d) 
                           {
                             newParams=newParams + "|{" + d.ParameterName + ":" + d.ParameterValue + "}";
                             
                           
                           });
                           
                               newParams=escape("'" + newParams + "'");
                                                                
                                }
                                else
                                 {
                                  paramlist.forEach(function(d) 
                           {
                          
                             newParams=escape("'{" + d.ParameterName + ":" + d.ParameterValue + "}'");
                             
                           
                           });
                                }
        return newParams;
   }

    _chart.GetCurrentParameters=function(data)
    {
     var params=getQueryVariable('Parameters');
                               var newParams="";
                                if (params)
                                {
                                  params=unescape(params);
                               newParams=params.replaceAll("'","");
                           
                               newParams= newParams + "|{" +_chart.parameterName() + ":" + data;
                               newParams=newParams + "}";
                               newParams=escape("'" + newParams + "'");
                                                                
                                }
                                else
                                 {
                                  newParams=escape("'{"  +_chart.parameterName() + ":" + data + "}'");
                                }
          return newParams;
    }

    _chart.GetXDomain = function(dimen) {
                         
        var t = uniqueString(dimen.group().all(), "key");
        return t;

    }

       _chart.GetXFromDomain = function() {
                  
        var t = uniqueString(_chart.dimension().group().all(), "key");
        return t;

    }
   
        _chart.parameterName = function(d) {
        if (!arguments.length) return _parameterName;
        _parameterName = d;
        return _chart;
    }

         _chart.parameterKey = function(d) {
        if (!arguments.length) return _parameterKey;
        _parameterKey = d;
        return _chart;
    }

    _chart.GetSeriesLabel = function(groupIndex) {
        var groupLabel = "Series " + groupIndex;
        // alert(_chart.seriesLabels()[groupIndex]);

        try {
            groupLabel = _chart.seriesLabels()[groupIndex];
        }
        catch (e) {

            groupLabel = "Series " + groupIndex;
        }
        if (groupLabel == undefined) { groupLabel = "Series " + groupIndex; }
        return groupLabel;
    }


    _chart.needLegendRefresh = function(_) {
        if (!arguments.length) return _needLegendRefresh;
        _needLegendRefresh = _;
        return _chart;
    }


    _chart.legendContainer = function(_) {
        if (!arguments.length) return _legendContainer;
        _legendContainer = _;
        return _chart;
    }


    _chart.removeZeroes = function(_) {
        if (!arguments.length) return _removeZeroes;
        _removeZeroes = _;
        return _chart;
    }


    _chart.legendBox = function() {

        return _legendBox;
    }


    _chart.Lastlength = function(d) {
        if (!arguments.length) return _Lastlength;
        _Lastlength = d;
    }

    _chart.fullLength = function(d) {
        if (!arguments.length) return _fullLength;
        _fullLength = d;
    }

    _chart.clickEffect = function(d) {
        if (!arguments.length) return _clickEffect;
        _clickEffect = d;
        return _chart;
    }


    _chart.showLegend = function(d) {
        if (!arguments.length) return _showLegend;
        _showLegend = d;
        return _chart;
    }

    _chart.keyLabel = function(l) {
        if (!arguments.length) return _keyLabel;
        _keyLabel = l;
        return _chart;
    }

    _chart.legendTitle = function(_) {
        if (!arguments.length) return _legendTitle;
        _legendTitle = _;

        return _chart;
    };



    _chart.legendPosition = function(d) {
        if (!arguments.length) return _legendPosition;
        _legendPosition = d;
        return _chart;
    }


    _chart.legendSpacing = function(d) {
        if (!arguments.length) return _legendSpacing;
        _legendSpacing = d;
        return _chart;
    }


    _chart.clickAction = function(d) {
        if (!arguments.length) return _clickAction;
        _clickAction = d;
        return _chart;
    }

    _chart.seriesColours = function(_) {
        if (!arguments.length) return _seriesColours;
        _seriesColours = _;
        return _chart;

    }


    _chart.seriesLabels = function(_) {
        if (!arguments.length) return _seriesLabels;
        _seriesLabels = _;
        return _chart;

    }

    _chart.drillLevels = function(_) {
        if (!arguments.length) return _drillLevels;

        _drillLevels = _;
        return _chart;

    }

    _chart.drillIn = function() {

        if (_originalDimension == undefined) {
            _originalDimension = _chart.dimension();
            _originalGroup = _chart.group();
        }

        _currentDrillLevel = _currentDrillLevel + 1;
        if (_currentDrillLevel > _chart.drillLevels().length - 1) {
            alert('No further drill-in available');
            _currentDrillLevel -= 1;
            //_chart.clickEffect("O");
            return _chart;
        }

        _chart.dimension(_chart.drillLevels()[_currentDrillLevel]["Dimen"]);
        _chart.group(_chart.drillLevels()[_currentDrillLevel]["Group"]);

        if (_chart.isOrdinal() == true) {

            // _chart.x(d3.scale.ordinal().domain(_chart.GetXDomain(_chart.dimension())));

            _chart.x(d3.scale.ordinal().domain(uniqueString(_chart.getDataWithinXDomain(_chart.group()), "key")));


            //.scale(_chart.x()).orient("bottom");    
            //         _chart.xAxis().selectAll("text").attr("transform", function(d) {
            //                return "rotate(-65)"});

        }
        _chart.resetUnitCount();

        _chart.resetBarProperties();

        _chart.redraw();

        return _chart;
    }

    _chart.drillOut = function() {

        _currentDrillLevel = _currentDrillLevel - 1;

        if (_currentDrillLevel < -1) {
            alert('No further drill-out available');
            _currentDrillLevel += 1;
            //_chart.clickEffect("I");
            return _chart;
        }

        if (_currentDrillLevel == -1) {
            _chart.dimension(_originalDimension);
            _chart.group(_originalGroup);
        }
        else {

            _chart.dimension(_chart.drillLevels()[_currentDrillLevel]["Dimen"]);
            _chart.group(_chart.drillLevels()[_currentDrillLevel]["Group"]);
        }

        if (_chart.isOrdinal() == true) {

            //_chart.x(d3.scale.ordinal().domain(_chart.GetXDomain(_chart.dimension())));
            _chart.x(d3.scale.ordinal().domain(uniqueString(_chart.getDataWithinXDomain(_chart.group()), "key")));
            _chart.xAxis(_chart.xAxis().scale(_chart.x()));
        }
        _chart.resetUnitCount();
        _chart.resetBarProperties();


        _chart.redraw();
        return _chart;
    }




    _chart.resetLegend = function() {

        if (_chart.showLegend() != true) return;

        _Lastlength = 0;
        _fullLength = 0;
        _chart.needLegendRefresh(true);

        if (_legendBox == undefined) {

            if (_chart.legendContainer() != undefined) {
                _legendBox = d3.select(_chart.legendContainer());
                _legendBox = _legendBox.append("svg").attr("width", 200).attr("height", 200);

            }
            else {

                var pos = _chart.width() - 100;
                _legendBox = _chart.svg().append("g").attr("transform", "translate(" + pos + ",10)");
            }
            //.attr("class", "LEGEND")
            //_legendBox.attr("height", 300)
            //.attr("width", 300)


            //legendBoxG=_legendBox.append("g");
        }
        else {
            _legendBox.selectAll("circle").remove();
            _legendBox.selectAll("text").remove();
        }

    }

    //End of New Properties + Methods

    _chart.transitionDuration = function(d) {
        if (!arguments.length) return _transitionDuration;
        _transitionDuration = d;
        return _chart;
    };

    _chart.render = function() {
        _listeners.preRender(_chart);

        if (_chart.__dc_custom__ == false) {
            if (_dimension == null)
                throw new dc.errors.InvalidStateException("Mandatory attribute chart.dimension is missing on chart["
                + _chart.anchor() + "]");

            if (_group == null)
                throw new dc.errors.InvalidStateException("Mandatory attribute chart.group is missing on chart["
                + _chart.anchor() + "]");
        }
        var result = _chart.doRender();

        _chart.activateRenderlets("postRender");

        return result;
    };

    _chart.activateRenderlets = function(event) {
        if (_chart.transitionDuration() > 0 && _svg) {
            _svg.transition().duration(_chart.transitionDuration())
                .each("end", function() {
                    runAllRenderlets();
                    if (event) _listeners[event](_chart);
                });
        } else {
            runAllRenderlets();
            if (event) _listeners[event](_chart);
        }
    }

    _chart.redraw = function() {
        _listeners.preRedraw(_chart);

        var result = _chart.doRedraw();
        dc.HideToolTip();
        _chart.activateRenderlets("postRedraw");

        return result;
    };

    _chart.invokeFilteredListener = function(chart, f) {
        if (f !== undefined) _listeners.filtered(_chart, f);
    };

    _chart.invokeClickActionListener = function(chart, f, t) {
        if (f != undefined) _listeners.clickaction(_chart, f, t);
    };

    _chart.invokeZoomedListener = function(chart) {
        _listeners.zoomed(_chart);
    };

    _chart.hasFilter = function(filter) {
        if (!arguments.length) return _filters.length > 0;
        return _filters.indexOf(filter) >= 0;
    };

    function removeFilter(_) {
        _filters.splice(_filters.indexOf(_), 1);
        applyFilters();
    }

    function addFilter(_) {
        _filters.push(_);
        applyFilters();
        _chart.invokeFilteredListener(_chart, _);
    }


    function resetFilters() {
        _filters = [];
        applyFilters();
        _chart.invokeFilteredListener(_chart, null);
    }

    function applyFilters() {
        if (_chart.dataSet() && _chart.dimension().filter != undefined) {
            var fs = _filterHandler(_chart.dimension(), _filters);
            _filters = fs ? fs : _filters;
        }
    }

    _chart.filter = function(_) {
        if (!arguments.length) return _filters.length > 0 ? _filters[0] : null;

        if (_ == null) {
            resetFilters();
        } else {
            if (_chart.hasFilter(_))
                removeFilter(_);
            else
                addFilter(_);
        }

        if (_root != null && _chart.hasFilter()) {
            _chart.turnOnControls();
        } else {
            _chart.turnOffControls();
        }

        return _chart;
    };

    _chart.filters = function() {
        return _filters;
    };

    _chart.highlightSelected = function(e) {
        d3.select(e).classed(dc.constants.SELECTED_CLASS, true);
        d3.select(e).classed(dc.constants.DESELECTED_CLASS, false);
    };

    _chart.fadeDeselected = function(e) {
        d3.select(e).classed(dc.constants.SELECTED_CLASS, false);
        d3.select(e).classed(dc.constants.DESELECTED_CLASS, true);
    };

    _chart.resetHighlight = function(e) {
        d3.select(e).classed(dc.constants.SELECTED_CLASS, false);
        d3.select(e).classed(dc.constants.DESELECTED_CLASS, false);
    };


    _chart.popupClick = function(f, m) {

        d3.select(_drillPopupDiv[0][0]).style("opacity", 0).selectAll("p").remove();

        switch (m) {
            case 'IN':
                _chart.dimension().filter(f);
                dc.redrawAll(_chart.chartGroup());
                _chart.drillIn();
                break;
            case 'OUT':
                //_chart.filter(null);
                _chart.drillOut();
                _chart.dimension().filter(null);
                dc.redrawAll(_chart.chartGroup());
                break;


        }

    }

    _chart.onClick = function(d) {
        var filter = _chart.keyAccessor()(d);

        switch (_clickEffect) {
            case 'F':
                //Standard Filter effect as before
               
                dc.events.trigger(function() {
                    _chart.filter(filter);        
                    dc.redrawAll(_chart.chartGroup());
                });
                break;
                case "S":
                //Single filter allowed only, same as above, but cancels all other filters first
                       dc.events.trigger(function() {
                       _chart.filterAll();
                    _chart.filter(filter);        
                    dc.redrawAll(_chart.chartGroup());
                });
                break;
                
                
            case 'P':
                //Popup action (display url in modal popup), url comes from clickAction property with ?filter={0} added
                //alert('Would display popup from URL ' + _clickAction + ' with filter: ' +filter);
                _chart.invokeClickActionListener(_chart, filter, _clickAction);
                break;
                
            case 'D':
                //Drill-through action (go to new page), url comes from clickAction property with ?filter={0} added
                //alert('Would go to dill-through page URL ' + _clickAction + ' with filter: ' +filter);
                window.open(_clickAction + "?filter=" + filter, "_self");
                break;
            case 'C':
                //Click-Through (same as above but designed for use with GetData parameter routines
                //_clickAction should be PageID to go to
                //console.log(_chart.parameterKey());
                var newParams;
                if (_chart.parameterKey()!=undefined)
                {
                newParams=_chart.GetCurrentParameters(d[_chart.parameterKey()]);
                }
                else
                {
                newParams= _chart.GetCurrentParameters(filter);
                }
                //console.log(d);
               //window.open('ViewPage.aspx?PageID=' +_chart.clickAction() + '&Parameters='+ newParams + '', '_self');
              if (_chart.popupDrill())
              {
                    _chart.SlideInDrill('ViewPage.aspx?PageID=' +_clickAction + '&Parameters=' + newParams + '');
              
            }
            else
            {
             
               window.open('ViewPage.aspx?PageID=' +_clickAction + '&Parameters=' + newParams + '', '_self');
               }
                break;
                
            case 'X':
                //Drill Down-Up Action (using DrillLevels)
                //Pop up selection menu to decide whether to go IN or OUT
                var popup;
                if (_drillPopupDiv == null) {
                    popup = d3.select("body").append("div")
    .attr("class", "drillpopup")
    .style("opacity", 1)
    .style("position", "absolute")
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 28) + "px");
                    _drillPopupDiv = popup;

                }
                else {
                    popup = _drillPopupDiv;
                    var dpopup = d3.select(popup);
                    dpopup[0][0].style("opacity", 1).style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 28) + "px");

                }

                d3.select(popup[0][0]).selectAll("p").remove();


                if (_currentDrillLevel < _chart.drillLevels().length - 1) {
                    d3.select(popup[0][0]).append("p").attr("filter", filter).attr("mode", "IN").text("Drill In to " + filter).on("click", function() { var x = d3.select(this); _chart.popupClick(x.attr("filter"), x.attr("mode")); });
                }
                if (_currentDrillLevel >= 0) {
                    d3.select(popup[0][0]).append("p").attr("filter", filter).attr("mode", "OUT").text("Drill Out of " + filter).on("click", function() { var x = d3.select(this); _chart.popupClick(x.attr("filter"), x.attr("mode")); });
                }





                break;
            case 'I':

                _chart.dimension().filter(filter);
                //_chart.filter(filter);

                _chart.drillIn();
                //Drill-In (on same page, i.e. switch dimension,group and timescale)
                break;
            case 'O':
                _chart.filter(null);
                //Drill-out (on same page, i.e. switch dimension,group and timescale)
                _chart.drillOut();
                break;
            case 'N':
                //Do nothing, this may be needed as we have now enabled click events where they weren't before!
                break;
        }


    };

    _chart.filterHandler = function(_) {
        if (!arguments.length) return _filterHandler;
        _filterHandler = _;
        return _chart;
    };

    // abstract function stub
    _chart.doRender = function() {
        // do nothing in base, should be overridden by sub-function
        return _chart;
    };

    _chart.doRedraw = function() {
        // do nothing in base, should be overridden by sub-function
        return _chart;
    };

    _chart.keyAccessor = function(_) {
        if (!arguments.length) return _keyAccessor;
        _keyAccessor = _;
        return _chart;
    };

    _chart.valueAccessor = function(_) {
        if (!arguments.length) return _valueAccessor;
        _valueAccessor = _;
        return _chart;
    };

    _chart.label = function(_) {
        if (!arguments.length) return _label;
        _label = _;
        _renderLabel = true;
        return _chart;
    };

    _chart.renderLabel = function(_) {
        if (!arguments.length) return _renderLabel;
        _renderLabel = _;
        return _chart;
    };

    _chart.title = function(_) {
        if (!arguments.length) return _title;
        _title = _;
        _renderTitle = true;
        return _chart;
    };

    _chart.renderTitle = function(_) {
        if (!arguments.length) return _renderTitle;
        _renderTitle = _;
        return _chart;
    };

    _chart.renderlet = function(_) {
        _renderlets.push(_);
        return _chart;
    };

    function runAllRenderlets() {
        for (var i = 0; i < _renderlets.length; ++i) {
            _renderlets[i](_chart);
        }
    };

    _chart.chartGroup = function(_) {
        if (!arguments.length) return _chartGroup;
        _chartGroup = _;
        return _chart;
    };

    _chart.on = function(event, listener) {
        _listeners[event] = listener;
        return _chart;
    };

    _chart.expireCache = function() {
        // do nothing in base, should be overridden by sub-function
        return _chart;
    };

    return _chart;
};
dc.marginable = function(_chart) {
    var _margin = { top: 10, right: 50, bottom: 30, left: 30 };

    _chart.margins = function(m) {
        if (!arguments.length) return _margin;
        _margin = m;
        return _chart;
    };

    _chart.effectiveWidth = function() {
        return _chart.width() - _chart.margins().left - _chart.margins().right;
    };

    _chart.effectiveHeight = function() {
        return _chart.height() - _chart.margins().top - _chart.margins().bottom;
    };

    return _chart;
}; dc.coordinateGridChart = function(_chart) {
    var DEFAULT_Y_AXIS_TICKS = 5;
    var GRID_LINE_CLASS = "grid-line";
    var HORIZONTAL_CLASS = "horizontal";
    var VERTICAL_CLASS = "vertical";

    _chart = dc.marginable(dc.baseChart(_chart));

    var _parent;
    var _g;
    var _chartBodyG;

    var _x;
    var _xOriginalDomain;
    var _xAxis = d3.svg.axis();
    var _xUnits = dc.units.integers;
    var _xAxisPadding = 0;
    var _xAxisTickPadding=0;
    var _xAxisTicksHidden=false;
    var _xAxisOffset = 0;
    var _xElasticity = false;

    var _y;
    var _yAxis = d3.svg.axis();
    var _yAxisPadding = 0;
    var _yElasticity = false;
    var _yAxisTicksHidden=false;
    
    var _showYAxis=true;
    var _showXAxis=true;

    var _brush = d3.svg.brush();
    var _brushOn = true;
    var _round;

    var _renderHorizontalGridLine = false;
    var _renderVerticalGridLine = false;

    var _refocused = false;
    var _unitCount;

    var _rangeChart;
    var _focusChart;

    var _mouseZoomable = false;
    var _clipPadding = 5;

    var _verticalXAxis = false;


    
     _chart.showYAxis = function(_) {
        if (!arguments.length) return _showYAxis;
        _showYAxis = _;

        return _chart;
    }
       _chart.showXAxis = function(_) {
        if (!arguments.length) return _showXAxis;
        _showXAxis = _;

        return _chart;
    }
    _chart.verticalXAxis = function(_) {
        if (!arguments.length) return _verticalXAxis;
        _verticalXAxis = _;

        return _chart;
    }

    _chart.resetUnitCount = function() {
        _unitCount = null;
        _chart.xUnitCount();
    }

    _chart.rangeChart = function(_) {
        if (!arguments.length) return _rangeChart;
        _rangeChart = _;
        _rangeChart.focusChart(_chart);
        return _chart;
    }

    _chart.generateG = function(parent) {
        if (parent == null)
            _parent = _chart.svg();
        else
            _parent = parent;

        _g = _parent.append("g");

        _chartBodyG = _g.append("g").attr("class", "chartBody")
            .attr("clip-path", "url(#" + getClipPathId() + ")");

        return _g;
    };

    _chart.g = function(_) {
        if (!arguments.length) return _g;
        _g = _;
        return _chart;
    };

    _chart.mouseZoomable = function(z) {
        if (!arguments.length) return _mouseZoomable;
        _mouseZoomable = z;
        return _chart;
    };

    _chart.chartBodyG = function(_) {
        if (!arguments.length) return _chartBodyG;
        _chartBodyG = _;
        return _chart;
    };

    _chart.x = function(_) {
        if (!arguments.length) return _x;
        _x = _;
        _xOriginalDomain = _x.domain();
        return _chart;
    };

    _chart.xOriginalDomain = function() {
        return _xOriginalDomain;
    };

    _chart.xUnits = function(_) {
        if (!arguments.length) return _xUnits;
        _xUnits = _;
        return _chart;
    };

    _chart.xAxis = function(_) {
        if (!arguments.length) return _xAxis;
        _xAxis = _;
        return _chart;
    };

    _chart.elasticX = function(_) {
        if (!arguments.length) return _xElasticity;
        _xElasticity = _;
        return _chart;
    };

    _chart.xAxisPadding = function(_) {
        if (!arguments.length) return _xAxisPadding;
        _xAxisPadding = _;
        return _chart;
    };

    _chart.xAxisTickPadding = function(_) {
        if (!arguments.length) return _xAxisTickPadding;
        _xAxisTickPadding = _;
        return _chart;
    };
         _chart.xAxisTicksHidden = function(_) {
        if (!arguments.length) return _xAxisTicksHidden;
        _xAxisTicksHidden = _;
        return _chart;
    };
               _chart.yAxisTicksHidden = function(_) {
        if (!arguments.length) return _yAxisTicksHidden;
        _yAxisTicksHidden = _;
        return _chart;
    };


     
    _chart.xAxisOffset = function(_) {
        if (!arguments.length) return _xAxisOffset;
        _xAxisOffset = _;
        return _chart;
    };


    _chart.xUnitCount = function() {
        if (_unitCount == null) {
            var units = _chart.xUnits()(_chart.x().domain()[0], _chart.x().domain()[1], _chart.x().domain());

            if (units instanceof Array)
                _unitCount = units.length;
            else
                _unitCount = units;
        }

        return _unitCount;
    };

    _chart.isOrdinal = function() {
        return _chart.xUnits() === dc.units.ordinal;
    };

    _chart.prepareOrdinalXAxis = function(count) {
        if (!count)
            count = _chart.xUnitCount();
        var range = [];
        var currentPosition = 0;
        var increment = _chart.xAxisLength() / count;
        for (var i = 0; i < count; i++) {
            range[i] = currentPosition;
            currentPosition += increment;
        }
        _x.range(range);
    };

    function prepareXAxis(g) {
        if (_chart.elasticX() && !_chart.isOrdinal()) {
            _x.domain([_chart.xAxisMin(), _chart.xAxisMax()]);
        }

        if (_chart.isOrdinal()) {
            _chart.prepareOrdinalXAxis();
        } else {
            _x.range([0, _chart.xAxisLength()]);
        }

        _xAxis = _xAxis.scale(_chart.x()).orient("bottom");

         _xAxis.tickPadding(_chart.xAxisTickPadding());
         if (_chart.xAxisTicksHidden())
         {
          _chart.xAxis().tickSize(0,0);
          }
        renderVerticalGridLines(g);
    }

    _chart.renderXAxis = function(g) {
    
      if (_chart.showXAxis()==true)
    {
        var axisXG = g.selectAll("g.x");

        if (axisXG.empty())
            axisXG = g.append("g")
                .attr("class", "axis x")
                .attr("transform", "translate(" + (_chart.margins().left + _chart.xAxisOffset()) + "," + _chart.xAxisY() + ")");

        dc.transition(axisXG, _chart.transitionDuration())
            .call(_xAxis);
        //Do we want vertical axis?
        var tickWidth=((_chart.width()-_chart.margins().left)/_xAxis.scale().range().length);
        
        
          
        if (_chart.verticalXAxis() == true) {
            d3.select(_chart.xAxis(_chart.xAxis().scale(_chart.x())).selectAll("text").attr("transform", function(d) { return "rotate(-90) translate(0,-" + d3.select(this).attr("y") + ")"; }).attr("dx",-10).attr("dy",function(d) {return tickWidth/2}).style("text-anchor", "end"));
        }
        else
         {
           d3.select(_chart.xAxis(_chart.xAxis().scale(_chart.x())).selectAll("text").attr("transform", function(d) { return "translate(0," + d3.select(this).attr("y") + ")"; }).attr("dy",15).attr("dx",function(d) {return tickWidth/2}).style("text-anchor", "middle"));
        }
          }
    };

    function renderVerticalGridLines(g) {
        if (_renderVerticalGridLine) {
            var gridLineG = g.selectAll("g." + VERTICAL_CLASS);

            if (gridLineG.empty())
                gridLineG = g.insert("g", ":first-child")
                    .attr("class", GRID_LINE_CLASS + " " + VERTICAL_CLASS)
                    .attr("transform", "translate(" + _chart.yAxisX() + "," + _chart.margins().top + ")");

            var ticks = _xAxis.tickValues() ? _xAxis.tickValues() : _x.ticks(_xAxis.ticks()[0]);

            var lines = gridLineG.selectAll("line")
                .data(ticks);

            // enter
            var linesGEnter = lines.enter()
                .append("line")
                .attr("x1", function(d) {
                    return _x(d);
                })
                .attr("y1", _chart.xAxisY() - _chart.margins().top)
                .attr("x2", function(d) {
                    return _x(d);
                })
                .attr("y2", 0)
                .attr("opacity", 0);
            dc.transition(linesGEnter, _chart.transitionDuration())
                .attr("opacity", 1);

            // update
            dc.transition(lines, _chart.transitionDuration())
                .attr("x1", function(d) {
                    return _x(d);
                })
                .attr("y1", _chart.xAxisY() - _chart.margins().top)
                .attr("x2", function(d) {
                    return _x(d);
                })
                .attr("y2", 0);

            // exit
            lines.exit().remove();
        }
    }

    _chart.xAxisY = function() {
        return (_chart.height() - _chart.margins().bottom);
    };

    _chart.xAxisLength = function() {
        return _chart.effectiveWidth();
    };

    function prepareYAxis(g) {
        if (_y == null || _chart.elasticY()) {
            _y = d3.scale.linear();
            _y.domain([_chart.yAxisMin(), _chart.yAxisMax()]).rangeRound([_chart.yAxisHeight(), 0]);
        }

        _y.range([_chart.yAxisHeight(), 0]);
        _yAxis = _yAxis.scale(_y).orient("left").ticks(DEFAULT_Y_AXIS_TICKS);

         if (_chart.yAxisTicksHidden())
         {
          _chart.yAxis().tickSize(0,0);
          }

        renderHorizontalGridLines(g);
    }

    _chart.renderYAxis = function(g) {
    if (_chart.showYAxis()==true)
    {
        var axisYG = g.selectAll("g.y");
       if (axisYG.empty())
            axisYG = g.append("g")
                .attr("class", "axis y")
                .attr("transform", "translate(" + _chart.yAxisX() + "," + _chart.margins().top + ")");

        dc.transition(axisYG, _chart.transitionDuration())
            .call(_yAxis);
            }
    };

    function renderHorizontalGridLines(g) {
        if (_renderHorizontalGridLine) {
            var gridLineG = g.selectAll("g." + HORIZONTAL_CLASS);

            var ticks = _yAxis.tickValues() ? _yAxis.tickValues() : _y.ticks(_yAxis.ticks()[0]);

            if (gridLineG.empty())
                gridLineG = g.insert("g", ":first-child")
                    .attr("class", GRID_LINE_CLASS + " " + HORIZONTAL_CLASS)
                    .attr("transform", "translate(" + _chart.yAxisX() + "," + _chart.margins().top + ")");

            var lines = gridLineG.selectAll("line")
                .data(ticks);

            // enter
            var linesGEnter = lines.enter()
                .append("line")
                .attr("x1", 1)
                .attr("y1", function(d) {
                    return _y(d);
                })
                .attr("x2", _chart.xAxisLength())
                .attr("y2", function(d) {
                    return _y(d);
                })
                .attr("opacity", 0);
            dc.transition(linesGEnter, _chart.transitionDuration())
                .attr("opacity", 1);

            // update
            dc.transition(lines, _chart.transitionDuration())
                .attr("x1", 1)
                .attr("y1", function(d) {
                    return _y(d);
                })
                .attr("x2", _chart.xAxisLength())
                .attr("y2", function(d) {
                    return _y(d);
                });

            // exit
            lines.exit().remove();
        }
    }

    _chart.yAxisX = function() {
        return _chart.margins().left;
    };

    _chart.y = function(_) {
        if (!arguments.length) return _y;
        _y = _;
        return _chart;
    };

    _chart.yAxis = function(y) {
        if (!arguments.length) return _yAxis;
        _yAxis = y;
        return _chart;
    };

    _chart.elasticY = function(_) {
        if (!arguments.length) return _yElasticity;
        _yElasticity = _;
        return _chart;
    };

    _chart.renderHorizontalGridLines = function(_) {
        if (!arguments.length) return _renderHorizontalGridLine;
        _renderHorizontalGridLine = _;
        return _chart;
    };

    _chart.renderVerticalGridLines = function(_) {
        if (!arguments.length) return _renderVerticalGridLine;
        _renderVerticalGridLine = _;
        return _chart;
    };

    _chart.xAxisMin = function() {
        var min = d3.min(_chart.group().all(), function(e) {
            return _chart.keyAccessor()(e);
        });
        return dc.utils.subtract(min, _xAxisPadding);
    };

    _chart.xAxisMax = function() {
        var max = d3.max(_chart.group().all(), function(e) {
            return _chart.keyAccessor()(e);
        });
        return dc.utils.add(max, _xAxisPadding);
    };

    _chart.yAxisMin = function() {
        var min = d3.min(_chart.group().all(), function(e) {
            return _chart.valueAccessor()(e);
        });
        min = dc.utils.subtract(min, _yAxisPadding);
        return min;
    };

    _chart.yAxisMax = function() {
        var max = d3.max(_chart.group().all(), function(e) {
            return _chart.valueAccessor()(e);
        });
        max = dc.utils.add(max, _yAxisPadding);
        return max;
    };

    _chart.yAxisPadding = function(_) {
        if (!arguments.length) return _yAxisPadding;
        _yAxisPadding = _;
        return _chart;
    };

    _chart.yAxisHeight = function() {
        return _chart.effectiveHeight();
    };

    _chart.round = function(_) {
        if (!arguments.length) return _round;
        _round = _;
        return _chart;
    };

    dc.override(_chart, "filter", function(_) {
        if (!arguments.length) return _chart._filter();

        _chart._filter(_);

        if (_) {
            _chart.brush().extent(_);
        } else {
            _chart.brush().clear();
        }

        return _chart;
    });

    _chart.brush = function(_) {
        if (!arguments.length) return _brush;
        _brush = _;
        return _chart;
    };

    function brushHeight() {
        return _chart.xAxisY() - _chart.margins().top;
    }

    _chart.renderBrush = function(g) {
        if (_chart.isOrdinal())
            _brushOn = false;

        if (_brushOn) {
            _brush.on("brushstart", brushStart)
                .on("brush", brushing)
                .on("brushend", brushEnd);

            var gBrush = g.append("g")
                .attr("class", "brush")
                .attr("transform", "translate(" + _chart.margins().left + "," + _chart.margins().top + ")")
                .call(_brush.x(_chart.x()));
            gBrush.selectAll("rect").attr("height", brushHeight());
            gBrush.selectAll(".resize").append("path").attr("d", _chart.resizeHandlePath);

            if (_chart.hasFilter()) {
                _chart.redrawBrush(g);
            }
        }
    };

    function brushStart(p) {
    }

    _chart.extendBrush = function() {
        var extent = _brush.extent();
        if (_chart.round()) {
            extent[0] = extent.map(_chart.round())[0];
            extent[1] = extent.map(_chart.round())[1];

            _g.select(".brush")
                .call(_brush.extent(extent));
        }
        return extent;
    };

    _chart.brushIsEmpty = function(extent) {
        return _brush.empty() || !extent || extent[1] <= extent[0];
    };

    function brushing(p) {
        var extent = _chart.extendBrush();

        _chart.redrawBrush(_g);

        if (_chart.brushIsEmpty(extent)) {
            dc.events.trigger(function() {
                _chart.filter(null);
                dc.redrawAll(_chart.chartGroup());
            });
        } else {
            dc.events.trigger(function() {
                _chart.filter(null);
                _chart.filter([extent[0], extent[1]]);
                dc.redrawAll(_chart.chartGroup());
            }, dc.constants.EVENT_DELAY);
        }
    }

    function brushEnd(p) {
    }

    _chart.redrawBrush = function(g) {
        if (_brushOn) {
            if (_chart.filter() && _chart.brush().empty())
                _chart.brush().extent(_chart.filter());

            var gBrush = g.select("g.brush");
            gBrush.call(_chart.brush().x(_chart.x()));
            gBrush.selectAll("rect").attr("height", brushHeight());
        }

        _chart.fadeDeselectedArea();
    };

    _chart.fadeDeselectedArea = function() {
        // do nothing, sub-chart should override this function
    };

    // borrowed from Crossfilter example
    _chart.resizeHandlePath = function(d) {
        var e = +(d == "e"), x = e ? 1 : -1, y = brushHeight() / 3;
        return "M" + (.5 * x) + "," + y
            + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
            + "V" + (2 * y - 6)
            + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
            + "Z"
            + "M" + (2.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8)
            + "M" + (4.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8);
    };

    function getClipPathId() {
        return _chart.anchor().replace('#', '') + "-clip";
    }

    _chart.clipPadding = function(p) {
        if (!arguments.length) return _clipPadding;
        _clipPadding = p;
        return _chart;
    };

    function generateClipPath() {
        var defs = dc.utils.appendOrSelect(_parent, "defs");

        var chartBodyClip = dc.utils.appendOrSelect(defs, "clipPath").attr("id", getClipPathId());

        dc.utils.appendOrSelect(chartBodyClip, "rect")
            .attr("x", _chart.margins().left - _clipPadding)
            .attr("y", _chart.margins().top - _clipPadding)
            .attr("width", _chart.xAxisLength() + _clipPadding * 2)
            .attr("height", _chart.yAxisHeight() + _clipPadding * 2);
    }

    _chart.doRender = function() {
        if (_x == null)
            throw new dc.errors.InvalidStateException("Mandatory attribute chart.x is missing on chart["
                + _chart.anchor() + "]");

        _chart.resetSvg();

        if (_chart.dataSet()) {
            _chart.generateG();

            generateClipPath();
            prepareXAxis(_chart.g());
            prepareYAxis(_chart.g());

            _chart.resetLegend();
            _chart.plotData();

            _chart.renderXAxis(_chart.g());
            _chart.renderYAxis(_chart.g());

            _chart.renderBrush(_chart.g());

            enableMouseZoom();
        }

        return _chart;
    };

    function enableMouseZoom() {
        if (_mouseZoomable) {
            _chart.root().call(d3.behavior.zoom()
                .x(_chart.x())
                .scaleExtent([1, 100])
                .on("zoom", function() {
                    _chart.focus(_chart.x().domain());
                    _chart.invokeZoomedListener(_chart);
                    updateRangeSelChart();
                }));
        }
    }

    function updateRangeSelChart() {
        if (_rangeChart) {
            var refDom = _chart.x().domain();
            var origDom = _rangeChart.xOriginalDomain();
            var newDom = [
                refDom[0] < origDom[0] ? refDom[0] : origDom[0],
                refDom[1] > origDom[1] ? refDom[1] : origDom[1]];
            _rangeChart.focus(newDom);
            _rangeChart.filter(null);
            _rangeChart.filter(refDom);

            dc.events.trigger(function() {
                dc.redrawAll(_chart.chartGroup());
            });
        }
    }

    _chart.doRedraw = function() {
        prepareXAxis(_chart.g());
        prepareYAxis(_chart.g());

        _chart.plotData();

        if (_chart.elasticY())
            _chart.renderYAxis(_chart.g());

        if (_chart.elasticX() || _refocused)
            _chart.renderXAxis(_chart.g());

        _chart.redrawBrush(_chart.g());

        return _chart;
    };

    _chart.subRender = function() {
        if (_chart.dataSet()) {
            _chart.plotData();
        }

        return _chart;
    };

    _chart.brushOn = function(_) {
        if (!arguments.length) return _brushOn;
        _brushOn = _;
        return _chart;
    };

    _chart.getDataWithinXDomain = function(group) {
        var data = [];

        if (_chart.removeZeroes() == true) {

            var d2 = [];
            group.all().forEach(function(d) {
                var key = _chart.keyAccessor()(d);
                var value = _chart.valueAccessor()(d);
                if (value > 0) {
                    d2.push(d);
                }
                else {
                    //Remove value from Domain

                    //var p=_chart.x().domain().indexOf(key);
                    //console.log(key,p);
                    //_chart.x().domain(_chart.x().domain().splice(p+1,1));


                }
            });
            //Reset Domain
            _chart.x().domain("");

            return d2;
        }

        if (_chart.isOrdinal()) {
            data = group.all();
        } else {
            group.all().forEach(function(d) {
                var key = _chart.keyAccessor()(d);
                if (key >= _chart.x().domain()[0] && key <= _chart.x().domain()[1])
                    data.push(d);
            });
        }

        return data;
    };

    function hasRangeSelected(range) {
        return range != null && range != undefined && range instanceof Array && range.length > 1;
    }

    _chart.focus = function(range) {
        _refocused = true;

        if (hasRangeSelected(range)) {
            _chart.x().domain(range);
        } else {
            _chart.x().domain(_chart.xOriginalDomain());
        }

        if (typeof (_chart.resetUnitCount) != 'undefined') {
            _chart.resetUnitCount();
        }
        if (typeof (_chart.resetBarProperties) != 'undefined') {
            _chart.resetBarProperties();
        }
        _chart.redraw();

        if (!hasRangeSelected(range))
            _refocused = false;
    };

    _chart.refocused = function() {
        return _refocused;
    };

    _chart.focusChart = function(c) {
        if (!arguments.length) return _focusChart;
        _focusChart = c;
        _chart.on("filtered", function(chart) {
            dc.events.trigger(function() {
                _focusChart.focus(chart.filter());
                dc.redrawAll(chart.chartGroup());
            });
        });
        return _chart;
    };

    return _chart;
};
dc.colorChart = function(_chart) {
    var _colors = d3.scale.category20c();

    var _colorDomain = [0, _colors.range().length];

    var _colorCalculator = function(value) {
        var minValue = _colorDomain[0];
        var maxValue = _colorDomain[1];

        if (isNaN(value)) value = 0;
        if (maxValue == null) return _colors(value);

        var colorsLength = _chart.colors().range().length;
        var denominator = (maxValue - minValue) / colorsLength;
        var colorValue = Math.abs(Math.min(colorsLength - 1, Math.round((value - minValue) / denominator)));
        return _chart.colors()(colorValue);
    };

    var _colorAccessor = function(d, i) { return i; };

    _chart.colors = function(_) {
        if (!arguments.length) return _colors;

        if (_ instanceof Array) {
            _colors = d3.scale.ordinal().range(_);
            var domain = [];
            for (var i = 0; i < _.length; ++i) {
                domain.push(i);
            }
            _colors.domain(domain);
        } else {
            _colors = _;
        }

        _colorDomain = [0, _colors.range().length];

        return _chart;
    };

    _chart.colorCalculator = function(_) {
        if (!arguments.length) return _colorCalculator;
        _colorCalculator = _;
        return _chart;
    };

    _chart.getColor = function(d, i) {
        return _colorCalculator(_colorAccessor(d, i));
    };

    _chart.colorAccessor = function(_) {
        if (!arguments.length) return _colorAccessor;
        _colorAccessor = _;
        return _chart;
    };

    _chart.colorDomain = function(_) {
        if (!arguments.length) return _colorDomain;
        _colorDomain = _;
        return _chart;
    };

    return _chart;
};
dc.stackableChart = function(_chart) {
    var MIN_DATA_POINT_HEIGHT = 0;

    var _groupStack = new dc.utils.GroupStack();
    var _groupStyles= new dc.utils.StyleInfo();
    var _allGroups;
    var _allValueAccessors;
    var _allKeyAccessors;
    var _mergeStacks=false;
    
    _chart.stack = function(group, retriever,style) {
        _groupStack.setDefaultAccessor(_chart.valueAccessor());
        _groupStack.addGroup(group, retriever);

             
        _groupStyles.SetGroupStyle(_groupStack.size(),style);
      

        _chart.expireCache();

        return _chart;
    };

    _chart.groupStyles=function()
    {
    
     return _groupStyles;
    }

    _chart.mergeStacks=function(_)
    {
          if (!arguments.length) return _mergeStacks;
        _mergeStacks = _;
        return _chart;
    }

    _chart.expireCache = function() {
        _allGroups = null;
        _allValueAccessors = null;
        _allKeyAccessors = null;
        return _chart;
    };

    _chart.allGroups = function() {
        if (_allGroups == null) {
            _allGroups = [];

            _allGroups.push(_chart.group());

            for (var i = 0; i < _groupStack.size(); ++i)
                _allGroups.push(_groupStack.getGroupByIndex(i));
        }

        return _allGroups;
    };

    _chart.allValueAccessors = function() {
        if (_allValueAccessors == null) {
            _allValueAccessors = [];

            _allValueAccessors.push(_chart.valueAccessor());

            for (var i = 0; i < _groupStack.size(); ++i)
                _allValueAccessors.push(_groupStack.getAccessorByIndex(i));
        }

        return _allValueAccessors;
    };

    _chart.getValueAccessorByIndex = function(groupIndex) {
        return _chart.allValueAccessors()[groupIndex];
    };

    _chart.yAxisMin = function() {
        var min = 0;
        var allGroups = _chart.allGroups();

        for (var groupIndex = 0; groupIndex < allGroups.length; ++groupIndex) {
            var group = allGroups[groupIndex];
            var m = dc.utils.groupMin(group, _chart.getValueAccessorByIndex(groupIndex));
            if (m < min) min = m;
        }

        if (min < 0) {
            min = 0;
            for (var groupIndex = 0; groupIndex < allGroups.length; ++groupIndex) {
                var group = allGroups[groupIndex];
                min += dc.utils.groupMin(group, _chart.getValueAccessorByIndex(groupIndex));
            }
        }

        min = dc.utils.subtract(min, _chart.yAxisPadding());

        return min;
    };

    _chart.yAxisMax = function() {
        var max = 0;
        var allGroups = _chart.allGroups();

        for (var groupIndex = 0; groupIndex < allGroups.length; ++groupIndex) {
            var group = allGroups[groupIndex];
                    
                    if (_mergeStacks)
                    {
                           var m=dc.utils.groupMax(group, _chart.getValueAccessorByIndex(groupIndex));
                           
                           if (m>max) max=m;
                    }
                    else
                    {
                    max += dc.utils.groupMax(group, _chart.getValueAccessorByIndex(groupIndex));
                    }
        }
                 if (_mergeStacks)
                 {
                 // max+=max/6;
                 }
        max = dc.utils.add(max, _chart.yAxisPadding());
                  
        return max;
    };

    _chart.allKeyAccessors = function() {
        if (_allKeyAccessors == null) {
            _allKeyAccessors = [];

            _allKeyAccessors.push(_chart.keyAccessor());

            for (var i = 0; i < _groupStack.size(); ++i)
                _allKeyAccessors.push(_chart.keyAccessor());
        }

        return _allKeyAccessors;
    };

    _chart.getKeyAccessorByIndex = function(groupIndex) {
        return _chart.allKeyAccessors()[groupIndex];
    };

    _chart.xAxisMin = function() {
        var min = null;
        var allGroups = _chart.allGroups();

        for (var groupIndex = 0; groupIndex < allGroups.length; ++groupIndex) {
            var group = allGroups[groupIndex];
            var m = dc.utils.groupMin(group, _chart.getKeyAccessorByIndex(groupIndex));
            if (min == null || min > m) min = m;
        }

        return dc.utils.subtract(min, _chart.xAxisPadding());
    };

    _chart.xAxisMax = function() {
        var max = null;
        var allGroups = _chart.allGroups();

        for (var groupIndex = 0; groupIndex < allGroups.length; ++groupIndex) {
            var group = allGroups[groupIndex];
            var m = dc.utils.groupMax(group, _chart.getKeyAccessorByIndex(groupIndex));
            if (max == null || max < m) max = m;
        }

        return dc.utils.add(max, _chart.xAxisPadding());
    };

    _chart.baseLineY = function() {
        return _chart.y()(0);
    }

    _chart.dataPointBaseline = function() {
        return _chart.margins().top + _chart.baseLineY();
    };

    function getValueFromData(groupIndex, d) {
           return _chart.getValueAccessorByIndex(groupIndex)(d);
    }

    _chart.dataPointHeight = function(d, groupIndex) {
        var value = getValueFromData(groupIndex, d);
        var yPosition = _chart.y()(value);
        var zeroPosition = _chart.baseLineY();
        var h = 0;

        if (value > 0)
            h = zeroPosition - yPosition;
        else
            h = yPosition - zeroPosition;

        if (isNaN(h) || h < MIN_DATA_POINT_HEIGHT)
            h = MIN_DATA_POINT_HEIGHT;

        return h;
    };

    function calculateDataPointMatrix(data, groupIndex) {
        for (var dataIndex = 0; dataIndex < data.length; ++dataIndex) {
            var d = data[dataIndex];
            var value = getValueFromData(groupIndex, d);
          
            var pseudoZero = 1e-13;
            
                       if (value > pseudoZero)
                    _groupStack.setDataPoint(groupIndex, dataIndex, _chart.dataPointBaseline() - _chart.dataPointHeight(d, groupIndex));
                else
                    _groupStack.setDataPoint(groupIndex, dataIndex, _chart.dataPointBaseline());
            
            if (groupIndex == 0) {
                if (value > pseudoZero)
                    _groupStack.setDataPoint(groupIndex, dataIndex, _chart.dataPointBaseline() - _chart.dataPointHeight(d, groupIndex));
                else  
                    _groupStack.setDataPoint(groupIndex, dataIndex, _chart.dataPointBaseline());
            } else {
            
            if (_mergeStacks)
            {
            
            _groupStack.setDataPoint(groupIndex, dataIndex, _groupStack.getDataPoint(groupIndex , dataIndex));
            }
            else
            {
                
                if (value > pseudoZero)
                    _groupStack.setDataPoint(groupIndex, dataIndex, _groupStack.getDataPoint(groupIndex , dataIndex) - _chart.dataPointHeight(d, groupIndex))
                else if (value < -pseudoZero)
                    _groupStack.setDataPoint(groupIndex, dataIndex, _groupStack.getDataPoint(groupIndex , dataIndex) + _chart.dataPointHeight(d, groupIndex - 1))
                else // value ~= 0
                    _groupStack.setDataPoint(groupIndex, dataIndex, _groupStack.getDataPoint(groupIndex, dataIndex))
             }       
            }
        }
    }

    _chart.calculateDataPointMatrixForAll = function(groups) {
        for (var groupIndex = 0; groupIndex < groups.length; ++groupIndex) {
            var group = groups[groupIndex];
            var data = group.all();

            calculateDataPointMatrix(data, groupIndex);
        }
    };

    _chart.calculateDataPointMatrixWithinXDomain = function(groups) {
        for (var groupIndex = 0; groupIndex < groups.length; ++groupIndex) {
            var group = groups[groupIndex];
            var data = _chart.getDataWithinXDomain(group);

            calculateDataPointMatrix(data, groupIndex);
        }
    };

    _chart.getChartStack = function() {
        return _groupStack;
    };

    dc.override(_chart, "valueAccessor", function(_) {
        if (!arguments.length) return _chart._valueAccessor();
        _chart.expireCache();
        return _chart._valueAccessor(_);
    });

    dc.override(_chart, "keyAccessor", function(_) {
        if (!arguments.length) return _chart._keyAccessor();
        _chart.expireCache();
        return _chart._keyAccessor(_);
    });

    return _chart;
};
dc.abstractBubbleChart = function(_chart) {
    var _maxBubbleRelativeSize = 0.3;
    var _minRadiusWithLabel = 10;

    _chart.BUBBLE_NODE_CLASS = "node";
    _chart.BUBBLE_CLASS = "bubble";
    _chart.MIN_RADIUS = 10;

    _chart = dc.colorChart(_chart);

    _chart.renderLabel(true);
    _chart.renderTitle(false);

    var _r = d3.scale.linear().domain([0, 100]);

    var _rValueAccessor = function(d) {
        return d.r;
    };

    _chart.r = function(_) {
        if (!arguments.length) return _r;
        _r = _;
        return _chart;
    };

    _chart.radiusValueAccessor = function(_) {
        if (!arguments.length) return _rValueAccessor;
        _rValueAccessor = _;
        return _chart;
    };

    _chart.rMin = function() {
        var min = d3.min(_chart.group().all(), function(e) {
            return _chart.radiusValueAccessor()(e);
        });
        return min;
    };

    _chart.rMax = function() {
        var max = d3.max(_chart.group().all(), function(e) {
            return _chart.radiusValueAccessor()(e);
        });
        return max;
    };

    _chart.bubbleR = function(d) {
        var value = _chart.radiusValueAccessor()(d);
        var r = _chart.r()(value);
        if (isNaN(r) || value <= 0)
            r = 0;
        return r;
    };

    var labelFunction = function(d) {
        return _chart.label()(d);
    };

    var labelOpacity = function(d) {
        return (_chart.bubbleR(d) > _minRadiusWithLabel) ? 1 : 0;
    };

    _chart.doRenderLabel = function(bubbleGEnter) {
        if (_chart.renderLabel()) {
            var label = bubbleGEnter.select("text");

            if (label.empty()) {
                label = bubbleGEnter.append("text")
                    .attr("text-anchor", "middle")
                    .attr("dy", ".3em")
                    .on("click", _chart.onClick);
            }

            label
                .attr("opacity", 0)
                .text(labelFunction);
            dc.transition(label, _chart.transitionDuration())
                .attr("opacity", labelOpacity);
        }
    };

    _chart.doUpdateLabels = function(bubbleGEnter) {
        if (_chart.renderLabel()) {
            var labels = bubbleGEnter.selectAll("text")
                .text(labelFunction);
            dc.transition(labels, _chart.transitionDuration())
                .attr("opacity", labelOpacity);
        }
    };

    var titleFunction = function(d) {
    
        return _chart.title()(d);
    };

    _chart.doRenderTitles = function(g) {
        if (_chart.renderTitle()) {
            var title = g.select("title");
              
            if (title.empty())
                g.append("title").text(titleFunction);
        }
    };

    _chart.doUpdateTitles = function(g) {
        if (_chart.renderTitle()) {
            g.selectAll("title").text(titleFunction);
        }
    };

    _chart.minRadiusWithLabel = function(_) {
        if (!arguments.length) return _minRadiusWithLabel;
        _minRadiusWithLabel = _;
        return _chart;
    };

    _chart.maxBubbleRelativeSize = function(_) {
        if (!arguments.length) return _maxBubbleRelativeSize;
        _maxBubbleRelativeSize = _;
        return _chart;
    };

    _chart.initBubbleColor = function(d, i) {
        this[dc.constants.NODE_INDEX_NAME] = i;
        return _chart.getColor(d, i);
    };

    _chart.updateBubbleColor = function(d, i) {
        // a work around to get correct node index since
        return _chart.getColor(d, this[dc.constants.NODE_INDEX_NAME]);
    };

    _chart.fadeDeselectedArea = function() {
        if (_chart.hasFilter()) {
            _chart.selectAll("g." + _chart.BUBBLE_NODE_CLASS).each(function(d) {
                if (_chart.isSelectedNode(d)) {
                    _chart.highlightSelected(this);
                } else {
                    _chart.fadeDeselected(this);
                }
            });
        } else {
            _chart.selectAll("g." + _chart.BUBBLE_NODE_CLASS).each(function(d) {
                _chart.resetHighlight(this);
            });
        }
    };

    _chart.isSelectedNode = function(d) {
        return _chart.hasFilter(d.key);
    };

    _chart.onClick = function(d) {
        var filter = d.key;
        dc.events.trigger(function() {
            _chart.filter(filter);
            dc.redrawAll(_chart.chartGroup());
        });
    };

    return _chart;
};
dc.pieChart = function(parent, chartGroup) {
    var DEFAULT_MIN_ANGLE_FOR_LABEL = 0.5;

    var _sliceCssClass = "pie-slice";

    var _radius = 90, _innerRadius = 0;

    var _g;

    var _minAngleForLabel = DEFAULT_MIN_ANGLE_FOR_LABEL;

    var _chart = dc.colorChart(dc.baseChart({}));

    var _slicesCap = Infinity;
    var _othersLabel = "Others";
    var _othersGrouper = function(data, sum) {
        data.push({ "key": _othersLabel, "value": sum });
    };

    function assemblePieData() {
        if (_slicesCap == Infinity) {
            return _chart.orderedGroup().top(_slicesCap); // ordered by keys
        } else {
            var topRows = _chart.group().top(_slicesCap); // ordered by value
            var topRowsSum = d3.sum(topRows, _chart.valueAccessor());

            var allRows = _chart.group().all();
            var allRowsSum = d3.sum(allRows, _chart.valueAccessor());

            _othersGrouper(topRows, allRowsSum - topRowsSum);

            return topRows;
        }
    }

    _chart.label(function(d) {
        return _chart.keyAccessor()(d.data);
    });

    _chart.renderLabel(true);

    _chart.title(function(d) {
        return _chart.keyAccessor()(d.data) + ": " + _chart.valueAccessor()(d.data);
    });

    _chart.transitionDuration(350);

    _chart.doRender = function() {
        _chart.resetSvg();

        _g = _chart.svg()
            .append("g")
            .attr("transform", "translate(" + _chart.cx() + "," + _chart.cy() + ")");

        drawChart();

        return _chart;
    };

    function drawChart() {
        if (_chart.dataSet()) {
            var pie = calculateDataPie();

            var arc = _chart.buildArcs();

            var pieData = pie(assemblePieData());

            if (_g) {
                var slices = _g.selectAll("g." + _sliceCssClass)
                    .data(pieData);

                createElements(slices, arc, pieData);

                updateElements(pieData, arc);

                removeElements(slices);

                highlightFilter();
            }
        }
    }

    function createElements(slices, arc, pieData) {
        var slicesEnter = createSliceNodes(slices);

        createSlicePath(slicesEnter, arc);

        createTitles(slicesEnter);

        createLabels(pieData, arc);
    }

    function createSliceNodes(slices) {
        var slicesEnter = slices
            .enter()
            .append("g")
            .attr("class", function(d, i) {
                return _sliceCssClass + " _" + i;
            });
        return slicesEnter;
    }

    function createSlicePath(slicesEnter, arc) {
        var slicePath = slicesEnter.append("path")
            .attr("fill", function(d, i) {
                return _chart.getColor(d, i);
            })

             .attr("titleTip", _chart.title())
            .on("click", onClick);
        if (_chart.renderTitle()) {
            slicePath.on("mouseover", function(d) {
                var dot = d3.select(this);
                dc.ShowToolTip(dot.attr("titleTip"));
            })
            .on("mouseout", function(d) {
                dc.HideToolTip();
            })
              .on("mousemove", function(d) {
                  var dot = d3.select(this);

                  dc.ShowToolTip(dot.attr("titleTip"), "");


              });
        }
        slicePath.attr("d", function(d, i) {
            return safeArc(d, i, arc);
        });
        slicePath.transition()
            .duration(_chart.transitionDuration())
            .attrTween("d", tweenPie);
    }

    function createTitles(slicesEnter) {
        /*
        if (_chart.renderTitle()) {
        slicesEnter.append("title").text(function (d) {
        return _chart.title()(d);
        });
        }
        */
    }

    function createLabels(pieData, arc) {
        if (_chart.renderLabel()) {
            var labels = _g.selectAll("text." + _sliceCssClass)
                .data(pieData);

            var labelsEnter = labels
                .enter()
                .append("text")
                .attr("class", function(d, i) {
                    return _sliceCssClass + " _" + i;
                })
                .on("click", onClick);
            dc.transition(labelsEnter, _chart.transitionDuration())
                .attr("transform", function(d) {
                    d.innerRadius = _chart.innerRadius();
                    d.outerRadius = _radius;
                    var centroid = arc.centroid(d);
                    if (isNaN(centroid[0]) || isNaN(centroid[1])) {
                        return "translate(0,0)";
                    } else {
                        return "translate(" + centroid + ")";
                    }
                })
                .attr("text-anchor", "middle")
                .text(function(d) {
                    var data = d.data;
                    if (sliceHasNoData(data) || sliceTooSmall(d))
                        return "";
                    return _chart.label()(d);
                });
        }
    }

    function updateElements(pieData, arc) {
        updateSlicePaths(pieData, arc);
        updateLabels(pieData, arc);
        updateTitles(pieData);
    }

    function updateSlicePaths(pieData, arc) {
        var slicePaths = _g.selectAll("g." + _sliceCssClass)
            .data(pieData)
            .select("path")
            .attr("d", function(d, i) {
                return safeArc(d, i, arc);
            });
        dc.transition(slicePaths, _chart.transitionDuration(),
            function(s) {
                s.attrTween("d", tweenPie);
            }).attr("fill", function(d, i) {
                return _chart.getColor(d, i);
            });
    }

    function updateLabels(pieData, arc) {
        if (_chart.renderLabel()) {
            var labels = _g.selectAll("text." + _sliceCssClass)
                .data(pieData);
            dc.transition(labels, _chart.transitionDuration())
                .attr("transform", function(d) {
                    d.innerRadius = _chart.innerRadius();
                    d.outerRadius = _radius;
                    var centroid = arc.centroid(d);
                    if (isNaN(centroid[0]) || isNaN(centroid[1])) {
                        return "translate(0,0)";
                    } else {
                        return "translate(" + centroid + ")";
                    }
                })
                .attr("text-anchor", "middle")
                .text(function(d) {
                    var data = d.data;
                    if (sliceHasNoData(data) || sliceTooSmall(d))
                        return "";
                    return _chart.label()(d);
                });
        }
    }

    function updateTitles(pieData) {
        if (_chart.renderTitle()) {
            _g.selectAll("g." + _sliceCssClass)
                .data(pieData)
                .select("title")
                .text(function(d) {
                    return _chart.title()(d);
                });
        }
    }

    function removeElements(slices) {
        slices.exit().remove();
    }

    function highlightFilter() {
        if (_chart.hasFilter()) {
            _chart.selectAll("g." + _sliceCssClass).each(function(d) {
                if (_chart.isSelectedSlice(d)) {
                    _chart.highlightSelected(this);
                } else {
                    _chart.fadeDeselected(this);
                }
            });
        } else {
            _chart.selectAll("g." + _sliceCssClass).each(function(d) {
                _chart.resetHighlight(this);
            });
        }
    }

    _chart.innerRadius = function(r) {
        if (!arguments.length) return _innerRadius;
        _innerRadius = r;
        return _chart;
    };

    _chart.radius = function(r) {
        if (!arguments.length) return _radius;
        _radius = r;
        return _chart;
    };

    _chart.cx = function() {
        return _chart.width() / 2;
    };

    _chart.cy = function() {
        return _chart.height() / 2;
    };

    _chart.buildArcs = function() {
        return d3.svg.arc().outerRadius(_radius).innerRadius(_innerRadius);
    };

    _chart.isSelectedSlice = function(d) {
        return _chart.hasFilter(_chart.keyAccessor()(d.data));
    };

    _chart.doRedraw = function() {
        drawChart();
        return _chart;
    };

    _chart.minAngleForLabel = function(_) {
        if (!arguments.length) return _minAngleForLabel;
        _minAngleForLabel = _;
        return _chart;
    };

    _chart.slicesCap = function(_) {
        if (!arguments.length) return _slicesCap;
        _slicesCap = _;
        return _chart;
    };

    _chart.othersLabel = function(_) {
        if (!arguments.length) return _othersLabel;
        _othersLabel = _;
        return _chart;
    };

    _chart.othersGrouper = function(_) {
        if (!arguments.length) return _othersGrouper;
        _othersGrouper = _;
        return _chart;
    };

    function calculateDataPie() {
        return d3.layout.pie().sort(null).value(function(d) {
            return _chart.valueAccessor()(d);
        });
    }

    function sliceTooSmall(d) {
        var angle = (d.endAngle - d.startAngle);
        return isNaN(angle) || angle < _minAngleForLabel;
    }

    function sliceHasNoData(data) {
        return _chart.valueAccessor()(data) == 0;
    }

    function tweenPie(b) {
        b.innerRadius = _chart.innerRadius();
        var current = this._current;
        if (isOffCanvas(current))
            current = { startAngle: 0, endAngle: 0 };
        var i = d3.interpolate(current, b);
        this._current = i(0);
        return function(t) {
            return safeArc(i(t), 0, _chart.buildArcs());
        };
    }

    function isOffCanvas(current) {
        return current == null || isNaN(current.startAngle) || isNaN(current.endAngle);
    }

    function onClick(d) {
        _chart.onClick(d.data);
    }

    function safeArc(d, i, arc) {
        var path = arc(d, i);
        if (path.indexOf("NaN") >= 0)
            path = "M0,0";
        return path;
    }

    return _chart.anchor(parent, chartGroup);
};

dc.barChart = function(parent, chartGroup) {
    var MIN_BAR_WIDTH = 1;
    var DEFAULT_GAP_BETWEEN_BARS = 2;

    var _chart = dc.stackableChart(dc.coordinateGridChart({}));


    var _dataTableView;
    var _gap = DEFAULT_GAP_BETWEEN_BARS;
    var _centerBar = false;
    var _showToggle;
    var _toggleBox;
    var _numberOfBars;
    var _barWidth;
    var _labelBars=false;
    var _markerAccessor;
      
    _chart.resetBarProperties = function() {
        _numberOfBars = null;
        _barWidth = null;
        getNumberOfBars();
        barWidth();


    }


    _chart.testSwitch = function(r) {

        var groups = _chart.allGroups();

        //build Array
        // var dtable=[];


        var data = [];

        groups[0].all().forEach(function(d) {
            var k = d.key;
            var nd = { KEY: k };

            for (var groupIndex = 0; groupIndex < groups.length; ++groupIndex) {

                var x = groups[groupIndex].all().filter(function(f) { return f.key == k });
                //nd[_chart.seriesLabels()[groupIndex]]=x[0].value;  
                nd["SERIES" + groupIndex] = x[0].value;
            }
            data.push(nd);
        })




        if (r == 1) {
            if (_chart.dataTableView != undefined) { writetable(data, groups) };
            return;
        }

        if (_chart.svg().attr("opacity") == 1 || _chart.svg().attr("opacity") == undefined) {

            _chart.svg().attr("opacity", 1);
            _chart.svg().transition().each('end', function(d) { _chart.svg().style("display", "none") }).duration(1000).attr("opacity", 0);
            //           _chart.dataTableView=_chart.root().append("svg").attr("class","datatable").style("opacity",0)
            if (_chart.dataTableView == undefined) {
                _chart.dataTableView = _chart.root().append("div").attr("class", "datatable").style("opacity", 0);
            }
            //.style("position","absolute").style("top","0px").style("left","0px");
            var y = _chart.dataTableView.append("g");

            //Add DataTable Here

            writetable(data, groups);


            _chart.dataTableView.transition().duration(1000).style("opacity", 1);
        }
        else {

            _chart.svg().attr("opacity", 0);
            _chart.svg().transition().each('end', function(d) { _chart.svg().style("display", "inline") }).duration(1000).attr("opacity", 1);

            _chart.dataTableView.transition().duration(1000).style("opacity", 0);

        }

    }
    function writetable(data, groups) {


        var keyText = "KEY";
        if (_chart.keyLabel() != undefined) { keyText = _chart.keyLabel(); }

        _chart.dataTableView.selectAll("div").remove();
        _chart.dataTableView.append("div").append("tbody");
        var table = _chart.root().selectAll("tbody").append("table");
        var rowHead = table.append("thead").append("tr");
        rowHead.append("td").text(keyText);
        for (var col = 0; col < groups.length; ++col) {
            rowHead.append("td").text(_chart.seriesLabels()[col]);
        }


        data.forEach(function(d) {
            var row = table.append("tr");

            row.append("td").text(d.KEY);

            for (var col = 0; col < groups.length; ++col) {

                row.append("td").text(d["SERIES" + col]);
            }
            //row.append("td").text(d.SERIES1);
        });

    }


    function tabulate(data, columns) {
        _chart.dataTableView.append("div").append("tbody");
        var table = _chart.root().selectAll("tbody").append("table");
        //.attr("style", "margin-left: 250px"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

        // append the header row
        thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()

        .append("th")
        .attr("class", "dc-table-column")
            .text(function(column) { return column; });

        // create a row for each object in the data
        var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr")
        .attr("class", "dc-table-row")
        ;

        // create a cell in each row for each column
        /*             
        var cells = rows.selectAll("td")
        .data(data)
        .enter()
        .append("td")
        .attr("style", "font-family: Courier")
        .html(function(d,i) {alert( d[i]);return d[i]; });
        */


        var cells = rows.selectAll("td")
        .data(function(row) {


            return columns.map(function(column) {

                return { column: column, value: row[column] };
            });
        })
        .enter()
        .append("td")
        .attr("style", "font-family: Courier")
            .html(function(d) { return d.value; });

        return table;
    }


    _chart.plotData = function() {
        var groups = _chart.allGroups();



        // _chart.resetLegend();


        _chart.testSwitch(1);

        if (_toggleBox == undefined && _showToggle != undefined) {
            _toggleBox = d3.select(_showToggle).append("svg").attr("width", 200).attr("height", 200);
            _toggleBox.append("rect").attr("x", 0).attr("y", 0).attr("width", 10).attr("height", 10).attr("fill", "red").on("click", function() { _chart.testSwitch(); });

        }


        _chart.calculateDataPointMatrixWithinXDomain(groups);

        for (var groupIndex = 0; groupIndex < groups.length; ++groupIndex) {
            generateBarsPerGroup(groupIndex, groups[groupIndex]);
        }
        // dataT = _chart.getDataWithinXDomain(groups[0]);
        // alert(_chart.keyAccessor()(dataT[0]));
        //alert(dataT[0]);       )


        if (_chart.showLegend() == true) {
            if (_chart.legendContainer() == undefined) {
                _chart.legendBox().attr("transform", "translate(" + (_chart.width() - _chart.fullLength()) + ",10)");
            }
            else {
                //_legendBox.attr("transform", "translate(-50,50)");
            }
        }
        _chart.needLegendRefresh(false);




    }

    function generateBarsPerGroup(groupIndex, group) {
        var data = _chart.getDataWithinXDomain(group);

        calculateBarWidth(_chart.x()(_chart.keyAccessor()(data[0])));

        var bars = _chart.chartBodyG().selectAll("rect." + dc.constants.STACK_CLASS + groupIndex)
            .data(data);

           

        addNewBars(bars, groupIndex, _chart.GetSeriesLabel(groupIndex));
        addNewMarker(bars, groupIndex, _chart.GetSeriesLabel(groupIndex));
        if (_labelBars)
        {
         var text=  _chart.chartBodyG().selectAll("text." + dc.constants.STACK_CLASS + groupIndex)
            .data(data);
        labelBars (text, groupIndex, _chart.GetSeriesLabel(groupIndex));
        }
        updateBars(bars, groupIndex);

        deleteBars(bars);
        if (_chart.needLegendRefresh() == true) {
            GenerateLegendItem(groupIndex, _chart.GetSeriesLabel(groupIndex));

        }



    }
    function GenerateLegendItem(groupIndex, groupLabel) {
        // console.log(_chart.filters());
        //alert(_chart.hasFilter(groupLabel));

        if (_chart.showLegend() != true) return;


        var y = _chart.svg().select(".bar.stack" + groupIndex); //.style("stroke");
        //console.log(y);
        y = d3.select(y[0][0]);
        y = y.style("fill");


        var t = _chart.legendBox().append("circle")
                   .attr("cx", (10 * groupIndex) + _chart.Lastlength())
                   .attr("cy", 0)
                   .attr("r", 5)


        //var t=_legendBox.append("rect")
        //.attr("x",(10*groupIndex) +_Lastlength)
        //.attr("y",0)
        //.attr("width",8)
        //.attr("height",8)


        //.attr("height",10)
        //.attr("width",10)   
        //.style("opacity", 1)
    .attr("class", "bar " + dc.constants.STACK_CLASS + groupIndex)
    .style("fill", y)
    .attr("label", groupLabel)
    .on("click", function(d) {
        var xfilter = d3.select(this).attr("label");

        //_chart.filter(xfilter);
        //alert(xfilter);

        //_chart.redraw();

    });


        var tt = _chart.legendBox().append("text").text(groupLabel).attr("text-anchor", "start").attr('dy', '.32em')
          .attr('dx', '8').attr("x", (10 * groupIndex) + _chart.Lastlength()).attr("y", "0");



        _chart.Lastlength(tt.node().getComputedTextLength() + 28);

        //alert(_Lastlength);          
        _chart.fullLength(_chart.fullLength() + _chart.Lastlength());

    }
    function calculateBarWidth(offset) {
        if (_barWidth == null) {
            var numberOfBars = _chart.isOrdinal() ? getNumberOfBars() + 1 : getNumberOfBars();

            var w = Math.floor((_chart.xAxisLength() - offset - (numberOfBars - 1) * _gap) / numberOfBars);


            if (isNaN(w) || w < MIN_BAR_WIDTH)
                w = MIN_BAR_WIDTH;

            _barWidth = w;
        }
    }
     function labelBars(bars,groupIndex,groupLabel)
                 {
                    
                    bars.enter().append("text").attr("class", dc.constants.STACK_CLASS + groupIndex+ " barcharLabel").text(function(d) {return d.key;}).attr("x", function(data, dataIndex) {
                return barX(this, data, groupIndex, dataIndex)+ _barWidth/2;
            }).attr("y", _chart.height()-2).attr("text-anchor","middle");   
                 }
                 
                 
                 function GetSpecificValuePoint(data)
                 {
                 
  var value =data.value.Average;

        var yPosition = _chart.y()(value);
        var zeroPosition = _chart.baseLineY();
        var h = 0;

        if (value > 0)
            h = zeroPosition - yPosition;
        else
            h = yPosition - zeroPosition;

       
                 return h;
                 }
                 
function addNewMarker(bars,groupIndex,groupLabel)
 {
   var bars = bars.enter().append("circle");             
                                             
  bars.attr("cx", function(data, dataIndex) {
  
                return barX(this, data, groupIndex, dataIndex) + (barWidth()/2) ;
            })
             .attr("cy",function (data,dataIndex) { 
                               
             
                                    // var v=GetSpecificValuePoint(data);
                                    
                                      //var v= barY(this, b, dataIndex);
                                      var v=_chart.y()(data.value.Average);
                             v=v+5;
                             //v+=10;
                            
                                         
             
             
                         return v;
            })
             //.attr("cy",function(data, dataIndex) {_chart.dataPointHeight(data, getGroupIndexFromBar(this))})
             .attr("r",5).style("fill","red");
            
            //.attr("y", _chart.baseLineY())

}                 
                 
    function addNewBars(bars, groupIndex, groupLabel) {
    
       
                  
        var bars = bars.enter().append("rect");

        bars.attr("class", "bar " + dc.constants.STACK_CLASS + groupIndex)
            .attr("x", function(data, dataIndex) {
                return barX(this, data, groupIndex, dataIndex) ;
            })
            .attr("y", _chart.baseLineY())
            .attr("width", barWidth)
            .attr("titleTip", _chart.title())
            .attr("seriesLabel", groupLabel);

           


        if (_chart.seriesColours() != undefined) {

            try {
                var col = _chart.seriesColours()[groupIndex];
                bars.style("fill", col);
                bars.attr("fillcolour", col);
            }
            catch (e) {
            }

        }

        //if (_chart.isOrdinal())
        bars.on("click", _chart.onClick);
        if (_chart.renderTitle()) {
            bars.on("mouseover", function(d) {
                var dot = d3.select(this);
                dc.ShowToolTip(dot.attr("titleTip"), dot.attr("seriesLabel"));
            });
            bars.on("mouseout", function(d) {
                dc.HideToolTip();
            });
            bars.on("mousemove", function(d) {
                var dot = d3.select(this);

                dc.ShowToolTip(dot.attr("titleTip"), dot.attr("seriesLabel"));


            });
        }
        if (_chart.renderTitle()) {

            // bars.append("title").text(_chart.title());
            // bars.append("extra").text(function (data) {return data.Type});
        }

        dc.transition(bars, _chart.transitionDuration())
            .attr("y", function(data, dataIndex) {
                return barY(this, data, dataIndex);
            })
            .attr("height", function(data) {
                return _chart.dataPointHeight(data, getGroupIndexFromBar(this));
            });
            
             
    }

    function updateBars(bars, groupIndex) {
        if (_chart.renderTitle()) {
            bars.select("title").text(_chart.title());
        }



        dc.transition(bars, _chart.transitionDuration())
            .attr("x", function(data) {
                return barX(this, data, groupIndex);
            })
            .attr("y", function(data, dataIndex) {
                return barY(this, data, dataIndex);
            })
            .attr("height", function(data) {
                return _chart.dataPointHeight(data, getGroupIndexFromBar(this));
            })
            .attr("width", barWidth)
            .attr("titleTip", _chart.title());
    }

    function deleteBars(bars) {
        dc.transition(bars.exit(), _chart.transitionDuration())
            .attr("y", _chart.xAxisY())
            .attr("height", 0);
    }

    function getNumberOfBars() {
        if (_numberOfBars == null) {
            _numberOfBars = _chart.xUnitCount();
        }

        return _numberOfBars;
    }

    function barWidth(d) {
        return _barWidth;
    }

    function setGroupIndexToBar(bar, groupIndex) {
        bar[dc.constants.GROUP_INDEX_NAME] = groupIndex;
    }

    function barX(bar, data, groupIndex) {
        setGroupIndexToBar(bar, groupIndex);
        var position = _chart.x()(_chart.keyAccessor()(data)) + _chart.margins().left;
        if (_centerBar)
            position -= barWidth() / 2;
        return position;
    }

    function getGroupIndexFromBar(bar) {
        return bar[dc.constants.GROUP_INDEX_NAME];
    }

    function barY(bar, data, dataIndex) {
        var groupIndex = getGroupIndexFromBar(bar);
        return _chart.getChartStack().getDataPoint(groupIndex, dataIndex);
    }

    _chart.fadeDeselectedArea = function() {
        var bars = _chart.chartBodyG().selectAll("rect.bar");
        var extent = _chart.brush().extent();

        if (_chart.isOrdinal())
        //if (1==1) 
        {

            if (_chart.hasFilter()) {


                if (_chart.seriesColours() != undefined) {

                    bars.each(function(d, i) {
                        if (_chart.hasFilter(_chart.keyAccessor()(d))) {
                            d3.select(this).style("fill", d3.select(this).attr("fillcolour"));
                        }
                        else {
                            d3.select(this).style("fill", "#888888");
                        }

                    });

                    /*
                    bars.style("fill",function(d) {return d3.select(this).attr("fillcolour")}, function (d) {
                    return _chart.hasFilter(_chart.keyAccessor()(d));
                    }); 
              
                bars.style("fill","grey", function (d) {
              
                    return !_chart.hasFilter(_chart.keyAccessor()(d));
                    });
                    */
                }
                else {

                    bars.classed(dc.constants.SELECTED_CLASS, function(d) {
                        return _chart.hasFilter(_chart.keyAccessor()(d));
                    });
                    bars.classed(dc.constants.DESELECTED_CLASS, function(d) {
                        return !_chart.hasFilter(_chart.keyAccessor()(d));
                    });

                }
            }
            else {

                if (_chart.seriesColours() != undefined) {
                    bars.style("fill", function(d) { return d3.select(this).attr("fillcolour") }, function(d) {
                        return _chart.hasFilter(_chart.keyAccessor()(d));
                    });
                }
                else {
                    bars.classed(dc.constants.SELECTED_CLASS, false);
                    bars.classed(dc.constants.DESELECTED_CLASS, false);
                }
            }
        }

        else {
            if (!_chart.brushIsEmpty(extent)) {
                var start = extent[0];
                var end = extent[1];

                bars.classed(dc.constants.DESELECTED_CLASS, function(d) {
                    var xValue = _chart.keyAccessor()(d);
                    return xValue < start || xValue >= end;
                });
            } else {
                bars.classed(dc.constants.DESELECTED_CLASS, false);
            }
        }
    };

    _chart.showToggle = function(_) {
        if (!arguments.length) return _showToggle;
        _showToggle = _;
        return _chart;
    };



    _chart.centerBar = function(_) {
        if (!arguments.length) return _centerBar;
        _centerBar = _;
        return _chart;
    };


    _chart.labelBars = function(_) {
        if (!arguments.length) return _labelBars;
        _labelBars = _;
        return _chart;
    };


    
    _chart.gap = function(_) {
        if (!arguments.length) return _gap;
        _gap = _;
        return _chart;
    };

    _chart.extendBrush = function() {
        var extent = _chart.brush().extent();
        if (_chart.round() && !_centerBar) {
            extent[0] = extent.map(_chart.round())[0];
            extent[1] = extent.map(_chart.round())[1];

            _chart.chartBodyG().select(".brush")
                .call(_chart.brush().extent(extent));
        }
        return extent;
    };

    dc.override(_chart, "prepareOrdinalXAxis", function() {
        return this._prepareOrdinalXAxis(_chart.xUnitCount() + 1);
    });

    dc.override(_chart,"render",function()
    {
     this._render();
          
     
                   // alert(window.matchMedia("(orientation:portrait)").matches);
     
              if (_chart.clickEffect()=="S" && _chart.filters().length==0)
              {
              //We are a single filter only method (therefore a filter needs to always be set, either use the supplied intitialFilter or take the first value)
              
              if (_chart.initialFilter()!=undefined)
              {
               _chart.filter(_chart.initialFilter());
                          }
              else
              {
               //We need to take the first value instead
                _chart.filter(_chart.dimension().group().all()[0].key);
            
              
              }
                 dc.redrawAll();
              }
   
    });

    return _chart.anchor(parent, chartGroup);


}

dc.twoBytwoChart = function(parent, chartGroup) {

    var AREA_BOTTOM_PADDING = 1;
    var DEFAULT_DOT_RADIUS = 3;
    var TOOLTIP_G_CLASS = "dc-tooltip";
    var DOT_CIRCLE_CLASS = "dot";
    var Y_AXIS_REF_LINE_CLASS = "yRef";
    var X_AXIS_REF_LINE_CLASS = "xRef";
    var _renderArea = false;
    var _dotRadius = DEFAULT_DOT_RADIUS;
    var _dotsAlwaysOn = 0;
    var _expandHighlight = 0;
    var _highLightCircle;
    var _trackedDot = [];
    var _highlightGrouping;
    var yRefLine;
    var xRefLine;
    var _keyName="";
    
    var _chart = dc.stackableChart(dc.coordinateGridChart({}));

    dc.tooltipActive(true);

    var _xLabel = "";
    var _yLabel = "";

    _chart.keyName = function(t) {
    if (!arguments.length) return _keyName;
    _keyName = t;
        return _chart;
    };

    _chart.xLabel = function(t) {
        if (!arguments.length) return _xLabel;
        _xLabel = t;
        return _chart;
    };

    _chart.yLabel = function(t) {
        if (!arguments.length) return _yLabel;
        _yLabel = t;
        return _chart;
    };


    var lineX = function(d) {
        var kval = (_chart.keyAccessor()(d));


        return _chart.margins().left + _chart.x()(kval);
    };

    var lineY = function(d, dataIndex, groupIndex) {
        var y = _chart.getChartStack().getDataPoint(groupIndex, dataIndex);
        if (y >= _chart.dataPointBaseline())
            y += _chart.dataPointHeight(d, groupIndex);

        return y;
    };

    function createGrouping(stackedCssClass, group) {
        var g = _chart.chartBodyG().select("g." + stackedCssClass);

        if (g.empty())
            g = _chart.chartBodyG().append("g").attr("class", stackedCssClass);

        g.datum(group.all());

        return g;
    }

    _chart.SelectKey = function(key) {
        d3.selectAll("circle").style("fill", "")
        var t = d3.select("[key2=" + key + "]").style("fill", "red");
        PointClick(d3.select(t[0][0].__data__)[0][0]);
    }

    _chart.plotData = function() {

        var group = _chart.group();
        var stackedCssClass = "STACK0";
        var g = createGrouping(stackedCssClass, group);
        var groups = _chart.allGroups();



        var dots = g.selectAll("circle." + DOT_CIRCLE_CLASS)
        //.data(g.datum());
           .data(_chart.dimension().top(5000))

        dots.enter()
            .append("circle")
            .attr("class", DOT_CIRCLE_CLASS)
            .attr("r", _dotRadius)
        //.style("stroke-width",2)
            .style("fill-opacity", 1)
            .style("stroke-opacity", 1e-6)

        //.attr("cx", lineX)
           .attr("cx", function(d) {
               return _chart.margins().left + _chart.x()(d.XValue);
           })
            .attr("cy", function(d, dataIndex) {

                var v = _chart.y()(d.YValue);
                return v;
                //return lineY(d, dataIndex, 1);
            })
            .attr("key2", function(d) { return d.Key })
            .on("mouseover", function(d) { dc.ShowToolTip(d[_keyName] + "<br/>" + d.XValue + ":" + d.YValue); }).on("mouseout", function(d) { dc.HideToolTip(); }).on("mousemove", function(d) { dc.MoveToolTip(); })
            .on("click", function(d) { d3.selectAll("circle").style("fill", ""); d3.select(this).style("fill", "red"); PointClick(d); });



        _chart.xAxis().tickSize(0, 0);
        _chart.yAxis().tickSize(0, 0);

        //Draw remaining lines


        var topLeftX = _chart.margins().left;
        var topLeftY = _chart.margins().top;
        var topRightX = _chart.width() - _chart.margins().right;
        var topRightY = topLeftY;
        var BottomRightX = topRightX;
        var BottomRightY = _chart.height() - _chart.margins().bottom;

        var MiddleY = (BottomRightY / 2) + topRightY;
        var MiddleX = (topRightX / 2) + _chart.margins().left / 2;
        _chart.chartBodyG().append("line").attr("x1", topLeftX).attr("y1", topLeftY).attr("x2", topRightX).attr("y2", topRightY).style("stroke-width", 1.5).style("stroke", "#acabab");
        _chart.chartBodyG().append("line").attr("x1", topRightX).attr("y1", topRightY).attr("x2", BottomRightX).attr("y2", BottomRightY).style("stroke-width", 1.5).style("stroke", "#acabab");

        //Now draw cross lines


        _chart.chartBodyG().append("line").attr("x1", topLeftX).attr("y1", MiddleY).attr("x2", topRightX).attr("y2", MiddleY).style("stroke-width", 1.5).style("stroke", "#acabab");
        _chart.chartBodyG().append("line").attr("x1", MiddleX).attr("y1", topLeftY).attr("x2", MiddleX).attr("y2", BottomRightY).style("stroke-width", 1.5).style("stroke", "#acabab");


        _chart.chartBodyG().append("text").attr("x", MiddleX).attr("y", BottomRightY).text("TEST").attr("fill", "666666").attr("text-anchor", "middle").style("font-family", "'Segoe UI','Trebuchet MS', Arial, Helvetica, sans-serif").style("font-size", "0.8em");
        //                  .attr("fill","666666").attr("text-anchor", "end").attr("dy", ".4em").attr("y", function(d) { return _blockHeight - yscale(data[0].middle); }).style("font-family", "'Segoe UI','Trebuchet MS', Arial, Helvetica, sans-serif").style("font-size", "0.8em").text(function(d) { return data[0][_blockMiddle] });
        //#acabab
        //_chart.chartBodyG().append("line").attr("x",10).attr("y",10).attr("cx",60).attr("cy",60).style("stroke-width",3);

    }



    return _chart.anchor(parent, chartGroup);
}

dc.lineChart = function(parent, chartGroup) {

    var AREA_BOTTOM_PADDING = 1;
    var DEFAULT_DOT_RADIUS = 2;
    var TOOLTIP_G_CLASS = "dc-tooltip";
    var DOT_CIRCLE_CLASS = "dot";
    var Y_AXIS_REF_LINE_CLASS = "yRef";
    var X_AXIS_REF_LINE_CLASS = "xRef";

    var _chart = dc.stackableChart(dc.coordinateGridChart({}));
    var _renderArea = false;
    var _dotRadius = DEFAULT_DOT_RADIUS;
    var _dotsAlwaysOn = 0;
    var _expandHighlight = 0;
    var _highLightCircle;
    var _trackedDot = [];
    var _highlightGrouping;
    var yRefLine;
    var xRefLine;

    _chart.transitionDuration(500);

    _chart.on("postRedraw", function(chart) {
        chart.doRedraw2();
    });


    _chart.plotData = function() {



        //_chart.resetLegend();
        


        var groups = _chart.allGroups();
        addHighlightCircle();


        var groupLabel = "";




        _chart.calculateDataPointMatrixForAll(groups);

        for (var groupIndex = 0; groupIndex < groups.length; ++groupIndex) {
            var group = groups[groupIndex];

            plotDataByGroup(groupIndex, group, _chart.GetSeriesLabel(groupIndex));
        }

        if (_chart.showLegend() == true) {
            if (_chart.legendContainer() == undefined) {
                _chart.legendBox().attr("transform", "translate(" + (_chart.width() - _chart.fullLength()) + ",10)");
            }
        }

        _chart.needLegendRefresh(false);
    }


    function plotDataByGroup(groupIndex, group, groupLabel) {
        var stackedCssClass = getStackedCssClass(groupIndex);

        var g = createGrouping(stackedCssClass, group);

        var line = drawLine(g, stackedCssClass, groupIndex);

        if (_renderArea)
            drawArea(g, stackedCssClass, groupIndex, line);

        //if (_chart.renderTitle())
          var dots=null;
          var styles=_chart.groupStyles().GetGroupStyle(groupIndex);
                if (styles!=null)
                {
                                    
                   for (var i = 0; i < styles.length; i++) {
                   if (styles[i].name=="dots")
                   {
                  dots=styles[i].value;
                  break;
                   }
                }
                 }
                        
                  if (groupIndex==0)
        {
        
        _highlightGrouping = g.select("g.HighlightArea");

        if (_highlightGrouping.empty())
            _highlightGrouping = g.append("g").attr("class", "HighlightArea");
            }
                 
        drawDots(g, groupIndex,dots);

        if (_chart.needLegendRefresh() == true) {
            GenerateLegendItem(groupIndex, groupLabel);
        }

    }

    function GenerateLegendItem(groupIndex, groupLabel) {

        if (_chart.showLegend() != true) return;

        var y = _chart.svg().select("g.stack" + groupIndex); //.style("stroke");

        y = d3.select(y[0][0].childNodes[0]);
        y = y.style("stroke");
        //console.log(y[0][0].style);
        //var yy=d3.select(y[0][0]);
        //console.log(yy);
        //alert(y.style());
        //.style("fill")


        var t = _chart.legendBox().append("circle")
                   .attr("cx", (10 * groupIndex) + _chart.Lastlength())
                   .attr("cy", 0)
                   .attr("r", 5)
                            .style("fill", y)
        //.attr("height",10)
        //.attr("width",10)   
        //.style("opacity", 1)
    .attr("class", "" + dc.constants.STACK_CLASS + groupIndex)
    .attr("label", groupLabel)
    .on("click", function(d) {
        var xfilter = d3.select(this).attr("label");
        //_chart.filter(xfilter);
        //alert(xfilter);

        //_chart.redraw();

    });


        var tt = _chart.legendBox().append("text").text(groupLabel).attr("text-anchor", "start").attr('dy', '.32em')
          .attr('dx', '8').attr("x", (10 * groupIndex) + _chart.Lastlength()).attr("y", "0");



        _chart.Lastlength(tt.node().getComputedTextLength() + 28);
        //alert(_Lastlength);          
        _chart.fullLength(_chart.fullLength() + _chart.Lastlength());

    }
    _chart.doRedraw2 = function() {

        try {
            _highLightCircle.style("stroke-opacity", 0).attr("cx", -100).attr("cy", -100).style("display", "none");
        }
        catch (e) {
        }



    }

    function addHighlightCircle() {
        if (_expandHighlight) {

            if (_highLightCircle == undefined) {

                _highLightCircle = _chart.svg().append("circle").attr("class", DOT_CIRCLE_CLASS)
            .attr("r", _dotRadius * 2)
             .style("stroke-width", 3)
        .style("stroke-opacity", 1)
        .style("fill-opacity", 0)
        .style("display", "none")
        .on("mouseout", function(d) {
            var dot = d3.select(this);
            hideDot(dot);
            hideRefLines();
            dc.HideToolTip();

        });
            }
        }


    }

    function getStackedCssClass(groupIndex) {
        return dc.constants.STACK_CLASS + groupIndex;
    }

    function createGrouping(stackedCssClass, group) {
        var g = _chart.chartBodyG().select("g." + stackedCssClass);

        if (g.empty())
            g = _chart.chartBodyG().append("g").attr("class", stackedCssClass);

        g.datum(group.all());

       

        return g;
    }

    function drawLine(g, stackedCssClass, groupIndex) {
        var linePath = g.select("path.line");

        if (linePath.empty())
            linePath = g.append("path")
                .attr("class", "line " + stackedCssClass);


                //Check group stack styles
                var styles=_chart.groupStyles().GetGroupStyle(groupIndex);
                if (styles!=null)
                {
                                    
                   for (var i = 0; i < styles.length; i++) {
                  linePath.style(styles[i].name,styles[i].value);
                //linePath.style("stroke-dasharray",("3,3")); 
                
                }
                }

                

        linePath[0][0][dc.constants.GROUP_INDEX_NAME] = groupIndex;

        var line = d3.svg.line()
            .x(lineX)
            .y(function(d, dataIndex) {
                var groupIndex = this[dc.constants.GROUP_INDEX_NAME];
                return lineY(d, dataIndex, groupIndex);
                          });

                            
        dc.transition(linePath, _chart.transitionDuration(),
            function(t) {
                t.ease("linear");
            }).attr("d", line);

        return line;
    }

    var lineX = function(d) {
   
        return _chart.margins().left + _chart.x()(_chart.keyAccessor()(d));
    };

    var lineY = function(d, dataIndex, groupIndex) {
        var y = _chart.getChartStack().getDataPoint(groupIndex, dataIndex);
        if (y >= _chart.dataPointBaseline())
            y += _chart.dataPointHeight(d, groupIndex);
            
        return y;
    };

    function drawArea(g, stackedCssClass, groupIndex, line) {
        var areaPath = g.select("path.area");

        if (areaPath.empty())
            areaPath = g.append("path")
                .attr("class", "area " + stackedCssClass);

        areaPath[0][0][dc.constants.GROUP_INDEX_NAME] = groupIndex;

        var area = d3.svg.area()
            .x(line.x())
            .y1(line.y())
            .y0(function(d, dataIndex) {
                var groupIndex = this[dc.constants.GROUP_INDEX_NAME];

                if (groupIndex == 0)
                    return _chart.dataPointBaseline() - AREA_BOTTOM_PADDING;

                var y = _chart.getChartStack().getDataPoint(groupIndex - 1, dataIndex);
           
                if (y < _chart.dataPointBaseline())
                    return y - AREA_BOTTOM_PADDING;
                else
                    return y + _chart.dataPointHeight(d, groupIndex - 1);
                    
            });

        dc.transition(areaPath, _chart.transitionDuration(),
            function(t) {
                t.ease("linear");
            }).attr("d", area);
    }

    _chart.renderArea = function(_) {
        if (!arguments.length) return _renderArea;
        _renderArea = _;
        return _chart;
    };

    function drawDots(parentG, groupIndex,showDots) {
    
    var dotHover=true;
    if (showDots==2)
    {
    dotHover=false;
    showDots=0;
    }
    
    if (showDots==null)
    {
     showDots=_dotsAlwaysOn;
    }
        var g = parentG.select("g." + TOOLTIP_G_CLASS);

        if (g.empty())
            g = parentG.append("g").attr("class", TOOLTIP_G_CLASS);


        //_chart.svg().on("mouseout",function(d) {
        //                      hideDot(d3.select(this));
        //});

        createRefLines(g);

        var dots = g.selectAll("circle." + DOT_CIRCLE_CLASS)
            .data(g.datum());

        dots.enter()
            .append("circle")
            .attr("class", DOT_CIRCLE_CLASS)
            .attr("r", _dotRadius)
            .attr("dotStyle",showDots)
            //.style("stroke-width",2)
            .style("fill-opacity", showDots ? 1 : 1e-6)
            .style("stroke-opacity", 1e-6);
            
            if (dotHover)
            {
            
        if (_chart.renderTitle()) {
            dots.on("mouseover", function(d) {
                var dot = d3.select(this);
                             
                showDot(dot);
                showRefLines(dot, g);
                dc.ShowToolTip(dot.attr("titleTip"));
                        
            });

        }
        else {
            dots.on("mouseover", function(d) {
                var dot = d3.select(this);
                showDot(dot);
                showRefLines(dot, g);
            });
        }
            }

        if (!_expandHighlight) {

            dots.on("mouseout", function(d) {
                var dot = d3.select(this);
                hideDot(dot,showDots);
                hideRefLines();
                dc.HideToolTip();
            })
        }
       
        dots.on("click", _chart.onClick)
              .attr("titleTip", _chart.title()) ;
            //.append("title").text(_chart.title());


        dots.transition().duration(_chart.transitionDuration()).attr("cx", lineX)
            .attr("cy", function(d, dataIndex) {
                return lineY(d, dataIndex, groupIndex);
            }).transition().duration(300)
            .select("title").text(_chart.title());


        dots.exit().remove();


    }

    function createRefLines(g) {  
        yRefLine = g.select("path." + Y_AXIS_REF_LINE_CLASS).empty() ? g.append("path").attr("class", Y_AXIS_REF_LINE_CLASS) : g.select("path." + Y_AXIS_REF_LINE_CLASS);
        yRefLine.style("display", "none").attr("stroke-dasharray", "5,5");

        xRefLine = g.select("path." + X_AXIS_REF_LINE_CLASS).empty() ? g.append("path").attr("class", X_AXIS_REF_LINE_CLASS) : g.select("path." + X_AXIS_REF_LINE_CLASS);
        xRefLine.style("display", "none").attr("stroke-dasharray", "5,5");
    }

    function showDot(dot) {


        dot.style("fill-opacity", 1);
        dot.style("stroke-opacity", .4);

        /*
        var content = '<h3>Test</h3>' +
        '<p>' +
        '<span class="value">[500]</span>' +
        '</p>';
        nvtooltip.show([5, 5], content);
        */

        //_chart.resize();

        //New outer cirlce highlighting
        if (_expandHighlight) {
            _trackedDot.push(dot);
            dot.attr("r", _dotRadius / 2);
            _highLightCircle.attr("cx", dot.attr("cx")).attr("cy", dot.attr("cy")).style("stroke", dot.style("stroke")).style("fill", dot.style("fill")).style("display", "inline").style("stroke-width", 3).style("stroke-opacity", .8).style("fill-opacity", 0).attr("r", 0);
            _highLightCircle.transition()
        .duration(150).attr("r", _dotRadius * 2)


        }


        return dot;
    }

    function showRefLines(dot, g) {
        var x = dot.attr("cx");
        var y = dot.attr("cy");
        
         var strokestyle=dot.style("stroke");
        
        yRefLine.style("display", "").attr("d", "M" + _chart.margins().left + " " + y + "L" + (x) + " " + (y)).style("stroke",strokestyle);
        //g.select("path." + Y_AXIS_REF_LINE_CLASS).style("display", "").attr("d", "M" + _chart.margins().left + " " + y + "L" + (x) + " " + (y));
        xRefLine.style("display", "").attr("d", "M" + x + " " + (_chart.height() - _chart.margins().bottom) + "L" + x + " " + y).style("stroke",strokestyle);
        //g.select("path." + X_AXIS_REF_LINE_CLASS).style("display", "").attr("d", "M" + x + " " + (_chart.height() - _chart.margins().bottom) + "L" + x + " " + y);
    }

    function hideDot(dot,showDots) {

        //nvtooltip.cleanup();

         if (showDots==null)
    {
     showDots=_dotsAlwaysOn;
     showDots=dot.attr("dotStyle");
    }
        if (showDots==true)
        {
         showDots=1;
        }

        if (!_expandHighlight) {

            dot.style("fill-opacity", showDots ? 1 : 1e-6).style("stroke-opacity", 1e-6);
        }
        //New Outer Circle Highlighting
        if (_expandHighlight) {
            _highLightCircle.style("stroke-opacity", 0).attr("cx", -100).attr("cy", -100).style("display", "none");



            while (_trackedDot.length > 0) {
                var item = _trackedDot.pop();
                  showDots=item.attr("dotStyle");
        
                item.attr("r", _dotRadius);
                item.style("fill-opacity", showDots ? 1 : 1e-6).style("stroke-opacity", 1e-6);
            }
        }


    }

    function hideRefLines() {

        xRefLine.style("display", "none");
        yRefLine.style("display", "none");
        //g.select("path." + Y_AXIS_REF_LINE_CLASS).style("display", "none");
        //g.select("path." + X_AXIS_REF_LINE_CLASS).style("display", "none");
    }

    _chart.dotRadius = function(_) {
        if (!arguments.length) return _dotRadius;
        _dotRadius = _;
        return _chart;
    };

    _chart.expandHighlight = function(_) {
        if (!arguments.length) return _expandHighlight;
        _expandHighlight = _;
        return _chart;
    };


    _chart.dotsAlwaysOn = function(_) {
        if (!arguments.length) return _dotsAlwaysOn;
        _dotsAlwaysOn = _;
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
}




dc.dataCount = function(parent, chartGroup) {
    var _formatNumber = d3.format(",d");
    var _chart = dc.baseChart({});

    _chart.doRender = function() {
        _chart.selectAll(".total-count").text(_formatNumber(_chart.dimension().size()));
        _chart.selectAll(".filter-count").text(_formatNumber(_chart.group().value()));

        return _chart;
    };

    _chart.doRedraw = function() {
        return _chart.doRender();
    };

    return _chart.anchor(parent, chartGroup);
};

dc.dataTable = function(parent, chartGroup) {
    var LABEL_CSS_CLASS = "dc-table-label";
    var ROW_CSS_CLASS = "dc-table-row";
    var COLUMN_CSS_CLASS = "dc-table-column";
    var GROUP_CSS_CLASS = "dc-table-group";

    var _chart = dc.baseChart({});

    var _size = 25;
    var _columns = [];
    var _sortBy = function(d) {
        return d;
    };
    var _order = d3.ascending;
    var _sort;

    _chart.doRender = function() {
        _chart.selectAll("tbody").remove();

        renderRows(renderGroups());

        return _chart;
    };

    function renderGroups() {
        var groups = _chart.root().selectAll("tbody")
            .data(nestEntries(), function(d) {
                return _chart.keyAccessor()(d);
            });

        var rowGroup = groups
            .enter()
            .append("tbody");

        rowGroup
            .append("tr")
            .attr("class", GROUP_CSS_CLASS)
                .append("td")
                .attr("class", LABEL_CSS_CLASS)
                .attr("colspan", _columns.length)
                .html(function(d) {
                    return _chart.keyAccessor()(d);
                });

        groups.exit().remove();

        return rowGroup;
    }

    function nestEntries() {
        if (!_sort)
            _sort = crossfilter.quicksort.by(_sortBy);

        var entries = _chart.dimension().top(_size);

        return d3.nest()
            .key(_chart.group())
            .sortKeys(_order)
            .sortValues(_order)
            .entries(_sort(entries, 0, entries.length));
    }

    function renderRows(groups) {
        var rows = groups.order()
            .selectAll("tr." + ROW_CSS_CLASS)
            .data(function(d) {
                return d.values;
            });

        var rowEnter = rows.enter()
            .append("tr")
            .attr("class", ROW_CSS_CLASS);

        for (var i = 0; i < _columns.length; ++i) {
            var f = _columns[i];
            rowEnter.append("td")
                .attr("class", COLUMN_CSS_CLASS + " _" + i)
                .html(function(d) {
                    return f(d);
                });
        }

        rows.exit().remove();

        return rows;
    }

    _chart.doRedraw = function() {
        return _chart.doRender();
    };

    _chart.size = function(s) {
        if (!arguments.length) return _size;
        _size = s;
        return _chart;
    };

    _chart.columns = function(_) {
        if (!arguments.length) return _columns;
        _columns = _;
        return _chart;
    };

    _chart.sortBy = function(_) {
        if (!arguments.length) return _sortBy;
        _sortBy = _;
        return _chart;
    };

    _chart.order = function(_) {
        if (!arguments.length) return _order;
        _order = _;
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};


dc.spcChart=function(parent,chartGroup)
{
var _chart = dc.lineChart(parent,chartGroup);
_chart.mergeStacks(true);
var _calculate=false;
average = function(a) {
  var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
  for(var m, s = 0, l = t; l--; s += a[l]);
  for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
  return r.deviation = Math.sqrt(r.variance = s / t), r;
}
   
var _hidemainSeries=false;
var _highLightData=[];
var _showHighLights=false;
var _finLines;   
    _chart.hidemainSeries = function(_) {
        if (!arguments.length) return _hidemainSeries;
        _hidemainSeries = _;
        return _chart;
    };
       
    _chart.highLightData = function(_) {
        if (!arguments.length) return _highLightData;
        _highLightData = _;
        return _chart;
    };
          _chart.showHighLights = function(_) {
        if (!arguments.length) return _showHighLights;
        _showHighLights = _;
        return _chart;
    };
 
 
    
     var lineX = function(d) {
        return _chart.margins().left + _chart.x()(_chart.keyAccessor()(d));
    };

    var lineY2=function(d) {
    
     return _chart.margins().top + _chart.y()(d.value);
    }
    var lineY = function(d, dataIndex, groupIndex) {
        var y = _chart.getChartStack().getDataPoint(groupIndex, dataIndex);
        if (y >= _chart.dataPointBaseline())
            y += _chart.dataPointHeight(d, groupIndex);
            
        return y;
    };
                              
 var line = d3.svg.line()
            .x(function(d){ return  _chart.margins().left +_chart.x()( d3.time.format("%Y%m").parse(d.key))})
            .y(function(d, dataIndex) {
                var groupIndex = 3;
                return lineY2(d)
                          });
                                   
 var lineND = d3.svg.line()
            .x(function(d){ return  _chart.margins().left +_chart.x()( d.key)})
            .y(function(d, dataIndex) {
                var groupIndex = 0;
                return lineY2(d)
                          });
    
    
    
    
    var drawFYearLine=function()
    {
     _finLines=_chart.chartBodyG().insert("g",":first-child").attr("class","FinLine");
    //d="Mon Apr 01 2013 00:00:00 GMT+0100 (GMT Daylight Time) ";
    var d=getStartCurrentFiscalYear();
  
  
  //var line=d3.svg.line().x(function(d) {return  _chart.margins().left +_chart.x()( d.key)}
  //y(0);
          
          
  _finLines.append("line").attr("x1", _chart.margins().left +_chart.x()( d)).attr("x2", _chart.margins().left +_chart.x()( d)).attr("y1",0).attr("y2",_chart.height()-_chart.margins().top).style("stroke","grey").style("stroke-dasharray","3,3") ;
    }
    
    var drawHighlights=function(col,style)
    {
                  
                  var m=_chart.chartBodyG().select("g.HighlightArea");
                 
              //m=_chart.chartBodyG().append("g");
              
    
    var data=[];
    
            var inRun=0;
        _chart.group().all().forEach(function(d,i) {
        var startPos=0;
       
                var key = _chart.keyAccessor()(d);
                var value =d.value[col];
             
                
                
                if (d.value[col]==1)
                {
                    if (inRun==0)
                    {
                     //Get Last 4 points first and set flag
                     inRun=1;
                      
                     var o=_chart.group().all()[i-4];
                      data.push({key:_chart.keyAccessor()(o),value:o.value.Value});
                      o=_chart.group().all()[i-3];
                      data.push({key:_chart.keyAccessor()(o),value:o.value.Value});
                      o=_chart.group().all()[i-2];
                      data.push({key:_chart.keyAccessor()(o),value:o.value.Value});
                      o=_chart.group().all()[i-1];
                      data.push({key:_chart.keyAccessor()(o),value:o.value.Value});
                    
                    }
                    //Push current value
                    data.push({key:key,value:d.value.Value});
                }
                    else
                    
                    {
                    if (inRun==1)
                    {
                     inRun=0;
                     var mn=m.append("path").attr("class","line TREND").attr("d",lineND(data));
                      
                      style.forEach(function(d) {
                      if (d.Style!="Column")
                      {
                     mn.style(d.Style,d.Value);
                     }
                     });
                     data=[];
                     }
                    }
               
                });
                  
                    
                          
            
             
        
    
    
    }
    
    dc.override(_chart, "render", function(_) {
        //Draw chart normally first
       
       
       
       
        _chart._render();
        //Now format SPC line bits
            drawFYearLine();
        
        if (_highLightData.length>0 && _showHighLights==true)
        {
        
           drawHighlights(  _highLightData[0].Value,_highLightData);
         }  
           
           //Hide existing group value series?
           if (_hidemainSeries)
           {
          _chart.chartBodyG().selectAll(".stack0").remove();
          }
    
    });
    
     /* _chart.doRender = function() {
        
         _chart.resetSvg();
         //Do we need to work out the SPC values or are they in the data?
         if (_calculate)
         {
                  //var x = average(array);
                 // "UCL = " +( x.mean + ( x.deviation * 3)) + "<br/>" +
                 //"LCL = " + (x.mean - (  x.deviation * 3 )) + "<br/>"
          }
    
    
     
      }

       */
 return _chart.anchor(parent, chartGroup);
   //return dc.lineChart(parent,chartGroup);
}

dc.blockChart=function(parent,chartGroup)
{
    var _chart = dc.baseChart({});
     _chart.__dc_custom__ == true;
     var margin = { top: 20, right: 10, bottom: 0, left: 40 };


var width = 200-margin.left-margin.right;
var _blockHeight = 300;
var blocksPerLine=4;
var svg;
var currentCol=0;
var spacing = 50;
var leftOffset = 20;
var _colourData = [];
var _blockValue="value";
var _blockMin="min";
var _blockMax="max";
var _blockMiddle="middle";
var _blockKey="pod";
var _blockNotes="notes";
var _blockTitle="";
var _blockTitleImage="";
var _blockTitleImageWidth=10;
var _blockTitleImageHeight=10;
var slideDiv;
var slideDivFrame;
var _blockTitleClick="";
var _popupDrill=false;

var _notesDisplay = "";


  _chart.popupDrill = function(s) {
        if (!arguments.length) return _popupDrill;
        _popupDrill = s;
        return _chart;
    };


  _chart.blockValue = function(s) {
        if (!arguments.length) return _blockValue;
        _blockValue = s;
        return _chart;
    };

_chart.blockMin = function(s) {
        if (!arguments.length) return _blockMin;
        _blockMin = s;
        return _chart;
    };
_chart.blockMax = function(s) {
        if (!arguments.length) return _blockMax;
        _blockMax = s;
        return _chart;
    };
_chart.blockMiddle = function(s) {
        if (!arguments.length) return _blockMiddle;
        _blockMiddle= s;
        return _chart;
    };
_chart.blockKey = function(s) {
        if (!arguments.length) return _blockKey;
        _blockKey= s;
        return _chart;
    };
_chart.blockNotes = function(s) {
        if (!arguments.length) return _blockNotes;
        _blockNotes= s;
        return _chart;
    };
     _chart.blockTitle = function(s) {
        if (!arguments.length) return _blockTitle;
        _blockTitle= s;
        return _chart;
    };
    
  _chart.blockTitleClick = function(s) {
        if (!arguments.length) return _blockTitleClick;
        _blockTitleClick= s;
        return _chart;
    };    
    
     _chart.blockTitleImage = function(s) {
        if (!arguments.length) return _blockTitleImage;
        _blockTitleImage= s;
        return _chart;
    };    
    
    _chart.blockTitleImageWidth = function(s) {
        if (!arguments.length) return _blockTitleImageWidth;
        _blockTitleImageWidth=s;                         
        return _chart;
    };    
    
    _chart.blockTitleImageHeight = function(s) {
        if (!arguments.length) return _blockTitleImageHeight;
        _blockTitleImageHeight= s;
        return _chart;
    };    
    
    
    
 _chart.notesDisplay = function(_) {
        if (!arguments.length) return _notesDisplay;
        _notesDisplay = _;
        return _chart;
    }


       _chart.blockHeight = function(s) {
        if (!arguments.length) return _blockHeight;
        _blockHeight = s;
        return _chart;
    };
        
        _chart.colourData = function(_) {
        if (!arguments.length) return _colourData;
        _colourData = _;
        return _chart;
    };

    function RenderNotes(d) {

        if (_notesDisplay != undefined) {        
            d3.select(_chart.notesDisplay()).selectAll("SPAN").text(d[_blockNotes]);

        }
    }
function ClearNotes()
{
         if (_notesDisplay != undefined) {  
                      d3.select(_chart.notesDisplay()).selectAll("SPAN").text("");
         }
}



      _chart.doRender = function() {
                        

         _chart.resetSvg();
              // svg=_chart.svg().append("g").attr("transform","translate(" + margin.left + ",0)");
                                // _chart.dimension().filter("1");
          //_chart.dimension().group().all().forEach(function(d) {
          currentCol=0;
          _chart.dimension().top(999).forEach(function(d,i) {
                                          
              DrawDataOneG([d],i);
              currentCol++;
              if (currentCol>=blocksPerLine)
              {
               currentCol=0;
              }
            //buttonData.push({Text:d.key, Group:null,Value:d.key});
            });
         
          // data.forEach(function(d, i) {
            //DrawDataOne([d], i);

       // });
         
         
         }

 function GetColour(pod) {
            var match = "#ADDAD9";
            for (y = 0; y < _colourData.length; y++)
            {
                   if (_colourData[y][_blockKey] == pod) {
                       match = _colourData[y].data;
                       
                    break;
                }
            };
            return match;
        }
function SlideOutDrill()
{

   $("body").css("overflow", "auto");
   $('body').off('wheel.modal mousewheel.modal');
    slideDiv.transition().duration(2000).style("opacity", 0).style("left", "6000px");
    document.getElementById('disablingDiv').style.display = 'none'
}


function SlideInDrill(url)
        {
        
        var height = $(window).height();
      
var scrollTop = $(window).scrollTop();

var min_w = 960;
var h = document.body.offsetHeight;
var w = document.body.offsetWidth;
w = w < min_w ? min_w : w;

// d3.select(parent).append("div").attr("id","disablingDiv");
  $("body").css("overflow", "hidden");
   $('body').on('wheel.modal mousewheel.modal', function () {
      return false;
    });
  
document.getElementById('disablingDiv').style.height = height+ 2000 +"px";
document.getElementById('disablingDiv').style.width = w+"px";
document.getElementById('disablingDiv').style.display = 'block'


        
       if (slideDiv==undefined)
       {
       
         // d3.select("#disablingDiv").style("display", "block");
          slideDiv = d3.select(parent)
            .append("foreignObject")
            .append("xhtml:div").style("position", "fixed")
 .style("left", "6000px")
 .style("top", "0px")
 .style("width", w + "px")
 .style("height",  "100%")
 .style("opacity","0")
 .style("padding","4px")
 .style("border","2px solid rgba(0,0,0,0.5)")
 //.style("margin","5px 5px")
.style("z-index","1002");
slideDiv.append("a").attr("class","slideClose")
//.style("background-image","url('../images/Close button 88x24.png')")
//.style("a:hover","background-position: 1px -15px")
        
.on("click",function() { SlideOutDrill(); });;
       //slideDiv.append("svg").attr("width","20px").attr("height","20px").append("rect").attr("width",20).attr("height",20).attr("fill","red").text("CLOSE").on("click",function() { SlideOutDrill(); });
       slideDivFrame=slideDiv.append("xhtml:iframe")
//            .style("position", "absolute")
//  .style("left", "6000px")
 //.style("top","0px" )
 .attr("width", "100%")
 .attr("height", "100%")
 //.style("z-index","1001")
 //.style("opacity", 1)
 .attr("frameborder", 0)
 .style("top", 0)
 .attr("src", url)}
 else
 
 {
  slideDivFrame.attr("src",url);
 }
  slideDiv.transition().duration(2000).style("opacity", 1).style("left", "0px");
        }
        
        
        
        function DrawDataOneG(data,i)
        {                 
                             
             var i2=(Math.floor( (i) /blocksPerLine));
             var left=0;
             left=margin.left+ (currentCol)* (width +spacing);
            //var col=
          
             var svg=_chart.svg().append("g").attr("transform","translate(" +left + "," + (i2 * _blockHeight*2) + ")");  
               var max = d3.max(data, function(d) { if (d[_blockMax] > d[_blockValue]) { return d[_blockMax] } else { return d[_blockValue] } });
           // max += 5;
            var yscale = d3.scale.linear().domain([0, max]).range([0, _blockHeight-20]);

            //Find Colours
            var boxColour = "#ADDAD9";
            boxColour=GetColour(data[0][_blockKey]);
            //var textcolour=;
            
            

            //Draw Min - Max Box
            var mm = svg.selectAll("rect.mm" + i).data(data);
            var mm2 = mm.enter().append("rect").attr("class", "mm" + i);
           // mm2.attr("x", function(data) { return i2 * (width + spacing ); });
            mm2.attr("width", width);
            mm2.attr("fill", "#ACABAB");
            mm2.attr("opacity", 0.25);
            mm2.attr("y", function(data) { return _blockHeight - yscale(data[_blockMax]) });
            mm2.attr("height", function(data) { var m = data[_blockMin]; var mx =data[_blockMax]; var r = mx - m; return yscale(r); });

            //Draw Middle Line
            var ml = svg.selectAll("rect.mid" + i).data(data);
            var ml2 = ml.enter().append("rect").attr("class", "mid" + i);
            //ml2.attr("x", function(data) { return i2 * (width + spacing ); });
            ml2.attr("width", width);
            ml2.attr("y", function(data) { return _blockHeight - yscale(data[_blockMiddle]); });
            ml2.attr("fill", "#9D9DA4");
            ml2.attr("height", 2);

            //Draw Data Box
            var b = svg.selectAll("rect.main" + i).data(data);
            var b2 = b.enter().append("rect").
            on("click",function(d)
            {   
                 _chart.onClick(d);
            
            })
              .on("mouseover", function(d) {
          RenderNotes(d);

      })
      .on("mouseout",function(d) {
      ClearNotes()}).
            transition()
                .duration(600).attr("class", "main" + i);
           // b2.attr("x", function(data) { return i2 * (width + spacing ); });
            b2.attr("width", width);
            b2.attr("fill", boxColour);
            b2.attr("opacity", 0.5);
            b2.attr("y", function(data) { return _blockHeight - yscale(data[_blockValue]) });
            b2.attr("height", function(data) {
                return yscale(data[_blockValue]);
            });
      


            //Draw Text Labels

            //Value
            svg.append("text").attr("fill", boxColour).attr("y", _blockHeight - 10).style("font-family", "'Segoe UI','Trebuchet MS', Arial, Helvetica, sans-serif").style("font-size", "2.0em").text(function(d) { return data[0][_blockValue] });
            //Draw middle text
            svg.append("text").attr("fill","666666").attr("text-anchor", "end").attr("dy", ".4em").attr("y", function(d) { return _blockHeight - yscale(data[0].middle); }).style("font-family", "'Segoe UI','Trebuchet MS', Arial, Helvetica, sans-serif").style("font-size", "0.8em").text(function(d) { return data[0][_blockMiddle] });
            //Draw Min Text
            svg.append("text").attr("fill","#ACABAB").attr("text-anchor", "end").attr("dy", ".4em").attr("y", function(d) { return _blockHeight - yscale(data[0].min); }).style("font-family", "'Segoe UI','Trebuchet MS', Arial, Helvetica, sans-serif").style("font-size", "0.8em").text(function(d) { return data[0][_blockMin] });
            //Draw Max Text
            svg.append("text").attr("fill", "#ACABAB").attr("text-anchor", "end").attr("dy", ".8em").attr("y", function(d) { return _blockHeight - yscale(data[0].max); }).style("font-family", "'Segoe UI','Trebuchet MS', Arial, Helvetica, sans-serif").style("font-size", "0.8em").text(function(d) { return data[0][_blockMax] });
            
            //Draw Metric Labels
            //Go After height (height+50)
            var labelStart = _blockHeight + 50;
            svg.append("text").attr("fill", "#ACABAB").attr("y", labelStart).style("font-family", "'Segoe UI Light','Trebuchet MS', Arial, Helvetica, sans-serif").style("font-size", "1.8em").text("Metric");
            svg.append("text").attr("fill", boxColour).attr("y", labelStart + 30).style("font-family", "'Segoe UI','Trebuchet MS', Arial, Helvetica, sans-serif").style("font-size", "2.0em").text(function() { return data[0][_blockKey] });

            svg.append("text").attr("fill", "#ACABAB").attr("y", labelStart + 60).style("font-family", "'Segoe UI Light','Trebuchet MS', Arial, Helvetica, sans-serif").style("font-size", "1.8em").text("Value ()");
            svg.append("text").attr("fill", boxColour).attr("y", labelStart + 90).style("font-family", "'Segoe UI','Trebuchet MS', Arial, Helvetica, sans-serif").style("font-size", "2.0em").text(function() { return data[0][_blockValue] });            
            
            //Draw Title
            if (_blockTitle!=undefined)
            {
                 
            var t=svg.append("text").attr("fill","black").attr("y",15).style("font-family", "'Segoe UI Light','Trebuchet MS', Arial, Helvetica, sans-serif").style("font-size", "1.4em").text(function() {return data[0][_blockTitle]});
            if (_chart.blockTitleClick()!=undefined)
                              {    
                              
                              var newParams=_chart.GetCurrentParameters(data[0][_blockKey]);
                              
                              if (_popupDrill)
                              {
                              
                               svg.append("image").attr("y",0).attr("x",width-20).attr("xlink:href",_blockTitleImage).attr("width",_blockTitleImageWidth).attr("height",_blockTitleImageHeight).on("click",function() {SlideInDrill("ViewPage.aspx?PageID=" +_chart.blockTitleClick() +"&Parameters=" + newParams + "","_self");});
                               }
                               else
                               {
                              svg.append("image").attr("y",0).attr("x",width-20).attr("xlink:href",_blockTitleImage).attr("width",_blockTitleImageWidth).attr("height",_blockTitleImageHeight).on("click",function() {window.open("ViewPage.aspx?PageID=" +_chart.blockTitleClick() +"&Parameters=" + newParams + "","_self");});
                              }
                               /*
                        var html = d3.select("svg")
      .attr("version", 1.1)
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .node().parentNode.innerHTML;

  d3.select("body").append("a")
      .attr("title", "file.svg")
      .attr("href-lang", "image/svg+xml")
      .attr("href", "data:image/svg+xml;base64,\n" + btoa(html))
      .text("Download");     */
             //t.on("click",function() {alert('click')});
                //t.on("mouseover",function() {alert('mo');});
            }
             }
        }

      


return _chart.anchor(parent, chartGroup);
}


dc.groupSelector=function(parent,chartGroup)
{
   var _chart = dc.baseChart({});
     _chart.__dc_custom__ == true;
     
var _buttonWidth=80;
var _buttonHeight=30;     
var _buttonPadding=0;
var _filterControl;
var _valuesControl;
var _active;
var _buttonColour="#bddbfa";
var _buttonHoverColour="#80b5ea";
var _buttonActiveColour="grey";
var _buttonTextColour="blue";
var _buttons=[];
var _currentValue;
var _currentText;
var _mode;
var _actionMode="N";
var _orientation="H";

 var _prefixControl;
    var _prefixValue="";
    
     _chart.orientation = function(_) {
        if (!arguments.length) return _orientation;
        _orientation = _;
        return _chart;
    }
    
     _chart.prefixControl = function(_) {
        if (!arguments.length) return _prefixControl;
        _prefixControl = _;
        return _chart;
    }

 _chart.buttons = function(_) {
        if (!arguments.length) return _buttons;
        _buttons = _;
        return _chart;
    };
      _chart.actionMode = function(_) {
        if (!arguments.length) return _actionMode;
        _actionMode = _;
        return _chart;
    };

        _chart.buttonPadding = function(d) {
        if (!arguments.length) return _buttonPadding;
        _buttonPadding = d;
        return _chart;
    };
     

    _chart.buttonWidth = function(d) {
        if (!arguments.length) return _buttonWidth;
        _buttonWidth = d;
        return _chart;
    };
     
      _chart.buttonHeight = function(d) {
        if (!arguments.length) return _buttonHeight;
        _buttonHeight = d;
        return _chart;
    };

   _chart.buttonColour = function(d) {
        if (!arguments.length) return _buttonColour;
        _buttonColour = d;
        return _chart;
    };
          
   _chart.buttonColour = function(d) {
        if (!arguments.length) return _buttonColour;
        _buttonColour = d;
        return _chart;
    };
    
    
   _chart.buttonHoverColour = function(d) {
        if (!arguments.length) return _buttonHoverColour;
        _buttonHoverColour = d;
        return _chart;
    };

        _chart.buttonTextColour = function(_) {
        if (!arguments.length) return _buttonTextColour;
        _buttonTextColour = _;
        return _chart;
    };
             
        _chart.buttonActiveColour = function(_) {
        if (!arguments.length) return _buttonActiveColour;
        _buttonActiveColour = _;
        return _chart;
    };
       
          _chart.filterControl = function(_) {
        if (!arguments.length) return _filterControl;
        _filterControl = _;
                   return _chart;
    };
    
          _chart.valuesControl = function(_) {
        if (!arguments.length) return _valuesControl;
        _valuesControl = _;
            return _chart;
    };
    
    
    
    
    
   
   function DeHash(v)
   {
    return v.replace("#","");
   }
   
    function ButtonHover(o)
    {              
                      
             if (String(o).substr(0, 1) == "C") {
                o = (String(o)).substr(1, 20);
                }     
                 
                _chart.svg().selectAll(".gbutton").attr("fill" ,_buttonColour);
    if (_chart.svg().selectAll("#" + o).attr("class")!="gbuttonActive")
    {
    _chart.svg().selectAll("#" +o).attr("fill",_buttonHoverColour);
     }
    
    }
    function ButtonOut(o)
    {
     _chart.svg().selectAll(".gbutton").attr("fill" ,_buttonColour);
     
    }

      function ButtonClick(o)
    {
    
    
           if (String(o).substr(0, 1) == "C") {
            o = (String(o)).substr(1, 20);
                }       
                 
                 
                 
                 var sel=d3.select("#" + o);
                var g=sel.data()[0].Group;
                var v=sel.data()[0].Value;
                var f=sel.data()[0].Filter;
                      
                      
                      if (sel.data()[0].Text==_currentText)
                 {
                 return;
                 }
                 
                     
                if (_actionMode=="N")
                {
                     
                if (g!=undefined)
                {
             
              
                _filterControl.group(g);
             
                 _filterControl.render();
                }
                
                //Using as a generic filter control on a fixed value
                if (f!=undefined)
                {
                  if (_filterControl!=undefined)
                {
                        
                        if (f=="*")
                        {
                         
                        
                _filterControl.dimension().filterAll();
                 _filterControl.render();
                 }
                 else
                 {
                        
                _filterControl.dimension().filter(f);
                 _filterControl.render();
                 }
                       }
                 else
                 {
                    _chart.filterAll();
                    _chart.filter(_currentValue);
                    dc.redrawAll();
                 }
                 
                
                
                
                }
                   
                if (v!=undefined)
                {                               
                _currentValue=sel.data()[0].Value;
                
                if (_filterControl!=undefined)
                {
                
                _filterControl.valueElement(_prefixValue + sel.data()[0].Value);
                 _filterControl.render();
                 }
                 if (_valuesControl!=undefined)
                       { 
                                   //var va=function(d) {return d.value. _prefixValue + sel.data()[0].Value ;};
                                   var va=new Function("d","return d.value." + _prefixValue + sel.data()[0].Value+ ";");
                                     //var va="function(d) {return d.value." +_prefixValue + sel.data()[0].Value + ";}";
                                    
                  _valuesControl.valueAccessor(va);
                         _valuesControl.render();
                 
                 }
                 if (   _filterControl==undefined &&  _valuesControl  ==undefined)
                 {
                    _chart.filterAll();
                    _chart.filter(_currentValue);
                    dc.redrawAll();
                 }
                 
                }
                
                
                }
                
                //Swap Mode (swap visibility of controls)
                if (_actionMode=="S")
                {
              
              _currentValue.SetVisibility(false);
              
              v.SetVisibility(true);
               _currentValue=v;
                                           
                
                
                }
                                       if (_orientation=="H")
                                       {
              _active.transition()
                .duration(400).attr("x",sel.attr("x"));
                }
                else
                 {
                _active.transition()
                .duration(400).attr("y",sel.attr("y"));              
                }
                
                _currentText=sel.data()[0].Text;
                
                }

   

        _chart.doRender = function() {
        
         _chart.resetSvg();
        
        
        
        
      //_chart.root().selectAll("div").remove();
      // var sel = _chart.root().append("div").attr("class", "groupSelectorMain");

       //Now append buttons
       
        //var buttonData=[{Text:"Button 1",Group:"g"},{Text:"Button 2",Group:"h"},{Text:"Button 3",Group:"i"}];
        var buttonData=[];
        
        if (_buttons.length>0)
        {
         buttonData=_buttons;
         _mode="M";
         }
         else          
         {
         _mode="F";
         //Get data from Groups and filter too (single filter mode)
                         _chart.dimension().group().all().forEach(function(d) {
                                          
            buttonData.push({Text:d.key, Group:null,Value:d.key});
            
} );
         }
         //console.log(buttonData);
        //var buttonData=[{Text:"Button 1",Group:"g"},{Text:"Button 2",Group:"h"},{Text:"Button 3",Group:"i"}];
        //buttonData.push([{Text:"Button 1",Group:"g"},{Text:"Button 2",Group:"h"}]);
        
        if (_orientation=="H")
        {
        
        var buts=_chart.svg().selectAll("rect").data(buttonData).enter().append("rect").attr("class","gbutton").attr("id",function (d,i) {return "BUT" + DeHash(parent) + i;}).attr("x",function(d,i) {return  (_buttonWidth*i) + _buttonPadding * i ;}).attr("y",0).attr("width",_buttonWidth).attr("height",_buttonHeight).attr("fill",_buttonColour).attr("ry",0)
        .on("mouseover",function() { ButtonHover(this.id); }).on("mouseout",function() {ButtonOut(this.id);}).on("click",function(d) {ButtonClick(this.id);});
        //var x=_chart.svg().append("svg:foreignObject").attr("width",400).attr("height",400).attr("x",50).attr("y",50);
         //var buts=x.selectAll("xhtml:div").data(buttonData).enter().append("xhtml:div").attr("class","groupButton").text(function(d) {return d.Text;});
         //Add Active button highlight
      _active=_chart.svg().append("rect").attr("class","active").attr("id","active").attr("x",0).attr("y",0).attr("width",_buttonWidth).attr("height",_buttonHeight).attr("fill",_buttonActiveColour);

        _chart.svg().selectAll("text").data(buttonData).enter().append("text").attr("class","groupSelectorTextStyle").attr("style","cursor: default").attr("text-anchor", "middle").attr("dy", ".3em").attr("id",function (d,i) {return "CBUT" + DeHash(parent) + i;}).attr("x",function(d,i) {return ((_buttonWidth*i) + _buttonPadding * i) +_buttonWidth/2  }).attr("dx",0).attr("y",_buttonHeight/2).attr("fill",_buttonTextColour).text(function(d) {return d.Text;})
          .on("mouseover",function() {ButtonHover(this.id); }).on("mouseout",function() {ButtonOut(this.cid);}).on("click",function() {ButtonClick(this.id);});;
     
     }
     else
     {
            var buts=_chart.svg().selectAll("rect").data(buttonData).enter().append("rect").attr("class","gbutton").attr("id",function (d,i) {return "BUT" + DeHash(parent) + i;}).attr("y",function(d,i) {return  (_buttonHeight*i) + _buttonPadding * i ;}).attr("x",0).attr("width",_buttonWidth).attr("height",_buttonHeight).attr("fill",_buttonColour).attr("ry",0)
        .on("mouseover",function() { ButtonHover(this.id); }).on("mouseout",function() {ButtonOut(this.id);}).on("click",function(d) {ButtonClick(this.id);});
 //Add Active button highlight
      _active=_chart.svg().append("rect").attr("class","active").attr("id","active").attr("x",0).attr("y",0).attr("width",_buttonWidth).attr("height",_buttonHeight).attr("fill",_buttonActiveColour);

         _chart.svg().selectAll("text").data(buttonData).enter().append("text").attr("class","groupSelectorTextStyle").attr("style","cursor: default").attr("text-anchor", "left").attr("dy", ".3em").attr("id",function (d,i) {return "CBUT" + DeHash(parent) + i;}).attr("y",function(d,i) {return ((_buttonHeight*i) + _buttonPadding * i) +_buttonHeight/2  }).attr("dx",0).attr("x",8).attr("fill",_buttonTextColour).text(function(d) {return d.Text;})
         .on("mouseover",function() {ButtonHover(this.id); }).on("mouseout",function() {ButtonOut(this.cid);}).on("click",function() {ButtonClick(this.id);});;
     
     
     
     }
        
      _currentValue=buttonData[0].Value;
      _currentFilter=buttonData[0].Filter;
       //Now bind to seperate PrefixControl if specified
     
     var pc;              
        if (_prefixControl!=undefined)
        {
        
       pc=$(_prefixControl.anchor()).on("select2-selecting",function(v,o) 
       {
        
        _prefixValue=v.val;
        
                _filterControl.valueElement(_prefixValue + _currentValue);
                 _filterControl.render();
                 
                   if (_valuesControl!=undefined)
                       { 
                        var va=new Function("d","return d.value." + _prefixValue + sel.data()[0].Value+ ";");
                        _valuesControl.valueAccessor(va);
                         _valuesControl.render();
                 }
                 
                 
       });
        
        //Read initial value
   
       _prefixValue =_prefixControl.initial();
        
        }
        
        
        //If running in Filter Mode, apply current filter value to control
        if (_filterControl!=undefined && _currentFilter !=undefined)
        {
     
         _filterControl.dimension().filter(_currentFilter);
         _filterControl.render();
        }
     
     
     //If running in Switch mode , apply current visibility state
    /* if (_actionMode=="S")
     {              
          _currentValue.render();
          _currentValue.SetVisibility(false);
                
              
     
     }
      */
        }



  return _chart.anchor(parent, chartGroup);
}

     
dc.selectList=function(parent,chartGroup)
{
        var _chart = dc.baseChart({});
    _chart.__dc_custom__ == true;

    var _values=[];
    var _initial;
    
    _chart.initial= function(d) {
        if (!arguments.length) return _initial;
        _initial = d;
        return _chart;
    }
    
          _chart.values = function(_) {
        if (!arguments.length) return _values;
        _values = _;
        return _chart;
    }
      

 _chart.doRender = function() {
  _chart.root().selectAll("select").remove();
       var sel = _chart.root().append("select").attr("class", "filterDropDownSelect");
                                                                                      
    //Do we have a supplied list of values (for use as a prefix control for example) or do we want to auto filter on dimension
                                            
                                if (_values.length>0)
                                {
                                     _values.forEach(function(d) {
                                             if (_initial!=undefined && _initial==d.Value)
                                             {
                                             sel.append("option").attr("value", d.Value).text(d.Text).attr("selected","");
                                             }
                                             else
                                             {
   sel.append("option").attr("value", d.Value).text(d.Text);
   }
                                   
       

       
           
});
       
}
else
{
 //Values is empty so use dimension to populate
                  
                   //Need to catch change event and trigger filter 
 $(parent).on("select2-selecting",function(v,o) 
       {
        
        //_prefixValue=v.val;
      
                _chart.dimension().filter(v.val);
                             dc.redrawAll();
       });


                  
        sel.append("option");
       _chart.dimension().group().all().forEach(function(d) {
                                          
                if (_initial!=undefined && _initial==d.key)
                                   {
                      sel.append("option").attr("value", d.key).text(d.key).attr("selected","");
                      //Also pre-filter it
                                    _chart.dimension().filter(d.key);
                                    dc.redrawAll();
                               }
                              else
                              {           
            sel.append("option").attr("value", d.key).text(d.key);
            }
            
} );

}

 $(sel).select2({ width: "200px" }) ;
         $(parent).on("select2-opening",function(e) {
            //
         });        

}
 return _chart.anchor(parent, chartGroup);

}


dc.multiSelection=function(parent,chartGroup)
{
        var _chart = dc.baseChart({});
    _chart.__dc_custom__ == true;
    var _current;
    var _itemCount;
    var _labelControl;
    var _labelTag;
    var _top=0;
    var _haveFiltered=false;
    var _preventAdding=false;
    var _selectorDiv;
    var _selectorControl;
    var _selectedWidth=200;
    var _selectedData=[];
    var _selectorWidth=200;
    var _placeHolder="";
     
     _chart.selectorDiv = function(_) {
        if (!arguments.length) return _selectorDiv;
        _selectorDiv = _;
        return _chart;
    }
     _chart.placeHolder = function(_) {
        if (!arguments.length) return _placeHolder;
        _placeHolder = _;
        return _chart;
    }
    
    
     _chart.labelControl = function(_) {
        if (!arguments.length) return _labelControl;
        _labelControl = _;
        return _chart;
    }
          _chart.preventAdding = function(_) {
        if (!arguments.length) return _preventAdding;
        _preventAdding = _;
        return _chart;
    }
     _chart.top = function(d) {
        if (!arguments.length) return _top;
        _top = d;
        return _chart;
    }

      _chart.selectorWidth = function(d) {
        if (!arguments.length) return _selectorWidth;
        _selectorWidth = d;
        return _chart;
    }

      _chart.selectedWidth = function(d) {
        if (!arguments.length) return _selectedWidth;
        _selectedWidth = d;
        return _chart;
    }

_chart.labelTag = function(d) {
        if (!arguments.length) return _labelTag;
        _labelTag = d;
        return _chart;
    }
   _chart.UpdateLabel = function() {

        if (_chart.labelControl() != undefined && _chart.labelTag() != undefined) {

            var l = d3.select(_chart.labelControl());
            l = l.selectAll(_chart.labelTag());
            var ltext = _current;
            if (ltext == "*") ltext = _chart.allText();
            d3.select(l[0][0]).text(ltext);
        }
    }
    
  dc.override(_chart, "filterAll", function(_) {

        if (_ == undefined) {
            _current = "*";
            _chart.UpdateLabel();
            _chart.invokeFilteredListener(_chart, _current);
            _chart.dimension().filterAll();
            _chart.doRender();

        }
        //this.filterAll(_);
    });
    _chart.on("filtered", function(chart) {
        // console.log(_chart.dimension().filter.length );

    });

      _chart.doRender = function() {


                                //console.log(_chart.group().all());

        if (_itemCount == '*') {
            _itemCount = _chart.dimension().group().all().length;
        }
        _chart.root().selectAll("select").remove();
       var sel = _chart.root().append("select").attr("class", "filterDropDownList").attr("multiple","yes");
                           
         $(sel).select2({ width: _selectedWidth,containerCssClass:"select2-container",dropdownCssClass:"select2-dropdown",formatResultCssClass:"select2-result",placeholder:_placeHolder }) ;
         $(parent).on("select2-opening",function(e) {
            if (_preventAdding==true || _selectorDiv!=undefined) e.preventDefault();
         });              
         $(parent).on("select2-selecting",function(v,o) {
         _chart.filter(v.val);
                      dc.redrawAll();
                });
                $(parent).on("select2-removed",function(v) {
                           _chart.filter(v.val);
                
                if ( _selectorDiv!=undefined  )
                {
                
                  var pos=-1;
                  
                   for (var i=0;i<_selectedData.length;i++) 
                   {
                   if (_selectedData[i]==v.val)
                   {
                   //console.log(_selectedData[i]);
                   pos=i;
                   break;
                   }
                   
                   
                   }
                  
                 // var p=_selectedData.indexOf(v.val);
                    //var sd=_selectedData;
                   // console.log(v.val,pos,sd);
                    _selectedData=_selectedData.splice(pos+1,1);
                    
                       SetItemState(_selectorDiv,v.val,0);
                    
                    //console.log(_selectedData);
                    //_chart.x().domain(_chart.x().domain().splice(p+1,1));
                }
                
                dc.redrawAll();
                
                
                
                
                }   );
                
                
            
        _chart.dimension().group().all().forEach(function(d) {

            var k = sel.append("option").attr("value", d.key).text(d.key);
            if (d.key == _current) { k.attr("selected", ""); }
                });

                
                if (!_haveFiltered)
                _haveFiltered=true;
              
                {
                
                if (_chart.top()>0)
                {
                   var allItems=[];
                   var t=_chart.group().top(_chart.top());
                             
                          t.forEach(function(d) {
                var key = _chart.keyAccessor()(d);
                var value = _chart.valueAccessor()(d);
                  
                     allItems.push(key);
                      _chart.filter(key);
              
                } );
                 $(sel).select2("val", allItems); 
               dc.redrawAll();
                  }
                        }
                
        _current = "*";
        _chart.UpdateLabel();
        
        
        //Now add seperate controller div if specified
        
        if (_selectorDiv!=undefined)
        {
        
        if (_selectorControl==undefined)
        {
                    _selectorControl = d3.select(_chart.selectorDiv());
                //_selectorControl = _selectorControl.append("svg").attr("width", 200).attr("height", 200);

        }
                      var selector=_selectorControl.selectAll("select").remove();
         
              selector=_selectorControl.append("select").attr("class", "filterDropDownListSelector");
                              
         $(selector).select2({width:_selectorWidth,dropdownAutoWidth:true,containerCssClass:"select2-container",dropdownCssClass:"select2-dropdown",formatResultCssClass:"select2-result"}) ;
       
         
            $(_selectorDiv).on("select2-selecting",function(v,o) {
        //alert(v.val);
         _selectedData.push([v.val]);
                        
          v.preventDefault();
                $(selector).select2("close");
               $(sel).select2("val",_selectedData);
               
               //Disable this option in this select box
                  SetItemState(_selectorDiv,v.val,1);
               
                  _chart.filter(v.val);
                      dc.redrawAll();               
                });
         
         
                    _chart.dimension().group().all().forEach(function(d) {

            var k = selector.append("option").attr("value", d.key).text(d.key);
            if (d.key == _current) { k.attr("selected", ""); }
                });
        
        }
        
      
     
       

    }

    function SetItemState(lbo,it,state)
    {
        
     $(function() {
    $(lbo + " option").each(function(i){
  
    if ($(this).text()==it)
    {
     $(this).prop('disabled',state);
    }
        //alert($(this).text() + " : " + $(this).val());
    });
});
    }

    /*
    _chart.doRedraw = function() {
    return _chart.doRender();
    };
    */

    return _chart.anchor(parent, chartGroup);

}

dc.filterList = function(parent, chartGroup) {



    var _chart = dc.baseChart({});
    _chart.__dc_custom__ == true;
    var _current;
    var _itemCount;
    var _labelControl;
    var _labelTag;
    var _allText = "ALL";

    dc.override(_chart, "filterAll", function(_) {

        if (_ == undefined) {
            _current = "*";
            _chart.UpdateLabel();
            _chart.invokeFilteredListener(_chart, _current);
            _chart.dimension().filterAll();
            _chart.doRender();

        }
        //this.filterAll(_);
    });



    _chart.on("filtered", function(chart) {
        // console.log(_chart.dimension().filter.length );

    });


    _chart.labelControl = function(_) {
        if (!arguments.length) return _labelControl;
        _labelControl = _;
        return _chart;
    }


    _chart.labelTag = function(d) {
        if (!arguments.length) return _labelTag;
        _labelTag = d;
        return _chart;
    }

    _chart.itemCount = function(_) {
        if (!arguments.length) return _itemCount;
        _itemCount = _;
        return _chart;
    };
    _chart.allText = function(_) {
        if (!arguments.length) return _allText;
        _allText = _;
        return _chart;
    };


    _chart.Hide = function() {
        _chart.root().transition().each('end', function(d) { _chart.root().style("display", "none") }).duration(500).style("opacity", 0);

    }
    _chart.Show = function() {
        _chart.root().style("display", "inline");

        _chart.root().transition().duration(500).style("opacity", 1);
    }

    _chart.UpdateLabel = function() {

        if (_chart.labelControl() != undefined && _chart.labelTag() != undefined) {

            var l = d3.select(_chart.labelControl());
            l = l.selectAll(_chart.labelTag());
            var ltext = _current;
            if (ltext == "*") ltext = _chart.allText();
            d3.select(l[0][0]).text(ltext);
        }
    }
    
   
    
    _chart.doRender = function() {




        if (_itemCount == '*') {
            _itemCount = _chart.dimension().group().all().length;
        }
        _chart.root().selectAll("select").remove();
        var sel = _chart.root().append("select").attr("class", "filterDropDownList").attr("id","FilterDiv2");

        if (_chart.itemCount() != undefined) {
            sel.attr("size", _itemCount);
        }

        sel.on("change", function(d) {
            _current = this.value;
            _chart.UpdateLabel();
            _chart.invokeFilteredListener(_chart, _current);

            if (this.value == '*') {
                _chart.dimension().filterAll();
            }
            else {
                _chart.dimension().filter(this.value);
            }
            dc.redrawAll();
        });


        var allItem = sel.append("option").attr("value", "*").text("ALL");
        if (_current == undefined || _current == "*") { allItem.attr("selected", ""); };
        _chart.dimension().group().all().forEach(function(d) {

            var k = sel.append("option").attr("value", d.key).text(d.key);
            if (d.key == _current) { k.attr("selected", ""); }
        });
        _current = "*";
        _chart.UpdateLabel();

    }

    /*
    _chart.doRedraw = function() {
    return _chart.doRender();
    };
    */

    return _chart.anchor(parent, chartGroup);
}

/*
dc.filterDropDown=function(parent,chartGroup)
{
var _chart = dc.baseChart({});
var _current; 
         
_chart.doRender = function() {
_chart.root().selectAll("select").remove();
var sel=_chart.root().append("select").attr("class","filterDropDown");
sel.on("change",function(d) {
_current=this.value;
if (this.value=='*') {_chart.dimension().filterAll();
}
else
{
_chart.dimension().filter(this.value);
}
dc.redrawAll();});
        
        
var allItem= sel.append("option").attr("value","*").text("ALL");
if (_current==undefined || _current=="*") {allItem.attr("selected","");};
_chart.dimension().group().all().forEach(function(d) {
var k= sel.append("option").attr("value",d.key).text(d.key);
if (d.key==_current) {k.attr("selected","");}
});
}
               
        
return _chart.anchor(parent, chartGroup);
}
*/


dc.dataTableSummary = function(parent, chartGroup) {

    var LABEL_CSS_CLASS = "dc-table-label";
    var ROW_CSS_CLASS = "dc-table-row";
    var COLUMN_CSS_CLASS = "dc-table-column";
    var GROUP_CSS_CLASS = "dc-table-group";

    var _chart = dc.baseChart({});

    var _size = 25;
    var _columns = [];
    var _sortBy = function(d) {
        return d;
    };
    var _order = d3.ascending;
    var _sort;

    _chart.doRender = function() {
        _chart.selectAll("tbody").remove();

        //renderRows(renderGroups());
        //renderData();
        var data = [];
        _chart.group().all().forEach(function(d) {
            var d = { KEY: d.key, VALUE: d.value };
            data.push(d);

            //alert(d.KEY);
            //alert(d.value);
        });
        tabulate(data, ["KEY", "VALUE"]);
        //tabulate(data,_chart.seriesLabels());
        return _chart;
    };

    function tabulate(data, columns) {
        _chart.root().append("tbody");
        var table = _chart.root().selectAll("tbody").append("table");
        //.attr("style", "margin-left: 250px"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

        // append the header row
        thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()

        .append("th")
        .attr("class", COLUMN_CSS_CLASS)
            .text(function(column) { return column; });

        // create a row for each object in the data
        var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr")
        .attr("class", ROW_CSS_CLASS)
        ;

        // create a cell in each row for each column
        /*             
        var cells = rows.selectAll("td")
        .data(data)
        .enter()
        .append("td")
        .attr("style", "font-family: Courier")
        .html(function(d,i) {alert( d[i]);return d[i]; });
        */


        var cells = rows.selectAll("td")
        .data(function(row) {


            return columns.map(function(column) {

                return { column: column, value: row[column] };
            });
        })
        .enter()
        .append("td")
        .attr("style", "font-family: Courier")
            .html(function(d) { return d.value; });

        return table;
    }


    function renderData() {
        var data = [];
        _chart.group().all().forEach(function(d) {
            var d = { KEY: d.key, VALUE: d.value };
            data.push(d);

            //alert(d.key);
            //alert(d.value);
        });


        var groups = _chart.root().selectAll("tbody").data(data);
        console.log(groups);
        var rows = groups.selectAll("tr." + ROW_CSS_CLASS)
            .data(function(d) {
                return d.Specialty;
            });

        var rowEnter = rows.enter()
            .append("tr")
            .attr("class", ROW_CSS_CLASS);

        for (var i = 0; i < _columns.length; ++i) {
            var f = _columns[i];
            rowEnter.append("td")
                .attr("class", COLUMN_CSS_CLASS + " _" + i)
                .html(function(d) {
                    return f(d);
                });
        }

        rows.exit().remove();


    }


    function renderGroups() {
        var groups = _chart.root().selectAll("tbody")
            .data(nestEntries(), function(d) {
                return _chart.keyAccessor()(d);
            });

        var rowGroup = groups
            .enter()
            .append("tbody");

        rowGroup
            .append("tr")
            .attr("class", GROUP_CSS_CLASS)
                .append("td")
                .attr("class", LABEL_CSS_CLASS)
                .attr("colspan", _columns.length)
                .html(function(d) {
                    return _chart.keyAccessor()(d);
                });

        groups.exit().remove();

        return rowGroup;
    }

    function nestEntries() {
        if (!_sort)
            _sort = crossfilter.quicksort.by(_sortBy);
        var data = [];
        _chart.group().all().forEach(function(d) {
            var d = { KEY: d.key, VALUE: d.value };
            data.push(d);
            //alert(d.key);
            //alert(d.value);
        });


        //var entries = _chart.dimension().top(_size);
        var entries = data;
        // console.log(entries);
        return data;
        /* return d3.nest()
        .key(_chart.group())
        .sortKeys(_order)
        .sortValues(_order)
        .entries(_sort(data, 0, data.length));
        */
    }

    function renderRows(groups) {
        var rows = groups.order()
            .selectAll("tr." + ROW_CSS_CLASS)
            .data(function(d) {
                return d.values;
            });

        var rowEnter = rows.enter()
            .append("tr")
            .attr("class", ROW_CSS_CLASS);

        for (var i = 0; i < _columns.length; ++i) {
            var f = _columns[i];
            rowEnter.append("td")
                .attr("class", COLUMN_CSS_CLASS + " _" + i)
                .html(function(d) {
                    return f(d);
                });
        }

        rows.exit().remove();

        return rows;
    }

    _chart.doRedraw = function() {
        return _chart.doRender();
    };

    _chart.size = function(s) {
        if (!arguments.length) return _size;
        _size = s;
        return _chart;
    };

    _chart.columns = function(_) {
        if (!arguments.length) return _columns;
        _columns = _;
        return _chart;
    };

    _chart.sortBy = function(_) {
        if (!arguments.length) return _sortBy;
        _sortBy = _;
        return _chart;
    };

    _chart.order = function(_) {
        if (!arguments.length) return _order;
        _order = _;
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);

}



dc.dataTableDetail =
    function (parent, chartGroup) {

    var LABEL_CSS_CLASS = "dc-table-label";
    var ROW_CSS_CLASS = "dc-table-row";
    var COLUMN_CSS_CLASS = "dc-table-column";
    var GROUP_CSS_CLASS = "dc-table-group";

    var _chart = dc.baseChart({});

    var _size = 25;
    var _columns = [];
    var _sortBy = function(d) {
        return d;
    };
    var _order = d3.ascending;
    var _sort;
    var _enhanceTable=false;
    var _renderedOnce=false;

    var _sparklineData=[];

    var _clickableColumns=[];
    var _rowClickKeys=[];
    var _literalParameters=[];
    var _sparkLineOptions=[];
    
      _chart.sparkLineOptions = function(_) {
        if (!arguments.length) return _sparkLineOptions;
        _sparkLineOptions = _;
        return _chart;
    }
    
      _chart.literalParameters = function(_) {
        if (!arguments.length) return _literalParameters;
        _literalParameters = _;
        return _chart;
    }

    
       _chart.clickableColumns = function(_) {
        if (!arguments.length) return _clickableColumns;
        _clickableColumns = _;
        return _chart;
    }
        _chart.rowClickKeys = function(_) {
        if (!arguments.length) return _rowClickKeys;
        _rowClickKeys = _;
        return _chart;
    }


    _chart.enhanceTable = function(_) {
        if (!arguments.length) return _enhanceTable;
        _enhanceTable = _;
        return _chart;
    };

    _chart.sparklineData = function(_) {
        if (!arguments.length) return _sparklineData;
        _sparklineData = _;
        return _chart;
    };

//Override base SetVisibility Function to deal with non-svg element
    _chart.SetVisibility=function(v)
    {
    if (v==false)
    {
          
          d3.select(parent).transition().duration(600).style("opacity",0).each("end",function (d) {d3.select(this).style("display","none")});
        
          _chart.visible(false);
          }
          else
          
          {
          d3.select(parent).style("display","inline")//.style("opacity",1);
          d3.select(parent).transition().duration(600).style("opacity",1);
         _chart.visible(true);
       
          }
                  if (_renderedOnce)
                  {
                        $.sparkline_display_visible();
                  }
                  else
                  
                  {
                    ActivateSparkLines();
                    //$('.inlinesparkline').sparkline();
                  }
          //$('#inlinesparkline').sparkline('html',{type:"bar"});
          
         
     
         
         
        
    }

    _chart.doRender = function() {
    
    //Temp Sparkline Array Data
//_sparklineData=[{type:"bullet",column:"sparkline"}];
    //Remove the above temp block
        _chart.selectAll("tbody").remove();

        //renderRows(renderGroups());
        //renderData();
        var data = [];
        
        
       var strName, strValue ;
       var d=_chart.dimension().top(1)[0];
       var columns=[];
for(strName in d)
{
columns.push(strName);
   
}
        
      
        
        
        tabulate(_chart.dimension().top(999),columns);
        
        //_chart.group().all().forEach(function(d) {
         //   var d = { KEY: d.key, VALUE: d.value };
          //  data.push(d);

            //alert(d.KEY);
            //alert(d.value);
        //});
        //tabulate(data, ["KEY", "VALUE"]);
        //tabulate(data,_chart.seriesLabels());
        
       
       
        
        if (_enhanceTable)
        {
        var x=parent + "_table";
             $(x).dataTable(
        {
        "bPaginate":false,
        "sScrollX":"90%",
        "sScrollY":200,
        "bFilter":false
    }
        );
        }
        
        if (_chart.visible()==false)
        {
        
         d3.select(parent).style("display","none").style("opacity",0);
        }
        
        return _chart;
    };

    function ActivateSparkLines()
    {
    
    if (_sparklineData!=undefined)
    {
     //$('.inlinesparkline').sparkline();
       var sparklineInit=[];
       
         sparklineInit.push({type:_sparklineData[0].type,disableInteraction:_sparklineData[0].disableinteraction,tooltipFormat: "{{y:val}}"});  
      //Do we have any options to apply?
      if (_sparkLineOptions.length>0)
         {
        
         
         
         //sparklineInit[0]=sparklineInit.push([{linewidth:3}]);
          _sparkLineOptions.forEach(function (d) { 
          
           
         for (var a in d)
         {
         sparklineInit[0][a]=d[a];
          }
                                      
         });
         //sparklineInit[0]["lineWidth"]=3;
         //sparklineInit[0]["lineColor"]="#ff0000";
         //console.log(sparklineInit[0]);
         
         }
         else
         {
           //sparklineInit.push({type:_sparklineData[0].type,disableInteraction:_sparklineData[0].disableinteraction,tooltipFormat: "{{y:val}}" });
         }
                     
     
     $('.inlinesparkline'+ _chart.getSafeAnchor()).sparkline('html',sparklineInit[0]);
     }
      _renderedOnce=true;   
    }

    function tabulate(data, columns) {
                       
//RowClickKeys override ClickableColumns
//Mode=0 [Nothing clickable],Mode=1 [Individual Columns Clickable], Mode=2 [Row Clickable]
var mode=0;                       
if (_clickableColumns.length>0) {mode=1};
if (_rowClickKeys.length>0) {mode=2};                  
                       
        _chart.root().append("tbody");
        var table = _chart.root().selectAll("tbody").append("table").attr("id",parent.replace("#","") + "_table");
        //.attr("style", "margin-left: 250px"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

        // append the header row
        thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()

        .append("th")
        .attr("class", COLUMN_CSS_CLASS)
            .text(function(column) { return column; });

        // create a row for each object in the data
        var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr")
        .attr("class",function(d) {if (mode==1 | mode==2 ) {return ROW_CSS_CLASS + " tableDetailRowSelectable"} else return ROW_CSS_CLASS})
        ;

        // create a cell in each row for each column
        /*             
        var cells = rows.selectAll("td")
        .data(data)
        .enter()
        .append("td")
        .attr("style", "font-family: Courier")
        .html(function(d,i) {alert( d[i]);return d[i]; });
        */


        var cells = rows.selectAll("td")
        .data(function(row) {


            return columns.map(function(column) {
                    //if (column=="FvalueX")
                    //{
                    //return {column:column,value:generateSubChart()};
                    //}
                    //else
                    //{
                return { column: column, value: row[column] };
                //}
            });
        })
        .enter()
        .append("td")
        .attr("style", "font-family: Courier")
        .attr("id",function(d) {return _chart.getSafeID(d.column)})
            .html(function(d) {
              if (mode==0)
              {
               return d.value;
              }
            if (mode==1)
            {            
            if (ColumnClickable(d.column)==1) { return "<span class='tableDetailClickThrough'>" + d.value + "</span>" }else {return d.value}
            }
            if (mode==2)
            {
                    return "<span class='tableDetailClickThrough'>" + d.value + "</span>";
            }
            
            })
            .on("click",function(d) {
            
            if (mode==1 &&  ColumnClickable(d.column)==1)
            {
            TableCellClick(d,d.column);
            }
            if (mode==2)
            {
             TableRowClick(d,this);
            }
             });
            
             //rows.selectAll("td#Fvalue").append("span").attr("class","inlinesparkline").text(function(d) {return '1,4,4,7,5,9,10';return d.value});
if (_sparklineData!=undefined)
{                  
var oname="td#"+ _sparklineData[0].column;
rows.selectAll(_chart.getSafeID(oname)).text("").append("span").attr("class","inlinesparkline" + _chart.getSafeAnchor()).text(function(d) {return d.value});
 }            
              
               if (_chart.visible()==true)
                                          {
                                          ActivateSparkLines();
                                               
                                                               
                                          }
                
                
                                        
             //.append("svg").append("rect").attr("height",10).attr("width",10).attr("fill","red");
            
            // rows.selectAll("td#Fvalue").append("svg").append("rect").attr("height",10).attr("width",10).attr("fill","red");

                 // rows.selectAll("td#Fvalue").html(generateSubChart());
        //cells.selectAll("td#Fvalue").attr("text","X");
        
        return table;
        
        
    }
    
    function ColumnTarget(col)
    {
          var res=[];
         if (_clickableColumns.length>0)
                {
            _clickableColumns.forEach(function(d) {
          
                        if (col==d.Column) {
                          //console.log(col,d.Column);
                       res=d;
                                  
                        }
});
}
       return res;
    
    }
    
   function ColumnClickable(col)
    {
    var res=0;
         if (_clickableColumns.length>0)
                {
            _clickableColumns.forEach(function(d) {
          
                        if (col==d.Column) {
                          //console.log(col,d.Column);
                       res=1;
                        
                        }
});
}
       return res;
    
    }
    
    function TableRowClick(d,o)
    {
//Process click for Row, need to find the values for all the columns in keys
 var Params=[];
var row=d3.select(o)[0][0].parentNode;
var datarow=d3.select(row)[0][0].__data__;
              _rowClickKeys.forEach(function(d) {
   //console.log(datarow[d.Column]);
   Params.push({ParameterName:d.Column,ParameterValue: datarow[d.Column]});
               //console.log(Params);
   
   
}); 
var ParamString=_chart.BuildParameters(Params);


         if (_chart.popupDrill())
      {
_chart.SlideInDrill("ViewPage.aspx?PageID=" +_chart.clickAction() +"&Parameters=" + ParamString + "","_self");
      }
      else
      {
                window.open("ViewPage.aspx?PageID=" +_chart.clickAction() +"&Parameters=" + ParamString + "","_self");
      }

  
    }
    function TableCellClick(d,c)
    {
    //Process Click for Column
    var Params=[];
            var cData=ColumnTarget(c);
       
     Params.push({ParameterName:cData.ParameterName,ParameterValue: d.value});
      var ParamString=_chart.BuildParameters(Params);
      
      if (_chart.popupDrill())
      {
        _chart.SlideInDrill("ViewPage.aspx?PageID=" + cData.TargetPage +"&Parameters=" + ParamString + "","_self");
      }
      else
      {
               window.open("ViewPage.aspx?PageID=" + cData.TargetPage +"&Parameters=" + ParamString + "","_self");
      }
      
                              // alert(d.value);
                               //alert(c);
    
    }
    
     function generateSubChart()
     {           //return "<svg></svg>";
              return  "<svg width=\"10px\" height=\"10px\" style=\"display:block\"><g><rect width=\"10\" height=\"10\" fill=\"red\"></rect></g></svg>";
      //return "<svg width=\"10px\" height=\"10px\"><rect width=10 height=10 fill=red></rect></svg>";
     }

    function renderData() {
        var data = [];
        _chart.group().all().forEach(function(d) {
            var d = { KEY: d.key, VALUE: d.value };
            data.push(d);

            //alert(d.key);
            //alert(d.value);
        });


        var groups = _chart.root().selectAll("tbody").data(data);
        console.log(groups);
        var rows = groups.selectAll("tr." + ROW_CSS_CLASS)
            .data(function(d) {
                return d.Specialty;
            });

        var rowEnter = rows.enter()
            .append("tr")
            .attr("class", ROW_CSS_CLASS);

        for (var i = 0; i < _columns.length; ++i) {
            var f = _columns[i];
            rowEnter.append("td")
                .attr("class", COLUMN_CSS_CLASS + " _" + i)
                .html(function(d) {
                    return f(d);
                });
        }

        rows.exit().remove();


    }


    function renderGroups() {
        var groups = _chart.root().selectAll("tbody")
            .data(nestEntries(), function(d) {
                return _chart.keyAccessor()(d);
            });

        var rowGroup = groups
            .enter()
            .append("tbody");

        rowGroup
            .append("tr")
            .attr("class", GROUP_CSS_CLASS)
                .append("td")
                .attr("class", LABEL_CSS_CLASS)
                .attr("colspan", _columns.length)
                .html(function(d) {
                    return _chart.keyAccessor()(d);
                });

        groups.exit().remove();

        return rowGroup;
    }

    function nestEntries() {
        if (!_sort)
            _sort = crossfilter.quicksort.by(_sortBy);
        var data = [];
        _chart.group().all().forEach(function(d) {
            var d = { KEY: d.key, VALUE: d.value };
            data.push(d);
            //alert(d.key);
            //alert(d.value);
        });


        //var entries = _chart.dimension().top(_size);
        var entries = data;
        // console.log(entries);
        return data;
        /* return d3.nest()
        .key(_chart.group())
        .sortKeys(_order)
        .sortValues(_order)
        .entries(_sort(data, 0, data.length));
        */
    }

    function renderRows(groups) {
        var rows = groups.order()
            .selectAll("tr." + ROW_CSS_CLASS)
            .data(function(d) {
                return d.values;
            });

        var rowEnter = rows.enter()
            .append("tr")
            .attr("class", ROW_CSS_CLASS);

        for (var i = 0; i < _columns.length; ++i) {
            var f = _columns[i];
            rowEnter.append("td")
                .attr("class", COLUMN_CSS_CLASS + " _" + i)
                .html(function(d) {
                    return f(d);
                });
        }

        rows.exit().remove();

        return rows;
    }

    _chart.doRedraw = function() {
        return _chart.doRender();
    };

    _chart.size = function(s) {
        if (!arguments.length) return _size;
        _size = s;
        return _chart;
    };

    _chart.columns = function(_) {
        if (!arguments.length) return _columns;
        _columns = _;
        return _chart;
    };

    _chart.sortBy = function(_) {
        if (!arguments.length) return _sortBy;
        _sortBy = _;
        return _chart;
    };

    _chart.order = function(_) {
        if (!arguments.length) return _order;
        _order = _;
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);

}


dc.bubbleChart = function(parent, chartGroup) {
    var _chart = dc.abstractBubbleChart(dc.coordinateGridChart({}));

    var _elasticRadius = false;
    var _dynamicLegends = false;

    _chart.transitionDuration(750);

    var bubbleLocator = function(d) {
        return "translate(" + (bubbleX(d)) + "," + (bubbleY(d)) + ")";
    };

    _chart.elasticRadius = function(_) {
        if (!arguments.length) return _elasticRadius;
        _elasticRadius = _;
        return _chart;
    };

    _chart.dynamicLegends = function(_) {
        if (!arguments.length) return _dynamicLegends;
        _dynamicLegends = _;
        return _chart;
    };


    _chart.plotData = function() {
        if (_elasticRadius)
            _chart.r().domain([_chart.rMin(), _chart.rMax()]);

        // _chart.resetLegend();


        _chart.r().range([_chart.MIN_RADIUS, _chart.xAxisLength() * _chart.maxBubbleRelativeSize()]);

        var bubbleG = _chart.chartBodyG().selectAll("g." + _chart.BUBBLE_NODE_CLASS)
            .data(_chart.group().all());

        renderNodes(bubbleG);

        updateNodes(bubbleG);

        removeNodes(bubbleG);
        if (_chart.needLegendRefresh() == true) {

            GenerateLegendItems();
        }
        
        
         if (_chart.showLegend() == true)
         {
        if (_chart.legendContainer() == undefined) {
            _chart.legendBox().attr("transform", "translate(" + (_chart.width() - _chart.fullLength()) + ",10)");
        }
          }


        //console.log(_chart.label()(d));

        _chart.fadeDeselectedArea();
    };


    function UpdateLegendItem(key, cap) {
               if (_chart.showLegend() != true) return;
        if (_chart.dynamicLegends() == true) {

            var k = _chart.legendBox().selectAll("#L" + key);
            var o = d3.select(k[0][0]);
            o[0][0].textContent = cap;
        }
    }

    function GenerateLegendItems() {
        // console.log(_chart.filters());
        //alert(_chart.hasFilter(groupLabel));
        _chart.needLegendRefresh(false);
        if (_chart.showLegend() != true) return;


        var y = _chart.chartBodyG().selectAll("circle");

        var legendCount = y[0].length;
        var maxLength = 0;
        for (var i = 0; i < y[0].length; ++i) {

            var z = d3.select(y[0][i]);
            var col = z.style("fill");
            var cap = d3.select(z[0][0]).attr("titletip");
            var bubblekey = d3.select(z[0][0]).attr("bubblekey");
            if (_chart.legendTitle() != undefined) {
                cap = d3.select(z[0][0]).attr("legendtitle");

            }
            /*
            var u=z[0][0].parentNode;
            u=d3.select(u);
            u=d3.select(u[0][0].childNodes[1]);
            var cap=u.text();
            */

            var t;
            var tt;
            if (_chart.legendPosition() == "Horizontal") {
                //Horizontal


                t = _chart.legendBox().append("circle")
                   .attr("cx", (10 * (i + 1)) + _chart.fullLength())
                   .attr("cy", 10)
                   .attr("r", 5)


    .attr("class", "")
    .style("fill", col)
    .attr("label", cap)
    .on("click", function(d) { var xfilter = d3.select(this).attr("cap"); });


                tt = _chart.legendBox().append("text").attr("id", "L" + bubblekey).text(cap).attr("text-anchor", "start").attr('dy', '.32em')
          .attr('dx', '8').attr("x", (10 * (i + 1)) + _chart.fullLength()).attr("y", "10");
            }

            else {
                //Vertical
                t = _chart.legendBox().append("circle")
                   .attr("cx", 10)
                   .attr("cy", (_chart.legendSpacing() * (i + 1)))
                   .attr("r", 5)


    .attr("class", "")
    .style("fill", col)
    .attr("label", cap)
    .on("click", function(d) { var xfilter = d3.select(this).attr("cap"); });


                tt = _chart.legendBox().append("text").attr("id", "L" + bubblekey).text(cap).attr("text-anchor", "start").attr('dy', '.32em')
          .attr('dx', '8').attr("y", (_chart.legendSpacing() * (i + 1))).attr("x", "10");

            }




            //Generic Length Routines

            _chart.Lastlength(tt.node().getComputedTextLength() + 28);

            if (tt.node().getComputedTextLength() + 28 > maxLength) { maxLength = tt.node().getComputedTextLength() + 28 }

            //alert(_Lastlength);          
            _chart.fullLength(_chart.fullLength() + _chart.Lastlength());

        }


        if (_chart.legendPosition() == "Horizontal") {
            _chart.legendBox().attr("width", _chart.fullLength() + (legendCount * 10)).attr("height", "50");
        }
        else {

            _chart.legendBox().attr("height", (legendCount * _chart.legendSpacing()) + 10).attr("width", maxLength);
        }
    }


    function circleOverlapQ(c1, c2) {
        var distance = Math.sqrt(
        Math.pow(c2.cx - c1.cx, 2) +
        Math.pow(c2.cy - c1.cy, 2)
    );
        if (distance < (c1.r + c2.r)) {
            return true;
        } else {
            return false;
        }
    }
    function HoverBubble(d) {

        var bub = d3.select(d[0][0]);
        var x = d3.select(bub[0][0].childNodes[0]);
        var r = x.attr("r");
        var t = bub.attr("transform");
        t = t.replace("translate", "");
        t = t.replace("(", "");
        t = t.replace(")", "");
        var pos = t.split(",");
        var xpos = pos[0];
        var ypos = pos[1];

        var nearby = []


        c1 = { cx: xpos, cy: ypos, r: r };

        var nodes = _chart.selectAll("g.node").each(function() {
            var child_pos = this.getAttribute("transform");
            child_pos = child_pos.replace("translate", "");
            child_pos = child_pos.replace("(", "");
            child_pos = child_pos.replace(")", "");
            var cpos = child_pos.split(",");
            var cxpos = cpos[0];
            var cypos = cpos[1];
            var c2 = { cx: cxpos,
                cy: cypos,
                r: 5
            };


            if (circleOverlapQ(c1, c2)) {
                nearby.push(this);
            }

        });

        if (nearby.length)
        //alert("These shapes are within click radius: " + nearby.join(", "));
        {
            var list = "";
            nearby.forEach(function(d) {
                var c = d3.select(d.childNodes[0]);
                list += c.attr("titletip") + "\r\n";
                //c.attr("r",2);
                //c.attr("cx",50);
                //d3.select(d.childNodes[0]).attr("cx",50);
            }
                )

            //dc.ShowToolTip(list);

        }
        /*
        for (var i = 0; i < nodes[0].length; ++i) {
        var o=d3.select(nodes[0][i]);
        var child_pos=o.attr("transform");
        child_pos=child_pos.replace("translate","");
        child_pos=child_pos.replace("(","");
        child_pos=child_pos.replace(")","");
        var cpos=child_pos.split(",");
        var cxpos=cpos[0];
        var cypos=cpos[1];
                                 
                                              
                                
                                 
                                 
        };
        */
        //translate(422.3279524214104,147) 

    }

    function renderNodes(bubbleG) {
        var bubbleGEnter = bubbleG.enter().append("g");

        bubbleGEnter
            .attr("class", _chart.BUBBLE_NODE_CLASS)
            .attr("transform", bubbleLocator)
            .append("circle").attr("class", function(d, i) {
                return _chart.BUBBLE_CLASS + " _" + i;
            })

            .on("click", _chart.onClick)
            .attr("fill", _chart.initBubbleColor)
                          .attr("r", 0)
                          .attr("titletip", function(d) { return _chart.title()(d); })
                          .attr("legendtitle", function(d) { return _chart.legendTitle()(d); })
                          .attr("bubblekey", function(d, i) { return d.key.replaceAll(' ', 'X'); })


            .on("mouseover", function(d) {
                var dot = d3.select(this);
                if (_chart.renderTitle()) {
                    dc.ShowToolTip(dot.attr("titletip"), "");
                }
                //HoverBubble(dot);
            })
             .on("mousemove", function(d) {
                 var dot = d3.select(this);
                 if (_chart.renderTitle()) {
                     dc.ShowToolTip(dot.attr("titletip"), "");
                 }

             });
        bubbleGEnter.on("mouseout", function(d) { dc.HideToolTip(); })


        dc.transition(bubbleG, _chart.transitionDuration())
            .attr("r", function(d) {
                return _chart.bubbleR(d);
            })
           .attr("opacity", function(d) {
               return (_chart.bubbleR(d) > 0) ? 1 : 0;
           });

        _chart.doRenderLabel(bubbleGEnter);

        // _chart.doRenderTitles(bubbleGEnter);
    }

    function updateNodes(bubbleG) {
        dc.transition(bubbleG, _chart.transitionDuration())
        .each("end", function(d) { UpdateLegendItem(d.key.replaceAll(' ', 'X'), _chart.legendTitle()(d)); })
            .attr("transform", bubbleLocator)
            .selectAll("circle." + _chart.BUBBLE_CLASS)
            .attr("fill", _chart.updateBubbleColor)
            .attr("r", function(d) {
                return _chart.bubbleR(d);
            })
            .attr("opacity", function(d) {
                return (_chart.bubbleR(d) > 0) ? 1 : 0;
            })
            .attr("titletip", function(d) { return _chart.title()(d); })
            .attr("legendtitle", function(d) { return _chart.legendTitle()(d); })
            ;

        _chart.doUpdateLabels(bubbleG);
        _chart.doUpdateTitles(bubbleG);
    }

    function removeNodes(bubbleG) {
        bubbleG.exit().remove();
    }

    function bubbleX(d) {
        var x = _chart.x()(_chart.keyAccessor()(d)) + _chart.margins().left;
        if (isNaN(x))
            x = 0;
        return x;
    }

    function bubbleY(d) {
        var y = _chart.margins().top + _chart.y()(_chart.valueAccessor()(d));
        if (isNaN(y))
            y = 0;
        return y;
    }

    _chart.renderBrush = function(g) {
        // override default x axis brush from parent chart
    };

    _chart.redrawBrush = function(g) {
        // override default x axis brush from parent chart
        _chart.fadeDeselectedArea();
    };

    return _chart.anchor(parent, chartGroup);
};
dc.compositeChart = function(parent, chartGroup) {
    var SUB_CHART_CLASS = "sub";

    var _chart = dc.coordinateGridChart({});
    var _children = [];

    _chart.transitionDuration(500);

    dc.override(_chart, "generateG", function() {
        var g = this._generateG();

        for (var i = 0; i < _children.length; ++i) {
            var child = _children[i];

            generateChildG(child, i);

            if (child.dimension() == null) child.dimension(_chart.dimension());
            if (child.group() == null) child.group(_chart.group());
            child.chartGroup(_chart.chartGroup());
            child.svg(_chart.svg());
            child.height(_chart.height());
            child.width(_chart.width());
            child.margins(_chart.margins());
            child.xUnits(_chart.xUnits());
            child.transitionDuration(_chart.transitionDuration());
        }

        return g;
    });

    function generateChildG(child, i) {
        child.generateG(_chart.g());
        child.g().attr("class", SUB_CHART_CLASS + " _" + i);
    }

    _chart.plotData = function() {
        for (var i = 0; i < _children.length; ++i) {
            var child = _children[i];

            if (child.g() == null) {
                generateChildG(child, i);
            }

            child.x(_chart.x());
            child.y(_chart.y());
            child.xAxis(_chart.xAxis());
            child.yAxis(_chart.yAxis());

            child.plotData();

            child.activateRenderlets();
        }
    };

    _chart.fadeDeselectedArea = function() {
        for (var i = 0; i < _children.length; ++i) {
            var child = _children[i];
            child.brush(_chart.brush());
            child.fadeDeselectedArea();
        }
    };

    _chart.compose = function(charts) {
        _children = charts;
        return _chart;
    };

    _chart.children = function() {
        return _children;
    };

    function getAllYAxisMinFromChildCharts() {
        var allMins = [];
        for (var i = 0; i < _children.length; ++i) {
            allMins.push(_children[i].yAxisMin());
        }
        return allMins;
    }

    _chart.yAxisMin = function() {
        return d3.min(getAllYAxisMinFromChildCharts());
    };

    function getAllYAxisMaxFromChildCharts() {
        var allMaxes = [];
        for (var i = 0; i < _children.length; ++i) {
            allMaxes.push(_children[i].yAxisMax());
        }
        return allMaxes;
    }

    _chart.yAxisMax = function() {
        return dc.utils.add(d3.max(getAllYAxisMaxFromChildCharts()), _chart.yAxisPadding());
    };

    function getAllXAxisMinFromChildCharts() {
        var allMins = [];
        for (var i = 0; i < _children.length; ++i) {
            allMins.push(_children[i].xAxisMin());
        }
        return allMins;
    }

    _chart.xAxisMin = function() {
        return dc.utils.subtract(d3.min(getAllXAxisMinFromChildCharts()), _chart.xAxisPadding());
    };

    function getAllXAxisMaxFromChildCharts() {
        var allMaxes = [];
        for (var i = 0; i < _children.length; ++i) {
            allMaxes.push(_children[i].xAxisMax());
        }
        return allMaxes;
    }

    _chart.xAxisMax = function() {
        return dc.utils.add(d3.max(getAllXAxisMaxFromChildCharts()), _chart.xAxisPadding());
    };

    return _chart.anchor(parent, chartGroup);
};
dc.geoChoroplethChart = function(parent, chartGroup) {
    var _chart = dc.colorChart(dc.baseChart({}));

    _chart.colorAccessor(function(d, i) {
        return d;
    });

    var _geoPath = d3.geo.path();
    var main;
    var _dataLayer;
    var _geoJsons = [];
    var _colorMapping = [];
    var _dataColors = [];
    var _dataTitle;
    var _showTipGraph = false;
    var _googleLayer = false;
    var map, projection;
    var svg, overlay;

    var mwidth = 600,
    mheight = 600;

    _chart.dataLayer = function(i) {
        if (!arguments.length) return _dataLayer;
        _dataLayer = i;
        return _chart;
    };


    _chart.colorMapping = function(_) {
        if (!arguments.length) return _colorMapping;
        _colorMapping = _;
        return _chart;
    };

    _chart.googleLayer = function(_) {
        if (!arguments.length) return _googleLayer;
        _googleLayer = _;
        return _chart;
    };


    _chart.showTipGraph = function(_) {
        if (!arguments.length) return _showTipGraph;
        _showTipGraph = _;
        return _chart;
    };

    _chart.dataTitle = function(_) {
        if (!arguments.length) return _dataTitle;
        _dataTitle = _;
        return _chart;
    };

    _chart.dataColors = function(_) {
        if (!arguments.length) return _dataColors;
        _dataColors = _;
        return _chart;
    };

    function transform(d) {
        d = new google.maps.LatLng(d.value[1], d.value[0]);
        d = projection.fromLatLngToDivPixel(d);
        return d3.select(this)
            .style("left", (d.x - 10) + "px")
            .style("top", (d.y - 10) + "px");
    }
    function GoogleReDraw() {
        var bounds = map.getBounds(),
        ne = bounds.getNorthEast(),
        sw = bounds.getSouthWest(),
        projection = d3.geo.mercator()
            .rotate([-bounds.getCenter().lng(), 0])
            .translate([0, 0])
        //.center([0,0])
            .scale(1)
        path = d3.geo.path()
            .projection(projection);

        //path = d3.geo.path().projection(googleMapProjection);


        var p1 = projection([ne.lng(), ne.lat()]),
        p2 = projection([sw.lng(), sw.lat()]);

        svg.select('#countries').attr('transform',
        'scale(' + mwidth / (p1[0] - p2[0]) + ',' + mheight / (p2[1] - p1[1]) + ')' +
        'translate(' + (-p2[0]) + ',' + (-p1[1]) + ') ');

        svg.selectAll('path').attr('d', path);

    }
    function GoogleReDraw2() {
        var bounds = map.getBounds(),
        ne = bounds.getNorthEast(),
        sw = bounds.getSouthWest(),
        projection = d3.geo.mercator()
            .rotate([-bounds.getCenter().lng(), 0])
            .translate([0, 0])
        //.center([0,0])
            .scale(1)
        path = d3.geo.path()
            .projection(projection);

        //path = d3.geo.path().projection(googleMapProjection);


        var p1 = projection([ne.lng(), ne.lat()]),
        p2 = projection([sw.lng(), sw.lat()]);

        svg.select('#countries').attr('transform',
        'scale(' + mwidth / (p1[0] - p2[0]) + ',' + mheight / (p2[1] - p1[1]) + ')');

        svg.selectAll('path').attr('d', path);

    }

    function GoogleReDraw3() {
        var bounds = map.getBounds(),
        ne = bounds.getNorthEast(),
        sw = bounds.getSouthWest(),
        projection = d3.geo.mercator()
            .rotate([-bounds.getCenter().lng(), 0])
            .translate([0, 0])
        //.center([0,0])
            .scale(1)
        path = d3.geo.path()
            .projection(projection);

        //path = d3.geo.path().projection(googleMapProjection);


        var p1 = projection([ne.lng(), ne.lat()]),
        p2 = projection([sw.lng(), sw.lat()]);

        svg.select('#countries').attr('transform',
         'translate(' + (-p2[0]) + ',' + (-p1[1]) + ') ');

        svg.selectAll('path').attr('d', path);

    }

    function GoogleMap2() {


        map = new google.maps.Map(d3.select("#map").node(), {
            zoom: 6,
            center: new google.maps.LatLng(53.2, 0),
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            minZoom: 2
            //styles:[{"stylers": [{"saturation": -75},{"lightness": 75}]}]	
        });


        d3.json("cg_boundaries1.json", function(data) {
            //var countries=topojson.feature(data,data.objects.features).features;

            overlay = new google.maps.OverlayView();
            overlay.onAdd = function() {
                // create an SVG over top of it. 

                projection = this.getProjection();
                svg = d3.select(overlay.getPanes().overlayMouseTarget)
            .append('div')
                .attr('id', 'd3map')
                .style('width', mwidth + 'px')
                .style('height', mheight + 'px')
            .append('svg')
                .attr('width', mwidth)
                .attr('height', mheight);

                svg.append('g')
            .attr('id', 'countries')
            .selectAll('path')
                .data(data.features)
                .enter().append('path')
                .attr('class', 'country')
                .style("fill", "yellow")
               .on("mouseover", function(d) {
                   d3.select(this).style("opacity", ".5");

               })
            .on("mouseout", function(d) {
                d3.select(this).style("opacity", "0.2");

            })
                .style("opacity", "0.2")
                ;



                overlay.draw = GoogleReDraw;
                //google.maps.event.addListener(map, 'bounds_changed', GoogleReDraw);
                //google.maps.event.addListener(map, 'center_changed', GoogleReDraw);
                google.maps.event.addListener(map, 'zoom_changed', GoogleReDraw2);
                //google.maps.event.addListener(map, 'mouseover', function() {map.setZoom(8);});

                // Draw each marker as a separate SVG element.
                // We could use a single SVG, but what size would it have?
            };
            overlay.setMap(map);



            // Bind our overlay to the map…

        });

    }

    function GoogleMap() {
        var map = new google.maps.Map(d3.select("#mapG").node(), {
            zoom: 6,
            center: new google.maps.LatLng(53.2, 0),
            mapTypeId: google.maps.MapTypeId.TERRAIN
            //styles:[{"stylers": [{"saturation": -75},{"lightness": 75}]}]	
        });
        //TERRAIN/ROADMAP



        d3.json("cg_boundaries1.json", function(data) {
            var adminDivisions;
            var overlay = new google.maps.OverlayView();
            overlay.setMap(map);
            // Add the container when the overlay is added to the map.
            overlay.onAdd = function() {
                var layer = d3.select(this.getPanes().overlayLayer).append("div")
        .attr("class", "stations");

                var svg = layer.append("svg")
					.attr("width", "600px")
					.attr("height", "600px").attr("class", "stations");
                adminDivisions = svg.append("g").attr("class", "stations");


                // Draw each marker as a separate SVG element.
                // We could use a single SVG, but what size would it have?
                overlay.draw = function() {
                    var projection = this.getProjection(),
          padding = 10;

                    var markerOverlay = this;

                    var overlayProjection = markerOverlay.getProjection();

                    // Turn the overlay projection into a d3 projection
                    var googleMapProjection = function(coordinates) {
                        var googleCoordinates = new google.maps.LatLng(coordinates[1], coordinates[0]);
                        var pixelCoordinates = overlayProjection.fromLatLngToDivPixel(googleCoordinates);
                        return [pixelCoordinates.x, pixelCoordinates.y];
                    }

                    path = d3.geo.path().projection(googleMapProjection);

                    adminDivisions.selectAll("path")
						.data(data.features)
						.attr("d", path) // update existing paths
					.enter().append("svg:path")
						.attr("d", path).attr("fill", "red");

                    /*
                    var marker = layer.selectAll("svg")
                    .data(d3.entries(data))
                    .each(transform) // update existing markers
                    .enter().append("svg:svg")
                    .each(transform)
                    .attr("class", "marker");

      // Add a circle.
                    marker.append("svg:circle")
                    .attr("r", 4.5)
                    .attr("cx", padding)
                    .attr("cy", padding);

      // Add a label.
                    marker.append("svg:text")
                    .attr("x", padding + 7)
                    .attr("y", padding)
                    .attr("dy", ".31em")
                    .text(function(d) { return d.key; });

      function transform(d) {
                    d = new google.maps.LatLng(d.value[1], d.value[0]);
                    d = projection.fromLatLngToDivPixel(d);
                    return d3.select(this)
                    .style("left", (d.x - padding) + "px")
                    .style("top", (d.y - padding) + "px");
                    }
                    */
                };
            };
            // Bind our overlay to the map…

        });

    }
    function zoomed() {
        main.attr("transform", "translate(" + d3.event.translate.join(",") + ")scale(" + d3.event.scale + ")");
        /*          
        if (d3.event.scale>8.0)
        {
        main.selectAll(layerSelector(1)).attr("display","none");
        }
        else
        {
        main.selectAll(layerSelector(1)).attr("display","block");
        } 
        */
    }

    _chart.doRender = function() {
        _chart.resetSvg();
        if (_googleLayer == true) { GoogleMap2(); }

        var zoom = d3.behavior.zoom().translate([0, 0])
      .scale(1)
      .scaleExtent([1, 8])
      .on("zoom", zoomed);

        main = _chart.svg().call(zoom).append("g");

        for (var layerIndex = 0; layerIndex < _geoJsons.length; ++layerIndex) {
            var states = main.append("g")
                .attr("class", "layer" + layerIndex);

            var regionG = states.selectAll("g." + geoJson(layerIndex).name)
                .data(geoJson(layerIndex).data)
                .enter()
                .append("g")
                .attr("class", geoJson(layerIndex).name);

            regionG
                .append("path")
                .attr("fill", "white")
                .attr("d", _geoPath);

            regionG.append("titleTip");

            plotData(layerIndex);

        }



        var projection2 = d3.geo.albers()
            .center([0, 55.4])
            .rotate([4.4, 0])
            .parallels([50, 60])
            .scale(6000)
            .translate([780 / 2, 738.34 / 2]);



        //main.call(zoom);

    };

    function plotData(layerIndex) {
        var maxValue = dc.utils.groupMax(_chart.group(), _chart.valueAccessor());
        var data = generateLayeredData();

        if (isDataLayer(layerIndex)) {
            var regionG = renderRegionG(layerIndex);

            renderPaths(regionG, layerIndex, data, maxValue);

            renderTitle(regionG, layerIndex, data);
        }
    }

    function generateLayeredData() {
        var data = {};
        var groupAll = _chart.group().all();
        for (var i = 0; i < groupAll.length; ++i) {
            data[_chart.keyAccessor()(groupAll[i])] = _chart.valueAccessor()(groupAll[i]);
        }
        return data;
    }

    function isDataLayer(layerIndex) {
        return geoJson(layerIndex).keyAccessor;
    }

    function renderRegionG(layerIndex) {
        var regionG = main
            .selectAll(layerSelector(layerIndex))
            .classed("selected", function(d) {
                return isSelected(layerIndex, d);
            })
            .classed("deselected", function(d) {
                return isDeselected(layerIndex, d);
            })
            .attr("class", function(d) {
                var layerNameClass = geoJson(layerIndex).name;
                var regionClass = dc.utils.nameToId(geoJson(layerIndex).keyAccessor(d));
                var baseClasses = layerNameClass + " " + regionClass;
                if (isSelected(layerIndex, d)) baseClasses += " selected";
                if (isDeselected(layerIndex, d)) baseClasses += " deselected";
                return baseClasses;
            })
            .attr("label", function(d) {
                var layerLabel = geoJson(layerIndex).label;


                var key = getKey(layerIndex, d);
                var value = d[key];
                if (layerLabel != undefined) {      //console.log(layerLabel());
                    //return layerLabel()(d);
                }
                //return 'X';
                return _chart.title()(d);
            });
        return regionG;
    }

    function layerSelector(layerIndex) {
        return "g.layer" + layerIndex + " g." + geoJson(layerIndex).name;
    }

    function isSelected(layerIndex, d) {
        return _chart.hasFilter() && _chart.hasFilter(getKey(layerIndex, d));
    }

    function isDeselected(layerIndex, d) {
        return _chart.hasFilter() && !_chart.hasFilter(getKey(layerIndex, d));
    }

    function getKey(layerIndex, d) {
        return geoJson(layerIndex).keyAccessor(d);
    }

    function geoJson(index) {
        return _geoJsons[index];
    }
    function RenderTipGraph(d, key) {

        var m = [10, 10, 10, 10]; // margins
        var w = 100 - m[1] - m[3]; // width
        var h = 100 - m[0] - m[2]; // height

        var vals = FindValues(key);
        // d.value.year1Population + "," + d.value.year2Population + "," + d.value.population

        var data = [];
        data.push(vals.value.year1Population);
        data.push(vals.value.year2Population);
        data.push(vals.value.population);
        // X scale will fit all values from data[] within pixels 0-w
        var x = d3.scale.linear().domain([0, data.length]).range([0, w]);
        // Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
        //var y = d3.scale.linear().domain([0, 10]).range([h, 0]);
        // automatically determining max range can work something like this
        var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

        // create a line function that can convert data[] into x and y points
        var line = d3.svg.line()
        // assign the X function to plot our line as we wish
			.x(function(d, i) {
			    // verbose logging to show what's actually being done

			    // return the X coordinate where we want to plot this datapoint
			    return x(i);
			})
			.y(function(d) {
			    // verbose logging to show what's actually being done

			    // return the Y coordinate where we want to plot this datapoint
			    return y(d);
			})

        var graph = _toolTipDiv.append("g").append("svg")
			     .attr("width", w)
			      .attr("height", h)
            .style("float", "left")
            .style("background-color", "white")
            .append("svg:g")

			      .attr("transform", "translate(10,10)");
        var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
        // Add the x-axis.
        /*graph.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .style("fill","none")
         
        .style("stroke","none")
        .call(xAxis);
      
        */
        // create left yAxis
        /*	var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
        // Add the y-axis to the left
      
			graph.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(-25,0)")
        .call(yAxisLeft);
        */
        // Add the line by appending an svg:path element with the data line we created above
        // do this AFTER the axes above so that the line is above the tick-lines
        graph.append("svg:path").attr("d", line(data)).style("fill", "none").style("stroke", "steelblue").style("stroke-width", "1");
        // create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
        //var data = [3, 6, 2, 7, 5, 2, 0, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7];

    }
    function renderPaths(regionG, layerIndex, data, maxValue) {

        var paths = regionG
            .select("path")
            .attr("fill", function(d) {
                var currentFill = d3.select(this).attr("fill");
                if (currentFill)
                    return currentFill;
                return "none";
            })
            .attr("stroke", "black")
            .attr("stroke-width", ".25")
            .attr("titleTip", function(p) {

                var key = getKey(layerIndex, p);
                var value = data[key];
                if (layerIndex == _dataLayer) {
                    var vals = FindValues(key);

                    return _chart.dataTitle()(vals);

                }
                //return _dataTitle()(FindValues(key));

                return _chart.title()({ key: key, value: value });
            })
            .on("click", function(d) {
                return _chart.onClick(d, layerIndex);
            })
             .on("mouseover", function(d) {
                 d3.select(this).style("opacity", ".5");
                 dc.ShowToolTip(d3.select(this).attr("titleTip"));
                 var key = getKey(layerIndex, d);
                 //var value = data[key];
                 if (_showTipGraph == true) {
                     RenderTipGraph(d, key);
                 }


             })
            .on("mouseout", function(d) {
                d3.select(this).style("opacity", "1");
                dc.HideToolTip();
            })
            .on("mousemove", function(d) {
                var dot = d3.select(this);
                dc.MoveToolTip();
                //dc.ShowToolTip(dot.attr("titleTip"), "");



            });


        dc.transition(paths, _chart.transitionDuration()).attr("fill", function(d, i) {
            if (layerIndex == _dataLayer) {
                return FindColor(d.properties.Name);
            }
            else {
                if (geoJson(layerIndex).fill != undefined) {

                    return geoJson(layerIndex).fill;
                }
                else {
                    return _chart.getColor(data[geoJson(layerIndex).keyAccessor(d)], i);
                }
            }
        });
    }

    function FindValues(key) {
        var groupAll = _chart.group().all();
        for (var i = 0; i < groupAll.length; ++i) {

            if (_chart.keyAccessor()(groupAll[i]) == key) {
                var val = groupAll[i];
                //var val=_chart.valueAccessor()(groupAll[i]);

                return val;
            }
        }

    }

    function FindColor(key) {

        var groupAll = _chart.group().all();
        for (var i = 0; i < groupAll.length; ++i) {

            if (_chart.keyAccessor()(groupAll[i]) == key) {
                //console.log(key,_chart.keyAccessor()(groupAll[i]));
                //console.log(_chart.valueAccessor()(groupAll[i]));


                for (var x = 0; x < _colorMapping.length; x++) {

                    if (_colorMapping[x] == _chart.valueAccessor()(groupAll[i])) {

                        return _dataColors[x];
                    }

                }
                // return "purple";
                /* switch (_chart.valueAccessor()(groupAll[i]))
                {
                case 0:
                return "#acabab";
                break;
                case 1:
                return "#95c11f";
                break;
        
        }
                */
                //return "purple";
                // console.log( _chart.valueAccessor()(groupAll[i]));
            }

        }

        //return "#acabab";
    }

    _chart.onClick = function(d, layerIndex) {
        if (_chart.clickEffect() != 'N') {
            var selectedRegion = geoJson(layerIndex).keyAccessor(d);
            dc.events.trigger(function() {
                _chart.filter(selectedRegion);
                dc.redrawAll(_chart.chartGroup());

            });
        }
    };

    function renderTitle(regionG, layerIndex, data) {
        if (_chart.renderTitle()) {
            regionG.selectAll("titleTip").text(function(d) {
                var key = getKey(layerIndex, d);
                var value = data[key];
                return _chart.title()({ key: key, value: value });
            });

            //   regionG.append("text").text(function(d) {
            //  var key = getKey(layerIndex, d);
            //var value = data[key];
            //return _chart.title()({ key: key, value: value });
            //}).style("top",function(d) {console.log(this.getBBox());return this.getBBox().x;});

        }
    }

    _chart.doRedraw = function() {
        for (var layerIndex = 0; layerIndex < _geoJsons.length; ++layerIndex) {
            plotData(layerIndex);
        }
    };

    _chart.overlayGeoJson = function(json, name, keyAccessor, label, fill) {
        for (var i = 0; i < _geoJsons.length; ++i) {
            if (_geoJsons[i].name == name) {
                _geoJsons[i].data = json;
                _geoJsons[i].keyAccessor = keyAccessor;
                _geoJsons[i].label = label;
                _geoJsons[i].fill = fill;

                return _chart
            }
        }

        _geoJsons.push({ name: name, data: json, keyAccessor: keyAccessor, label: label, fill: fill });
        return _chart;
    };

    _chart.projection = function(projection) {
        _geoPath.projection(projection);
        return _chart;
    };

    _chart.geoJsons = function() {
        return _geoJsons;
    };

    _chart.removeGeoJson = function(name) {
        var geoJsons = [];

        for (var i = 0; i < _geoJsons.length; ++i) {
            var layer = _geoJsons[i];
            if (layer.name != name) {
                geoJsons.push(layer);
            }
        }

        _geoJsons = geoJsons;

        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};
dc.bubbleOverlay = function(root, chartGroup) {
    var BUBBLE_OVERLAY_CLASS = "bubble-overlay";
    var BUBBLE_NODE_CLASS = "node";
    var BUBBLE_CLASS = "bubble";

    var _chart = dc.abstractBubbleChart(dc.baseChart({}));
    var _g;
    var _points = [];

    _chart.transitionDuration(750);

    _chart.radiusValueAccessor(function(d) {
        return d.value;
    });

    _chart.point = function(name, x, y) {
        _points.push({ name: name, x: x, y: y });
        return _chart;
    };

    _chart.doRender = function() {
        _g = initOverlayG();

        _chart.r().range([_chart.MIN_RADIUS, _chart.width() * _chart.maxBubbleRelativeSize()]);

        initializeBubbles();

        _chart.fadeDeselectedArea();

        return _chart;
    };

    function initOverlayG() {
        _g = _chart.select("g." + BUBBLE_OVERLAY_CLASS);
        if (_g.empty())
            _g = _chart.svg().append("g").attr("class", BUBBLE_OVERLAY_CLASS);
        return _g;
    }

    function initializeBubbles() {
        var data = mapData();

        _points.forEach(function(point) {
            var nodeG = getNodeG(point, data);

            var circle = nodeG.select("circle." + BUBBLE_CLASS);

            if (circle.empty())
                circle = nodeG.append("circle")
                    .attr("class", BUBBLE_CLASS)
                    .attr("r", 0)
                    .attr("fill", _chart.initBubbleColor)
                    .on("click", _chart.onClick);

            dc.transition(circle, _chart.transitionDuration())
                .attr("r", function(d) {
                    return _chart.bubbleR(d);
                });

            _chart.doRenderLabel(nodeG);

            _chart.doRenderTitles(nodeG);
        });
    }

    function mapData() {
        var data = {};
        _chart.group().all().forEach(function(datum) {
            data[_chart.keyAccessor()(datum)] = datum;
        });
        return data;
    }

    function getNodeG(point, data) {
        var bubbleNodeClass = BUBBLE_NODE_CLASS + " " + dc.utils.nameToId(point.name);

        var nodeG = _g.select("g." + dc.utils.nameToId(point.name));

        if (nodeG.empty()) {
            nodeG = _g.append("g")
                .attr("class", bubbleNodeClass)
                .attr("transform", "translate(" + point.x + "," + point.y + ")");
        }

        nodeG.datum(data[point.name]);

        return nodeG;
    }

    _chart.doRedraw = function() {
        updateBubbles();

        _chart.fadeDeselectedArea();

        return _chart;
    };

    function updateBubbles() {
        var data = mapData();

        _points.forEach(function(point) {
            var nodeG = getNodeG(point, data);

            var circle = nodeG.select("circle." + BUBBLE_CLASS);

            dc.transition(circle, _chart.transitionDuration())
                .attr("r", function(d) {
                    return _chart.bubbleR(d);
                })
                .attr("fill", _chart.updateBubbleColor);

            _chart.doUpdateLabels(nodeG);

            _chart.doUpdateTitles(nodeG);
        });
    }

    _chart.debug = function(flag) {
        if (flag) {
            var debugG = _chart.select("g." + dc.constants.DEBUG_GROUP_CLASS);

            if (debugG.empty())
                debugG = _chart.svg()
                    .append("g")
                    .attr("class", dc.constants.DEBUG_GROUP_CLASS);

            var debugText = debugG.append("text")
                .attr("x", 10)
                .attr("y", 20);

            debugG
                .append("rect")
                .attr("width", _chart.width())
                .attr("height", _chart.height())
                .on("mousemove", function() {
                    var position = d3.mouse(debugG.node());
                    var msg = position[0] + ", " + position[1];
                    debugText.text(msg);
                });
        } else {
            _chart.selectAll(".debug").remove();
        }

        return _chart;
    };

    _chart.anchor(root, chartGroup);

    return _chart;
};

dc.rowChart = function(parent, chartGroup) {

    var _g;

    var _labelOffsetX = 10;

    var _labelOffsetY = 15;

    var _gap = 5;

    var _rowCssClass = "row";

    var _chart = dc.marginable(dc.colorChart(dc.baseChart({})));

    var _xScale;

    var _elasticX;

    var _xAxis = d3.svg.axis().orient("bottom");
    var _yAxis = d3.svg.axis().orient("left");

    var _labelOnAxis = 0;

    function calculateAxisScale() {
        if (!_xScale || _elasticX) {
            _xScale = d3.scale.linear().domain([0, d3.max(_chart.group().all(), _chart.valueAccessor())])
                .range([0, _chart.effectiveWidth()]);

            _xAxis.scale(_xScale);
        }
    }


    function drawYAxis() {
        var p = rowHeight() / 2 + _gap;
        var p2 = _chart.effectiveHeight() - p;

        // var y=d3.scale.ordinal().domain(["Episode","OP"]).range([ p ,p2]);
        //_chart.group().all()
        //alert(_chart.group().all().length);


        //console.log( _chart.group().all());

        //var y=d3.scale.ordinal().domain([_chart.group().all()]).range([ p ,p2]);
        //var y=d3.scale.ordinal().domain(d3.range(_chart.group().all())).range([ p ,p2]);
        // alert(_chart.group().all().length);
        var y = d3.scale.ordinal().domain(d3.range(_chart.group().all().length)).rangeBands([0, _chart.effectiveHeight()]);


        //var y=d3.scale.ordinal().domain([0,_chart.group().all().length]).range([ p ,p2]);

        _yAxis = d3.svg.axis().scale(y).orient("left");
        _yAxis.tickFormat(function(d, i) {
            //console.log(    _chart.group().all()[i].key);

            return _chart.group().all()[i].key;
        });

        var axisG = _g.select("g.yaxis");
        if (axisG.empty())
            axisG = _g.append("g").attr("class", "axis");
        //.attr("transform", "translate(" + _chart.effectiveHeight() + ",0))");

        dc.transition(axisG, _chart.transitionDuration())
            .call(_yAxis);

    }
    function drawAxis() {
        var axisG = _g.select("g.axis");

        calculateAxisScale();

        if (axisG.empty())
            axisG = _g.append("g").attr("class", "axis")
                .attr("transform", "translate(0, " + _chart.effectiveHeight() + ")");

        dc.transition(axisG, _chart.transitionDuration())
            .call(_xAxis);
    }

    _chart.doRender = function() {
        _chart.resetSvg();

        _g = _chart.svg()
            .append("g")
            .attr("transform", "translate(" + _chart.margins().left + "," + _chart.margins().top + ")");

        drawAxis();
        if (_labelOnAxis == 1) {
            drawYAxis();
        }
        drawGridLines();
        drawChart();

        return _chart;
    };

    _chart.labelOnAxis = function(r) {
        if (!arguments.length) return _labelOnAxis;
        _labelOnAxis = r;
        return _chart;
    };


    _chart.title(function(d) {
        return _chart.keyAccessor()(d) + ": " + _chart.valueAccessor()(d);
    });

    _chart.label(function(d) {
        return _chart.keyAccessor()(d);
    });

    function drawGridLines() {
        _g.selectAll("g.tick")
            .select("line.grid-line")
            .remove();

        _g.selectAll("g.tick")
            .append("line")
            .attr("class", "grid-line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", function(d) {
                return -_chart.effectiveHeight();
            });
    }

    function drawChart() {
        drawAxis();
        drawGridLines();

        var rows = _g.selectAll("g." + _rowCssClass)
            .data(_chart.group().all());

        createElements(rows);
        removeElements(rows);
        updateElements(rows);
    }

    function createElements(rows) {
        var rowEnter = rows.enter()
            .append("g")
            .attr("class", function(d, i) {
                return _rowCssClass + " _" + i;
            })
            .attr("titleTip", _chart.title());

        if (_chart.renderTitle()) {

            rowEnter.on("mouseover", function(d) {
                var dot = d3.select(this);
                dc.ShowToolTip(dot.attr("titleTip"));
            })
            rowEnter.on("mouseout", function(d) {
                dc.HideToolTip();
            });
        }




        rowEnter.append("rect").attr("width", 0);

        if (_labelOnAxis == 0) {
            createLabels(rowEnter);
            updateLabels(rows);
        }
    }

    function removeElements(rows) {
        rows.exit().remove();
    }

    function updateElements(rows) {
        var height = rowHeight();

        rows = rows.attr("transform", function(d, i) {
            return "translate(0," + ((i + 1) * _gap + i * height) + ")";
        }).select("rect")
            .attr("height", height)
            .attr("fill", _chart.getColor)
            .on("click", onClick)
            .classed("deselected", function(d) {
                return (_chart.hasFilter()) ? !_chart.isSelectedRow(d) : false;
            })
            .classed("selected", function(d) {
                return (_chart.hasFilter()) ? _chart.isSelectedRow(d) : false;
            });

        dc.transition(rows, _chart.transitionDuration())
            .attr("width", function(d) {
                return _xScale(_chart.valueAccessor()(d));
            });

        //createTitles(rows);
    }

    function createTitles(rows) {
        if (_chart.renderTitle()) {
            rows.selectAll("title").remove();
            rows.append("title").text(function(d) {
                return _chart.title()(d);
            });
        }
    }

    function createLabels(rowEnter) {
        if (_chart.renderLabel()) {
            rowEnter.append("text")
                .on("click", onClick);
        }
    }

    function updateLabels(rows) {
        if (_chart.renderLabel()) {
            rows.select("text")
                .attr("x", _labelOffsetX)
                .attr("y", _labelOffsetY)
                .attr("class", function(d, i) {
                    return _rowCssClass + " _" + i;
                })
                .text(function(d) {
                    return _chart.label()(d);
                });
        }
    }

    function numberOfRows() {
        return _chart.group().all().length;
    }

    function rowHeight() {
        var n = numberOfRows();
        return (_chart.effectiveHeight() - (n + 1) * _gap) / n;
    }

    function onClick(d) {
        _chart.onClick(d);
    }

    _chart.doRedraw = function() {
        drawChart();
        return _chart;
    };

    _chart.xAxis = function() {
        return _xAxis;
    };

    _chart.gap = function(g) {
        if (!arguments.length) return _gap;
        _gap = g;
        return _chart;
    };

    _chart.elasticX = function(_) {
        if (!arguments.length) return _elasticX;
        _elasticX = _;
        return _chart;
    };

    _chart.labelOffsetX = function(o) {
        if (!arguments.length) return _labelOffsetX;
        _labelOffset = o;
        return _chart;
    };

    _chart.labelOffsetY = function(o) {
        if (!arguments.length) return _labelOffsetY;
        _labelOffset = o;
        return _chart;
    };

    _chart.isSelectedRow = function(d) {
        return _chart.hasFilter(_chart.keyAccessor()(d));
    };

    return _chart.anchor(parent, chartGroup);
};


dc.filterSlider = function(parent, chartGroup) {
    var _chart = dc.baseChart({});

    _chart.__dc_custom__ == true;
    _chart.Hide = function() {
        _chart.root().transition().each('end', function(d) { _chart.root().style("display", "none") }).duration(500).style("opacity", 0);

    }
    _chart.Show = function() {
        _chart.root().style("display", "inline");

        _chart.root().transition().duration(500).style("opacity", 1);
    }



    return _chart.anchor(parent, chartGroup);
}

dc.MonthRange = function(start, end) {
    var i = 0;
    var dates = [];
    var cur = start;
    var newDate = [];
    var stop = 0;

    do {


        if (cur == end) {
            stop = 1;
        }

        newDate = [];
        newDate.Pos = i;
        newDate.Date = cur;
        dates.push(newDate);
        i++;
        cur++;

        if (String(cur).substr(4, 2) == "13") {
            cur = (String(cur)).substr(0, 4);
            cur = Number(cur) + 1;
            cur = cur + "01";
            cur = String(cur);
        }



    }
    while (stop == 0)


    return dates;

}

dc.MonthRangeLocator = function(dates, date) {
    var pos = -1;
    dates.forEach(function(d) {
        if (d.Date == date) {
            pos = d.Pos;
            return;
        }
    });
    return pos;
}



dc.jQuerySlider2 = function(div, startdate, enddate, dimension, focuschart, label) {
    var dates = [];
    var container = div;


    var _chart = dc.baseChart({});

    _chart.__dc_custom__ == true;

    var _label = label;

    var _niceFormat = d3.time.format("%b %y");


    dc.override(_chart, "filterAll", function(_) {

        _chart.All();
    });



    _chart.TimeFormat = function(t) {

        _niceFormat = d3.time.format(t);
        return _chart;
    }

    _chart.All = function() {
        spos = 0;
        epos = dates.length - 1;
        $(div).val([spos, epos]);

        SliderFilter(spos, epos);
    }

    _chart.FinYear = function(y) {

        var spos = dc.MonthRangeLocator(dates, y + "04");
        var epos = dc.MonthRangeLocator(dates, (Number(y) + 1) + "03");
        if (spos == -1) spos = 0;
        if (epos == -1) epos = dates.length - 1;

        $(div).val([spos, epos]);

        SliderFilter(spos, epos);

    }

    _chart.LastxMonths = function(x) {

        var epos = dates.length - 1;
        var spos = epos - (x - 1);
        if (spos < 0) spos = 0;

        $(div).val([spos, epos]);

        SliderFilter(spos, epos);

    }

    _chart.PresetSlider = function PresetSlider(start, end) {

        var spos = dc.MonthRangeLocator(dates, start);
        var epos = dc.MonthRangeLocator(dates, end);
        if (spos == -1) spos = 0;
        if (epos == -1) epos = dates.length - 1;

        $(div).val([spos, epos]);

        SliderFilter(spos, epos);
    }


    function UpdateLabel(dfr, dto) {
        if (_label != undefined) {
            //Assume label control has a span tag called sliderselection
            var l = d3.select(_label);
            l = l.selectAll("#sliderselection");
            d3.select(l[0][0]).text(_niceFormat(dfr) + " - " + _niceFormat(dto));

        }
    }


    function UpdateLabelFromSlider() {
        var dfr = dates[0].Date;

        var dateFormatISO = d3.time.format("%Y%m%d");

        dfr = dateFormatISO.parse(dfr + "01");

        var dto = dates[dates.length - 1].Date;
        dto = dateFormatISO.parse(dto + "01");
        var d = new Date();
        d.setMonth(dto.getMonth() + 1, 0);
        dto = d;

        UpdateLabel(dfr, dto);

    }

    function SliderFilter(x, y) {


        var dfr = dates[x].Date;

        var dateFormatISO = d3.time.format("%Y%m%d");

        dfr = dateFormatISO.parse(dfr + "01");

        var dto = dates[y].Date;
        dto = dateFormatISO.parse(dto + "01");
        var d = new Date();
        d.setMonth(dto.getMonth() + 1, 0);
        dto = d;

        if (focuschart != undefined) focuschart.focus([dfr, dto]);
        if (dimension != undefined) dimension.filterRange([dfr, dto]);

        dc.redrawAll();

        UpdateLabel(dfr, dto);


    }




    $(function() {
        var isoFormat = d3.time.format("%Y%m");
        dates = dc.MonthRange(isoFormat(startdate), isoFormat(enddate));


        $(div).noUiSlider({
            range: [0, dates.length - 1]
   , start: [0, dates.length - 1]
   , step: 1
   , slide: function() {
       var values = $(this).val();
       SliderFilter(values[0], values[1]);

   }
        });
        UpdateLabelFromSlider();
    });




    return _chart.anchor(container, "");
}

dc.jQuerySlider = function(div, startdate, enddate, dimension, focuschart, label) {
    var dates = [];
    var container = div;
    var _chart = dc.baseChart({});
    var _label = label;

    var _niceFormat = d3.time.format("%b %y");


    _chart.TimeFormat = function(t) {

        _niceFormat = d3.time.format(t);
        return _chart;
    }

    _chart.All = function() {
        spos = 0;
        epos = dates.length - 1;

        $(container).slider("values", 0, spos);
        $(container).slider("values", 1, epos);

        SliderFilter(spos, epos);
    }

    _chart.FinYear = function(y) {

        var spos = dc.MonthRangeLocator(dates, y + "04");
        var epos = dc.MonthRangeLocator(dates, (Number(y) + 1) + "03");
        if (spos == -1) spos = 0;
        if (epos == -1) epos = dates.length - 1;

        $(container).slider("values", 0, spos);
        $(container).slider("values", 1, epos);

        SliderFilter(spos, epos);

    }

    _chart.LastxMonths = function(x) {

        var epos = dates.length - 1;
        var spos = epos - (x - 1);
        if (spos < 0) spos = 0;

        $(container).slider("values", 0, spos);
        $(container).slider("values", 1, epos);

        SliderFilter(spos, epos);

    }

    _chart.PresetSlider = function PresetSlider(start, end) {

        var spos = dc.MonthRangeLocator(dates, start);
        var epos = dc.MonthRangeLocator(dates, end);
        if (spos == -1) spos = 0;
        if (epos == -1) epos = dates.length - 1;

        $(container).slider("values", 0, spos);
        $(container).slider("values", 1, epos);

        SliderFilter(spos, epos);
    }


    function UpdateLabel(dfr, dto) {
        if (_label != undefined) {
            //Assume label control has a span tag called sliderselection
            var l = d3.select(_label);
            l = l.selectAll("#sliderselection");
            d3.select(l[0][0]).text(_niceFormat(dfr) + " - " + _niceFormat(dto));

        }
    }


    function UpdateLabelFromSlider() {
        var dfr = dates[0].Date;

        var dateFormatISO = d3.time.format("%Y%m%d");

        dfr = dateFormatISO.parse(dfr + "01");

        var dto = dates[dates.length - 1].Date;
        dto = dateFormatISO.parse(dto + "01");
        var d = new Date();
        d.setMonth(dto.getMonth() + 1, 0);
        dto = d;

        UpdateLabel(dfr, dto);

    }

    function SliderFilter(x, y) {


        var dfr = dates[x].Date;

        var dateFormatISO = d3.time.format("%Y%m%d");

        dfr = dateFormatISO.parse(dfr + "01");

        var dto = dates[y].Date;
        dto = dateFormatISO.parse(dto + "01");
        var d = new Date();
        d.setMonth(dto.getMonth() + 1, 0);
        dto = d;

        if (focuschart != undefined) focuschart.focus([dfr, dto]);
        if (dimension != undefined) dimension.filterRange([dfr, dto]);

        dc.redrawAll();

        UpdateLabel(dfr, dto);


    }



    $(function() {
        var isoFormat = d3.time.format("%Y%m");
        dates = dc.MonthRange(isoFormat(startdate), isoFormat(enddate));

        $(container).slider({
            range: true,
            min: 0,
            max: dates.length - 1,

            values: [0, dates.length - 1],
            slide: function(event, ui) {
                SliderFilter(ui.values[0], ui.values[1]);
            }
        });
        UpdateLabelFromSlider();
    });




    return _chart.anchor(container, "slider");
}
dc.TotalsLabel = function(valueGroup, labelctl, valuesList) {
    var _chart = dc.baseChart({});
    var _values = valuesList;
    var _labelctl = labelctl;
    var _group = valueGroup;

    _chart.doRender = function() {

        for (var i = 0; i < valuesList.length; ++i) {

            var value = _group.all()[0].value[_values[i].Value];
            var tag = _values[i].Tag;

            var l = d3.select(_labelctl);
            l = l.selectAll(tag);

            if (_values[i].Format != undefined) {

                var fmt = d3.format(_values[i].Format);
                value = fmt(value);
            }

            //l.textContent=value;
            d3.select(l[0][0]).text(value);

        }


    }

    _chart.doRedraw = function() {
        _chart.doRender();
    }

    return _chart.anchor(labelctl, "");
}


dc.heatMap = function(parent, chartGroup) {
    var _chart = dc.baseChart({});
    //var _chart = dc.stackableChart(dc.coordinateGridChart({}));    

    _chart.__dc_custom__ == true;

    var _TileSizeW = 20;
    var _TileSizeH = 20;
    var _TilePadding = 2;

    var _YPadding = 200;
    var _XPadding = 60;
    var _dataArray;
    var _xField;
    var _yField;
    var _vField;
    var _maxValue = 0;
    var _colorScale;
    var _colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"];

    var _cornerRounding = 4;

    _chart.FieldList = function(x, y, v) {
        _xField = x;
        _yField = y;
        _vField = v;
        return _chart;
    };





    _chart.dataArray = function(_) {
        if (!arguments.length) return _dataArray;
        _dataArray = _;
        return _chart;
    };


    _chart.colors = function(_) {
        if (!arguments.length) return _colors;
        _colors = _;
        return _chart;
    };


    _chart.tileHeight = function(_) {
        if (!arguments.length) return _TileSizeH;
        _TileSizeH = _;
        return _chart;
    };


    _chart.tileWidth = function(_) {
        if (!arguments.length) return _TileSizeW;
        _TileSizeW = _;
        return _chart;
    };


    _chart.tilePadding = function(_) {
        if (!arguments.length) return _TilePadding;
        _TilePadding = _;
        return _chart;
    };


    _chart.xPadding = function(_) {
        if (!arguments.length) return _XPadding;
        _XPadding = _;
        return _chart;
    };


    _chart.yPadding = function(_) {
        if (!arguments.length) return _YPadding;
        _YPadding = _;
        return _chart;
    };

    _chart.cornerRounding = function(_) {
        if (!arguments.length) return _cornerRounding;
        _cornerRounding = _;
        return _chart;
    };


    tfObjSort = {
        init: function() {
            Array.prototype.objSort = function() {
                tfObjSort.setThings(this);
                var a = arguments;
                var x = tfObjSort;
                x.a = []; x.d = [];
                for (var i = 0; i < a.length; i++) {
                    if (typeof a[i] == "string") { x.a.push(a[i]); x.d.push(1) };
                    if (a[i] === -1) { x.d[x.d.length - 1] = -1 }
                }
                return this.sort(tfObjSort.sorter);
            };
            Array.prototype.strSort = function() {
                tfObjSort.setThings(this);
                return this.sort(tfObjSort.charSorter)
            }
        },
        sorter: function(x, y) {
            var a = tfObjSort.a
            var d = tfObjSort.d
            var r = 0
            for (var i = 0; i < a.length; i++) {
                if (typeof x + typeof y != "objectobject") { return typeof x == "object" ? -1 : 1 };
                var m = x[a[i]]; var n = y[a[i]];
                var t = typeof m + typeof n;
                if (t == "booleanboolean") { m *= -1; n *= -1 }
                else if (t.split("string").join("").split("number").join("") != "") { continue };
                r = m - n;
                if (isNaN(r)) { r = tfObjSort.charSorter(m, n) };
                if (r != 0) { return r * d[i] }
            }
            return r
        },
        charSorter: function(x, y) {
            if (tfObjSort.ignoreCase) { x = x.toLowerCase(); y = y.toLowerCase() };
            var s = tfObjSort.chars;
            if (!s) { return x > y ? 1 : x < y ? -1 : 0 };
            x = x.split(""); y = y.split(""); l = x.length > y.length ? y.length : x.length;
            var p = 0;
            for (var i = 0; i < l; i++) {
                p = s.indexOf(x[i]) - s.indexOf(y[i]);
                if (p != 0) { break };
            };
            if (p == 0) { p = x.length - y.length };
            return p
        },
        setThings: function(x) {
            this.ignoreCase = x.sortIgnoreCase;
            var s = x.sortCharOrder;
            if (!s) { this.chars = false; return true };
            if (!s.sort) { s = s.split(",") };
            var a = "";
            for (var i = 1; i < 1024; i++) { a += String.fromCharCode(i) };
            for (var i = 0; i < s.length; i++) {
                z = s[i].split("");
                var m = z[0]; var n = z[1]; var o = "";
                if (z[2] == "_") { o = n + m } else { o = m + n };
                a = a.split(m).join("").split(n).join(o);
            };
            this.chars = a
        }
    };
    tfObjSort.init();

    function FindRow(arr, val) {
        for (var i = 0; i < arr.length; i++) {
            //alert(arr[i]);
            //if (arr[i].Name == Source) return arr[i].Line;
            if (arr[i].Name == val) return i + 1;
        }
    }


    var uniqueAll = function(origArr, xfield, yfield, vfield) {
        var newArrX = [],
    newArrY = [],
        origLen = origArr.length,
        foundX, foundY,
        x, y; i = 1;

        for (x = 0; x < origLen; x++) {
            foundX = undefined;

            if (origArr[x][vfield] > _maxValue) { _maxValue = origArr[x][vfield] };

            //XField
            for (y = 0; y < newArrX.length; y++) {
                if (origArr[x][xfield] === newArrX[y].Name) {
                    foundX = true;
                    break;
                }
            }

            if (!foundX) {

                var newOne = { Name: origArr[x][xfield] };

                newArrX.push(newOne);

            }
            foundY = undefined;
            //YField
            for (y = 0; y < newArrY.length; y++) {
                if (origArr[x][yfield] === newArrY[y].Name) {
                    foundY = true;
                    break;
                }
            }

            if (!foundY) {

                var newOne = { Name: origArr[x][yfield] };

                newArrY.push(newOne);
                //alert(newOne.Name);


            }


        }
        return [newArrX.objSort("Name"), newArrY.objSort("Name")];
    };

    var unique = function(origArr, field) {
        var newArr = [],
        origLen = origArr.length,
        found,
        x, y; i = 1;

        for (x = 0; x < origLen; x++) {
            found = undefined;

            if (origArr[x][_vField] > _maxValue) { _maxValue = origArr[x][_vField] };

            for (y = 0; y < newArr.length; y++) {
                if (origArr[x][field] === newArr[y].Name) {
                    found = true;
                    break;
                }
            }
            if (!found) {

                var newOne = { Name: origArr[x][field] };

                newArr.push(newOne);
                //alert(newOne.Name);
                i++;

            }
        }
        return newArr.objSort("Name");
    };


    _chart.doRender = function() {
        _chart.resetSvg();

        var arrs = uniqueAll(_chart.dataArray(), _xField, _yField, _vField);


        var x = arrs[0];

        var y = arrs[1];



        // _colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]
        var buckets = _colors.length;
        _colorScale = d3.scale.quantile()
              .domain([0, buckets - 1, _maxValue])
              .range(_colors);

        var g = _chart.svg();

        var chartG = g.selectAll("g.heatmap")
               .attr("transform", "translate(50,-0)")
            .data(_chart.dataArray()).enter().append("rect")
            .attr("x", function(d) { return (FindRow(x, d[_xField]) * _TileSizeW) + _YPadding })
            .attr("y", function(d) { return (FindRow(y, d[_yField]) * _TileSizeH) + _XPadding })
            .attr("rx", _cornerRounding).attr("ry", _cornerRounding)
            .attr("width", _TileSizeW - _TilePadding).attr("height", _TileSizeH - _TilePadding)
        //.style("stroke-width","2px")
            .style("fill", _colors[0])
            .attr("titleTip", function(d) { return _chart.title()(d); })
            .on("mouseover", function(d) {
                d3.select(this).style("opacity", ".5");
                dc.ShowToolTip(d3.select(this).attr("titleTip"));
            })
            .on("mouseout", function(d) {
                d3.select(this).style("opacity", "1");
                dc.HideToolTip();
            });

        chartG.transition().duration(1000)
              .style("fill", function(d) { return _colorScale(d[_vField]); });


        //Draw Labels
        //X Labels
        var xLab = _chart.svg().selectAll(".xLabel").data(x).enter().append("text").text(function(d) { return d.Name; })
            .style("text-anchor", "end")
           .style("font-family", "'Trebuchet MS', Arial, Helvetica, sans-serif")
            .style("font-size", "0.8em")
            .attr("x", function(d, i) { return (i + 1) * _TileSizeW + _TileSizeW / 2 + 3 + _YPadding; })
        //.attr("transform","translate(-6,-0)")
            .attr("y", _TileSizeH + _XPadding)
            .attr("dx", "-.5em")
            .attr("dy", ".6em")
            .attr("transform", function(d, i) { return "rotate(90 " + ((i + 1) * _TileSizeW + _TileSizeW / 2 + 3 + _YPadding) + "," + (_TileSizeH + _XPadding) + ")" });
        // return "rotate(90 " + (i+1) * _TileSizeH + _TileSizeH/2 + 3 + _XPadding + ")"} + "," + _TileSizeW + _YPadding + ")" );



        //Y Labels
        var yLab = _chart.svg().selectAll(".yLabel").data(y).enter().append("text").text(function(d) { return d.Name; })
            .style("text-anchor", "end")
            .style("font-family", "'Trebuchet MS', Arial, Helvetica, sans-serif")
            .style("font-size", "0.8em")
            .attr("y", function(d, i) { return (i + 1) * _TileSizeH + _TileSizeH / 2 + 3 + _XPadding; })
        //.attr("transform","translate(-6,-0)")
            .attr("x", _TileSizeW + _YPadding)
            .attr("dx", "-.5em");

        if (_chart.legendContainer() != undefined) {
            RenderLegend();
        }
        //Need unique list of x and y values



        //var chartG = _chart.svg().selectAll("g.heatmap")
        //.data(_chart.group().all());

        //AddData(chartG);  
        //_chart.svg().append("p").text("test");  
    }

    function RenderLegend() {
        var _legendBox = d3.select(_chart.legendContainer());
        _legendBox = _legendBox.append("svg").attr("width", 500).attr("height", 400);
        //console.log(_colorScale.quantiles());
        var legend = _legendBox.selectAll(".legend")
              .data([0].concat(_colorScale.quantiles()), function(d) { return d; })
              .enter().append("g")
              .attr("class", "legend");

        legend.append("rect")
            .attr("x", 0)
            .attr("y", function(d, i) { return 20 * i; })
            .attr("width", "40")
            .attr("height", "20")
            .style("fill", function(d, i) { return _colors[i]; });

        legend.append("text")
           .style("font-size", "8pt")
            .text(function(d) { return ">" + Math.round(d); })
            .attr("x", 50)
            .style("text-anchor", "start")
            .attr("y", function(d, i) { return (20 * i) + 15; });

    }




    return _chart.anchor(parent, chartGroup);
}
dc.spatialMap = function(parent, chartGroup) {

 var _chart = dc.colorChart(dc.baseChart({}));
var _topoData;
var _topoData2;
var _projection;
var _path;

  _chart.topoData = function(_) {
        if (!arguments.length) return _topoData;
        _topoData = _;
        return _chart;
    };

      _chart.topoData2 = function(_) {
        if (!arguments.length) return _topoData2;
        _topoData2 = _;
        return _chart;
    };

  _chart.projection = function(_) {
        if (!arguments.length) return _projection;
        _projection = _;
        return _chart;
    };

   _chart.path = function(_) {
        if (!arguments.length) return _path;
        _path = _;
        return _chart;
    };

     _chart.doRender = function() {
        _chart.resetSvg();
       PlotLayer(_topoData,"#ddc");
          PlotLayer(_topoData2,"green");               
    
        
        }
        
        function PlotLayer(d,f)
        {
            var g = _chart.svg().append("g");
          g.selectAll("path").data(d.features).enter().append("path").attr("fill",function (d) {return FindColor(d.properties.Name);}).attr("d", d3.geo.path()
            .projection(_projection));
           
        }
             function FindColor(key)
             {   
                  
              var groupAll = _chart.group().all();
        for (var i = 0; i < groupAll.length; ++i) {
       
        if (_chart.keyAccessor()(groupAll[i])==key)
        {
        
        switch (_chart.valueAccessor()(groupAll[i]))
        {
         case 0:
         return "#acabab";
         break;
         case 1:
         return "#95c11f";
         break;
        
        }
        // return _colors(_chart.valueAccessor()(groupAll[i]));
        // console.log( _chart.valueAccessor()(groupAll[i]));
        }
            
        }
             
              //return "#acabab";
             }

 return _chart.anchor(parent, chartGroup);
}
dc.sankey = function(parent, chartGroup) {

    var _chart = dc.stackableChart(dc.coordinateGridChart({}));

    _chart.__dc_custom__ == true;

    var _notesDisplay = null;
    var _showTips = true;
    var _valueElement = "value";
    var _sourceElement = "source";
    var _targetElement = "target";
    var _notesElement = "notes";
    var _yearElement = "year";
    var _colourData = [];
    var _innerWidth=0;


      _chart.innerWidth = function(i) {
        if (!arguments.length) return _innerWidth;
        _innerWidth = i;
        return _chart;
    }

        _chart.colourData = function(_) {
        if (!arguments.length) return _colourData;
        _colourData = _;
        return _chart;
    };

    _chart.notesDisplay = function(_) {
        if (!arguments.length) return _notesDisplay;
        _notesDisplay = _;
        return _chart;
    }


    _chart.valueElement = function(_) {
        if (!arguments.length) return _valueElement;
        _valueElement = _;
        return _chart;
    }
    
    _chart.yearElement = function(_) {
    if (!arguments.length) return _yearElement;
    _yearElement = _;
        return _chart;
    }
    _chart.notesElement = function(_) {
        if (!arguments.length) return _notesElement;
        _notesElement = _;
        return _chart;
    }

    _chart.showTips = function(_) {
        if (!arguments.length) return _showTips;
        _showTips = _;
        return _chart;
    }


    var _g;

    var xunique = function(origArr, field, tag) {
        var newArr = [],
        origLen = origArr.length,
        found,
        x, y; i = 1;

        for (x = 0; x < origLen; x++) {
            found = undefined;


            for (y = 0; y < newArr.length; y++) {
                if (origArr[x][field] === newArr[y].name) {
                    found = true;
                    break;
                }
            }
            if (!found) {

                var newOne = { name: origArr[x][field], Tag: tag };
                         
                newArr.push(newOne);
                
                i++;

            }
        }
        return newArr;
    };
    _chart.doRedraw = function() {
        _chart.doRender();
    }



    function RenderNotes(d) {

      
        if (_notesDisplay != undefined) {
                    
            var n=d3.select(_chart.notesDisplay()).selectAll("DIV").text(d.notes);
            
         
              
            //d3.select(_notesDisplay).selectAll("SPAN").remove();
            //d3.select(_notesDisplay).append("SPAN").text(d.notes);
        }
    }
    function ClearNotes() {
        if (_notesDisplay != undefined) {
            d3.select(_chart.notesDisplay()).selectAll("DIV").text("");
        }
    }
    
    function clickHandler(d)
    {
              //Click Action for Sankey Data Click
      switch (_chart.clickEffect()) {
            case 'C':
            {
              

                      
          if (_chart.clickAction() != undefined) {
                              
                        
          var newParams;
          
          if (_chart.parameterKey()!=undefined)
          {
          newParams=_chart.GetCurrentParameters(d.key);
          }
          else
          {
         newParams=_chart.GetCurrentParameters(d[_targetElement].name);
          }
             if (_chart.popupDrill())
              {
                    _chart.SlideInDrill('ViewPage.aspx?PageID=' +_chart.clickAction() + '&Parameters=' + newParams + '');
              
            }
            else
            {
             
               window.open('ViewPage.aspx?PageID=' +_chart.clickAction() + '&Parameters=' + newParams + '', '_self');
               }
           
           
           //_chart.onClick(d);
          //window.open('ViewPage.aspx?PageID=' +_chart.clickAction() + '&Parameters='+ newParams + '', '_self');
          
              //alert(newParams);
              // svg.append("image").attr("y",0).attr("x",width-20).attr("xlink:href",_blockTitleImage).attr("width",_blockTitleImageWidth).attr("height",_blockTitleImageHeight).on("click",function() {window.open("ViewPage.aspx?PageID=" +_chart.clickAction() +"&Parameters='" + newParams + "'","_self");});
          
            }
            
            }
        }    
    }
    
    function GetColour(i)
    {
             
              if (_colourData.length>0)
              {
              return _colourData[i % _colourData.length];
            
              }
              else
              {
            
   return d3.scale.category20().range()[i % 20];
              }
    
    }
    
    _chart.doRender = function() {

       _chart.resetSvg();
        var units = "";
        var margin = { top: _chart.margins().top, right: _chart.margins().right, bottom: _chart.margins().bottom, left: _chart.margins().left },
          width = _chart.width() - margin.left - margin.right,
    height = _chart.height() - margin.top - margin.bottom;
                 
     
        _g = _chart.svg()
            .append("g")
            .attr("transform", "translate(" + _chart.margins().left + "," + _chart.margins().top + ")");
                            
                            
        var sk = sankey2().nodeWidth(10).nodePadding(40).size([width-(width * _innerWidth), height - 50]);
        var path = sk.link();




        var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d) { return formatNumber(d) + " " + units; },
    color = d3.scale.category20();


        var NodeData = [];
        //var group=_chart.dimension().top(9999);
        //NodeData = group;

        var LinkData = [];
        LinkData = _chart.dimension().top(9999);

    
        
         //Remove any nodes with zero as the Value from LinkData        
        for (var i = LinkData.length-1; i >=0; i--) {    
              
              if (LinkData[i][_valueElement]<=0)
              {
                            LinkData.splice(i,1);
                            
              }   
                }
        
        
        //Extrapulate Nodes from Links

        var ut = xunique(LinkData, "target", "child");
        var us = xunique(LinkData, "source", "parent");
        NodeData = ut.concat(us);
            
        var nodeMap = {};
      
        NodeData.forEach(function(x) {
            
         nodeMap[x.name] = x;
         
          });
        LinkData = LinkData.map(function(x) {
       
            return {
                source: nodeMap[x.source],
                target: nodeMap[x.target],
                value: x[_valueElement],
                notes: x[_notesElement],
                year: x[_yearElement],
                key:x[_chart.parameterKey()]
            };
        });                              

      
                 


        sk.nodes(NodeData)
      .links(LinkData)
      .layout(32);

        var link = _g.append("g").selectAll(".link")
      .data(LinkData)
    .enter()
       .append("path")

      .attr("class", "link")
      .attr("d", path)
      .on("click", function(d) {clickHandler(d)})
      .on("mouseover", function(d) {
          RenderNotes(d);

      })
      .on("mouseout", function(d) {
          ClearNotes();
      })
      .sort(function(a, b) { return b.dy - a.dy; });
        link
      .transition()
      .duration(500)
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })

      ;

        if (_showTips == true) {
            // add the link titles
            link.append("title")
        .text(function(d) {
            return d.source.name + " -> " +
                d.target.name + "\n" + format(d.value) + d.notes;
        });
        }
        var node = _g.append("g").selectAll(".node")
      .data(NodeData);
        node.enter().append("g")
      .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
    .call(d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", function() {
          this.parentNode.appendChild(this);
      })
      .on("drag", dragmove));

        // add the rectangles for the nodes
        node.append("rect")
        .transition()
       .duration(500)
      .attr("height", function(d) { return d.dy; })
      .attr("width", sk.nodeWidth())

      .style("fill", function(d,i) { 
      return GetColour(i);
        
      //return d.color = color(d.name.replace(/ .*/, ""));
      })
      .style("stroke", function(d) {
          return d3.rgb(d.color).darker(2);
      });

        //Delete Nodes
        node.exit().remove();

        if (_showTips == true) {
            node.append("title")
      .text(function(d) {
          return d.name + "\n" + format(d.value);
      });
        }
        // add in the title for the nodes
        node.append("text")
      .attr("x", 15 + sk.nodeWidth()) //no.of pixels plus the width of the node
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .attr("transform", null)
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.Tag == "parent"; }) //where it is the parent node then do the follow attrs
      .attr("x", -15) // minus 15 (the modewidth is not required) 
      .attr("text-anchor", "end"); // this would be end

        function dragmove(d) {
            d3.select(this).attr("transform",
        "translate(" + d.x + "," + (
                d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
            ) + ")");
            sk.relayout();
            link.attr("d", path);
        }

        //End Render Function        
    }



    sankey2 = function() {
        var sankey = {},
      nodeWidth = 24,
      nodePadding = 8,
      size = [1, 1],
      nodes = [],
      links = [];


        var width = 500;



        sankey.nodeWidth = function(_) {
            if (!arguments.length) return nodeWidth;
            nodeWidth = +_;
            return sankey;
        };

        sankey.nodePadding = function(_) {
            if (!arguments.length) return nodePadding;
            nodePadding = +_;
            return sankey;
        };

        sankey.nodes = function(_) {
            if (!arguments.length) return nodes;
            nodes = _;
            return sankey;
        };

        sankey.links = function(_) {
            if (!arguments.length) return links;
            links = _;
            return sankey;
        };

        sankey.size = function(_) {
            if (!arguments.length) return size;
            size = _;
            width=size[0];
            return sankey;
        };

        sankey.layout = function(iterations) {
            computeNodeLinks();
            computeNodeValues();
            computeNodeBreadths();
            computeNodeDepths(iterations);
            computeLinkDepths();
            return sankey;
        };

        sankey.relayout = function() {
            computeLinkDepths();
            return sankey;
        };

        sankey.link = function() {
            var curvature = .5;

            function link(d) {
                var x0 = d.source.x + d.source.dx,
          x1 = d.target.x,
          xi = d3.interpolateNumber(x0, x1),
          x2 = xi(curvature),
          x3 = xi(1 - curvature),
          y0 = d.source.y + d.sy + d.dy / 2,
          y1 = d.target.y + d.ty + d.dy / 2;
                return "M" + x0 + "," + y0
           + "C" + x2 + "," + y0
           + " " + x3 + "," + y1
           + " " + x1 + "," + y1;
            }

            link.curvature = function(_) {
                if (!arguments.length) return curvature;
                curvature = +_;
                return link;
            };

            return link;
        };

        // Populate the sourceLinks and targetLinks for each node.
        // Also, if the source and target are not objects, assume they are indices.
        function computeNodeLinks() {
            nodes.forEach(function(node) {
                node.sourceLinks = [];
                node.targetLinks = [];
            });
            links.forEach(function(link) {
                var source = link.source,
          target = link.target;
                if (typeof source === "number") source = link.source = nodes[link.source];
                if (typeof target === "number") target = link.target = nodes[link.target];
                source.sourceLinks.push(link);
                target.targetLinks.push(link);
            });
        }

        // Compute the value (size) of each node by summing the associated links.
        function computeNodeValues() {
            nodes.forEach(function(node) {
                node.value = Math.max(
        d3.sum(node.sourceLinks, value),
        d3.sum(node.targetLinks, value)
      );
            });
        }

        // Iteratively assign the breadth (x-position) for each node.
        // Nodes are assigned the maximum breadth of incoming neighbors plus one;
        // nodes with no incoming links are assigned breadth zero, while
        // nodes with no outgoing links are assigned the maximum breadth.
        function computeNodeBreadths() {
            var remainingNodes = nodes,
        nextNodes,
        x = 0;

            while (remainingNodes.length) {
                nextNodes = [];
                remainingNodes.forEach(function(node) {
                    node.x = x;
                    node.dx = nodeWidth;
                    node.sourceLinks.forEach(function(link) {
                        nextNodes.push(link.target);
                    });
                });
                remainingNodes = nextNodes;
                ++x;
            }

            //
            moveSinksRight(x);
            scaleNodeBreadths((width - nodeWidth) / (x - 1));
        }

        function moveSourcesRight() {
            nodes.forEach(function(node) {
                if (!node.targetLinks.length) {
                    node.x = d3.min(node.sourceLinks, function(d) { return d.target.x; }) - 1;
                }
            });
        }

        function moveSinksRight(x) {
            nodes.forEach(function(node) {
                if (!node.sourceLinks.length) {
                    node.x = x - 1;
                }
            });
        }

        function scaleNodeBreadths(kx) {
            nodes.forEach(function(node) {
                node.x *= kx;
            });
        }

        function computeNodeDepths(iterations) {
            var nodesByBreadth = d3.nest()
        .key(function(d) { return d.x; })
        .sortKeys(d3.ascending)
        .entries(nodes)
        .map(function(d) { return d.values; });

            //
            initializeNodeDepth();
            resolveCollisions();
            for (var alpha = 1; iterations > 0; --iterations) {
                relaxRightToLeft(alpha *= .99);
                resolveCollisions();
                relaxLeftToRight(alpha);
                resolveCollisions();
            }

            function initializeNodeDepth() {
                var ky = d3.min(nodesByBreadth, function(nodes) {
                    return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
                });

                nodesByBreadth.forEach(function(nodes) {
                    nodes.forEach(function(node, i) {
                        node.y = i;
                        node.dy = node.value * ky;
                    });
                });

                links.forEach(function(link) {
                    link.dy = link.value * ky;
                });
            }

            function relaxLeftToRight(alpha) {
                nodesByBreadth.forEach(function(nodes, breadth) {
                    nodes.forEach(function(node) {
                        if (node.targetLinks.length) {
                            var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
                            node.y += (y - center(node)) * alpha;
                        }
                    });
                });

                function weightedSource(link) {
                    return center(link.source) * link.value;
                }
            }

            function relaxRightToLeft(alpha) {
                nodesByBreadth.slice().reverse().forEach(function(nodes) {
                    nodes.forEach(function(node) {
                        if (node.sourceLinks.length) {
                            var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
                            node.y += (y - center(node)) * alpha;
                        }
                    });
                });

                function weightedTarget(link) {
                    return center(link.target) * link.value;
                }
            }

            function resolveCollisions() {
                nodesByBreadth.forEach(function(nodes) {
                    var node,
            dy,
            y0 = 0,
            n = nodes.length,
            i;

                    // Push any overlapping nodes down.
                    nodes.sort(ascendingDepth);
                    for (i = 0; i < n; ++i) {
                        node = nodes[i];
                        dy = y0 - node.y;
                        if (dy > 0) node.y += dy;
                        y0 = node.y + node.dy + nodePadding;
                    }

                    // If the bottommost node goes outside the bounds, push it back up.
                    dy = y0 - nodePadding - size[1];
                    if (dy > 0) {
                        y0 = node.y -= dy;

                        // Push any overlapping nodes back up.
                        for (i = n - 2; i >= 0; --i) {
                            node = nodes[i];
                            dy = node.y + node.dy + nodePadding - y0;
                            if (dy > 0) node.y -= dy;
                            y0 = node.y;
                        }
                    }
                });
            }

            function ascendingDepth(a, b) {
                return a.y - b.y;
            }
        }

        function computeLinkDepths() {
            nodes.forEach(function(node) {
                node.sourceLinks.sort(ascendingTargetDepth);
                node.targetLinks.sort(ascendingSourceDepth);
            });
            nodes.forEach(function(node) {
                var sy = 0, ty = 0;
                node.sourceLinks.forEach(function(link) {
                    link.sy = sy;
                    sy += link.dy;
                });
                node.targetLinks.forEach(function(link) {
                    link.ty = ty;
                    ty += link.dy;
                });
            });

            function ascendingSourceDepth(a, b) {
                return a.source.y - b.source.y;
            }

            function ascendingTargetDepth(a, b) {
                return a.target.y - b.target.y;
            }
        }

        function center(node) {
            return node.y + node.dy / 2;
        }

        function value(link) {
            return link.value;
        }

        return sankey;
    };

    return _chart.anchor(parent, chartGroup);
}


dc.timeLine = function (parent, chartGroup) {

    var _chart = dc.stackableChart(dc.coordinateGridChart({}));
    _chart.__dc_custom__ == true;
    var _doneOnce = false;
    var tl;
    var ax;
    var x;
    
    
    _chart.doRender = function () {
        var d = _chart.dimension().top(9999);

        if (!_doneOnce) {
            tl = _chart.root().append("svg").attr("width", 900).attr("height", 400).append("g");
            tl.append("g").append("rect").attr("width", 900).attr("height", 1).attr("fill", "black").attr("transform", "translate(0,19)");
        }
        var mid = d3.min(d, function (d) { return new Date(d.EventDate) });
        var mxd = d3.max(d, function (d) { return new Date(d.EventDate) });
        
        //var mid2 = d3.min(d, function (d) { return d3.time.month.offset(new Date(d.EventDate),-2) });
        //alert(mid2);
        //var x = d3.time.scale().domain([new Date(d[0].StartDate), new Date(d[d.length - 1].EndDate)]).rangeRound([0,600]);
        x = d3.time.scale().domain([new Date(mid), new Date(mxd)]).rangeRound([10,890]);
        var plot = tl.selectAll("path").data(d);
        plot.transition().duration(500).attr("transform", function (d) { return "translate(" + x(new Date(d.EventDate)) + ",10)" });

        plot.enter().append("path").attr("d", "m3.61,12.12813l5.00008,-6.5l4.99992,6.5l-10,0z").attr("fill", function (d) { return GetColour(d.ActivityType) }).attr("transform", function (d) { return "translate(" + x(new Date(d.EventDate)) + ",10)" })
        //plot.enter().append("circle").attr("cx", function (d) { return x(new Date(d.EventDate)) }).attr("cy", 20).attr("r", 3).attr("fill", function (d) { return GetColor(d.ActivityType) })
        .on("mouseover", function (d) { tip = d.ActivityType + "(" + d.EventDate + ")"; dc.ShowToolTip(tip, '') })
        .on("mouseout", function (d) { dc.HideToolTip(); } )
        .on("mousemove", function (d) { dc.MoveToolTip(); })
        .on("click", function (d, i) {
            var id = d.UniqueKey.substr(0, d.UniqueKey.indexOf("/"));
            document.getElementById(id).scrollIntoView();
            $("#"+id).css("background-color", "green");
        });

        plot.exit().remove();
        
        

       
        var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(d3.time.months, 1).tickFormat(d3.time.format("%b %y")).tickSize(0).tickPadding(4);
        if (!_doneOnce) {
          
            tl.append("g").attr("class","xaxis").attr("transform", "translate(10,80)").call(xAxis).selectAll(".tick").select("text").attr("transform", "rotate(90)");
        }
        else {
            var y = tl.selectAll("g.xaxis");
            y.call(xAxis).selectAll(".tick").select("text").attr("transform", "rotate(90)");
        
           // tl.append("g").attr("transform", "translate(0,80)").call(xAxis).selectAll(".tick").select("text").attr("transform", "rotate(90)");
           // tl.selectAll("g").remove();
            //tl.append("g").attr("transform", "translate(0,80)").call(xAxis).selectAll(".tick").select("text").attr("transform", "rotate(90)");
        }
        _doneOnce = true;
    };
    _chart.redraw = function () {
        _chart.doRender();

    }
    return _chart.anchor(parent, chartGroup);
}

dc.textControl = function(parent, chartGroup) {

    var _chart = dc.baseChart({});
        _chart.__dc_custom__ == true;
    var _fieldList=[];
    var _label;
    var _bottomPadding=0;
        
         _chart.fieldList = function(_) {
        if (!arguments.length) return _fieldList;
        _fieldList = _;
        return _chart;
    }
         _chart.label = function(s) {
        if (!arguments.length) return _label;
        _label = s;
        return _chart;
    }
    
        
         _chart.bottomPadding = function(p) {
        if (!arguments.length) return _bottomPadding;
        _bottomPadding = p;
        return _chart;
    }
    
    
        
 _chart.doRender = function() {
  _chart.selectAll("div").remove();

  var mD=_chart.root().append("div").attr("class","textArea");
  
            
  _chart.dimension().top(100).forEach(function(d) {
      _fieldList.forEach(function (d2)
      {
  var fld= mD.append("div").attr("class","textCell").style("margin-bottom",_bottomPadding);
  
  if (_label!=undefined)
  {
   fld.append("SPAN").text(_label);
  
  }
  fld.append("text").text(d[d2]);
       });
  });
   

}

 return _chart.anchor(parent, chartGroup);
}