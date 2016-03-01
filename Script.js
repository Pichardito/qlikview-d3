init();

function init() {
Qva.LoadScript("/QvAjaxZfc/QvsViewClient.aspx?public=only&name=Extensions/KPI Container/d3.js", function()
{
		Qva.AddExtension('KPI Container', function()
		{
			Qva.LoadCSS("/QvAjaxZfc/QvsViewClient.aspx?public=only&name=Extensions/KPI Container/style.css");
			
			_containerThis = this;
			//clear out HTML from previous iteration.
			this.Element.innerHTML="";
			//create empty html element. this will be filled and eventually used to populate innerHTML
			var html = "";
			//define common row height for all data rows.
			var rowHeight = 50;
			
			var tblData = [];
			_containerThis.Data.Rows.forEach(assignColHeaders);
			function assignColHeaders(element,index)
			{
				tblData[index] = 
				{
					Dim1:element[0].text
					,RPImage:element[1].text
					,RPName:element[2].text
					,OverallScore:element[3].text
					,TrendChange:element[4].text
					,Trend:element[5].text
					,StatusProgressConfig:element[6].text
					,GaugeActual:element[7].text
					,GaugeConfig:element[8].text
					,MetricClass:element[9].text
					,UserID:element[10].text
				};
			}
			
			
			
			var tblProperties = 
			{
				DimensionLabel:_containerThis.Layout.Text0.text
				,QVS:_containerThis.Layout.Text1.text
				,QVWName:_containerThis.Layout.Text2.text
				,StatusProgressFlag:_containerThis.Layout.Text3.text
				,GaugeFlag:_containerThis.Layout.Text4.text
				,MetricClassFlag:_containerThis.Layout.Text5.text
				,DBDimensionField:_containerThis.Layout.Text6.text
				,DBUserIDField:_containerThis.Layout.Text7.text
				,DBDatetimeField:_containerThis.Layout.Text8.text
				,DBSynthesisField:_containerThis.Layout.Text9.text
				,DBName:_containerThis.Layout.Text10.text
				,DBTableName:_containerThis.Layout.Text11.text
				,DBConnectionString:_containerThis.Layout.Text12.text
				,WebserviceURL:_containerThis.Layout.Text13.text
				,ColorGreen:_containerThis.Layout.Text14.text
				,ColorAmber:_containerThis.Layout.Text15.text
				,ColorRed:_containerThis.Layout.Text16.text
				,UpperThreshold:_containerThis.Layout.Text17.text
				,LowerThreshold:_containerThis.Layout.Text18.text
			}
			
			
			
			//create list of header names, this will be looped over to create each column
			var tableHeaders = [tblProperties.DimensionLabel,"Responsible Party","Overall Score","Trend Last 12 Months","Status Summary","Status Progress","Metric Class","Synthesis"];
			//store list of css classes, assigned to each column to assign properties
			var tableFormatting = ["metricname","responsibleparty","overallscore","trend","statusprogress","gauge","metricclass","synthesis"];
			//store column widths. these will be calculated for each column manually rather than in the css 
			//so that the column widths can be passed on to the d3 charts.
			var columnWidths = [.1,.15,.15,.1,.15,.1,.15,.15];
			
			//get qv object id to be used for objects to use in html element ids. this allows for multiple copies of this object to exist on screen at once.
			var objectID = this.Layout.ObjectId;
					
			//Create and Populate HTML table
			var headerWidth = _containerThis.GetWidth();
			//headerWidth is % of width of qv object - 16 (width of scroll bar). Need to account for scroll bar so headers line up with values.
			headerWidth = headerWidth-16;//((headerWidth-16)/headerWidth) * 100;
			html += '<table style = "width:' + headerWidth + 'px;" id = "headerTable">';
			
			//add headers
			//loop through tableHeaders and assign class and write content to div.
			html += '<tr class = "header">';
			for (var col = 0; col < tableHeaders.length; col++)
			{
				columnWidths[col] *= headerWidth;
				
				switch(col)
				{
					case 4:
					{
						if(tblProperties.GaugeFlag == 1)
						{
							html += '<th';
							html += ' class = "' + tableFormatting[col] + '"';
							html += ' style = "width:' + columnWidths[col] + 'px"';
							html += '>' + tableHeaders[col] + '</th>';
						}
						break;					
					}
					case 5:
					{
						if(tblProperties.StatusProgressFlag == 1)
						{
							html += '<th';
							html += ' class = "' + tableFormatting[col] + '"';
							html += ' style = "width:' + columnWidths[col] + 'px"';
							html += '>' + tableHeaders[col] + '</th>';
						}
						break;
					}
					case 6:
					{
						if(tblProperties.MetricClassFlag == 1)
						{
							html += '<th';
							html += ' class = "' + tableFormatting[col] + '"';
							html += ' style = "width:' + columnWidths[col] + 'px"';
							html += '>' + tableHeaders[col] + '</th>';
						}
						break;
					}
					default:
					{
						html += '<th';
						html += ' class = "' + tableFormatting[col] + '"';
						html += ' style = "width:' + columnWidths[col] + 'px"';
						html += '>' + tableHeaders[col] + '</th>';
						break;
					}
				}
			}
			html += '</tr>';
			html += '</table>';
			
			//create div container for table. tblContentDiv class has overflow property:auto so scroll bar will show when needed.		
			//height will be defined after table is drawn so we can account for header height in the scroll bar.
			html += '<div style = ';
			html += '"';
			html += 'width:' + _containerThis.GetWidth() + 'px;'
			html += '"';
			html += ' class = "tblContentDiv"';
			html += ' id = "contentTable"';
			//html += ' onload="javascript:whenFinishedLoading()"';
			html += '>';
					
			//create table.
			html += '<table style = "width:100%;font-size:13px;">';	
			
			//for testing - border = "1" adds border between all rows/columns
			//html += '<table style = "width:100%;font-size:13px;" border = "1">';	
		
			//http://stackoverflow.com/questions/16096872/how-to-sort-2-dimensional-array-by-column-value
			//is there a way we can do this and sort by the numeric value for metric name? Or do we need to have a sort column?
			//how to pass variable to sortFunction to tell it which column to sort by?
			//may not be necessary, but we have the option.
			//test = _containerThis.Data.Rows;
			//test.sort(sortFunction);
//			function sortFunction(a ,b) {
//				if (a[0].text === b[0].text) {
//					return 0;
//				}
//				else {
//					return (a[0].text < b[0].text) ? -1 : 1;
//				}
//			}
			//create html table content from data
			//loop through rows
			
			for (var row = 0; row < _containerThis.Data.TotalSize.y; row++)
			{
				html += '<tr class = "row">';
				//Loop through columns
				for (var col = 0; col < tableHeaders.length; col++)
				{
					//draw a different column based on the index of the current iteration.
					switch(col)
					{
						//Metric Name
						case 0:
						{
							html += '<td';
							//if user clicks on row, select the dimension value from the first column.
							html += ' onclick="_containerThis.Data.SearchColumn(0,_containerThis.Data.Rows[' + row + '][' + col + '].text,true)"';
							html += ' class = "' + tableFormatting[col] + '"';
							html += ' style = "width:' + columnWidths[col] + 'px"';
							html += '>';
							
							html += tblData[row].Dim1;
							
							html += '</td>';
							
							break;
						}
						//Responsible Party
						case 1:
						{
							html += '<td';
							html += ' onclick="_containerThis.Data.SearchColumn(0,_containerThis.Data.Rows[' + row + '][' + 0 + '].text,true)"';
							html += ' class = "' + tableFormatting[col] + '"';
							html += ' style = "width:' + columnWidths[col] + 'px"';
							html += ' style = "height:"' + rowHeight + ';"';
							html += '>';
							
							html += '<div style = "float:left;width:32px;margin-top:5px;">';
							//image is loaded from bundled image. this only works on the server (not in desktop). 
							var image = '"/QvAjaxZfc/QvsViewClient.aspx?datamode=binary&amp;name=qmem://'+ tblData[row].RPImage + '&host=QVS@' + tblProperties.QVS + '&slot=&stamp=0&view=' + tblProperties.QVWName + '"';
							html += '<img  src=' + image + ' width="32" height="32"/>';
							html += '</div>';
							
							//Write RP name to same cell as image.
							html += '<div style = "margin-left:32px;margin-top:12px;">';
							html += tblData[row].RPName;
							html += '</div>';
							html += '</td>';
							break;
						}
						//Overall Score
						case 2:
						{
							html += '<td';
							
							html += ' onclick="_containerThis.Data.SearchColumn(0,_containerThis.Data.Rows[' + row + '][' + 0 + '].text,true)"';
							html += ' class = "' + tableFormatting[col] + '"';
							html += ' style = "width:' + columnWidths[col] + 'px;"';
							html += '>';
														
							html += '<div style = "float:left;width:10px;margin-top:15px;">';
							html += tblData[row].OverallScore;
							html += '</div>';
							
							html += '<div style = "margin-left:32px"';
							html += ' id="overallscore_' + row + objectID + '">';
							html += '</div>';
							
							html += '</td>';
							break;
						}
						//Trend
						case 3:
						{
							html += '<td';
							html += ' onclick="_containerThis.Data.SearchColumn(0,_containerThis.Data.Rows[' + row + '][' + 0 + '].text,true)"';
							html += ' class = "' + tableFormatting[col] + '"';
							html += ' style = "width:' + columnWidths[col] + 'px"';
							html += ' align = "left" style = "padding-top:0px;padding-bottom:0px;"';
							html += '>';
							html += '<div style = "float:left;margin-top:' + (rowHeight/2 - 5) + 'px;">';
							html += tblData[row].TrendChange;
							html += '</div>';
							
							html += '<div style = "margin-left:25px;"';
							html += 'id = "trend_' + row + objectID +  '"';
							html += '>';
														
							html += '</div>';
							
							html += '</td>';
							
							break;
						}
						
						
						//Gauge
						case 4:
						{
							if(tblProperties.GaugeFlag == 1)
							{
								html += '<td';
								html += ' onclick="_containerThis.Data.SearchColumn(0,_containerThis.Data.Rows[' + row + '][' + 0 + '].text,true)"';
								html += ' class = "' + tableFormatting[col] + '"';
								html += ' style = "width:' + columnWidths[col] + 'px"';
								html += '>';
								
								// html += '<div ';
								// html += 'style = "float:left;margin-top:19px;margin-left:10px;" ';
								
								// html += '>';
								//html += tblData[row].GaugeActual.split("/")[0];
								// html += '</div>';
								
								html += '<div id = "bullet_' + row  + objectID + '"';
								html += ' class = "gaugechart"';
								html += '>';
								html += '</div>';
								html += '</td>';
							}
							break;
						}
						//Status Progress Config
						case 5:
						{
							if(tblProperties.StatusProgressFlag == 1)
							{
								html += '<td';
								html += ' onclick="_containerThis.Data.SearchColumn(0,_containerThis.Data.Rows[' + row + '][' + 0 + '].text,true)"';
								html += ' class = "' + tableFormatting[col] + '"';
								html += ' style = "width:' + columnWidths[col] + 'px"';
								html += '>';
								html += '<div id = "statusprogress_' + row +  objectID + '"';
								html += '</div>';
								html += '</td>';
							}
							break;
						}
						
						//Metric Class
						case 6:
						{
							if(tblProperties.MetricClassFlag == 1)
							{
								html += '<td';
								html += ' onclick="_containerThis.Data.SearchColumn(0,_containerThis.Data.Rows[' + row + '][' + 0 + '].text,true)"';
								html += ' class = "' + tableFormatting[col] + '"';
								html += ' style = "width:' + columnWidths[col] + 'px"';
								html += '>';
								html += tblData[row].MetricClass;
								
								html += '</td>';
							}
							break;
						}
						//Synthesis
						case 7:
						{
							html += '<td';
							//html += ' onclick="_containerThis.Data.SearchColumn(0,_containerThis.Data.Rows[' + row + '][' + 0 + '].text,true)"';
							html += ' class = "' + tableFormatting[col] + '"';
							html += ' style = "width:' + columnWidths[col] + 'px"';
							html += '>';
							//html += '<textarea id = "synthesis_' + row + objectID.replace('\\','') + '" style="FONT-FAMILY: sans-serif; width:90%;height:100%;"></textarea>'
							html += '<div id = "synthesis_' + row + objectID.replace('\\','') + '"></div>';
							
							html += '</td>';
							break;
						}
						default:
						{
							break;
						}
					}
				}
				html += '</tr>';
			}
			html += '</table>';
			html += '</div>';
			
			//Draw html to qv object.
			_containerThis.Element.innerHTML = html;
						
			whenFinishedLoading();
	
			
			function whenFinishedLoading()
			{
				//Below will update the existing html table.
				
				//set height of content table based, remove height of header row so scroll bar only goes to end of table.
				//var headerHeight = document.getElementById("headerTable").offsetHeight;
				var headerHeight = 30;
				var contentHeight = (_containerThis.GetHeight() - headerHeight) + "px";
				document.getElementById("contentTable").style.height = contentHeight;
				
				//Loop through rows and draw special charts to necessary cells based on div id.
				for (var row = 0; row < _containerThis.Data.TotalSize.y; row++)
				{			
				
					//draw overall score dots
					
					var scoreData = tblData[row].OverallScore.split("/");
					
					//drawOverallScore(_containerThis,"overallscore_"+row+objectID,scoreData[0],scoreData[1],columnWidths[2]);
					drawOverallScore(_containerThis,"overallscore_"+row+objectID,scoreData[0],10,columnWidths[2]);
					
					//draw line chart
					var lineData = tblData[row].Trend.split(",");					
					
					drawLineChart(_containerThis,"trend_"+row+objectID,lineData,columnWidths[3]);
					
					//draw gauge
					if(tblProperties.GaugeFlag == 1)
					{
						var actualData = tblData[row].GaugeActual;
						var gaugeData = tblData[row].GaugeConfig.split(",");
						drawGaugeChart(_containerThis,"bullet_"+row+objectID,gaugeData,actualData,columnWidths[4]);
					}
					
					//draw Stacked Area Chart
					if(tblProperties.StatusProgressFlag == 1)
					{			
						var stackedData = tblData[row].StatusProgressConfig.split(",");						
						stackedData = stackedData.map(function(d) { return +d; });
						
						drawStackAreaChart(_containerThis,"statusprogress_"+row+objectID,stackedData,columnWidths[5]);						
					}

					readSynthesisValue(
						'#synthesis_' + row + objectID.replace('\\','')
						,tblData[row].Dim1
						,tblProperties.DBDimensionField
						,tblProperties.DBUserIDField
						,tblProperties.DBDatetimeField
						,tblProperties.DBSynthesisField
						,tblProperties.DBName
						,tblProperties.DBTableName
						,tblProperties.DBConnectionString
						,tblProperties.WebserviceURL + '/Service.svc/ReadData'
					);
				}
			}
			
			//clear out tblData variable. this may not be necessary,
			//but I wanted to avoid keeping a duplicate copy of the table data in memory.
			tblData = [];
			tblProperties = [];
						
			function readSynthesisValue(
				divID
				,dimValue
				,dimDBFieldName
				,updateUserIDDBFieldName
				,updateDatetimeDBFieldName
				,synthesisDBFieldName
				,DBName
				,DBTableName
				,DBConnectionString
				,webserviceURL
			)
			{
				var returnValue = "Could not connect to service.";
				
				var query = 
					"SELECT DISTINCT"
					+ " ms." + synthesisDBFieldName
					+ " FROM[" + DBName + "].[dbo].[" + DBTableName + "]"
					+ " ms"
					+ " ,("
					+ " SELECT"
					+ " msMax." + dimDBFieldName
					+ " , max(msMax." + updateDatetimeDBFieldName + ") as MAX_" + updateDatetimeDBFieldName
					+ " FROM [" + DBName + "].[dbo].[" + DBTableName + "]"
					+ " msMax"
					+ " GROUP BY msMax." + dimDBFieldName
					+ " ) subquery"
					+ " WHERE"
					+ " subquery." + dimDBFieldName + " = '" + dimValue + "'"
					+ " AND subquery." + dimDBFieldName + " = ms." + dimDBFieldName
					+ " AND subquery.MAX_" + updateDatetimeDBFieldName + " = ms." + updateDatetimeDBFieldName
				;

				var data = {
					"QUERY":query
					,"CONNECTION_STRING": DBConnectionString
				}; //This concatenates our information in SQLEntry structure which can then be serialized to json
				
				$.ajax({
					url: webserviceURL, //This is the URL to your WebService. Please adjust it, especially be careful with the port.
					contentType: "application/json", //Defines that the content will be sent as a json string
					type: "POST",
					data: JSON.stringify(data), //Data is beeing serialized into JSON before sending
					// work with the response, the response variable is the boolean answer from the Webservice
					success: function(response) 
					{
						$(divID).html(response);
					},
					error: function (xhr) 
					{ 
						$(divID).html("Server error - not able to return data"); 
					} //This is the message if the POST has failed and the WebService didn't receive the data. Make sure to run the WebService!
				})
				return returnValue;
			}
			
			function drawLineChart(_containerThis,divID,data,divWidth)
			{
				//https://gist.github.com/benjchristensen/2579599				
				// define dimensions of graph
				var m = [5, 0, 5, 0]; // margins
				//var div = document.getElementById(divID);
				//var divWidth = div.offsetWidth
				var w = (divWidth - m[1] - m[3]);//(_containerThis.GetWidth() - m[1] - m[3]);
				var h = rowHeight;// - m[0] - m[2];

				// create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
				//data = [3, 6, 2, 7, 5, 2, 0, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7];
				// X scale will fit all values from data[] within pixels 0-w
				var x = d3.scale.linear().domain([0, data.length]).range([0, w]);
				// Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
				var y = d3.scale.linear().nice().domain([0, Math.max.apply(Math, data)]).range([h, 0]);
				// automatically determining max range can work something like this
				// var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);
				// create a line function that can convert data[] into x and y points
				var line = d3.svg.line()
					// assign the X function to plot our line as we wish
					.x(function(d,i) {
						// verbose logging to show what's actually being done
						//('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
						// return the X coordinate where we want to plot this datapoint
						return x(i); 
					})
					.y(function(d) {
						// verbose logging to show what's actually being done
						//alert('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
						// return the Y coordinate where we want to plot this datapoint
						return y(d); 
					})
					//smooth curves
					//.interpolate("basis")
					//jagged curves
					.interpolate("linear")
				;
				
				// Add an SVG element with the desired dimensions and margin.
				var svg = d3.select(document.getElementById(divID)).append("svg:svg")
							.attr("width", w + 10)
							.attr("height", h)
						.append("svg:g")
							.attr("transform", "translate(" + m[0] + "," + m[1] + ")")
				;
				
				var target = d3.svg.line()
					// assign the X function to plot our line as we wish
					.x(function(d,i) {
						// verbose logging to show what's actually being done
						//('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
						// return the X coordinate where we want to plot this datapoint
						return x(i); 
					})
					.y(function(d,i) {
						// verbose logging to show what's actually being done
						//('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
						// return the X coordinate where we want to plot this datapoint
						return y(tblProperties.UpperThreshold); 
					})
				;
								
				// create yAxis
				//var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
				// Add the x-axis.
				/*svg.append("svg:g")
					  .attr("class", "x axis")
					  .attr("transform", "translate(0," + h + ")")
					  .call(xAxis);*/
				// create left yAxis
				//var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
				// Add the y-axis to the left
				/*
				svg.append("svg:g")
					  .attr("class", "y axis")
					  .attr("transform", "translate(-25,0)")
					  .call(yAxisLeft)
				;*/
				
				svg.append("svg:path").attr("d", target(data))
					.attr("fill","none")
					.attr("stroke","#d3d3d3")
					.style("stroke-dasharray",("5,5"))
				;
				
				// Add the line by appending an svg:path element with the data line we created above
				// do this AFTER the axes above so that the line is above the tick-lines
				svg.append("svg:path").attr("d", line(data))
					.attr("fill","none")
					.attr("stroke","#7e7e7e")
				;
				
				
				var circles = svg.selectAll("circle")
						.data(data)
					.enter()
						.append("circle")
						.attr("cx",
							function(d,i)
							{
								return x(i);
							}
						)
						.attr("cy",
							function(d)
							{
								return y(d);
							}
						)
						.attr("r",2.5)
						.attr("fill",
							function(d,i)
							{
								if(i == 0 || i == data.length-1)
								{
									if(d < tblProperties.LowerThreshold)
									{
										return tblProperties.ColorRed;
									}
									else
									{
										if(d < tblProperties.UpperThreshold)
										{
											return tblProperties.ColorAmber;
										}
										else
										{
											
											return tblProperties.ColorGreen;
										}
									}
								}
								else
								{
									return "none";
								}
							}
						)
						.attr("stroke",
							function(d,i)
							{
								if(i == 0 || i == data.length-1)
								{
									return "gray";
								}
								else
								{
									return "none";
								}
							}
						)
					;		
			}
			
			function drawOverallScore(_containerThis,divID,value,total,divWidth)
			{
				// define dimensions of graph
				var m = [0,30,0,0]; // margins
				
				//var div = document.getElementById(divID);
				//var divWidth = div.offsetWidth;
				
				var width = (divWidth - m[1] - m[3] - 15);
				var height = rowHeight - m[0] - m[2];
				var radius = width/10/2;
				
				var svg = d3.select(document.getElementById(divID)).append("svg")
					.attr("width",width+20)
					.attr("height",height);
					
				var lastFilledDot;
				
				var color;
				
				if(value < tblProperties.LowerThreshold)
				{
					color = tblProperties.ColorRed;
				}
				else
				{
					if(value < tblProperties.UpperThreshold)
					{
						color = tblProperties.ColorAmber;
						
					}
					else
					{
						color = tblProperties.ColorGreen;
					}
				}
				
				for(var i = 0; i < value; i ++)
				{
					var cx = (radius + 1) * i * 2 + radius;//radius;// + i*11;
					var circle = svg.append("circle")
						.attr("cx",cx)
						.attr("cy",height/2)
						.attr("r",radius)
						.attr("fill",color)
						.attr("stroke","gray");
						
					lastFilledDot = i;
				}
				
				for(var i = lastFilledDot+1; i < total; i ++)
				{
					var cx = (radius + 1) * i * 2 + radius;
					var circle = svg.append("circle")
						.attr("cx",cx)
						.attr("cy",height/2)
						.attr("r",radius)
						.attr("fill","none")
						.attr("stroke","gray")
						;
				}
			}
			
			
			function drawGaugeChart(_containerThis,divID,data,actualData,divWidth)
			{
				var margin = {top: 10, right: 60, bottom: 10, left: 30};
				//var div = document.getElementById(divID);
				//var divWidth = div.offsetWidth;
				var width = divWidth - margin.right;//_containerThis.GetWidth() * .1;//_containerThis.GetWidth();// - margin.left - margin.right;//960 - margin.left - margin.right,
				var height = rowHeight;//_containerThis.GetHeight() * .2;//_containerThis.GetHeight();// - margin.top - margin.bottom;//500 - margin.top - margin.bottom;
				
				var svg = d3.select(document.getElementById(divID)).append("svg")
					.attr("width",width)
					.attr("height",height)
				;
								
				//Calculate running width so each piece can be appended at the correct x coordinate
				var runningWidth = 0;
				
				//loop through rows and append bar with correct width % and color
				for (var row = 0; row < data.length; row++)
				{
					var barColor = data[row].split("/")[1];
					var barWidth = data[row].split("/")[0] * width;
					
					var rect = svg.append("rect")
						.attr("x",runningWidth)
						.attr("y",17)
						.attr("width",barWidth)
						.attr("height",15)
						.attr("fill",barColor)
					;
					
					runningWidth += barWidth;
				}
				
				
				//Gauge Outline
				var rect = svg.append("rect")
					.attr("x",0)
					.attr("y",17)
					.attr("width",width)
					.attr("height",15)
					.attr("fill","none")
					.attr("stroke","gray")
				;
			}
			
			function drawStackAreaChart(_containerThis,divID,data,divWidth)
			{
				var m = [5, 0, 5, 0];
			    
					
				var barWidth = 10;
				
				var height = rowHeight;

				var newData = data.map(function(d, i) {
				  return { value: d, group: i%3 };
				});

				var nest = d3.nest()
					.key(function(d) { return d.group; });


				//The stack layout takes an array of layer objects, each having a series (array) of point objects as a member. 
				var stack = d3.layout.stack()
					.offset("zero")
					.values(function(d) { return d.values; })
					.x(function(d, i) { return i; })
					.y(function(d) { return d.value; });

				//Constructs a new linear scale with the default domain [0,1] and the default range [0,1]. Thus, the default linear scale is equivalent to the identity function for numbers	
				var x = d3.scale.linear()
					.range([barWidth, divWidth-barWidth]);

				var y = d3.scale.linear()
					.range([height, 0]);
				
				var color = [];
				color.push(tblProperties.ColorGreen, tblProperties.ColorAmber, tblProperties.ColorRed);

				//Constructs a new area generator with the default x-, y0- and y1-accessor functions (that assume the input data is a two-element array of numbers; see below for details), and linear interpolation. 
				var area = d3.svg.area()
					.x(function(d, i) { return x(i); })
					.y0(function(d) { return y(d.y0); })
					.y1(function(d) { return y(d.y0 + d.y); });
					
				var layersData = stack(nest.entries(newData));

				var svg = d3.select(document.getElementById(divID)).append("svg")
					.attr("width", divWidth)
					.attr("height", height)
				  .append("g")
					.attr("transform", "translate(" + m[0] + "," + m[1] + ")");

				  x.domain([0, layersData[0].values.length - 1]);
				  y.domain([0, 100]);
				  
				  svg.selectAll("rect.left")
					.data(layersData.map(function(d) { return d.values[0]; }))
					.enter()
					.append("rect")
					.attr("class", "left")
					.attr("x", 0)
					.attr("y", function(d) { return y(d.y0 + d.y); })
					.attr("width", barWidth)
					.attr("height", function(d) { return y(d.y0) - y(d.y + d.y0); })
					.attr("fill", function(d, i) { return color[i]; });
					
				  svg.selectAll("rect.right")
					.data(layersData.map(function(d) { return d.values[1]; }))
					.enter()
					.append("rect")
					.attr("class", "right")
					.attr("x", divWidth-barWidth)
					.attr("y", function(d) { return y(d.y0 + d.y); })
					.attr("width", barWidth)
					.attr("height", function(d) { return y(d.y0) - y(d.y + d.y0); })
					.attr("fill", function(d, i) { return color[i]; })

				  var layers = svg.selectAll(".layer")
					  .data(layersData)
					.enter().append("g")
					  .attr("class", "layer");
					
					 layers.append("path")
					   .attr("class", "area")
					   .attr("d", function(d) { return area(d.values); })
                       .style("opacity", 0.5)
					   .style("fill", function(d, i) { return color[i]; });
			
			
			}
			
		}, true);
	});
}