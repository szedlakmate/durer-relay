//global variables
var sheetName = "";

//onload fnction creates menu
function onOpen() {
   SpreadsheetApp.getUi()
       .createMenu('Dürer Menu')
       .addItem('Bevitel indít','durerGUI')
       .addSeparator()
       .addSubMenu(SpreadsheetApp.getUi().createMenu('Beállítások')
           .addItem('soon', 'tmp')
           .addItem('soon', 'tmp'))
       .addToUi();
};
//durer_relay GUI setup
function durerGUI()
{
     var html = HtmlService.createHtmlOutputFromFile('Page.html')
      .setWidth(300)
      .setHeight(200);
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
  //sheet.getRange(y+2,problemNumber+1).setBackground("green");
  sheet.getRange(y+2,problemNumber+1).setValue(problemPoint);
  //TODO loggolás!!!
  return true;
}

function camelArray(headers) {
  var keys = [];
  for (var i = 0; i < headers.length; ++i) {
    var key = camelString(headers[i]);
    if (key.length > 0) {
      keys.push(key);
    }
  }
  return keys;
}


function getData(sheetName,user)
{
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var last = sheet.getLastRow();
  var datas = sheet.getRange(2,1,last-1,16).getValues();
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
