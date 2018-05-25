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
function loadData(dataType) {
	ZZP={};
	ZZP.CHARINFO=[]; 
	var dataEnum=0;
	if (dataType=="vehicle"){dataEnum=1;}
        else if (dataType=="weapon"){dataEnum=2;}
	else {  dataType = "hero";}
  // dataType="vehicle"; dataEnum = 1;
  // dataType="weapon"; dataEnum = 2
  url= "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbtWm06EoEuzW1F3NXmDuZI3hfQD-XEEaND93LyfZuidMMwacGUOe42L6J6xjb3txJ4aucpBRaeQfC/pub?single=true&output=csv&gid="+dataEnum;


                csvData = $.ajax({
                    type: "GET",
                    url: url,
                    //dataType: "text/csv",
                    success: function (result) {
                     console.log(result);},
                    error: function (result){console.log("failure",result);}
                })
    .done(function(result){
                 buildArray(dataType, result);
    });
}
function buildArray(type, csvData){
  switch (type){
    case "hero": buildCharArray(csvData);
      break;
    case "vehicle": buildVArray(csvData);
      break;
    case "weapon":  buildWeaponsArray(csvData);
      break;
  }
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
var docFrag = document.createDocumentFragment();
  //Contacts CSS
  var contactsCSS="";
  //////////////////////Global Groups etc
  var groupsAr=[];
  var groupsCSS="";

for (var i = 0; i < keys.length; i++)
{
  // Secret Identities Controller
  if (CHARINFO[keys[i]].publicity!="secret"||window.location.href.indexOf("source.html")>-1){

  var tempNode = document.querySelector("div[data-type='template']").cloneNode(true); //true for deep clone
  tempNode.classList.add(CHARINFO[keys[i]].alias.replace(/ /g,''));
  tempNode.querySelector("div.alias").textContent = '"'+CHARINFO[keys[i]].alias+'"';
  tempNode.querySelector("div.infosheet").style.backgroundImage='url("https://image.ibb.co/'+CHARINFO[keys[i]].imgkey+'/'+CHARINFO[keys[i]].alias+'.png")';
  //contacts first box
  tempNode.querySelector("span.name").textContent = CHARINFO[keys[i]].name;
  tempNode.querySelector("a.anchor").setAttribute("name",CHARINFO[keys[i]].alias);
  tempNode.querySelector("span.ht").innerHTML = CHARINFO[keys[i]].ht;
  tempNode.querySelector("span.wt").textContent = CHARINFO[keys[i]].wt
  tempNode.querySelector("span.hq").textContent = CHARINFO[keys[i]].hq;
  tempNode.querySelector("span.debut").textContent = CHARINFO[keys[i]].debut;
  tempNode.querySelector("span.bio").textContent = CHARINFO[keys[i]].bio;
  if (CHARINFO[keys[i]].publicity!="open"){tempNode.style.display = "inline-flex";}

  tempNode.querySelector("div.contactList").innerHTML = contactsHTML(CHARINFO[keys[i]].contacts);

  if (CHARINFO[keys[i]].picclass.length>0){
  tempNode.classList.add(CHARINFO[keys[i]].picclass);}

  if (CHARINFO[keys[i]].hasOwnProperty("kinetics")){
    if (CHARINFO[keys[i]].kinetics.length>0){
      var fullKin = CHARINFO[keys[i]].kinetics.replace(/"/g,'');
      var splitKin = fullKin.split("~");
      var Kin = splitKin[0]; var Mig = splitKin[1]; var Tou = splitKin[2];var Spr = splitKin[3];

      tempNode.querySelector(".kinetics p.k").textContent=Kin;
      tempNode.querySelector(".kinetics p.m").textContent=Mig;
      tempNode.querySelector(".kinetics p.t").textContent=Tou;
      tempNode.querySelector(".kinetics p.s").textContent=Spr;

      if (splitKin.length>4){
        var ulText = "";
        for (k=4;k<splitKin.length;k++){ //list Kinetic Features
          var featDisplay = showFeaturefromString(Kin,splitKin[k]);
            ulText+="<li class='"+featDisplay[0]+"'>&gt;"+featDisplay[1]+ " " + featDisplay[2]+"</li>";
        }
        tempNode.querySelector(".kinetics ul").innerHTML=ulText;
      }
    tempNode.classList.add("kinetics");
    }
  }
  if (CHARINFO[keys[i]].hasOwnProperty("energetics")){
    if (CHARINFO[keys[i]].energetics.length>0){
      var fullEn = CHARINFO[keys[i]].energetics.replace(/"/g,'');
      var splitEn = fullEn.split("~");

      var En = splitEn[0];

      tempNode.querySelector(".energetics span.e").textContent=En;

      if (splitEn.length>1){
        var ulText = "";
        for (e=1;e<splitEn.length;e++){ //list Energetic Features
          var featDisplay = showFeaturefromString(En,splitEn[e]);

          ulText+="<li class='"+featDisplay[0]+"'>*"+featDisplay[1]+" "+featDisplay[2]+"</li>";
        }
        tempNode.querySelector(".energetics ul").innerHTML=ulText;
      }

      tempNode.classList.add("energetics");
    }
  }
  if (CHARINFO[keys[i]].hasOwnProperty("psychics")){
    if (CHARINFO[keys[i]].psychics.length>0){
        var fullPsy = CHARINFO[keys[i]].psychics.replace(/"/g,'');
        var splitPsy = fullPsy.split("~");

        var Psy = splitPsy[0];

        tempNode.querySelector(".psychics span.p").textContent=Psy;

        if (splitPsy.length>1){
          var ulText = "";
          for (p=1;p<splitPsy.length;p++){ //list Psychic Features
          var featDisplay = showFeaturefromString(Psy,splitPsy[p]);
            ulText+="<li class='"+featDisplay[0]+"'>:"+featDisplay[1]+ " " + featDisplay[2]+":</li>";
          }
          tempNode.querySelector(".psychics ul").innerHTML=ulText;
        }

        tempNode.classList.add("psychics");
    }
  }
  //ATTRIBUTE DICE
      tempNode.querySelector(".strength .dice").classList.add(getDiceWord(CHARINFO[keys[i]].strength));
      tempNode.querySelector(".dexterity .dice").classList.add(getDiceWord(CHARINFO[keys[i]].dexterity));
      tempNode.querySelector(".presence .dice").classList.add(getDiceWord(CHARINFO[keys[i]].presence));
      tempNode.querySelector(".knowledge .dice").classList.add(getDiceWord(CHARINFO[keys[i]].knowledge));
      tempNode.querySelector(".skill-wrapper").innerHTML= skillsHTML(CHARINFO[keys[i]].skills);

  contactsCSS+=".contactList ."+CHARINFO[keys[i]].alias.replace(/ /g,'')+"{background-image:url('https://image.ibb.co/"+CHARINFO[keys[i]].imgkey+"/"+CHARINFO[keys[i]].alias+".png');}";
  //contactsCSS+="."+CHARINFO[keys[i]].alias.replace(/ /g,'')+" ."+CHARINFO[keys[i]].alias.replace(/ /g,'')+"{display:none;}";

  var group = CHARINFO[keys[i]].primaryaffil;
  if (group.length>0){
  tempNode.classList.add(group.replace(/ /g,''));
  groupsAr.push(group);  }

  document.body.appendChild(tempNode);
}//secret
}

document.body.appendChild(docFrag);
delete docFrag;

///console.log(contactsCSS);
addStyleString(contactsCSS);
getAliasGroup(groupsAr);

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
     var groupShot = "<div class='groupShot "+cleanGroups[g].replace(/ /g,'')+"'>";
     for (t=0;t<thisGroup.length;t++){
        groupShot+="<a href='#"+thisGroup[t].alias+"' title='"+thisGroup[t].alias+"'><div class='contacts "+thisGroup[t].alias.replace(/ /g,'')+"'></div></a>";
     }
     groupShot+="<p class='blue'>"+cleanGroups[g]+"</p></div>";
     retGroupMkup.push(groupShot);

     var groupMembers = document.querySelectorAll("."+cleanGroups[g].replace(/ /g,'')+" .contactList");
     for (m=0;m<groupMembers.length;m++){
          groupMembers[m].innerHTML+=groupShot;
       }

      //var groupContacts = document.querySelectorAll('.contacts.'+cleanGroups[g].replace(/ /g,''));

  }

  return retGroupMkup;
}
loadData();
})();
