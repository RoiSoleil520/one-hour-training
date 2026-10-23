// Historical records only. New training plans and the public library use dataset.js.
// Add or update exercises here; IDs are stable references in saved workout records.
const LEGACY_EXERCISE_GROUPS = {back:'背部',chest:'胸部',shoulders:'肩部',biceps:'二头',triceps:'三头',glutes:'臀部',legs:'腿部',core:'核心',full:'全身'};
const LEGACY_EXERCISES = [
  {
    "id": "neutral-pulldown",
    "name": "宽距对握高位下拉",
    "groups": [
      "back"
    ],
    "equipment": "高位下拉器械",
    "reps": "10–12",
    "diagram": "pulldown",
    "muscles": "背阔肌、肱二头肌",
    "setup": "调好压腿垫，双脚踩稳，使用宽距对握把手。",
    "cues": [
      "躯干保持稳定，手腕与前臂对齐。",
      "让肘部朝身体两侧向下走，把手拉向上胸。",
      "缓慢伸臂回到上方，肩胛随手臂自然移动。"
    ],
    "mistake": "不要后仰甩动身体，也不要拉到颈后。",
    "source": "https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/",
    "start": "伸臂准备",
    "end": "肘部向下"
  },
  {
    "id": "chest-supported-row",
    "name": "胸托划船",
    "groups": [
      "back"
    ],
    "equipment": "胸托划船机",
    "reps": "10–12",
    "diagram": "chest-row",
    "muscles": "背阔肌、菱形肌、斜方肌",
    "setup": "调整座椅，让胸口贴住胸垫，双脚踩稳。",
    "cues": [
      "手臂向前伸，胸口始终轻贴靠垫。",
      "肘部向后带动把手，拉到躯干旁。",
      "控制还原，允许肩胛自然向前移动。"
    ],
    "mistake": "不要抬胸离开靠垫或耸肩抢拉。",
    "source": "https://www.nasm.org/resource-center/exercise-library/seated-machine-row-close-grip",
    "start": "胸贴靠垫",
    "end": "肘向后拉"
  },
  {
    "id": "cable-row",
    "name": "坐姿绳索划船",
    "groups": [
      "back"
    ],
    "equipment": "绳索划船器械",
    "reps": "12",
    "diagram": "row",
    "muscles": "背阔肌、菱形肌、肱二头肌",
    "setup": "坐稳，双脚踩脚踏，膝盖微屈，双手握把。",
    "cues": [
      "保持脊柱自然，先稳住躯干。",
      "把手拉向腹部附近，肘部靠近身体向后走。",
      "缓慢伸臂，不让配重把身体猛拽向前。"
    ],
    "mistake": "不要反复大幅前后摆动腰背。",
    "source": "https://www.nasm.org/resource-center/exercise-library/seated-machine-row-close-grip",
    "start": "伸臂坐稳",
    "end": "拉向腹部"
  },
  {
    "id": "face-pull",
    "name": "绳索面拉",
    "groups": [
      "shoulders",
      "back"
    ],
    "equipment": "绳索器械 + 绳把",
    "reps": "12–15",
    "diagram": "face-pull",
    "muscles": "三角肌后束、菱形肌",
    "setup": "滑轮调到眼睛附近高度，双手握绳，退后站稳。",
    "cues": [
      "收紧躯干，保持头颈自然。",
      "把绳拉向脸两侧，双手分开，肘部向外后方移动。",
      "缓慢伸臂还原，保持绳索张力。"
    ],
    "mistake": "不要耸肩、挺腰或用身体后仰借力。",
    "source": "https://www.nasm.org/resource-center/exercise-library/face-pull",
    "start": "伸臂握绳",
    "end": "拉向脸两侧"
  },
  {
    "id": "dumbbell-curl",
    "name": "哑铃弯举",
    "groups": [
      "biceps"
    ],
    "equipment": "哑铃",
    "reps": "12",
    "diagram": "curl",
    "muscles": "肱二头肌",
    "setup": "双脚站稳，双手持哑铃，掌心朝前，上臂放在身侧。",
    "cues": [
      "上臂尽量保持原位，手腕保持中立。",
      "屈肘把哑铃向肩部方向举起。",
      "慢慢放下，肘部伸到舒适位置。"
    ],
    "mistake": "不要甩腰或把肘部大幅向前送。",
    "source": "https://www.acefitness.org/resources/everyone/exercise-library/",
    "start": "手臂下垂",
    "end": "屈肘上举"
  },
  {
    "id": "dumbbell-bench",
    "name": "哑铃卧推",
    "groups": [
      "chest"
    ],
    "equipment": "哑铃 + 平凳",
    "reps": "8–12",
    "diagram": "bench-press",
    "muscles": "胸大肌、肱三头肌",
    "setup": "仰卧平凳，双脚踩稳，哑铃在胸部两侧。",
    "cues": [
      "手腕在肘部上方，前臂接近竖直。",
      "把哑铃向上推到胸部上方，保留肘部控制。",
      "缓慢下放到肩部舒适的深度。"
    ],
    "mistake": "不要弹震、过度张肘或为加重而大幅拱腰。",
    "source": "https://www.acefitness.org/resources/pros/expert-articles/8972/be-a-chest-day-champion-an-evidence-based-approach-to-training-the-chest/",
    "start": "胸旁准备",
    "end": "推向上方"
  },
  {
    "id": "incline-machine",
    "name": "上斜器械推胸",
    "groups": [
      "chest"
    ],
    "equipment": "上斜推胸器械",
    "reps": "10–12",
    "diagram": "incline-machine",
    "muscles": "胸大肌上部、肱三头肌",
    "setup": "调整座椅和靠背，让把手与上胸位置相适应。",
    "cues": [
      "背部贴靠垫，双脚踩稳。",
      "顺着器械轨迹向前上方推，不猛锁肘。",
      "慢慢还原到肩部舒适位置。"
    ],
    "mistake": "不要抬肩或把腰拱起来顶重量。",
    "source": "https://www.nasm.org/resource-center/exercise-library/chest-press-machine",
    "start": "上胸旁准备",
    "end": "向前上方推"
  },
  {
    "id": "cable-fly",
    "name": "绳索夹胸",
    "groups": [
      "chest"
    ],
    "equipment": "双侧绳索器械",
    "reps": "12–15",
    "diagram": "fly",
    "muscles": "胸大肌",
    "setup": "把滑轮调到胸部附近高度，前后站姿站稳，双肘微屈。",
    "cues": [
      "身体略前倾并保持稳定。",
      "以肩部为轴，把双手向胸前弧线合拢。",
      "控制张开到肩部舒适范围，肘部角度基本不变。"
    ],
    "mistake": "不要变成伸肘推胸或把手臂过度拉到身后。",
    "source": "https://www.acefitness.org/resources/everyone/exercise-library/",
    "start": "双臂展开",
    "end": "胸前合拢"
  },
  {
    "id": "triceps-pushdown",
    "name": "绳索三头下压",
    "groups": [
      "triceps"
    ],
    "equipment": "高位绳索 + 绳把",
    "reps": "12",
    "diagram": "pushdown",
    "muscles": "肱三头肌",
    "setup": "面向高位滑轮，双手握绳，上臂放在躯干两侧。",
    "cues": [
      "先稳住肩膀与上臂。",
      "伸肘把绳向下压，手腕保持自然。",
      "缓慢屈肘还原，保持上臂位置。"
    ],
    "mistake": "不要用整个身体压绳或让肘部向前后摆。",
    "source": "https://www.acefitness.org/resources/everyone/exercise-library/",
    "start": "屈肘准备",
    "end": "伸肘下压"
  },
  {
    "id": "cable-overhead",
    "name": "绳索过顶臂屈伸",
    "groups": [
      "triceps"
    ],
    "equipment": "绳索器械 + 绳把",
    "reps": "12",
    "diagram": "overhead",
    "muscles": "肱三头肌",
    "setup": "背向低位滑轮，握绳抬过头，前后站稳，肘部朝上。",
    "cues": [
      "收住肋骨，不用挺腰换幅度。",
      "保持上臂相对稳定，伸肘把绳向上前方推。",
      "缓慢屈肘，让手回到头后舒适位置。"
    ],
    "mistake": "不要大幅张肘或让腰背过伸。",
    "source": "https://www.acefitness.org/resources/everyone/exercise-library/",
    "start": "头后屈肘",
    "end": "向上伸肘"
  },
  {
    "id": "squat",
    "name": "自由深蹲或史密斯深蹲",
    "groups": [
      "legs",
      "glutes"
    ],
    "equipment": "杠铃 / 史密斯架",
    "reps": "8–10",
    "diagram": "squat",
    "muscles": "股四头肌、臀大肌",
    "setup": "设置保护杆，脚掌踩稳，杠铃放在上背肌肉处。史密斯站位按器械轨迹调整。",
    "cues": [
      "先稳住躯干，再同时屈髋屈膝下蹲。",
      "膝盖跟随脚尖方向，脚跟保持接地。",
      "蹲到能保持控制的深度，再用整个脚掌推地站起。"
    ],
    "mistake": "不要膝盖内扣、脚跟抬起或失去腰背控制。",
    "source": "https://www.acefitness.org/resources/everyone/exercise-library/",
    "start": "站稳准备",
    "end": "屈髋屈膝"
  },
  {
    "id": "hip-thrust",
    "name": "臀推",
    "groups": [
      "glutes"
    ],
    "equipment": "平凳 + 杠铃 + 护垫",
    "reps": "10–12",
    "diagram": "hip-thrust",
    "muscles": "臀大肌、腘绳肌",
    "setup": "上背靠稳固凳边，髋部垫好护垫，双脚踩地。",
    "cues": [
      "下巴微收，肋骨保持收住。",
      "用脚掌推地，臀部发力把髋部抬起。",
      "到肩、髋、膝接近一线后停住，再有控制地下放。"
    ],
    "mistake": "不要在顶端靠挺腰把杠铃顶得更高。",
    "source": "https://www.acefitness.org/resources/everyone/exercise-library/",
    "start": "髋部下沉",
    "end": "伸髋抬起"
  },
  {
    "id": "rdl",
    "name": "罗马尼亚硬拉",
    "groups": [
      "legs",
      "glutes"
    ],
    "equipment": "杠铃",
    "reps": "10",
    "diagram": "hinge",
    "muscles": "腘绳肌、臀大肌",
    "setup": "站直持杠于大腿前，双脚约与髋同宽，膝盖微屈。",
    "cues": [
      "保持背部自然，把臀部向后推。",
      "杠铃贴近腿下移，下降到后侧有拉伸且背部仍能稳定处。",
      "用臀腿带动髋部前移，回到站立。"
    ],
    "mistake": "不要弓背、把杠甩远，或把动作做成深蹲。",
    "source": "https://www.nasm.org/resource-center/exercise-library/romanian-deadlift-barbell",
    "start": "站姿持杠",
    "end": "髋部向后"
  },
  {
    "id": "hip-abduction",
    "name": "坐姿髋外展",
    "groups": [
      "glutes"
    ],
    "equipment": "髋外展器械",
    "reps": "15",
    "diagram": "abduction",
    "muscles": "臀中肌、臀小肌",
    "setup": "调好靠背与外侧腿垫，双脚放在脚踏上。",
    "cues": [
      "坐稳，骨盆不随动作摇摆。",
      "用臀部两侧发力把膝盖向外打开。",
      "停顿后慢慢合拢，别让配重撞击。"
    ],
    "mistake": "不要用快速弹震或反复晃动躯干来打开重量。",
    "source": "https://www.acefitness.org/resources/everyone/exercise-library/",
    "start": "双腿并拢",
    "end": "向外打开"
  },
  {
    "id": "leg-curl",
    "name": "坐姿腿弯举",
    "groups": [
      "legs"
    ],
    "equipment": "坐姿腿弯举器械",
    "reps": "12",
    "diagram": "leg-curl",
    "muscles": "腘绳肌",
    "setup": "膝关节对准器械转轴，压腿垫固定大腿，滚垫在小腿下端。",
    "cues": [
      "背和髋部保持贴稳座椅。",
      "屈膝把滚垫向下后方勾。",
      "缓慢伸膝还原到舒适位置。"
    ],
    "mistake": "不要抬臀、弹起重量或快速甩腿。",
    "source": "https://www.nasm.org/resource-center/exercise-library/seated-leg-curl",
    "start": "伸膝准备",
    "end": "屈膝下勾"
  },
  {
    "id": "shoulder-press",
    "name": "哑铃肩推",
    "groups": [
      "shoulders"
    ],
    "equipment": "哑铃 + 靠背凳",
    "reps": "8–10",
    "diagram": "shoulder-press",
    "muscles": "三角肌、肱三头肌",
    "setup": "坐稳靠背凳，双脚踩地，哑铃在肩膀两侧。",
    "cues": [
      "收住肋骨，让手腕在肘部上方。",
      "向上推举，手臂在舒服的肩部平面移动。",
      "有控制地下降回肩部附近。"
    ],
    "mistake": "不要挺腰顶重量，也不要把肘部甩到过后方。",
    "source": "https://www.acefitness.org/resources/everyone/exercise-library/",
    "start": "肩旁准备",
    "end": "向上推举"
  },
  {
    "id": "lateral-raise",
    "name": "哑铃侧平举",
    "groups": [
      "shoulders"
    ],
    "equipment": "哑铃",
    "reps": "12–15",
    "diagram": "lateral",
    "muscles": "三角肌中束",
    "setup": "双脚站稳，哑铃在身侧，肘部保持轻微弯曲。",
    "cues": [
      "肩膀放松，手臂略在身体前方。",
      "把肘部向两侧抬到接近肩高的舒适位置。",
      "慢慢放回身侧，保持躯干安静。"
    ],
    "mistake": "不要耸肩、甩腰或把小指刻意翻得很高。",
    "source": "https://www.acefitness.org/resources/everyone/exercise-library/",
    "start": "身侧准备",
    "end": "两侧抬起"
  },
  {
    "id": "reverse-fly",
    "name": "反向蝴蝶机飞鸟",
    "groups": [
      "shoulders",
      "back"
    ],
    "equipment": "反向蝴蝶机",
    "reps": "12–15",
    "diagram": "reverse-fly",
    "muscles": "三角肌后束、菱形肌",
    "setup": "面对靠垫坐稳，把手调到肩部附近高度。",
    "cues": [
      "胸口贴靠垫，双肘微屈。",
      "手臂沿弧线向两侧后方打开。",
      "控制回到前方，不让配重撞击。"
    ],
    "mistake": "不要耸肩、挺腰或把手臂拉到过度后伸。",
    "source": "https://www.acefitness.org/resources/everyone/exercise-library/",
    "start": "胸贴靠垫",
    "end": "向两侧打开"
  },
  {
    "id": "prone-y",
    "name": "俯卧 Y 举",
    "groups": [
      "shoulders",
      "back"
    ],
    "equipment": "上斜凳 / 瑜伽垫",
    "reps": "12",
    "diagram": "prone-y",
    "muscles": "斜方肌下束、肩胛周围肌群",
    "setup": "俯卧凳上，手臂朝头前两侧呈 Y 形，大拇指朝上。",
    "cues": [
      "用很轻的负重或徒手开始。",
      "保持颈部自然，把手臂小幅抬离支撑面。",
      "缓慢放回，不追求抬得越高越好。"
    ],
    "mistake": "不要耸肩、抬头或用腰背反弓带动手臂。",
    "source": "https://www.acefitness.org/resources/everyone/exercise-library/",
    "start": "手臂呈 Y",
    "end": "小幅上抬"
  },
  {
    "id": "dead-bug",
    "name": "死虫式",
    "groups": [
      "core"
    ],
    "equipment": "瑜伽垫",
    "reps": "每侧 10",
    "diagram": "dead-bug",
    "muscles": "腹横肌、腹直肌",
    "setup": "仰卧，髋膝弯到约 90 度，双臂指向天花板。",
    "cues": [
      "收住肋骨，让下背部与垫面保持稳定接触。",
      "缓慢伸远对侧手和脚，到腰部仍可控制处。",
      "回到起点后换另一侧，保持正常呼吸。"
    ],
    "mistake": "不要为了伸得更低而拱腰或憋气。",
    "source": "https://www.nasm.org/resource-center/exercise-library/dead-bug",
    "start": "手脚抬起",
    "end": "对侧伸远"
  },
  {
    "id": "pallof",
    "name": "Pallof Press 抗旋转",
    "groups": [
      "core"
    ],
    "equipment": "绳索器械 / 弹力带",
    "reps": "每侧 10",
    "diagram": "pallof",
    "muscles": "腹斜肌、深层核心稳定肌",
    "setup": "阻力从身体侧面胸高位置拉来，双手在胸前握把。",
    "cues": [
      "双脚踩稳，胸口与骨盆始终朝正前方。",
      "双手缓慢向前推出，抵抗侧面把你拉转的力量。",
      "控制收回胸前，两侧都练。"
    ],
    "mistake": "不要跟着绳索转身、侧倾或让腰部过度前凸。",
    "source": "https://blog.nasm.org/progressive-core-training",
    "start": "胸前握把",
    "end": "向前推直"
  },
  {
    "id": "lat-pulldown",
    "name": "高位下拉",
    "groups": [
      "back"
    ],
    "equipment": "高位下拉器械",
    "reps": "12",
    "diagram": "pulldown",
    "muscles": "背阔肌、大圆肌、肱二头肌",
    "setup": "坐稳，调好压腿垫，用舒服的正握距离握住横杆。",
    "cues": [
      "保持躯干稳定，头颈与背部自然对齐。",
      "肘部向下走，把横杆拉向上胸方向。",
      "缓慢放回上方，肩胛随手臂自然活动。"
    ],
    "mistake": "不要拉到颈后或靠大幅后仰甩下重量。",
    "source": "https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/",
    "start": "伸臂握杆",
    "end": "拉向上胸"
  },
  {
    "id": "chest-press",
    "name": "器械推胸",
    "groups": [
      "chest"
    ],
    "equipment": "推胸器械",
    "reps": "12",
    "diagram": "machine-press",
    "muscles": "胸大肌、肱三头肌",
    "setup": "座椅调到把手大致与胸中部对齐，双脚踩地，背靠垫。",
    "cues": [
      "握紧把手，手腕与前臂保持对齐。",
      "沿器械轨迹向前推，躯干保持稳定。",
      "缓慢还原到肩部舒适范围。"
    ],
    "mistake": "不要耸肩、猛锁肘或让背部离开靠垫。",
    "source": "https://www.nasm.org/resource-center/exercise-library/chest-press-machine",
    "start": "胸旁握把",
    "end": "向前推出"
  },
  {
    "id": "leg-press",
    "name": "腿举",
    "groups": [
      "legs",
      "glutes"
    ],
    "equipment": "腿举器械",
    "reps": "12",
    "diagram": "leg-press",
    "muscles": "股四头肌、臀大肌",
    "setup": "背和头贴靠垫，双脚踩平台，先熟悉保险装置。",
    "cues": [
      "整个脚掌稳定受力，膝盖跟随脚尖方向。",
      "把平台推开，膝盖伸展但不猛锁死。",
      "控制下放到骨盆与腰背仍能贴稳的位置。"
    ],
    "mistake": "不要膝盖内扣、臀部卷离靠垫或急速下放。",
    "source": "https://www.nasm.org/resource-center/exercise-library/leg-press",
    "start": "屈膝准备",
    "end": "推开平台"
  },
  {
    "id": "glute-kickback",
    "name": "绳索臀后踢",
    "groups": [
      "glutes"
    ],
    "equipment": "低位绳索 + 脚踝绑带",
    "reps": "每侧 12",
    "diagram": "kickback",
    "muscles": "臀大肌",
    "setup": "脚踝绑好绑带，双手轻扶器械，支撑腿微屈。",
    "cues": [
      "固定骨盆，收住肋骨，躯干稳定。",
      "用臀部把训练腿向后带，小幅伸髋。",
      "控制回到起点，完成后换另一侧。"
    ],
    "mistake": "不要拱腰或转动骨盆来把腿抬得更高。",
    "source": "https://www.acefitness.org/resources/everyone/exercise-library/",
    "start": "扶稳器械",
    "end": "伸髋后踢"
  },
  {
    "id": "farmer-walk",
    "name": "农夫行走",
    "groups": [
      "core",
      "full"
    ],
    "equipment": "哑铃 / 壶铃",
    "reps": "30 秒",
    "diagram": "farmer",
    "muscles": "握力、核心、上背稳定肌",
    "setup": "两手各持一只重量相近的哑铃，选择无障碍路线。",
    "cues": [
      "站直，头颈自然，双肩保持稳定。",
      "用小而稳的步幅前进，保持身体不左右摇晃。",
      "到时间后站稳，再屈髋屈膝把重量放下。"
    ],
    "mistake": "不要耸肩、身体侧倾或用跨大步追求速度。",
    "source": "https://www.acefitness.org/resources/everyone/exercise-library/",
    "start": "站稳持重",
    "end": "小步前行"
  },
  {
    "id": "plank",
    "name": "平板支撑",
    "groups": [
      "core"
    ],
    "equipment": "瑜伽垫",
    "reps": "30–45 秒",
    "diagram": "plank",
    "muscles": "腹直肌、腹横肌、肩部稳定肌",
    "setup": "前臂撑地，肘部在肩膀下方，脚尖着地。",
    "cues": [
      "抬起身体，让头、躯干和脚跟保持自然直线。",
      "收紧腹部与臀部，继续正常呼吸。",
      "保持到还能控制姿势为止，再缓慢放下。"
    ],
    "mistake": "不要塌腰、抬臀或为了撑更久而憋气。",
    "source": "https://www.nasm.org/resource-center/exercise-library/plank",
    "start": "前臂准备",
    "end": "抬起保持"
  },
  {
    "id": "single-row",
    "name": "单臂哑铃划船",
    "groups": [
      "back"
    ],
    "equipment": "哑铃 + 平凳",
    "reps": "每侧 10–12",
    "diagram": "single-row",
    "muscles": "背阔肌、菱形肌",
    "setup": "一手和同侧膝支撑凳面，另一手持哑铃垂在肩下。",
    "cues": [
      "躯干平稳，骨盆保持朝向地面。",
      "肘部向后上方带，把哑铃拉向髋旁。",
      "慢慢下放，再换另一侧。"
    ],
    "mistake": "不要扭腰把哑铃甩起或耸肩抢拉。",
    "source": "https://www.acefitness.org/resources/everyone/exercise-library/",
    "start": "单侧支撑",
    "end": "肘向髋旁"
  },
  {
    "id": "push-up",
    "name": "俯卧撑",
    "groups": [
      "chest",
      "triceps"
    ],
    "equipment": "自重 / 瑜伽垫",
    "reps": "8–12",
    "diagram": "push-up",
    "muscles": "胸大肌、肱三头肌、核心",
    "setup": "双手略宽于肩，身体成直线；可从高位支撑版本开始。",
    "cues": [
      "腹部和臀部收紧，保持躯干整体移动。",
      "屈肘下放，肘部与身体约成 45 度。",
      "用手掌推地，回到起点。"
    ],
    "mistake": "不要塌腰、抬臀或把肘部完全向外张开。",
    "source": "https://www.nasm.org/resource-center/exercise-library/push-up",
    "start": "直臂支撑",
    "end": "整体下放"
  },
  {
    "id": "incline-dumbbell",
    "name": "上斜哑铃卧推",
    "groups": [
      "chest"
    ],
    "equipment": "哑铃 + 上斜凳",
    "reps": "10–12",
    "diagram": "incline-bench",
    "muscles": "胸大肌上部、肱三头肌",
    "setup": "将凳面调为约 30–45 度，背靠稳，双脚落地。",
    "cues": [
      "哑铃在上胸两侧，手腕叠在肘部上方。",
      "向上推到上胸上方，躯干稳定。",
      "慢慢下放，保持肩部舒适。"
    ],
    "mistake": "不要把凳面设得过陡或用腰背大幅拱起。",
    "source": "https://www.nasm.org/resource-center/exercise-library/two-arm-incline-dumbbell-chest-press",
    "start": "上胸旁准备",
    "end": "向上推举"
  },
  {
    "id": "hammer-curl",
    "name": "锤式弯举",
    "groups": [
      "biceps"
    ],
    "equipment": "哑铃",
    "reps": "10–12",
    "diagram": "hammer",
    "muscles": "肱肌、肱桡肌、肱二头肌",
    "setup": "站稳，掌心始终相对，哑铃置于身侧。",
    "cues": [
      "上臂放在身侧，手腕自然。",
      "保持中立握法屈肘举起哑铃。",
      "缓慢下放，不摆动身体。"
    ],
    "mistake": "不要甩腰或把手腕掰向小拇指侧。",
    "source": "https://www.acefitness.org/resources/everyone/exercise-library/",
    "start": "掌心相对",
    "end": "屈肘上举"
  },
  {
    "id": "cable-curl",
    "name": "绳索弯举",
    "groups": [
      "biceps"
    ],
    "equipment": "低位绳索 + 直杆",
    "reps": "12–15",
    "diagram": "cable-curl",
    "muscles": "肱二头肌",
    "setup": "面向低位滑轮站稳，掌心向上握直杆，上臂贴近身侧。",
    "cues": [
      "保持躯干稳定，绳索持续有张力。",
      "屈肘把杆拉向肩部方向。",
      "慢慢伸肘回到舒适位置。"
    ],
    "mistake": "不要后仰或让肩膀带着整条手臂向前抬。",
    "source": "https://www.acefitness.org/resources/everyone/exercise-library/",
    "start": "低位握杆",
    "end": "屈肘拉起"
  },
  {
    "id": "dumbbell-overhead",
    "name": "哑铃过顶臂屈伸",
    "groups": [
      "triceps"
    ],
    "equipment": "单只哑铃 + 靠背凳",
    "reps": "10–12",
    "diagram": "dumbbell-overhead",
    "muscles": "肱三头肌",
    "setup": "坐稳，双手托住哑铃一端，举在头顶，肘部朝上。",
    "cues": [
      "收住肋骨，上臂在舒适位置。",
      "缓慢屈肘让哑铃下降到头后。",
      "固定上臂，再伸肘回到上方。"
    ],
    "mistake": "不要弓腰、把肘张得过宽或下放得失去控制。",
    "source": "https://www.acefitness.org/resources/everyone/exercise-library/",
    "start": "头后屈肘",
    "end": "向上伸肘"
  },
  {
    "id": "goblet-squat",
    "name": "高脚杯深蹲",
    "groups": [
      "legs",
      "glutes"
    ],
    "equipment": "哑铃 / 壶铃",
    "reps": "10–12",
    "diagram": "goblet",
    "muscles": "股四头肌、臀大肌",
    "setup": "双手把哑铃竖抱胸前，双脚约与肩同宽。",
    "cues": [
      "抱稳重量，保持整个脚掌贴地。",
      "屈髋屈膝下蹲，膝盖跟随脚尖方向。",
      "蹲到能稳定控制的位置后推地站起。"
    ],
    "mistake": "不要膝内扣、弓背或把重量送离胸口。",
    "source": "https://www.nasm.org/resource-center/exercise-library/goblet-squat",
    "start": "胸前抱铃",
    "end": "坐向下方"
  },
  {
    "id": "split-squat",
    "name": "保加利亚分腿蹲",
    "groups": [
      "legs",
      "glutes"
    ],
    "equipment": "平凳，可选哑铃",
    "reps": "每侧 8–10",
    "diagram": "split-squat",
    "muscles": "股四头肌、臀大肌",
    "setup": "背对稳固平凳，一脚脚背轻放凳面，前脚站稳。",
    "cues": [
      "先徒手找到平衡，保持骨盆朝前。",
      "前腿屈髋屈膝下蹲，膝盖与脚尖方向一致。",
      "用前腿推地站起，做完换侧。"
    ],
    "mistake": "不要依赖后脚猛蹬、膝内扣或勉强追求深度。",
    "source": "https://www.nasm.org/resource-center/exercise-library/bulgarian-split-squat",
    "start": "前后站稳",
    "end": "前腿下蹲"
  },
  {
    "id": "glute-bridge",
    "name": "徒手臀桥",
    "groups": [
      "glutes"
    ],
    "equipment": "瑜伽垫",
    "reps": "12–15",
    "diagram": "bridge",
    "muscles": "臀大肌、腘绳肌",
    "setup": "仰卧屈膝，双脚与髋同宽平放地面，手臂在身侧。",
    "cues": [
      "先轻收腹，肋骨不向上翻。",
      "臀部发力抬髋，到肩髋膝接近一线。",
      "停顿后慢慢把髋放回。"
    ],
    "mistake": "不要用腰部反弓来代替伸髋。",
    "source": "https://www.nasm.org/resource-center/exercise-library/floor-bridge",
    "start": "仰卧屈膝",
    "end": "抬髋成线"
  },
  {
    "id": "bird-dog",
    "name": "鸟狗式",
    "groups": [
      "core"
    ],
    "equipment": "瑜伽垫",
    "reps": "每侧 10",
    "diagram": "bird-dog",
    "muscles": "腹横肌、腹斜肌、竖脊肌",
    "setup": "四点跪姿，手在肩下，膝在髋下。",
    "cues": [
      "背部与骨盆保持稳定，目光朝垫面。",
      "把对侧手和腿缓慢伸远，不用抬得很高。",
      "控制收回，再换另一侧。"
    ],
    "mistake": "不要抬头、塌腰或把身体向一侧旋转。",
    "source": "https://www.nasm.org/resource-center/exercise-library/bird-dog",
    "start": "四点支撑",
    "end": "对侧伸远"
  },
  {
    "id": "side-plank",
    "name": "侧平板支撑",
    "groups": [
      "core"
    ],
    "equipment": "瑜伽垫",
    "reps": "每侧 20–30 秒",
    "diagram": "side-plank",
    "muscles": "腹斜肌、侧向核心稳定肌",
    "setup": "侧卧，前臂撑地，肘在肩下；双脚叠放或前后错开。",
    "cues": [
      "抬髋，使肩、髋、脚形成自然直线。",
      "胸口朝侧面，骨盆不向前后转。",
      "保持正常呼吸，控制放下后换侧。"
    ],
    "mistake": "不要塌髋、耸肩或勉强延长保持时间。",
    "source": "https://www.nasm.org/resource-center/exercise-library/side-plank",
    "start": "侧卧支撑",
    "end": "抬髋保持"
  }
];
