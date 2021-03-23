const $yearSelecter = document.getElementById('yearSelecter');
const $monthSelecter = document.getElementById('monthSelecter');

let nagoyaD = {} ,shimokitaD = {} ,minamisenbaD = {} ,harajukuD = {} ,kyotoD = {} ,kichijojiD = {} ,popupD = {} ,shinsaibashiD = {} ,kamakuraD = {} ;
let shopRatioData = {
    "nagoya":nagoyaD,
    "shimokita":shimokitaD,
    "minamisenba":minamisenbaD,
    "harajuku":harajukuD,
    "kyoto":kyotoD,
    "kichijoji":kichijojiD,
    "popup":popupD,
    "shinsaibashi":shinsaibashiD,
    "kamakura":kamakuraD
};

function calLastYearSales(sNameEng){

    let sumSalesByDay = {"Day0": 0,"Day1": 0,"Day2": 0,"Day3": 0,"Day4": 0,"Day5": 0,"Day6": 0,"Day7": 0,"DaySP":0}; //曜日ごとの売上合計
    let sumCustomersByDay = {"Day0": 0,"Day1": 0,"Day2": 0,"Day3": 0,"Day4": 0,"Day5": 0,"Day6": 0,"Day7": 0,"DaySP":0}; //曜日ごとの客数合計
    let CUPAverageByDay = {"Day0": 0,"Day1": 0,"Day2": 0,"Day3": 0,"Day4": 0,"Day5": 0,"Day6": 0,"Day7": 0,"DaySP":0}; //曜日ごとの客単価平均
    let countOfDaysLastYear = {"Day0": 0,"Day1": 0,"Day2": 0,"Day3": 0,"Day4": 0,"Day5": 0,"Day6": 0,"Day7": 0,"DaySP":0}; //去年対象月の曜日毎日数
    let cNumsAverageByDay = {"Day0": 0,"Day1": 0,"Day2": 0,"Day3": 0,"Day4": 0,"Day5": 0,"Day6": 0,"Day7": 0,"DaySP":0}; //曜日ごとの平均客数
    let cNumratio = {"Day0": 0,"Day1": 0,"Day2": 0,"Day3": 0,"Day4": 0,"Day5": 0,"Day6": 0,"Day7": 0,"DaySP":0}; //曜日毎平均客数の全体の客数に対する比率
    let CUPratio = {"Day0": 0,"Day1": 0,"Day2": 0,"Day3": 0,"Day4": 0,"Day5": 0,"Day6": 0,"Day7": 0,"DaySP":0}; //曜日毎平均CUPの全体のCUPに対する比率
    

    //曜日ごとに振り分け、去年月の日数計算
    let keys = Object.keys(sumSalesByDay);
    let l = keys.length ;
    let $lastYearDateCells = document.getElementsByClassName('LYDcell'+sNameEng);
    let j = $lastYearDateCells.length;
    let LweekdayCount = 0;
    let LholidayCount = 0;
    let LSPdayCount = 0;
    let NoCountDays = 0;
    let NoCountOfDay = "";
    for(let i=0; i<j; ++i){
        let targetTd = $lastYearDateCells[i] ;
        for(let k=0; k<l; ++k){
            if(targetTd.classList.contains(keys[k]) && targetTd.nextElementSibling.textContent != 0){
                sumSalesByDay[keys[k]] += Number(targetTd.nextElementSibling.textContent);
                sumCustomersByDay[keys[k]] += Number(targetTd.nextElementSibling.nextElementSibling.textContent);
                ++countOfDaysLastYear[keys[k]];
                if(k!==0 && k!==6 && k!==7 && k!==8){
                    ++LweekdayCount ;
                }else if(k!==8){
                    ++LholidayCount ;
                }else if(k!==8){
                    ++LSPdayCount;
                }
            }
        }
        //感謝デーがなくなった場合
        if(targetTd.classList.contains("DaySP") && targetTd.nextElementSibling.textContent == 0){
            ++NoCountDays;
            countOfDaysLastYear["DaySP"] = 1 ;
            if(i>0 && !$lastYearDateCells[i-1].classList.contains("Day7") && !$lastYearDateCells[i-1].classList.contains("DaySP")){
                NoCountOfDay = Number($lastYearDateCells[i-1].getAttribute("class").slice(-1))+1;
            }else if(i===0 && !$lastYearDateCells[i-1].classList.contains("Day7") && !$lastYearDateCells[i-1].classList.contains("DaySP")){
                NoCountOfDay = Number($lastYearDateCells[i+14].getAttribute("class").slice(-1));
            }
            console.log(NoCountOfDay);
        }
    }

    //売上合計（weekday,holiday,all）の計算
    let sumSalesWeekday = 0 ; 
    let sumSalesHoliday = 0 ;
    let SUMsales = 0 ;
    let sumCustomersWeekday = 0 ;
    let sumCustomersHoliday = 0 ;
    let SUMcustomers = 0 ;
    let CUP = 0 ;
    for(let k=0; k<l; ++k){
        if(k!==0 && k!==6 && k!==7){
            sumSalesWeekday += sumSalesByDay[keys[k]] ;
            sumCustomersWeekday += sumCustomersByDay[keys[k]] ;
        }else{
            sumSalesHoliday += sumSalesByDay[keys[k]] ; 
            sumCustomersHoliday += sumCustomersByDay[keys[k]] ;
        }
        SUMsales += sumSalesByDay[keys[k]];
        SUMcustomers += sumCustomersByDay[keys[k]];
    }

    //感謝デーがなくなった場合
    let salesOfNoCount = 0;
    let customerNumOfNoCount = 0;
    if( NoCountDays ===1 ){
        salesOfNoCount = sumSalesByDay["Day"+NoCountOfDay]/countOfDaysLastYear["Day"+NoCountOfDay]*1.8 ;
        customerNumOfNoCount = sumCustomersByDay["Day"+NoCountOfDay]/countOfDaysLastYear["Day"+NoCountOfDay]*1.3 ;
        sumSalesByDay["DaySP"] = salesOfNoCount ;
        sumCustomersByDay["DaySP"] = customerNumOfNoCount ;
        
    }

    CUP = (SUMsales)/(SUMcustomers) ; //去年の単価
    let CUP2 = (SUMsales+salesOfNoCount)/(SUMcustomers+customerNumOfNoCount) ;
    //CUP、客数の曜日ごとにおける平均値とひと月分に対する指数計算
    for(let k=0; k<l; ++k){
        cNumsAverageByDay[keys[k]] = sumCustomersByDay[keys[k]]/countOfDaysLastYear[keys[k]] ;
        CUPAverageByDay[keys[k]] = sumSalesByDay[keys[k]]/sumCustomersByDay[keys[k]] ; 
        cNumratio[keys[k]] = cNumsAverageByDay[keys[k]]/SUMcustomers ;
        CUPratio[keys[k]] = CUPAverageByDay[keys[k]]/CUP2 ;
    }
        
    //去年の平日、休日毎のまとめ（売上、客数、単価）
    let $trForSummary = document.getElementById('tbodySummary'+sNameEng).children;
    $trForSummary[1].children[0].textContent = "平日"+ LweekdayCount +"日平均" ; $trForSummary[1].children[1].textContent = Math.round(sumSalesWeekday/LweekdayCount) ;
    $trForSummary[1].children[2].textContent = Math.round(sumCustomersWeekday/LweekdayCount) ; $trForSummary[1].children[3].textContent = Math.round(sumSalesWeekday/sumCustomersWeekday) ;
    $trForSummary[2].children[0].textContent = "休日"+ LholidayCount +"日平均" ; $trForSummary[2].children[1].textContent = Math.round(sumSalesHoliday/LholidayCount) ;
    $trForSummary[2].children[2].textContent = Math.round(sumCustomersHoliday/LholidayCount) ; $trForSummary[2].children[3].textContent = Math.round(sumSalesHoliday/sumCustomersHoliday) ;
    $trForSummary[1].children[4].textContent = Math.round(CUP) ;

    shopRatioData[sNameEng] = {
        "CUPratio":CUPratio, "cNumratio":cNumratio
    }
}

function calSalesTarget(event){
    
    let sNameEng = event.target.id.slice(6) ;
    let customersNumForecast = document.getElementById("customerNumForecast"+sNameEng).value ;
    let CUPTarget = document.getElementById("CUPtarget"+sNameEng).value ;

    let Data = shopRatioData[sNameEng] ;
    let CUPratio = Data["CUPratio"], cNumratio = Data["cNumratio"] ;

    let countOfDaysThisYear = {"Day0": 0,"Day1": 0,"Day2": 0,"Day3": 0,"Day4": 0,"Day5": 0,"Day6": 0,"Day7": 0,"DaySP":0}; //今年対象月の曜日毎日数
    let cNumForecast = {"Day0": 0,"Day1": 0,"Day2": 0,"Day3": 0,"Day4": 0,"Day5": 0,"Day6": 0,"Day7": 0,"DaySP":0}; //曜日ごとの1日の客数予測
    let CUPForecast = {"Day0": 0,"Day1": 0,"Day2": 0,"Day3": 0,"Day4": 0,"Day5": 0,"Day6": 0,"Day7": 0,"DaySP":0}; //曜日ごとの1日のCUP予測
    let salesForecast = {"Day0": 0,"Day1": 0,"Day2": 0,"Day3": 0,"Day4": 0,"Day5": 0,"Day6": 0,"Day7": 0,"DaySP":0}; //曜日ごとの1日の売上予測

    let keys = Object.keys(countOfDaysThisYear);
    let l = keys.length ;

    //今年月の日数計算
    let TweekdayCount = 0;
    let TholidayCount = 0;
    let $thisYearDateCells = document.getElementsByClassName('TYDcell'+sNameEng);
    j = $thisYearDateCells.length;
    for(let i=0; i<j; ++i){
        let targetTd = $thisYearDateCells[i] ;
        for(let k=0; k<l; ++k){
            if(targetTd.classList.contains(keys[k])){
                ++countOfDaysThisYear[keys[k]];
                if(k!==0 && k!==6 && k!==7){
                    ++TweekdayCount ;
                }else{
                    ++TholidayCount ;
                }
            }
        }
    }

    //感謝デーが平日か休日か
    //客数指数を今年用に調整、最後に客数計算
    let cNumratioAdjust = 0 ;
    for( let k=0; k<l; ++k){
        //月～日までの場合
        if(keys[k]!=="Day7" && keys[k]!=="DaySP"){
            //定休日の曜日がない場合、ある場合。
            if(countOfDaysThisYear[keys[k]]){
                if(cNumratio[keys[k]]){
                    cNumratioAdjust += cNumratio[keys[k]] ;
                }else{
                    if(keys[k]!=="Day0"&&keys[k]!=="Day6"){
                        let bunboCount = 0 ;
                        let sumDayOfWeekcNumratio = 0;
                        let sumDayOfWeekCUPratio = 0
                        for(let i=1; i<6; ++i){
                            if(cNumratio[keys[i]]){
                                ++bunboCount;
                                sumDayOfWeekcNumratio += cNumratio[keys[i]] ;
                                sumDayOfWeekCUPratio += CUPratio[keys[i]] ;
                            }
                        }
                        cNumratio[keys[k]] = sumDayOfWeekcNumratio/bunboCount;
                        CUPratio[keys[k]] = sumDayOfWeekCUPratio/bunboCount;
                        cNumratioAdjust += cNumratio[keys[k]];
                    }else if(keys[k]==="Day0"){
                        cNumratio[keys[k]] = cNumratio[keys[6]];
                        CUPratio[keys[k]] = CUPratio[keys[6]];
                        cNumratioAdjust += cNumratio[keys[k]];
                    }else if(keys[k]==="Day6"){
                        cNumratio[keys[k]] = cNumratio[keys[0]];
                        CUPratio[keys[k]] = CUPratio[keys[0]];
                        cNumratioAdjust += cNumratio[keys[k]];
                    }

                }
            }else{
                cNumratio[keys[k]]=0;
                CUPratio[keys[k]]=0;
            }
        
        //感謝デーの場合
        }else if(keys[k]==="DaySP"){

            let Lsubtd = document.getElementById(sNameEng+"LYDaySP")
            let Tsubtd = document.getElementById(sNameEng+"TYDaySP")
            //去年、今年の感謝デーが祝日かどうかで場合分け。祝日の場合は土日平均のratioを使って計算していく。（classは感謝デーが祝日よりも優先されている。）
            if(!Lsubtd.classList.contains("SP7")){
                
                if(!Tsubtd.classList.contains("SP7")){
                    let LsubDay = Lsubtd.classList.item(3).slice(3);
                    let TsubDay = Tsubtd.classList.item(3).slice(3);
                    cNumratio[keys[k]] = cNumratio[keys[k]]/cNumratio[LsubDay] * cNumratio[TsubDay];
                    CUPratio[keys[k]] = CUPratio[keys[k]]/CUPratio[LsubDay] * CUPratio[TsubDay];
                    cNumratioAdjust += cNumratio[keys[k]] ;
                }else{
                    let TsubDay = Tsubtd.classList.item(3).slice(3);
                    cNumratio[keys[k]] = cNumratio[keys[k]]/((cNumratio["Day0"]+cNumratio["Day6"])/2) * cNumratio[TsubDay];
                    CUPratio[keys[k]] = CUPratio[keys[k]]/((CUPratio["Day0"]+CUPratio["Day6"])/2) * CUPratio[TsubDay];
                    cNumratioAdjust += cNumratio[keys[k]] ;
                }

            }else{

                if(!Tsubtd.classList.contains("SP7")){
                    let LsubDay = Lsubtd.classList.item(3).slice(3);
                    cNumratio[keys[k]] = cNumratio[keys[k]]/cNumratio[LsubDay] * (cNumratio["Day0"]+cNumratio["Day6"])/2
                    CUPratio[keys[k]] = CUPratio[keys[k]]/CUPratio[LsubDay] * (CUPratio["Day0"]+CUPratio["Day6"])/2
                    cNumratioAdjust += cNumratio[keys[k]] ;
                }else{
                    cNumratioAdjust += cNumratio[keys[k]] ;
                }

            }

        //祝日の場合
        }else if(keys[k]==="Day7"){
            //祝日があるかどうかで場合分け、去年も今年もある場合はそのまま、今年しかない場合は土日平均、去年しかない場合は0に設定。
            if(countOfDaysThisYear["Day7"]){
                if(cNumratio["Day7"]){
                    cNumratioAdjust += cNumratio[keys[k]] ;
                }else{
                    cNumratio["Day7"] = (cNumratio[keys[0]]+cNumratio[keys[6]])/2;
                    CUPratio["Day7"] = (CUPratio[keys[0]]+CUPratio[keys[6]])/2;
                    cNumratioAdjust += cNumratio["Day7"];
                }
            }else{
                cNumratio[keys[k]] = 0 ;
                CUPratio[keys[k]] = 0 ;
            }
        }
        console.log(cNumratioAdjust)
        console.log(cNumratio[keys[k]]);
    }

    let cNumratioAdjust2 = 0 ;
    for( let k=0; k<l; ++k ){
        cNumratio[keys[k]] = cNumratio[keys[k]] / cNumratioAdjust * countOfDaysThisYear[keys[k]];
        cNumratioAdjust2 += cNumratio[keys[k]];
    }

    for( let k=0; k<l; ++k ){
        if(countOfDaysThisYear[keys[k]]){
            cNumratio[keys[k]] = cNumratio[keys[k]] / cNumratioAdjust2 / countOfDaysThisYear[keys[k]];    
        }
        cNumForecast[keys[k]] = cNumratio[keys[k]] * customersNumForecast ;
    }

    let salesTargetForAdjust = 0 ;
    for( let k=0; k<l; ++k ){
        salesTargetForAdjust += CUPratio[keys[k]] * CUPTarget * cNumForecast[keys[k]] * countOfDaysThisYear[keys[k]] ;
        
    }
    for( let k=0; k<l; ++k ){
        CUPratio[keys[k]] = CUPratio[keys[k]] / salesTargetForAdjust * (customersNumForecast*CUPTarget);
        CUPForecast[keys[k]] = CUPratio[keys[k]] * CUPTarget ;
    }


    //客数、単価の予想値（入力値）から、売上目標値の算出
    let weekdaySalesT = 0;
    let holidaySalesT = 0;
    let customersNumT = 0;
    let salesTarget = 0; 
    let weekdayCustomersNumT = 0;
    let holidayCustomersNumT = 0;
    for(let k=0; k<l; ++k){
        if(k!==0 && k!==6 && k!==7){
            weekdaySalesT += cNumForecast[keys[k]]*CUPForecast[keys[k]]*countOfDaysThisYear[keys[k]] ;
            weekdayCustomersNumT += cNumForecast[keys[k]]*countOfDaysThisYear[keys[k]] ;
        }else{
            holidaySalesT += cNumForecast[keys[k]]*CUPForecast[keys[k]]*countOfDaysThisYear[keys[k]] ;
            holidayCustomersNumT += cNumForecast[keys[k]]*countOfDaysThisYear[keys[k]] ;
        }
        customersNumT += Math.round(cNumForecast[keys[k]]*countOfDaysThisYear[keys[k]]) ;
        salesForecast[keys[k]] = cNumForecast[keys[k]]*CUPForecast[keys[k]] ;
        salesTarget += Math.round(salesForecast[keys[k]] * countOfDaysThisYear[keys[k]] /1000)*1000;
    }
    document.getElementById(sNameEng+"sum").children[7].textContent = salesTarget ;
    document.getElementById(sNameEng+"sum").children[8].textContent = customersNumT ;

    //テーブルに1日毎の予測値を付与
    for(let i=0; i<j; ++i){
        let targetTd = $thisYearDateCells[i] ;
        for(let k=0; k<l; ++k){
            if(targetTd.classList.contains(keys[k])){
                targetTd.nextElementSibling.textContent = Math.round(salesForecast[keys[k]]/1000)*1000 ;
                targetTd.nextElementSibling.nextElementSibling.textContent = Math.round(cNumForecast[keys[k]]) ;
                targetTd.nextElementSibling.nextElementSibling.nextElementSibling.textContent = Math.round(CUPForecast[keys[k]]) ;
            }
        }
    }

    /*
    let SPdaySales = Number(document.getElementsByClassName("DaySP"+sNameEng)[1].nextSibling.textContent);
    let newSPdaySales = SPdaySales*1.6 ;
    let substruction = newSPdaySales-SPdaySales;
    subsalesTarget = salesTarget-substruction;
    for(let k=0; k<l; k++){
        salesForecast[keys[k]] = Math.round(salesForecast[keys[k]]*subsalesTarget/salesTarget);
    }
    document.getElementsByClassName("DaySP"+sNameEng)[1].nextSibling.textContent = newSPdaySales;
*/
    //今年の平日、休日毎のまとめ（売上、客数、単価）
    let $trForSummary = document.getElementById('tbodySummary'+sNameEng).children;
    $trForSummary[1].children[6].textContent = "平日"+ TweekdayCount +"日平均" ; $trForSummary[1].children[7].textContent = Math.round(weekdaySalesT/TweekdayCount) ;
    $trForSummary[1].children[8].textContent = Math.round(weekdayCustomersNumT/TweekdayCount) ; $trForSummary[1].children[9].textContent = Math.round(weekdaySalesT/weekdayCustomersNumT) ;
    $trForSummary[2].children[6].textContent = "休日"+ TholidayCount +"日平均" ; $trForSummary[2].children[7].textContent = Math.round(holidaySalesT/TholidayCount) ;
    $trForSummary[2].children[8].textContent = Math.round(holidayCustomersNumT/TholidayCount) ; $trForSummary[2].children[9].textContent = Math.round(holidaySalesT/holidayCustomersNumT) ;
    $trForSummary[1].children[10].textContent = Math.round(salesTarget/(weekdayCustomersNumT+holidayCustomersNumT)) ;
    
}