// Original vector schematics: two key positions for each movement, rendered locally.
// Coordinates use a 220 × 195 drawing space. These are position cues, not anatomical models.
const LegacyExerciseArt = (() => {
  const ink = '#34442e', skin = '#c8a787', green = '#79944f', equipment = '#aab59d';
  const line = (points, color = ink, width = 7) => `<polyline points="${points.map(point=>point.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const rod = points => line(points,equipment,5);
  const cable = points => line(points,'#8b967e',1.5);
  function figure(head, torso, arms, legs, active = 'arms') {
    return legs.map(points=>line(points,active==='legs'?green:ink,9)).join('') +
      line(torso,ink,19) + line(torso,green,12) +
      arms.map(points=>line(points,active==='arms'?green:skin,7)).join('') +
      `<circle cx="${head[0]}" cy="${head[1]}" r="11" fill="${skin}"/><path d="M${head[0]-9} ${head[1]-4} Q${head[0]-3} ${head[1]-17} ${head[0]+10} ${head[1]-7}" fill="${ink}"/>`;
  }
  function weight(x,y,angle=0) {
    return `<g transform="translate(${x} ${y}) rotate(${angle})"><path d="M-12 0H12" stroke="${ink}" stroke-width="4"/><rect x="-15" y="-7" width="7" height="14" rx="2" fill="${green}"/><rect x="8" y="-7" width="7" height="14" rx="2" fill="${green}"/></g>`;
  }
  function arrow(x1,y1,x2,y2) {
    const angle = Math.atan2(y2-y1,x2-x1)*180/Math.PI;
    return `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${green}" stroke-width="2" stroke-dasharray="4 3"/><path d="M-7 -4L0 0L-7 4" fill="none" stroke="${green}" stroke-width="2" transform="translate(${x2} ${y2}) rotate(${angle})"/>`;
  }
  const bench = (incline=false) => incline ? rod([[43,146],[89,91],[137,147],[163,147]])+rod([[59,136],[59,175],[158,175],[158,148]]) : rod([[32,139],[152,139]])+rod([[45,139],[45,176],[137,176],[137,139]]);
  const seatedLegs = [[[105,112],[143,125],[159,170]],[[103,112],[128,131],[133,171]]];
  const standingLegs = [[[108,108],[93,141],[87,172]],[[108,108],[125,140],[134,172]]];
  const frame = rod([[30,174],[30,22],[190,22],[190,174]]) + `<circle cx="110" cy="22" r="5" fill="${equipment}"/>`;
  function drawing(kind, end) {
    switch (kind) {
      case 'pulldown': {
        const hands = end ? [[76,85],[144,85]] : [[63,37],[157,37]];
        return frame+rod([[79,119],[138,119]])+rod([[95,120],[95,175]])+cable([[110,22],[110,hands[0][1]]])+line(hands,ink,5)+
          figure([110,62],[[110,81],[110,112]],[[[98,83],end?[77,103]:[78,58],hands[0]],[[122,83],end?[143,103]:[142,58],hands[1]]],seatedLegs)+ (end?arrow(164,46,164,85):'');
      }
      case 'row': case 'chest-row': {
        const chest = kind==='chest-row';
        const hands=end?[[110,102],[115,108]]:[[172,94],[172,101]];
        return rod([[38,172],[38,45],[50,45]])+rod([[90,125],[120,125],[120,175]])+rod([[172,152],[191,133]])+
          (chest?rod([[134,72],[133,108]])+line([[134,77],[134,104]],equipment,10):'')+
          cable([[38,96],hands[0]])+figure([110,57],[[110,76],[110,114]],[[[116,80],end?[144,95]:[144,85],hands[0]],[[106,82],end?[133,109]:[143,101],hands[1]]],[[[109,114],[145,132],[171,158]],[[106,114],[139,136],[161,161]]])+(end?arrow(166,73,128,82):'');
      }
      case 'face-pull': {
        const hand=end?[110,57]:[53,76];
        return rod([[29,175],[29,35]])+cable([[29,60],hand])+figure([118,45],[[118,65],[118,109]],[[[116,68],end?[149,76]:[84,72],hand],[[121,71],end?[139,88]:[88,80],[hand[0]+5,hand[1]+8]]],standingLegs)+(end?arrow(56,46,98,43):'');
      }
      case 'curl': case 'hammer': case 'cable-curl': {
        const hands=end?[[78,75],[143,75]]:[[80,125],[139,125]];
        return (kind==='cable-curl'?rod([[39,170],[39,156]])+cable([[39,161],hands[0]]):'')+
          figure([110,34],[[110,56],[110,108]],[[[95,61],[83,91],hands[0]],[[125,61],[138,91],hands[1]]],standingLegs)+
          (kind==='cable-curl'?line(hands,ink,5):weight(...hands[0],kind==='hammer'?90:0)+weight(...hands[1],kind==='hammer'?90:0))+(end?arrow(58,119,60,79):'');
      }
      case 'bench-press': case 'incline-bench': {
        const inclined=kind==='incline-bench';
        const shoulder=inclined?[84,99]:[68,126];
        const hand=end?[shoulder[0]+7,shoulder[1]-68]:[shoulder[0]-14,shoulder[1]-15];
        return bench(inclined)+figure(inclined?[71,78]:[43,122],[shoulder,[126,130]],[[shoulder,end?[shoulder[0]+5,shoulder[1]-33]:[shoulder[0]-28,shoulder[1]+7],hand],[[shoulder[0]+10,shoulder[1]+3],end?[shoulder[0]+25,shoulder[1]-32]:[shoulder[0]+27,shoulder[1]+7],[hand[0]+17,hand[1]+4]]],[[[126,130],[158,145],[165,175]],[[121,130],[145,149],[147,175]]])+weight(...hand)+weight(hand[0]+17,hand[1]+4)+(end?arrow(126,104,126,63):'');
      }
      case 'machine-press': case 'incline-machine': {
        const inclined=kind==='incline-machine';
        const hand=end?[172,inclined?57:86]:[115,88];
        return rod([[77,51],[78,128],[125,128],[125,175]])+rod([[78,175],[78,128]])+figure([102,48],[[104,70],[107,116]],[[[110,76],end?[143,75]:[87,97],hand],[[110,83],end?[145,89]:[93,109],[hand[0],hand[1]+9]]],seatedLegs)+line([[hand[0],hand[1]-7],[hand[0],hand[1]+12]],ink,5)+rod([[hand[0]+10,hand[1]],[187,123],[187,174]])+(end?arrow(129,48,170,inclined?35:48):'');
      }
      case 'fly': case 'reverse-fly': {
        const reverse=kind==='reverse-fly';
        const wide=reverse?end:!end;
        const hands=wide?[[38,87],[182,87]]:[[102,65],[118,65]];
        return (reverse?rod([[97,102],[124,102],[124,175]])+rod([[110,78],[110,108]]):rod([[24,175],[24,45]])+rod([[196,175],[196,45]])+cable([[24,66],hands[0]])+cable([[196,66],hands[1]]))+
          figure([110,39],[[110,60],[110,111]],[[[95,65],wide?[65,70]:[73,89],hands[0]],[[125,65],wide?[155,70]:[147,89],hands[1]]],standingLegs)+(end?(reverse?arrow(149,44,183,57):arrow(40,45,86,45)):'');
      }
      case 'pushdown': {
        const hand=end?[125,119]:[138,75];
        return rod([[181,173],[181,22],[153,22]])+cable([[153,22],hand])+figure([107,34],[[106,55],[106,106]],[[[117,60],[121,89],hand],[[110,63],[115,90],[hand[0]-9,hand[1]+3]]],standingLegs)+line([[hand[0]-10,hand[1]],[hand[0]+7,hand[1]+4]],ink,4)+(end?arrow(160,79,155,119):'');
      }
      case 'overhead': case 'dumbbell-overhead': {
        const hand=end?[105,19]:[86,52];
        return (kind==='overhead'?rod([[40,174],[40,156]])+cable([[40,160],hand]):'')+
          figure([115,58],[[115,79],[115,118]],[[[108,81],[87,32],hand],[[120,81],[126,33],[hand[0]+12,hand[1]]]],[[[115,118],[96,146],[90,175]],[[115,118],[134,146],[140,175]]])+(kind==='dumbbell-overhead'?weight(hand[0]+5,hand[1],90):line([hand,[hand[0]+12,hand[1]]],ink,5))+(end?arrow(67,59,72,22):'');
      }
      case 'squat': case 'goblet': {
        const squatted=end;
        const head=squatted?[131,76]:[110,34];
        const shoulders=squatted?[120,97]:[110,57];
        const hips=squatted?[91,123]:[110,108];
        return figure(head,[shoulders,hips],kind==='goblet'?[[shoulders,[132,110],[146,squatted?91:67]]]:[[shoulders,[97,squatted?87:62],[90,squatted?86:56]]],squatted?[[hips,[144,126],[140,174]],[[94,126],[126,137],[122,174]]]:standingLegs,'legs')+
          (kind==='goblet'?weight(squatted?146:139,squatted?91:66,90):line([[shoulders[0]-37,shoulders[1]-6],[shoulders[0]+32,shoulders[1]-6]],ink,4)+weight(shoulders[0]-35,shoulders[1]-6,90)+weight(shoulders[0]+32,shoulders[1]-6,90))+(end?arrow(172,58,172,113):'');
      }
      case 'hinge': {
        const head=end?[153,90]:[110,35], shoulder=end?[135,104]:[110,57], hips=end?[90,112]:[110,107],hand=end?[144,147]:[126,114];
        return figure(head,[shoulder,hips],[[shoulder,[hand[0]-3,hand[1]-20],hand]],[[hips,[115,143],[122,173]],[[hips[0]-4,hips[1]],[101,144],[106,173]]],'legs')+weight(hand[0],hand[1],90)+line([[hand[0]-24,hand[1]],[hand[0]+24,hand[1]]],ink,4)+(end?arrow(98,88,69,100):'');
      }
      case 'hip-thrust': case 'bridge': {
        const lifted=end, thrust=kind==='hip-thrust';
        const shoulder=thrust?[67,113]:[64,157], hips=lifted?[114,thrust?110:118]:[111,157],knee=lifted?[159,thrust?112:99]:[153,122];
        return (thrust?rod([[26,130],[68,130],[68,175],[26,175],[26,130]]):'')+
          figure(thrust?[47,102]:[45,154],[shoulder,hips],[[shoulder,[85,142],[110,151]]],[[hips,knee,[173,174]],[[hips[0]-2,hips[1]+6],[knee[0]-11,knee[1]+9],[159,174]]],'legs')+(thrust?weight(...hips,90)+line([[hips[0]-24,hips[1]],[hips[0]+24,hips[1]]],ink,4):'')+(end?arrow(115,155,115,126):'');
      }
      case 'abduction': {
        return rod([[82,109],[139,109],[139,176]])+rod([[83,176],[83,110]])+figure([110,37],[[110,59],[110,106]],[[[94,64],[78,97],[79,117]],[[126,64],[141,97],[141,117]]],end?[[[105,107],[63,128],[56,169]],[[114,107],[157,128],[164,169]]]:[[[104,107],[96,130],[96,169]],[[116,107],[125,130],[125,169]]],'legs')+line(end?[[58,126],[52,145]]:[[88,126],[85,145]],equipment,10)+line(end?[[161,126],[168,145]]:[[133,126],[136,145]],equipment,10)+(end?arrow(78,153,51,153)+arrow(144,153,171,153):'');
      }
      case 'leg-curl': {
        const foot=end?[130,170]:[187,126];
        return rod([[67,49],[67,119],[133,119],[133,174]])+figure([89,48],[[90,70],[99,113]],[[[98,77],[110,104],[114,119]]],[[[99,113],[143,118],foot],[[102,119],[138,125],[foot[0]-6,foot[1]+5]]],'legs')+line([[133,108],[153,111]],equipment,8)+weight(...foot,90)+(end?arrow(183,143,157,164):'');
      }
      case 'shoulder-press': {
        const hands=end?[[74,24],[146,24]]:[[64,66],[156,66]];
        return rod([[89,112],[136,112],[136,173]])+figure([110,54],[[110,77],[110,110]],[[[94,79],end?[79,53]:[62,97],hands[0]],[[126,79],end?[141,53]:[158,97],hands[1]]],seatedLegs)+weight(...hands[0])+weight(...hands[1])+(end?arrow(43,68,43,28):'');
      }
      case 'lateral': {
        const hands=end?[[36,76],[184,76]]:[[82,125],[138,125]];
        return figure([110,35],[[110,57],[110,109]],[[[95,63],end?[65,67]:[82,93],hands[0]],[[125,63],end?[155,67]:[138,93],hands[1]]],standingLegs)+weight(...hands[0])+weight(...hands[1])+(end?arrow(53,120,30,94)+arrow(167,120,190,94):'');
      }
      case 'prone-y': {
        return bench(true)+figure([81,82],[[94,101],[124,136]],[[[96,101],end?[65,67]:[67,116],end?[41,41]:[46,132]],[[99,100],end?[127,65]:[139,112],end?[151,40]:[161,125]]],[[[124,136],[155,156],[185,173]],[[124,136],[142,159],[165,174]]])+(end?arrow(38,107,38,68)+arrow(170,107,170,68):'');
      }
      case 'dead-bug': {
        return figure([39,159],[[58,158],[111,158]],[[[62,154],end?[34,131]:[65,117],end?[18,106]:[67,80]],[[68,158],[77,116],[79,81]]],[[[111,158],[130,116],end?[188,154]:[170,117]],[[111,158],[123,112],[162,108]]],'core')+(end?arrow(173,124,189,144):'');
      }
      case 'pallof': {
        // Top view makes the lateral resistance distinct from the forward hand movement.
        const handY = end ? 151 : 123;
        return `<g><text x="148" y="28" font-size="9" fill="#7b896d">俯视图</text>
          <ellipse cx="79" cy="115" rx="6" ry="15" fill="${ink}"/>
          <ellipse cx="141" cy="115" rx="6" ry="15" fill="${ink}"/>
          <ellipse cx="110" cy="89" rx="25" ry="17" fill="${ink}"/>
          <ellipse cx="110" cy="91" rx="18" ry="12" fill="${green}"/>
          <circle cx="110" cy="78" r="12" fill="${skin}"/>
          <path d="M99 77Q110 63 121 77" fill="${ink}"/>
          <path d="M108 90L110 94L112 90" fill="${skin}"/>
          ${line([[88,95],end?[96,125]:[88,119],[107,handY]],skin,7)}
          ${line([[132,95],end?[124,125]:[132,119],[113,handY]],skin,7)}
          ${rod([[25,93],[25,158]])}${cable([[25,handY],[110,handY]])}
          <circle cx="110" cy="${handY}" r="4" fill="${ink}"/>
          ${arrow(84,handY-11,42,handY-11)}
          ${arrow(169,111,169,147)}
          <text x="30" y="${handY+18}" font-size="9" fill="#72875a">侧面阻力</text>
          <text x="155" y="163" font-size="9" fill="#72875a">面朝前</text>
        </g>`;
      }
      case 'kickback': {
        return rod([[39,172],[39,39],[56,39]])+figure([93,49],[[103,69],[122,112]],[[[104,73],[68,82],[42,89]],[[109,78],[70,91],[43,96]]],[[[122,112],[118,143],[117,174]],[[122,112],end?[154,133]:[135,144],end?[181,153]:[136,173]]],'legs')+cable([[39,165],end?[181,153]:[136,173]])+(end?arrow(153,174,180,163):'');
      }
      case 'farmer': {
        const legs=end?[[[110,108],[88,140],[65,172]],[[110,108],[139,137],[155,172]]]:standingLegs;
        return figure([110,35],[[110,57],[110,108]],[[[94,62],[83,91],[79,127]],[[126,62],[138,94],[141,127]]],legs,'core')+weight(79,133)+weight(141,133)+(end?arrow(50,154,25,154):'');
      }
      case 'plank': case 'push-up': {
        const push=kind==='push-up', low=push?end:!end;
        const shoulder=[65,low?129:99],hip=[120,low?146:120];
        const arms=push?[[shoulder,low?[40,145]:[64,135],[63,174]]]:[[shoulder,[65,169],[91,169]]];
        return figure([47,low?122:90],[shoulder,hip],arms,[[hip,[157,low?155:140],[187,171]],[[hip[0],hip[1]+4],[151,low?158:145],[181,174]]],'core')+(end?(push?arrow(100,88,100,114):arrow(119,152,119,133)):'');
      }
      case 'side-plank': {
        const hip=end?[117,121]:[116,157];
        return figure([47,83],[[65,104],hip],[[[65,106],[60,167],[88,169]],[[72,105],[100,109],[121,120]]],[[hip,[154,end?145:162],[186,173]],[[hip[0],hip[1]+5],[150,end?149:165],[181,175]]],'core')+(end?arrow(118,159,118,137):'');
      }
      case 'bird-dog': {
        return figure([55,94],[[74,108],[126,112]],[[[74,109],[71,142],[65,174]],[[77,110],end?[50,109]:[85,141],end?[20,106]:[86,174]]],[[[126,112],[132,151],[159,173]],[[126,112],end?[164,111]:[147,150],end?[195,111]:[171,171]]],'core')+(end?arrow(174,143,191,123):'');
      }
      case 'single-row': {
        const hand=end?[123,103]:[114,151];
        return rod([[45,146],[164,146],[164,174]])+figure([60,71],[[79,91],[132,101]],[[[80,91],[65,119],[64,144]],[[83,94],end?[137,81]:[103,121],hand]],[[[132,101],[146,141],[173,173]],[[132,101],[123,143],[96,145]]])+weight(...hand)+(end?arrow(166,138,165,102):'');
      }
      case 'leg-press': {
        const foot=end?[168,56]:[145,98],knee=end?[132,101]:[96,97];
        return rod([[34,92],[73,142],[107,142]])+rod([[45,175],[45,111]])+rod([[113,164],[193,42]])+line([[foot[0]-14,foot[1]-13],[foot[0]+18,foot[1]+15]],equipment,8)+
          figure([45,78],[[61,100],[90,139]],[[[63,101],[77,131],[97,145]]],[[[90,139],knee,foot],[[94,143],[knee[0]+10,knee[1]+8],[foot[0]+8,foot[1]+7]]],'legs')+(end?arrow(178,109,195,78):'');
      }
      case 'split-squat': {
        const hip=end?[112,123]:[110,99],shoulder=end?[105,79]:[105,53];
        return rod([[157,121],[198,121],[198,174]])+figure(end?[104,57]:[104,31],[shoulder,hip],[[[shoulder[0],shoulder[1]+5],[88,100],[85,end?131:104]]],[[hip,end?[74,132]:[81,126],[75,174]],[hip,end?[156,152]:[144,121],[174,120]]],'legs')+(end?arrow(49,65,49,111):'');
      }
      default: throw new Error(`Missing exercise illustration: ${kind}`);
    }
  }
  const floor = '<path d="M19 178H201" stroke="#d5ddc9" stroke-width="1.5"/>';
  function thumbnail(exercise) {
    return `<svg viewBox="0 0 220 195" aria-hidden="true" focusable="false">${floor}${drawing(exercise.diagram,true)}</svg>`;
  }
  function guide(exercise) {
    return `<svg viewBox="0 0 480 240" role="img" aria-label="${exercise.name}动作示意：${exercise.start}，然后${exercise.end}" xmlns="http://www.w3.org/2000/svg"><rect width="232" height="240" rx="12" fill="#edf1e5"/><rect x="248" width="232" height="240" rx="12" fill="#e7eedb"/><g transform="translate(6 29)">${floor}${drawing(exercise.diagram,false)}</g><g transform="translate(254 29)">${floor}${drawing(exercise.diagram,true)}</g><g font-size="12" fill="#536747" font-family="sans-serif"><text x="20" y="23">01 / ${exercise.start}</text><text x="267" y="23">02 / ${exercise.end}</text></g><g font-size="9" fill="#7b896d" font-family="sans-serif"><text x="20" y="227">准备 · 稳住身体</text><text x="267" y="227">发力 · 控制还原</text></g></svg>`;
  }
  return {thumbnail,guide};
})();

// Dataset images stay at their licensed 180 × 180 resolution.
const ExerciseArt = {
  thumbnail(exercise) {
    if (exercise.legacy) return LegacyExerciseArt.thumbnail(exercise);
    if (exercise.supplemental) return SupplementalArt.thumbnail(exercise);
    return `<img class="dataset-thumbnail" src="${exercise.imageUrl}" width="180" height="180" loading="lazy" decoding="async" alt="${exercise.englishName}"><span class="media-attribution">© Gym visual — https://gymvisual.com/</span>`;
  },
  guide(exercise) {
    if (exercise.legacy) return LegacyExerciseArt.guide(exercise);
    if (exercise.supplemental) return SupplementalArt.guide(exercise);
    return `<img class="dataset-animation" src="${exercise.gifUrl}" width="180" height="180" alt="${exercise.englishName} 动作动画"><a class="media-attribution" href="https://gymvisual.com/" target="_blank" rel="noopener">${exercise.attribution}</a>`;
  }
};
// A failed CDN request can retry the exact pinned file on GitHub. Keep an explicit link if both fail.
document.addEventListener('error',event=>{
  const image=event.target;
  if (!(image instanceof HTMLImageElement) || !image.matches('.dataset-thumbnail,.dataset-animation')) return;
  if (!image.dataset.retried) {
    image.dataset.retried='true';
    image.src=image.src.replace(DATASET_MEDIA_BASE,`https://raw.githubusercontent.com/RoiSoleil520/exercises-dataset/${DATASET_REVISION}/`);
    return;
  }
  image.alt='图片暂时无法加载，请打开动作详情中的原图链接。';
  image.classList.add('media-unavailable');
},true);
