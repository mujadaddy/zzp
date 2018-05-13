(function () {
function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp((
    // Delimiters.
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
    // Quoted fields.
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    // Standard fields.
    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);
        }
        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[2].replace(
            new RegExp("\"\"", "g"), "\"");
        } else {
            // We found a non-quoted value.
            var strMatchedValue = arrMatches[3];
        }
        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    // Return the parsed data.
    return (arrData);
}
function CSV2OBJ(csv) {
    var array = CSVToArray(csv);
    var objArray = [];
    for (var i = 1; i < array.length; i++) {
        objArray[i - 1] = {};
        for (var k = 0; k < array[0].length && k < array[i].length; k++) {
            var key = array[0][k];
            objArray[i - 1][key] = array[i][k]
        }
    }

    //var json = JSON.stringify(objArray);
    //var str = json.replace(/},/g, "},\r\n");

    //return str;
	return objArray;
}
function loadData() {
	ZZP={};
	ZZP.CHARINFO=[];

  url= "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbtWm06EoEuzW1F3NXmDuZI3hfQD-XEEaND93LyfZuidMMwacGUOe42L6J6xjb3txJ4aucpBRaeQfC/pub?single=true&output=csv&gid=0";


                csvData = $.ajax({
                    type: "GET",
                    url: url,
                    //dataType: "text/csv",
                    success: function (result) {
                     console.log(result);},
                    error: function (result){console.log("failure",result);}
                })
    .done(function(result){
                 buildCharArray(result);
    });
}
function buildCharArray(fullCSV){
  var charArray = [];
  var rows = fullCSV.split("\n");
    var headers = rows[0].split(",");
  for (r=1;r<rows.length;r++){
    var oneRow = rows[r];
    var thisRow = oneRow.split(",");

      var obj = {};
    for (var i=0;i<thisRow.length;i++){
      var key=headers[i];
      obj[key] = thisRow[i];//.replace("+",",").replace("#",'"').replace("@","'");
    }
    charArray.push(obj);
  }
  ZZP.CHARINFO=charArray; //console.log(ZZP.CHARINFO);
  buildHeroes();
}
function addStyleString(str) {
    var node = document.createElement('style');
    node.innerHTML = str;
    document.body.appendChild(node);
}
function buildHeroes(){
var CHARINFO=ZZP.CHARINFO;
var keys = Object.keys(CHARINFO); //get the keys.
  var groupsAr=[];
  var groupsCSS="";

for (var i = 0; i < keys.length; i++)
{
  // Secret Identities Controller
  if (CHARINFO[keys[i]].publicity!="secret"||window.location.href.indexOf("source.html")>-1){

    //@@@ GROUPS rewrite
    var currChar=CHARINFO[keys[i]];
    // write name-classes
    groupsCSS+=".contacts."+currChar.alias.replace(/ /g,'')+"{background-image:url('https://image.ibb.co/"+currChar.imgkey+"/"+currChar.alias+".png');}";
    // get group list
    if (currChar.primaryaffil.length>0){
      //tempNode.classList.add(group.replace(/ /g,''));
      groupsAr.push(currChar.primaryaffil);
    }
    else{
      buildChar(currChar);
    }
    // create div.group

}//secret
}
addStyleString(groupsCSS);
buildGroups(groupsAr);

}

function getModIntensity(oneIn){
  if (oneIn=="_"){return true;}
  return false;
}
function getModClass(oneIn){
 switch (oneIn){
    case "%":
      return "purple";	//Close relationship
    case "}":
      return "red";		//Foe
    case "#":
      return "green";   //Friend
    case "@":
      return "brown";
    case "=":
      return "blue";		//Teammate
    case "!":
      return "big";
 }
 return null;
}
function getAbbfromFeature(oneIn){
  switch (oneIn){
   case "purple": return "P";	//Close relationship
   case "red": return "V";		//Foe
   case "green": return "M";   //Friend
   case "brown": return "T";
   case "blue": return "E";		//Teammate
  }
  return null;
}
function getContactClass(oneIn){
 switch (oneIn){
    case "%":
      return "purple";
    case "}":
      return "red";
    case "#":
      return "green";
    case "@":
      return "brown";
    case "=":
      return "blue";
    case "!":
      return "big";
 }
 return null;
}
function showFeaturefromString(intensity,feature){
            var modIntensity = intensity; var currFeature = feature;
            var modClass=null;var modAbbrev = "";

			Mods = checkModifier(currFeature, modIntensity);
			if (Mods.mod=="intensity"){
				modIntensity=Mods.val;
				currFeature=currFeature.substring(1);
			}
			Mods = checkModifier(currFeature, modIntensity);
			if (Mods.mod!=null) {
				modClass=getModClass(currFeature.substring(0,1));
				currFeature=currFeature.substring(1);
				modAbbrev=getAbbfromFeature(modClass);
				modIntensity="["+modAbbrev+modIntensity+"]"; if (Mods.mod=="big"){modIntensity ="";}
			}
			else {modIntensity="";}

  return [modClass,currFeature,modIntensity];
}

function checkModifier(fromItem,modIntensity){
	var foundMod = null; var single=fromItem.substring(0,1)
	var derivVal = modIntensity;
	if(getModIntensity(single)){	//tests for underscore value,
		foundMod="intensity";
		derivVal=Math.floor(modIntensity/2);
	}
	else if (getModClass(single)!=null) {foundMod=getModClass(single)}
	else {}

	return {"mod":foundMod,"val":derivVal};
}
function skillsHTML(fullSkillsString){
    var retSkills = "";//
    var skillArray = fullSkillsString.split("~");
    for (s=0;s<skillArray.length;s++){
          var currSkill = getSkillObj(skillArray[s]);
          var skillIcon = ""; for (si=0;si<currSkill[2];si++){skillIcon+="+";}
          retSkills+= "<span class='"+currSkill[0]+"'>"+currSkill[1]+skillIcon+"</span>";
    }

     return retSkills;
}
function getSkillObj(skill){
    var spanClass = getModClass(skill.substring(0,1));
    var skillLevel = 1; var tempSpanClass = spanClass;
    if (skill.length<2){skillLevel=0;} //empty check
    while (tempSpanClass!=null){tempSpanClass=getModClass(skill.substring(skillLevel,skillLevel+1));if (tempSpanClass!=null) {skillLevel++;}}
    var currSkill = skill.substring(skillLevel);

    return [spanClass, currSkill, skillLevel];
}
function contactsHTML(fullContactsString){ //fullContactsString="Betsy Flagg~Toro~Sgt Zero"
	retMkup = "";

	var contacts=fullContactsString.split("~");
	if (contacts[0].length>0){
	for (c=0;c<contacts.length;c++){
		contactsshow = showFeaturefromString(0,contacts[c]);
		contactsSize="";
		if (contactsshow[1].length>9){
		  contactsSize="small";
		  if (contactsshow[1].length>17){
		    contactsSize="tiny";
		  }
		}
		if (contactsshow[0]==null){contactsshow[0]="";} var dl=contactsshow[1];

		retMkup+="<a href='#"+contactsshow[1]+"'><div class='contacts "+contactsshow[0]+" "+contactsshow[1].replace(/ /g,"")+"'><p class='"+contactsSize+"'>"+contactsshow[1]+"</p></div></a>";
	}	}
	return retMkup;
}
function getDiceWord(dataNumber){
  switch (dataNumber){
    case "1": return "one";
    case "2": return "two";
    case "3": return "three";
    case "4": return "four";
    default: return "one";
  }

}
function getAliasGroup(groups){
  var cleanGroups = [...new Set(groups)].filter(gr=>gr.length>0);
  var retGroupMkup=[]; var groupsCSS=""
  for (g=0;g<cleanGroups.length;g++){
     var thisGroup = ZZP.CHARINFO.filter(char => char.primaryaffil==cleanGroups[g]); // Arr(GroupList) of Arr(Group) of Char Objs

     var groupMembers = document.querySelectorAll("."+cleanGroups[g].replace(/ /g,'')+" .contactList");
     for (m=0;m<groupMembers.length;m++){
          groupMembers[m].innerHTML+=groupShot;
       }

      //var groupContacts = document.querySelectorAll('.contacts.'+cleanGroups[g].replace(/ /g,''));

  }
  return retGroupMkup;
}
function buildGroups(groups){
  var cleanGroups = [...new Set(groups)].filter(gr=>gr.length>0);
  //var retGroupMkup=[];
  for (g=0;g<cleanGroups.length;g++){
   var thisGroup = ZZP.CHARINFO.filter(char => char.primaryaffil==cleanGroups[g]);

     var groupShot = "<div class='groupShot "+cleanGroups[g].replace(/ /g,'')+"'>";
     for (t=0;t<thisGroup.length;t++){ var altRow = ""; if (t%2!=0){altRow=" class='alt'";}
        groupShot+="<a href='#"+thisGroup[t].alias+"' title='"+thisGroup[t].alias+"'><div class='contacts "+thisGroup[t].alias.replace(/ /g,'')+"'><p"+altRow+">"+thisGroup[t].alias+"</p></div></a>";
     }
     groupShot+="<p class='group blue'>"+cleanGroups[g]+"</p></div>";
     //retGroupMkup.push(groupShot);
  document.querySelector("#gG").innerHTML+=groupShot;
  }
}
function buildChar(cc){
    document.querySelector("#gG").innerHTML+="<div class='individual'><div class='contacts "+cc.alias.replace(/ /g,'')+"'></div><p>"+cc.alias+"</p></div>";
}
loadData();
})();
