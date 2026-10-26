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
    dimension: 'responsiveness', title: '“今天还好吗？”',
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
    dimension: 'boundaries', title: '心动，也该让人松口气。',
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


const addedScenes = [
  {
    id: 'goodnews', chapter: '02', chapterTitle: '人群里的一点偏心', time: '17:26', location: '一件想分享的小开心',
    dimension: 'responsiveness', title: '你的小确幸，TA 接住了吗？',
    narrative: '搞定了一个难题、收到喜欢的礼物、路边碰见一只猫。你把那份小快乐发过去，想知道它会不会在另一个人那里，也亮一下。',
    message: { from: '你', text: '今天真的有件开心的事，想第一个和你说！' },
    prompt: '分享好消息时，哪张画面最像 TA 的真实回应？',
    options: [
      option('镜头一转，变成了 TA 的故事', '经常略过我的开心，或很快转回自己的话题。', 0, '快乐不需要比大小，你的开心也值得有自己的镜头。', '分享好消息时，TA 经常略过或转走话题'),
      option('一个赞，收到啦', '会说“不错”“恭喜”，但很少继续聊。', 1, '小烟花发射成功，回声暂时有点轻。', 'TA 会简短祝贺，但较少继续了解你的好消息'),
      option('坐好，听你展开讲讲', '会问细节，也能感受到 TA 在替我高兴。', 2, '一份快乐，被认真听见就多了一点。', 'TA 会积极了解好消息的细节，并表达高兴'),
      option('把开心拍成了小庆祝', '不止认真追问，还会在之后提起或一起小小庆祝。', 3, '这不是观众席，这是你的应援区。', 'TA 会认真回应好消息，之后也会记得或一起庆祝'),
      unknown('还没分享过这类小开心'),
    ],
  },
  {
    id: 'sharedactivity', chapter: '03', chapterTitle: '把下次，变成日期', time: '周末 · 14:32', location: '一张还没写满的行程单',
    dimension: 'investment', title: '“一起做点什么”之后呢？',
    narrative: '一起看场展、合作打局游戏、试一家小店。相处不一定要隆重，重要的是有没有两个人都愿意参与的那一点时间。',
    prompt: '回想共同活动，哪张画面最像你们？',
    options: [
      option('单人打卡，双人计划未开张', '几次提议后都没有共同参与，通常也没有替代方案。', 0, '双人任务可以暂停，你的生活不用跟着暂停。', '多次共同活动提议没有落实，也没有替代方案'),
      option('我负责安排，TA 随缘上线', '路线、时间和后续大多由我来推动。', 1, '导演和场务，不必都由一个人兼任。', '共同活动主要由你单方面组织和推动'),
      option('轮流选地点，一起找时间', '会参与讨论，愿意为两个人的兴趣做一点协调。', 2, '行程单上，终于出现了两种字迹。', 'TA 愿意参与共同活动的安排并协调时间'),
      option('“这次听你的，下次我安排”', '不止一次双方都有提议，也都有实际参与。', 3, '不是陪你打卡，是在一起收集故事。', '双方多次主动提议并参与共同活动'),
      unknown('还没有一起做过什么'),
    ],
  },
  {
    id: 'busyweekly', chapter: '04', chapterTitle: '故事，需要两个人', time: '忙碌的一周 · 22:10', location: '没有及时回复的消息旁边',
    dimension: 'consistency', title: '慢回复，也能有交代。',
    narrative: '回复快慢会被工作、作息和习惯影响。比盯着那个已读状态更有帮助的，是看看联系中断以后，你们会不会自然把线接回来。',
    prompt: '忙碌或错过消息之后，TA 通常怎么处理？',
    options: [
      option('经常没下文，让我反复追问', '长期难以知道互动还会不会继续。', 0, '别把自己的心情，寄存在一个无限刷新的窗口。', '联系中断后，TA 经常不继续回应且需要反复追问'),
      option('偶尔回来，节奏很难猜', '有时突然热情，有时很久没有后续，也很少说明。', 1, '通知可以静音，长期的不确定也值得被看见。', '忙碌后的恢复联系缺乏稳定节奏和必要沟通'),
      option('忙完会接回来，偶尔说明', '不一定秒回，但通常会继续之前的话题。', 2, '慢一点没有关系，故事没有一直悬空。', 'TA 忙完通常会恢复联系并继续之前的话题'),
      option('会沟通节奏，也持续做到', '彼此知道方便的时间，临时变化也会简单交代。', 3, '安心感，不一定长得像秒回。', 'TA 会沟通联系节奏，且能在日常中持续落实'),
      unknown('最近还没有这样的观察'),
    ],
  },
  {
    id: 'disagreement', chapter: '04', chapterTitle: '故事，需要两个人', time: '一个意见不同的傍晚', location: '“我们可以商量一下吗”之后',
    dimension: 'boundaries', title: '不同频道，也能好好说话吗？',
    narrative: '你想安静一点，TA 想热闹一点；你不想公开某件小事，TA 有另一种想法。关系的质地，也藏在彼此不一样的时候。',
    prompt: '你们意见不同时，最常见的画面是？',
    options: [
      option('我的拒绝，被当成了“扫兴”', '会被嘲讽、逼着答应，或被要求证明自己在乎。', 0, '不同意，不是你欠对方一份道歉。', '意见不同时，TA 会嘲讽或施压让你让步'),
      option('答应尊重，行为却总回到原点', '反复越过我明确表达过的限制。', 1, '反复说过的界限，不该一次次被重拍。', 'TA 对已明确表达的限制仍有反复越界'),
      option('会听完，再商量一个方案', '可以表达不同意见，不需要为拒绝感到害怕。', 2, '不用把自己删掉，才能出现在这段关系里。', '意见不同时，TA 愿意倾听并协商'),
      option('不一致，也能互相留出空间', '尊重各自选择，之后也会回顾怎么相处更舒服。', 3, '靠近的同时，也留着让你呼吸的位置。', 'TA 尊重不同选择，并愿意一起调整相处方式'),
      unknown('还没遇到这类分歧'),
    ],
  },
];
for (const scene of addedScenes) scenes.push(scene);
const storyOrder = ['midnight', 'aftergoodnight', 'coffee', 'crowd', 'busyday', 'goodnews', 'invitation', 'smallpromise', 'sharedactivity', 'distance', 'busyweekly', 'boundary', 'disagreement', 'overtime'];
scenes.sort((a, b) => storyOrder.indexOf(a.id) - storyOrder.indexOf(b.id));
const visualThemes = { midnight: 'messages', coffee: 'coffee', crowd: 'crowd', goodnews: 'news', invitation: 'calendar', sharedactivity: 'activity' };
for (const scene of scenes) {
  if (visualThemes[scene.id]) {
    scene.visual = true;
    scene.imageTheme = visualThemes[scene.id];
    scene.options.forEach(choice => { if (choice.signal !== null) choice.imageKey = `${scene.imageTheme}-${choice.signal}`; });
  }
}

export const resultTypes = {
  unknown: {
    code: 'CC-01', attribute: '留白探索型', tags: ['线索待加载', '不急着定义', '故事有留白'], motif: 'unknown',
    title: '心动信号加载中', subtitle: '星云还没成形，先别替它命名', kicker: '关系画像 · 观察起步', accent: '#a98cba',
    description: '目前可以观察的片段还不够，暂时无法整理出清晰的互动模式。未知经历不是冷淡，更不意味着你没有吸引力；先让真实相处比脑内小剧场多一点。',
    quote: '还没有答案，也可以安心待在故事里。',
    nextStep: '从一个双方都感兴趣的小话题开始，看看能否自然地轮流分享。无需突然倾诉很私密的内容；不想回应时，也允许彼此停下来。',
  },
  friendly: {
    code: 'CC-02', attribute: '舒适友好型', tags: ['友好有回应', '浪漫待确认', '不用强行升级'], motif: 'friendly',
    title: '友达便利店', subtitle: '暖灯一直亮着，爱情货架暂未上新', kicker: '关系画像 · 友好日常', accent: '#b58d87',
    description: '你描述的相处有熟悉或礼貌的回应，但暂时缺少持续主动、特别关注与共同投入的组合。它可以是一段值得珍惜的友好关系，也可以等待当事人进一步表达；没有必要给每份温柔贴上爱情标签。',
    quote: '舒服值得珍惜，喜欢需要另外确认。',
    nextStep: '先分清自己想要友谊还是进一步了解。如果想澄清，可以在对方愿意交流时表达一次轻量好感；若没有积极回应，就尊重现状，不靠不断加码换答案。',
  },
  mutual: {
    code: 'CC-03', attribute: '双向行动型', tags: ['主动与行动同行', '回应能落地', '可以真诚表达'], motif: 'mutual',
    title: '双向奔赴小火箭', subtitle: '不止聊天很甜，日历里也有位置', kicker: '关系画像 · 持续靠近', accent: '#cf6d93',
    description: '从你的观察看，主动、关注、回应和具体行动在不同日子里都能对上。这些信号值得被认真看见；“双向”仍需要你们一起确认，不等于 TA 已经作出恋爱承诺。',
    quote: '最浪漫的不是倒计时，是两个人都愿意出发。',
    nextStep: '在轻松的独处时刻说清一点自己的感受：“我很喜欢和你相处，想再多了解你。”留出回应空间，再一起商量各自舒服的相处节奏。',
  },
  slow: {
    code: 'CC-04', attribute: '慢热稳步型', tags: ['开场音量小', '照顾有后续', '节奏可以商量'], motif: 'slow',
    title: '草莓慢炖小茶壶', subtitle: '不抢着冒泡，温柔却在认真续杯', kicker: '关系画像 · 温柔慢放', accent: '#ca8197',
    description: '你记录到的主动开场不算多，但关注、回应与行动相对持续。这更像一种“慢一点、但有在参与”的互动模式；它不是人格或依恋诊断，也不能用慢热来解释长期失约。',
    quote: '不用猛火催熟，看温柔有没有下一杯。',
    nextStep: '一起商量一个轻量、可预期的联系或见面节奏。表达你喜欢怎样被回应，再看 TA 是否愿意持续参与；给节奏一点空间，也给自己一个舒适的限度。',
  },
  online: {
    code: 'CC-05', attribute: '线上连接型', tags: ['云端有来有往', '线下仍是空白', '先确认舒适感'], motif: 'online',
    title: '云端来信收藏家', subtitle: '聊天框有小宇宙，现实地图还待解锁', kicker: '关系画像 · 云端频道', accent: '#a38dbc',
    description: '你们在线上的主动分享和回应比较明显，而共同活动相关的经历仍是空白。线上连接可以很有意义，但不能自动推断现实相处的适配度；空白不该算成冷淡，也不需要急着用见面证明什么。',
    quote: '信件有温度，关系也可以慢慢拥有坐标。',
    nextStep: '先尝试双方愿意的共同小活动，例如一起看一段视频后交流感受。若未来决定见面，在双方自愿的前提下选择公开地点、各自安排交通，不必交换私密资料来证明信任。',
  },
  chatty: {
    code: 'CC-06', attribute: '高聊低约型', tags: ['聊天自带续集', '计划容易悬空', '看行动别只看糖'], motif: 'chatty',
    title: '聊天框旋转木马', subtitle: '消息绕了好多圈，日历还停在原地', kicker: '关系画像 · 高聊低约', accent: '#d47eaa',
    description: 'TA 的主动聊天比较明显，但共同安排和兑现承诺的线索偏少。好聊是一种连接，却不一定意味着愿意发展同一种关系。比继续猜测更有帮助的，是看看双方对关系和投入的期待是否一致。',
    quote: '台词可以很甜，下一幕要看有没有行动。',
    nextStep: '如果还没有明确表达过期待，可以澄清一次：“我挺喜欢和你聊天，也想知道你是否愿意一起做点具体的事。”若多次提议仍无后续，先停止追加投入。',
  },
  practical: {
    code: 'CC-07', attribute: '行动表达型', tags: ['事情有人接住', '情绪还需翻译', '需求可以说出来'], motif: 'practical',
    title: '行动派浪漫维修站', subtitle: '伞能送到，心事也需要有人听懂', kicker: '关系画像 · 行动在场', accent: '#bb8c9e',
    description: '具体安排和兑现承诺比较突出，而主动聊天或情绪回应未必同样明显。行动值得看见，但有事帮忙与浪漫好感仍不是同一回事；如果你需要被倾听，可以把这种需要说清楚。',
    quote: '被照顾的方式，可以一起学会翻译。',
    nextStep: '感谢具体行动，同时提出一个清楚的小需要：“谢谢你帮我想办法，我现在也想先被听一会儿。”观察 TA 是否愿意理解，而不是要求自己只接受一种表达方式。',
  },
  onesided: {
    code: 'CC-08', attribute: '投入不对称型', tags: ['你在用力划船', '回应不够对等', '先把重心还给你'], motif: 'onesided',
    title: '单人划船俱乐部', subtitle: '双人座的小船，不该只有你带桨', kicker: '关系画像 · 投入失衡', accent: '#a88dad',
    description: '从你的记录看，联系和共同安排主要靠你推动，TA 的主动与实际参与偏少。这个模式说的是当前互动，不是在评价你的魅力，也不能证明对方一定在故意吊着你。',
    quote: '放下多余的那支桨，也是在照顾自己。',
    nextStep: '把精力从反复追问和追加安排中收回来。若对方已明确拒绝，不再继续邀约；若只是期待未说清，可以澄清一次，之后以实际回应决定自己的投入。',
  },
  fog: {
    code: 'CC-09', attribute: '互动波动型', tags: ['高光很会心动', '日常信号漂移', '稳定比脑补重要'], motif: 'fog',
    title: '忽晴忽雨月亮电台', subtitle: '有些夜晚信号满格，白天却总在搜台', kicker: '关系画像 · 节奏不定', accent: '#a28ab5',
    description: '有些片段里 TA 明显靠近，另一些日子却难以接续。偶尔的高光暂时还不能拼成稳定的关系；原因可能很多，不必替 TA 作心理诊断，先看这种互动是否符合你的需要。',
    quote: '不要让最甜的一帧，替整部电影调色。',
    nextStep: '说清你想要的联系节奏，询问对方能否做到一个具体而合理的安排。如果长期没有解释或调整，可以减少等待，把日常重新放回自己的手里。',
  },
  boundary: {
    code: 'CC-10', attribute: '边界优先型', tags: ['你的拒绝有效', '尊重需要落地', '先照顾自己的感受'], motif: 'boundary',
    title: '玫瑰结界守护者', subtitle: '玫瑰可以靠近，结界不必撤掉', kicker: '关系画像 · 边界优先', accent: '#b87899',
    description: '你记录了明确的施压、嘲讽或反复越界。无论有没有其他甜蜜片段，你的拒绝和感受都值得被尊重。这不是给 TA 贴人格标签，而是提醒你先认真对待已经发生的行为。',
    quote: '喜欢可以不确定，你的界限一直有效。',
    nextStep: '在你感到安全的前提下，清楚表达界限；不需要反复证明自己有权拒绝。若越界持续，减少接触，并向可信任的人寻求支持。',
  },
  spark: {
    code: 'CC-11', attribute: '初期探索型', tags: ['有几帧小火花', '还需要真相处', '轻量表达就很好'], motif: 'spark',
    title: '桃子味心动试播集', subtitle: '有几颗糖落进片头，正片还在拍', kicker: '关系画像 · 试播心动', accent: '#d783a1',
    description: '你们的互动里出现了一些主动、关注或回应，但维度还不够一致，或者观察仍有限。友好与好感可能长得很像；可以保持好奇，把相处拍成更多真实片段，而不急着押注某个结局。',
    quote: '先把下一次聊好，不用一口气演到大结局。',
    nextStep: '从共同兴趣出发，发起一个具体、容易拒绝的小提议。看 TA 是否愿意协商、参与，以及之后会不会也主动；没有积极回应时，就停在对方舒服的距离。',
  },
  steady: {
    code: 'CC-12', attribute: '稳定回应型', tags: ['日常持续在线', '情绪能被接住', '舒服也很浪漫'], motif: 'steady',
    title: '水豚双人野餐局', subtitle: '没有天天放烟花，也没让温柔断粮', kicker: '关系画像 · 稳定陪伴', accent: '#bb9294',
    description: '回应、稳定性和尊重在你的记录里比较突出，彼此共同参与也有落地。这样的相处质地值得珍惜，但稳定的友谊同样可能具备这些特点；关系的方向仍需要双方表达。',
    quote: '不把心情晾在半空，也是认真在乎的一种。',
    nextStep: '保留舒服的日常，同时偶尔一起尝试一个双方感兴趣的新活动。如果想进一步发展，可以轻轻表达好感，询问对方是否也愿意多了解彼此。',
  },
};

const dimensionLabels = {
  initiative: '主动靠近', attention: '特别关注', responsiveness: '情绪回应', investment: '行动投入', consistency: '互动稳定', boundaries: '边界尊重',
};
const sourceByDimension = { initiative: ['disclosure'], attention: ['intimacy'], responsiveness: ['intimacy', 'goodnews'], investment: ['novel'], consistency: ['intimacy', 'conflict'], boundaries: ['conflict'] };

const advice = {
  initiative: {
    high: ['你记录到较多主动开场或续聊。主动是参与的线索，但聊天频率不能单独判断恋爱意愿。', '保持轮流分享，也适度回应对方关心的事，让表达是来回流动的。', '不要把“主动次数”变成打卡考核，也不必故意消失来试探。', '我很喜欢听你分享这些，你最近还有什么想聊的吗？'],
    middle: ['主动联系有出现，但还没有形成清晰模式。工作、作息与习惯都可能影响开场频率。', '试着用一个开放但轻量的问题开启话题，再看对方是否也会追问和延展。', '避免连发问题或突然倾诉很多私密经历来换取亲近。', '最近有没有一件让你挺开心的小事？'],
    low: ['联系较依赖你的推动。先确认自己是否愿意接受这种投入比例，而不是用更多付出来弥补。', '停止额外追加话题，保留自然交流；如果期待不同，可以直接说明自己需要更有来有往。', '不要故意冷落、制造吃醋或反复发送消息来测试对方。', '我希望联系是彼此都有参与的，你觉得怎样的节奏更适合？'],
    unknown: ['这个维度还没有足够观察，空白不代表 TA 不在意。', '从双方愿意分享的轻松话题开始，留意后续是否有自然的来回。', '不凭一次回复速度或一个表情判断喜欢。', '这件事让我想到你，想听听你的看法。'],
  },
  attention: {
    high: ['TA 会记住细节或在人群里主动回应你。这是被看见的线索，仍需结合对其他人的表现和实际行动。', '也记住对方在意的小事，之后自然问问进展，形成互相了解。', '避免把一次眼神或礼物当作排他性的喜欢证明。', '你上次提到的那件事，后来怎么样了？'],
    middle: ['你记录到一些关注，但“特别对你”与普通友好尚不容易区分。', '分享一点对自己有意义、但不太私密的小经历，看双方是否能理解并接续。', '不要拿 TA 和别人的互动做监控式比较。', '这件小事对我还挺有意义的，你会怎么想？'],
    low: ['被记住或被关注的经历比较少。需要被理解是可以表达的，不必怀疑自己是否值得。', '清楚提出一个具体需要，例如重要事情后希望被问一句；再观察回应。', '不通过不断送礼、迁就或放弃喜好来争取注意。', '这件事对我挺重要，之后你愿意听听结果吗？'],
    unknown: ['还没有可用片段判断细节关注，尤其新认识或线上相处时很常见。', '聊一点真实兴趣或近期计划，让彼此有逐步了解的机会。', '不把没发生过的多人场合自动计作疏远。', '我最近在期待这件事，你最近有什么小计划？'],
  },
  responsiveness: {
    high: ['你的情绪或好消息通常能被认真接住。回应性研究强调感到被理解和关心，不只是得到建议。', '延续具体追问和真诚祝贺；烦恼出现时，也先问对方需要倾听还是一起想办法。', '不把积极回应当成必须随时提供情绪照顾的义务。', '你现在更想让我听一听，还是一起想个办法？'],
    middle: ['基本的安慰或祝贺有出现，但深度与后续还不稳定。表达方式不同，可以先把需要讲具体。', '分享一件适度的小开心，或说明自己此刻更需要被听见，而非马上获得解决方案。', '不要用一次回应不够热烈就判定对方完全不在意。', '我想先把这件事讲完，你听我说一会儿就好。'],
    low: ['你的开心或烦恼较少得到关注。研究中的回应性涉及理解与关心，不等于只说一句“加油”。', '在对方方便时说清自己需要怎样的回应；如果长期被忽略，重新评估期待与投入。', '不要为了维持关系反复吞下感受，也不要求自己只当倾听者。', '我分享时希望被认真听一会儿，这对我很重要。'],
    unknown: ['还没分享过情绪或开心，就无法观察回应方式。无需为了测试而制造悲伤或暴露隐私。', '从一件轻松的小开心开始，看看对方愿不愿意了解；倾诉深度由你自己决定。', '不要编造危机、故意卖惨或突然过度自我暴露。', '今天有件小事让我很开心，想和你分享一下。'],
  },
  investment: {
    high: ['共同安排与兑现承诺有实际发生。共同活动研究支持相处体验的价值，但不证明早期邀约一定能让人喜欢你。', '轮流安排一件双方有兴趣、负担不大的活动，结束后问问彼此喜欢哪些部分。', '避免用昂贵礼物、大额支出或高压惊喜来制造承诺。', '下次我们各提一个想法，挑一个都舒服的安排好吗？'],
    middle: ['有一些行动落地，也有待确认的计划。比“改天一起”更好观察的是双方愿意协调的具体安排。', '提出一个时间、内容都清楚且容易拒绝的小计划，再观察 TA 是否参与协商。', '不要把答应一次活动等同于关系升级或默认约会。', '周六下午去那家店坐一小时怎么样？不方便也可以直接说。'],
    low: ['安排主要由你推动，或提议多次没有落实。行动不足可能意味着期待不同，无需替对方解释全部原因。', '若已多次邀约没有后续，先停止追加安排；把精力留给会回应你的生活与人。', '不要用重复邀约、送礼或帮忙让对方觉得欠你一段关系。', '如果你暂时不想安排也没关系，我会先按自己的计划走。'],
    unknown: ['还没有共同活动或承诺的可观察经历，因此不能把行动这一项判断为低。', '如果双方都愿意，可从轻量的线上共同活动或公开场合的小安排开始。', '不为尽快验证好感而承担不舒服的成本或风险。', '这件小活动你有兴趣一起试试吗？不想也完全没关系。'],
  },
  consistency: {
    high: ['不同日子里的互动能接续，忙碌也通常有交代。稳定不等于秒回，更不等于必须随时在线。', '商量双方舒服的联系节奏，遇到临时变化时简单说明，保留各自生活。', '不要把稳定联系变成报备、查岗或要求即时回复。', '我们忙的时候不用秒回，方便时接着聊就好，你觉得呢？'],
    middle: ['互动大致能继续，但某些时段还比较难预测。与其猜忙碌的含义，不如问清双方的方便程度。', '用具体的日常需要讨论节奏，而不是要求对方证明自己在乎。', '避免用在线状态、已读和回复秒数作结论。', '我不需要马上回复，但希望忙完能接回来，你觉得可行吗？'],
    low: ['你记录了较明显的断续或忽近忽远。研究不能替你解释原因，但你可以判断这种模式是否让自己舒服。', '表达一个合理、具体的期待，观察后续能否持续调整；长期不合适时允许自己减少等待。', '不要用最热烈的一次聊天抵消长期失约，也不要靠试探维持刺激。', '反复没下文会让我不太确定，我们能不能约定一个都能做到的节奏？'],
    unknown: ['认识时间或观察片段有限，暂时还看不出持续性。这个指标需要日常积累。', '把最近几次真实相处连起来看，不必记录到分钟，也不用专门测试。', '不要把认识初期的高频联系直接当作长期稳定。', '之后有空再接着聊，不用赶着一次把故事说完。'],
  },
  boundaries: {
    high: ['你表达拒绝或不同意见时，通常能得到尊重。这是舒服相处的重要基础，不是浪漫好感的专属信号。', '继续明确表达意愿，也给对方拒绝的空间；有分歧时讨论具体行为与需要。', '不把亲近当作查看隐私、替对方决定或随时打扰的许可。', '我今天想自己休息，改天再聊；你不方便时也可以直接告诉我。'],
    middle: ['意见不同仍有沟通空间。研究提醒沟通的效果取决于情境，真诚不等于攻击或无条件退让。', '聚焦一件具体的小事，说自己的感受与需要，并给双方暂停的空间。', '避免羞辱、冷惩罚或把不同意解释成不够在乎。', '这件事我有不同想法，我们能不能找一个都舒服的办法？'],
    low: ['你记录了施压、嘲讽或反复越界。尊重界限是相处原则，不需要先得到量表分数或研究许可。', '在安全的前提下清楚表达界限；若越界持续，减少接触，并向可信任的人寻求支持。', '不要为了推进关系、换取喜欢或证明信任而撤掉自己不愿放弃的界限。', '这件事我不愿意，请尊重我的决定。'],
    unknown: ['还没有观察到拒绝或分歧时的互动，暂时无法判断。没有冲突并不自动代表边界已被尊重。', '自然相处时保留自己的选择，不必制造争执；对不舒服的安排可以直接拒绝。', '不要故意设局激怒对方，也不要为了“懂事”勉强答应。', '这个安排我不太舒服，我想换一种方式。'],
  },
};

function makeGuidance(dimensions, observations, boundaryAlert) {
  return dimensions.map(dimension => {
    const known = observations.filter(({ scene, choice }) => scene.dimension === dimension.key && choice && Number.isFinite(choice.signal));
    const band = boundaryAlert && dimension.key === 'boundaries' ? 'low' : dimension.value === null ? 'unknown' : dimension.value >= 67 ? 'high' : dimension.value >= 34 ? 'middle' : 'low';
    const text = advice[dimension.key][band];
    const detail = {
      ...dimension, knownCount: known.length,
      observation: known.length ? known.map(({ choice }) => choice.evidence).join('；') : '这一项暂时没有已知互动片段。',
      interpretation: text[0], tryThis: text[1], avoid: text[2], say: text[3], sourceIds: [...sourceByDimension[dimension.key]],
    };
    if (boundaryAlert && dimension.key !== 'boundaries') {
      detail.tryThis = '这一项即使有甜蜜线索，也先不用于推进关系；优先处理已经记录的施压或越界，照顾自己的感受与空间。';
      detail.avoid = '不要用这个维度的高光，替已经发生的越界找理由。';
      detail.say = '在继续其他安排之前，我需要自己的界限先被尊重。';
    }
    return detail;
  });
}

function actionPlanFor(id, result) {
  if (id === 'boundary') return [
    { label: '先照顾自己', action: '暂停不舒服的安排，保留你愿意接受的联系范围。', observe: '自己的紧张或不适是否减少；无需等对方认可你的感受。' },
    { label: '安全地表达界限', action: '如果安全且你愿意，用一句清楚的话说出不接受的行为；不必继续争辩。', observe: '看行为是否停止，而不仅是听一句道歉。' },
    { label: '保留支持', action: '若施压或越界继续，减少接触，并找可信任的人支持你的决定。', observe: '不以“是否还能发展”为优先目标。' },
  ];
  if (id === 'onesided') return [
    { label: '先停下加码', action: '减少反复追问和单方面安排，照常经营自己的生活。', observe: '这不是冷落试探，而是让投入回到自己舒服的范围。' },
    { label: '必要时澄清一次', action: '如果期待从未说清，可以坦诚说明；若对方已拒绝，就不再重复邀约。', observe: '看对方是否有清楚、自愿的回应。' },
    { label: '用行动作决定', action: '根据之后真实发生的参与决定继续了解还是保持距离。', observe: '不用等待一个无限期的“也许”。' },
  ];
  if (id === 'fog' || id === 'chatty') return [
    { label: '说清一个需要', action: result.nextStep, observe: '对方是否能说明自己的期待，而不是只用甜言蜜语跳过问题。' },
    { label: '看一次实际落实', action: '不继续堆新计划，先看已经共同商量的事项能否兑现。', observe: '有变动是否说明、协调，而非让你独自等待。' },
    { label: '评估你的舒适度', action: '问问自己：这个互动模式是否符合我想要的关系？允许自己调整投入。', observe: '不只问 TA 喜不喜欢，也问自己开不开心。' },
  ];
  if (id === 'online') return [
    { label: '先做一件小事', action: '一起分享一段音乐或观看一段内容，再交流感受。', observe: '能否自然轮流表达，对方也愿意了解你。' },
    { label: '保留自己的节奏', action: '不以交换私密资料或随时在线作为信任考核。', observe: '表达不方便时，是否得到尊重。' },
    { label: '若见面，双方自愿', action: '若双方都想见面，选公开场合，各自安排交通；也可以继续线上了解。', observe: '不接受催促、施压或让你不舒服的保密要求。' },
  ];
  return [
    { label: '先回应一件小事', action: id === 'practical' ? '感谢一个具体行动，并说清你此刻更需要倾听还是建议。' : '认真接住对方的一次分享，也说一点自己的真实感受。', observe: '双方是否都能表达，不是只有一个人在提问或倾听。' },
    { label: '选择一个小行动', action: result.nextStep, observe: '看对方是否自愿参与、协调，并在之后继续接续。' },
    { label: '复盘彼此的感受', action: '下一次相处后，问自己是否更轻松、更能做自己；也给对方表达感受的空间。', observe: '没有积极回应或明确拒绝时，就停下来，不反复追问。' },
  ];
}

/** Entertainment classification based on observed interactions. Thresholds are editorial rules, not an academic scale. */
export function getResult(answers = [], context = {}) {
  const observations = scenes.map((scene, index) => ({ scene, choice: Number.isInteger(answers[index]) ? scene.options[answers[index]] : undefined }));
  const known = observations.filter(({ choice }) => choice && Number.isFinite(choice.signal));
  const count = known.length;
  const dimensions = Object.entries(dimensionLabels).map(([key, label]) => {
    const matching = known.filter(({ scene }) => scene.dimension === key);
    const value = matching.length ? Math.round(matching.reduce((sum, { choice }) => sum + choice.signal, 0) / (matching.length * 3) * 100) : null;
    return { key, label, value, knownCount: matching.length };
  });
  const values = Object.fromEntries(dimensions.map(d => [d.key, d.value]));
  const v = key => values[key];
  const has = (...keys) => keys.every(key => v(key) !== null);
  const score = count < 4 ? null : Math.round(known.reduce((sum, { choice }) => sum + choice.signal, 0) / (count * 3) * 100);
  const boundaryObservations = known.filter(({ scene }) => scene.dimension === 'boundaries');
  const boundaryAlert = boundaryObservations.some(({ choice }) => choice.signal <= 1);
  let id = 'spark';
  if (boundaryAlert) id = 'boundary';
  else if (count < 4) id = 'unknown';
  else if (has('initiative', 'investment') && v('initiative') <= 17 && v('investment') <= 33) id = 'onesided';
  else if (has('consistency') && v('consistency') <= 33 && ['initiative', 'attention', 'responsiveness', 'investment'].some(key => v(key) !== null && v(key) >= 67)) id = 'fog';
  else if (['online', '主要在线上'].includes(context.relation) && has('initiative', 'attention', 'responsiveness') && v('initiative') >= 50 && v('attention') >= 50 && v('responsiveness') >= 50 && v('investment') === null) id = 'online';
  else if (has('initiative', 'investment') && v('initiative') >= 67 && v('investment') <= 33) id = 'chatty';
  else if (has('initiative', 'attention', 'responsiveness', 'investment', 'consistency', 'boundaries') && count >= 10 && v('initiative') >= 75 && v('attention') >= 67 && v('responsiveness') >= 67 && v('investment') >= 75 && v('consistency') >= 67 && v('boundaries') >= 67) id = 'mutual';
  else if (has('initiative', 'attention', 'responsiveness', 'investment', 'consistency', 'boundaries') && v('initiative') <= 50 && v('attention') >= 67 && v('responsiveness') >= 67 && v('investment') >= 50 && v('consistency') >= 67 && v('boundaries') >= 67) id = 'slow';
  else if (has('investment') && v('investment') >= 67 && ((v('responsiveness') !== null && v('responsiveness') <= 50) || (v('attention') !== null && v('attention') <= 50))) id = 'practical';
  else if (has('initiative', 'investment', 'responsiveness', 'consistency', 'boundaries') && v('initiative') >= 50 && v('investment') >= 50 && v('responsiveness') >= 67 && v('consistency') >= 67 && v('boundaries') >= 67) id = 'steady';
  else if (has('initiative', 'attention', 'investment') && v('initiative') <= 50 && v('attention') <= 50 && v('investment') <= 50) id = 'friendly';
  const sorted = [...known].sort((a, b) => b.choice.signal - a.choice.signal);
  const evidence = [];
  if (boundaryAlert) evidence.push(boundaryObservations.find(({ choice }) => choice.signal <= 1).choice.evidence);
  if (sorted.length) evidence.push(sorted[0].choice.evidence);
  if (sorted.length > 1) evidence.push(sorted[sorted.length - 1].choice.evidence);
  if (sorted.length > 2) evidence.push(sorted.find(({ choice }) => !evidence.includes(choice.evidence))?.choice.evidence);
  let caution = '关系画像与阈值是本网站的创意规则，并非经过验证的心理量表、人格类型或喜欢概率。研究用于解释相处建议，不为这次分类或 TA 的心意背书。';
  if (count < 10) caution += ` 目前只有 ${count} / ${scenes.length} 个片段有线索，未知项不会扣分，结果仍需更多真实相处来补充。`;
  if (['slow', '慢热', '比较慢热'].includes(context.style)) caution += ' 你提到 TA 比较慢热，仍以已经发生的行为为准，不因此加分。';
  if (['online', '主要在线上'].includes(context.relation)) caution += ' 线上相处不把共同活动的空白算作负面信号。';
  if (boundaryAlert) caution += ' 已记录的施压或反复越界需要优先认真对待，少量线索也不影响你保护自己的边界。';
  const profile = resultTypes[id];
  const result = {
    ...profile, id, score, dimensions, knownCount: count,
    confidence: count >= 11 ? '线索较充足' : count >= 4 ? '线索有限' : '线索不足',
    evidence: [...new Set(evidence.filter(Boolean))].slice(0, 3), caution,
    relationshipAttribute: profile.attribute, tags: [...profile.tags], profileCode: profile.code,
  };
  result.guidance = makeGuidance(dimensions, observations, boundaryAlert);
  result.actionPlan = actionPlanFor(id, result);
  return result;
}

const fixture = (byDimension, context = {}) => {
  const counts = {};
  const answers = scenes.map(scene => { const index = counts[scene.dimension] ?? 0; counts[scene.dimension] = index + 1; const value = byDimension[scene.dimension]; return Array.isArray(value) ? (value[index] ?? 4) : (value ?? 4); });
  return { answers, context: { relation: '朋友', style: '还不确定', ...context } };
};
export const profileExamples = {
  unknown: fixture({}),
  friendly: fixture({ initiative: 1, attention: 1, responsiveness: 1, investment: 1, consistency: 2, boundaries: 2 }),
  mutual: fixture({ initiative: 3, attention: 3, responsiveness: 3, investment: 3, consistency: 3, boundaries: 3 }),
  slow: fixture({ initiative: 1, attention: 3, responsiveness: 3, investment: 2, consistency: 3, boundaries: 3 }),
  online: fixture({ initiative: 3, attention: 3, responsiveness: 3, consistency: 2, boundaries: 2 }, { relation: '主要在线上' }),
  chatty: fixture({ initiative: 3, attention: 2, responsiveness: 2, investment: 1, consistency: 2, boundaries: 2 }),
  practical: fixture({ initiative: 1, attention: 1, responsiveness: 1, investment: 3, consistency: 2, boundaries: 2 }),
  onesided: fixture({ initiative: 0, attention: 1, responsiveness: 1, investment: 0, consistency: 1, boundaries: 2 }),
  fog: fixture({ initiative: 3, attention: 3, responsiveness: 2, investment: 2, consistency: 0, boundaries: 2 }),
  boundary: fixture({ initiative: 3, attention: 3, responsiveness: 3, investment: 3, consistency: 3, boundaries: 0 }),
  spark: fixture({ initiative: 2, attention: 2, responsiveness: 1, investment: [1, 2, 2], consistency: 2, boundaries: 2 }),
  steady: fixture({ initiative: 2, attention: 2, responsiveness: 2, investment: 2, consistency: 2, boundaries: 2 }),
};
