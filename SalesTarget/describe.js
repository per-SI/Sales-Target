const $dropZone = document.getElementById('dropZone');
//const $table = document.getElementById('table');

let nagoya={}, shimokita={}, minamisenba={}, harajuku={}, kyoto={}, kichijoji={}, popup={}, shinsaibashi={}, kamakura={} ;
let shop = [nagoya,shimokita,minamisenba,harajuku,kyoto,kichijoji,popup,shinsaibashi,kamakura] ;
let shopNameJap = ["名古屋","下北沢","南船場","原宿","京都","吉祥寺","POPUP","心斎橋","鎌倉"];
let shopNameEng = ["nagoya","shimokita","minamisenba","harajuku","kyoto","kichijoji","popup","shinsaibashi","kamakura"];
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

クラス内関数
・getDate関数
・getSales関数

名古屋と鎌倉だけ時間帯を別にする
1.店舗で振り分ける
2.時間帯で分ける（12～15、15～17、17～19）

店舗ID
１＝名古屋
２＝下北沢
３＝南船場
４＝原宿
５＝京都
６＝吉祥寺
７＝popup
８＝心斎橋
９＝鎌倉
*/