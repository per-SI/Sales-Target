function handleDrop(e) {
    e.stopPropagation(); e.preventDefault();

    let f ;
    if(e.dataTransfer){
        f = e.dataTransfer.files[0] ;
    }else{
        f = e.target.files[0] ;
    }
  
    let reader = new FileReader();
    reader.onload = function(e) {

      let data = new Uint8Array(e.target.result);
      let workbook = XLSX.read(data, {type: 'array'});
      createShopInstance(workbook);

    }

    reader.readAsArrayBuffer(f);  
}

function createShopInstance(workbook){

  let range = XLSX.utils.decode_range(workbook.Sheets[workbook.SheetNames[0]]['!ref']);

  let colNumbers = []; //取り込んだエクセルシート上における、[0]=>取引IDの、[1]=>売上の、[2]=>店舗の、[3]=>日付の、カラムnumber、[4]=>取消区分（通常：0、取消：1）
  for(let col=range.s.c; col<range.e.c; ++col){

    let adress = XLSX.utils.encode_cell({r:0, c:col});
    let cell = workbook.Sheets[workbook.SheetNames[0]][adress];
    if(cell.w == "取引ID"){ colNumbers[0] = col ; }
    if(cell.w == "合計"){ colNumbers[1] = col ; }
    if(cell.w == "店舗ID"){ colNumbers[2] = col ; }
    if(cell.w == "取引日時"){ colNumbers[3] = col ; }
    if(cell.w == "取消区分 (0:通常、1：取消)"){ colNumbers[4] = col ; }
    console.log(cell);
  }
  
  let lastID ;
  let nowID ;
  for(let row=range.s.r+1; row<range.e.r+1; ++row){
    
    let arrayForInstance = [] ;
    let PUSHorNOT = 1;
    for(let i=0; i<5; ++i){

      let adress = XLSX.utils.encode_cell({r:row, c:Number(colNumbers[i])});
      let cell = workbook.Sheets[workbook.SheetNames[0]][adress];
      arrayForInstance.push(cell.w);

      if(i===0){
        if(arrayForInstance[0] !== lastID){
          nowID = arrayForInstance[0]
        }else{
          PUSHorNOT = 0 ; 
          break;
        }
      }
      if(i===4 && arrayForInstance[4] == 1){
        PUSHorNOT = 0 ;
      }

    }
    lastID = nowID ;
    if(PUSHorNOT === 1 ){
      let instance = new transaction(arrayForInstance[0],arrayForInstance[1],arrayForInstance[2],arrayForInstance[3]);
      
      //各shop配列の中に年月、さらにその中に日付（DATE）をキーとしたオブジェクトを作る。
      if(!shop[arrayForInstance[2]-1][`${instance.getFullYear()}/${instance.getMonth()}`]){
        shop[arrayForInstance[2]-1][`${instance.getFullYear()}/${instance.getMonth()}`] = {};
      }
      if(!shop[arrayForInstance[2]-1][`${instance.getFullYear()}/${instance.getMonth()}`][`${instance.getDate()}`]){
        shop[arrayForInstance[2]-1][`${instance.getFullYear()}/${instance.getMonth()}`][`${instance.getDate()}`] = [];
      }
      shop[arrayForInstance[2]-1][`${instance.getFullYear()}/${instance.getMonth()}`][`${instance.getDate()}`].push(instance);
    }
  }
  console.log(shop);
}

//$dropZone.addEventListener('drop', handleDrop, false);
