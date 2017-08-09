$("#spinner").hide()
$("#printReport").hide()
 var input = document.getElementById('input');
 var autocomplete = new google.maps.places.Autocomplete(input);

 function processReportObject(data) {
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

 function processTableObject(data){
    var firstChangeValue =
    (data["years"]["1995"]["median"] - data["years"]["1990"]["median"])/data["years"]["1990"]["median"]
    var secondChangeValue =
    (data["years"]["2000"]["median"] - data["years"]["1995"]["median"])/data["years"]["1995"]["median"]
    var thirdChangeValue =
    (data["years"]["2005"]["median"] - data["years"]["2000"]["median"])/data["years"]["2000"]["median"]
    var fourthChangeValue =
    (data["years"]["2010"]["median"] - data["years"]["2005"]["median"])/data["years"]["2005"]["median"]
    var fifthChangeValue =
    (data["years"]["2015"]["median"] - data["years"]["2010"]["median"])/data["years"]["2010"]["median"]


    $("#90to95").html(Math.round(firstChangeValue * 10000)/100);
    $("#95to00").html(Math.round(secondChangeValue * 10000)/100);
    $("#00to05").html(Math.round(thirdChangeValue * 10000)/100);
    $("#05to10").html(Math.round(fourthChangeValue * 10000)/100);
    $("#10to15").html(Math.round(fifthChangeValue * 10000)/100);
  };

 autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    $("#spinner").show()
    $("#chart").hide()
    $("#table").hide()

    var coordinates = [place.geometry.location.lng(), place.geometry.location.lat()]

    var reportSpecification = {
    "reportType": {
        "name": "Longitudinal House Value",
        "slug": "longitudinal_house_value"
     },
     "geoJSON" : {
       "type" : "Feature",
       "geometry": {
         "coordinates" : coordinates,
         "radius" : 1600,
         "type" : "Point"
       },
       "properties" : {
        "address" : "TRAINING AND EDUCATION"
       }
     }
    }

    ga('send','event','report','requested')

    $.post("https://2ki6gggaqc.execute-api.us-east-1.amazonaws.com/dev", JSON.stringify(reportSpecification), (result) => {
      $("#spinner").hide()
      $("#chart").show()
      $("#table").show()
      $("#printReport").show()
      processReportObject(result)
      $("#table").show(  processTableObject(result));

      ga('send','event','report','generated')

    },"json")
 })

$("#table").hide();

$('#printReport').click(function(){
     window.print();
});
