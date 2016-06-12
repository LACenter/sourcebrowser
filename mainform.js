////////////////////////////////////////////////////////////////////////////////
// Unit Description  : mainform Description
// Unit Author       : Your Company/Name
// Date Created      : February, Wednesday 17, 2016
// -----------------------------------------------------------------------------
//
// History
//
//
////////////////////////////////////////////////////////////////////////////////

var progress = null;

//constructor of mainform
function mainformCreate(Owner) {
    return TForm.CreateWithConstructorFromResource(Owner, &mainform_OnCreate, "mainform");
}

//OnCreate Event of mainform
function mainform_OnCreate(Sender) {
    //Form Constructor

    //todo: some additional constructing code
    Sender.Caption = Application.Title;
    TDirectoryEdit(Sender.Find("eLocation")).Text = UserDir+"Downloads";
    progress = TProgressBar(Sender.Find("ProgressBar1"));
    progress.Color = clNone;

    //note: DESIGNER TAG => DO NOT REMOVE!
    //<events-bind>
    TTimer(Sender.find("Timer1")).OnTimer = &mainform_Timer1_OnTimer;
    TListView(Sender.find("ListView1")).OnItemChecked = &mainform_ListView1_OnItemChecked;
    TButton(Sender.find("Button2")).OnClick = &mainform_Button2_OnClick;
    TButton(Sender.find("Button1")).OnClick = &mainform_Button1_OnClick;
    Sender.OnShow = &mainform_OnShow;
    //</events-bind>

    //Set as Application.MainForm
    Sender.setAsMainForm;
}

function mainform_Button1_OnClick(Sender) {
    TForm(Sender.Owner).Close;
}

function mainform_Button2_OnClick(Sender) {
    Sender.Enabled = false;

    var list = TListView(Sender.Owner.find("ListView1"));
    var location = TDirectoryEdit(Sender.Owner.Find("eLocation")).Text+DirSep;
    ForceDir(location);

    progress.Show;
    Application.ProcessMessages;

    var http = new THttp;
    http.onBytesReceived = &mainform_OnBytesReceived;

    for (var i = 0; i < list.Items.Count; i++) {
        if (list.Items.item[i].Checked) {
            list.Items.item[i].Selected = true;
            var fs = new TFileStream(location+list.Items.Item[i].SubItems.Strings[1], fmCreate);
            http.Clear;
            http.urlGetBinary(location+list.Items.Item[i].SubItems.Strings[2], fs);
            delete fs;
            list.Items.item[i].Checked = false;
            list.Items.item[i].Selected = false;
        }
    }
    delete http;

    progress.Hide;
    Sender.Enabled = false;
    Application.ProcessMessages;
}

function mainform_OnBytesReceived(Sender, bytesReceived, bytesTotal) {
    progress.Position = bytesReceived;
    progress.Max = bytesTotal;
    Application.ProcessMessages;
}

function mainform_ListView1_OnItemChecked(Sender, Item) {
    var hasChecked = false;
    var list = TListView(Sender.Owner.find("ListView1"));

    for (var i = 0; i < list.Items.Count; i++) {
        if (list.Items.item[i].Checked) {
            hasChecked = true;
        }
    }

    TButton(Sender.Owner.Find("Button2")).Enabled = hasChecked;
}

function mainform_OnShow(Sender) {
    TTimer(Sender.Find("Timer1")).Enabled = true;
}

function mainform_Timer1_OnTimer(Sender) {
    Sender.Enabled = false;

    var list = TListView(Sender.Owner.find("ListView1"));

    var http = new THttp;
    var s = http.urlGet("https://liveapps.center/data/_source/");
    var str = TStringList.Create;
    str.Text = s;
    for (var i = 0; i < str.Count; i++) {

        var ename = Trim(copy(str.Strings[i], 0, Pos("-", str.Strings[i]) -1));
        var edate = Trim(copy(str.Strings[i], Pos("-", str.Strings[i]) +1, 1000));
        edate = copy(edate, 0, Pos("=", edate) -1);
        var efile = Trim(copy(str.Strings[i], Pos("=", str.Strings[i]) +1, 1000));

        var item = list.Items.Add;
        item.Caption = ename;
        item.SubItems.Add(edate);
        item.SubItems.Add(efile);
        item.SubItems.Add("https://liveapps.center/data/_source/"+efile);
        item.ImageIndex = 0;

    }
    delete http;

    if (list.Items.Count != 0) {
        list.Items.Item[0].Selected = true;
    }

    progress.Style = pbstNormal;
    progress.Hide;
}

//<events-code> - note: DESIGNER TAG => DO NOT REMOVE!

//mainform initialization constructor
