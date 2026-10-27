// Captions, crops and scene descriptions explicitly match the four observed-behaviour options.
// The images illustrate a scenario; repeated behaviour is established by the answer text.
export const storySheets = {
  messages: { width: 1536, height: 1024, splitX: 768, splitY: 454 },
  coffee: { width: 1536, height: 1024, splitX: 768, splitY: 486 },
  crowd: { width: 1536, height: 1024, splitX: 768, splitY: 512 },
  news: { width: 1536, height: 1024, splitX: 768, splitY: 512 },
  calendar: { width: 1536, height: 1024, splitX: 768, splitY: 512 },
  activity: { width: 1536, height: 1024, splitX: 768, splitY: 512 },
};
const scene = (theme, index, dialogue, caption, description) => ({ theme, index, dialogue, caption, description });
export const choiceScenes = {
  'messages-0': scene('messages',0,'我：今天怎么样？','不同的日子，开场的还是我','夜晚分处两地，我在桌前主动发消息；TA 在另一端看书，没有主动开启话题。'),
  'messages-1': scene('messages',1,'TA：那份资料能发我吗？','有具体事情，才打开聊天框','TA 面前摊着作业和电脑，拿手机向我询问资料；联系围绕具体事务。'),
  'messages-2': scene('messages',2,'TA：刚刚遇到一只猫！','把生活里的一小片，分享给你','TA 在路边拍下一只小猫，把照片发来；我在家收到这一件日常小事。'),
  'messages-3': scene('messages',3,'TA：今天在忙什么？','没什么正事，也会来找你聊聊','我们各自在家，TA 主动开了一个轻松的话题，聊天自然来回。'),
  'coffee-0': scene('coffee',0,'我：是明天，不是下周呀。','提过的重要安排，也又忘了','小店桌边，我指着考试日程再提醒一次；TA 看着另一页日历有些疑惑。'),
  'coffee-1': scene('coffee',1,'TA：明天面试加油！喝冰的吗？','重要的记得，小喜好还不熟','TA 记得我的面试安排并为我加油，但拿着冰饮询问我平时的口味。'),
  'coffee-2': scene('coffee',2,'TA：你上次说喜欢热可可。','先想起了，你随口提的小喜好','我们在柜台前看菜单，TA 主动提起我喜欢热可可，还没有替我购买。'),
  'coffee-3': scene('coffee',3,'TA：按你的口味，选了热的。','记得的细节，变成了小安排','TA 已经选好我喜欢的温热饮品并递给我，记住口味后也付诸行动。'),
  'crowd-0': scene('crowd',0,'TA 正在和别的朋友聊天。','聚会很热闹，还没特意找到我','一桌朋友在聚会，TA 面向其他朋友交谈，我坐在桌边，没有被特意接入话题。'),
  'crowd-1': scene('crowd',1,'TA：大家都喝点吧。','对我很好，对其他人也一样','TA 站在朋友中间，给包括我在内的几个人递同样的饮料，均等地关照大家。'),
  'crowd-2': scene('crowd',2,'TA：刚才你说到哪了？','主动坐近，接住我没说完的话','朋友们仍在背景聊天，TA 把注意转向我，在桌边主动听我继续讲。'),
  'crowd-3': scene('crowd',3,'TA：再一起走一段？','又一次散场后，故事还在继续','店门外其他朋友挥手离开，TA 主动和我并肩多走一段，继续聊天。'),
  'news-0': scene('news',0,'TA：说起我那件事……','我的小开心，很快换了频道','我举着完成的项目想分享开心，TA 转而拿起自己的工作资料，把话题带回自己。'),
  'news-1': scene('news',1,'TA：恭喜呀！','收到一句祝贺，话题停在这里','我展示完成的作品，TA 微笑着竖起拇指表示祝贺，没有继续追问细节。'),
  'news-2': scene('news',2,'TA：后来怎么做到的？','认真追问，愿意听我展开讲讲','TA 放下自己的事，和我一起看作品，认真问细节，我继续分享经过。'),
  'news-3': scene('news',3,'TA：这件事，值得庆祝一下。','当时认真听，后来也记得','画面分成当时与后来：先认真听我分享，之后用两杯果汁和一块小蛋糕一起庆祝。'),
  'calendar-0': scene('calendar',0,'TA：这次去不了。','几次邀约，都没有再约时间','我拿着邀约和周末安排，TA 礼貌拒绝；之前的邀请也没有落实为其他日期。'),
  'calendar-1': scene('calendar',1,'TA：有空再约呀。','说着改天，日历上仍然空着','我们在街边聊天，TA 友好地说改天再约，但日历上还没有选定哪一天。'),
  'calendar-2': scene('calendar',2,'TA：周六三点，可以。','认真回应，把见面写进日历','我们一起看日历，TA 确认一个具体的空闲时段，我用笔把计划记下来。'),
  'calendar-3': scene('calendar',3,'TA：周六没空，周日呢？','原来的时间不行，主动再找一天','TA 原来的日期有工作安排，于是主动指向另一天，和我商量替代时间。'),
  'activity-0': scene('activity',0,'我：这次，还是自己去。','双人计划未落实，先过好自己的周末','我独自拿票走到展馆门前，之前的共同活动提议仍未落实，也没有替代安排。'),
  'activity-1': scene('activity',1,'TA：你定好叫我就行。','两个人的活动，一个人在做安排','我在桌上摊开路线、地图和预约单安排全程；TA 在旁看手机，没有一起规划。'),
  'activity-2': scene('activity',2,'地点我来选，时间一起对。','一份计划里，终于有两个人的笔迹','我们围桌看地图，各自提出地点和时间，用两支笔一起协调安排。'),
  'activity-3': scene('activity',3,'TA：下次换我来安排。','这次你带路，下次换我提议','两个时点串起共同活动：这次我拿票带路，下一次 TA 主动拿出自己的行程并一起参加。'),
};
export function sceneCrop(key) {
  const entry = choiceScenes[key];
  if (!entry) return null;
  const sheet = storySheets[entry.theme];
  const right = entry.index % 2 === 1;
  const bottom = entry.index >= 2;
  return { x: right ? sheet.splitX : 0, y: bottom ? sheet.splitY : 0,
    width: right ? sheet.width - sheet.splitX : sheet.splitX,
    height: bottom ? sheet.height - sheet.splitY : sheet.splitY };
}
