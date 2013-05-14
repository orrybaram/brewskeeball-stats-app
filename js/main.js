
        function Controller($scope, $http, $log, $q){
            $scope.keys = {};
            $scope.stats = {};
            $scope.yearAndTri = "";
            $scope.http = "https://spreadsheets.google.com/feeds/list/";
            $scope.callback = "/public/values?alt=json&callback=JSON_CALLBACK";
            $scope.keysSheet = ($scope.yearAndTri === "2012-3") ? "od5" : "oda";
            $scope.dayOfWeekObj = {
                'sun'  : "Sunday",
                'mon'  : "Monday",
                'tue'  : "Tuesday",
                'wed'  : "Wednesday",
                'thur' : "Thursday",
                'fri'  : "Friday",
                'sat'  : "Saturday"
            }

            $scope.createHashmapForKeys = function(){
                $log.log("scope", $scope);
                
                // URL for data
                $scope.url = $scope.http + "0At0CaY3KoBvedDBFcXFsUmE3aTZWVURYcGFpckFaM0E/od5" + $scope.callback;
                

                //JSONP request to get said data
                $http.jsonp($scope.url).then(function(response){
                        var dataStore = response.data.feed.entry,
                        hash = {}, 
                        i, 
                        n, 
                        league, 
                        night, 
                        key,
                        ds;

                    for (i = 0, n = dataStore.length; i < n; ++i) {
                      ds = dataStore[i];
                      league = $scope.keys[ds.gsx$league['$t'].toLowerCase()] = $scope.keys[ds.gsx$league['$t'].toLowerCase()] || {};
                      league[ds.gsx$night['$t'].toLowerCase()] = ds.gsx$key['$t'];
                    }

                //log the keys
                $log.log($scope.keys);
                })
            }
            $scope.requestStatsData = function(league,division,ws){
                var d = $q.defer(),
                    url = $scope.http + $scope.keys[league][division]+"/"+ws + $scope.callback;
                    
                        $http.jsonp(url).then(function(response){
                            $scope.stats = response;
                            d.resolve();
                        })
                        
                    return d.promise;
            }

            $scope.renderStats = function(){
                var $statsContent = $("#stats-content"),
                    league = $("#league").val(),
                    division = $("#division").val(), 
                    ws = $("#category").val(),
                    category = 
                        (ws === "od6") ? "standings" : 
                        (ws === "od4") ? "playerStats" : 
                        (ws === "od5") ? "totals" : "marks";

                if(league != "" && division != "" && ws != ""){
                    var promise = $scope.requestStatsData(league,division,ws);
                    promise.then(function(){
                        var source = $("#"+category+"-template").html();
                        var template = Handlebars.compile(source);
                        var entry = $scope.stats.data.feed.entry;
                        var data = {};
                            data.entry = [];
                            if(entry){
                                for (var x=0; x<entry.length;x++){
                                    var tempObj = {};
                                        if(category === "playerStats"){
                                            tempObj.roller = entry[x].gsx$roller['$t'];    
                                            tempObj.wk1 = entry[x].gsx$wk1['$t'];
                                            tempObj.wk2 = entry[x].gsx$wk2['$t'];
                                            tempObj.wk3 = entry[x].gsx$wk3['$t'];
                                            tempObj.wk4 = entry[x].gsx$wk4['$t'];
                                            tempObj.wk5 = entry[x].gsx$wk5['$t'];
                                            tempObj.wk6 = entry[x].gsx$wk6['$t'];
                                            tempObj.wk7 = entry[x].gsx$wk7['$t'];
                                            tempObj.wk8 = entry[x].gsx$wk8['$t'];
                                            tempObj.total = entry[x].gsx$total['$t'];
                                            tempObj.avg = entry[x].gsx$avg['$t'];
                                        } 
                                        else if(category === "marks"){
                                            tempObj.roller = entry[x].gsx$roller['$t'];    
                                            tempObj.wk1 = entry[x].gsx$wk1['$t'];
                                            tempObj.wk2 = entry[x].gsx$wk2['$t'];
                                            tempObj.wk3 = entry[x].gsx$wk3['$t'];
                                            tempObj.wk4 = entry[x].gsx$wk4['$t'];
                                            tempObj.wk5 = entry[x].gsx$wk5['$t'];
                                            tempObj.wk6 = entry[x].gsx$wk6['$t'];
                                            tempObj.wk7 = entry[x].gsx$wk7['$t'];
                                            tempObj.wk8 = entry[x].gsx$wk8['$t'];
                                            tempObj.total = entry[x].gsx$total['$t'];
                                        } 
                                        else if(category === "standings"){
                                            tempObj.team = entry[x].gsx$team['$t'];    
                                            tempObj.avg = entry[x].gsx$avg['$t'];
                                            tempObj.total = entry[x].gsx$total['$t'];
                                            tempObj.high = entry[x].gsx$high['$t'];
                                            tempObj.pint = entry[x].gsx$pint['$t'];
                                            tempObj.bid = entry[x].gsx$bid['$t'];
                                        } 
                                        else {
                                            tempObj.team = entry[x].gsx$team['$t'];    
                                            tempObj.total = entry[x].gsx$total['$t'];
                                            tempObj.wk1 = entry[x].gsx$wk1['$t'];
                                            tempObj.wk2 = entry[x].gsx$wk2['$t'];
                                            tempObj.wk3 = entry[x].gsx$wk3['$t'];
                                            tempObj.wk4 = entry[x].gsx$wk4['$t'];
                                            tempObj.wk5 = entry[x].gsx$wk5['$t'];
                                            tempObj.wk6 = entry[x].gsx$wk6['$t'];
                                            tempObj.wk7 = entry[x].gsx$wk7['$t'];
                                            tempObj.wk8 = entry[x].gsx$wk8['$t'];
                                            tempObj.played = entry[x].gsx$played['$t'];
                                        }

                                    data.entry.push(tempObj);

                                }   
                                    $statsContent.empty().append(template(data)).fadeIn();
                            }
                            else{
                                $( $statsContent ).hide();
                                $statsContent.empty();
                                $("<table><tr><td colspan='10' style='width:900px;text-align:center'>No one yet! Why don't YOU be the first?</td></tr></table>").appendTo($statsContent);
                                $( $statsContent ).fadeIn();
                            }
                            


                        // $log.log("data", data);
                        // $log.log("time to render");


                    })
                }

            }
            $scope.createDivisionSelectBox = function(){
                var league = $('#league').val(),
                    division = $scope.keys[league],
                    $division = $("#division"),
                    lenArr   = [];
                    
                    $division.empty();

                    for (var x in division){
                        lenArr.push(x);
                        $division.append('<option value="'+x+'">'+$scope.dayOfWeekObj[x]+'</option>');
                    }
                    
                    if (lenArr.length !== 1){
                        $division.prepend('<option value="">--Select Division--</option>'); 
                    }



            }
            $scope.alertMe = function(){
                alert("boom");
            }
            $scope.loadStats = function(){
                $log.log($scope.leagues);
                $log.log($scope.category);
            }
        }