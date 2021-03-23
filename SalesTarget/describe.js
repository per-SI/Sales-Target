const $dropZone = document.getElementById('dropZone');

let nagoya={}, shimokita={}, minamisenba={}, harajuku={}, kyoto={}, kichijoji={}, popup={}, shinsaibashi={}, kamakura={} ;
let shop = [nagoya,shimokita,minamisenba,harajuku,kyoto,kichijoji,popup,shinsaibashi,kamakura] ;
let shopNameJap = ["サンプル１","サンプル２","サンプル３","サンプル４","サンプル５","サンプル６","サンプル７","サンプル８","サンプル９"];
let shopNameEng = ["sample1","sample2","sample3","sample4","sample5","sample6","sample7","sample8","sample9"];
const SPdays = {
  "nagoya":7,
  "shimokita":19,
  "minamisenba":1,
  "harajuku":28,
  "kyoto":1,
  "kichijoji":8,
  "popup":0,
  "shinsaibashi":28,
  "kamakura":20
}


let customerNumTarget = 0;
let CUPTarget = 0 ;


class transaction {

  constructor(tranID,sales,shop,date){
    this.id = tranID ;
    this.sales = Number(sales) ;
    this.shop = shop ;
    this.date = new Date(date) ;
  }

  getYMD(){
    return `${this.getFullYear()}/${this.getMonth()}/${this.getDate()}`
  }

  getFullYear(){
    return this.date.getFullYear();
  }

  getMonth(){
    return this.date.getMonth()+1;
  }

  getDate(){
    return this.date.getDate();
  }
  
  getHours(){
    return this.date.getHours() ;
  }
  getDayOfWeek(){
    return this.date.getDay();
  }

}


/*
取引履歴クラス＝＞インスタンス　このインスタンスを各店配列に振り分ける。
店舗ごとの取引履歴インスタンスを作成する。
1.取引履歴を取引IDをインデックスとして整理（同一IDはカウントしないように）→　for文の中でif判定
2.店舗IDで分類していく
*/
