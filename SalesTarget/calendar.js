let $attached ;
const dayOfWeek = ["日","月","火","水","木","金","土"];
const now = new Date();
let standardDate = now ;

let SPholiday ;
let SPHYear = [];
let SPHMonth = [];
let SPHDate = [];
let holidayName = [] ;

function setSPHoliday(sName,td1,td2,lastyear,thisyear,month,date,DayOfnum1,DayOfnum2){
    //let Year = document.getElementById(sNameEng+'THead').lastElementChild.firstElementChild.textContent.slice(0,-1);
    //let Month = document.getElementById(sNameEng+'TBody').getAttribute('name').slice(5);
    let h = holidayName.length;
    for( let i=0; i<h; i++ ){
        if( lastyear === SPHYear[i] && month === SPHMonth[i] && date === SPHDate[i] && DayOfnum1 !== 0 && DayOfnum1 !== 6 ){
                td1.setAttribute('class','lastYearDate LYDcell'+sName+' Day7'+' subDay'+DayOfnum1);
        }
        if( thisyear === SPHYear[i] && month === SPHMonth[i] && date === SPHDate[i] && DayOfnum2 !== 0 && DayOfnum2 !== 6 ){
                td2.setAttribute('class','thisYearDate TYDcell'+sName+' Day7'+' subDay'+DayOfnum2);
        }
    }
}

document.addEventListener('DOMContentLoaded',async function(){
    try{
        let api_key = "AIzaSyD7U939s1HROf7BQrA8yPi_i_6wzGtPD_A";
        let api_id = "ja.japanese#holiday@group.v.calendar.google.com";
        let startD = new Date();
        let endD = new Date();
        startD.setDate(startD.getDate()-1000);
        endD.setDate(endD.getDate()+365);
        startD = startD.toISOString();
        endD = endD.toISOString();
        const res = await axios.get('https://www.googleapis.com/calendar/v3/calendars/'+encodeURIComponent(api_id)+'/events?key='+api_key+'&timeMin='+startD+'&timeMax='+endD+'&orderBy=startTime'+'&singleEvents=true');
        console.log(res.data);
        let j = res.data.items.length;
        for( let i=0; i<j; i++ ){
            SPholiday = new Date(res.data.items[i].start.date);
            SPHYear.push(SPholiday.getFullYear());
            SPHMonth.push(SPholiday.getMonth()+1);
            SPHDate.push(SPholiday.getDate());
            holidayName.push(res.data.items[i].summary);
            console.log(SPHYear[i]+"/"+SPHMonth[i]+"/"+SPHDate[i]+"("+holidayName[i]+")");
        }
    }catch(error){
        console.log(error);
    }
})
