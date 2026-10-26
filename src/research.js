/**
 * Research informs the advice, not a validated measurement or a prediction of affection.
 * Bibliographic records below are known published references. In this cloud session,
 * PubMed / Crossref / DOI endpoints were blocked by the network proxy, so online
 * verification is explicitly unconfirmed; do not describe this as a fresh review.
 */
export const researchShortNote = '建议参考关系研究，画像为本产品创作；不能据此推断对方心意。';

export const evidenceNote = '这是一份基于你观察的关系互动画像，不是经过验证的心理量表。分型、分数与阈值是产品规则，不由这些论文验证，也不能计算 TA 喜欢你的概率。研究为相处建议提供思路，不能替当事人表达心意；多项研究来自已建立关系的伴侣，应用到暧昧期需要谨慎。';

export const researchAccessNote = '以下为既有学术文献索引。本次环境的学术网站访问受限，尚未完成在线复核；可通过 DOI 链接查看原文记录。建议不是临床咨询或对任何人的人格诊断。';

export const researchSources = [
  {
    id: 'intimacy',
    title: 'Intimacy as an interpersonal process: The importance of self-disclosure, partner disclosure, and perceived partner responsiveness in interpersonal exchanges',
    authors: 'Laurenceau, J.-P., Barrett, L. F., & Pietromonaco, P. R.',
    year: 1998,
    journal: 'Journal of Personality and Social Psychology, 74(5), 1238–1251',
    url: 'https://doi.org/10.1037/0022-3514.74.5.1238',
    finding: '日常互动记录研究支持：自我表露与感到亲密有关，而“对方是否理解、认可、关心我”的回应体验，是亲密过程中的重要环节。',
    limits: '基于互动体验的研究不能把一句安慰或一次记住喜好等同于恋爱意愿；关联也不能证明某个行为必然造成亲密。',
    verifiedOnline: false,
  },
  {
    id: 'disclosure',
    title: 'Self-disclosure and liking: A meta-analytic review',
    authors: 'Collins, N. L., & Miller, L. C.',
    year: 1994,
    journal: 'Psychological Bulletin, 116(3), 457–475',
    url: 'https://doi.org/10.1037/0033-2909.116.3.457',
    finding: '元分析发现自我表露与喜欢之间存在联系，包含“更愿向喜欢的人表露”“表露者可能更受喜欢”等不同方向；作用受情境影响。',
    limits: '不是“说得越私密越容易被喜欢”的公式；不能要求对方分享隐私，也不能从聊天量推断浪漫好感。',
    verifiedOnline: false,
  },
  {
    id: 'goodnews',
    title: 'What do you do when things go right? The intrapersonal and interpersonal benefits of sharing positive events',
    authors: 'Gable, S. L., Reis, H. T., Impett, E. A., & Asher, E. R.',
    year: 2004,
    journal: 'Journal of Personality and Social Psychology, 87(2), 228–245',
    url: 'https://doi.org/10.1037/0022-3514.87.2.228',
    finding: '分享好消息以及感受到积极、建设性的回应，与更好的情绪和关系体验有关。具体追问、共同庆祝，是可用于练习的回应方式。',
    limits: '研究不意味着每次都必须热烈回应；文化、个体习惯和当时精力会影响表达，也不能凭回应风格判断谁更爱谁。',
    verifiedOnline: false,
  },
  {
    id: 'novel',
    title: "Couples' shared participation in novel and arousing activities and experienced relationship quality",
    authors: 'Aron, A., Norman, C. C., Aron, E. N., McKenna, C., & Heyman, R. E.',
    year: 2000,
    journal: 'Journal of Personality and Social Psychology, 78(2), 273–284',
    url: 'https://doi.org/10.1037/0022-3514.78.2.273',
    finding: '研究考察了伴侣共同参与新鲜、有趣活动与关系质量的联系，部分实验为短期关系体验的改善提供了证据。',
    limits: '主要对象是已有关系的伴侣，不能保证陌生人或 Crush 因一起做新鲜的事而心动；新鲜感不需要危险、昂贵或违背意愿。',
    verifiedOnline: false,
  },
  {
    id: 'conflict',
    title: 'What type of communication during conflict is beneficial for intimate relationships?',
    authors: 'Overall, N. C., & McNulty, J. K.',
    year: 2017,
    journal: 'Current Opinion in Psychology, 13, 1–5',
    url: 'https://doi.org/10.1016/j.copsyc.2016.03.002',
    finding: '综述强调沟通效果取决于问题性质、严重程度与改变可能性；没有适合所有冲突的单一沟通技巧，重要问题可能需要清楚、直接地讨论。',
    limits: '来自亲密关系的结论不能机械迁移到所有暧昧互动；直接表达不等于施压、贬低或逼迫。遭到持续越界时，不应只靠调整话术解决。',
    verifiedOnline: false,
  },
];

export const researchPrinciples = {
  initiative: {
    concept: '互相开启交流',
    explanation: '观察是否有双向表达与接续话题，而不只统计谁回得快。表露与喜欢的联系不等于发消息越多越好。',
    references: ['disclosure'],
  },
  attention: {
    concept: '被理解的体验',
    explanation: '记住细节、理解需要可作为关心的线索，但友好和浪漫关注可能重叠。具体问问对方喜欢怎样被关心，比自行猜测更可靠。',
    references: ['intimacy'],
  },
  responsiveness: {
    concept: '回应与情绪承接',
    explanation: '分享小事时，可以试着追问具体细节；对方表达烦恼时，先问“想让我听听，还是一起想办法？”这是练习建议，不是论文验证的固定话术。',
    references: ['intimacy', 'goodnews'],
  },
  investment: {
    concept: '共同经历与具体行动',
    explanation: '尝试双方都愿意、轻松可退出的小活动，把“改天”变成能讨论的计划。共同新鲜体验的研究主要来自伴侣，不能保证发展成恋爱。',
    references: ['novel'],
  },
  consistency: {
    concept: '互动节奏与期待沟通',
    explanation: '把几次互动放在一起观察，直接谈谈双方舒服的联系节奏；不把忙碌或回复慢自动理解成冷淡。这里的稳定性指标是产品观察规则，不是文献量表。',
    references: ['conflict'],
  },
  boundaries: {
    concept: '意愿与边界',
    explanation: '允许彼此拒绝、休息与有不同意见是基本前提。边界被反复忽视时，优先减少消耗、寻求支持，不能用其他互动高分抵消。',
    references: ['conflict'],
  },
};
