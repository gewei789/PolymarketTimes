module.exports=[22085,e=>{"use strict";var t=e.i(89171),i=e.i(53323);async function n(){let e=(0,i.getSupabase)();if(!e)return;let t=new Date(Date.now()-144e5).toISOString(),{error:n}=await e.from("market_history").delete().lt("last_shown",t);n&&console.error("Error clearing old history:",n)}async function s(){let e,t,n=(0,i.getSupabase)();if(!n)return!0;let{data:s,error:a}=await n.from("market_history").select("last_shown").order("last_shown",{ascending:!1}).limit(1).single();if(a||!s)return!0;let o=new Date(s.last_shown);o.setMinutes(0,0,0);let r=(t=4*Math.floor((e=new Date).getHours()/4),e.setHours(t,0,0,0),e);return o.getTime()!==r.getTime()}async function a(e){let t=(0,i.getSupabase)();if(!t)return;await s()&&(console.log("New edition detected - clearing old history"),await n());let a=e.map(e=>({id:e.id,question:e.question,last_shown:new Date().toISOString(),last_odds:e.currentOdds,show_count:1,updated_at:new Date().toISOString()})),{error:o}=await t.from("market_history").upsert(a,{onConflict:"id"});o&&console.error("Error batch recording markets:",o)}var o=e.i(99420);class r{apiKey;constructor(e){this.apiKey=e}async call(e){let{markets:t,recentlyCovered:i=[]}=e;if(!t||t.length<1)throw Error("No markets available for editorial review");console.log(`Editorial Director: Processing ${t.length} markets...`);let n=function(e){let t=new Map;for(let i of e){let e=function(e,t){let i=e.toLowerCase(),n=`${e} ${t}`.toLowerCase(),s=i.match(/(bitcoin|btc|ethereum|eth|solana|sol|xrp|doge|bnb|ada)\b.*?(reach|hit|dip|fall|drop|above|below|\$[\d,]+)/i);if(s){let e=s[1].replace("btc","bitcoin").replace("eth","ethereum").replace("sol","solana");return`price:${e}`}if(i.includes("president")||i.includes("election")||i.includes("win the 202")){let e=i.match(/202\d/),t=e?e[0]:"2025";if(i.includes("president"))return`election:us-president-${t}`;for(let e of["california","texas","florida","new york","georgia","arizona","nevada","michigan","pennsylvania","wisconsin"])if(i.includes(e))return`election:${e}-${t}`;for(let e of["uk","germany","france","canada","brazil","mexico","india"])if(i.includes(e))return`election:${e}-${t}`}for(let e of["openai","anthropic","google","apple","microsoft","meta","amazon","tesla","nvidia","spacex","twitter","tiktok","bytedance","netflix","disney","coinbase","binance","stripe","databricks","openai","mistral","deepmind","xai"])if(i.includes(e)){if(i.includes("ceo")||i.includes("fired")||i.includes("resign")||i.includes("step down"))return`company:${e}:leadership`;if(i.includes("ipo")||i.includes("valuation")||i.includes("funding")||i.includes("acquisition"))return`company:${e}:business`;if(i.includes("release")||i.includes("launch")||i.includes("ship")||i.includes("announce"))return`company:${e}:product`;return`company:${e}:general`}for(let e of["trump","biden","harris","elon musk","musk","sam altman","zuckerberg","bezos","cook","pichai","nadella","putin","zelensky","xi jinping","modi","netanyahu","macron","trudeau"])if(i.includes(e))return`person:${e.replace(" ","-")}`;if(n.includes("ukraine")||n.includes("russia"))return"conflict:ukraine-russia";if(n.includes("israel")||n.includes("gaza")||n.includes("hamas"))return"conflict:israel-gaza";if(n.includes("taiwan")||n.includes("china")&&n.includes("military"))return"conflict:taiwan";if(n.includes("korea")&&(n.includes("north")||n.includes("nuclear")))return"conflict:north-korea";if(i.includes("agi")||i.includes("artificial general intelligence"))return"tech:agi";if(i.includes("gpt-5")||i.includes("gpt5"))return"tech:gpt5";if(i.includes("self-driving")||i.includes("autonomous vehicle")||i.includes("fsd"))return"tech:self-driving";if(n.includes("fed")||n.includes("federal reserve")||n.includes("interest rate"))return i.includes("cut")?"finance:fed-cuts":i.includes("hike")||i.includes("raise")?"finance:fed-hikes":"finance:fed";if(i.includes("super bowl"))return"sports:super-bowl";if(i.includes("world series"))return"sports:world-series";if(i.includes("nba")&&(i.includes("champion")||i.includes("finals")))return"sports:nba-finals";if(i.includes("world cup"))return"sports:world-cup";if(i.includes("champions league"))return"sports:champions-league";let a=i.replace(/[?'"]/g,"").split(/\s+/).filter(e=>e.length>3&&!["will","would","could","does","have","been","this","that","with","from","before","after"].includes(e)).slice(0,4);return`other:${a.join("-")}`}(i.question,i.description);t.has(e)||t.set(e,[]),t.get(e).push(i)}let i=[];for(let[e,n]of t){n.sort((e,t)=>t.scores.total-e.scores.total);let t=n[0],s=n.slice(1),a=n.reduce((e,t)=>e+t.volume24hr,0),o=n.reduce((e,t)=>e+t.liquidity,0),r=n.reduce((e,t)=>{let i=Math.abs(e.yesPrice-.5);return Math.abs(t.yesPrice-.5)<i?t:e},n[0]),l=n.reduce((e,t)=>Math.abs(t.priceChange24h||0)>Math.abs(e||0)?t.priceChange24h:e,null),c=function(e,t){let[i,...n]=e.split(":"),s=n.join(":");switch(i){case"price":return`${s.charAt(0).toUpperCase()+s.slice(1)} Price Outlook`;case"election":return`${s.replace(/-/g," ").replace(/\b\w/g,e=>e.toUpperCase())} Election`;case"company":let[a,o]=s.split(":");return`${a.charAt(0).toUpperCase()+a.slice(1)} ${o?`(${o})`:""}`.trim();case"person":return s.replace(/-/g," ").replace(/\b\w/g,e=>e.toUpperCase());case"conflict":return s.replace(/-/g," ").replace(/\b\w/g,e=>e.toUpperCase())+" Conflict";case"tech":return s.toUpperCase();case"finance":return s.replace(/-/g," ").replace(/\b\w/g,e=>e.toUpperCase());case"sports":return s.replace(/-/g," ").replace(/\b\w/g,e=>e.toUpperCase());default:return t.question.length>60?t.question.substring(0,57)+"...":t.question}}(e,t),h=Math.min(.2,.03*n.length),d=t.scores.total*(1+h);i.push({id:e,name:c,category:t.category,primaryMarket:t,relatedMarkets:s,totalVolume24hr:a,totalLiquidity:o,marketCount:n.length,mostContestedOdds:r.yesPrice,biggestPriceMove:l,score:d})}return i.sort((e,t)=>t.score-e.score),i}(t);console.log(`Editorial Director: Clustered into ${n.length} topics`);let s=function(e,t){let i={POLITICS:8,TECH:8,CRYPTO:8,BUSINESS:6,FINANCE:6,CONFLICT:5,SCIENCE:5,CULTURE:4,SPORTS:4,OTHER:4},n=[],s={POLITICS:0,TECH:0,CRYPTO:0,BUSINESS:0,FINANCE:0,CONFLICT:0,SCIENCE:0,CULTURE:0,SPORTS:0,OTHER:0};for(let t of e){if(n.length>=80)break;let e=t.category;s[e]<i[e]&&(n.push(t),s[e]++)}if(n.length<80)for(let t of e.filter(e=>!n.includes(e))){if(n.length>=80)break;n.push(t)}return n}(n,0);console.log(`Editorial Director: Selected ${s.length} candidate topics for AI review`);let a=(0,o.createAIClient)(this.apiKey),r=s.map((e,t)=>{let n,s,a,o,r,l,c,h,d;return s=(n=e.primaryMarket).yesPrice>.5,a=Math.round(100*Math.max(n.yesPrice,n.noPrice)),o=e.totalVolume24hr>=1e6?`$${(e.totalVolume24hr/1e6).toFixed(1)}M`:e.totalVolume24hr>=1e3?`$${(e.totalVolume24hr/1e3).toFixed(0)}K`:`$${e.totalVolume24hr.toFixed(0)}`,r=e.biggestPriceMove?`${e.biggestPriceMove>0?"+":""}${e.biggestPriceMove.toFixed(1)}pp`:"stable",c=(l=n.endDate?new Date(n.endDate):null)?Math.ceil((l.getTime()-Date.now())/864e5):null,h=i.includes(n.id)?" ⚠️ RECENT":"",d=e.marketCount>1?` [${e.marketCount} related markets]`:"",`[${t}] [${e.category}] "${e.name}"${h}${d}
├─ Primary: "${n.question}"
├─ Odds: ${a}% ${s?"YES":"NO"} | Vol: ${o} | Move: ${r}
└─ Resolution: ${c?`${c} days`:"Open-ended"}`}).join("\n\n"),l=`You are the Editor-in-Chief of "The Polymarket Times" — a serious newspaper that covers prediction markets.

Your job: Select the 50 most newsworthy stories for today's front page.

You are NOT biased toward any category. A war update, a tech product launch, a sports championship, and a crypto price movement all deserve equal consideration. What matters is NEWSWORTHINESS.

TODAY'S DATE: ${new Date().toISOString().split("T")[0]}

═══════════════════════════════════════════════════════════
CANDIDATE TOPICS (${s.length} topics):
═══════════════════════════════════════════════════════════
${r}

═══════════════════════════════════════════════════════════
WHAT MAKES SOMETHING NEWSWORTHY (IN ORDER OF IMPORTANCE):
═══════════════════════════════════════════════════════════

1. **HUMAN STAKES** — Does this affect lives, not just money?
   ⚠️ WAR, CONFLICT, GEOPOLITICS always outrank financial stories
   - "US strikes Iran" > "Bitcoin hits $100k" — ALWAYS
   - Elections affecting millions > corporate earnings
   - Health/safety crises > market movements

2. MAGNITUDE — How many people are affected?
   - Global conflict > regional news > local news
   - National elections > company news > price targets

3. CONSEQUENCE — What happens next because of this?
   - "Fed cuts rates" has cascading effects
   - War has generational consequences

4. URGENCY — Is this happening NOW?
   - Imminent military action > price speculation
   - Big price moves (>5pp) indicate breaking news

5. VOLUME — How much money is at stake in the market?
   - $1M+ volume = serious conviction
   - But volume alone doesn't make something important

6. CONTESTEDNESS — Is it genuinely uncertain?
   - 45-55% odds = genuine uncertainty
   - But a 60% chance of WAR is more newsworthy than 50% odds on a price target

═══════════════════════════════════════════════════════════
LEAD STORY PRIORITY (STRICT HIERARCHY):
═══════════════════════════════════════════════════════════
For the LEAD story, apply this hierarchy:

1. **ACTIVE CONFLICT/WAR** — If there's military action, strikes, or imminent conflict, this is the lead. Period.
2. **MAJOR ELECTIONS** — Presidential elections, regime change
3. **GLOBAL ECONOMIC CRISIS** — Fed decisions, market crashes with systemic risk
4. **MAJOR GEOPOLITICAL SHIFTS** — Treaties, sanctions, regime collapse
5. **Everything else** — Tech, crypto, business, sports

A Bitcoin price target should NEVER be the lead if there's an active military conflict story available.

═══════════════════════════════════════════════════════════
LAYOUT ASSIGNMENTS:
═══════════════════════════════════════════════════════════

• LEAD_STORY (exactly 1):
  THE story of the day. Highest stakes, most consequential.
  Gets the giant banner headline and full article.

• FEATURE (exactly 8):
  Major stories deserving prominence. Each gets a headline and article.
  Should be diverse - don't cluster all 8 in one category.

• BRIEF (exactly 41):
  Newsworthy stories that readers should know about.
  Headline only, no article.

TOTAL: Exactly 50 stories (1 + 8 + 41)

═══════════════════════════════════════════════════════════
DIVERSITY REQUIREMENT:
═══════════════════════════════════════════════════════════

Your front page should reflect what's ACTUALLY happening in the world.
Don't artificially favor any category. But also ensure variety:

- No more than 10 stories from any single category
- The LEAD and FEATURE stories should span at least 4 different categories
- If one topic dominates the news (e.g., major election), that's fine — but justify it

═══════════════════════════════════════════════════════════
RESPOND WITH JSON ONLY:
═══════════════════════════════════════════════════════════
{
  "selections": [
    { "index": 0, "layout": "LEAD_STORY", "why": "Major geopolitical shift, $2B in volume, 15pp swing" },
    { "index": 3, "layout": "FEATURE", "why": "Fed decision affects global markets" },
    { "index": 7, "layout": "FEATURE", "why": "AI milestone with industry implications" },
    { "index": 12, "layout": "BRIEF", "why": "Notable crypto movement" },
    ...continue for all 50 selections...
  ],
  "category_breakdown": {
    "POLITICS": 8,
    "TECH": 7,
    "CRYPTO": 6,
    ...etc...
  },
  "reasoning": "Today's front page leads with [X] because... The 8 features cover [categories] reflecting..."
}`;try{let e=await (0,o.withRetry)(async()=>a.chat.completions.create({model:o.GEMINI_MODELS.SMART,messages:[{role:"user",content:l}],temperature:.3,max_tokens:6e3}),2,500),t=e.choices[0]?.message?.content||"",i=(0,o.extractJSON)(t),n=(i.selections||[]).map(e=>{let t=s[e.index];return t?{...t.primaryMarket,layout:e.layout||"BRIEF"}:null}).filter(e=>null!==e),r=new Set,c=n.filter(e=>!r.has(e.id)&&(r.add(e.id),!0));if(c.length<50){let e=s.filter(e=>!r.has(e.primaryMarket.id)).slice(0,50-c.length).map(e=>({...e.primaryMarket,layout:"BRIEF"}));c.push(...e)}this.enforceLayoutConstraints(c);let h=c.slice(0,50);console.log(`Editorial Director: Selected ${h.length} stories`),console.log(`  - LEAD: ${h.filter(e=>"LEAD_STORY"===e.layout).length}`),console.log(`  - FEATURE: ${h.filter(e=>"FEATURE"===e.layout).length}`),console.log(`  - BRIEF: ${h.filter(e=>"BRIEF"===e.layout).length}`);let d={};for(let e of h)d[e.category]=(d[e.category]||0)+1;return console.log("  - Categories:",d),{blueprint:{stories:h},reasoning:i.reasoning||"AI-selected front page with balanced coverage"}}catch(e){return console.error("Editorial Director failed, using algorithmic fallback:",e),this.algorithmicFallback(s)}}enforceLayoutConstraints(e){let t=e.filter(e=>"LEAD_STORY"===e.layout);0===t.length&&e.length>0?e[0].layout="LEAD_STORY":t.length>1&&t.slice(1).forEach(e=>{e.layout="FEATURE"});let i=e.filter(e=>"FEATURE"===e.layout);if(i.length<8){let t=e.filter(e=>"BRIEF"===e.layout),n=8-i.length;t.slice(0,n).forEach(e=>{e.layout="FEATURE"})}else i.length>8&&i.slice(8).forEach(e=>{e.layout="BRIEF"})}algorithmicFallback(e){console.log("Using algorithmic fallback for story selection");let t=e.slice(0,50),i=0;for(let e of["CONFLICT","POLITICS","FINANCE","TECH","CRYPTO","BUSINESS","SCIENCE","CULTURE","SPORTS","OTHER"]){let n=t.findIndex(t=>t.category===e);if(-1!==n){i=n;break}}let n=t.map((e,t)=>{let n;return n=t===i?"LEAD_STORY":t<9||9===t&&0!==i?"FEATURE":"BRIEF",{...e.primaryMarket,layout:n}});return this.enforceLayoutConstraints(n),console.log(`Fallback selected: ${n.length} stories (Lead: ${n.find(e=>"LEAD_STORY"===e.layout)?.category})`),{blueprint:{stories:n},reasoning:"Algorithmic selection: top 50 topics with conflict-first lead priority"}}}function l(e,t){return e[t.split("").reduce((e,t)=>e+t.charCodeAt(0),0)%e.length]}function c(e){if(!e)return"BREAKING DEVELOPMENTS";let t=Math.round(100*Math.max(e.yesPrice,e.noPrice)),i=e.yesPrice>.5,n=e.question.replace(/\?$/,"").replace(/^Will\s+/i,"").replace(/^Is\s+/i,"").replace(/^Does\s+/i,"").replace(/^Can\s+/i,"").replace(/^Should\s+/i,"").replace(/\s+by\s+.*$/i,"").replace(/\s+in\s+\d{4}.*$/i,"").replace(/\s+before\s+.*$/i,"").trim();n.length>40&&(n=n.substring(0,37)+"...");let s=n.toUpperCase();if(t>=85){let t=[`${s} LOCKED IN`,`${s} ALL BUT CERTAIN`,`${s} SECURES VICTORY`,`${s}: DONE DEAL`,`${s} CLINCHES IT`,`${s} SEALS THE DEAL`],n=[`${s} ALL BUT DEAD`,`${s} FLATLINES`,`${s} COLLAPSES`,`${s}: GAME OVER`,`${s} FALLS APART`,`${s} CRUMBLES`];return l(i?t:n,e.id)}if(t>=70){let t=[`${s} ON TRACK`,`${s} PULLS AHEAD`,`${s} BUILDS LEAD`,`${s} GAINS GROUND`,`${s} EYES FINISH LINE`,`${s} TAKES COMMAND`,`${s} SEIZES MOMENTUM`],n=[`${s} FADING FAST`,`${s} LOSES STEAM`,`${s} IN TROUBLE`,`${s} SLIPS AWAY`,`${s} FACES HEADWINDS`,`${s} STUMBLES`];return l(i?t:n,e.id)}if(t>=55){let t=[`${s} EDGES AHEAD`,`${s} TAKES SLIM LEAD`,`${s} INCHES FORWARD`,`${s} HOLDS NARROW EDGE`,`${s} NUDGES AHEAD`,`${s}: ADVANTAGE FORMS`],n=[`${s} LOSING GROUND`,`${s} SLIPS BACK`,`${s} TRAILS NARROWLY`,`${s} FALLS BEHIND`,`${s}: LEAD NARROWS`,`${s} UNDER PRESSURE`];return l(i?t:n,e.id)}{if(t>=45)return l([`${s}: HANGS IN BALANCE`,`${s}: TOO CLOSE TO CALL`,`${s}: DEAD HEAT`,`${s}: BATTLE RAGES`,`${s}: NECK AND NECK`,`${s}: COIN FLIP`,`${s}: ANYONE'S GAME`,`${s}: RACE TIGHTENS`,`${s}: SHOWDOWN LOOMS`,`${s}: TENSION MOUNTS`],e.id);let n=[`${s} SURGES`,`${s} MOUNTS COMEBACK`,`${s} DEFIES ODDS`,`${s} FIGHTS BACK`,`${s}: UPSET BREWING?`,`${s} REFUSES TO DIE`,`${s} RALLIES`],a=[`${s} FACES LONG ODDS`,`${s}: UPHILL BATTLE`,`${s} CLINGS TO HOPE`,`${s}: SLIM CHANCE`,`${s} FIGHTS GRAVITY`,`${s}: MIRACLE NEEDED`];return l(i?n:a,e.id)}}class h{apiKey;constructor(e){this.apiKey=e}async call(e){let{blueprint:t}=e,i=t.stories,n=(0,o.createAIClient)(this.apiKey),s=[];for(let e=0;e<i.length;e+=10)s.push(i.slice(e,e+10));console.log(`Headline Writer: Processing ${i.length} stories in ${s.length} batches...`);let a={};return await Promise.all(s.map(async(e,t)=>{await new Promise(e=>setTimeout(e,200*t));let i=e.map((e,t)=>{let i=e.yesPrice>.5,n=Math.round(100*Math.max(e.yesPrice,e.noPrice));return`[${t}] "${e.question}" → ${n}% ${i?"YES":"NO"}`}).join("\n"),s=`You are a LEGENDARY newspaper headline editor. Write DRAMATIC, DECLARATIVE headlines.

═══════════════════════════════════════════════════════════
ICONIC HEADLINES TO EMULATE:
═══════════════════════════════════════════════════════════
• "MEN WALK ON MOON" • "NIXON RESIGNS" • "WALL FALLS" • "TRUMP TRIUMPHS"
• "WAR DECLARED" • "PEACE AT LAST" • "MARKETS CRASH" • "FED HOLDS LINE"

═══════════════════════════════════════════════════════════
STORIES:
═══════════════════════════════════════════════════════════
${i}

═══════════════════════════════════════════════════════════
HEADLINE RULES:
═══════════════════════════════════════════════════════════

1. **DECLARE, DON'T ASK**
   - If odds >70%: Write as FACT ("TRUMP WINS" not "Will Trump win?")
   - If odds 50-70%: Write as TENSION ("RACE TIGHTENS", "LEAD NARROWS")
   - If odds <50%: Write as DRAMA ("UNDERDOG SURGES", "COMEBACK BREWING")

2. **MAX 6 WORDS** — Active voice. NO questions. ALL CAPS.

3. **VERB DIVERSITY** — Rotate through powerful verbs:
   SURGES, PLUNGES, CLINCHES, LOCKS IN, EYES, RACES TOWARD,
   FACES, BATTLES, THREATENS, SEIZES, SWEEPS, CRUSHES, EDGES,
   STUNS, RATTLES, SECURES, CLAIMS, NEARS, DEFIES, HOLDS

4. **AVOID THESE**:
   - Hedging: "COULD", "MAY", "MIGHT", "POSSIBLY"
   - Starting with "WILL"
   - Hyperbole without movement: "SKYROCKETS" requires >10% move
   - Generic: "MARKETS MOVE" (move WHERE?)

5. **SPECIFICITY BEATS DRAMA**
   - BAD: "BIG CHANGES AHEAD"
   - GOOD: "BITCOIN EYES $100K"
   - BAD: "ELECTION UPDATE"
   - GOOD: "HARRIS SEIZES LEAD"

═══════════════════════════════════════════════════════════
RESPOND WITH JSON ONLY:
═══════════════════════════════════════════════════════════
{
  "0": "HEADLINE",
  "1": "HEADLINE",
  ...
}`;try{let i=await (0,o.withRetry)(async()=>n.chat.completions.create({model:o.GEMINI_MODELS.SMART,messages:[{role:"user",content:s}],temperature:.8,max_tokens:1e3}),2,500),r=i.choices[0]?.message?.content||"",l=(0,o.extractJSON)(r),h=0,d=0;e.forEach((e,t)=>{let i=l[String(t)];i&&!i.toLowerCase().includes("will ")?(a[e.id]=i,h++):(a[e.id]=c(e),d++)}),console.log(`Headline Batch ${t}: ${h} accepted, ${d} fallback`)}catch(i){console.error(`Headline Batch ${t} failed:`,i),e.forEach(e=>{a[e.id]=c(e)})}})),console.log(`Headline Writer: completed with ${Object.keys(a).length} total headlines`),{headlines:a}}}function d(e){let t,i=e.question.toLowerCase(),n="NEW YORK";if(i.includes("trump")||i.includes("biden")||i.includes("congress")||i.includes("fed")||i.includes("white house")?n="WASHINGTON":i.includes("ukraine")||i.includes("russia")?n="KYIV":i.includes("israel")||i.includes("gaza")?n="JERUSALEM":i.includes("china")||i.includes("taiwan")?n="TAIPEI":i.includes("uk")||i.includes("britain")?n="LONDON":i.includes("eu")||i.includes("europe")?n="BRUSSELS":i.includes("openai")||i.includes("google")||i.includes("apple")||i.includes("meta")||i.includes("ai ")?n="SAN FRANCISCO":i.includes("spacex")||i.includes("nasa")?n="CAPE CANAVERAL":i.includes("bitcoin")||i.includes("crypto")?n="CRYPTO WIRE":(i.includes("oscar")||i.includes("movie")||i.includes("hollywood"))&&(n="LOS ANGELES"),e.endDate){let i=new Date(e.endDate);t=`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i.getMonth()]} ${i.getFullYear()}`}else{let e=new Date;e.setMonth(e.getMonth()+1),t=`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][e.getMonth()]} ${e.getFullYear()}`}return`${n} (${t})`}function u(e,t){return e[t.split("").reduce((e,t)=>e+t.charCodeAt(0),0)%e.length]}function m(e){var t,i,n,s,a,o;let r=Math.round(100*Math.max(e.yesPrice,e.noPrice));e.yesPrice;let l=e.volume24hr>=1e6?`$${(e.volume24hr/1e6).toFixed(1)} million`:e.volume24hr>=1e3?`$${Math.round(e.volume24hr/1e3)}K`:`$${e.volume24hr.toFixed(0)}`,c=e.layout||"BRIEF";return"BRIEF"===c?u((t=r,i=l,t>=85?[`The outcome appears locked in at ${t}%. With ${i} wagered, traders see this as all but certain. The question now shifts from "if" to "what comes next."`,`At ${t}%, this is as close to a sure thing as prediction markets get. The ${i} in volume confirms: serious money has already placed its bets.`,`Markets price this at ${t}%—virtual certainty. With ${i} on the line, the contrarians have gone quiet. The story is all but written.`,`The numbers don't lie: ${t}% odds, ${i} wagered. At these levels, traders aren't speculating—they're front-running the inevitable.`,`Locked at ${t}%. The ${i} in trading volume tells the story: this outcome has graduated from probability to near-certainty.`]:t>=70?[`Markets favor this outcome at ${t}%, with ${i} in trading volume. The momentum is clear, though the final chapter remains unwritten.`,`At ${t}%, the favorite has emerged. The ${i} wagered suggests conviction, but prediction markets have humbled certainty before.`,`The ledger shows ${t}% and ${i} in volume. Strong position, but not unassailable. The next development could cement or challenge this lead.`,`Trading at ${t}% with ${i} behind it. The market sees a clear direction, though leaves room for the unexpected.`,`Odds sit at ${t}%, backed by ${i}. Favored, yes. Guaranteed, no. The gap between the two is where stories get interesting.`]:t>=55?[`A narrow edge emerges at ${t}%. With ${i} on the line, traders see a slight advantage but no guarantees. Every development matters.`,`The margin is razor-thin: ${t}%. With ${i} wagered, neither side can claim dominance. This is genuine uncertainty.`,`At ${t}%, this qualifies as contested territory. The ${i} in volume reflects a market that can't quite make up its mind.`,`Slim lead at ${t}%, with ${i} tracking the action. The slight edge could evaporate with a single headline.`,`Markets show ${t}%—close enough to keep both sides nervous. The ${i} wagered suggests this one matters.`]:t>=45?[`Dead heat at ${t}%. With ${i} wagered, this remains genuinely uncertain. Markets await the next signal to break the deadlock.`,`The ultimate toss-up: ${t}% odds, ${i} in volume. Prediction markets rarely get more contested than this.`,`At ${t}%, this is anyone's game. The ${i} trading volume reflects a market genuinely split on the outcome.`,`Markets can't decide: ${t}% with ${i} wagered. When odds hover here, the next development will move mountains.`,`Perfectly balanced at ${t}%. The ${i} in volume represents conviction on both sides. Something has to give.`]:[`Long odds at ${t}%, but ${i} in volume suggests believers remain. The underdog scenario isn't dead—just improbable.`,`At ${t}%, this sits in upset territory. The ${i} wagered says some traders see something the market doesn't.`,`The contrarians are making their stand: ${t}% odds, ${i} in play. Improbable doesn't mean impossible.`,`Long-shot territory at ${t}%. The ${i} in volume suggests the faithful haven't given up. Stranger things have happened.`,`Markets price this at just ${t}%, but ${i} remains in play. For true believers, these odds spell opportunity.`]),e.id):"FEATURE"===c?u((n=r,s=l,n>=85?[`Markets have spoken with unusual clarity: ${n}% odds suggest this outcome is virtually assured. The ${s} in trading volume represents not speculation but conviction—institutional money doesn't bet on fantasies.

What makes this particularly noteworthy is the absence of meaningful dissent. At these levels, contrarian traders would typically emerge to challenge the consensus. Their silence speaks volumes.

The implications ripple outward. Adjacent markets are already pricing in the second-order effects. Smart money has moved from "will it happen" to "what happens next." For those still holding contrary positions, the mathematics are unforgiving.`,`The prediction market has rendered its verdict: ${n}% probability, backed by ${s} in volume. At these levels, the question shifts from outcome to aftermath.

This kind of consensus is rare. Markets typically harbor skeptics, traders willing to bet against the crowd. Here, they've largely capitulated. The few remaining contrarian positions look less like informed dissent and more like wishful thinking.

What happens next? The smart money is already rotating into adjacent questions—second-order effects, timing, magnitude. The primary outcome has been priced; the derivatives await.`,`At ${n}% with ${s} wagered, this market has moved past speculation into something approaching certainty. The remaining ${100-n}% represents not genuine doubt but the market's acknowledgment that nothing is ever truly guaranteed.

The trading pattern tells the story: early volatility, then convergence, then the kind of stability that comes when traders have exhausted their arguments. The consensus hardened, and here we are.

For market watchers, the action now lies elsewhere—in the ripple effects, the follow-on questions, the second-order implications that flow from this near-certain outcome.`]:n>=70?[`At ${n}%, the market sees a clear favorite but leaves room for reversal. The ${s} trading volume suggests serious conviction, though not the kind of lock-in that eliminates drama entirely.

This is the zone where narratives get interesting. The leading outcome has momentum, but prediction markets have a way of humbling certainty. A single development—a headline, a data point, an unexpected twist—could shift the calculus.

Traders are positioned accordingly: confident enough to commit capital, cautious enough to maintain hedges. The next few developments will determine whether this edges toward certainty or swings back toward chaos.`,`The odds stand at ${n}%, with ${s} in volume. Strong conviction, yes—but not overwhelming. This is the territory where favorites stumble and narratives reverse.

What makes this positioning interesting is the residual uncertainty. The ${100-n}% minority bet isn't noise; it represents traders who see something the consensus might be missing. History suggests they're usually wrong. Usually.

The path from here splits two ways: either the lead extends toward lock-in, or an unexpected development reshuffles the deck. Traders are watching closely for signals in either direction.`,`Markets favor this outcome at ${n}%, backed by ${s} in trading. The momentum is clear, though the game isn't over.

At this level, the favorite has established dominance but hasn't secured victory. The remaining probability mass represents genuine uncertainty—traders who believe the consensus is missing something, or simply hedging against the unexpected.

The question now: does this drift toward certainty, or does something intervene? The volume suggests the market is paying attention, ready to move quickly when the next piece of information drops.`]:n>=55?[`The margin is razor-thin at ${n}%. With ${s} wagered, this qualifies as one of the more contested outcomes on the board—exactly the kind of uncertainty that makes prediction markets worth watching.

Neither side can claim momentum. The trading pattern suggests a genuine disagreement about fundamentals, not just noise. When markets can't agree, it usually means the underlying situation is genuinely complex.

What comes next matters more than usual here. A small shift in the fundamentals could cascade into a dramatic price movement. Traders are watching closely.`,`At ${n}% with ${s} in play, this market embodies genuine uncertainty. The slight edge exists, but it's narrow enough to evaporate with a single development.

This is where prediction markets earn their keep—not in the obvious calls, but in the contested spaces where collective intelligence wrestles with complexity. The volume suggests real money is engaged with this question.

For traders, the calculus is delicate: enough of an edge to warrant a position, but not enough to bet the farm. The next piece of information could clarify everything—or muddy the waters further.`,`Odds sit at ${n}%, volume at ${s}. In the taxonomy of prediction markets, this qualifies as "contested"—close enough that both sides can plausibly claim they see something the other doesn't.

The slight leader shouldn't get comfortable. At these levels, momentum shifts quickly. A headline, a data point, a rumor with legs—any could flip the script.

Markets will likely remain volatile here until something breaks the deadlock. Until then, traders on both sides are holding their breath.`]:[`At ${n}%, this sits in underdog territory—improbable but not impossible. The ${s} in volume suggests that even at these odds, some traders see an opportunity the market is missing.

Contrarian bets like this are where fortunes are made and lost. The implied probability leaves significant upside for those willing to bet against consensus. Of course, consensus is usually consensus for a reason.

The next development could vindicate the minority position or confirm what the odds already suggest. Either way, this outcome remains on the radar—long odds have a way of shortening unexpectedly.`,`The market prices this at ${n}%—long odds by any measure. Yet the ${s} in volume suggests this isn't a forgotten corner of the prediction landscape. Someone is paying attention.

Contrarian positions at these levels are either prescient or delusional; time will tell which. The expected value math can work, if you're right often enough and position-size correctly.

What would it take to shift these odds? Something significant—a development that challenges the consensus narrative. Until then, this remains a watching brief for most traders.`,`At ${n}%, the market has spoken: unlikely. But the ${s} still trading suggests the underdog thesis hasn't been fully abandoned.

These are the bets that either look brilliant in hindsight or quietly expire worthless. The asymmetric payoff attracts a certain kind of trader—those who see angles the market has discounted too heavily.

The fundamental question: is the consensus right, or is it missing something? At these odds, you'd need strong conviction to take the other side. Some clearly have it.`]),e.id):u((a=r,o=l,[`This stands as the defining question of the moment, and markets have rendered their verdict: ${a}% odds on the leading outcome, backed by ${o} in trading volume. In the arithmetic of prediction markets, that represents serious conviction—but not certainty.

The stakes extend well beyond the immediate question. Adjacent markets across multiple categories are already recalibrating based on the implied outcome here. When a market of this significance moves, it creates ripples throughout the ecosystem.

What makes this particularly compelling is the context. This isn't a question that emerged in isolation—it represents the convergence of multiple forces, each with their own timeline and logic. The current odds reflect the market's best synthesis of those factors.

The trading pattern tells its own story. Early volatility has given way to more stable pricing, suggesting traders have largely settled on their positions. That stability could hold, or it could shatter with the next significant development.

For those tracking implications: the leading scenario would reshape expectations across related outcomes. Market participants are already positioning for the second-order effects, pricing in scenarios that assume this question resolves as currently expected.

But prediction markets exist precisely because the future is uncertain. The ${a}% figure leaves meaningful probability mass on alternative outcomes. In a world of black swans and fat tails, that uncertainty matters.

The developments ahead will test whether today's odds represent wisdom or hubris. Either way, this outcome will define the next chapter of the broader story.`,`Markets have placed their bets, and the numbers tell a compelling story: ${a}% probability, ${o} in volume. This is the question that has captured the prediction market's collective attention.

The significance extends beyond the immediate stakes. When a market of this magnitude moves, it sends signals throughout the ecosystem. Adjacent questions recalibrate. Correlations strengthen or break. The entire landscape shifts.

What brought us here? A convergence of forces—some gradual, some sudden—that crystallized into this single question. The odds represent thousands of traders synthesizing fragmentary information into a coherent probability estimate.

The volume speaks to conviction. At ${o}, this isn't casual speculation—it's serious capital expressing serious views. Money talks, and here it's speaking clearly.

Yet the remaining probability mass demands attention. The ${100-a}% isn't noise; it's the market's acknowledgment of genuine uncertainty. Prediction markets have been humbled before by outcomes they deemed unlikely.

For those positioning around this outcome: the second-order effects are already in play. Smart money is thinking several moves ahead, pricing in scenarios that assume certain resolutions while hedging against surprises.

The story isn't over. Markets will continue to process new information, adjusting odds in real-time as developments unfold. Today's price is just a snapshot—tomorrow's could look quite different.

Whatever the resolution, this question has earned its place at the center of the prediction market universe. The implications will echo long after the outcome is known.`,`At ${a}% with ${o} behind it, this market has established itself as the question of the moment. The numbers alone tell the story, but the implications run deeper.

Every prediction market has a center of gravity—the question that draws the most attention, generates the most volume, creates the most ripple effects. Right now, this is it.

The path to these odds wasn't linear. Early trading showed volatility, competing narratives jostling for supremacy. Gradually, a consensus emerged. The current price represents that consensus—imperfect, perhaps, but the best estimate available.

What makes this particularly significant is the connectivity. This outcome doesn't exist in isolation; it's woven into a web of related questions, adjacent markets, and downstream implications. A resolution here will cascade through the system.

The trading community has taken notice. The ${o} in volume represents diverse actors—institutional players, retail traders, algorithmic systems—all converging on this question with their capital and their convictions.

Yet prediction markets resist certainty. The ${100-a}% probability assigned to alternative outcomes isn't just mathematical formality—it's a genuine acknowledgment that surprises happen. The market has been wrong before.

What comes next? The outcome will either vindicate the consensus or serve as another reminder that prediction markets, for all their wisdom, remain imperfect instruments for seeing the future.

Either way, the resolution will matter. This is the story to watch.`]),e.id)}class g{apiKey;constructor(e){this.apiKey=e}async call(e){let{blueprint:t,headlines:i,datelines:n,groupByMarketId:s}=e,a=t.stories,r=a.map((e,t)=>{let s,a,o,r,l=i[e.id]||e.question,c=n[e.id]||d(e),h=(s=e.yesPrice>.5?e.outcomes[0]:e.outcomes[1],a=Math.round(100*Math.max(e.yesPrice,e.noPrice)),o=e.volume24hr>=1e6?`$${(e.volume24hr/1e6).toFixed(1)}M`:`$${(e.volume24hr/1e3).toFixed(0)}K`,r=({confirmed:a>=85?"CERTAIN":"LIKELY",dead_on_arrival:"REJECTED",chaos:"VOLATILE",contested:"CONTESTED"})[e.marketStatus],`ID: "${e.id}"
HEADLINE: "${l}"
MARKET: "${e.question}"
DATELINE: ${c}
ODDS: ${s} ${a}% (${r})
VOLUME: ${o}`),u=e.description?`
CONTEXT/DESCRIPTION: "${e.description.replace(/\n/g," ").substring(0,300)}..."`:"",m=`
LAYOUT TYPE: ${e.layout} (Length: ${"LEAD_STORY"===e.layout?"250 words":"FEATURE"===e.layout?"120 words":"40 words"})`;return t<3&&console.log(`Debug Context [${e.id}]:`,u),{id:e.id,index:t,text:h+u+m}}),l=[];for(let e=0;e<r.length;e+=5)l.push(r.slice(e,e+5));console.log(`Article Writer: Processing ${a.length} stories in ${l.length} batches...`);let c=(0,o.createAIClient)(this.apiKey),h={},u="The future is unevenly distributed.";return await Promise.all(l.map(async(e,t)=>{await new Promise(e=>setTimeout(e,250*t));let i=e.map((e,i)=>`[${5*t+i}] ${e.text}`).join("\n\n---\n\n"),n=`You are a senior investigative journalist at "The Polymarket Times" — a prestigious newspaper that covers prediction markets as breaking news.

Write a compelling news article for EACH story below.

═══════════════════════════════════════════════════════════
STORIES TO COVER:
═══════════════════════════════════════════════════════════
${i}

═══════════════════════════════════════════════════════════
ARTICLE STRUCTURE (CLAIM → EVIDENCE → IMPLICATION):
═══════════════════════════════════════════════════════════

Every article must follow this structure:

1. **CLAIM** (First sentence)
   What's happening? State the news declaratively.
   - BAD: "Markets are pricing Bitcoin..."
   - GOOD: "Bitcoin stands on the precipice of $100,000, with traders pricing a 75% chance of breakout by month's end."

2. **EVIDENCE** (2-3 sentences)
   The numbers that prove it. Be specific.
   - Include: The odds, the direction, the volume
   - Translate odds into stakes: "with $12M wagered" or "institutional money piling in"

3. **IMPLICATION** (1-2 sentences)
   Why should the reader care? What happens next?
   - If YES: What changes? Who wins/loses?
   - If NO: What's the alternative scenario?

═══════════════════════════════════════════════════════════
ODDS TRANSLATION GUIDE:
═══════════════════════════════════════════════════════════
- 90%+ → "all but certain", "inevitable", "foregone conclusion"
- 80-90% → "highly likely", "strong momentum", "commanding lead"
- 70-80% → "favored", "on track", "positioned to"
- 50-70% → "edge", "slight advantage", "contested", "too close to call"
- 30-50% → "uphill battle", "fighting chance", "mounting comeback"
- <30% → "long odds", "slim chance", "would need dramatic reversal"

═══════════════════════════════════════════════════════════
LAYOUT-SPECIFIC INSTRUCTIONS:
═══════════════════════════════════════════════════════════
- **LEAD_STORY** (250 words): Voice of God. This is the story everyone's talking about.
  Synthesize stakes, history, key players, and global implications.

- **FEATURE** (120 words): Analytical depth. Connect the dots.
  Explain WHY this matters, not just WHAT's happening.

- **BRIEF** (40 words): Ultra-punchy. Just the news in 2-3 sentences.
  CLAIM + EVIDENCE only. Skip implications - readers can infer.

═══════════════════════════════════════════════════════════
TONE GUIDE:
═══════════════════════════════════════════════════════════
The Economist meets Matt Levine.

- Authoritative, not breathless
- Witty, not trying too hard
- Sardonic, not cynical
- Informed, not pedantic

BANNED WORDS: "very", "really", "basically", "just", "actually", "so yeah"
PREFERRED: "The ledger suggests", "Markets imply", "Traders are pricing in", "The calculus shifts"

═══════════════════════════════════════════════════════════
RESPOND WITH JSON ONLY:
═══════════════════════════════════════════════════════════
{
  "0": "Your article for story 0...",
  "1": "Your article for story 1...",
  ...
}`;try{let i=await (0,o.withRetry)(async()=>c.chat.completions.create({model:o.GEMINI_MODELS.SMART,messages:[{role:"user",content:n}],temperature:.75,max_tokens:4e3}),2,500),s=i.choices[0]?.message?.content||"";console.log(`Article Batch ${t} RAW:`,s.substring(0,500));let r=(0,o.extractJSON)(s);console.log(`Article Batch ${t} KEYS:`,Object.keys(r)),e.forEach((e,i)=>{let n=r[String(5*t+i)]||r[e.id];if(n)h[e.id]=n;else{let t=a.find(t=>t.id===e.id);t&&(h[t.id]=m(t))}}),r.note&&0===t&&(u=r.note)}catch(i){console.error(`Article Batch ${t} failed:`,i),e.forEach(e=>{let t=a.find(t=>t.id===e.id);t&&(h[t.id]=m(t))})}})),{content:h,editorialNote:u}}}class p{apiKey;constructor(e){this.apiKey=e}async call(e){let{blueprint:t,headlines:i,featuredOnly:n=!0}=e,s=n?t.stories.filter(e=>"LEAD_STORY"===e.layout||"FEATURE"===e.layout):t.stories;if(0===s.length)return{takes:{},summary:"No featured stories to analyze."};console.log(`Contrarian Agent: Generating devil's advocate takes for ${s.length} stories...`);let a=(0,o.createAIClient)(this.apiKey),r=[];for(let e=0;e<s.length;e+=5)r.push(s.slice(e,e+5));let l={};await Promise.all(r.map(async(e,t)=>{await new Promise(e=>setTimeout(e,100*t));let n=e.map((e,t)=>{let n=i[e.id]||e.question,s=Math.round(100*Math.max(e.yesPrice,e.noPrice)),a=e.yesPrice>.5?"YES":"NO",o=e.volume24hr>=1e6?`$${(e.volume24hr/1e6).toFixed(1)}M`:`$${(e.volume24hr/1e3).toFixed(0)}K`;return`═══════════════════════════════════════════════════════════
[${t}] "${n}"
ID: ${e.id}
MARKET: "${e.question}"
CONSENSUS: ${s}% ${a} (Volume: ${o})
CATEGORY: ${e.category}
═══════════════════════════════════════════════════════════`}).join("\n\n"),s=`You are the skeptic at "The Polymarket Times" editorial board.

Your job: Challenge EVERY story. Play devil's advocate.

You are intellectually honest. Sometimes the consensus is right — say so if true.
But your default is skepticism. Markets are often wrong.

═══════════════════════════════════════════════════════════
STORIES TO CHALLENGE:
═══════════════════════════════════════════════════════════
${n}

═══════════════════════════════════════════════════════════
FOR EACH STORY, PROVIDE:
═══════════════════════════════════════════════════════════

1. **BEAR CASE** (50 words max)
   The strongest argument AGAINST the current consensus.
   - If consensus is 80% YES, argue for NO
   - If consensus is 30% YES, argue for YES
   - Be specific, not generic. Use real-world examples.

2. **KEY RISK** (1 sentence)
   What specific thing is the market underweighting?
   - Example: "October surprise risk is historically underpriced in prediction markets."
   - Example: "Incumbents have won 9 of last 11 similar races."

3. **WHO DISAGREES** (1 sentence)
   Who is betting against the consensus, and why might they be right?
   - Example: "Sharp money came in at 65% NO; they may know something retail doesn't."
   - Example: "Insiders familiar with the technology suggest timeline is aggressive."

4. **CONFIDENCE** (HIGH / MEDIUM / LOW)
   How confident are you in the contrarian view?
   - HIGH: Consensus is likely wrong. Strong historical precedent or structural mispricing.
   - MEDIUM: Reasonable alternative view. Markets could go either way.
   - LOW: Consensus is probably right, but worth noting the risks.

═══════════════════════════════════════════════════════════
IMPORTANT GUIDELINES:
═══════════════════════════════════════════════════════════

- AVOID GENERIC SKEPTICISM: "Anything can happen" is not useful.
- BE SPECIFIC: Name names, cite precedents, reference data.
- MATCH THE STAKES: A 95% consensus needs stronger counterargument than 60%.
- INTELLECTUAL HONESTY: If the consensus is clearly right, say so. Confidence: LOW.

═══════════════════════════════════════════════════════════
RESPOND WITH JSON ONLY:
═══════════════════════════════════════════════════════════
{
  "takes": {
    "0": {
      "bearCase": "The 50-word contrarian take...",
      "keyRisk": "What the market is missing",
      "whoDisagrees": "Who's betting the other way",
      "confidence": "MEDIUM"
    },
    ...
  }
}`;try{let i=await (0,o.withRetry)(async()=>a.chat.completions.create({model:o.GEMINI_MODELS.SMART,messages:[{role:"user",content:s}],temperature:.6,max_tokens:2500}),2,500),n=i.choices[0]?.message?.content||"",r=(0,o.extractJSON)(n);e.forEach((e,t)=>{let i=r.takes?.[String(t)];i&&(l[e.id]={marketId:e.id,bearCase:i.bearCase||"Contrarian view pending.",keyRisk:i.keyRisk||"Risk assessment pending.",whoDisagrees:i.whoDisagrees||"Opposition analysis pending.",confidence:i.confidence||"MEDIUM"})});let c=Object.values(r.takes||{}).filter(e=>"HIGH"===e.confidence).length;console.log(`Contrarian Batch ${t}: ${Object.keys(r.takes||{}).length} takes, ${c} high-confidence`)}catch(i){console.error(`Contrarian Batch ${t} failed:`,i),e.forEach(e=>{let t=e.yesPrice>.5?"NO":"YES";l[e.id]={marketId:e.id,bearCase:`The case for ${t} deserves consideration. Historical precedent suggests markets at these levels often reverse.`,keyRisk:"Markets tend to overweight recent events.",whoDisagrees:"Sophisticated traders may have information not yet public.",confidence:"LOW"}})}}));let c=Object.values(l).filter(e=>"HIGH"===e.confidence).length,h=`Generated ${Object.keys(l).length} contrarian takes. ${c} challenge consensus with high confidence.`;return console.log(`Contrarian Agent: ${h}`),{takes:l,summary:h}}}class E{apiKey;constructor(e){this.apiKey=e}async call(e){let{movingMarkets:t,newsContext:i={}}=e;if(0===t.length)return{briefs:{},summary:"No significant market movements detected."};console.log(`Intelligence Agent: Analyzing ${t.length} moving markets...`);let n=(0,o.createAIClient)(this.apiKey),s=[];for(let e=0;e<t.length;e+=5)s.push(t.slice(e,e+5));let a={};await Promise.all(s.map(async(e,t)=>{await new Promise(e=>setTimeout(e,150*t));let s=e.map((e,t)=>{let{market:n,priceChange:s,oldPrice:a,newPrice:o}=e,r=Math.abs(s),l=n.volume24hr>=1e6?`$${(n.volume24hr/1e6).toFixed(1)}M`:`$${(n.volume24hr/1e3).toFixed(0)}K`,c=i[n.id]?`
RECENT NEWS: ${i[n.id].substring(0,500)}`:"";return`═══════════════════════════════════════════════════════════
[${t}] MARKET: "${n.question}"
ID: ${n.id}
CATEGORY: ${n.category}
MOVEMENT: ${s>0?"UP":"DOWN"} ${r.toFixed(1)}pp (${(100*a).toFixed(0)}% → ${(100*o).toFixed(0)}%)
VOLUME: ${l}
DESCRIPTION: ${(n.description||"").substring(0,300)}${c}
═══════════════════════════════════════════════════════════`}).join("\n\n"),r=`You are an intelligence analyst at "The Polymarket Times" — serving tech Twitter and Polymarket traders.

TODAY'S DATE: ${new Date().toISOString().split("T")[0]}

Your job: Explain WHY these prediction markets are moving AND what needs to happen next.

This is the most valuable analysis you can provide. Traders see the WHAT (price change).
You explain the WHY (catalyst) and the PATH FORWARD (what needs to happen for resolution).

For future markets (30+ days out), focus heavily on the PATH TO RESOLUTION — what milestones, announcements, or events would move these markets.

═══════════════════════════════════════════════════════════
MARKETS WITH SIGNIFICANT MOVEMENT:
═══════════════════════════════════════════════════════════
${s}

═══════════════════════════════════════════════════════════
FOR EACH MARKET, PROVIDE:
═══════════════════════════════════════════════════════════

1. **CATALYST** (1 sentence)
   What news event, announcement, or development likely caused this move?
   - Be specific: names, dates, events
   - If uncertain, state your best hypothesis
   - Example: "OpenAI's GPT-5 preview demo at DevDay shifted expectations."

2. **CREDIBILITY** (HIGH / MEDIUM / LOW)
   Is this move justified by fundamentals, or an overreaction?
   - HIGH: Clear catalyst, justified magnitude
   - MEDIUM: Reasonable but possibly exaggerated
   - LOW: Likely noise, no clear catalyst, possible manipulation

3. **ANALYSIS** (100 words max)
   Intelligence brief explaining:
   - What happened and why it matters
   - Who the key players are
   - What's at stake
   - Tone: Matt Levine meets intelligence briefing. Sharp, informed, slightly wry.

4. **PATH_TO_RESOLUTION** (2-3 sentences) — CRITICAL FOR FUTURE MARKETS
   What specifically needs to happen for YES to win? For NO to win?
   - Example: "YES requires: (1) GPT-5 announcement by June, (2) public API access within 30 days. NO wins if: OpenAI pivots to enterprise-only or faces regulatory delay."
   - Be concrete about milestones, not vague

5. **KEY_MILESTONES** (comma-separated dates/events to watch)
   - Example: "OpenAI DevDay (Nov), Anthropic Claude 4 launch (Q1), Google I/O (May)"
   - Focus on upcoming catalysts that would move this market

6. **NEXT MOVE** (1 sentence)
   What would cause this market to move significantly again?

7. **TRADING IMPLICATION** (1 sentence)
   Actionable insight for a sophisticated trader.

═══════════════════════════════════════════════════════════
RESPOND WITH JSON ONLY:
═══════════════════════════════════════════════════════════
{
  "briefs": {
    "0": {
      "catalyst": "What caused the move",
      "credibility": "HIGH",
      "analysis": "The intelligence brief...",
      "pathToResolution": "What needs to happen for YES/NO",
      "keyMilestones": "Event 1 (Date), Event 2 (Date)",
      "nextMove": "What to watch for",
      "tradingImplication": "Actionable insight"
    },
    ...
  }
}`;try{let i=await (0,o.withRetry)(async()=>n.chat.completions.create({model:o.GEMINI_MODELS.SMART,messages:[{role:"user",content:r}],temperature:.5,max_tokens:3e3}),2,500),s=i.choices[0]?.message?.content||"",l=(0,o.extractJSON)(s);e.forEach((e,t)=>{let i=l.briefs?.[String(t)];if(i){let t=e.market.endDate?new Date(e.market.endDate):null,n=t?Math.ceil((t.getTime()-Date.now())/864e5):365;a[e.market.id]={marketId:e.market.id,catalyst:i.catalyst||"Catalyst unknown",credibility:i.credibility||"MEDIUM",analysis:i.analysis||"Analysis pending.",pathToResolution:i.pathToResolution||void 0,keyMilestones:i.keyMilestones||void 0,timeHorizon:n<7?"IMMINENT":n<30?"NEAR_TERM":n<180?"MEDIUM_TERM":"LONG_TERM",nextMove:i.nextMove||"Monitoring for developments.",tradingImplication:i.tradingImplication||"Exercise caution."}}}),console.log(`Intelligence Batch ${t}: Analyzed ${Object.keys(l.briefs||{}).length} markets`)}catch(i){console.error(`Intelligence Batch ${t} failed:`,i),e.forEach(e=>{let t=e.priceChange>0?"rose":"fell";a[e.market.id]={marketId:e.market.id,catalyst:"Catalyst under investigation",credibility:"MEDIUM",analysis:`Markets ${t} ${Math.abs(e.priceChange).toFixed(1)}pp. Our analysts are investigating the catalyst.`,nextMove:"Monitoring for further developments.",tradingImplication:"Exercise caution until catalyst is confirmed."}})}}));let r=Object.values(a).filter(e=>"HIGH"===e.credibility).length,l=Object.keys(a).length,c=l>0?`Analyzed ${l} significant moves. ${r} have high-credibility catalysts.`:"No significant market movements to analyze.";return console.log(`Intelligence Agent: ${c}`),{briefs:a,summary:c}}}async function y(e,t=[],n=!1){if(!e||e.length<1)return{error:"No markets available"};let s=(0,i.getSupabase)(),o=new Date,l=o.getHours(),c=new Date(o);c.setHours(l,0,0,0);let u=c.toISOString().slice(0,13),m=o.toISOString().slice(0,10);if(s&&!n&&1){let{data:e}=await s.from("editions").select("data").eq("date_str",u).single();if(e?.data)return console.log(`CACHE HIT (hourly): Returning edition for ${u}`),e.data;let{data:t}=await s.from("editions").select("data").eq("date_str",m).single();t?.data&&console.log(`CACHE HIT (daily baseline): Returning edition for ${m}`),console.log(`CACHE MISS: Generating fresh edition for ${u}`)}if(!process.env.GEMINI_API_KEY)throw Error("GEMINI_API_KEY not configured");let f=process.env.GEMINI_API_KEY;console.log(`Editorial: received ${e.length} markets`);let T=new Map;for(let e of t)for(let t of(T.set(e.primaryMarketId,e),e.relatedMarketIds))T.set(t,e);console.log("=== EDITORIAL DIRECTOR AGENT ===");let A=new r(f),{blueprint:S,reasoning:w}=await A.call({markets:e});console.log(`Editorial Director reasoning: ${w}`),console.log("=== GENERATING DATELINES (deterministic) ===");let I={};for(let e of S.stories)I[e.id]=d(e);console.log("=== HEADLINE WRITER AGENT ===");let{headlines:$}=await new h(f).call({blueprint:S});console.log("=== ARTICLE WRITER AGENT ===");let v=new g(f),{content:b,editorialNote:k}=await v.call({blueprint:S,headlines:$,datelines:I,groupByMarketId:T});console.log("=== CONTRARIAN AGENT (Alpha Signals) ===");let O=new p(f),{takes:N}=await O.call({blueprint:S,headlines:$,featuredOnly:!0});console.log(`Contrarian Agent: Generated ${Object.keys(N).length} alpha signals`),console.log("=== INTELLIGENCE AGENT (Market Movers) ===");let R=function(e,t,i=5){let n=[];for(let s of e){let e=t[s.id];if(void 0===e)continue;let a=s.yesPrice,o=(a-e)*100;Math.abs(o)>=i&&n.push({market:s,priceChange:o,oldPrice:e,newPrice:a})}return n.sort((e,t)=>Math.abs(t.priceChange)-Math.abs(e.priceChange)),n}(e,e.reduce((e,t)=>{let i=t.yesPrice-(t.priceChange24h||0)/100;return e[t.id]=i,e},{}),5),C=new E(f),{briefs:M}=await C.call({movingMarkets:R});console.log(`Intelligence Agent: Generated ${Object.keys(M).length} intelligence briefs`);let D={blueprint:S,content:b,headlines:$,datelines:I,contrarianTakes:N,intelligenceBriefs:M,curatorReasoning:w,editorNotes:k||"",timestamp:new Date().toISOString()};if(s&&1){let e={date_str:u,data:D,created_at:new Date().toISOString()},{error:t}=await s.from("editions").upsert(e,{onConflict:"date_str"});t?console.error("Failed to save edition to DB:",t):console.log(`Successfully saved hourly edition for ${u}`)}return a(S.stories.map(e=>({id:e.id,question:e.question,currentOdds:e.yesPrice}))).catch(e=>console.error("History record error:",e)),D}async function f(e){try{let{markets:i,groups:n=[]}=await e.json(),s=new URL(e.url),a="true"===s.searchParams.get("force"),o=await y(i,n,a);if("error"in o)return t.NextResponse.json(o,{status:400});return t.NextResponse.json(o)}catch(e){return console.error("Error generating editorial:",e),t.NextResponse.json({error:"Failed to generate editorial"},{status:500})}}e.s(["POST",()=>f,"getEditorial",()=>y,"revalidate",0,0],22085)}];

//# sourceMappingURL=app_api_editorial_route_ts_a6a090ec._.js.map