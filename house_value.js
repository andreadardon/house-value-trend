$(document).ready(function() {
  $(".hide-at-start").hide()
});

var autocomplete = new google.maps.places.Autocomplete(document.getElementById('newAddress'));

function generateChart(data) {
  var chart = c3.generate({
    bindto: '#chart',
    data: {
      columns: [
        ["House Value",
        data["years"]["1990"]["median"], data["years"]["1995"]["median"], data["years"]["2000"]["median"], data["years"]["2005"]["median"], data["years"]["2010"]["median"], data["years"]["2015"]["median"]]
      ]
    },
    color: {
        pattern: ['#EA4845']
    },
    axis: {
      x: {
        type: 'category',
        categories: ['1990', '1995', '2000', '2005','2010','2015']
      },
      y: {
          label: {
              text: 'Value in 2017 USD ($)',
              position: 'outer-middle'
          }
      }
    },
    tooltip: {
          format: {
              title: function (d) { return 'Data ' + d; },
              value: function (value, ratio, id) {
                  var format = id === 'data1' ? d3.format(',') : d3.format('$');
                  return format(value);
              }
          }
      }
  })
};

function generateTable(data){
  var firstTableValue =
  (data["years"]["1995"]["median"] - data["years"]["1990"]["median"])/data["years"]["1990"]["median"]
  var secondTableValue =
  (data["years"]["2000"]["median"] - data["years"]["1995"]["median"])/data["years"]["1995"]["median"]
  var thirdTableValue =
  (data["years"]["2005"]["median"] - data["years"]["2000"]["median"])/data["years"]["2000"]["median"]
  var fourthTableValue =
  (data["years"]["2010"]["median"] - data["years"]["2005"]["median"])/data["years"]["2005"]["median"]
  var fifthTableValue =
  (data["years"]["2015"]["median"] - data["years"]["2010"]["median"])/data["years"]["2010"]["median"]


  $("#90to95").html(Math.round(firstTableValue * 10000)/100);
  $("#95to00").html(Math.round(secondTableValue * 10000)/100);
  $("#00to05").html(Math.round(thirdTableValue * 10000)/100);
  $("#05to10").html(Math.round(fourthTableValue * 10000)/100);
  $("#10to15").html(Math.round(fifthTableValue * 10000)/100);
};

function requestDataFromAPI() {
  $.post("https://2ki6gggaqc.execute-api.us-east-1.amazonaws.com/dev", JSON.stringify(reportSpecification), (result) => {
    $("#spinner").hide()
    $("#chart").show()
    $("#table").show()
    $("#printReport").show()
    generateChart(result)
    generateTable(result)

    ga('send','event','report','generated')

  },"json")
}

autocomplete.addListener('place_changed', function() {
  var place = autocomplete.getPlace();
  $(".show-during-load").show();
  $(".show-on-load").hide();

  ga('send','event','report','requested')

  var reportSpecification = {
  "reportType": {
      "name": "Longitudinal House Value",
      "slug": "longitudinal_house_value"
   },
   "geoJSON" : {
     "type" : "Feature",
     "geometry": {
       "coordinates" : [place.geometry.location.lng(), place.geometry.location.lat()],
       "radius" : 1600,
       "type" : "Point"
     },
     "properties" : {
      "address" : "TRAINING AND EDUCATION"
     }
   }
  }

  requestDataFromAPI(reportSpecification)
})

function printReport(){
 setTimeout(function(){window.print()}, 1000)
}
