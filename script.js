(function () {
  	ZZP={};
  	ZZP.CHARINFO=[];
    ZZP.LEVEL="GUEST";
    var dataType = "hero";
if (location.href.indexOf("source.html")>-1){ZZP.LEVEL="FULL";}
var hashOperation = location.hash.replace("#",""); if (hashOperation=="vehicle"||hashOperation=="weapon"){dataType=hashOperation;}

function loadAllData(){
  loadData("hero"); loadData("vehicle"); loadData("weapon");
}
function showSelectedData(){
  document.getElementById("hero").style.display="none";
  document.getElementById("vehicle").style.display="none";
  document.getElementById("weapon").style.display="none";
  switch (hashOperation){
    case "vehicle": listVehicles(); //display all vehicles
  document.getElementById("vehicle").style.display="inline-flex";
      break;
    case "weapon":listWeapons(); //display all weapons
  document.getElementById("weapon").style.display="inline-flex";
      break;
    default:
      listHeroes(); //try to find Hero to display
  document.getElementById("hero").style.display="block";
      break;
  }
}
function listVehicles(){
  retVehs = "<table><tr><th>Cost</th><th>Name</th><th>Velocity</th><th>Size;<span class='small'> Cargo/Passengers</span></th><th>Traits</th></tr>";
  for(v=0;v<ZZP.VINFO.length;v++){
    var arrTr=[ZZP.VINFO[v].traits];
    if (arrTr.indexOf("~")>0){
      arrTr=ZZP.VINFO[v].traits.split('~');
    }if (arrTr[0]==""){arrTr=[];}
     var cV=VEH(ZZP.VINFO[v].intensity,ZZP.VINFO[v].size,arrTr,ZZP.VINFO[v].name);  //console.log(cV.name,cV.traits);
     var traitsFld = "";
     if (cV.might>0){
       //remove this trait
       //cV.traits.splice(cV.traits.indexOf("might"),1);
       traitsFld+="<span class='bang green'>[M"+cV.might+"] </span>";
     }
     if (cV.armor>1){
       //remove this trait
       //cV.traits.splice(cV.traits.indexOf("armor"),1);
       traitsFld+="<span class='bang brown'>[T"+cV.armor+"] </span>";
     }
     if (cV.xSpry>0){
       traitsFld+="<span class='bang red'>[s"+cV.xSpry+"] </span>";
      }
     traitsFld+=cV.traits.join(); if (cV.traits[0]!=""){traitsFld=""+traitsFld+"";}
    retVehs+="<tr><td class='green' style='text-align:center;'>$"+cV.cost+"</td><td>"+cV.name+"</td><td class='red' style='text-align:center;'>[V"+cV.velocity+"]</td><td class='brown' style='text-align:center;'>[z"+cV.xSize+"]["+cV.cargo+"/"+cV.passengers+"]</td><td class='small'>"+traitsFld+"</td></tr>";
  }
  retVehs+="</table>"; document.getElementById("vehicle").innerHTML=retVehs; return retVehs;
}
function listWeapons(){
  retWeps = "<table><tr><th>Cost</th><th>Name</th><th>Intensity</th><th>Size</th><th>Traits</th></tr>";
  for(w=0;w<ZZP.WINFO.length;w++){
    var arrTr=[ZZP.WINFO[w].traits];
    if (ZZP.WINFO[w].traits.indexOf("~")>0){arrTr=ZZP.WINFO[w].traits.split('~');}
     var cW=WEP(ZZP.WINFO[w].intensity,ZZP.WINFO[w].size,arrTr,ZZP.WINFO[w].name);
     var eT = "K"; var eC="green"; var eTraits=""; if (cW.etypes!==null){if(cW.etypes.length>0){eT="E"; eC="blue";eTraits="<span class='blue'>"+cW.etypes.join(", ")+" </span>";}} var wR = ""; if (cW.range!="default") {wR="[<span class='bang purple'>Range </span>"+cW.range+"] ";}

    retWeps+="<tr><td class='green'>$"+cW.cost+"</td><td>"+cW.name+"</td><td class='"+eC+"'>["+eT+cW.intensity+"]</td><td class='brown'>[z"+cW.size+"]</td><td>"+wR+eTraits+cW.traits+"</td></tr>";
  }
  retWeps+="</table>";
  document.getElementById("weapon").innerHTML=retWeps; return retWeps;
}
function listHeroes(){ buildHeroes();//hideHeroes();
/*
  var heroObj = ZZP.CHARINFO.find(findHero);
  if (heroObj==null){
    showAllHeroes();
  } else {
    document.querySelector("div.info-box."+heroObj.alias.replace(" ","")).style.display= "inline-flex";
  }*/
}
ZZP.HERO=listHeroes;
ZZP.WEAPON=listWeapons;
ZZP.VEHICLE=listVehicles;
ZZP.SHOW=showSelectedData;
Array.prototype.remove = function(){
    var args = Array.apply(null, arguments);
    var indices = [];
    for(var i = 0; i < args.length; i++){
        var arg = args[i];
        var index = this.indexOf(arg);
        while(index > -1){
            indices.push(index);
            index = this.indexOf(arg, index + 1);
        }
    }
    indices.sort();
    for(var i = 0; i < indices.length; i++){
        var index = indices[i] - i;
        this.splice(index, 1);
    }
}
Array.prototype.multisplice = function(){
    var args = Array.apply(null, arguments);
    args.sort(function(a, b){
        return a - b;
    });
    for(var i = 0; i < args.length; i++){
        var index = args[i] - i;
        this.splice(index, 1);
    }
}
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
	var dataEnum=0;
	if (dataType=="vehicle"){dataEnum=634773165;} else if (dataType=="weapon"){dataEnum=433192146;}	else {  dataType = "hero";}
  url= "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbtWm06EoEuzW1F3NXmDuZI3hfQD-XEEaND93LyfZuidMMwacGUOe42L6J6xjb3txJ4aucpBRaeQfC/pub?single=true&output=csv&gid="+dataEnum;
                csvData = $.ajax({
                    type: "GET",
                    url: url,
                    //dataType: "text/csv",
                    success: function (result) {
                     console.log(dataType+": "+result.length);
                     },
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
function procArray(raw){
  var retA = [];
  var rows = raw.split("\n");
  var headers = rows[0].split(",");
  for (r=1;r<rows.length;r++){
    var oneRow = rows[r];
    var thisRow = oneRow.split(",");

      var obj = {};
    for (var i=0;i<thisRow.length;i++){
      var key=headers[i];
      obj[key] = thisRow[i];//.replace("+",",").replace("#",'"').replace("@","'");
    }
    retA.push(obj);
  } return retA;
}

function buildCharArray(fullCSV){
  ZZP.CHARINFO=procArray(fullCSV);
  if (hashOperation!="vehicle"&&hashOperation!="weapon"){showSelectedData();}
}
function buildVArray(fullCSV){
  ZZP.VINFO=procArray(fullCSV);
  if (hashOperation=="vehicle"){showSelectedData();}
}
function buildWeaponsArray(fullCSV){
  ZZP.WINFO=procArray(fullCSV);
  if (hashOperation=="weapon"){showSelectedData();}
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
      var origNode = document.querySelector("div.info-box");
  for (var i = 0; i < keys.length; i++)
  {
    // Secret Identities Controller
    if (CHARINFO[keys[i]].publicity!="secret"){
    var tempNode = origNode.cloneNode(true); //true for deep clone
    if (i==0){ origNode.remove();}
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

    document.getElementById("hero").appendChild(tempNode);
  }//secret
  }

  document.body.appendChild(docFrag);
  delete docFrag;

  ///console.log(contactsCSS);
  addStyleString(contactsCSS);
  getAliasGroup(groupsAr);

}
function buildVehicles(){
  var vArr = ZZP.VINFO; //console.log(vArr);
  var keys = Object.keys(vArr); //get the keys.
  var docFrag = document.createDocumentFragment();
  for (var i = 0; i < keys.length; i++)
  {

  }
  document.body.appendChild(docFrag);
  delete docFrag;
}  //does nothing!!
function buildWeapons(){
  var wArr = ZZP.WINFO; //console.log(wArr);
  var keys = Object.keys(wArr); //get the keys.
  var docFrag = document.createDocumentFragment();

  document.body.appendChild(docFrag);
  delete docFrag;
}  //does nothing!!
function addStyleString(str) {
    var node = document.createElement('style');
    node.innerHTML = str;
    document.body.appendChild(node);
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

var vTRAITS = ["turbo","luxurious","extra space","streamlined","sealed","armor","heavy armor","more armor","thrusters","wings","hover","antigrav","limbs"];
var wTRAITS = ["short","touch","long","vlong","oneshot","limited","unlimited","slow","autofire","spread","area","e:_type_"];
function VEH (engine, size, traits, name){
  if (traits==null){traits=[];} if (name==null){name="Vehicle";}
    var retVeh = {"engine":engine, "size":size, "traits":traits,
      "velocity":engine, "cargo":size-engine, "passengers":Math.floor(size/2),
      "xSize":size, "armor":1, "might":0, "xSpry":0, "cost":engine, "name":name
    };
    //process traits list to generate correct properties
    if (traits.length>0){
      if (traits[0].indexOf("~")>0){traits=ZZP.VINFO[v].traits.split('~');}
    }
    retVeh.xSpry = Math.floor(engine/2); var tooBig = size-engine;  if (tooBig>0){retVeh.xSpry-=tooBig;}
    var wingsXorBlades = false;
    var traitRemove=[];
    for (i=0;i<traits.length;i++){
        currT = traits[i].toLowerCase();
        switch (currT){
          case "turbo":
            retVeh.cost++;
            break;
          case "luxurious":
            retVeh.cost++;retVeh.cost++;
            break;
          case "extra space":
            retVeh.cargo=size-1;
            retVeh.cost++;
            break;
          case "streamlined":
            retVeh.velocity++;retVeh.velocity++;
            retVeh.cargo--;
            retVeh.passengers--;
            retVeh.cost++;
            break;
          case "sealed":
            retVeh.cost++;
            break;
          case "armor":
            retVeh.armor=Math.floor(size/2);
            retVeh.cost++; traitRemove.push("armor");
            break;
          case "heavy armor":
            retVeh.armor=size; if (retVeh.armor<2){retVeh.armor=2;}
            retVeh.cost++;retVeh.cost++; traitRemove.push("armor"); traitRemove.push("heavy armor");
            break;
          case "more armor":
            retVeh.armor++;
            retVeh.cost++; traitRemove.push("more armor");
            break;
          case "thrusters":
            retVeh.xSpry=0; retVeh.minv=1;
            break;
          case "wings":
            retVeh.minv=3;
            retVeh.velocity++;retVeh.velocity++;
            if (!wingsXorBlades){retVeh.xSize++;}  wingsXorBlades=true;
            break;
          case "hover":  retVeh.minv=0;
            if (!wingsXorBlades){retVeh.xSize++;}  wingsXorBlades=true;
            retVeh.cost++;
            break;
          case "antigrav":
            retVeh.xSpry++;
            retVeh.cost++;retVeh.cost++;
            break;
          case "limbs":
            retVeh.might++;
            retVeh.cost++; traitRemove.push("limbs");
          default:
            //retVeh[currT]='true';
            break;
        }
    }
    if (traitRemove.length>0){
      for (r=0;r<traitRemove.length;r++){
        traits.splice(traits.indexOf(traitRemove[r]),1);
      }
    }
    if (traits[0]==""){traits=[];}
    retVeh.traits=traits;
    if (retVeh.cargo<-3){retVeh.cargo=-3;} //this messes up SCALE perfection; all Pilots are assumed Z0 (human)
    if (size>5){var zC = size-5; for (i=0;i<zC;i++){ retVeh.cost++;}}
    if (retVeh.cost<retVeh.engine){retVeh.cost=retVeh.engine;}
    retVeh.show=showVehicle;
    return retVeh;
}ZZP.VEH=VEH;
function showVehicle(){


  var sv = "<span class='green'>[$"+this.cost+"]</span><span> "+this.name+": </span><span class='red'>[V"+this.velocity+"]</span>"
    +"<span class='brown'>[Z"+this.xSize+"]</span>"
    +"<span class='brown'>["+this.cargo+"/"+this.passengers+"]</span>";
  if (this.xSpry>0){sv+="<span class='red'>[S"+this.xSpry+"]</span>";}
  if (this.might!=0){sv+="<span class='green'>[M"+this.might+"]</span>";}
  var traitList = ""; var traitEnd="";
  for (t=0;t<this.traits.length;t++){
    var comma = ", "; if (t==this.traits.length-1) { comma = "";}
    if (t==0){traitList="<span class='small'> ("; traitEnd=")</span>";}
    traitList+=this.traits[t];
      if (this.traits[t].indexOf("armor")>=0){traitList+="<span class='brown'> [T"+this.armor+"]</span>";}
    traitList+=comma;
  } sv+=traitList+traitEnd;
  return sv+"<br/>";
};

function WEP(intensity, size, traits, name) {
  var retWep={}; var removeTraits=[];
  if (traits==null){traits=[];} if (name==null){name="Weapon";}
  retWep = {"name":name,"size":size, "intensity":intensity, "traits":traits, "range":"default", "ammo":"default", "type":"", "etypes":[], "cost":intensity};
  //process traits list to generate correct properties
  for (i=0;i<traits.length;i++){
    switch (traits[i]){
      case "short":
        retWep.cost--; retWep.range=traits[i]; removeTraits.push(traits[i]);
        break;
      case "touch":
        retWep.cost-=2; retWep.range=traits[i]; removeTraits.push(traits[i]);
        break;
      case "long":
        retWep.cost++; retWep.range=traits[i]; removeTraits.push(traits[i]);
        break;
      case "vlong":
        retWep.cost++;retWep.cost++; retWep.range=traits[i]; removeTraits.push(traits[i]);
        break;
      case "oneshot":
        retWep.cost--; retWep.ammo=traits[i];
        break;
      case "limited":
        retWep.cost--; retWep.ammo=traits[i];
        break;
      case "unlimited":
        retWep.cost++; retWep.ammo=traits[i];
        break;
      case "slow":
        retWep.cost--; retWep.ammo=traits[i];
        break;
      case "autofire":
        retWep.cost++; retWep.ammo=traits[i];
        break;
      case "spread":
        retWep.cost++;
        break;
      case "area":
        retWep.cost++;retWep.cost++;
        break;
      default: break;
    }
    if (traits[i].indexOf("e:")==0){
      retWep.type="energy"; retWep.etypes.push(traits[i]); removeTraits.push(traits[i]);
      retWep.cost++;
    }
  }
  if (retWep.size<0){retWep.cost-=retWep.size;}else if(retWep.size>5){retWep.cost--;if (retWep.size>intensity){retWep.cost--;}}
  if (retWep.cost<intensity){retWep.cost=intensity;}
  retWep.show = showWeapon;
  for (r=0;r<removeTraits.length;r++){retWep.traits.remove(removeTraits[r]);}
  return retWep;
}ZZP.WEP=WEP;
function showWeapon(){  var iColor="green"; var iLetter="K";
    if (this.type=="energy"){iColor="blue"; iLetter="E"}
  var sw = "<span class='green'>[$"+this.cost+"]</span><span> "+this.name+": </span><span class='"+iColor+"'>["+iLetter+this.intensity+"]</span>"
    +"<span class='brown'>[Z"+this.size+"] </span>";
      //range, ammo shown outside "default"
    if (this.range!="default"){sw+="<span class='purple small bang'>Range </span><span class='small'>"+this.range+" </span>"; }
  var dTraits = []; var dTbegin ="<span class='small'> (";
  if (this.ammo!="default"){sw+=dTbegin+"<span class='small'>"+this.ammo+" </span>";dTbegin="";}
  //autofire, spread, area, energy only vTRAITS
  if (this.traits.includes("autofire")){}//dTraits.push("autofire");}
  if (this.traits.includes("spread")){dTraits.push("spread");}
  if (this.traits.includes("area")){dTraits.push("area");}
  var eTypes="";
  if (this.type=="energy"){
    eTypes+=dTbegin+"<span class='blue small'>"; dTbegin="";
    for (e=0;e<this.etypes.length;e++){
      var comma = ", "; if (e==this.etypes.length-1) { comma = " ";}
      eTypes+=this.etypes[e]+comma;
    }
    eTypes+="</span>";
  }

  var traitList = ""; var traitEnd=")</span>"; if (dTraits.length==0&&dTbegin.length>0){traitEnd="";}
  for (t=0;t<dTraits.length;t++){  sw+=dTbegin; dTbegin="";
    var comma = ", "; if (t==dTraits.length-1) { comma = " ";}

    traitList+="<span class='small'>"+dTraits[t]+"</span>";
    traitList+=comma;
  } sw+=traitList+eTypes+traitEnd;
  return sw+"<br/>";
}
loadAllData();
})();
