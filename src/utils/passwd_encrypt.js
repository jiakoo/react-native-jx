// import RSAKey from './rsa'
import RSAKey from './rsa'

var b64map="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b64padchar="=";
var hex2b64 = function(h) {
   var i;
   var c;
   var ret = "";
   for(i = 0; i+3 <= h.length; i+=3) {
     c = parseInt(h.substring(i,i+3),16);
     ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
   }
   if(i+1 == h.length) {
     c = parseInt(h.substring(i,i+1),16);
     ret += b64map.charAt(c << 2);
   }
   else if(i+2 == h.length) {
     c = parseInt(h.substring(i,i+2),16);
     ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
   }
   while((ret.length & 3) > 0) ret += b64padchar;
   return ret;
}

 export default function PasswdEncrypt(n,e){
	 var rsa = new RSAKey();
	 rsa.setPublic(n,e); //modulus, public exponent as hex strings
	 this.encrypt = function(text,random){
		 var res = new Array(2*text.length);
		 for(var i = 0; i<text.length; i++){
			 res[2*i] = random.charAt(i);
			 res[2*i+1] = text.charAt(i);
		 }
		 return hex2b64(rsa.encrypt(res.join('')));
	 }
 }

