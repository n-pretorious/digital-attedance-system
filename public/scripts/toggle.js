
function togglefirstbutton(){

document.getElementById("firstbutton"). addEventListener("click",disablefirstbutton() ,true);
document.getElementById("firstbutton").addEventListener("click",submit)
}
function togglesecondbutton(){
document.getElementById("secondbutton"). addEventListener("click",disablesecondbutton(),true);
}

function disablefirstbutton() {
    document.getElementById("firstbutton").disabled = true;
    document.getElementById("secondbutton") .disabled =false;
}
function disablesecondbutton() {
    document.getElementById("secondbutton") .disabled =true;
    document.getElementById("firstbutton"). disabled =false;
}


