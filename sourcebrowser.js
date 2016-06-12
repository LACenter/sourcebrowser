////////////////////////////////////////////////////////////////////////////////
// Unit Description  : sourcebrowser Description
// Unit Author       : Your Company/Name
// Date Created      : February, Wednesday 17, 2016
// -----------------------------------------------------------------------------
//
// History
//
//
////////////////////////////////////////////////////////////////////////////////


import "mainform";

//<events-code> - note: DESIGNER TAG => DO NOT REMOVE!

function AppException(Sender, E) {
    //Uncaught Exceptions
    MsgError("Error", E.Message);
}

//sourcebrowser initialization constructor
Application.Initialize;
Application.Icon.LoadFromResource("appicon");
Application.Title = "LA.Source Browser";
mainformCreate(null);
Application.Run;

//Project Resources
//$res:appicon=[project-home]resources/app.ico
//$res:mainform=[project-home]mainform.js.frm
