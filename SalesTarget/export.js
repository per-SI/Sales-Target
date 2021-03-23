document.getElementById('dlXlsx').addEventListener('click', function () {
    let wopts = {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary'
    };
  
    let workbook = {SheetNames: [], Sheets: {}};
  
    $table = document.getElementsByTagName('table');
    let j = $table.length;
    for( let i=1; i<j ; ++i){
      let n = $table[i].id;
      workbook.SheetNames.push(n);
      workbook.Sheets[n] = XLSX.utils.table_to_sheet($table[i], wopts);
    }
  
    console.log(workbook);
  
    let wbout = XLSX.write(workbook, wopts);
    console.log(wbout);
  
    function s2ab(s) {
      let buf = new ArrayBuffer(s.length);
      let view = new Uint8Array(buf);
      for (var i = 0; i != s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf;
    }
  
    saveAs(new Blob([s2ab(wbout)], {type: 'application/octet-stream'}), 'test.xlsx');
  }, false);