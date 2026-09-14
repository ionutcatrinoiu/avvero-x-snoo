from pathlib import Path
p=Path('/mnt/data/snoo_update/index.html')
s=p.read_text(encoding='utf-8')
s=s.replace("['LOCAȚIE','Strada și număr','Introdu strada și numărul imobilului.','street','Ex. Strada Republicii 25','text']", "['LOCAȚIE','Strada și număr','Introdu strada și numărul imobilului.','street','Stradă, număr','text']")
# Insert locality support after state declaration
needle="const S={gdpr:false,first:'',last:'',phone:'',email:'',optic:'',role:'',city:'',county:'',street:'',myopia:'',myoless:''};let n=0,lock=false;"
insert=needle+"""
const COUNTY_BY_CODE={AB:'Alba',AR:'Arad',AG:'Argeș',BC:'Bacău',BH:'Bihor',BN:'Bistrița-Năsăud',BT:'Botoșani',BR:'Brăila',BV:'Brașov',B:'București',BZ:'Buzău',CL:'Călărași',CS:'Caraș-Severin',CJ:'Cluj',CT:'Constanța',CV:'Covasna',DB:'Dâmbovița',DJ:'Dolj',GL:'Galați',GR:'Giurgiu',GJ:'Gorj',HR:'Harghita',HD:'Hunedoara',IL:'Ialomița',IS:'Iași',IF:'Ilfov',MM:'Maramureș',MH:'Mehedinți',MS:'Mureș',NT:'Neamț',OT:'Olt',PH:'Prahova',SJ:'Sălaj',SM:'Satu Mare',SB:'Sibiu',SV:'Suceava',TR:'Teleorman',TM:'Timiș',TL:'Tulcea',VL:'Vâlcea',VS:'Vaslui',VN:'Vrancea'};
let RO_CITIES=[],CITY_INDEX=new Map(),localitiesReady=false,localitiesFailed=false;
function cityKey(v){return String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/ș/g,'s').replace(/ț/g,'t')}
function parseCityRow(r){
 const name=r.nume||r.name||r.oras||r.city||''; const code=String(r.judet||r.county||r.judetAuto||r.countyCode||'').toUpperCase();
 const county=COUNTY_BY_CODE[code]||r.judetNume||r.countyName||(code==='-'?'București':'');
 return name?{name,county:cityKey(name)==='bucuresti'?'București':county}:null;
}
async function loadRomaniaCities(){
 try{const r=await fetch('/romania-cities.json',{cache:'force-cache'});if(!r.ok)throw new Error('cities');const raw=await r.json();const rows=Array.isArray(raw)?raw:(raw.data||raw.orase||[]);RO_CITIES=rows.map(parseCityRow).filter(x=>x&&x.county);CITY_INDEX=new Map(RO_CITIES.map(x=>[cityKey(x.name),x]));localitiesReady=RO_CITIES.length>250;if(!localitiesReady)throw new Error('cities');}
 catch(e){localitiesFailed=true;console.error('Lista orașelor nu a putut fi încărcată',e)}
}
loadRomaniaCities();
"""
s=s.replace(needle,insert)
# body input: add datalist for city/county
old=":`<input id=\"field\" class=\"field\" type=\"${x[5]}\" inputmode=\"${x[5]==='tel'?'tel':'text'}\" placeholder=\"${x[4]}\" value=\"${esc(S[x[3]])}\"><div class=\"err\" id=\"err\"></div>`;"
new=":`<input id=\"field\" class=\"field\" type=\"${x[5]}\" inputmode=\"${x[5]==='tel'?'tel':'text'}\" placeholder=\"${x[4]}\" value=\"${esc(S[x[3]])}\" ${x[3]==='city'?'list=\"cityList\" autocomplete=\"off\"':x[3]==='county'?'list=\"countyList\" autocomplete=\"off\"':''}>${x[3]==='city'?'<datalist id=\"cityList\">'+RO_CITIES.map(c=>'<option value=\"'+esc(c.name)+'\"></option>').join('')+'</datalist>':x[3]==='county'?'<datalist id=\"countyList\">'+Object.values(COUNTY_BY_CODE).filter(c=>c!==\'București\').map(c=>'<option value=\"'+esc(c)+'\"></option>').join('')+'</datalist>':''}<div class=\"err\" id=\"err\"></div>`;"
if old not in s: raise SystemExit('input needle missing')
s=s.replace(old,new)
# Add validation into next after phone
needle2="if(x[3]==='phone'&&!ph(v)){err.textContent='Introdu un număr mobil din România.';return}S[x[3]]="
rep2="""if(x[3]==='phone'&&!ph(v)){err.textContent='Introdu un număr mobil din România.';return}
if(x[3]==='city'){
 if(!localitiesReady){err.textContent=localitiesFailed?'Lista orașelor nu s-a putut încărca. Reîncarcă pagina.':'Se încarcă lista orașelor. Încearcă din nou într-o secundă.';return}
 const c=CITY_INDEX.get(cityKey(v));if(!c){err.textContent='Selectează un oraș real din România din lista afișată.';return}v=c.name;S.city=c.name;if(c.county)S.county=c.county;
}
if(x[3]==='county'){
 const allowed=Object.values(COUNTY_BY_CODE).filter(c=>c!=='București');const match=allowed.find(c=>cityKey(c)===cityKey(v));if(!match){err.textContent='Selectează un județ din România din lista afișată.';return}
 const selected=CITY_INDEX.get(cityKey(S.city));if(selected&&selected.county&&cityKey(match)!==cityKey(selected.county)){err.textContent='Județul nu corespunde orașului selectat.';return}v=match;
}
S[x[3]]="""
if needle2 not in s: raise SystemExit('validation needle missing')
s=s.replace(needle2,rep2)
p.write_text(s,encoding='utf-8')
