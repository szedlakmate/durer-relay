//global variables
var sheetName = "";

//onload fnction creates menu
function onOpen() {
   SpreadsheetApp.getUi()
       .createMenu('Dürer Menu')
       .addItem('Bevitel indít','durerGUI')
       .addSeparator()
       .addSubMenu(SpreadsheetApp.getUi().createMenu('Beállítások')
           .addItem('BackendTest', 'GBS')
           .addItem('soon', 'tmp'))
       .addToUi();
};
//durer_relay GBE setup
function GBS()
{
     var html2 = HtmlService.createHtmlOutputFromFile('BackendTest.html')
      .setWidth(300)
      .setHeight(200);
 SpreadsheetApp.getUi().showModalDialog(html2, 'GBE test');
};

//durer_relay GUI setup
function durerGUI()
{
     var html = HtmlService.createHtmlOutputFromFile('Page.html')
      .setWidth(500)
      .setHeight(600);
 SpreadsheetApp.getUi().showModalDialog(html, 'Adding data');
};

//durerGUI BACKEND communication settings
function settings(id) {
  Logger.log(id);
  var sheet_name= SpreadsheetApp.getActiveSheet().getName();
  var email = Session.getActiveUser().getEmail();
  //Logger.log(ss);
  return [sheet_name,email];
}

// value setter
function setValue(y,x,val,sheetName){
  Logger.log(y,x,val);
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  var cell=sheet.getRange(y,x);
  cell.setValue(val);
  return true;
}

function setTeamPoints(teamName,problemNumber,problemPoint,sheetName,user)
{
  var y = getTeamY(teamName,sheetName);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  sheet.getRange(y+2,problemNumber+1).setBackground("green");
  sheet.getRange(y+2,problemNumber+1).setValue(problemPoint);
  //TODO loggolás!!!
  return true;
}

function getData(sheetName,user)
{
  Logger.log("startData")
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var irng =1;
  lastRow = sheet.getRange(irng,1);
  while(lastRow.getValue()!=""){
    lastRow = sheet.getRange(irng,1);
    if(irng>100)break;
    irng++;
  }
  var last = sheet.getLastRow();
  var datas = sheet.getRange(2,1,irng-2,16).getValues();
  return datas;
}

//teljes táblázathoz
function getDataExtended(sheetName,user)
{
  Logger.log("startData")
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var irng =1;
  lastRow = sheet.getRange(irng,1);
  while(lastRow.getValue()!=""){
    lastRow = sheet.getRange(irng,1);
    if(irng>100)break;
    irng++;
  }
  var last = sheet.getLastRow();
  var datas = new Array();
  datas[0] = sheet.getRange(2,1,irng-2,1).getValues();
  //első adat indexe
  var firstDataIndex = 5;
  datas.push(sheet.getRange(2,firstDataIndex,irng-2,firstDataIndex+15).getValues())
  return datas;
}

function getTeamY(teamName,sheetName)
{
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var last = sheet.getLastRow();
  var namesRange = sheet.getRange(2,1,last,1).getValues();
  var y = -1;
  for(i=0;i<last;i++)
  {
    if(namesRange[i]==teamName) y=i;
  }
  if(y==-1)Logger.log("Invalid teamName << "+teamName);
  Logger.log(teamName,y);
  return y;
}
function tmp(){};
