const $tableHead = document.getElementsByClassName('noneDisplay')[0] ;
const $tableContainer = document.getElementById('tableContainer');

function createTable(){
    let yearmonth = document.getElementById('setYearMonth').value ;
    for(let i=0; i<9; ++i){
        if(Object.keys(shop[i]).length){
            sNameEng = shopNameEng[i];
            sNameJap = shopNameJap[i]
            console.log(yearmonth);
            let lastYearNum = new Date(yearmonth+"/1").getFullYear();
            let thisYearNum = new Date(yearmonth+"/1").getFullYear()+1;
            let Month = new Date(yearmonth+"/1").getMonth()+1
            
            let table = document.createElement('table');
            $tableContainer.appendChild(table);
            table.setAttribute('class','shopTable');
            table.id = sNameEng+"Table";

            createTHead(table,sNameEng,sNameJap,lastYearNum,thisYearNum);
            createTBody(table,sNameEng,shop[i][yearmonth],Month);
            console.log(shop[i][yearmonth]);
            setDayOfWeek(sNameEng,lastYearNum,thisYearNum,new Date(yearmonth+"/1").getMonth()+1);
            createSpace(table);
            createTBody2(table,sNameEng);
            createSpace(table);
            calLastYearSales(sNameEng);
        }
    }
}

function createTHead(table,sNameEng,sNameJap,lastYearNum,thisYearNum){
    
    let tHead = $tableHead.cloneNode(true);
    table.appendChild(tHead)

    tHead.setAttribute('class','tablehead');
    tHead.id = sNameEng+"THead";
    tHead.firstElementChild.firstElementChild.textContent = sNameJap;
    tHead.lastElementChild.children[0].textContent = lastYearNum+"年";
    tHead.lastElementChild.children[6].textContent = thisYearNum+"年";
    tHead.children[1].children[7].children[1].id = "CUPtarget"+sNameEng;
    tHead.children[1].children[8].children[1].id = "customerNumForecast"+sNameEng;
    tHead.children[1].children[9].firstElementChild.id = "calBTN"+sNameEng;

}

function createTBody(table,sNameEng,shopOfYearMonth,Month){
    
    let tBody = document.createElement('tbody');
    table.appendChild(tBody);
    
    tBody.setAttribute('name','month'+Month)
    tBody.setAttribute('class','tablebody');
    tBody.id = sNameEng+"TBody";
    
    createRow(tBody,shopOfYearMonth);

}

function createRow(tBody, shopOfYearMonth){
    let ObKeys = Object.keys(shopOfYearMonth);
    let dateLength = ObKeys.length;
    for(let row=0,subrow=0; row<dateLength; ++row){
        let propsOfKey = ObKeys[row] ;
        if(propsOfKey-(row+subrow) != 1){
            let substruction = propsOfKey-(row+subrow)-1 ;
            for(let k=0; k<substruction; ++k){
                let tr = document.createElement('tr');
                tBody.appendChild(tr);
                for(let l=0; l<17; ++l){
                    let td = document.createElement('td');
                    tr.appendChild(td)
                    if(l!==1 && l!==5){
                    }else if(l===1){
                        td.textContent = 0;
                    }else if(l===5){
                        td.setAttribute('class','space');
                    }
                }
                tr.children[1].textContent = 0 ;
                tr.children[2].textContent = 0 ;
                tr.children[5].setAttribute('class','space');
            }
            subrow += substruction;
        }
        
        let tr = document.createElement('tr');
        tBody.appendChild(tr);
        for(let i=0; i<17; ++i){
            let td = document.createElement('td');
            tr.appendChild(td);
        }

        tr.children[5].setAttribute('class','space');
        setSalesCustomerNum(tr, shopOfYearMonth[propsOfKey]);
    }
    createSumROW(tBody);

}

function setSalesCustomerNum(tr,shopOfMonthDate){
    let sales = 0 ;
    let customerNum = shopOfMonthDate.length ;
    for(let k=0; k<customerNum; ++k){
        sales += shopOfMonthDate[k].sales;
    }
    tr.children[1].textContent = sales ;
    tr.children[2].textContent = customerNum ;

}

function setDayOfWeek(sName,lastYear,thisYear,month){
    let targetTBody = document.getElementById(sName+'TBody');
    let j = targetTBody.childElementCount-1 ;
    let wedCount1 = 0;
    let wedCount2 = 0; 
    for(let i=0; i<j; ++i){
        let date = i+1 ;
        let DayOfnum1 = new Date(lastYear+"/"+month+"/"+date).getDay();
        let DayOfnum2 = new Date(thisYear+"/"+month+"/"+date).getDay();

        targetTBody.children[i].children[0].setAttribute('class','lastYearDate LYDcell'+sName+' Day'+DayOfnum1);
        targetTBody.children[i].children[6].setAttribute('class','thisYearDate TYDcell'+sName+' Day'+DayOfnum2);
        
        targetTBody.children[i].children[0].textContent = month+"/"+ date +"("+ dayOfWeek[DayOfnum1] +")";
        targetTBody.children[i].children[6].textContent = month+"/"+ date +"("+ dayOfWeek[DayOfnum2] +")";

        setSPHoliday(sName,targetTBody.children[i].children[0], targetTBody.children[i].children[6], lastYear,thisYear,month,date,DayOfnum1,DayOfnum2);
        if(DayOfnum1===3 && wedCount1 !==2){
            ++wedCount1;
        }else if(DayOfnum1===3 && wedCount1 ===2){
            ++wedCount1;
            targetTBody.children[i].children[0].classList.remove("Day3");
            targetTBody.children[i].children[4].textContent = "MTG"
        }
        if(DayOfnum2===3 && wedCount2 !==2){
            ++wedCount2;
        }else if(DayOfnum2===3 && wedCount2 ===2){
            ++wedCount2;
            targetTBody.children[i].children[6].classList.remove("Day3");
            targetTBody.children[i].children[16].textContent = "MTG"
        }
    }

    const SPdayKey = Object.keys(SPdays);
    let k = SPdayKey.length;
    for(let i=0; i<k; i++){
        if(sName === SPdayKey[i]){
            if(targetTBody.children[i].children[4].textContent !== "MTG" && targetTBody.children[i].children[16].textContent !== "MTG"){

                let td1 = targetTBody.children[SPdays[SPdayKey[i]]-1].children[0];
                let td2 = targetTBody.children[SPdays[SPdayKey[i]]-1].children[6];
                if(!td1.classList.contains("Day7")){
                    td1.setAttribute('class','lastYearDate LYDcell'+sName+' DaySP'+' sub'+td1.classList.item(2));
                    td2.setAttribute('class','thisYearDate TYDcell'+sName+' DaySP'+' sub'+td2.classList.item(2));
                }else{
                    td1.setAttribute('class','lastYearDate LYDcell'+sName+' DaySP'+' '+td1.classList.item(3)+" SP7");
                    td2.setAttribute('class','thisYearDate TYDcell'+sName+' DaySP'+' '+td2.classList.item(3)+" SP7");
                }
                td1.id = sName+"LYDaySP";
                td2.id = sName+"TYDaySP";

                //targetTBody.children[SPdays[SPdayKey[i]]-1].children[0].setAttribute('class','lastYearDate LYDcell'+sName+' DaySP');
                //targetTBody.children[SPdays[SPdayKey[i]]-1].children[6].setAttribute('class','thisYearDate TYDcell'+sName+' DaySP');
                targetTBody.children[SPdays[SPdayKey[i]]-1].children[4].textContent = "感謝デー";
                targetTBody.children[SPdays[SPdayKey[i]]-1].children[16].textContent = "感謝デー";

            }else if(targetTBody.children[i].children[4].textContent !== "MTG" && targetTBody.children[i].children[16].textContent === "MTG"){

                let td1 = targetTBody.children[SPdays[SPdayKey[i]]-1].children[0];
                let td2 = targetTBody.children[SPdays[SPdayKey[i+1]]-1].children[6];

                if(!td1.classList.contains("Day7")){
                    td1.setAttribute('class','lastYearDate LYDcell'+sName+' DaySP'+' sub'+td1.classList.item(2));
                    td2.setAttribute('class','thisYearDate TYDcell'+sName+' DaySP'+' sub'+td2.classList.item(2));
                }else{
                    td1.setAttribute('class','lastYearDate LYDcell'+sName+' DaySP'+' '+td1.classList.item(3)+" SP7");
                    td2.setAttribute('class','thisYearDate TYDcell'+sName+' DaySP'+' '+td2.classList.item(3)+" SP7");
                }
                td1.id = sName+"LYDaySP";
                td2.id = sName+"DaySP";
                
                //targetTBody.children[SPdays[SPdayKey[i]]-1].children[0].setAttribute('class','lastYearDate LYDcell'+sName+' DaySP');
                //targetTBody.children[SPdays[SPdayKey[i+1]]-1].children[6].setAttribute('class','thisYearDate TYDcell'+sName+' DaySP');
                targetTBody.children[SPdays[SPdayKey[i]]-1].children[4].textContent = "感謝デー";
                targetTBody.children[SPdays[SPdayKey[i+1]]-1].children[16].textContent = "感謝デー";

            }else if(targetTBody.children[i].children[4].textContent === "MTG" && targetTBody.children[i].children[16].textContent !== "MTG"){

                let td1 = targetTBody.children[SPdays[SPdayKey[i+1]]-1].children[0];
                let td2 = targetTBody.children[SPdays[SPdayKey[i]]-1].children[6];

                if(!td1.classList.contains("Day7")){
                    td1.setAttribute('class','lastYearDate LYDcell'+sName+' DaySP'+' sub'+td1.classList.item(2));
                    td2.setAttribute('class','thisYearDate TYDcell'+sName+' DaySP'+' sub'+td2.classList.item(2));
                }else{
                    td1.setAttribute('class','lastYearDate LYDcell'+sName+' DaySP'+' '+td1.classList.item(3)+" SP7");
                    td2.setAttribute('class','thisYearDate TYDcell'+sName+' DaySP'+' '+td2.classList.item(3)+" SP7");
                }
                td1.id = sName+"LYDaySP";
                td2.id = sName+"DaySP";
                
                //targetTBody.children[SPdays[SPdayKey[i+1]]-1].children[0].setAttribute('class','lastYearDate LYDcell'+sName+' DaySP');
                //targetTBody.children[SPdays[SPdayKey[i]]-1].children[6].setAttribute('class','thisYearDate TYDcell'+sName+' DaySP');
                targetTBody.children[SPdays[SPdayKey[i+1]]-1].children[4].textContent = "感謝デー";
                targetTBody.children[SPdays[SPdayKey[i]]-1].children[16].textContent = "感謝デー";

            }
        }
    }
/*
    if(sName = "kichijoji"){
        targetTBody.children[7].children[0].classList.add('DaySP');
        targetTBody.children[7].children[6].classList.add('DaySP');
        targetTBody.children[7].children[4].textContent = "感謝デー";
    }else if(sName = "shimokita"){
        targetTBody.children[18].children[0].classList.add('DaySP');
        targetTBody.children[18].children[6].classList.add('DaySP');
        targetTBody.children[18].children[4].textContent = "感謝デー";
    }*/
}

function createSpace(table){
    let tBodyForSpace = document.createElement('tbody');
    table.appendChild(tBodyForSpace);
    tBodyForSpace.setAttribute('class','tbodySpace');
    let trForSpace = document.createElement('tr');
    tBodyForSpace.appendChild(trForSpace);
    let tdForSpace = document.createElement('td');
    trForSpace.appendChild(tdForSpace);
    tdForSpace.setAttribute('class','space');
    tdForSpace.setAttribute('colspan','17');
}

function createSumROW(tBody){
    
    let sumSales = 0 ;
    let sumCustomers = 0 ;
    
    let j = tBody.childElementCount ;
    for(let i=0; i<j; ++i){
        sumSales += Number(tBody.children[i].children[1].textContent) ;
        sumCustomers += Number(tBody.children[i].children[2].textContent) ;
    }
    
    let tr = document.createElement('tr');
    tBody.appendChild(tr)
    tr.id = tBody.id.slice(0,-5)+"sum"
    for(let i=0; i<17; ++i){
        let td = document.createElement('td');
        tr.appendChild(td);
    }

    tBody.lastElementChild.children[0].textContent = "合計" ;
    tBody.lastElementChild.children[6].textContent = "合計" ;
    tBody.lastElementChild.children[1].textContent = sumSales ;
    tBody.lastElementChild.children[2].textContent = sumCustomers ;
    
}

function createTBody2(table,sNameEng){
    let tBodyForSummary = document.createElement('tbody');
    table.appendChild(tBodyForSummary);
    tBodyForSummary.setAttribute('id','tbodySummary'+sNameEng);
    
    for(let i=0; i<3; ++i){
        let trForSummary = document.createElement('tr');
        tBodyForSummary.appendChild(trForSummary);
        for(let k=0; k<11; ++k){
            let tdForSummary = document.createElement('td');
            trForSummary.appendChild(tdForSummary);
        }
    }
    let targetTr = tBodyForSummary.children ;
    targetTr[0].children[1].textContent = "売上実績" ;
    targetTr[0].children[2].textContent = "客数" ;
    targetTr[0].children[3].textContent = "客単価" ;
    targetTr[0].children[4].textContent = "全日単価" ;
    targetTr[0].children[7].textContent = "売上目標" ;
    targetTr[0].children[8].textContent = "客数予想" ;
    targetTr[0].children[9].textContent = "単価予想" ;
    targetTr[0].children[10].textContent = "全日単価" ;
    for(let i=0; i<3; ++i){
        targetTr[i].children[5].setAttribute('class','space');
    }
    targetTr[2].children[4].setAttribute('class','space');
    targetTr[2].children[10].setAttribute('class','space');

    let tr1 = document.createElement('tr');
    let tdSpace = document.createElement('td');
    tBodyForSummary.appendChild(tr1);
    tr1.appendChild(tdSpace);
    tdSpace.setAttribute("colspan","17");
    tdSpace.setAttribute("class","space");

    let tr2 = document.createElement('tr');
    tBodyForSummary.appendChild(tr2);
    for(let i=0; i<7; ++i){
        let tdForSummary = document.createElement('td');
        tr2.appendChild(tdForSummary);
        if(i === 1 || i === 2 || i === 5 || i === 6){
            tdForSummary.setAttribute('colspan','2');
        }else if(i===3){
            tdForSummary.setAttribute('class','space');
        }else{
            tdForSummary.textContent = "前年比";
        }
    }

}