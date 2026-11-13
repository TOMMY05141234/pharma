const modal=document.querySelector('#checklist');
const boxes=[...document.querySelectorAll('.choices input')];
const status=document.querySelector('#selection');
const copy=document.querySelector('#copy');
document.querySelector('#open-checklist').addEventListener('click',()=>modal.showModal());
boxes.forEach(box=>box.addEventListener('change',()=>{const selected=boxes.filter(b=>b.checked);boxes.forEach(b=>b.disabled=selected.length===3&&!b.checked);status.textContent=selected.length===3?'大切にしたい３つの条件が見えてきました。':`あと${3-selected.length}つ選べます。`;copy.disabled=selected.length!==3;document.querySelector('#dialog-next').hidden=selected.length!==3;copy.textContent='選んだ条件をコピーする';}));
copy.addEventListener('click',async()=>{const text='私が働き方で大切にしたい３つの条件\n'+boxes.filter(b=>b.checked).map(b=>'・'+b.value).join('\n');try{await navigator.clipboard.writeText(text);status.textContent='コピーしました。お手元のメモに貼り付けてください。';copy.textContent='コピーしました ✓';}catch{status.textContent=text;status.style.whiteSpace='pre-line';copy.textContent='上の条件をメモしてください';}});
modal.addEventListener('click',e=>{const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close();});

const sticky=document.querySelector('.sticky-cta');const hero=document.querySelector('.hero');
if(sticky&&hero&&'IntersectionObserver' in window){new IntersectionObserver(([e])=>sticky.classList.toggle('show',!e.isIntersecting),{threshold:0}).observe(hero);}
