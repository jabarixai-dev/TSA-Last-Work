(function(){
  var section=document.documentElement.getAttribute('data-cms-section');
  if(!section)return;
  var DEFAULTS={
    index:{
      hero_caption:'Success & Integrity',
      hero_captions:['Success & Integrity','A nurturing start for every child','Learning with purpose','Building confident learners','Preparing tomorrow’s leaders'],
      hero_slides:['https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjgZvIHCkU8nFa6T_EH7sa1pBLXOTFxY1WMDDA55jZV2Qnu9R-KBsyOQOgPwMLsBYuhbqaQP6tgLNmXPi33HcUGWMun5cuCHEyoAGYJk0GLEZal2TYExypL3sbPGm0BR5oMeQLk-KTQ5SdMkqLLaYQJTELeYc9sQLJZ8GmUNIxMIYIXdNP3N3KSR4KJ72Q/s1448/111530.png','','','',''],
      achievement_students:'500+',achievement_teachers:'25+',achievement_years:'8+',achievement_pass_rate:'96%',
      social:{facebook:'',youtube:'',whatsapp:''}
    },
    about:{journey_dates:['2016','2021','2022','2023','2026'],principal_image:'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjAfYFbqwG_D5xaJ6BLucOhZ4dfp7zgwLK6b3lSSRScj_5yp5K8-eHdVNqZ8q_hViFcMXQ1yA9WNCOex46tIjhKSLbSWEo0qmWNQVv0Wpel6Sq9pgn3E6HO5JqrngKDagUqO0pZiRgVcfWYU9PuI6oCoW7v0yrPMWsKRs-tokc2Qupr0eMiMXkyzrqSSik/s1540/111531.png'},
    programs:{items:[{name:'Creche',intro:'A safe, caring and stimulating environment where young children begin developing essential social, emotional and early learning skills.'},{name:'Pre Nursery',intro:'An engaging early-learning stage that helps children build confidence, communication, independence and foundational learning skills through guided activities and play.'},{name:'Nursery',intro:'A strong foundation for young learners, developing early literacy, numeracy, creativity, social skills and a positive attitude toward learning.'},{name:'Primary School',intro:'A well-rounded educational experience that builds strong academic foundations while developing critical thinking, character, creativity and practical skills.'},{name:'Secondary School',intro:'A structured and supportive learning environment that prepares students academically and personally for higher education, future careers and responsible leadership.'}]},
    administration:{administration:[{name:'Charity Itodo',role:'Proprietress',bio:'',image:'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiWM38V1ltOzLtzmiVbU2M9CBGJRRXB80UvxHlMZJLFnn5OY36auE6Dv7x6rM0rEghAT3l9s8bupYprbAwhIXMwHwJIcdNQsprge3Nh26dD4vZG6hJ5ciKTGarlh0QBrU4elVQzErW_aMKpy6Y6G1fgK3_1pBgTqFSny5GB62tGde90aklUBZ3Lmet4lE/s2048/112086.png'}]}
  };
  function ready(){document.documentElement.classList.add('cms-ready');}
  function apply(data){
    if(!data||typeof data!=='object')return;
    Object.keys(data).forEach(function(key){
      var el=document.querySelector('[data-cms-key="'+CSS.escape(key)+'"]');
      if(el&&typeof data[key]==='string')el.textContent=data[key];
      var img=document.querySelector('[data-cms-image-key="'+CSS.escape(key)+'"]');
      if(img&&typeof data[key]==='string'&&data[key]){img.src=data[key];img.style.visibility='visible';}
    });
    if(section==='index'){
      renderSlideshow(data.hero_slides||DEFAULTS.index.hero_slides,data.hero_captions||DEFAULTS.index.hero_captions);
      renderSocial(data.social||DEFAULTS.index.social);
    }
    if(section==='administration') renderStaff(data.administration||DEFAULTS.administration.administration);
    if(section==='programs') renderPrograms(data.items||DEFAULTS.programs.items);
    if(section==='index' || section==='academics') renderPrograms(data.programs||DEFAULTS.programs.items);
    if(section==='about') renderJourneyDates(data.journey_dates||DEFAULTS.about.journey_dates);
  }
  function renderStaff(items){
    var grid=document.querySelector('[data-cms-staff-grid]');if(!grid)return;grid.innerHTML='';
    (Array.isArray(items)?items:[]).forEach(function(it){
      var card=document.createElement('div');card.className='card';
      if(it.image){var img=document.createElement('img');img.src=it.image;img.alt=it.name||'Staff';img.style.cssText='width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:8px;margin-bottom:14px;';card.appendChild(img);}
      var role=document.createElement('span');role.style.cssText='font-size:12px;color:var(--muted);';role.textContent=it.role||'';card.appendChild(role);
      var h=document.createElement('h3');h.textContent=it.name||'';card.appendChild(h);
      var p=document.createElement('p');p.textContent=it.bio||'';card.appendChild(p);grid.appendChild(card);
    });
  }
  function renderPrograms(items){
    var list=Array.isArray(items)?items:(items&&Array.isArray(items.items)?items.items:[]);
    if(!list.length)list=DEFAULTS.programs.items;
    var byKey={};list.forEach(function(it){var key=String(it.name||'').toLowerCase().replace(/\s+/g,'-');byKey[key]=it;});
    document.querySelectorAll('[data-cms-program-title]').forEach(function(el){var it=byKey[el.getAttribute('data-cms-program-title')];if(it&&it.name)el.textContent=it.name;});
    document.querySelectorAll('[data-cms-program-intro]').forEach(function(el){var it=byKey[el.getAttribute('data-cms-program-intro')];if(it&&it.intro)el.textContent=it.intro;});
  }
  function renderSlideshow(slides,captions){
    var box=document.querySelector('[data-cms-slideshow]'),target=document.querySelector('[data-cms-slides]'),dots=document.querySelector('[data-cms-slide-dots]'),caption=document.querySelector('[data-cms-slide-caption]');
    if(!box||!target)return;
    var raw=Array.isArray(slides)?slides:[];var capList=Array.isArray(captions)?captions:DEFAULTS.index.hero_captions;var list=[];
    raw.slice(0,5).forEach(function(url,i){if(typeof url==='string'&&url.trim())list.push({url:url,caption:capList[i]||''});});
    if(!list.length){var fallback=DEFAULTS.index.hero_slides;fallback.forEach(function(url,i){if(url)list.push({url:url,caption:capList[i]||''});});}
    target.innerHTML='';if(dots)dots.innerHTML='';
    list.forEach(function(item,i){var img=document.createElement('img');img.src=item.url;img.alt=item.caption||'Triumphant Standard Academy';img.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:'+(i===0?'1':'0')+';transition:opacity .7s ease;';img.setAttribute('data-slide',i);target.appendChild(img);if(dots){var dot=document.createElement('span');dot.style.cssText='width:7px;height:7px;border-radius:50%;background:#fff;opacity:'+(i===0?'1':'.45')+';display:block;';dot.setAttribute('data-dot',i);dots.appendChild(dot);}});
    function setCaption(n){if(caption)caption.textContent=list[n]?list[n].caption:'';}setCaption(0);
    var imgs=target.querySelectorAll('[data-slide]'),ds=dots?dots.querySelectorAll('[data-dot]'):[];if(imgs.length<=1)return;var i=0;setInterval(function(){imgs[i].style.opacity='0';if(ds.length)ds[i].style.opacity='.45';i=(i+1)%imgs.length;imgs[i].style.opacity='1';if(ds.length)ds[i].style.opacity='1';setCaption(i);},4000);
  }
  function renderJourneyDates(dates){var list=Array.isArray(dates)?dates:DEFAULTS.about.journey_dates;document.querySelectorAll('[data-cms-journey-date]').forEach(function(el){var i=parseInt(el.getAttribute('data-cms-journey-date'),10)-1;if(list[i])el.textContent=list[i];});}
  function renderSocial(social){
    ['facebook','youtube','whatsapp'].forEach(function(name){
      var el=document.querySelector('[data-cms-social="'+name+'"]');if(!el)return;
      var url=(social&&social[name])||'';
      if(url){el.href=url;el.target='_blank';el.rel='noopener noreferrer';el.style.opacity='1';el.onclick=null;}
      else {el.href='#';el.style.opacity='.55';el.onclick=function(e){e.preventDefault();};}
    });
  }
  function loadAllContent(){return fetch('/.netlify/functions/content',{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json();});}
  // Show built-in/static content immediately; CMS values refresh in the background.
  if(section==='index'){renderSlideshow(DEFAULTS.index.hero_slides,DEFAULTS.index.hero_captions);renderSocial(DEFAULTS.index.social);ready();}else{apply(DEFAULTS[section]||{});renderSocial(DEFAULTS.index.social);ready();}
  loadAllContent().then(function(all){var data=all[section]||{};if(section==='index'){if(!Array.isArray(data.hero_slides))data.hero_slides=DEFAULTS.index.hero_slides;if(!Array.isArray(data.hero_captions))data.hero_captions=DEFAULTS.index.hero_captions;if(!data.social)data.social=DEFAULTS.index.social;}if(section==='about'){if(!Array.isArray(data.journey_dates))data.journey_dates=DEFAULTS.about.journey_dates;if(!data.principal_image)data.principal_image=DEFAULTS.about.principal_image;}if(section==='programs'&&!Array.isArray(data.items))data.items=DEFAULTS.programs.items;if(section==='administration'&&!Array.isArray(data.administration))data.administration=DEFAULTS.administration.administration;if(section==='academics'&&data.program_structure_version!==2){data.h1_1='Our Academic Programmes';data.p_2='We provide a well-rounded education across Creche, Pre Nursery, Nursery, Primary School and Secondary School, designed to unlock every student’s potential.';}apply(data);var programs=((all.programs&&all.programs.items)||DEFAULTS.programs.items);if(section==='index'||section==='academics'||section==='programs')renderPrograms(programs);renderSocial((all.index&&all.index.social)||DEFAULTS.index.social);ready();}).catch(function(){/* immediate content remains visible */});

})();
