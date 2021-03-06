  var config = {
    apiKey: "AIzaSyA-hnI5aquIwwKkxkikcZjUQWrnlzeE3mc",
    authDomain: "sdm-subtitle.firebaseapp.com",
    databaseURL: "https://sdm-subtitle.firebaseio.com",
    projectId: "sdm-subtitle",
    storageBucket: "sdm-subtitle.appspot.com",
    messagingSenderId: "45748735409"
  };
//Login Page Element
var id,password,checkpassword,login,setupNewAccount,confirmSetup;
var textarea;
var idArray,loginorNot=false;
//Basic Setting Page Element
var greet,mydate,title,lang,confirmSetting,settingControl,inputText,play,stop,timelabel;
var sessionNumber,meetinggoal,texttitle;
//var readRecordProject;
var display=true,titleArray;
//Remodify Page Element
var showSubtitle,saveSubtitle,plus,minus;
//Download Page Element
var downloadName,downloadText;
//Content Bar item
var BasicSetting,Remodify;
var g_signup,g_signin;
//recognizer Object
var recognition, recognizing = false;
var subArray,timeArray;
var interval,timeCount=0,firstword=true,startTime,endTime;
var subRef,wordNum;

//確認後的各項變數
var final_id="",final_password="",final_title="";

window.onload=function(){
    buildElement();
    
    firebase.initializeApp(config);
    
    buildListener();
    
    showdate();
    getAccountInfo();
    elementhide();
    
    if (!('webkitSpeechRecognition' in window)) {
        alert("此瀏覽器並不支援語音辨識API");
    }
    else {
        recognition = new webkitSpeechRecognition(); 
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang="cmn-Hant-TW";
    }
    recognition.onstart =onstart;
    recognition.onend =onend;
    recognition.onerror= onerror;
    recognition.onresult = onresult;
    readSubtitle(id)
}
function buildElement(){
    id=document.getElementById("id");
    password=document.getElementById("password");
    checkpassword=document.getElementById("checkpassword");
    login=document.getElementById("login");
    setupNewAccount=document.getElementById("setupNewAccount");
    confirmSetup=document.getElementById("confirmSetup");
    g_signin=document.getElementById("g_signin");
    g_signup=document.getElementById("g_signup");
    texttitle=document.getElementById("texttitle");
    greet=document.getElementById("greet");
    mydate=document.getElementById("mydate");
    title=document.getElementById("titleInput");
    sessionNumber=document.getElementById("roomnumberInput");
    meetinggoal=document.getElementById("meetinggoalInput");
    lang=document.getElementById("lang");
    confirmSetting=document.getElementById("confirmSetting");
    //readRecordProject=document.getElementById("readRecordProject");
    settingControl=document.getElementById("settingControl");
    inputText=document.getElementById("inputText");
    textarea=document.getElementById("textarea");
    play=document.getElementById("play");
    stop=document.getElementById("stop");
    timelabel=document.getElementById("timelabel");
    
    showSubtitle=document.getElementById("showSubtitle");
    saveSubtitle=document.getElementById("saveSubtitle");
    plus=document.getElementById("plusTime");
    minus=document.getElementById("minusTime");
    
    downloadName=document.getElementById("downloadName");
    downloadText=document.getElementById("downloadText");
    
    BasicSetting=document.getElementById("BasicSetting");
    Remodify=document.getElementById("Remodify");
    downloadlink=document.getElementById("downloadlink");
}
function buildListener(){
    g_signin.addEventListener("click",getGoogleAuthentication);
    g_signup.addEventListener("click",getGoogleAuthentication);
    //login.addEventListener("click",getAccountPermission);
    setupNewAccount.addEventListener("click",createAccount);
    confirmSetup.addEventListener("click",confirmNewAccount);
    confirmSetting.addEventListener("click",settingConfirm);
    //readRecordProject.addEventListener("click",readProject);
    settingControl.addEventListener("click",controlSetting);
    play.addEventListener("click",startrecord);
    stop.addEventListener("click",stoprecord);
    showSubtitle.addEventListener("click",showsub);
    saveSubtitle.addEventListener("click",savesub);
    plus.addEventListener("click",plusTime);
    minus.addEventListener("click",minusTime);
    Remodify.addEventListener("click",recover);
}
function elementhide(){
    $("#record").hide();
    $("#recordchart").hide();
    $("#textarea").hide();
    $("#textoutbound").hide();
    $("#recheckPassword").hide();
    $("#confirmSetup").hide();
    $("#saveSubtitle").hide();
    $("#plusTime").hide();
    $("#minusTime").hide();
}

/*
        以下為語音辨識的各類事件            
                                     */
                        
function onstart(){
    recognizing = true;
    subArray=new Array();
    timeArray=new Array();
}
function onend(){
    recognizing = false; 
}
function onerror(event){
    alert("發生錯誤，錯誤類型::"+event.error);
}
function onresult(event){
    var text;
    var interim_transcript = '';
    var final_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            endTime=timeCount*100+Math.floor(Math.random()*100);
            timeArray.push(endTime);
            updateTime(final_id,final_title,timeArray);
            
            final_transcript = event.results[i][0].transcript; 
            subArray.push(final_transcript);
            updateRealtimeSubtitle(final_id,final_title,final_transcript);
            updateSubtitle(final_id,final_title,subArray);
            firstword=true;
        } 
        else { 
            if(firstword){
                startTime=timeCount*100+Math.floor(Math.random()*100);
                timeArray.push(startTime);
                updateTime(final_id,final_title,timeArray);
                firstword=false;
            }
            interim_transcript = event.results[i][0].transcript;
            inputText.value=interim_transcript;
            updateRealtimeSubtitle(final_id,final_title,interim_transcript);
        }
    }
}

/*
       以下為Listener的各類method            
                                    */
function startrecord(event){
    if(!recognizing&&checkTitle()){
        recognition.start();
        interval=setInterval(function(){
            timeCount++;
            timelabel.innerHTML=changetoTime(false,timeCount*100);
        },100);
    }
}
function getGoogleAuthentication(){
    var provider = new firebase.auth.GoogleAuthProvider(); 
    firebase.auth().signInWithRedirect(provider);
    //window.location = 'Setmeeting.html';
    firebase.auth().getRedirectResult().then(result => {
    if (result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
        console.log("lksl")
        var token = result.credential.accessToken;
        window.location = 'Setmeeting.html';
    // ...
    }
  // The signed-in user info.
        var user = result.user;
}   ).catch(function(error) {
    // Handle Errors here.
        var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
        // ...
});
}
function readSubtitle(id){//讀取所有字幕
    var text;
    var string;
    firebase.database().ref('users/'+ id +"/Subtitle").on("child_added", function(snapshot) {
        setTimeout(function(){
            string=JSON.stringify(snapshot.val());
            getTranslateResponse(string.substr(1,string.length-2));
            text = document.createTextNode(string.substr(1,string.length-2)+"\n");
            textarea.appendChild(text);
        },15500);
    }, function (errorObject) {
        text = document.createTextNode("The read failed: " + errorObject.code);
        textarea.appendChild(text);
    });
   
}
function stoprecord(event){
    if(recognizing){
        clearInterval(interval);
        updateTimecount(final_id,final_title,timeCount*100);
        timeCount=0;
        timelabel.innerHTML="00:00:00,000";
        recognition.stop();
    }
}
function getAccountPermission(){
    var checkpassword=""; firebase.database().ref('users/'+id.value+"/Password").once("value").then(function(snapshot){
         checkpassword=snapshot.val();
         if(!checkRepeatAccount(id.value,idArray))
             alert("找無此帳號");
         else if(checkpassword!=password.value)
             alert("密碼錯誤");
         else{
             final_id=id.value;
             final_password=password.value;
             greet.innerHTML="Hello，"+final_id;
             loginorNot=true;
             $("#BasicSetting").trigger( "click" );
         }
    });
    
}
function createAccount(){
    $("#recheckPassword").show("slow");
    $("#setupNewAccount").hide();
    $("#confirmSetup").show();
    
}
function confirmNewAccount(){
    if(id.value==""){
        alert("帳戶名稱不可為空直");
    }else if(!checkRepeatAccount(id.value,idArray)){
        if(password.value=="")
            alert("密碼不能為空直");
        else if(password.value!=checkpassword.value)
            alert("確認密碼與密碼不一致")
        else{
            alert("成功創立帳號");
            final_id=id.value;
            final_password=password.value;
            writeUserData(final_id,final_password);
        }
    }else{
        alert("此「"+id.value+"」帳戶名稱已被使用");
    }
}
function checkRepeatAccount(id,idArray){
    for(var i=0;i<idArray.length;i++){
        if(id==idArray[i]){
            return true;
        }
    }
    return false;
}
function writeUserData(id,password) {
    var d=new Date();
    var year,month,day;
    year=d.getFullYear();
    month=d.getMonth()+1;
    day=d.getDate();
    var date="建立日期:"+year+month+day;
    firebase.database().ref('users/'+ id).set(
    {
        "Password": password,
        "Date": date,
        "RecordTitle":""
    });
}
function settingConfirm(){
    if(loginorNot!=true){
        alert("尚未登入請重新登入")
    }else if(checkTitle() && checkGoal() && checkSession()){
        var d=new Date();
        var year,month,day;
        year=d.getFullYear();
        month=d.getMonth()+1;
        day=d.getDate();
        var date=""+year+"/"+month+"/"+day;
        final_title=title.value;
        downloadName.value=final_id+"_"+final_title+".srt";
        recognition.lang=lang.value;
        $("#record").show("slow");
        $("#recordchat").show("slow");
        $("#textarea").show("slow");
        $("#textoutbound").show("slow");
        
        controlSetting();
        texttitle.textContent=title.value+"_會議記錄_"+date;
        getUserTitle(final_id);
        firebase.database().ref('users/'+final_id+"/RecordTitle/"+final_title).set(
        {
            "Date":date,
            "Lang":lang.value,
            "StartEndTime":{0:0,1:0},
            "Subtitle":{0:""}
        });
    }
}
function readProject(){
    var getFileOrNot=false;
    if(loginorNot!=true){
        alert("尚未登入請重新登入")
    }else if(checkTitle()){
        getUserTitle(final_id);
        for(var i=0;i<titleArray.length;i++){
            if(title.value==titleArray[i]){
                getFileOrNot=true;
                final_title=title.value;
                downloadName.value=final_id+"_"+final_title+".srt";
                $("#Remodify").trigger("click");
                $("#showSubtitle").trigger("click");
            }
        }
        if(getFileOrNot!=true)
            alert("查無此會議記錄");
    }

}
function controlSetting(){
    if ( display == true ) {
        settingControl.setAttribute("class","btn-radius glyphicon glyphicon-chevron-down");
        display=false;
        $("#setting").toggle("slow");
    } else if ( display == false ) {
        settingControl.setAttribute("class","btn-radius glyphicon glyphicon-chevron-up");
        display=true;
        $("#setting").toggle("slow");
    }
}
function showsub(){
    if(loginorNot!=true){
        alert("尚未登入請重新登入")
    }
    else{    
        $("#showSubtitle").hide();
        $("#saveSubtitle").show();
        $("#plusTime").show();
        $("#minusTime").show();
        var text="";
        var firsttime=true;
        subRef = firebase.database().ref('users/'+final_id+"/RecordTitle/"+final_title+'/Subtitle');
        timeRef=firebase.database().ref('users/'+final_id+"/RecordTitle/"+final_title+'/StartEndTime');
    
        subRef.once("value").then(function(data){
            //document.getElementById("content").innerHTML=JSON.stringify(data.val());
            wordNum=data.numChildren();
            //alert(data.val());
            var string=JSON.stringify(data.val());
            var words=getsubStr(string).split(",");
            timeRef.once("value").then(function(snapshot){
                //alert(words);
                //alert(snapshot.val());
                var timestring=JSON.stringify(snapshot.val());
                var timewords=getsubStr(timestring).split(",");
                for(var i=0;i<words.length;i++){
                    var label0=document.createElement("label");
                    label0.innerHTML=i+1;
                    label0.setAttribute("name","label");
                
                    var label1=document.createElement("label");
                    label1.innerHTML=changetoTime(true,timewords[i*2]);
                    label1.setAttribute("class","btn");
                    label1.setAttribute("name","label");
                
                    var label2=document.createElement("label");
                    label2.innerHTML=changetoTime(true,timewords[i*2+1]);
                    label2.setAttribute("class","btn");
                    label2.setAttribute("name","label");
                
                    var input=document.createElement("input");
                    input.setAttribute("id", i);
                    input.setAttribute("type", "text");
                    input.setAttribute("class","form-control input-lg");
                    input.setAttribute("value",getsubStr(words[i]));
                
                    downloadText.appendChild(document.createTextNode((i+1)+"\r\n"+changetoTime(true,timewords[i*2])+" --> "+changetoTime(true,timewords[i*2+1])+"\r\n"+getsubStr(words[i])+"\r\n\r\n"));
                    text=downloadText.value;
                    $("#downloadlink").click(function(){
                        if(firsttime==true){
                            download(downloadName.value,text);
                            firsttime=false;
                        }
                    });
                    document.getElementById("div").appendChild(label0); 
                    document.getElementById("div").appendChild(document.createElement("br"));
                    document.getElementById("div").appendChild(label1); 
                    document.getElementById("div").appendChild(label2); 
                    document.getElementById("div").appendChild(input); 
                    document.getElementById("div").appendChild(document.createElement("br"));
            }   
            });
        });
    }
   
    /* var savebtn=document.createElement("button");
    savebtn.setAttribute("id","saveSubtitle");
    savebtn.appendChild(document.createTextNode("儲存字幕"));
    savebtn.addEventListener("click",savesub);
    document.getElementById("div").appendChild(savebtn);
    document.getElementById("div").appendChild(document.createElement("br"));*/
    
}
function download(filename,text) {
    var element = document.createElement('a');
    element.setAttribute('href', "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download",filename);
    element.style.display = 'none';
    element.click();
}
function savesub(){
    $("#saveSubtitle").hide();
    $("#plusTime").hide();
    $("#minusTime").hide();
    $("#showSubtitle").show();
    
    var array=new Array();
    for(var i=0;i<wordNum;i++){
        array.push(document.getElementById(i).value);
    }
    firebase.database().ref('users/'+final_id+"/RecordTitle/"+final_title).update({"Subtitle":array});
    
    var div=document.getElementById("div");
    while (div.hasChildNodes()) {   
        div.removeChild(div.firstChild);
    }
}
function plusTime(){
    var plusTimeArray=new Array();
    firebase.database().ref('users/'+final_id+"/RecordTitle/"+final_title+"/StartEndTime").once("value").then(function(snapshot){
        var timestring=JSON.stringify(snapshot.val());
        var timewords=getsubStr(timestring).split(",");
        for(var t=0;t<timewords.length;t++){
            timewords[t]=parseInt(timewords[t])+1000;
            plusTimeArray.push(timewords[t]);
            document.getElementsByName("label")[t+1].innerHTML=changetoTime(true,timewords[t]);
        }
        firebase.database().ref('users/'+final_id+"/RecordTitle/"+final_title).update({"StartEndTime":plusTimeArray});
    });
    
}
function minusTime(){
    var minusTimeArray=new Array();
    firebase.database().ref('users/'+final_id+"/RecordTitle/"+final_title+"/StartEndTime").once("value").then(function(snapshot){
        var timestring=JSON.stringify(snapshot.val());
        var timewords=getsubStr(timestring).split(",");
        for(var t=0;t<timewords.length;t++){
            timewords[t]=parseInt(timewords[t])-1000;
            minusTimeArray.push(timewords[t]);
            document.getElementsByName("label")[t+1].innerHTML=changetoTime(true,timewords[t]);
        }
        firebase.database().ref('users/'+final_id+"/RecordTitle/"+final_title).update({"StartEndTime":minusTimeArray});
    });
    
}
function recover(){
    $("#showSubtitle").show();
    $("#saveSubtitle").hide();
    $("#plusTime").hide();
    $("#minusTime").hide();

    var div=document.getElementById("div");
    while (div.hasChildNodes()) {   
    div.removeChild(div.firstChild);
    }
}

/*
       以下為跟Firebase相關的各項method 
                                    */

function updateSubtitle(id,title,subtitle) {
    firebase.database().ref('users/'+id+"/RecordTitle/"+title).update({
        "Subtitle":subtitle
    });
}
function updateRealtimeSubtitle(id,title,realtimeSubtitle) {
    firebase.database().ref('users/'+id+"/RecordTitle/"+title).update({
        "RealtimeSubtitle": realtimeSubtitle 
    });
}
function updateTime(id,title,time){//跟新目前錄音時間
    firebase.database().ref('users/'+id+"/RecordTitle/"+title).update({
        "StartEndTime":time
    });
}
function updateTimecount(id,title,timeCount){
    firebase.database().ref('users/'+id+"/RecordTitle/"+title).update({
        "RecordTime": timeCount
    });
}
function getAccountInfo(){
    idArray=new Array();
    firebase.database().ref('users').orderByChild("Aiden").on("child_added", function(snapshot) {
        idArray.push(snapshot.key);
    });
}
function getUserTitle(id){
    titleArray=new Array();
    firebase.database().ref('users/'+id+"/RecordTitle").orderByChild("Aiden").on("child_added", function(snapshot) {
        titleArray.push(snapshot.key);
    });
}

/*
         其餘method           
                            */

function showdate(){
    var d=new Date();
    var year,month,day;
    year=d.getFullYear();
    month=d.getMonth()+1;
    day=d.getDate();
    var date=""+year+"/"+month+"/"+day;
    mydate.innerHTML="今日日期:"+date;
}
function getsubStr(string){//將一字串的頭尾去除
    return string.substring(1,string.length-1);
}
function changetoTime(type,timeCount){
    var millsec,second,minute,hour,timeString;
    if(type==true){
        millsec=Math.floor(timeCount%1000);
        second=Math.floor(timeCount/1000%60);
        minute=Math.floor(timeCount/1000/60%60); 
        hour=Math.floor(timeCount/1000/60/60); 
        timeString=paddingLeft(hour+"",2)+":"+paddingLeft(minute+"",2)+":"+paddingLeft(second+"",2)+","+paddingLeft(millsec+"",3);
        return timeString;
    
    }else{
        millsec=Math.floor(timeCount%1000+Math.random()*100);
        second=Math.floor(timeCount/1000%60);
        minute=Math.floor(timeCount/1000/60); 
        hour=Math.floor(timeCount/1000/60/60); 
        timeString=paddingLeft(hour+"",2)+":"+paddingLeft(minute+"",2)+":"+paddingLeft(second+"",2)+","+paddingLeft(millsec+"",3);
        return timeString;
    }
    return timeString;
}
function paddingLeft(str,lengh){
	if(str.length >= lengh)
	return str;
	else
	return paddingLeft("0" +str,lengh);
}
function checkTitle(){
    if(title.value==""){
        alert("標題不可為空值");
        return false;
    }
    return true;
}
function checkSession(){
    if(sessionNumber.value==""){
        alert("會議室編號不可為空值");
        return false;
    }
    return true;
}function checkGoal(){
    if(meetinggoal.value==""){
        alert("會議目標不可為空值");
        return false;
    }
    return true;
}



