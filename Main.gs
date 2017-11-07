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
  return [SpreadsheetApp.getActive().getName().name,10];
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
function tmp(){};
