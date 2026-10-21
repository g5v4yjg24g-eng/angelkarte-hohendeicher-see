/* Fischereirecht Hamburg – Daten fest eingebaut (offline nutzbar). Jede Angabe: Quelle + Prüfstand + Prüfstatus.
   WICHTIG: Der amtliche Text (HmbFAnG, HmbFAnGDVO) konnte bei der Erstellung NICHT direkt eingesehen werden.
   Alle Zahlenwerte stammen aus Sekundärquellen und sind deshalb als „ungeklärt“ gekennzeichnet. */
(()=>{
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CHECKED='2026-10-21',STALE_DAYS=180;
const LAW='https://www.landesrecht-hamburg.de/';
const LAWS='Hamburgisches Fischerei- und Angelgesetz (HmbFAnG) und Verordnung zur Durchführung des HmbFAnG (HmbFAnGDVO) – amtlicher Text NICHT geprüft';
const DVO='https://www.hamburg.de/contentblob/12690552/d5e8ddbf455cbd178e2f249b81bc3bd3/data/verordnung-zur-durchfuehrung-des-hamburgischen-fischerei-und-angelgesetzes.pdf';
const HH1='https://www.hamburg.de/politik-und-verwaltung/behoerden/bukea/themen/agrarwirtschaft/fischerei/angelrecht-179416';
const HH2='https://www.hamburg.de/politik-und-verwaltung/behoerden/bukea/themen/agrarwirtschaft/fischerei/angelrecht-179420';
const HH3='https://www.hamburg.de/politik-und-verwaltung/behoerden/bukea/themen/agrarwirtschaft/fischerei';
const ABG='https://serviceportal.hamburg.de/HamburgGateway/Service/Entry/Fischabgab';
const AV='https://anglerverband-hh.de/unsere-gewaesser/hohendeicher-see-oortkatensee',AVG='https://anglerverband-hh.de/unsere-gewaesser/gastkarten',AVS='https://anglerverband-hh.de/unsere-gewaesser/streckensperrungen',AVK='https://anglerverband-hh.de/kontakt',AVB='https://anglerverband-hh.de/news2/hohe-blaualgen-belastung-im-hohendeicher-see-was-heisst-das-fuer-angler-innen';
const RLHH='https://www.hamburg.de/politik-und-verwaltung/behoerden/bukea/aktuelles/pressemeldungen/rote-liste-der-fische-2026-1211788';
const RLD='https://www.Rote-Liste-Zentrum.de/files/NaBiV_170_6_1_RL_Suesswasserfische_und_Neunaugen_2023_20230727-1835.pdf';
// Sekundärquellen für Schonzeiten/Maße (Angelportale, nicht amtlich)
const SEK=[['schonzeiten.de','https://schonzeiten.de/schonzeiten-fische-hamburg-angeln-mindestmasse/'],['angel-fische.de','https://angel-fische.de/schonzeiten-hamburg/'],['fischlexikon.eu','https://www.fischlexikon.eu/sportfischen/schonzeiten/hamburg.php'],['simfisch.de','https://www.simfisch.de/schonzeiten-und-mindestmasse-in-hamburg/'],['blinker.de','https://www.blinker.de/angelmethoden/angeln-allgemein/angeltipps/aktuelle-schonzeiten-und-mindestmasse-aller-bundeslaender/6/']];
const de=d=>d.split('-').reverse().join('.');

/* ---------- Ganzjährig geschützte Arten – laut mehreren Sekundärquellen, amtlich NICHT geprüft ---------- */
const G=[['Bitterling','Rhodeus amarus'],['Elritze','Phoxinus phoxinus'],['Finte','Alosa fallax'],['Groppe, Koppe','Cottus sp.'],['Hasel','Leuciscus leuciscus'],['Maifisch','Alosa alosa'],['Moderlieschen','Leucaspius delineatus'],['Schlammpeitzger','Misgurnus fossilis'],['Schmerle','Barbatula barbatula'],['Steinbeißer','Cobitis taenia'],['Stör','Acipenser sturio'],['Stromgründling','Romanogobio belingi'],['Zährte','Vimba vimba']];
// [Name, wiss. Name, Mindestmaß cm|null, Höchstmaß cm|null, Schonzeit [Monat,Tag,Monat,Tag]|0, Tageshöchstfang|null, Hinweis, widersprüchlich?]
// Alle Werte: Sekundärquellen (siehe SEK). „widersprüchlich“ = Quellen nennen unterschiedliche Werte → keine Zahl übernommen.
const B=[
['Hecht','Esox lucius',45,75,[2,1,5,31],2,'Mehrere Sekundärquellen nennen übereinstimmend Schonzeit 01.02.–31.05., Entnahmefenster 45–75 cm, höchstens 2 Stück pro Tag. Eine Bürgerschafts-Drucksache von 2019 (21/16498) beschreibt Änderungen der Schonzeit.'],
['Zander','Sander lucioperca',45,75,[2,1,5,31],2,'Mehrere Sekundärquellen nennen übereinstimmend Schonzeit 01.02.–31.05., Entnahmefenster 45–75 cm, höchstens 2 Stück pro Tag. Ältere Seiten nennen abweichende Werte (u. a. 40 cm), die vermutlich veraltet sind.'],
['Aal','Anguilla anguilla',null,null,0,3,'Größenregel widersprüchlich: neuere Sekundärquellen nennen ein Entnahmefenster von 45–75 cm, eine ältere ein Mindestmaß von 35 cm. Tageshöchstfang laut schonzeiten.de 3 Stück. Keine Schonzeit genannt.',1],
['Karpfen','Cyprinus carpio',35,null,0,null,'Sekundärquellen nennen ein Mindestmaß von 35 cm und keine Schonzeit.'],
['Schleie','Tinca tinca',25,45,0,null,'Sekundärquellen nennen ein Entnahmefenster von 25–45 cm und keine Schonzeit.'],
['Flussbarsch','Perca fluviatilis',null,null,0,null,'Größenregel widersprüchlich bzw. nur vereinzelt belegt (genannt wird u. a. ein Fenster von 10–35 cm). Keine Schonzeit genannt.',1],
['Quappe','Lota lota',null,null,0,3,'Größenregel widersprüchlich: genannt werden 30–50 cm (Entnahmefenster) und 35 cm (Mindestmaß). Tageshöchstfang laut schonzeiten.de 3 Stück.',1],
['Rapfen','Leuciscus aspius',50,70,0,1,'Nur von wenigen Sekundärquellen genannt: Entnahmefenster 50–70 cm, 1 Stück pro Tag.'],
['Wels','Silurus glanis',null,null,0,null,'Widersprüchlich: neuere Quellen nennen weder Schonzeit noch Mindestmaß, eine ältere Tabelle eine Schonzeit 01.05.–30.06. und 70 cm.',1],
['Lachs','Salmo salar',null,null,0,null,'Widersprüchlich: teils als ganzjährig geschützt genannt, teils mit Schonzeit 15.10.–15.02. nur in Besatzgewässern.',1]];
// Arten, für die keine Hamburger Regel gefunden wurde
const N=[['Rotauge','Rutilus rutilus'],['Rotfeder','Scardinius erythrophthalmus'],['Brassen (Brasse)','Abramis brama']];
const ROWS=[...G.map(([n,w])=>({n,w,k:'g'})),...B.map(([n,w,min,max,sz,bag,note,cx])=>({n,w,min,max,sz,bag,note,cx,k:'b'})),...N.map(([n,w])=>({n,w,k:'n'}))].sort((a,b)=>a.n.localeCompare(b.n,'de'));
const md=d=>(d.getMonth()+1)*100+d.getDate();
const inR=(r,t)=>{const a=r[0]*100+r[1],b=r[2]*100+r[3];return a<=b?t>=a&&t<=b:t>=a||t<=b};
const rng=r=>`${r[1]}.${r[0]}. – ${r[3]}.${r[2]}.`;
const size=r=>r.cx?'ungeklärt (Quellen widersprüchlich)':r.min&&r.max?`Entnahmefenster ${r.min}–${r.max} cm (nur Fische von ${r.min} bis ${r.max} cm dürfen entnommen werden)`:r.min?`Mindestmaß ${r.min} cm`:r.max?`Höchstmaß ${r.max} cm`:'keine Angabe gefunden';
const sizeShort=r=>r.cx?'':r.min&&r.max?`${r.min}–${r.max} cm`:r.min?`ab ${r.min} cm`:'';
const UNV=' (nicht am amtlichen Text geprüft)';
function status(r,t,at){t=t||md(new Date());at=at||'derzeit';
 if(r.k==='g')return['bad','ganzjährig geschützt?','Laut Sekundärquellen ganzjährig geschützt'+UNV+'. Bis zur Klärung: nicht entnehmen, sofort schonend zurücksetzen.'];
 if(r.k==='n')return['mu','ungeklärt','Keine Hamburger Schonzeit oder Größenregel gefunden – das ist KEINE Entnahmeerlaubnis. Amtlichen Text und Gewässerordnung prüfen.'];
 if(r.sz&&inR(r.sz,t))return['bad','Schonzeit? aktiv','Laut Sekundärquellen gilt eine Schonzeit '+rng(r.sz)+UNV+' – sie wäre '+at+' AKTIV. Bis zur Klärung: nicht entnehmen.'];
 if(r.sz)return['ye','ungeklärt',(at==='derzeit'?'Derzeit':'Am Termintag')+' laut Sekundärquellen keine Schonzeit (Schonzeit '+rng(r.sz)+')'+UNV+'. Größenregel: '+size(r)+'.'];
 return['ye','ungeklärt','Keine Schonzeit in den Sekundärquellen genannt'+UNV+'. Größenregel: '+size(r)+'.']}

/* ---------- Weitere Landesregeln (Auszug) – jeweils mit Prüfstatus ---------- */
const OTHER=[
['§ 12 HmbFAnG – Dokumente','Beim Angeln sind ein gültiger Fischereischein und der Nachweis der Fischereiabgabe für das laufende Jahr mitzuführen (Original oder digital bei Online-Zahlung). Die Abgabe gilt für jede angelnde Person, auch an Vereins- und Verbandsgewässern.','Inhalt laut hamburg.de (Suchauszug), Gesetzestext nicht geprüft',HH3],
['Fischereiabgabe – Höhe','Ungeklärt: Sekundärquellen nennen unterschiedliche Beträge. Bitte im Serviceportal nachsehen.','ungeklärt',ABG],
['Fischereischein anderer Länder','Fischereischeine anderer Bundesländer werden laut hamburg.de (Suchauszug) anerkannt, nicht aber prüfungsfreie Scheine (z. B. Touristenfischereischein Schleswig-Holstein).','Suchauszug, Original nicht geprüft',HH3],
['Schutz der Fische, Angelgerät, Umgang mit gefangenen Fischen','Ungeklärt: Die amtliche Seite „Schutz der Fische und Vorgaben zum Angelgerät“ konnte nicht eingesehen werden. Regeln zu Rutenzahl, Ködern, Haken, Setzkescher und Töten sind deshalb hier nicht erfasst.','ungeklärt',HH2]];

/* ---------- Oberfläche ---------- */
const css=document.createElement('style');css.textContent=`.lw{background:var(--card);border:1px solid var(--line);border-radius:10px;margin-bottom:8px;padding:2px 12px}.lw summary{padding:12px 0;cursor:pointer;line-height:1.9}.lw>div{padding:0 0 12px;font-size:14px;line-height:1.5}.bd{display:inline-block;border-radius:12px;padding:1px 9px;font-size:12px;margin-left:6px;color:#111;white-space:nowrap}.bd.bad{background:#f87171}.bd.ok{background:#86efac}.bd.mu{background:#cbd5e1}.bd.or{background:#fb923c}.bd.ye{background:#facc15}.bd.bl{background:#93c5fd}.note{background:var(--warn);border-radius:8px;padding:8px 10px;font-size:13px;margin:8px 0;line-height:1.45}.lwb{overflow-wrap:anywhere}.lwb a{color:var(--ac)}#lwtabs .btn{padding:10px 4px;font-size:14px;overflow-wrap:normal;word-break:normal}`;document.head.appendChild(css);
const days=()=>Math.floor((Date.now()-new Date(CHECKED))/864e5);
const a=(u,t)=>`<a href="${u}" target="_blank" rel="noopener">${t}</a>`;
const sekLinks=()=>SEK.map(([t,u])=>a(u,t)).join(', ');
function head(){const d=days();return `<h3 style="margin-top:4px">Fischereirecht Hamburg</h3><div class="note"><b>⚠ Amtlicher Text nicht geprüft.</b> Bei der Erstellung (${de(CHECKED)}) waren HmbFAnG, HmbFAnGDVO und die Seiten von hamburg.de nicht direkt abrufbar. Alle Schonzeiten und Größenregeln stammen aus Angelportalen (Sekundärquellen) und sind deshalb als <b>ungeklärt</b> markiert. Prüfe vor dem Angeln die ${a(DVO,'Durchführungsverordnung (PDF)')} und die ${a(HH1,'Angelrecht-Seite der BUKEA')}.${d>STALE_DAYS?`<br><b>⚠ Die Erstellung liegt ${d} Tage zurück – Daten können veraltet sein.</b>`:''}<br>Keine Rechtsberatung: Maßgeblich sind der amtliche Text, die Gewässerordnung und deine Angelberechtigung.</div>`}
const q=(id)=>$(id)?$(id).value.toLowerCase():'';
function law(){const t=q('#lq'),fs=$('#lf').value,fm=$('#lm').value;
 const rows=ROWS.filter(r=>(r.n+' '+r.w).toLowerCase().includes(t)&&(fm===''||(fm==='with'?(r.min||r.max):!(r.min||r.max)))&&(()=>{const s=status(r);return fs===''||(fs==='act'&&s[0]==='bad')||(fs==='ganz'&&r.k==='g')||(fs==='befr'&&r.sz)||(fs==='none'&&(r.k==='n'||(r.k==='b'&&!r.sz)))})());
 $('#llist').innerHTML=(rows.length?'':'<p class="mu">Keine Treffer.</p>')+rows.map(r=>{const[c,b,tx]=status(r);return `<details class="lw"><summary><b>${esc(r.n)}</b><span class="bd ${c}">${b}</span>${sizeShort(r)?`<span class="bd mu">${sizeShort(r)}</span>`:''}</summary><div><i>${esc(r.w)}</i><br><b>Status heute:</b> ${esc(tx)}<br><b>Schonzeit:</b> ${r.k==='g'?'– (ganzjährig geschützt, ungeprüft)':r.sz?rng(r.sz)+' (Sekundärquelle)':r.k==='n'?'keine Angabe gefunden':'keine genannt (Sekundärquelle)'}<br><b>Größenregel:</b> ${r.k==='g'?'–':esc(size(r))}<br><b>Tageshöchstfang:</b> ${r.bag?r.bag+' Stück (Sekundärquelle)':'keine Angabe gefunden'}${r.note?`<br>${esc(r.note)}`:''}<br><b>Konsequenz für dich:</b> ${r.k==='g'?'nicht entnehmen.':r.k==='n'?'Regel vor einer Entnahme selbst klären.':'Werte vor einer Entnahme am amtlichen Text prüfen; Fische außerhalb einer Größenregel oder in der Schonzeit sofort schonend zurücksetzen.'}<br><span class="bd mu" style="margin-left:0">ungeklärt</span> <small class="mu">Quellen: ${sekLinks()} (Angelportale, nicht amtlich) · amtlich: ${a(DVO,'HmbFAnGDVO (PDF)')} · Stand ${de(CHECKED)}</small></div></details>`}).join('')}
const opt=(a)=>a.map(([v,l])=>`<option value="${v}">${l}</option>`).join('');
function build(){
 $('#law').innerHTML=`<div class="lwb">${head()}
<div class="row" id="lwtabs" style="margin:8px 0"><button class="btn p" data-s="law">Gesetz</button><button class="btn" data-s="rl">Rote Liste</button><button class="btn" data-s="dw">Gewässer</button><button class="btn" data-s="src">Quellen</button></div>
<div id="p-law"><div class="note"><b>Allgemeines Hamburger Landesrecht</b> (HmbFAnG / HmbFAnGDVO). Gewässerregeln des Anglerverbands stehen im Reiter „Gewässer“.<br><b>Begriffe:</b> Mindestmaß = Fisch muss mindestens so lang sein. Höchstmaß = Fisch darf höchstens so lang sein. Entnahmefenster = Mindest- und Höchstmaß zusammen. Schonzeit = Zeitraum, in dem die Art nicht entnommen werden darf. Gemessen wird üblicherweise von der Kopfspitze bis zum Ende der Schwanzflosse.</div>
<input id="lq" placeholder="Fischart suchen …"><div class="grid"><label>Schonzeit<select id="lf">${opt([['','Alle'],['act','Aktuell geschont (inkl. ganzjährig)'],['ganz','Nur ganzjährig geschützt'],['befr','Mit befristeter Schonzeit'],['none','Ohne Schonzeit']])}</select></label><label>Größenregel<select id="lm">${opt([['','Alle'],['with','Mit Größenregel'],['without','Ohne/ungeklärt']])}</select></label></div>
<div id="llist"></div>
<h3>Weitere Vorschriften (Auszug)</h3>${OTHER.map(([p,t,s,u])=>`<div class="lw"><div style="padding-top:10px"><b>${esc(p)}</b><br>${esc(t)}<br><span class="bd ${s==='ungeklärt'?'mu':'ye'}" style="margin-left:0">${esc(s)}</span> <small>${a(u,'Quelle')}</small></div></div>`).join('')}
<p class="mu"><small>Nicht erfasst: Krebse und Muscheln, Salmoniden und Wanderfische (Forellen, Äsche, Stint u. a.), Gerätevorschriften. Hinweis: Regeln aus anderen Bundesländern (z. B. NRW) gelten in Hamburg nicht und wurden nicht übernommen.</small></p></div>
<div id="p-rl" hidden><div class="note"><b>Rote Liste ≠ Fangbestimmung.</b> Die Rote Liste ist eine naturschutzfachliche Gefährdungseinstufung. Ob du einen Fisch entnehmen darfst, regeln HmbFAnG/HmbFAnGDVO und die Gewässerordnung.</div>
<div class="lw" style="padding-top:10px"><b>Rote Liste Hamburg (fachlich passend)</b><div>Die BUKEA hat 2026 die dritte Rote Liste der Süßwasserfische und Rundmäuler Hamburgs veröffentlicht (${a(RLHH,'Pressemeldung')}). Laut Pressemeldung (Suchauszug) stehen 20 der 47 bewerteten heimischen Arten auf der Gefährdungsliste.<br><span class="bd mu" style="margin-left:0">ungeklärt</span> Die Einstufungen der einzelnen Arten konnten nicht eingesehen werden und werden deshalb hier <b>nicht</b> angezeigt. Die NRW-Liste der Vorlage wurde bewusst nicht übernommen.</div></div>
<div class="lw" style="padding-top:10px"><b>Bundesweite Rote Liste</b><div>Freyhof et al. (2023): Rote Liste der Süßwasserfische und Neunaugen Deutschlands, Naturschutz und Biologische Vielfalt 170 (6) – ${a(RLD,'PDF (Rote-Liste-Zentrum)')}. Einstufungen ebenfalls nicht übernommen.</div></div></div>
<div id="p-dw" hidden></div>
<div id="p-src" hidden></div></div>`;
 $('#lq').oninput=law;$('#lf').onchange=law;$('#lm').onchange=law;
 $('#lwtabs').onclick=e=>{const s=e.target.dataset.s;if(!s)return;document.querySelectorAll('#lwtabs button').forEach(b=>b.classList.toggle('p',b===e.target));['law','rl','dw','src'].forEach(x=>$('#p-'+x).hidden=x!==s);if(s==='dw')dw()};
 law();src()}
const NK='hdNotes';
async function loadNotes(){try{return(typeof dbx==='function'&&await dbx('meta','readonly',s=>s.get(NK)))||{}}catch(e){return{}}}
/* ---------- Gewässerregeln Hohendeicher See (getrennt vom Landesrecht) ---------- */
const HD=[
['Bewirtschaftung','Verbandsgewässer des Anglerverbands Hamburg e. V.; der ganze See kann – bis auf ausgewiesene Schutzzonen – von Mitgliedern beangelt werden.','Sekundärquellen (Wikipedia, alleangeln.de, Vereinsseiten)','ye'],
['Berechtigung','Mitgliedschaft in einem Verein des Anglerverbands Hamburg oder Gastkarte des Verbands. Mitzuführen: Gastkarte bzw. Mitgliedsausweis, Fischereischein und Nachweis der Fischereiabgabe.','Gastkarten-Seite des Verbands (Suchauszug)','ye'],
['Gastkarten-Preise','Nicht übernommen – die Aktualität der Preise konnte nicht geprüft werden. Siehe Gastkarten-Seite.','ungeklärt','mu'],
['Fangstatistik','Das Führen der Fangstatistik ist verpflichtend; das Angeldatum ist zu Beginn des Angelns einzutragen. Diese App ersetzt die vorgeschriebene Fangstatistik NICHT.','Gastkarten-Seite des Verbands (Suchauszug), Original nicht geprüft','ye'],
['Schutzzonen / Angelverbotsbereiche','Es gibt Schutzzonen, die nicht beangelt werden dürfen. Vereinsseiten beschreiben zwei mit Bojenketten markierte Zonen; eine Quelle nennt einen stark bewachsenen Uferbereich im Norden und eine Bucht beim Seepavillon. Die genaue Lage ist nicht belastbar belegt und wird deshalb NICHT auf der Karte eingezeichnet. Vor Ort auf Bojenketten und Schilder achten; Verbindlich ist die interaktive Angelkarte des Verbands.','ungeklärt','mu'],
['Boote','Angeln vom Ufer und vom Boot; keine Motorboote (auch keine Elektromotoren laut einer Vereinsseite).','Vereinsseiten (AV Alster, Anglerfreunde Nord), ungeprüft','ye'],
['Rutenzahl / Methoden','Eine Quelle nennt 2 Ruten pro Angler. Weitere Methodenregeln (z. B. Nachtangeln, Köderfisch) nicht ermittelt.','ungeklärt','mu'],
['Schutzstatus','Der See liegt laut Wikipedia in einem Landschaftsschutzgebiet.','Sekundärquelle (Wikipedia)','ye'],
['Badestellen / Blaualgen','Badestellen im Westen und Süden. Laut einer Verbandsmeldung betraf ein behördliches Badeverbot wegen Blaualgen nicht das Angeln – das gilt nur für die damalige Lage.','Verbands-News (Suchauszug), zeitabhängig','mu'],
['Streckensperrungen','Aktuelle Sperrungen veröffentlicht der Verband auf seiner Seite „Streckensperrungen“.','Link','mu']];
const SPEC_HD='Karpfen, Schleie, Hecht, Zander, Wels, Barsch, Aal und Weißfische (laut Anglerverband Hamburg, Suchauszug – kein garantierter Bestandsnachweis).';
async function dw(){const n=await loadNotes(),id='hd';
 $('#p-dw').innerHTML=`<div class="note"><b>Gewässerregeln – getrennt vom Landesrecht.</b> Diese Regeln stammen vom Bewirtschafter (Anglerverband Hamburg e. V.) bzw. aus Sekundärquellen. Die Verbandsseite selbst konnte nicht direkt eingesehen werden; Angaben sind deshalb als ungeprüft oder ungeklärt markiert. Verbindlich ist die aktuelle Gewässerordnung des Verbands: ${a(AV,'Gewässerseite Hohendeicher See')}.</div>
<div class="lw" style="padding-top:10px"><b>Hohendeicher See (Oortkatensee), Hamburg-Kirchwerder</b><div>Baggersee, ca. 62 ha, bis ca. 19 m tief (Wikipedia/seen.de, Sekundärquellen).<br><b>Dokumentierte Fischarten:</b> ${esc(SPEC_HD)}</div></div>
${HD.map(([t,x,s,c])=>`<div class="lw" style="padding-top:10px"><b>${esc(t)}</b><div>${esc(x)}<br><span class="bd ${c}" style="margin-left:0">${c==='mu'&&s==='ungeklärt'?'ungeklärt':'ungeprüft'}</span> <small class="mu">${esc(s)}</small></div></div>`).join('')}
<div class="lw" style="padding-top:10px"><b>Eigene Notizen (z. B. aus deiner Gastkarte/Gewässerordnung)</b><div><textarea id="n-${id}" rows="5" placeholder="Hier eintragen, was in deiner Gewässerordnung steht …">${esc(n[id]?.t||'')}</textarea><small class="mu" id="s-${id}">${n[id]?.d?'Zuletzt von dir gespeichert: '+n[id].d:'Noch nichts eingetragen.'} · Nur auf diesem Gerät gespeichert, nicht in der JSON-Sicherung.</small></div></div>
<p class="mu"><small>Links: ${a(AV,'Gewässerseite')} · ${a(AVG,'Gastkarten')} · ${a(AVS,'Streckensperrungen')} · ${a(AVK,'Kontakt Geschäftsstelle')} · Stand ${de(CHECKED)}</small></p>`;
 $('#n-'+id).onchange=async()=>{const o=await loadNotes();o[id]={t:$('#n-'+id).value,d:new Date().toLocaleDateString('de-DE')};try{await dbx('meta','readwrite',s=>s.put(o,NK));$('#s-'+id).textContent='Gespeichert am '+o[id].d}catch(e){$('#s-'+id).textContent='Speichern fehlgeschlagen: '+e.message}}}
function src(){$('#p-src').innerHTML=`<div class="lw" style="padding-top:10px"><b>Amtliche Quellen (Hamburg) – bei der Erstellung NICHT abrufbar, bitte selbst prüfen</b><div>• ${a(HH1,'Angelrecht – Übersicht (BUKEA)')}<br>• ${a(HH2,'Schutz der Fische und Vorgaben zum Angelgerät (BUKEA)')}<br>• ${a(HH3,'Fischerei (BUKEA)')}<br>• ${a(DVO,'Verordnung zur Durchführung des HmbFAnG (PDF)')}<br>• ${a(LAW,'Landesrecht Hamburg')} (HmbFAnG, HmbFAnGDVO)<br>• ${a(ABG,'Fischereiabgabe – HamburgService')}<br>• ${a(RLHH,'Rote Liste der Fische 2026 (Pressemeldung BUKEA)')}</div></div>
<div class="lw" style="padding-top:10px"><b>Bewirtschafter</b><div>• Anglerverband Hamburg e. V.: ${a(AV,'Hohendeicher See')}, ${a(AVG,'Gastkarten')}, ${a(AVS,'Streckensperrungen')}, ${a(AVB,'Meldung Blaualgen')}</div></div>
<div class="lw" style="padding-top:10px"><b>Sekundärquellen (nur Hinweise, ungeprüft)</b><div>• Schonzeiten/Maße: ${sekLinks()}<br>• Gewässer: ${a('https://de.wikipedia.org/wiki/Hohendeicher_See','Wikipedia')}, ${a('https://www.alleangeln.de/gewaesser/hohendeicher-see-oortkaten','alleangeln.de')}, ${a('https://www.avalster.de/verbandsgewaesser/','AV Alster')}, ${a('https://www.anglerfreunde-nord.de/gewaesser/hohendeicher-see/','Anglerfreunde Nord')}, ${a('https://www.fisch-hitparade.de/gewaesser/hohendeicher-see/','fisch-hitparade.de')}</div></div>
<div class="lw" style="padding-top:10px"><b>Hinweise zur Datenerfassung</b><div>• Die Werte wurden am ${de(CHECKED)} über eine Websuche ermittelt; die Originalseiten waren aus der Arbeitsumgebung nicht erreichbar.<br>• Wo Quellen sich widersprechen, wurde KEINE Zahl übernommen.<br>• Bei Klärung bitte die Werte in <code>recht.js</code> aktualisieren und den Prüfstatus anpassen.</div></div>`}

function init(){if(!$('#law'))return;build();$('#nav').addEventListener('click',e=>{if(e.target.dataset.v==='law')law()})}
window.FischRecht={ROWS,status,md,size,LAW:DVO,LAWS,CHECKED};
init();
})();
