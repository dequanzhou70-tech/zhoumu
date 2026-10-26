const option = (label, detail, signal, reaction, evidence) => ({ label, detail, signal, reaction, evidence });
const unknown = (label = '这一幕，还没发生过') => option(label, '没有线索也没关系，跳过不会被算作冷淡。', null, '空白不是坏结局，只是镜头还没拍到这里。');

export const scenes = [
  {
    id: 'midnight', chapter: '01', chapterTitle: '消息，刚好是你', time: '23:17', location: '一块亮起的手机屏幕',
    dimension: 'initiative', title: '“睡了吗？”删掉了。',
    narrative: '你把输入框里的三个字删掉，手机却恰好亮了。先别替故事安排巧合：回想最近两周，真实的聊天通常是谁先开始的？',
    message: { from: '你的输入框', text: '在干嘛…… 算了，还是先撤回。' },
    prompt: '没有事情要交代的时候，TA 会主动找你吗？',
    options: [
      option('聊天发动机，一直是我', '几乎每次都是我先开口。', 0, '你一个人踩着双人自行车，有点累也很正常。', '聊天通常由你发起，TA 较少主动开启话题'),
      option('有正事，才会出现', '找我主要是问工作、作业或具体事情。', 1, '门铃响了，但还需要看看门外带来的是什么。', 'TA 的主动联系主要围绕具体事务'),
      option('偶尔发来一件小事', '会分享视频、照片或一句没头没尾的吐槽。', 2, '原来今天的某个瞬间，TA 想到了你。', 'TA 偶尔会主动分享日常小事'),
      option('没什么事，也想来找我', '不止一次主动找话题，想知道我在做什么。', 3, '无事发生，也能成为一条发给你的消息。', 'TA 多次在没有具体事务时主动找你聊天'),
      unknown(),
    ],
  },
  {
    id: 'aftergoodnight', chapter: '01', chapterTitle: '消息，刚好是你', time: '23:46', location: '说了晚安之后',
    dimension: 'initiative', title: '晚安之后，多了一句。',
    narrative: '话题停在一个句号上。你盯着屏幕想：要不要再说点什么？把镜头切回真实生活，看看 TA 通常会不会接住这个句号。',
    message: { from: '聊天记录', text: '哈哈哈哈。\n然后呢？', },
    prompt: '一个话题结束后，TA 通常会怎么做？',
    options: [
      option('到这里，就是真的结束了', '我不继续问，通常就没有后续。', 0, '片尾字幕开始滚动，先让自己休息一下。', '话题结束后，TA 通常不会继续展开'),
      option('会回，但多半是表情包', '礼貌接话，较少主动补充内容。', 1, '表情包很可爱，剧情暂时还需要新台词。', 'TA 会回应，但较少主动延展对话'),
      option('会顺着我的话多聊一点', '会追问细节，或者讲自己的经历。', 2, '句号被悄悄改成了逗号。', 'TA 会追问或分享经历来延长聊天'),
      option('“对了，突然想到……”', '聊完了还会开启另一个话题，改天也会接着聊。', 3, '这集播完了，TA 自己点了下一集。', 'TA 会主动另起话题，或在之后接续之前的聊天'),
      unknown('还没聊到能判断的程度'),
    ],
  },
  {
    id: 'coffee', chapter: '02', chapterTitle: '人群里的一点偏心', time: '12:06', location: '楼下那家小店',
    dimension: 'attention', title: '“你不是不喝冰的吗？”',
    narrative: '小店的冰柜嗡嗡响，你随口说过的喜好好像又出现了。回忆一下：有些细节，TA 真的记得吗？',
    message: { from: '故事旁白', text: '有些台词只说过一遍，却被人留在了心里。' },
    prompt: '关于你随口提过的小事，TA 的表现更像哪一种？',
    options: [
      option('说过几次，也常常忘记', '包括一些对我比较重要的事。', 0, '这条线索没被接住，不代表你说的话不重要。', 'TA 经常忘记你提过的重要信息'),
      option('重要的记得，小事不太记得', '和熟悉的普通朋友差不多。', 1, '熟悉感已到场，特别感还在路上。', 'TA 记得重要信息，但对日常细节的关注较少'),
      option('偶尔会突然提起', '能记得我的口味、最近的计划或烦恼。', 2, '原来那些随口一说，有人认真存了档。', 'TA 会记住并提起你的喜好、计划或烦恼'),
      option('记得，还会有下一步', '会回问进展，或者按照我的喜好做小安排。', 3, '记忆不是停在收藏夹里，它悄悄变成了行动。', 'TA 会根据你的喜好行动，或主动追问事情的后续'),
      unknown(),
    ],
  },
  {
    id: 'crowd', chapter: '02', chapterTitle: '人群里的一点偏心', time: '19:32', location: '一场有点吵的聚会',
    dimension: 'attention', title: '笑声里，TA 看向谁？',
    narrative: '一桌人笑起来的时候，每个人都可能刚好看向另一个人。比一次眼神更有意思的，是 TA 在好几次相处里，有没有主动靠近你。',
    prompt: '和其他人在一起时，TA 对你会有额外的关注吗？',
    options: [
      option('基本不会特意找我', '很少主动和我说话，也不太接我的话。', 0, '镜头暂时没转过来，你也不必一直站在原地。', '在多人场合，TA 很少主动靠近或和你交谈'),
      option('TA 对大家都这么热情', '照顾我，但也同样照顾身边其他人。', 1, '这是暖场能力，偏心还需要别的证据。', 'TA 会关照你，但对其他人也有相似表现'),
      option('会主动找我聊几句', '会坐近一点，或者接住我没说完的话。', 2, '喧闹的背景里，出现了一条通向你的支线。', 'TA 在多人场合会主动与你交谈或靠近'),
      option('人群散了，也会继续找我', '不止一次单独来找我，之后还想一起走一段。', 3, '散场不是结束，TA 想把你的戏份再延长一点。', 'TA 多次在聚会之外继续创造与你单独相处的机会'),
      unknown('我们还没在多人场合相处过'),
    ],
  },
  {
    id: 'busyday', chapter: '02', chapterTitle: '人群里的一点偏心', time: '18:41', location: '一个普通的坏心情里',
    dimension: 'attention', title: '“今天还好吗？”',
    narrative: '你发出一条不太开心的消息，又立刻觉得自己是不是说得太多。比漂亮安慰更值得看见的，是 TA 有没有听见你的需要。',
    message: { from: '你', text: '今天有点累，不是什么大事，就是想说一下。' },
    prompt: '你表达烦恼或情绪时，TA 通常怎么回应？',
    options: [
      option('经常略过，或者直接转话题', '这种情况发生过不止一次。', 0, '你值得被听见，不需要把情绪调成静音。', '你表达烦恼时，TA 多次忽略或转移话题'),
      option('会说“加油”“早点休息”', '有礼貌的关心，通常聊得不深。', 1, '收到了一张小创可贴，还没看到更多照顾。', 'TA 会简短安慰，但通常不进一步了解'),
      option('会认真听，也会多问几句', '想知道发生了什么，尊重我想不想说。', 2, '这一刻，聊天框装得下真实的你。', 'TA 会认真听你的烦恼，并尊重你的表达意愿'),
      option('之后还会记得来问问', '当时认真听，过一段时间也会关心后续。', 3, '关心没有在消息发出的那一秒过期。', 'TA 会认真倾听，并在之后主动关心你的状态'),
      unknown('我还没向 TA 表达过烦恼'),
    ],
  },
  {
    id: 'invitation', chapter: '03', chapterTitle: '把下次，变成日期', time: '周五 · 17:20', location: '那个悬而未决的周末',
    dimension: 'investment', title: '“改天”是哪一天？',
    narrative: '你在输入框里放下一张小小的入场券：“周末，要不要一起去？”忙碌并不等于拒绝，看看 TA 会不会也替下一次腾出位置。',
    message: { from: '你', text: '周末那家店开门了，要不要一起去看看？' },
    prompt: '面对一个具体邀约，TA 最近的回应更接近哪种？',
    options: [
      option('多次拒绝，也没有其他安排', '或者始终不愿确定是否参加。', 0, '这张票可以先收好，别让等待占满你的周末。', 'TA 多次不接受具体邀约，也没有提出替代安排'),
      option('“有空再约”“下次吧”', '态度友好，但后续没有落到日期。', 1, '“改天”是一朵云，还需要一阵风把它吹到日历上。', 'TA 对邀约回应友好，但没有进一步确定时间'),
      option('会认真确认，也能约成', '有空就答应，没空会说明情况。', 2, '剧情从聊天框，迈进了真实的日历。', 'TA 会认真回应具体邀约，并有实际见面的安排'),
      option('没空也会主动换个时间', '或者主动提出下一次见面的具体计划。', 3, '不是刚好有空，是也在为下一次找空。', 'TA 会提出替代时间，或主动安排具体见面计划'),
      unknown('我还没发出过具体邀约'),
    ],
  },
  {
    id: 'smallpromise', chapter: '03', chapterTitle: '把下次，变成日期', time: '周六 · 15:08', location: '一句“我来吧”之后',
    dimension: 'investment', title: '承诺有没有走出聊天框？',
    narrative: '“我发给你”“下次带你去”“到时候我来。”这些话像一串便利贴。你们真实的相处里，有多少张后来变成了已经完成？',
    prompt: 'TA 答应过你的事，通常会怎么落地？',
    options: [
      option('常常没下文，也不解释', '得我多次追问，有时仍然没有结果。', 0, '承诺不是气球，不该总由你抓着线。', 'TA 多次没有兑现答应的事，也较少说明原因'),
      option('提醒一下，通常会做', '有时会忘，主动落实的情况较少。', 1, '便利贴还在，只是闹钟目前由你负责。', 'TA 通常需要提醒才会落实答应的事情'),
      option('大多会做到，变动也会说', '行动和说过的话基本能对上。', 2, '台词接上了动作，这一幕很加分。', 'TA 大多能兑现承诺，并会沟通计划变化'),
      option('会主动落实，也愿意协调', '不用我催，会确认细节，也会在有变动时补安排。', 3, 'TA 没只说“下一次”，还替下一次留好了位置。', 'TA 会主动落实承诺、确认细节并协调变动'),
      unknown('还没有可以观察的小承诺'),
    ],
  },
  {
    id: 'distance', chapter: '04', chapterTitle: '故事，需要两个人', time: '后来 · 20:15', location: '几天没打开的对话框',
    dimension: 'initiative', title: '如果你不按播放键呢？',
    narrative: '不是故意消失，也不用设计试探。只是生活总有忙的时候：回想那些你自然没主动联系的日子，你们的关系会怎么往下走？',
    prompt: '你因为自己的生活忙起来时，TA 会主动保持联系吗？',
    options: [
      option('通常就这样断了联系', '我不再开口，就很少再有互动。', 0, '一部双人电影，不必只由你负责开机。', '当你自然减少联系时，互动通常会中断'),
      option('有事情要问，才会再出现', '日常的主动问候比较少。', 1, 'TA 还记得这个窗口，出现的理由暂时偏实际。', '你没有主动联系时，TA 多因具体事务再次出现'),
      option('偶尔会主动来问一句', '会分享近况，或问我最近怎么样。', 2, '有些续集，原来不需要你一个人写。', '你忙碌时，TA 偶尔会主动分享近况或关心你'),
      option('也会主动维持你们的联系', '会自然来找我，尊重我忙碌，也会等方便时再聊。', 3, 'TA 在故事里，也握着一支笔。', 'TA 会主动维持联系，同时尊重你忙碌时的空间'),
      unknown('暂时没有这样的观察'),
    ],
  },
  {
    id: 'boundary', chapter: '04', chapterTitle: '故事，需要两个人', time: '某天 · 21:03', location: '你说“今天不方便”的时候',
    dimension: 'consistency', title: '心动，也该让人松口气。',
    narrative: '好看的故事需要火花，也需要留白。当你需要休息、不想聊某件事，或者不同意一个安排时，TA 怎么对待你的声音？',
    prompt: '当你表达边界或不同意见时，TA 的表现是？',
    options: [
      option('会施压、嘲讽，或让我内疚', '我得反复解释，甚至有点不敢说“不”。', 0, '这比心动指数更重要：你的“不”不需要被批准。', '你表达边界时，TA 会施压、嘲讽或让你内疚'),
      option('嘴上答应，之后仍反复越界', '需要多次提醒，才偶尔能被尊重。', 1, '尊重需要出现在行为里，不能只停在一句“好”。', 'TA 对你的边界表示同意，但行为仍有反复'),
      option('通常理解，也愿意调整', '偶尔有误会，可以好好说清楚。', 2, '喜欢之外，舒服也值得拥有一个特写。', 'TA 通常尊重你的边界，并愿意沟通调整'),
      option('会认真尊重，也照顾我的感受', '不强求、不惩罚我的拒绝，能一起找舒服的方式。', 3, '这一幕不用猜，你可以安心做自己。', 'TA 能持续尊重你的拒绝，并一起寻找舒服的相处方式'),
      unknown('还没有表达过这类边界'),
    ],
  },
  {
    id: 'overtime', chapter: '04', chapterTitle: '故事，需要两个人', time: '片尾前 · 最后一问', location: '把几次互动连起来看',
    dimension: 'consistency', title: 'TA 的温柔，有连续剧吗？',
    narrative: '一次深夜长谈，可以让人回味好几天。现在把镜头拉远：最近一段时间，TA 的主动、关心和行动，有没有在不同日子里持续出现？',
    message: { from: '导演的小提示', text: '不用选最心动的那一晚，选你们最常见的日常。' },
    prompt: '放在一段时间里看，你们的互动更像哪一种？',
    options: [
      option('多数时候都很疏远', '偶尔的热情之后，依然主要由我维持。', 0, '某一幕很美，也不必拿它替整部电影作证。', '持续观察下来，互动多数时候疏远并由你维持'),
      option('忽然很近，又忽然很远', '主动和关心经常中断，也较少说明原因。', 1, '信号断断续续时，先别把等待当成剧情。', 'TA 的主动与关心经常忽近忽远，较少沟通原因'),
      option('大致稳定，也会解释忙碌', '有不同节奏，但通常知道彼此的状态。', 2, '稳定的小火，比偶尔的烟花更能煮熟一碗面。', '你们的互动较稳定，忙碌时也能沟通彼此状态'),
      option('主动和行动，都在持续出现', '不只在深夜或无聊时，平常也会认真回应和安排。', 3, '不是限定放映，TA 在把关心拍成日常。', 'TA 在不同时间持续主动、认真回应并落实安排'),
      unknown('认识时间太短，还看不出'),
    ],
  },
];

export const resultTypes = {
  unknown: {
    title: '故事还在选角中', subtitle: '空白页，也有无限种开场', kicker: '序章 · 待续', accent: '#9586ba',
    description: '镜头拍到的线索还不够，先不急着给 TA 的心意配旁白。你们可以从一次自然的聊天、一次具体的小邀约开始，让真实相处多写几页。',
    quote: '没拍到的镜头，不等于没有可能。',
    nextStep: '从共同兴趣切入，发起一次轻松聊天；如果双方聊得舒服，再邀请 TA 做一件具体的小事。看看 TA 是否愿意接住，也允许对方有自己的答案。',
  },
  friendly: {
    title: '友达便利店', subtitle: '灯亮着，但爱情还没有上架', kicker: '第一幕 · 熟悉的日常', accent: '#668c7b',
    description: '目前的互动更像普通熟人或友好的相处：可能有回应，但主动、特别关注或具体行动还不明显。这不是你的吸引力评分，也不需要靠更努力来换一个答案。',
    quote: '你值得被主动选择，不只是被礼貌回复。',
    nextStep: '如果你想更清楚，可以发起一次明确、容易拒绝的小邀约。若对方持续不回应，也不提出其他安排，把时间留给自己的生活。',
  },
  spark: {
    title: '心动正在试镜', subtitle: '有几束光，悄悄打向了你', kicker: '第二幕 · 镜头开始偏心', accent: '#c17f68',
    description: '你们之间出现了一些值得留意的信号：可能是主动分享，也可能是被记住的小事。不过，友好、熟悉和浪漫好感仍可能长得很像，故事还需要更多真实相处。',
    quote: '有些靠近很轻，轻到需要下一次来确认。',
    nextStep: '把模糊的“有空一起”变成一个具体提议，例如“周日下午要不要一起去那家店？”观察 TA 是否认真回应、愿意协调，以及之后是否也会主动。',
  },
  mutual: {
    title: '雨停之前，TA 还没走', subtitle: '下一幕，也许可以一起写', kicker: '第三幕 · 双人份的可能', accent: '#b25d67',
    description: '从你的观察看，主动、关注和实际行动正在互相呼应。这些持续的靠近值得被看见，但仍不能替 TA 作出恋爱承诺。最好的下一幕，是一次双方都舒服的表达。',
    quote: '最动人的不是巧合，是有人也在走向你。',
    nextStep: '选一个轻松的时刻，表达一点真实好感：“我很喜欢和你单独相处，想再多了解你。”留出回应的空间，让关系通过沟通向前走。',
  },
  fog: {
    title: '暧昧电台，信号漂移', subtitle: '有些夜晚很近，有些日子很远', kicker: '特别篇 · 雾里看信号', accent: '#7a849f',
    description: '你提供的线索里，有明显的靠近，也有明显的疏远。几次高光暂时还拼不成稳定的关系；与其替 TA 找齐所有理由，不如看看行动是否会在日常里持续。',
    quote: '不要用最热烈的一帧，替整段关系调色。',
    nextStep: '回到一个具体安排，表达自己的期待。观察对方是否愿意说明、协调并兑现；如果长期让你困惑，可以直接沟通，也可以选择把注意力收回来。',
  },
};

const dimensionLabels = {
  initiative: '主动靠近', attention: '特别关注', investment: '行动投入', consistency: '相处稳定',
};

/** This is an entertainment summary of observed interactions, not a probability of affection. */
export function getResult(answers = [], context = {}) {
  const observations = scenes.map((scene, index) => {
    const answer = answers[index];
    const choice = Number.isInteger(answer) ? scene.options[answer] : undefined;
    return { scene, choice };
  });
  const known = observations.filter(({ choice }) => choice && Number.isFinite(choice.signal));
  const count = known.length;
  const score = count < 4 ? null : Math.round(known.reduce((sum, { choice }) => sum + choice.signal, 0) / (count * 3) * 100);
  const dimensions = Object.entries(dimensionLabels).map(([key, label]) => {
    const matching = known.filter(({ scene }) => scene.dimension === key);
    const value = matching.length ? Math.round(matching.reduce((sum, { choice }) => sum + choice.signal, 0) / (matching.length * 3) * 100) : null;
    return { key, label, value };
  });
  const high = known.filter(({ choice }) => choice.signal === 3).length;
  const low = known.filter(({ choice }) => choice.signal === 0).length;
  const boundary = observations.find(({ scene }) => scene.id === 'boundary')?.choice;
  let id = count < 4 ? 'unknown' : count >= 6 && high >= 2 && low >= 2 ? 'fog' : score >= 72 ? 'mutual' : score >= 38 ? 'spark' : 'friendly';
  const hasActiveApproach = known.some(({ scene, choice }) => scene.dimension === 'initiative' && choice.signal >= 2);
  const hasConcreteInvestment = known.some(({ scene, choice }) => scene.dimension === 'investment' && choice.signal >= 2);
  // Respect and warmth matter, but alone they do not establish romantic initiative.
  const missingRomanceEvidence = id === 'mutual' && (!hasActiveApproach || !hasConcreteInvestment);
  if (missingRomanceEvidence) id = 'spark';
  // Coercion and repeated boundary violations must not produce an encouraging romance verdict.
  if (count >= 4 && boundary && boundary.signal !== null && boundary.signal <= 1) id = 'fog';
  const sorted = [...known].sort((a, b) => b.choice.signal - a.choice.signal);
  const evidence = [];
  if (boundary && boundary.signal !== null && boundary.signal <= 1) evidence.push(boundary.evidence);
  if (sorted.length) evidence.push(sorted[0].choice.evidence);
  if (sorted.length > 1) evidence.push(sorted[sorted.length - 1].choice.evidence);
  if (sorted.length > 2) {
    const remaining = sorted.find(({ choice }) => !evidence.includes(choice.evidence));
    if (remaining) evidence.push(remaining.choice.evidence);
  }
  let caution = '剧情升温值只概括你观察到的互动，不是 TA 喜欢你的概率，也不是心理诊断。好感需要当事人表达，尊重彼此的意愿和边界。';
  if (count >= 4 && count < 8) caution += ` 目前只有 ${count} / ${scenes.length} 个片段有线索，即使升温值较高，也仍需要更多日常观察。`;
  if (missingRomanceEvidence) caution += ' 目前还缺少主动靠近或具体投入的线索；尊重与友善很珍贵，但不能单独用来判断浪漫好感。';
  if (['slow', '慢热', '比较慢热'].includes(context.style)) caution += ' 你提到 TA 比较慢热，可以多观察稳定行动，不用只看聊天频率。';
  if (context.relation === 'online' || context.relation === '主要在线上') caution += ' 线上互动提供的信息有限，暂不把见面相关的空白当成负面信号。';
  const result = { ...resultTypes[id], id, score, confidence: count >= 8 ? '线索充足' : count >= 4 ? '线索有限' : '线索不足', dimensions, evidence: [...new Set(evidence)].slice(0, 3), caution, knownCount: count };
  if (boundary && boundary.signal !== null && boundary.signal <= 1) {
    result.description = '你记录的互动里，边界没有被好好尊重。无论 TA 是否有好感，这一点都比暧昧的高光更值得认真对待。你不需要用委屈自己来换一段关系。';
    if (count < 4) result.description = '目前线索还不足以整理你们的关系，但你已经记录了边界没有被好好尊重。无论 TA 是否有好感，你的拒绝与感受都值得被尊重。';
    result.nextStep = '先照顾自己的感受与安全。清楚表达你的界限，观察对方是否真正调整行为；若施压或越界持续，减少接触，并向可信任的人寻求支持。';
    result.quote = '你的界限，比任何故事结局都重要。';
    result.caution += ' 已记录的施压或越界行为需要优先认真对待，线索较少也不影响你保护自己的边界。';
  }
  return result;
}
