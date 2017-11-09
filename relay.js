// Problem objektum készítése
function createProblem() {
    var problem = new Object();
problem.status = 'none'; // none, first, second, third
problem.getScore = function(base_score) {
    switch (this.status) {
        case 'none': return 0;
        case 'first': return base_score;
        case 'second': return base_score-1;
        case 'third': return base_score-2;
        default:
        console.log('Invalid problem state');
            // itt kéne egy rohadtnagy error
        }
    };
    problem.setStatus = function(new_status) {
        switch (this.status) {
            case 'none':
            case 'first':
            case 'second':
            case 'third':
            break;
            default:
            console.log('Invalid problem state. Valid states are none, first, second, third');
            // itt kéne egy rohadtnagy error
        }
        this.status = new_status;
    };
    return problem;
}

// Team objektum készítése
// name: csapatnév
// id: csapatid
function createTeam(name, id=null, num_problems=15) {

    team = new Object();
var problems = [null]; // 0. feladatot nullal feltöltöm
for (var i = 1; i <= num_problems; i++)
    problems.push(createProblem());
team.problems = problems;
team.teamname = name; // !! nem name, mert azt használhatják kívülről
team.id = id;
team.getScore = function(num_problems, base_scores) {
    var sum = 0;
    for (var i = 1; i <= num_problems; i++)
        sum += this.problems[i].getScore(base_scores[i]);
    return sum;
};
team.getProblem = function(i) {
    if (i < 1 || i > 15)
        console.log('ERROR!');
    return this.problems[i];
}
return team;
}

// egyszerű teszt Team-re és Problem-re: createTeam, getProblem, problem.setStatus, getScore
function testTeam() {
    var team = createTeam("Szprájt");
    team.getProblem(1).setStatus('first');
    team.getProblem(11).setStatus('second');
    team.getProblem(15).setStatus('second');

    console.log("Test#1: ",
        team.getScore(15, [null, 3,3,3,3,3,4,4,4,4,4,5,5,5,5,5])
        );
}

// kereséshez segédfüggvény:
// kiveszi az ékezeteket, szóközöket és case insensitive-vé teszi
function mystrip(r, strip_accents=true, strip_spaces=true) {
    var r=r.toLowerCase();
    if (strip_spaces)
        r = r.replace(new RegExp(/\s/g),"");
if (strip_accents) { // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
    r = r.replace(new RegExp(/[á]/g),"a");
    r = r.replace(new RegExp(/[é]/g),"e");
    r = r.replace(new RegExp(/[í]/g),"i");
    r = r.replace(new RegExp(/[óöő]/g),"o");
    r = r.replace(new RegExp(/[úüű]/g),"u");
}
return r;
}

// substring-et keres, nem csak a csapatnév elején
function smartSearchTeam(substr) {
    substr = mystrip(substr);
    var num_teams = teams.length;
    var candidates = [];
    for (var i = 0; i < num_teams; i++) {
        var team = teams[i];
        var r = mystrip(team.teamname).indexOf(substr);
    if (r != -1) // on match
        candidates.push(team);
}
return candidates;
}

// substring-et keres, de csak a csapatnév elején, valszeg nem fog kelleni
function searchTeam(substr) {
    substr = mystrip(substr);
    var num_teams = teams.length;
    var candidates = [];
    for (var i = 0; i < num_teams; i++) {
        var team = teams[i];
        var r = mystrip(team.teamname).indexOf(substr);
        if (r == 0)
            candidates.push(team);
    }
    return candidates;
}

// teljes matchelest keres, azonositashoz
function searchExactTeam(str) {
    var num_teams = teams.length;
    for (var i = 0; i < num_teams; i++) {
        var team = teams[i];
        if (team.teamname == str)
            return team;
    }
}

function loadTeams() {
teams = []; // ne írj var-t!
//teams = ...;
//BACKEND communication
console.log("Start loading:");
google.script.run.withSuccessHandler(function(data){
  console.log(data);
  sheetName=data[0];
  userName = data[1];
  //kill me
  google.script.run.withSuccessHandler(function(data){
      //TODO get all data
      var i,j;
      var tmpTeam =new Object();
      for(i=0;i<data.length;i++)
      {
         tmpTeam = createTeam(data[i][0]);
         for(j=1;j<16;j++)
         {
            if(data[i][j]!="")
            {
              console.log("!!");
              tmpTeam.getProblem(j).setStatus(getChoice(j,data[i][j],base_scores));
          }
      }
      teams.push(tmpTeam);
  }
  console.log(teams);
  clearData();
  updateOptions();
}).getData(sheetName,userName);
}).settings();
$("#filter").val("Loading");
}

function dataOK() {
    var teamname = $('#teamNames option:selected').val();
    var choice = $("input[name='choice']:checked").val();
    var problem = parseInt($("#problem").val());
// validalas
var team = searchExactTeam(teamname);
team.getProblem(problem).setStatus(choice);
var score=team.getProblem(problem).getScore(base_scores[problem]);
console.log(base_scores+" "+score);
if(_asycnron)
{
  google.script.run.setTeamPoints(teamname,problem,score,sheetName,userName);
}
else
{
  //sync BACKEND
  google.script.run.withSuccessHandler(function(data){
    //loadshow hide
    console.log(data);
}).setTeamPoints(teamname,problem,score,sheetName,userName);
  //loadshow show
}
updateOptions();
//_superFill
filter_search_word="";
}

// clears all DOM options in DOM select
function clearOptions() {
    $("#teamNames").empty();
}

// add DOM option to DOM select
function addOption(text,value) {
    $("#teamNames").append($('<option>', {
        value: value,
        text: text
    }));
}

// ha beírok valamit a felső input-ba, akkor a lehetőségek frissülnek az alapján.
function updateOptions() {
    var selected = $('#teamNames option:selected').val();

    var substr;
    if(_superFill) {
      substr = filter_search_word;
  } else {
      substr = $("#filter").val();
  }
  var filtered = smartSearchTeam(substr);
if (_superFill) $("#filter").val(filtered.teamname); //-Tomi
var length = filtered.length;
clearOptions();
for (var i = 0; i < length; i++)
    addOption((i+1) + ': ' + filtered[i].teamname + ' (' + filtered[i].getScore(15, base_scores) + ')', filtered[i].teamname);
// ha ki tudjuk ujra valasztani azt, ami a frissites elott volt
if ($("#teamNames option[value='"+
  $.escapeSelector(selected)+"']").length) {
    $('#teamNames').val(selected);
} else {
    // egyebkent az elsot, ha van, kivalasztjuk
    firstOption = $("#teamNames option:first");
    if (firstOption.length) {
        $("#teamNames").val(firstOption.val());
    }
}
}

function uncheckRadio() {
    checked = $("input[name='choice']:checked");
if (checked) checked.prop('checked', false); // uncheck
}

function checkRadio(num) {
    var map = ['none', 'first', 'second', 'third'];
    var name = map[num];
    tocheck = $("input[name='choice']" +
      "[value='"+name+"']");
    if (!tocheck)
        console.log("whoops");
tocheck.prop('checked', true); // check
}

function clearData() {
    $("#filter").val('');
    $("#teamNames").val('');
    updateOptions();
    $("#problem").val(1);
    uncheckRadio();
    checkRadio(0);
    $("#filter").focus();
}
function getChoice(problemNumber,problemScore,base_score)
{
    switch (base_score[problemNumber]-problemScore) {
        case 0:
        return 'first';
        break;
        case 1:
        return 'second';
        break;
        case 2:
        return 'third';
        break;
        default:
        return 'none'

    }
}

// globális változók
// base_scores: null az elejen, mert egytol indexeltem. TODO atirjam? // perhaps -Tomi // mostmar jo ez igy -Laci
var _asycnron = false;
var filter_search_word =""; // -Tomi
var base_scores = [null,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6];
var teams=[];
var sheetName = "";
var userName = "";
//option variables
var _superFill=false; //épp nem működik, és elvi hibát tartalmaz
global_teams = teams;
// event callbacks
$(document).ready(function(){
    addOption("loading","null");
    console.log('Loaded');
    loadTeams();

//testTeam();
// teszt, törölj ki
/*k
teams.push(createTeam("Hello"));
teams.push(createTeam("Darkness"));
teams.push(createTeam("My"));
teams.push(createTeam("Old"));
teams.push(createTeam("Friend"));
*/

$("#filter").on('input', function(event) {
    updateOptions();
});
$("#filter").on('keypress', function(event) {
    if(_superFill) {
        //great but forget it in keypress, also filters ] and /
        var whitelist = "aábcdeéfghiíjklmnoóöőpqrstuúüűvwxyzAÁBCDEÉFGHIÍJKLMNOÓÖŐPQ RSTUÚÜŰVWXYZ 1234567890,.-_+-*%=()\\|#&@$ß["+"'\"";
        if(event.keyCode != 13) {
            var white=false;
            for(var i=0;i<whitelist.length;i++) {
                if(event.char==whitelist[i])
                    white=true;
            }
            if(white)filter_search_word+=event.char;
            //console.log(filter_search_word);
        }
    }
});
updateOptions();
clearData();

// hot-keyek
// ha barhol escape-t nyomnak, akkor torli az adatokat
$("#main").on('keydown', function() {
    if (event.keyCode == 27) { // escape
        event.stopPropagation();
        clearData();
        // Call event.preventDefault() to not process the event
        event.preventDefault();
    }
});

// enterre (meg tabra, de az built-in) tovabbmegy a kovetkezo elemre
$("#filter").get()[0].addEventListener('keydown', function (event) {
    if (_superFill &&
        (event.keyCode == 13 || event.keyCode == 9)) {
        // enter or tab
    event.stopPropagation();
    $("#radio_0").focus();
        // Call event.preventDefault() to not process the event
        event.preventDefault();
    } else if (event.keyCode == 13 || event.keyCode == 9    ) {
        event.stopPropagation();
        $("#teamNames").focus();
        // Call event.preventDefault() to not process the event
        event.preventDefault();
    }
});
// enterre (meg tabra, de az built-in) tovabbmegy a kovetkezo elemre
// barmilyen (egyjegyu) szamra pedig kivalasztja az annyiadik elemet
$("#teamNames").get()[0].addEventListener('keydown', function(event) {
    if (event.keyCode >= 48 && event.keyCode < 58) {
        $('#teamNames').val($("#teamNames option")[event.keyCode-48-1].value);
    } else if (event.keyCode == 13) {
        // nem megy fel a body-ba a keres
        event.stopPropagation();
        $("#radio_0").focus();
        // Call event.preventDefault() to not process the event
        event.preventDefault();
    }
});
// a radiogombokon pedig a 0123-ra reagal (kivalasztja a megfelelot)
// enter, tab tovabbmegy (lasd fentebb)
$.each($("input[name='choice']"), function(_, radio) {
    radio.addEventListener('keydown',
        function (event) {
    if (event.keyCode >= 48 && event.keyCode < 58) { // ha szam
        uncheckRadio();
        checkRadio(event.keyCode-48); // keycode-48 lesz a szam
    } if (event.keyCode == 13) {
        // nem megy fel a body-ba az event
        event.stopPropagation();
        $("#problem").focus();
        $("#problem").select();
        // Call event.preventDefault() to not process the event
        event.preventDefault();
    }
})});
// enter, tab tovabbmegy (lasd fentebb)
$("#problem").get()[0].addEventListener('keydown', function(event) {
    if (event.keyCode == 13) {
        // nem megy fel a body-ba a keres
        event.stopPropagation();
        $("#ok").focus();
        // Call event.preventDefault() to not process the event
        event.preventDefault();
    }
});
// enter veglegesiti es atadja a fokusznak a tetejet
$("#ok").get()[0].addEventListener('keydown', function(event) {
    if (event.keyCode == 13) {
        // nem megy fel a body-ba a keres
        event.stopPropagation();
        $(this).click();
        clearData();
        // Call event.preventDefault() to not process the event
        event.preventDefault();
    }
});
$("#problem").focus(function() {
    $(this).select();

    // Work around Chrome's little problem
    $(this).onmouseup = function() {
        // Prevent further mouseup intervention
        $(this).onmouseup = null;
        return false;
    };
});
// settings
$("#superfill").click(function() {
    _superFill ^= 1;
    console.log("superfill now " +
        (_superFill ? "on" : "off"));
    if (_superFill) {
        $("#teamNames").hide();
    } else
    $("#teamNames").show();
});
});
