sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"IXActivityMonitor/libs/moment"
], function (Controller, MessageToast, JSONModel, Export, exportCSV) {
	"use strict";

	return Controller.extend("IXActivityMonitor.controller.View1", {
		onInit: function () {
			this.mainData = {
				activitiesCollection: [],
				durations: []

			};
			this.mainModel = new JSONModel(this.mainData);
			this.getView().setModel(this.mainModel);
			this.mainModel.refresh(true);
			// this.getView().bindElement({
			// 	path: "/"
			// });
			this.fetchData();
		},
		fetchData: function () {

			var self = this;
			var url = "/IXActivityMonitorXSJS/get_ix_activities.xsjs";
			this.mainModel.loadData(url);
			this.mainModel.attachRequestCompleted(
				function (oData) {
					var durations = [];

					/*this.getData().Activities.forEach(function(item) {
						item.StartTime = moment(item.StartTime);
						if (item.EndTime == null) {
							item.EndTime = moment(new Date()).format('YYYY-MM-DD');
						} else {
							item.EndTime = moment(item.EndTime).format('YYYY-MM-DD');
						}*/
					this.getData().Activities.forEach(function (item) {
						item.StartTime = new Date(item.StartTime);
						if (item.EndTime == null) {
							item.EndTime = "-";
						} else {
							item.EndTime = new Date(item.EndTime);
						}
						// var diffTime = Math.abs(item.EndTime.getTime() - item.StartTime.getTime());
						// var diffDate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
						// durations.push({
						// 	"location": item.RoomName,
						// 	"time": item.PresentationName + ""
						// });

					});
					self.getChartData(self.mainModel.getData().Activities);
					self.mainData.mainList = self.mainModel.getData().Activities.slice(0);

					self.getView().getModel().setProperty('/durations', durations);
					self.createChart();
					self.mainModel.refresh(true);
				});
			// var oModelDetail = new sap.ui.model.odata.ODataModel(url, true);
			// var oEntityPath = "";

			// oModelDetail.read(oEntityPath, null, {

			// 	}, false, function(oData, oResponse) {
			// 		var user = JSON.parse(oResponse.body);
			// 		self.userId = user.id;
			// 	}

			// );

		},
		getChartData: function (array) {
			var self = this;
			var chartData = [];
			this.filterData = array;
			var locations = array.map(item => item.RoomName)
				.filter((value, index, self) => self.indexOf(value) === index)
			var res = array.reduce(function (obj, v) {
				obj[v.RoomName] = (obj[v.RoomName] || 0) + 1;
				return obj;
			}, {})
			locations.forEach(function (item) {
				chartData.push({
					location: item,
					count: res[item]
				});
			})
			self.mainModel.setProperty('/chartData', chartData);
			var mainLoc = self.mainModel.getProperty('/mainLoc');
			if (!mainLoc) {
				var locdata = JSON.stringify(chartData);
				var sParse = JSON.parse(locdata);
				self.mainModel.setProperty('/mainLoc', sParse)
			}

		},
		checkLocation: function (event) {
			var val = this.getView().byId('lCombo').getValue()
			var loc = this.mainModel.getData().mainLoc.filter(function (item) {
				return item.location == val;
			});
			if (loc.length == 0) {
				MessageToast.show("Enter Valid Location");
				event.getSource().setValue('');
			}
		},
		onFilter: function (flg) {
			var self = this;
			var filters = [];

			this.table = this.getView().byId('ixTable');
			// if(flg != 'X'){
			// if (self.getView().byId('lCombo').getSelectedItem()) {
			// 	var loc = self.getView().byId('lCombo').getSelectedItem().getText();
			// } else {
			// 	var loc = "";
			// }
			// if(moment(self.getView().byId('sDate').getDateValue())._isValid){
			// 	var sVal = moment(self.getView().byId('sDate').getDateValue()).format('DD-MM-YYYY');
			// }else{
			// 	var sVal = null;
			// }
			// 	if(moment(self.getView().byId('eDate').getDateValue())._isValid){
			// 	var eVal = moment(self.getView().byId('eDate').getDateValue()).format('DD-MM-YYYY');
			// }else{
			// 	var eVal = null;
			// }
			// // var loc=  self.getView().byId('sDate').getDateValue()
			// var Filter1 = new sap.ui.model.Filter({
			// 	path: "RoomName",
			// 	operator: sap.ui.model.FilterOperator.EQ,
			// 	value1: loc
			// });
			// var Filter2 = new sap.ui.model.Filter({
			// 	path: "StartTime",
			// 	operator: sap.ui.model.FilterOperator.GE,
			// 	value1: sVal
			// });
			// var Filter3 = new sap.ui.model.Filter({
			// 	path: "EndTime",
			// 	operator: sap.ui.model.FilterOperator.LE,
			// 	value1: eVal
			// });
			// var allFilter = new sap.ui.model.Filter({
			// 	filters: [Filter1, Filter2, Filter3],
			// 	and: false
			// });

			// // filters.push(allFilter);
			// // if(loc != ""){
			// // this.table.getBinding("items").filter(Filter1);
			// // }
			// // 	if(sVal !=null){
			// // this.table.getBinding("items").filter(Filter2);
			// // }
			// // 	if(eVal !=null){
			// // this.table.getBinding("items").filter(Filter3);
			// // }

			// }else{
			// this.table.getBinding("items").filter();	
			// }

			// var input = document.getElementById("myInput");
			if (this.getView().byId('lCombo').getValue()) {
				var filter = this.getView().byId('lCombo').getValue()
					// var fArray = this.mainModel.getData().Activities.filter(function(item){return item.RoomName == filter; }) 

			}
			var sfilter = this.getView().byId('sDate').getDateValue();
			var efilter = this.getView().byId('eDate').getDateValue();
			if (sfilter > efilter && efilter != null) {
				new sap.m.MessageToast.show("End Date cann't be lesser than Start Date")
			}
			if (efilter == null) {
				efilter = new Date();
			}
			if (sfilter != null) {
				var dArray = this.mainData.mainList.filter(function (item) {
					return new Date(item.StartTime).setHours(0, 0, 0, 0) >= Date.parse(sfilter) && new Date(item.EndTime).setHours(0, 0, 0, 0) <=
						Date.parse(efilter);
				});
				if (filter) {
					var fArray = dArray.filter(function (item) {
						return item.RoomName == filter;
					})
				} else {
					var fArray = dArray;
				}
			} else
			if (sfilter == null) {
				var dArray = this.mainData.mainList.filter(function (item) {
					return new Date(item.EndTime).setHours(0, 0, 0, 0) <=
						Date.parse(efilter);
				});
				if (filter) {
					var fArray = dArray.filter(function (item) {
						return item.RoomName == filter;
					})
				} else {
					var fArray = dArray;
				}
			} else if (filter) {
				var fArray = this.mainModel.getData().Activities.filter(function (item) {
					return item.RoomName == filter;
				})

			} else {
				var fArray = this.mainData.mainList.slice(0);
			}
			if (filter) {
				filter = filter.toUpperCase();
			}
			this.getChartData(fArray);
			this.mainModel.setProperty('/Activities', fArray);

		},
		createChart: function () {
			// var chartData = new sap.ui.model.json.JSONModel(this.mainData);
			// var oVizFrame = this.getView().byId("vizFrame");
			// oVizFrame.setVizProperties({
			// 	plotArea: {
			// 		colorPalette: d3.scale.category20().range(),
			// 		dataLabel: {
			// 			showTotal: true
			// 		}
			// 	},
			// 	tooltip: {
			// 		visible: true
			// 	},
			// 	title: {
			// 		text: "Stacked Bar Chart"
			// 	}
			// });
			// var oDataset = new sap.viz.ui5.data.FlattenedDataset({
			// 	dimensions: [{
			// 		name: "Location",
			// 		value: "{location}"
			// 	}],

			// 	measures: [ {
			// 		name: "Times",
			// 		value: "{time}"
			// 	}],

			// 	data: {
			// 		path: "/durations"
			// 	}
			// });
			// oVizFrame.setDataset(oDataset);

			// oVizFrame.setModel(chartData);
			// var	oFeedValueAxis2 = new sap.viz.ui5.controls.common.feeds.FeedItem({
			// 			"uid": "valueAxis",
			// 			"type": "Measure",
			// 			"values": ["location"]
			// 		}),

			// oFeedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
			// 			"uid": "categoryAxis",
			// 			"type": "Dimension",
			// 			"values": ["location"]
			// 		});

			// 	oVizFrame.addFeed(oFeedValueAxis2);
			// 	oVizFrame.addFeed(oFeedCategoryAxis);

		},
		onClear: function () {
			this.getView().byId('lCombo').setSelectedKey('')
			this.getView().byId('sDate').setDateValue()

			this.getView().byId('eDate').setDateValue();
			this.onFilter('X');
		},
		onExport: function () {
			// getting model into oModel variable.
			this.filterData.sort(function (a, b) {
				a = new Date(a.StartTime);
				b = new Date(b.StartTime);
				return a > b ? -1 : a < b ? 1 : 0;
			});
			console.log(this.filterData);

			var oModel = new JSONModel({
				Result: this.filterData
			});
			var oExport = new Export({
				exportType: new exportCSV({
					charset: "utf-8",
					fileExtension: "csv",
					separatorChar: ",",
					mimeType: "application/csv"
				}),
				models: oModel,

				rows: {
					path: "/Result"
				},
				columns: [{
					name: "ID",
					template: {
						content: "{id}"
					},
				}, {
					name: "Location",
					template: {
						content: "{RoomName}"
					}
				}, {
					name: "Start Time",
					template: {
						content: "{StartTime}"
					}
				}, {
					name: "Presentation Id",
					template: {
						content: "{PresentationId}"
					}
				}, {
					name: "Presentation Name",
					template: {
						content: "{PresentationName}"
					}
				}, {
					name: "Creator",
					template: {
						content: "{PresentationOwner}"
					}
				}, {
					name: "End Time",
					template: {
						content: "{EndTime}"
					}
				}, {
					name: "COID",
					template: {
						content: "{COID}"
					}
				}]
			});
			oExport.saveFile().catch(function (oError) {
				sap.m.MessageToast.show("Generate is not possible beause no model was set");
			}).then(function () {
				oExport.destroy();
			});
		},

		onExport1: function () {
			var self = this;
			// Convert Object to JSON
			this.filterData.sort(function (a, b) {
				a = new Date(a.StartTime);
				b = new Date(b.StartTime);
				return a > b ? -1 : a < b ? 1 : 0;
			});
			var jsonObject = JSON.stringify(this.filterData);
			var sortJson = jsonObject;
			var obj = {
				id: "ID",
				r: "Location",
				s: "Start Time",
				p: "Presentation ID",
				pname: "Presentation Name",
				ow: "Creator",
				e: "End Time",
				od: "COID"
			}
			var c = JSON.parse(jsonObject);
			c.unshift(obj);
			jsonObject = JSON.stringify(c);
			var csv = self.convertCsv(jsonObject);
			var encodedUri = encodeURI(csv);
			var link = document.createElement("a");
			link.href = 'data:text/csv,' + encodeURIComponent(csv);
			link.download = "Ix Activities.csv";
			link.click();
			// document.body.appendChild(link); // Required for FF

			// link.click(); // This will download the data file named "my_data.csv".

			//           var encodedUri = encodeURI(csv);
			//           var blob = new Blob([csvContent],{
			//     type: "text/csv;charset=utf-8;"
			// });
			//var csv = ConvertToCSV(jsonObject);

			// window.open("data:text/csv;charset=utf-8," + escape(csv));

		},
		validatedate: function (inputText) {
			var dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
			// Match the date format through regular expression
			if (inputText.value.match(dateformat)) {
				document.form1.text1.focus();
				//Test which seperator is used '/' or '-'
				var opera1 = inputText.value.split('/');
				var opera2 = inputText.value.split('-');
				lopera1 = opera1.length;
				lopera2 = opera2.length;
				// Extract the string into month, date and year
				if (lopera1 > 1) {
					var pdate = inputText.value.split('/');
				} else if (lopera2 > 1) {
					var pdate = inputText.value.split('-');
				}
				var dd = parseInt(pdate[0]);
				var mm = parseInt(pdate[1]);
				var yy = parseInt(pdate[2]);
				// Create list of days of a month [assume there is no leap year by default]
				var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				if (mm == 1 || mm > 2) {
					if (dd > ListofDays[mm - 1]) {
						alert('Invalid date format');
						return false;
					}
				}
				if (mm == 2) {
					var lyear = false;
					if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
						lyear = true;
					}
					if ((lyear == false) && (dd >= 29)) {
						alert('Invalid date format');
						return false;
					}
					if ((lyear == true) && (dd > 29)) {
						alert('Invalid date format');
						return false;
					}
				}
			} else {
				alert("Invalid date format");
				document.form1.text1.focus();
				return false;
			}
		},

		sChange: function (event) {
			var value = event.getParameters().dateValue;
			var s = value;
			var e = this.getView().byId('eDate').getDateValue();
			if (value > new Date()) {
				MessageToast.show("Cannot filter on Future Dates");
				event.getSource().setValue('')
			}
			if (value) {

				if (e != null && s != null) {
					if (s > e) {
						MessageToast.show("End Date cannot be lesser than Start Date");
						event.getSource().setValue('')
					}
				}
			} else {
				MessageToast.show("Invalid date format");
				event.getSource().setValue('')
			}
			// }else{
			// 	MessageToast.show("Future Date Not possible!");
			// }

		},
		eChange: function (event) {
			var value = event.getParameters().dateValue;
			var s = this.getView().byId('sDate').getDateValue();
			var e = value;

			if (value) {
				if (value <= new Date()) {
					if (e != null && s != null) {
						if (e < s) {
							MessageToast.show("End Date cannot be lesser than Start Date");
							event.getSource().setValue('')
						}
					}
				} else {
					MessageToast.show("Cannot filter on Future Dates");
					event.getSource().setValue('')
				}
			} else {
				MessageToast.show("Invalid date format");
				event.getSource().setValue('')
			}

		},
		convertCsv: function (objArray) {
			var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
			var str = '';

			for (var i = 0; i < array.length; i++) {
				var line = '';
				for (var index in array[i]) {
					if (index != '') {
						line += array[i][index];
						line += ',';

					}
				}

				str += line + '\r\n';
			}

			return str;
		}
	});

});