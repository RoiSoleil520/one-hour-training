const SupplementalArt = (()=>{
 const line=(points,color='#405339',width=7)=>`<polyline points="${points}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
 const head=(x,y)=>`<circle cx="${x}" cy="${y}" r="11" fill="#c8a787"/>`;
 const arrow=(x,y)=>`<path d="M${x} ${y+20}v-20m-5 6 5-6 5 6" fill="none" stroke="#79944f" stroke-width="2"/>`;
 function pose(kind,end){
  const floor=line('20,178 200,178','#d1dac6',2);
  let body='';
  if(kind==='floor-press')body=head(43,145)+line('65,150 126,150','#405339',17)+line('126,150 150,126 180,174')+line(end?'69,147 77,112 80,80':'69,147 95,165 95,127','#79944f')+line(end?'68,80 92,80':'83,127 107,127','#405339',6)+(end?arrow(115,93):'');
  if(kind==='wall-slide')body=line('170,15 170,176','#aab59d',5)+head(120,43)+line('120,64 115,120','#405339',16)+line('115,120 95,174')+line('115,120 140,174')+line(end?'125,70 165,55 165,23':'125,70 165,103 165,72','#79944f')+(end?arrow(188,35):'');
  if(kind==='wall-plus'){const x=end?99:111;body=line('177,20 177,176','#aab59d',5)+head(x-5,44)+line(`${x},65 85,120`,'#405339',16)+line('85,120 62,174')+line(`${x},70 142,81 173,81`,'#79944f')+(end?line('122,43 103,43 109,38 103,43 109,48','#79944f',2):'');}
  if(kind==='band-external')body=head(105,43)+line('105,64 105,122','#405339',18)+line('105,122 82,174')+line('105,122 129,174')+line('112,74 131,105','#79944f')+line(end?'131,105 175,103':'131,105 106,105','#79944f')+line(end?'45,105 175,103':'45,105 106,105','#aab59d',2)+`<circle cx="131" cy="105" r="4" fill="#c8a787"/>`;
  if(kind==='short-foot')body=`<path d="M62 78L57 140Q40 157 66 169H178Q197 164 177 153L130 145 110 117 108 78" fill="#e3ead8" stroke="#405339" stroke-width="3"/><path d="${end?'M76 169Q111 150 145 169':'M76 169Q111 166 145 169'}" fill="none" stroke="#79944f" stroke-width="4"/><circle cx="65" cy="169" r="4" fill="#79944f"/><circle cx="176" cy="169" r="4" fill="#79944f"/>${end?line('148,132 135,132 141,127 135,132 141,137','#79944f',2):''}`;
  if(kind==='balance')body=line('165,98 202,98 202,177','#aab59d',5)+head(105,42)+line('105,63 105,122','#405339',17)+line('112,72 139,99 178,98','#79944f')+line('105,122 83,174')+line(end?'105,122 140,141 162,128':'105,122 130,174');
  if(kind==='flat-walk')body=head(105,42)+line('105,63 105,119','#405339',17)+line(end?'103,74 77,99 61,87':'103,74 83,108','#79944f')+line(end?'110,74 133,100':'110,74 131,106','#79944f')+line(end?'105,119 77,144 60,174':'105,119 88,173')+line(end?'105,119 138,145 157,174':'105,119 128,173');
  return floor+body;
 }
 function thumbnail(exercise){if(exercise.diagram==='hip-thrust')return LegacyExerciseArt.thumbnail(exercise);return `<svg viewBox="0 0 220 195" aria-hidden="true">${pose(exercise.diagram,true)}</svg>`;}
 function guide(exercise){if(exercise.diagram==='hip-thrust')return LegacyExerciseArt.guide(exercise);return `<svg viewBox="0 0 480 240" role="img" aria-label="${exercise.name}：${exercise.start}，然后${exercise.end}" xmlns="http://www.w3.org/2000/svg"><rect width="232" height="240" rx="12" fill="#edf1e5"/><rect x="248" width="232" height="240" rx="12" fill="#e7eedb"/><g transform="translate(6 29)">${pose(exercise.diagram,false)}</g><g transform="translate(254 29)">${pose(exercise.diagram,true)}</g><g font-family="sans-serif" font-size="12" fill="#536747"><text x="18" y="23">01 / ${exercise.start}</text><text x="266" y="23">02 / ${exercise.end}</text></g><g font-family="sans-serif" font-size="9" fill="#7b896d"><text x="18" y="227">准备 · 自然呼吸</text><text x="266" y="227">轻缓 · 舒适范围</text></g></svg>`;}
 return {thumbnail,guide};
})();
