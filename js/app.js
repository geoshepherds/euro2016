///variables
var cityArea = document.getElementById("city");
var cityName;
var stadiumNameArea = document.getElementById("stadium");
var stadiumName;
var capacityArea = document.getElementById("capacityNumber");
var capacityNumber;

var teamStatsDiv = document.getElementById("teamStatsDiv");
var placeInfoDiv = document.getElementById("placeInfo");
var teamStatsOne;
var teamStatsTwo;

var inputArea = document.getElementById("countryInput");
var messageOutput = document.getElementById("searchMessage");
var searchButton = document.getElementById("searchButton");
var teamArr = [];

var calendarMonth = document.getElementById("sliderMonth");
var calendarDay = document.getElementById("sliderDate");
var sliderDate;

var match;
var groupStageDiv = document.getElementById("groupStage");
var r16Div = document.getElementById("round16");
var qtrFinalDiv = document.getElementById("qtrFinals");
var semiFinalDiv = document.getElementById("semiFinals");
var finalDiv = document.getElementById("final");
var matchData;
var groupMatchData = [];
var r16MatchData = [];
var qtrMatchData = [];
var semiMatchData = [];
var finalMatchData = [];

var message;

var svgWidth = 500;
var svgHeight = 500;

var projection = d3.geo.mercator()
        .center([1, 47])
        .scale(2000)
        .translate([svgWidth / 2, svgHeight / 2]);
    
var pathFrance = d3.geo.path()
        .projection(projection);
    
var svgFrance = d3.select("#map").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

var g = svgFrance.append("g");


//construct time slider

var margin = {top: 20, right: 50, bottom: 20, left: 50};
var sliderHeight = 100 - margin.bottom - margin.top;
var sliderWidth = 600 - margin.left - margin.right;

var scaleX = d3.time.scale()
    .domain([new Date("09 Jun 2016"), new Date("10 Jul 2016")])
    .range([0, sliderWidth])
    .clamp(true);

//var startValue = scaleX(new Date("09 Jun 2016"));
var startingValue = new Date("09 Jun 2016");
var endValue = new Date("10 Jun 2016");

var brush = d3.svg.brush()
    .x(scaleX)
    .extent([startingValue, endValue])
    .on("brush", brushed)
    .on("brushend", brushEnd)
    .on("brushstart", brushStart);

var sliderSVG = d3.select("#timeSlider").append("svg")
    .attr("width", sliderWidth + margin.left + margin.right)
    .attr("height", sliderHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "sliderG");

sliderSVG.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + sliderHeight / 2 + ")")
    .call(d3.svg.axis()
         .scale(scaleX)
         .orient("bottom")
         .ticks(d3.time.week, 1)  
         .tickFormat(d3.time.format("%d %b")) 
         .tickPadding(20))
    .select(".domain")
    .select(function() {
        return this.parentNode.appendChild(this.cloneNode(true));
})
    .attr("class", "halo");

sliderSVG.selectAll("g.tick line")
    .attr("y2", function(d){
        return 15;
})
       
var slider = sliderSVG.append("g")
    .attr("class", "slider")
    .call(brush);

slider.selectAll(".extent,.resize")
    .remove();

slider.select(".background")
    .attr("height", sliderHeight);

var handle = slider.append("g")
    .attr("class", "handle");

handle.append("svg:image")
    .attr("transform", "translate(-10,14)")
    .attr("xlink:href", "images/footballIcon.png")
    .attr("width", 35)
    .attr("height", 35);
    //.attr("class", "sliderIcon")
    //.attr("d", "M 0 -20 V 20");


slider
    .call(brush.event);

function brushed() {
    var value = d3.time.day.round(brush.extent()[0]);
    var value2 = d3.time.day.offset(value, 1);
    var extent1 = [value, value2];
    
    if( d3.event.sourceEvent ) {
        extent1 = scaleX.invert(d3.mouse(this)[0]);
        var newExtent = d3.time.day.round(extent1);
        brush.extent([newExtent, newExtent]);
        handle.attr("transform", "translate(" + scaleX(newExtent) + ",0)");
        
        calendarMonth.innerHTML = setMonthFormat(newExtent).toUpperCase();
        calendarDay.innerHTML = setDayFormat(newExtent);
        //handle.select("text").text(setDateFormat(newExtent));
        //dateStyling(newExtent);
    }   
}

function brushEnd() {
    var value = d3.time.day.round(brush.extent()[0]);
    var value2 = d3.time.day.offset(value, 1);
    var extent1 = [value, value2];
    
    if( d3.event.sourceEvent ) {
        extent1 = scaleX.invert(d3.mouse(this)[0]);
        var newExtent = d3.time.day.round(extent1);
        brush.extent([newExtent, newExtent]);
        
        dateStyling(newExtent);
    }   
}

function setMonthFormat( date ) {
    var matchDateFormat = d3.time.format("%B");
    return matchDateFormat(date);
} 

function setDayFormat( date ) {
    var matchDayFormat = d3.time.format("%d");
    //console.log(matchDayFormat);
    return matchDayFormat(date);
} 

function dateFormatCompare( date ) {
    var compareDateFormat = d3.time.format("%d-%b-%y");
    return compareDateFormat(date);
}

function dateStyling( date ) {
    sliderDate = dateFormatCompare(date);

    for(var j = 0; j < euroMatches.length; j += 1){
            
        var matchDate = euroMatches[j];
        
        if ( sliderDate === matchDate.date && inputArea.value.toUpperCase() !== matchDate.teamOne.toUpperCase()){
            
            d3.selectAll("circle#" + matchDate.city )
                .transition()
                .duration(250)
                .ease("quad")
                .attrTween("r", function(d, i, a){
                    return d3.interpolate(a, 24);
            })
                .attr("fill", "#D72128");
        } else if ( sliderDate === matchDate.date && inputArea.value.toUpperCase() === matchDate.teamOne.toUpperCase() ) {
            
            d3.selectAll("circle#" + matchDate.city )
                .transition()
                .duration(250)
                .ease("quad")
                .attrTween("r", function(d, i, a){
                    return d3.interpolate(a, 26);
            })
                .attr("fill", "#000");
            
        } else {
            
            d3.selectAll("circle#" + matchDate.city)
                .attr("r", 5)
                .attr("fill", "#014D89");
        }
    }
}

///create path for france outline using D3
function france( data ) {

    g.append("path")
        .datum(data)
        .attr("d", pathFrance)
        .attr("fill", "#899094")
        .attr("class", "france")
        .style("opacity", "1");
}



///add points on top of the France outline
function stadiumPoints( data ) {
    
    var stadiumData = data;
    
    g.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("id", function(d, i) {
            return stadiumData[i].properties.city;
    })
        .attr("cx", function(d) {
               return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0];
        })
        .attr("cy", function(d) {
               return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1];
        })
        .attr("r", 5)
        .attr("fill", "#014D89")
        .style("stroke", "#fff")
        .style("stroke-width", "2px")
        .style("opacity", "0.8")
        .on("mouseover", function(d, i) {
            changeColor(this);
            appendInfo(stadiumData[i]);
            updatePlaceInfo(stadiumData[i]);
            
        })
        .on("mouseout", function(d, i){
            resetColor(this);
            //defaultPlaceInfo();
            
    })

}

//point color change on hover
function changeColor(feature) {
    
    var radius = feature.getAttribute("r");
    
    if ( radius === "5" ) {
    d3.select(feature)
        .transition()
        .duration(250)
        .ease("quad")
        .attr("fill", "#D72128")
        .attr("r", 25)
        .each("interrupt", function(){
            d3.select(this)
                .attr("r", 5);
    });
    } else if ( radius === "24" ) {
        d3.select(feature)
            .transition()
            .attr("fill", "#014D89");
    }

}
//point color reset on mouseout
function resetColor(feature) {
    
    var radius = feature.getAttribute("r");
    
    if ( radius === "25" ) {
        d3.select(feature)
            .transition()
            .duration(250)
            .ease("quad")
            .attr("r", 5)
            .attr("fill", "#014D89")
            .style("stroke", "#fff")
            .style("stroke-width", "2px")
            .each("end", function(){
                d3.select(this)
                    .attr("r", 5);
    });
    } else if ( radius === "26" ) {
        d3.select(feature)
            .transition()
            .attr("fill", "#000");
    } else if ( radius === "24" ) {
        d3.select(feature)
            .transition()
            .attr("fill", "#D72128");
    }
}

function brushStart() {

    groupStageDiv.innerHTML = "";
    r16Div.innerHTML = "";
    qtrFinalDiv.innerHTML = "";
    semiFinalDiv.innerHTML = "";
    finalDiv.innerHTML = "";
    
    defaultPlaceInfo();
    capacityNumber.innerText = "";
}




//iterate through match data
function appendInfo( feature ) {
    
    groupMatchData = [];
    r16MatchData = [];
    qtrMatchData = [];
    semiMatchData = [];
    finalMatchData = [];
    
    for ( var j = 0; j < euroMatches.length; j += 1 ) {
        
        match = euroMatches[j];
        if ( feature.properties.city === match.city && match.type === "Group Stage" ) {
            groupMatchData.push( match );
        } else if ( feature.properties.city === match.city && match.type === "Round of 16" ) {
            r16MatchData.push( match );
        } else if ( feature.properties.city === match.city && match.type === "Quarter Finals" ) {
            qtrMatchData.push( match );
        } else if ( feature.properties.city === match.city && match.type === "Semi Finals" ) {
            semiMatchData.push( match );
        } else if ( feature.properties.city === match.city && match.type === "Final" ) {
            finalMatchData.push( match );
        }
    }
    //call function to display data
    populateGroupMatches( groupMatchData );
    addListeners();
    populateR16Matches( r16MatchData );
    populateQtrMatches( qtrMatchData );
    populateSemiMatches( semiMatchData );
    populateFinalMatch( finalMatchData );
    
}

function printGroupMatchData( info ) {
    groupStageDiv.innerHTML += info;   
}

function printR16MatchData( info ) {
    r16Div.innerHTML += info;
}

function printQtrMatchData( info ) {
    qtrFinalDiv.innerHTML += info;
}

function printSemiMatchData( info ) {
    semiFinalDiv.innerHTML += info;
}

function printFinalMatchData( info ) {
    finalDiv.innerHTML += info;
}


function matchReport( data ) {
    
    if ( sliderDate === matchData.date ) {
        var report = "<h5><img src='images/png/timer20redwht.png' width='24px' height='24px'/>Date: <span id='matchGameDay'>" + data.date + "  " + data.time + "</span></h5>";
    report += "<h4 class='teamMatch'><span class='teamStats1'>" + data.teamOne + "</span><span class='versus'> vs. </span><span class='teamStats1'>" + data.teamTwo + "</span></h4>";
    return report;
    } else if ( inputArea.value.toUpperCase() === matchData.teamOne.toUpperCase() || inputArea.value.toUpperCase() === matchData.teamTwo.toUpperCase() ){
        console.log("its working...")
        //var report = "<h5><img src='images/png/timer20redwht.png' width='24px' height='24px'/>Date: <span id='matchGameDay'>" + data.date + "  " + data.time + "</span></h5>";
    //report += "<h4 class='teamMatch'><span class='teamStats1'>" + data.teamOne + "</span><span class='versus'> vs. </span><span class='teamStats1'>" + data.teamTwo + "</span></h4>";
    return report;
    } else {
    var report = "<h5><img src='images/png/timer20wht.png' width='24px' height='24px'/>Date: <span>" + data.date + "  " + data.time + "</span></h5>";
    report += "<h4 class='teamMatch'><span class='teamStats1'>" + data.teamOne + "</span><span class='versus'> vs. </span><span class='teamStats1'>" + data.teamTwo + "</span></h4>";
    return report;
    }
}

function populateGroupMatches( data ) {
    
    groupStageDiv.innerHTML = "";
    
    for (var j = 0; j < data.length; j += 1 ){
        matchData = data[j];
        var message = matchReport(matchData);
        printGroupMatchData(message);
        }
}

function populateR16Matches( data ) {
    
    r16Div.innerHTML = "";
    for (var j = 0; j < data.length; j += 1 ){
        matchData = data[j];
        var message = matchReport(matchData);
        printR16MatchData(message);
    }
}

function populateQtrMatches( data ) {
    
    qtrFinalDiv.innerHTML = "";
    for (var j = 0; j < data.length; j += 1 ){
        matchData = data[j];
        var message = matchReport(matchData);
        printQtrMatchData(message);
    }
}

function populateSemiMatches( data ) {
    
    semiFinalDiv.innerHTML = "";
    for (var j = 0; j < data.length; j += 1 ){
        matchData = data[j];
        var message = matchReport(matchData);
        printSemiMatchData(message);
    } 
}

function populateFinalMatch( data ) {
    
    finalDiv.innerHTML = "";
    for (var j = 0; j < data.length; j += 1 ){
        matchData = data[j];
        var message = matchReport(matchData);
        printFinalMatchData(message);
    }
}




function defaultPlaceInfo() {
    
    cityName = cityArea;
    cityName.innerText = "CITY"
    
    stadiumName = stadiumNameArea;
    stadiumName.innerText = "STADIUM"
    
    capacityNumber = capacityArea;
    //capacityNumber.innerText = "CAPACITY"
}

function updatePlaceInfo( feature ) {
    
    var cityNameInput = feature.properties.city;
    var stadiumNameInput = feature.properties.stadium;
    var capacityInput = feature.properties["uefa capac"];
    
    cityName.innerText = cityNameInput.toUpperCase();
    stadiumName.innerText = stadiumNameInput.toUpperCase();
    capacityNumber.innerText = " " + formatNumber(capacityInput);
    
}

function formatNumber (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

function populateTeamStats( team ) {
    placeInfoDiv.classList.toggle("hidden");
    teamStatsDiv.classList.toggle("hidden");
    var clickedTeamOne = team.target.innerHTML;
    
    for(var i = 0; i < teamStats.length; i += 1) {
    
        var teamStatsTeam = teamStats[i];
        
        if ( clickedTeamOne === teamStatsTeam.team ) {
        
            console.log(teamStatsTeam.team);
            var teamName = document.getElementById("teamName");
            var teamFlag = document.getElementById("teamFlag"); 
            var exitButton = document.getElementById("exitButton");
            var fifaRank = document.getElementById("fifaRank"); 
            var topResult = document.getElementById("topResult"); 
            var teamCoach = document.getElementById("teamCoach"); 
            var topScorer = document.getElementById("topScorer"); 
            var groupName = document.getElementById("groupName"); 
            var groupLeft = document.getElementById("groupLeft"); 
            var groupRight = document.getElementById("groupRight");
            var groupBottomLeft = document.getElementById("groupBottomLeft"); 
            var groupBottomRight = document.getElementById("groupBottomRight"); 
            
            teamName.innerHTML = "<h2 class='country'>" + teamStatsTeam.team.toUpperCase() + "</h2>";
            exitButton.innerHTML = "<button>X</button>"
            fifaRank.innerHTML = "<h5>FIFA RANK <span class='statNumber'>" + teamStatsTeam.fifaRank + "</span></h5>";
            topResult.innerHTML = "<h5>BEST PERFORMANCE</h5><h2 class='featureText'>" + teamStatsTeam.topResult.toUpperCase() + "</h2><h5>YEAR&#40;S&#41; <span class='performanceYear'>" + teamStatsTeam.topYear + "</span></h5>";
            teamCoach.innerHTML = "<h5>COACH <span class='coach'>" + teamStatsTeam.coach + "</span></h5>";
            topScorer.innerHTML = "<h5>TOP GOALSCORER <br><span class='goalScorer'> " + teamStatsTeam.goalScorer + "</span><span>GOALS </span><span class='goals'>"  + teamStatsTeam.goals + "</span></h5>";
            groupName.innerHTML = "<h5>GROUP <span class='groupLetter'>" + teamStatsTeam.group + "</span></h5>";
            groupLeft.innerHTML = "<h4>" + teamStatsTeam.teamOne.toUpperCase() + "</h4>";
            groupRight.innerHTML = "<h4>" + teamStatsTeam.teamTwo.toUpperCase() + "</h4>"; 
            groupBottomLeft.innerHTML = "<h4>" + teamStatsTeam.teamThree.toUpperCase() + "</h4>";
            groupBottomRight.innerHTML = "<h4>" + teamStatsTeam.teamFour.toUpperCase() + "</h4>";
                                        
            exitButton.addEventListener("click", exitTeamStats)
        } 
    }      
}
                                        
function exitTeamStats(){
   
    teamStatsDiv.classList.toggle("hidden");
    placeInfoDiv.classList.toggle("hidden");
}

function addListeners() {
    
    teamStatsOne = document.querySelectorAll("span.teamStats1");
    //teamStatsTwo = document.getElementById("teamStats2");
    //console.log(teamStatsOne);
    
    for(var i = 0; i < teamStatsOne.length; i += 1) {
        
        var teamStatsData = teamStatsOne[i];
            teamStatsData.addEventListener("click", populateTeamStats);
            teamStatsData.addEventListener("mouseover", function(){
                this.style.cursor="pointer";
                this.style.textDecoration="underline";
            });
            teamStatsData.addEventListener("mouseout", function(){
                this.style.textDecoration="none";
            });
        }
}

function checkInput() {
    
    if ( inputArea.value === "" ) {
            messageOutput.innerText = "No team was entered...";
    } else {
    
        for (var i = 0; i < euroMatches.length; i += 1) {

            var teamStats = euroMatches[i];

                teamArr.push(teamStats.teamOne.toUpperCase());
                //messageOutput.innerText = "You selected";
        }
        if ( teamArr.indexOf(inputArea.value.toUpperCase()) > -1 ){
            messageOutput.innerText = "You selected " + inputArea.value;
        } else {
            messageOutput.innerText = "No team matched your search...";
        }
    }
    
    teamArr = [];
}

searchButton.addEventListener("click", checkInput);


///default feature style of points


///feature style of points on mouseover


///reset style of points on mouseout



///populate #placeInfo div area

        
        ///city name
        ///stadium
        ///capacity
           

///populate #matchFixtures div area
        ///group stage
        ///round16
        ///qtr final
        ///semi final
        ///final


///create some time slider D3 element to cycle through points


///event handlers



///function calls
france( franceOutline );
stadiumPoints( stadiums.features );
defaultPlaceInfo();

//dateStyling();