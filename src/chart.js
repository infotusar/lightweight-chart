'strict mode';
const { error, log } = console;

/******************[ Graphical Interface ]******************/
const cryptoChart = document.getElementById('cryptoChart');
const chartWidth = 1500;
const chartHeight = 500;
/******************[ Graphical Interface ]******************/

/******************[ Default Chart ]******************/
var chart = LightweightCharts.createChart(cryptoChart, {
	width: chartWidth,
  height: chartHeight,
	rightPriceScale: {
		visible: true,
    borderColor: 'rgba(197, 203, 206, 1)',
	},
	leftPriceScale: {
		visible: true,
    borderColor: 'rgba(197, 203, 206, 1)',
    mode: 2,
    autoScale: false,
    invertScale: true,
	},
	layout: {
		backgroundColor: '#ffffff',
		textColor: 'rgba(33, 56, 77, 1)',
	},
  grid: {
    horzLines: {
      color: '#F0F3FA',
    },
    vertLines: {
      color: '#F0F3FA',
    },
  },
	crosshair: {
		mode: LightweightCharts.CrosshairMode.Normal,
	},
	timeScale: {
		borderColor: 'rgba(197, 203, 206, 1)',
	},
	handleScroll: {
		vertTouchDrag: false,
	},
  localization: {
    dateFormat: 'yyyy-MM-dd',
    timeFormatter: businessDayOrTimestamp => {
      // console.log(businessDayOrTimestamp);

      if (LightweightCharts.isBusinessDay(businessDayOrTimestamp)) {
          return 'Format for business day';
      }

      return moment.unix(businessDayOrTimestamp).utcOffset(-5).format('YYYY-MM-DD HH:mm:ss');
    },
  },
});

chart.applyOptions({
    timezone: "America/Toronto",
    timeScale: {
      // barSpacing: 75,
      // minBarSpacing: .5,
      // autoScale: true,
      barSpacing: 2,
      timeWithSeconds: true,
      timeVisible: true,
      secondsVisible: true,
      visible: true,
      overlay: false,
      tickMarkFormatter: (time, tickMarkType, locale) => {
        // console.log(time, tickMarkType, locale);
        return moment.unix(time).utcOffset(-5).format('DD, HH:mm:ss');
      }
    },
});

chart.applyOptions({
    priceScale: {
        mode: 1,
        autoScale: true,
        alignLabels: true,
        borderVisible: true,
    },
});

// AreaSeries - chart 1
const areaSeries = chart.addAreaSeries({
  priceScaleId: 'left',
	color: 'rgba(4, 111, 232, 1)',
	lineWidth: 2,
  topColor: 'transparent',
  bottomColor: 'transparent',
});

// LineSeries - chart 2
const lineSeries = chart.addLineSeries({
	color: 'rgba(4, 111, 232, 1)',
	lineWidth: 2,
});

/******************[ Default Chart ]******************/

/******************[ alpha implementaion ]******************/
// searching area
// searching icon
var width = 45;
var height = 45;
var button = document.createElement('div');
button.className = 'search-record';
const btnLeft = (chartWidth - width - 95);
const btnTop = (10);
button.style.left = btnLeft + 'px';
button.style.top = btnTop + 'px';
button.style.color = '#4c525e';
button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 172 172" style=" fill:#26e07f;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#1fb141"><path d="M21.5,21.5v129h64.5v-32.25v-64.5v-32.25zM86,53.75c0,17.7805 14.4695,32.25 32.25,32.25c17.7805,0 32.25,-14.4695 32.25,-32.25c0,-17.7805 -14.4695,-32.25 -32.25,-32.25c-17.7805,0 -32.25,14.4695 -32.25,32.25zM118.25,86c-17.7805,0 -32.25,14.4695 -32.25,32.25c0,17.7805 14.4695,32.25 32.25,32.25c17.7805,0 32.25,-14.4695 32.25,-32.25c0,-17.7805 -14.4695,-32.25 -32.25,-32.25z"></path></g></g></svg>';
cryptoChart.appendChild(button);
// implementing datetime picker
var inputDate = document.createElement('div');
inputDate.className = 'record-field flatpickr';
inputDate.id = 'pickrecord';
inputDate.style.left = (btnLeft - 210) + 'px';
inputDate.style.top = (btnTop + 50) + 'px';
inputDate.innerHTML = `
  <label><input type="text" id="datetimerecord" title="Search record" placeholder="YYYY-MM-DD HH:MM:SS"></label>
`;
const pickerInput = document.getElementById('datetimerecord');
cryptoChart.appendChild(inputDate);
function Toggle() {
  if(inputDate.style.display === "block"){
      inputDate.style.display = "none";
  }else{
      inputDate.style.display = "block";
  }
}

const dateRangePicker = new DateRangePicker('datetimerecord', {
  timePicker: true,
  locale: {
    format: "YYYY-MM-DD HH:mm:ss",
  },
  singleDatePicker: true,
  timePicker24Hour: true,
  timePickerSeconds: true,
  linkedCalendars: false,
});

let loadchart = document.createElement('div');
loadchart.className = 'loading-chart';
cryptoChart.appendChild(loadchart);

button.addEventListener('click', e => {
  e.preventDefault();
  Toggle();
})
// searching area

// realtime button
var width = 27;
var height = 27;

var button = document.createElement('div');
button.className = 'go-to-realtime-button';
button.style.left = (chartWidth - width - 65) + 'px';
button.style.top = (chartHeight - height - 30) + 'px';
button.style.color = '#4c525e';
button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6.5 1.5l5 5.5-5 5.5M3 4l2.5 3L3 10"></path></svg>';
cryptoChart.appendChild(button);

var timeScale = chart.timeScale();
timeScale.subscribeVisibleTimeRangeChange(function() {
  var buttonVisible = timeScale.scrollPosition() < 0;
  button.style.display = buttonVisible ? 'block' : 'none';
});

button.addEventListener('click', function() {
  timeScale.scrollToRealTime();
});
// realtime button

// remove markers
cryptoChart.addEventListener('click', e => {
  e.preventDefault();
  lineSeries.setMarkers([]);
});

// legend area
const legend = document.createElement('div');
    legend.classList.add('legend');
    legend.innerHTML = `<p><span>DJI</span></p>`;
cryptoChart.appendChild(legend);
// legend area

/******************[ alpha implementaion ]******************/

/******************[ Data Logic ]******************/
const Data = (type) => {
    d3.csv('data/01-01-2019.csv', type)
      .then(res => {
        const res2 = res.map(({value: last, volume: value, ...rest}) => {
          return {
            ...rest,
            last,
            value
          };
        });

        // loading removal
        if(res.length > 0){
          cryptoChart.removeChild(loadchart);
        }

        log(res)
        // Add dual chart
        lineSeries.setData(res);
        areaSeries.setData(res);

        
        // Tailor ground

        chart.subscribeCrosshairMove((param) => {
          // Legend feature
          loadLegend(param, res);
        });

        // searching feature
        loadSearching(res);
        // searching feature
        
        // Tailor ground

      })
      .catch(e => log('Error loading data.'));
}
/******************[ Data Logic ]******************/

/******************[ Helper functions ]******************/
// rearrange data
const type = (d) => {
  const mtz = moment(d["Date-Time"]).local().format('YYYY-MM-DD HH:mm:ss');
  const mm = moment(mtz).unix()
  return {
    ric: d["#RIC"],
    time: mm,
    value: +d["Last"],
    volume: +d["Volume"]
  }
}
/******************[ Helper functions ]******************/

/******************[ Template functions ]******************/
// legend template
function loadLegend(param, res){
  if (param.time) {
    const price = param.seriesPrices.get(lineSeries);
    const index = res.findIndex(row => row.time == param.time);
    legend.innerHTML = `<p><span>${res[index].ric}</span> ${price.toFixed(2)}</p>`;
  }
  else {
    legend.innerHTML = `<p><span>DJI</span></p>`;
  }
}

// searching template
function loadSearching(res){
  window.addEventListener('apply.daterangepicker', function (ev) {
    ev.preventDefault();

    const searchtime = moment.tz(`${ev.detail.startDate.format('YYYY-MM-DD HH:mm:ss')}`, 'America/Toronto').unix();
    const index = res.findIndex(row => row.time == searchtime);
    log('-----index:--', index);
    if(index === -1) return;
    
    // set markers
    const foundItem = res[index];
    foundItem.position = 'aboveBar';
    foundItem.color = '#cf4343';
    foundItem.shape = 'arrowDown';
    foundItem.text = ev.detail.startDate.format('YYYY-MM-DD HH:mm:ss');
    lineSeries.setMarkers([foundItem]);

    // set middle
    const {from, to} = chart.timeScale().getVisibleRange();
    const From = res.findIndex(row => row.time == from);
    const To = res.findIndex(row => row.time == to);
    const addPrevNext = ((res.slice(From, To).length - 1)/ 2);
    
    chart.timeScale().setVisibleLogicalRange({ 
      from: Number(index - addPrevNext), 
      to: Number(index + addPrevNext), 
    });

    inputDate.style.display = 'none';
  });
}
/******************[ Template functions ]******************/

/******************[ Calling the chart ]******************/
Data(type);
/******************[ Calling the chart ]******************/
