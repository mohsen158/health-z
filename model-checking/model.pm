dtmc

    const int price = 10;
    const double r_b =1;
    const double okp_b= min(1, pow((deposit/price),r_b));
    const double kop_b=1- okp_b;

    const double r_s =1;
    const double okp_s= min(1, pow((deposit/price),r_s));
    const double kop_s=1- okp_s;
    const int deposit= 9;    
  
 module Buyer
 count: [0..1000] init 0;
    b : [0..6] init 0;
    deposit_b: [0..10] init 0;
    
    value_b: [0..1000] init 50;
    money_b:[0..1000] init 100;
    pay:bool init false;
    deny_b:bool init false;
    [deposit] b=0 & money_b-deposit>0 & count+1<1001 -> 1 : (b'=1)& (money_b'=money_b -deposit) & (pay'=false)& (deny_b'=false) & (count'=count+1);
    //[ship] b=1 & sent=false  ->(value_b'=value_b+price);
    //[pay] b=1 & pay =false -> okp_b:(b'=2) & (pay'=true) & (money_b'=money_b-price); 
    [] b=1 & money_b-deposit- price>0  -> kop_b:(b'=4)&(deny_b'=true) + okp_b:(b'=2) & (pay'=true) & (money_b'=money_b-price);
     
    //[sent] s=1  & value_b +price <1000-> (value_b'=value_b+price);
    [] b=2 &s!=1 & sent=false -> 1: (b'=4)&(deny_b'=true);
    [] b=2 &s!=1 & sent =true-> 1: (b'=5);
    
//[] b=5 -> (deny_b'=false);
    
    [clearing_deny] (b=5 | b=4) & (s=5 | s=4) &(!deny_b  & !deny_s) &(money_b+deposit <1001)->   (money_b'=money_b+deposit) & (b'=6) ;
    [clearing_conf] (b=5 | b=4) & (s=5 | s=4) &(deny_b  |deny_s)  ->    (b'=6) ;

   [reset] b=6 &!sent  -> (b'=0)  ;
   [reset] b=6 & sent &value_b+price<1001 -> (b'=0)  &(value_b'=value_b+price);

endmodule

module Seller

    s : [0..6] init 0;
    deposit_s: [0..10] init 0;
    value_s: [0..1000] init 100;
    money_s:[0..1000] init 50;
    sent:bool init false;
    deny_s : bool init false;
    [deposit] s=0 & money_s-deposit>0  & count+1<1001 -> 1:(s'=1)& (money_s'=money_s-deposit)&(sent'=false)& (deny_s'=false);
    //[ship] s=1 & sent=false -> okp_s: (s'=2) &(value_s'=value_s - price);
    //[pay] s=2 & pay=false -> (s'=2) &(money_s'=money_s+price);
    [] s=1  & value_s - price>0-> kop_s:(s'=4)&(deny_s'=true) + okp_s: (s'=2) &(value_s'=value_s - price)&(sent'=true);
     
   // [pay] b=1 & money_s+price<1000  -> (money_s'=money_s+price);
    [] s=2 & b!=1& pay=false -> 1: (s'=4) &(deny_s'=true);
    [] s=2 & b!=1 & pay=true-> 1: (s'=5);
    
//[] s=5 -> (deny_s'=false);
   [clearing_deny] (s=5 | s=4) &(b=5 | b=4) & (!deny_s  & !deny_b) &(money_s+deposit <1001)->   (money_s'=money_s+deposit) & (s'=6) ;
   [clearing_conf] (b=5 | b=4) & (s=5 | s=4) &(deny_b  |deny_s)  ->    (s'=6) ;
[reset] s=6 & !pay -> (s'=0) ;
[reset] s=6 &  pay  & money_s+price<1001-> (s'=0)    & ( money_s'=money_s+price);
endmodule