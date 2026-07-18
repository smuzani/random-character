const PSUPPLICATION = 'supplication';
const PDELIVERANCE = 'deliverance';
const PREVCRIME = 'revengecrime';
const PREVFAMILY = 'revengefamily';
const PFUGITIVE = 'fugitive';
const PDISASTER = 'disaster';
const PCRUELTY = 'cruelty';
const PREVOLT = 'revolt';
const PREVOLT_WHISTLEBLOWER = 'revolt-whistle';
const PDARING = 'daringenterprise';
const PABDUCTION = 'abduction';
const PENIGMA = 'enigma';
const POBTAINING = 'obtaining';
const PENMITYKIN = 'enmityofkinsmen';
const PRIVALKIN = 'rivalryofkinsmen';
const PMURDERADULTERY = 'murderousadultery';
const PMADNESS = 'madness';
const PIMPRUDENCE = 'fatalimprudence';
const PCOINCIDENCE = 'coincidence';
const PDREAM = 'dream';
const PSACIDEAL = 'sacrificeidealism';
const PSACFAMILY = 'sacrificefamily';
const PSACPASSION = 'sacrificepassion';
const PSACNECESSARY = 'necessarysacrifice';
const PRIVALSUPERIOR = 'rivalrysuperior';
const PADULTERY = 'adultery';
const PINCEST = 'incest';
const PDISHONOURLOVE = 'dishonourloved';
const POBSTACLELOVE = 'obstaclestolove';
const PENEMYLOVE = 'enemyloved';
const PAMBITION = 'plot-ambition';
const PCONFLICTPOWER = 'conflictswithpower';
const PJEALOUS = 'mistakenjealousy';
const PERRORJUDGMENT = 'erroneousjudgement';
const PREMORSE = 'remorse';
const PRECOVERLOST = 'recoverlostone';
const PLOSSLOVE = 'losslovedone';

function plotToDesc(tag) {
  switch (tag) {
    case PSUPPLICATION:
      return randomArray([`${p.She} has committed a crime and is trying to make amends for ${p.his} actions.`,
        `${p.Sdesc} has committed a crime and is trying to make amends for ${p.his} actions. But ${p.she} is only sorry that ${p.she} got caught and will return to old tricks if given the chance.`,
        `${p.Sdesc} did a thing that alienates ${p.him} from a group. ${p.She} is later humbled for this and wants to make amends.`,
        `${p.Sdesc} is the victim of a system that is rigged against ${p.him}. It's nothing personal.`,
        `${p.She} has gone against ${p.his} group. Only ${p.his} boss can pardon ${p.him}, but at a price. Others in the group distrust ${p.him}.`,
        `${p.Sdesc} had an affair with someone and has just been exposed. ${p.She} would do anything for forgiveness.`,
        `${p.Sdesc} had an affair with someone and it has gone undiscovered, but ${p.she} feels guilty about it and tries to make amends.`,
        `${p.Sdesc} had an affair and could get away with it, but requests forgiveness as a form of spiritual tidying.`
      ]);
    case PDELIVERANCE:
      return randomArray([`${p.She} is in trouble, but thankfully someone has come to rescue ${p.him}.`,
        `${p.She} is in trouble and someone has come to rescue ${p.him}. But it turns out to be an illusion.`]);
    case PREVCRIME:
      return randomArray([`A loved one or friend has died. ${p.Sdesc} seeks revenge.`,
        `Someone abused ${p.him} or someone close to ${p.him} and ${p.she} wants revenge on them.`,
        // `Someone had close sexual contact with a person close to ${p.him}, perhaps a sister, and ${p.sdesc} seeks vengeance for it.`,
        `Someone destroyed ${p.his} reputation with slander. ${p.She} seeks revenge.`,
        `${p.Sdesc} was falsely accused of a crime. ${p.She} wants revenge on the responsible party.`,
        `Someone destroyed or stole some of ${p.sdescs} property. ${p.She} wants to make them pay for it.`,
        `${p.Sdesc} was wronged by someone of a certain gender, and has a grudge against the entire gender for it.`,
        `${p.Sdesc} was wronged by someone of a specific race, and has a grudge against that entire race.`]);
    case PREVFAMILY:
      return randomArray([`A sibling had an affair with ${p.sdescs} significant other. ${p.Sdesc} wishes vengeance.`,
        `${p.Sdesc} is in an inheritance battle with several family members over the property of a late relative. ${p.Sdesc} was wronged in this situation and wants vengeance.`,
        `${p.Sdesc} is in a bitter rivalry with a sibling over power. The sibling has betrayed ${p.him} recently and ${p.sdesc} wants vengeance.`,
        `A sibling is jealous over ${p.sdescs} life and secretly sabotages ${p.him} when given the opportunity. ${p.Sdesc} wants vengeance.`,
        `A relative desires what ${p.she} has. The relative has betrayed ${p.his} trust. Now ${p.sdesc} wants vengeance.`]);
    case PFUGITIVE:
      return randomArray([`${p.Sdesc} is a fugitive from justice, and the time is running short. ${p.She} is alone, with no friends, and nobody ${p.she} can trust.`,
        `${p.She} is a fugitive from love, possibly a dangerous relationship. ${p.She} doesn't know who ${p.she} can trust and may be fleeing with few resources.`,
        `${p.Sdesc} is exiled, but agents from whom ${p.she} fled pose danger to ${p.him}.`,
        `${p.Sdesc} is considered mad or dangerous. False rumors are spread about ${p.him}. ${p.She} is constantly bullied, under a great deal of psychological pressure, and distrusts everyone.`]);
    case PDISASTER:
      return randomArray([`A war has hit and the invader has won. The rich are robbed by the invaders. ${p.Sdesc} is a victim of the situation, facing a great loss of wealth.`,
        `A crisis has hit and the heroes have lost. This could be a war, alien invasion, zombie apocalypse, revolution. Loss of civil rights and slavery happens. Law and order breaks down, leading into anarchy before a new system comes into place. The value of human life decreases. ${p.Sdesc} is a victim of the situation, and is trying to make the best of it.`,
        `A disaster has hit, causing great loss of life. It could be a genocide or plague. ${p.Sdesc} has lost loved ones in the disaster.`,
        `A natural disaster has hit. It could be a fire, volcano, tsunami, earthquake. The world is focusing on survival.`,
        `${p.Sdesc} has dedicated ${p.his} whole life to loving someone and but recently lost the loved one.`]);
    case PCRUELTY:
      return randomArray([`${p.Sdesc} is a pawn in someone else's schemes, to be sacrificed when no longer useful.`,
        // `${p.Sdesc} is taken in and protected by supposedly friendly people, then taken advantage of, assaulted, robbed, and abused by the people who took ${p.him} in.`,
        `Someone set out to ruthlessly wound ${p.sdescs} heart.`,
        `${p.Sdesc} is desperate, but is continually robbed of hope, either casually or deliberately.`,
        // `${p.Sdesc} loses the affection of a group that ${p.she} belonged to. Groups are bonded by something. ${p.Sdesc} may have broken the unwritten rules of the group or got on the bad side of the leader. ${p.Sdesc} may need to find out why ${p.she} was isolated from the group and make amends.`,
        `Through no fault of ${p.his} own, ${p.she} is suddenly unloved by ${p.his} spouse or significant other.`,
        `${p.Sdesc} has been deprived of love because of a betrayal.`,
        `${p.Sdesc} is unjustly punished for the crimes of another.`,
        `${p.Sdesc} has made a noble sacrifice, but it goes unrewarded. Someone else takes credit for it.`,
        `${p.Sdesc} is on the opposite side of a close relative, in a war. In armor, they don't recognise each other until it is too late.`,
        `${p.Sdesc} has been split from family because of an event and meets them again on opposite sides of a conflict.`,
        `${p.Sdesc} was on opposite sides from an unrecognized family member during a conflict, but before it's too late, ${p.she} recognizes her relative. ${p.She} has averted punishment but now has to deal with the revelation.`]);
    case PREVOLT:
      return randomArray([`${p.Sdesc} is influencing other leaders to rise against a common enemy.`,
        `${p.Sdesc} is being oppressed and is fighting back.`]);
    // `${p.Sdesc} forms a union to take on the bosses and get fair treatment.`,
    // `${p.Sdesc} takes on the corrupt work unions to improve the lot of the workers.`,
    // `${p.Sdesc} is determined to revolt and take down the boss, without a fair fight.`,
    // `${p.Sdesc} is imprisoned and undergoes all kinds of mental torture but is determined to not go down without a fight.`,
    // `${p.Sdesc} is wrongly incarcerated, forced into a mental hospital, and pretends to be insane to survive the system. Many of the others are also acting insane to play along. ${p.Sdesc} tries to get them to voice their concerns.`]);
    case PREVOLT_WHISTLEBLOWER:
      return `${p.Sdesc} has discovered something wrong and makes the decision to whistleblow. Everyone is making good money but recognises the corruption. ${p.Sdesc} knows ${p.she} will be attacked, but does it for the greater good.`;
    case PDARING:
      // The bank was fully commented out at some point, which made this case
      // fall through to PABDUCTION — brave characters rendered as helpless
      // captives. Restored; the romance variant stays retired.
      return randomArray([`In a war, ${p.sdesc} proposes a bold move that is likely to fail, and could result in the loss of many good people, including ${p.sdesc}.`,
        `The clock is running down on an event, and something has to be done quickly. ${p.Sdesc} proposes doing a plan that could very well fail and make things worse, but ${p.she} has little to lose.`]);
    //   `${p.Sdesc} is attracted to a person, who is outside ${p.his} element. The beloved's family creates obstacles to the relationship. ${p.She} perseveres but is exhausted by the obstacles. ${p.She} gives up but the person starts to show interest.`]);
    case PABDUCTION:
      return randomArray([`${p.Sdesc} has been abducted and restrained, waiting for someone to rescue ${p.him}.`,
        `${p.Sdesc} has been abducted, abused, and tortured. ${p.She} is waiting for someone to rescue ${p.him}.`]);
    case PENIGMA:
      return randomArray([`An unknown situation arises. Two sides hold different beliefs about the situation, which leads to arguments and tension.`,
        `A new piece of info for an unknown situation comes into light, which contradicts past information. One party argues that the new info is false, while the other argues that the previous was wrong.`,
        `Sins from the past of one of ${p.sdescs} relatives have come back to haunt ${p.him}. ${p.She} does not even know the full story of what happened.`]);
    case POBTAINING:
      return randomArray([`${p.Sdesc} wishes to buy something, but the money must be obtained quickly, through unconventional means.`,
        `${p.Sdesc} has the rights to something, but so does someone else. A court or arbitrator has to intervene.`,
        `${p.Sdesc} wishes to obtain information about something, and has to find a way to get it.`,
        `${p.Sdesc} has met with an accident. ${p.She} struggles to get back to previous fitness levels.`,
        `${p.Sdesc} is disadvantaged, and struggles to progress. ${p.She} observes others do better. ${p.His} family puts more pressure on ${p.him}. An opportunity arrives to improve faster, but is against ${p.his} values. Taking the opportunity will change ${p.him} permanently.`]);
    case PENMITYKIN:
      return randomArray([`${p.Sdesc} is in a hostile environment, and faces increased pressure from family to carry ${p.his} weight.`,
        // `Husband-wife clash of values, with different ambitions. Each marriage is a threat to the status quo.`,
        // `On the run from thugs hired by another family member.`,
        // `A family migrates to another country. The children's attitudes towards religion and morality follows their environment and not their parents.`,
        `${p.Sdesc} has a conflict with a family member. Perhaps an in-law or spouse who grew up with different values and ambitions. Perhaps a parent, child, or sibling, who grew up in a different environment with different expectations.`]);
    case PRIVALKIN:
      return randomArray([`${p.Sdesc} has much more success than a sibling. The sibling blames their parents for it.`,
        `${p.Sdesc} has much more success than a sibling, because of a marriage. The sibline is jealous about it.`,
        `${p.Sdesc} is competing with a sibling over the same lover.`,
        `${p.Sdesc} is competing with a parent over the same lover.`]);
    case PMURDERADULTERY:
      return randomArray([`Husband is friendly toward's wife's lover, but something he says incites uncontrollable rage.`,
        `Woman plots with lover to murder husband. Divorce is out of the question.`,
        `Woman seduces man and convinces him to murder her husband.`,
        `Wife murders husband in a slow and pre-planned manner for his adultery.`]);
    case PMADNESS:
      return randomArray([`${p.Sdesc} is going mad after being left alone and lonely for so long.`,
        `${p.Sdesc} is going mad from intense pressure from work and family.`,
        `${p.Sdesc} is suspicious of something. ${p.She} sees evidence wherever ${p.she} looks, and becomes increasingly suspicious. Play with the ambiguity of the situation.`,
        // `Reality is uncertain, because everything the person believes is wrong.`,
        // `Someone loses everything - their family, their home, their wealth.`,
        `${p.Sdesc} has a sane side and an insane side. The sane side tries to control and suppress ${p.his} insane side.`]);
    case PIMPRUDENCE:
      return randomArray([`${p.Sdesc} is desperate and makes a rash move, and regrets it. But too late, because bad things have begun to happen.`,
        // `A happily married man has an affair out of boredom but things become worse.`,
        `${p.Sdesc} is desperate. A decision has to be made. The consequences of failure are clear. But under pressure, ${p.she} makes a poorly thought out, impulsive decision.`,
        // `A politician steals money to see if he can, and nobody stops him. He gets addicted to it and corrupts himself. Nobody finds out.`,
        `Friends encourage ${p.sdesc} to do something foolish. ${p.She} knows it's wrong but does so anyway.`,
        `Friends encourage ${p.sdesc} to not do something foolish. ${p.She} does it anyway.`]);
    case PCOINCIDENCE:
      return randomArray([`${p.Sdesc} is in the right place, at the wrong time and finds something unexpected.`,
        `${p.Sdesc} is in the wrong place, at the wrong time. Things go wrong.`,
        `${p.Sdesc} is in the right place, at the right time. Things go far better than expected.`]);
    case PDREAM:
      return randomArray([`${p.Sdesc} has thought long about a problem ${p.she} was stuck on, and had an epiphany in a dream.`,
        `${p.Sdesc} was stuck on something for a long time. An unexpected problem gave ${p.him} the solution ${p.she} was looking for.`]);
    case PSACIDEAL:
      return randomArray([`${p.Sdesc} holds some strong beliefs and values. Those beliefs are put to the test, with torture and hardship.`,
        // `Someone whistleblows on his organization.`,
        `${p.Sdesc} has led a life of hedonism, with little to feel dedicated to. ${p.She} discovers something worth dying for. But something new comes and threatens it, and ${p.she} must sacrifice for it.`]);
    case PSACFAMILY:
      return randomArray([`An illness creates danger for the family. Someone has to sacrifice to keep the whole family alive.`,
        // `Sacrificing her sexuality to protect her family. Prostitution to feed the family. The men may suffer guilt for not being able to prevent it.`,
        // `${p.She} must sacrifice personal ambition to take care of the family. A father may be separated from the family by taking a promotion. A mother may have to deal with gender politics, and it's accepted that she makes the sacrifice.`,
        `A friend or family member is in great danger. Someone has to sacrifice to help them.`]);
    case PSACPASSION:
      return randomArray([`Someone holding a high office in the public eye risks losing their job because of love for another. They're in a position for blackmail.`,
        `${p.Sdesc} is in love with someone who is of the wrong social class, either too rich or too poor.`,
        `${p.Sdesc} is in love with someone who is of an unacceptable ethnic class.`,
        `${p.Sdesc} is being judged for their love for someone of the same gender.`,
        `${p.Sdesc} is in love with someone who they cannot legally marry.`]);
    case PSACNECESSARY:
      return randomArray([`A loved one is severely ill and in great pain. They may have to be euthanized.`,
        `A friend or relative needs to be sacrificed to save the group. They may be slowing everyone down, or might talk under torture.`,
        `A relative or friend commits a crime. They might have to be disposed of to prevent state interference.`,
        `A deity or religious body has demanded a sacrifice of a loved one.`]);
    case PRIVALSUPERIOR:
      return randomArray([`A new person tries to challenge ${p.sdesc} for ${p.his} position. The challenger appears inferior, but they have an unexpected advantage.`,
        `An new person tries to challenge ${p.sdesc} for ${p.his} position. Societal change gives the challenger at an advantage and ${p.sdesc} must adapt to survive.`,
        `${p.Sdesc} gets into a rivalry with a superior. The superior feigns weakness, but is prepared to face ${p.him}.`,
        `${p.Sdesc} enters into a conflict with someone much better. The incumbent is arrogant but is forced to take ${p.him} seriously.`]);
    case PADULTERY:
      return randomArray([`Man has mistress. Gets bored of her, has an even younger mistress. Total of three. Discarded mistress may have ideas of revenge, or guilt.`,
        `Wife has lover, experiences guilt and remorse, ends it. Discarded lover creates problems.`]);
    case PINCEST:
      return randomArray([`Accidental crimes of love.`,
        `Fragmented family, who are split by circumstance, but don't recognize each other upon meeting again.`]);
    case PDISHONOURLOVE:
      return randomArray([`${p.Sdesc} discovers evidence that ${p.his} parent may be a war criminal.`,
        `At a family gathering, one of ${p.sdescs} relatives reveal the dark secret or betrayal of another family member.`,
        `A loved one has recently died. A dark secret from that loved one's past is revealed at the funeral or within their possessions.`,
        `${p.Sdesc} discovers a loved one's plan to betray ${p.him} later.`,
        `${p.Sdesc} discovers it was a loved one who betrayed ${p.him} earlier.`,
        `A loved one is accused of a crime. There is evidence supporting it, but the person denies it. Half of ${p.sdescs} friends and relatives side with the accused, the other half doesn't.`,]);
    case POBSTACLELOVE:
      return randomArray([// `${p.She} is homosexual, and in love with another, but society keeps them apart`,
        `Someone is in a relationship with ${p.sdesc} to climb the social ladder. ${p.She} loves the person, but feels used.`,
        `${p.Sdesc} is physically attracted to someone of an inferior status, but finds their status unattractive.`,
        `Someone of a superior status is attracted to ${p.sdesc}, but finds ${p.his} status unattractive.`,
        `${p.Sdesc} is genuinely in love with another, but the family disagrees. The love is doomed from the start.`,
        `${p.Sdesc} is is in love with someone of the social class. But one of the pair has much higher ambitions. They're perfect for each other, but may try to find better people and fail.`,
        `The perfect couple parts. One waits for the other, but loses patience and marries someone lesser. The other comes to their senses and returns, but has missed the boat.`,
        // `One seduces the other, then loses interest. But the other is obsessed.`,
        // `Different ethnicity. May be fatal (honor killing)`,
        `${p.Sdesc} is in love with another, but there are obstacles in place by enemies - exes, spouses, rivals.`,
        `${p.Sdesc} is in love with another, confides everything in a fried who uses it against ${p.him}. True love may win. Or the friend will take the lover and ${p.sdesc} will want revenge.`]);
    case PENEMYLOVE:
      return randomArray([`${p.Sdesc} is in love with someone on the enemy's side.`,
        // `A concentration camp survivor has an affair with a Nazi guard.`,
        // `A couple from warring sides fall in love. Once the war is won, one is branded a traitor.`,
        // `Someone from A kills someone from B. A falls in love with B.',
        `${p.Sdesc} falls in love with the widow(er) of someone murdered by ${p.his} faction.`]);
    case PAMBITION:
      return randomArray([`Two individuals are caught up in their ambition and one betrays the other.`,
        `${p.Sdesc} joins a competitive field, where everyone is ambitious and tries to hold ${p.him} back.`,
        `Someone's ambition is making waves. A boss tells them to cool it. The character chills at first, but later ignores this warning and faces the consequences.`]);
    case PCONFLICTPOWER:
      return randomArray([`A freed slave is kidnapped and forced into slavery.`,
        `A whistleblower fights the industry.`,
        `Gods have a great influence on the lives of mortals, who try to act against it.`,
        `Someone questions the government during a war.`]);
    case PJEALOUS:
      return randomArray([`Wife is pretty, very friendly, and open with everyone she meets.`,
        `Man suspects wife. Wife does seem to be meeting another man. She admits it when confronted, and explains the man is a friend and thought he would be jealous. She swears innocence and audience doubts it.`,
        `Rumor that begins innocently, but things get added on to it.`]);
    case PERRORJUDGMENT:
      return randomArray([`Evidence suggests that an innocent person is guilty.`,
        `The behavior of an innocent person makes others think they are guilty. Often they act that way because of something else (adultery or secrets) but not the given crime.`,
        `A person behaves in a guilty fashion to distract attention from the guilty party, such as a loved one.`,
        `Someone is wrongfully accused of a crime because of their association with a perpetrator. Often repressive regimes will arrest friends of a dissident.`,
        `Someone intended to commit a crime, but did not, and are accused. Often several suspects are about to do it, but someone else got to it first.`,
        `An innocent person thinks they are guilty, often of psychological exploitation.`,
        `A guilty person thinks they are innocent, because of torture or psychological exploitation.`,
        `A witness remains silent to protect a friend or family.`,
        `An enemy throws suspicion onto an innocent party.`,
        `A rival in love throws suspicion to a competitor.`,
        `A person struggles to reform after a miscarriage of justice.`]);
    case PREMORSE:
      return randomArray([`${p.Sdesc} feels remorse for a crime others don't know about. ${p.Sdesc} realizes the damage and heartbreak it has caused, perhaps over generations, and tries to make good of it by helping the unaware victims.`,
        `${p.Sdesc} feels remorse for a political crime. ${p.She} killed someone for a political reason and believed it was justified. As time passes, the zeal fades and ${p.she} is left with the reality that ${p.she} took a life.`,
        `${p.Sdesc} kills a parent of a child accidentally, and the death is made to look like an accident. The kids grow up to look like the parent, triggering remorse.`,
        // `Someone has a lover and they arrange to kill the husband. They marry each other later. Every night they are forced to confront what they have done.`,
        // `One partner has been unfaithful but it remains a secret. The remorse increases as the marriage gets better. They may unburden themselves which could destroy the marriage. Or repress the truth to maintain the happiness of the family.`,
        `A man desires a woman. She waits for him to say so, but the man doesn't. The love remains unspoken for years, but by then, they have moved on.`]);
    case PRECOVERLOST:
      return randomArray([`A loved one is seemingly lost forever, never to be seen again.`,
        `A person is abducted. There is a ransom demand, and that person may be executed.`,
        // `Parents or relatives try to find a child separated at birth and adopted elsewhere.`,
        `A natural disaster or war separates ${p.sdesc} from family. Communications are impossible.`]);
    case PLOSSLOVE:
      return randomArray([`After years of witnessing the anguish of a loved one, the loved one commits suicide.`,
        `${p.Sdesc} is coping with the death of a family member.`,
        `${p.Sdesc} witnesses the death of a loved one but is powerless to prevent it.`,
        `A gang/politician kills a loved one as revenge, and a warning to others not to do the same.`,
        `${p.Sdesc} discovers the death of a loved one through a third party.`]);
    default:
      return "";
  }
}

/* Who wants what from whom? What happens when they don't get it? Why now? */
function plotToObjective(tag) {
  switch (tag) {
    case PSUPPLICATION:
      return randomArray([`${p.She} has committed a crime and is trying to make amends for ${p.his} actions.`,
        `${p.Sdesc} has committed a crime and is trying to make amends for ${p.his} actions, even though ${p.she} does not feel sorry for what ${p.she} did.`,
        `${p.Sdesc} did a thing that alienates ${p.him} from a group. ${p.She} is later humbled for this and wants to make amends to the group.`,
        `${p.She} has gone against ${p.his} group. Only ${p.his} boss can pardon ${p.him}, but at a price.`,
        `${p.Sdesc} had an affair with someone and has just been exposed. ${p.She} would do anything for forgiveness.`,
        `${p.Sdesc} had an affair with someone and it has gone undiscovered, but ${p.she} feels guilty about it and tries to make amends.`,
        `${p.Sdesc} had an affair and it goes unnoticed, but ${p.she} wants forgiveness as a form of spiritual tidying.`
      ]);
    case PDELIVERANCE:
      return randomArray([`${p.She} is threatened by someone, with no way out. But someone comes along to rescue ${p.him}, to repay a past favor or as a new favor.`,
        `${p.She} is threatened by someone, with no way out. A team member, good friend, or relative rescues ${p.him}.`,
        `${p.She} is threatened by someone, with no way out. Someone appears comes along to rescue ${p.him}. But it's all an illusion and the 'rescuer' was in on it.`]);
    case PREVCRIME:
      return randomArray([`A loved one or friend has died. ${p.Sdesc} seeks revenge on the person responsible.`,
        `Someone abused ${p.him} or someone close to ${p.him} and ${p.she} wants revenge on the person responsible.`,
        // `Someone had close sexual contact with a person close to ${p.him}, perhaps a sister, and ${p.sdesc} seeks vengeance for it.`,
        `Someone destroyed ${p.his} reputation with slander. ${p.She} seeks revenge on the person responsible.`,
        `${p.Sdesc} was falsely accused of a crime. ${p.She} wants revenge on the responsible party.`,
        `Someone destroyed or stole some of ${p.sdescs} property. ${p.She} wants to make them pay for it.`,
        // `${p.Sdesc} was wronged by someone of a certain gender, and has a grudge against the entire gender for it.`,
        // `${p.Sdesc} was wronged by someone of a specific race, and has a grudge against that entire race.`
      ]);
    case PREVFAMILY:
      return randomArray([`A sibling had an affair with ${p.sdescs} significant other. ${p.Sdesc} wishes vengeance on the sibling.`,
        `${p.Sdesc} is in an inheritance battle with several family members over the property of a late relative. ${p.Sdesc} was wronged in this situation and wants vengeance on the family members.`,
        `${p.Sdesc} is in a bitter rivalry with a sibling over power. The sibling has betrayed ${p.him} recently and ${p.sdesc} wants vengeance on them.`,
        `A sibling is jealous over ${p.sdescs} life and secretly sabotages ${p.him} when given the opportunity. ${p.Sdesc} wants vengeance on the sibling.`,
        `A relative desires what ${p.she} has. The relative has betrayed ${p.his} trust. Now ${p.sdesc} wants vengeance on the relative.`]);
    case PFUGITIVE:
      return randomArray([`${p.Sdesc} is a fugitive from justice, and time is running short. ${p.She} is alone, with no friends, and nobody ${p.she} can trust. ${p.She} seeks safety.`,
        `${p.She} is a fugitive from love, possibly a dangerous relationship. ${p.She} doesn't know who ${p.she} can trust and may be fleeing with few resources. ${p.She} seeks safety.`,
        `${p.Sdesc} is exiled, but agents from whom ${p.she} fled pose danger to ${p.him}. ${p.She} doesn't know who to trust and seeks truth and justice.`,
        `${p.Sdesc} is considered mad or dangerous. False rumors are spread about ${p.him}. ${p.She} is constantly bullied, under a great deal of psychological pressure, and distrusts everyone. ${p.She} searches for an ally.`]);
    case PDISASTER:
      return randomArray([`A war has hit and the invader has won. The rich are robbed by the invaders. ${p.Sdesc} has faced a great loss of wealth. ${p.She} only wants to survive.`,
        `A crisis has hit and the heroes have lost. This could be a war, alien invasion, zombie apocalypse, revolution. Loss of civil rights and slavery happens. Law and order breaks down, leading into anarchy before a new system comes into place. The value of human life decreases. ${p.Sdesc} is a victim of the situation, and is trying to make the best of it.`,
        `A disaster has hit, causing great loss of life. It could be a genocide or plague. ${p.Sdesc} has lost loved ones in the disaster. ${p.She} is trying to rescue ${p.his} family and survive.`,
        `A natural disaster has hit. It could be a fire, volcano, tsunami, earthquake. ${p.Sdesc} is trying to survive, along with others.`,
        `${p.Sdesc} has dedicated ${p.his} whole life to loving someone and but recently lost the loved one. ${p.Sdesc} is trying to recover.`]);
    case PCRUELTY:
      return randomArray([`${p.Sdesc} is a pawn in someone else's schemes, to be sacrificed when no longer useful. ${p.She} deals with the emotions from this helpless situation.`,
        // `${p.Sdesc} is taken in and protected by supposedly friendly people, then taken advantage of, assaulted, robbed, and abused by the people who took ${p.him} in.`,
        `Someone set out to ruthlessly wound ${p.sdescs} heart. ${p.She} deals with the emotions from this helpless situation.`,
        `${p.Sdesc} is desperate, but is continually robbed of hope, either casually or deliberately. ${p.She} deals with the emotions from this helpless situation.`,
        // `${p.Sdesc} loses the affection of a group that ${p.she} belonged to. Groups are bonded by something. ${p.Sdesc} may have broken the unwritten rules of the group or got on the bad side of the leader. ${p.Sdesc} may need to find out why ${p.she} was isolated from the group and make amends.`,
        `Through no fault of ${p.his} own, ${p.she} is suddenly unloved by ${p.his} spouse or significant other. ${p.She} deals with the emotions from this helpless situation.`,
        `${p.Sdesc} has been deprived of love because of a betrayal. ${p.Sdesc} deals with the emotions from this revelation.`,
        `${p.Sdesc} is unjustly punished for the crimes of another. ${p.She} can't convince others of ${p.his} innocence or the guilt of the responsible party. ${p.She} deals with the emotions from this helpless situation.`,
        `${p.Sdesc} has made a noble sacrifice, but it goes unrewarded. Someone else takes credit for it. ${p.She} deals with the emotions of this, and the thoughts of whether it really was a noble action.`,
        `${p.Sdesc} is on the opposite side of a close relative, in a war. In armor, they don't recognise each other until it is too late. ${p.She} deals with the aftermath of ${p.his} actions.`,
        `${p.Sdesc} has been split from family because of an event and meets them again on opposite sides of a conflict. ${p.She} deals with the emotions from this revelation.`,
        `${p.Sdesc} was on opposite sides from an unrecognized family member during a conflict, but before it's too late, ${p.she} recognizes her relative. ${p.She} has averted punishment but now has to deal with the revelation.`]);
    case PREVOLT:
      return randomArray([`${p.Sdesc} is influencing other leaders to rise against a common enemy.`,
        `${p.Sdesc} is being oppressed and is fighting back.`,
        // `${p.Sdesc} forms a union to take on the bosses and get fair treatment.`,
        // `${p.Sdesc} takes on the corrupt work unions to improve the lot of the workers.`,
        `${p.Sdesc} is determined to revolt and take down the boss, without a fair fight.`,
        `${p.Sdesc} is imprisoned and undergoes all kinds of mental torture but is determined to not go down without a fight.`]);
    // `${p.Sdesc} is wrongly incarcerated, forced into a mental hospital, and pretends to be insane to survive the system. Many of the others are also acting insane to play along. ${p.Sdesc} tries to get them to voice their concerns.`]);
    case PREVOLT_WHISTLEBLOWER:
      return `${p.Sdesc} has discovered something wrong and makes the decision to whistleblow. Everyone is making good money but recognises the corruption. ${p.Sdesc} knows ${p.she} will be attacked, but does it for the greater good.`;
    case PDARING:
      // Same fall-through-to-PABDUCTION bug as the first switch; restored.
      return randomArray([`In a war, ${p.sdesc} proposes a bold move that is likely to fail, and could result in the loss of many good people, including ${p.sdesc}.`,
        `The clock is running down on an event, and something has to be done quickly. ${p.Sdesc} proposes doing a plan that could very well fail and make things worse, but ${p.she} has little to lose.`]);
    //   `${p.Sdesc} is attracted to a person, who is outside ${p.his} element. The beloved's family creates obstacles to the relationship. ${p.She} perseveres but is exhausted by the obstacles. ${p.She} gives up but the person starts to show interest.`]);
    case PABDUCTION:
      return randomArray([`${p.Sdesc} has been abducted and restrained, and is waiting for someone to rescue ${p.him}.`,
        `${p.Sdesc} has been abducted, abused, and tortured. ${p.She} is waiting for someone to rescue ${p.him}.`]);
    case PENIGMA:
      return randomArray([`An unknown situation arises. Two sides hold different beliefs about the situation, which leads to arguments and tension. ${p.Sdesc} has to discover the true situation, or act without knowing the full story.`,
        `A new piece of info for an unknown situation comes into light, which contradicts past information. One party argues that the new info is false, while the other argues that the previous was wrong. ${p.Sdesc} has to discover the true facts, or act without knowing the full story`,
        `Sins from the past of one of ${p.sdescs} relatives have come back to haunt ${p.him}. ${p.Sdesc} has to discover the true situation, or act without knowing the full story`]);
    case POBTAINING:
      return randomArray([`${p.Sdesc} wishes to buy something, but the money must be obtained quickly, through unconventional means.`,
        `${p.Sdesc} has the rights to something, but so does someone else. A court or arbitrator has to intervene.`,
        `${p.Sdesc} wishes to obtain information about something, and has to sacrifice to get it.`,
        `${p.Sdesc} has met with an accident. ${p.She} struggles to get back to previous fitness levels.`,
        `${p.Sdesc} is disadvantaged, and struggles to progress. ${p.She} observes others do better. ${p.His} family puts more pressure on ${p.him}. An opportunity arrives to improve faster, but is against ${p.his} values. Taking the opportunity will change ${p.him} permanently.`]);
    case PENMITYKIN:
      return randomArray([`${p.Sdesc} is in a hostile environment. ${p.His} family puts increased pressure on ${p.him} to carry ${p.his} weight. ${p.She} struggles to avoid disappointing ${p.his} family.`,
        `${p.Sdesc} marries someone with different ambitions. Conflicts arise with the spouse's family. ${p.Sdesc} tries to reconcile their differences.`,
        `${p.She} is on the run from thugs. They were sent by a family member, but ${p.sdesc} does not realize it. They try to maintain cordial relations within the family.`,
        `${p.Sdescs} family were migrants. The children's attitudes towards religion and morality follows their environment and not their parents. ${p.Sdesc} realizes the rift and wishes to close it.`,
        // `${p.Sdesc} has a conflict with a family member. Perhaps an in-law or spouse who grew up with different values and ambitions. Perhaps a parent, child, or sibling, who grew up in a different environment with different expectations.`
      ]);
      // todo
    case PRIVALKIN:
      return randomArray([`${p.Sdesc} has much more success than a sibling. The sibling blames their parents for it.`,
        `${p.Sdesc} has much more success than a sibling, because of a marriage. The sibline is jealous about it.`,
        `${p.Sdesc} is competing with a sibling over the same lover.`,
        `${p.Sdesc} is competing with a parent over the same lover.`]);
    case PMURDERADULTERY:
      return randomArray([`Husband is friendly toward's wife's lover, but something he says incites uncontrollable rage.`,
        `Woman plots with lover to murder husband. Divorce is out of the question.`,
        `Woman seduces man and convinces him to murder her husband.`,
        `Wife murders husband in a slow and pre-planned manner for his adultery.`]);
    case PMADNESS:
      return randomArray([`${p.Sdesc} is going mad after being left alone and lonely for so long.`,
        `${p.Sdesc} is going mad from intense pressure from work and family.`,
        `${p.Sdesc} is suspicious of something. ${p.She} sees evidence wherever ${p.she} looks, and becomes increasingly suspicious. Play with the ambiguity of the situation.`,
        // `Reality is uncertain, because everything the person believes is wrong.`,
        // `Someone loses everything - their family, their home, their wealth.`,
        `${p.Sdesc} has a sane side and an insane side. The sane side tries to control and suppress ${p.his} insane side.`]);
    case PIMPRUDENCE:
      return randomArray([`${p.Sdesc} is desperate and makes a rash move, and regrets it. But too late, because bad things have begun to happen.`,
        // `A happily married man has an affair out of boredom but things become worse.`,
        `${p.Sdesc} is desperate. A decision has to be made. The consequences of failure are clear. But under pressure, ${p.she} makes a poorly thought out, impulsive decision.`,
        // `A politician steals money to see if he can, and nobody stops him. He gets addicted to it and corrupts himself. Nobody finds out.`,
        `Friends encourage ${p.sdesc} to do something foolish. ${p.She} knows it's wrong but does so anyway.`,
        `Friends encourage ${p.sdesc} to not do something foolish. ${p.She} does it anyway.`]);
    case PCOINCIDENCE:
      return randomArray([`${p.Sdesc} is in the right place, at the wrong time and finds something unexpected.`,
        `${p.Sdesc} is in the wrong place, at the wrong time. Things go wrong.`,
        `${p.Sdesc} is in the right place, at the right time. Things go far better than expected.`]);
    case PDREAM:
      return randomArray([`${p.Sdesc} has thought long about a problem ${p.she} was stuck on, and had an epiphany in a dream.`,
        `${p.Sdesc} was stuck on something for a long time. An unexpected problem gave ${p.him} the solution ${p.she} was looking for.`]);
    case PSACIDEAL:
      return randomArray([`${p.Sdesc} holds some strong beliefs and values. Those beliefs are put to the test, with torture and hardship.`,
        // `Someone whistleblows on his organization.`,
        `${p.Sdesc} has led a life of hedonism, with little to feel dedicated to. ${p.She} discovers something worth dying for. But something new comes and threatens it, and ${p.she} must sacrifice for it.`]);
    case PSACFAMILY:
      return randomArray([`An illness creates danger for the family. Someone has to sacrifice to keep the whole family alive.`,
        // `Sacrificing her sexuality to protect her family. Prostitution to feed the family. The men may suffer guilt for not being able to prevent it.`,
        // `${p.She} must sacrifice personal ambition to take care of the family. A father may be separated from the family by taking a promotion. A mother may have to deal with gender politics, and it's accepted that she makes the sacrifice.`,
        `A friend or family member is in great danger. Someone has to sacrifice to help them.`]);
    case PSACPASSION:
      return randomArray([`Someone holding a high office in the public eye risks losing their job because of love for another. They're in a position for blackmail.`,
        `${p.Sdesc} is in love with someone who is of the wrong social class, either too rich or too poor.`,
        `${p.Sdesc} is in love with someone who is of an unacceptable ethnic class.`,
        `${p.Sdesc} is being judged for their love for someone of the same gender.`,
        `${p.Sdesc} is in love with someone who they cannot legally marry.`]);
    case PSACNECESSARY:
      return randomArray([`A loved one is severely ill and in great pain. They may have to be euthanized.`,
        `A friend or relative needs to be sacrificed to save the group. They may be slowing everyone down, or might talk under torture.`,
        `A relative or friend commits a crime. They might have to be disposed of to prevent state interference.`,
        `A deity or religious body has demanded a sacrifice of a loved one.`]);
    case PRIVALSUPERIOR:
      return randomArray([`A new person tries to challenge ${p.sdesc} for ${p.his} position. The challenger appears inferior, but they have an unexpected advantage.`,
        `An new person tries to challenge ${p.sdesc} for ${p.his} position. Societal change gives the challenger at an advantage and ${p.sdesc} must adapt to survive.`,
        `${p.Sdesc} gets into a rivalry with a superior. The superior feigns weakness, but is prepared to face ${p.him}.`,
        `${p.Sdesc} enters into a conflict with someone much better. The incumbent is arrogant but is forced to take ${p.him} seriously.`]);
    case PADULTERY:
      return randomArray([`Man has mistress. Gets bored of her, has an even younger mistress. Total of three. Discarded mistress may have ideas of revenge, or guilt.`,
        `Wife has lover, experiences guilt and remorse, ends it. Discarded lover creates problems.`]);
    case PINCEST:
      return randomArray([`Accidental crimes of love.`,
        `Fragmented family, who are split by circumstance, but don't recognize each other upon meeting again.`]);
    case PDISHONOURLOVE:
      return randomArray([`${p.Sdesc} discovers evidence that ${p.his} parent may be a war criminal.`,
        `At a family gathering, one of ${p.sdescs} relatives reveal the dark secret or betrayal of another family member.`,
        `A loved one has recently died. A dark secret from that loved one's past is revealed at the funeral or within their possessions.`,
        `${p.Sdesc} discovers a loved one's plan to betray ${p.him} later.`,
        `${p.Sdesc} discovers it was a loved one who betrayed ${p.him} earlier.`,
        `A loved one is accused of a crime. There is evidence supporting it, but the person denies it. Half of ${p.sdescs} friends and relatives side with the accused, the other half doesn't.`,]);
    case POBSTACLELOVE:
      return randomArray([// `${p.She} is homosexual, and in love with another, but society keeps them apart`,
        `Someone is in a relationship with ${p.sdesc} to climb the social ladder. ${p.She} loves the person, but feels used.`,
        `${p.Sdesc} is physically attracted to someone of an inferior status, but finds their status unattractive.`,
        `Someone of a superior status is attracted to ${p.sdesc}, but finds ${p.his} status unattractive.`,
        `${p.Sdesc} is genuinely in love with another, but the family disagrees. The love is doomed from the start.`,
        `${p.Sdesc} is is in love with someone of the social class. But one of the pair has much higher ambitions. They're perfect for each other, but may try to find better people and fail.`,
        `The perfect couple parts. One waits for the other, but loses patience and marries someone lesser. The other comes to their senses and returns, but has missed the boat.`,
        // `One seduces the other, then loses interest. But the other is obsessed.`,
        // `Different ethnicity. May be fatal (honor killing)`,
        `${p.Sdesc} is in love with another, but there are obstacles in place by enemies - exes, spouses, rivals.`,
        `${p.Sdesc} is in love with another, confides everything in a fried who uses it against ${p.him}. True love may win. Or the friend will take the lover and ${p.sdesc} will want revenge.`]);
    case PENEMYLOVE:
      return randomArray([`${p.Sdesc} is in love with someone on the enemy's side.`,
        // `A concentration camp survivor has an affair with a Nazi guard.`,
        // `A couple from warring sides fall in love. Once the war is won, one is branded a traitor.`,
        // `Someone from A kills someone from B. A falls in love with B.',
        `${p.Sdesc} falls in love with the widow(er) of someone murdered by ${p.his} faction.`]);
    case PAMBITION:
      return randomArray([`Two individuals are caught up in their ambition and one betrays the other.`,
        `${p.Sdesc} joins a competitive field, where everyone is ambitious and tries to hold ${p.him} back.`,
        `Someone's ambition is making waves. A boss tells them to cool it. The character chills at first, but later ignores this warning and faces the consequences.`]);
    case PCONFLICTPOWER:
      return randomArray([`A freed slave is kidnapped and forced into slavery.`,
        `A whistleblower fights the industry.`,
        `Gods have a great influence on the lives of mortals, who try to act against it.`,
        `Someone questions the government during a war.`]);
    case PJEALOUS:
      return randomArray([`Wife is pretty, very friendly, and open with everyone she meets.`,
        `Man suspects wife. Wife does seem to be meeting another man. She admits it when confronted, and explains the man is a friend and thought he would be jealous. She swears innocence and audience doubts it.`,
        `Rumor that begins innocently, but things get added on to it.`]);
    case PERRORJUDGMENT:
      return randomArray([`Evidence suggests that an innocent person is guilty.`,
        `The behavior of an innocent person makes others think they are guilty. Often they act that way because of something else (adultery or secrets) but not the given crime.`,
        `A person behaves in a guilty fashion to distract attention from the guilty party, such as a loved one.`,
        `Someone is wrongfully accused of a crime because of their association with a perpetrator. Often repressive regimes will arrest friends of a dissident.`,
        `Someone intended to commit a crime, but did not, and are accused. Often several suspects are about to do it, but someone else got to it first.`,
        `An innocent person thinks they are guilty, often of psychological exploitation.`,
        `A guilty person thinks they are innocent, because of torture or psychological exploitation.`,
        `A witness remains silent to protect a friend or family.`,
        `An enemy throws suspicion onto an innocent party.`,
        `A rival in love throws suspicion to a competitor.`,
        `A person struggles to reform after a miscarriage of justice.`]);
    case PREMORSE:
      return randomArray([`${p.Sdesc} feels remorse for a crime others don't know about. ${p.Sdesc} realizes the damage and heartbreak it has caused, perhaps over generations, and tries to make good of it by helping the unaware victims.`,
        `${p.Sdesc} feels remorse for a political crime. ${p.She} killed someone for a political reason and believed it was justified. As time passes, the zeal fades and ${p.she} is left with the reality that ${p.she} took a life.`,
        `${p.Sdesc} kills a parent of a child accidentally, and the death is made to look like an accident. The kids grow up to look like the parent, triggering remorse.`,
        // `Someone has a lover and they arrange to kill the husband. They marry each other later. Every night they are forced to confront what they have done.`,
        // `One partner has been unfaithful but it remains a secret. The remorse increases as the marriage gets better. They may unburden themselves which could destroy the marriage. Or repress the truth to maintain the happiness of the family.`,
        `A man desires a woman. She waits for him to say so, but the man doesn't. The love remains unspoken for years, but by then, they have moved on.`]);
    case PRECOVERLOST:
      return randomArray([`A loved one is seemingly lost forever, never to be seen again.`,
        `A person is abducted. There is a ransom demand, and that person may be executed.`,
        // `Parents or relatives try to find a child separated at birth and adopted elsewhere.`,
        `A natural disaster or war separates ${p.sdesc} from family. Communications are impossible.`]);
    case PLOSSLOVE:
      return randomArray([`After years of witnessing the anguish of a loved one, the loved one commits suicide.`,
        `${p.Sdesc} is coping with the death of a family member.`,
        `${p.Sdesc} witnesses the death of a loved one but is powerless to prevent it.`,
        `A gang/politician kills a loved one as revenge, and a warning to others not to do the same.`,
        `${p.Sdesc} discovers the death of a loved one through a third party.`]);
    default:
      return "";
  }
}

function initPlots() {
  drama.push(new Aspect("Supplication", 10, "I'll do anything if you forgive me.",
    BSINGLEPLOT, [PSUPPLICATION], [], [], [], []));
  drama.push(new Aspect("Deliverance", 10, "Somebody save me!",
    BSINGLEPLOT, [PDELIVERANCE, TDISTRESSED], [], [TBADASS, TSTRONG, TTOUGH], [], []));
  drama.push(new Aspect("Revenge following a crime", 10, "This time it's personal.",
    BSINGLEPLOT, [PREVCRIME], [], [], [], []));
  drama.push(new Aspect("Revenge within family", 10, "This time it's personal, you traitor.",
    BSINGLEPLOT, [PREVFAMILY], [], [], [], []));
  // drama.push(new Aspect("Pursued", 10, "They're after me.",
  //   BSINGLEPLOT, [PFUGITIVE], [], [], [], []));
  // drama.push(new Aspect("Disaster", 10, "Bad things happen, but what can I do?",
  //   BSINGLEPLOT, [PDISASTER], [], [], [], []));
  drama.push(new Aspect("Cruelty and Misfortune", 10, "There is nothing I can do.",
    BSINGLEPLOT, [PCRUELTY, TWOOBIE], [], [TBADASS], [], []));
  drama.push(new Aspect("Revolt", 10, "The oppressors must be stopped.",
    BSINGLEPLOT, [PREVOLT, TBRAVE], [], [TCOWARD, TPOWERFUL, TLAZY], [], []));
  // drama.push(new Aspect("Whistleblower", 2, "Revolt - whistleblower",
  //   BSINGLEPLOT, [PREVOLT_WHISTLEBLOWER], [], [], [TBRAVE, TNOBLE], [TCOWARD, TIGNOBLE]));
  drama.push(new Aspect("Daring Enterprise", 10, "It could fail, but what else do we have to lose?",
    BSINGLEPLOT, [PDARING, TBRAVE], [], [TCOWARD, TLAZY], [], []));
  // drama.push(new Aspect("Abduction", 10, "Someone has captured me and does whatever he wants to me.",
  //   BSINGLEPLOT, [PABDUCTION, TDISTRESSED], [TSUPPORT], [], [], []));
  drama.push(new Aspect("The Enigma", 10, "I must know what's going on.",
    BSINGLEPLOT, [PENIGMA], [], [], [], []));
  drama.push(new Aspect("Obtaining", 10, "We just need to get past this obstacle.",
    BSINGLEPLOT, [POBTAINING], [], [], [], []));
  drama.push(new Aspect("Enmity of Kinsmen", 10, "My brother is trying to kill me.",
    BSINGLEPLOT, [PENMITYKIN], [], [], [], []));
  // drama.push(new Aspect("Rivalry of Kinsmen", 10, "My brother wants everything I want.",
  //   BSINGLEPLOT, [PRIVALKIN], [], [], [], []));
  // drama.push(new Aspect("Murderous Adultery", 10, "I must kill my girlfriend's husband.",
  //   BSINGLEPLOT, [PMURDERADULTERY], [], [TLOYAL], [], []));
  drama.push(new Aspect("Madness", 10, "I am not in control.",
    BSINGLEPLOT, [PMADNESS], [], [TSANE], [], []));
  drama.push(new Aspect("Fatal Imprudence", 10, "I shouldn't do this, but I did and now I'm paying for it.",
    BSINGLEPLOT, [PIMPRUDENCE], [], [TWISE], [], []));
  drama.push(new Aspect("Coincidence", 10, "I'm in the right place, but at the wrong time.",
    BSINGLEPLOT, [PCOINCIDENCE], [], [], [], []));
  // drama.push(new Aspect("Dream State", 10, "I am interacting in another world, which does not seem real, but what I learned from it remains with me.",
  //   BSINGLEPLOT, [PDREAM], [], [], [], []));
  drama.push(new Aspect("Self-Sacrifice for Idealism", 10, "I know the costs, but I will do it because I have to.",
    BSINGLEPLOT, [PSACIDEAL], [], [], [], []));
  drama.push(new Aspect("Self-Sacrifice for Family", 10, "I am willing to give it all up for my loved ones.",
    BSINGLEPLOT, [PSACFAMILY], [], [], [], []));
  drama.push(new Aspect("Everything Sacrificed for Passion", 10, "I would do anything for love.",
    BSINGLEPLOT, [PSACPASSION], [], [], [], []));
  drama.push(new Aspect("Necessary Sacrifice", 10, "I love her, but she must die.",
    BSINGLEPLOT, [PSACNECESSARY], [], [], [], []));
  drama.push(new Aspect("Rivalry Between Superior and Inferior", 10, "He may be better, but will best him.",
    BSINGLEPLOT, [PRIVALSUPERIOR], [], [], [], []));
  // drama.push(new Aspect("Adultery", 10, "I betray my fiance.",
  //   BSINGLEPLOT, [PADULTERY], [], [TLOYAL], [], []));
  // drama.push(new Aspect("Incest", 10, "Incest",
  //   BSINGLEPLOT, [PINCEST], [], [], [], []));
  drama.push(new Aspect("Discovery of Dishonor of a Loved one", 10, "My father kept a dark secret.",
    BSINGLEPLOT, [PDISHONOURLOVE], [], [], [], []));
  drama.push(new Aspect("Obstacles to Love", 10, "I love him, but something is in the way.",
    BSINGLEPLOT, [POBSTACLELOVE], [], [], [], []));
  drama.push(new Aspect("An Enemy Loved", 10, "I love her, but she is the enemy.",
    BSINGLEPLOT, [PENEMYLOVE], [], [], [], []));
  drama.push(new Aspect("Ambition", 10, "I will sacrifice everything to get what I want.",
    BSINGLEPLOT, [PAMBITION], [], [], [], []));
  // drama.push(new Aspect("Conflicts With Power", 10, "I can't win this fight.",
  //   BSINGLEPLOT, [PCONFLICTPOWER], [], [], [], []));
  // drama.push(new Aspect("Mistaken Jealousy", 10, "Me vs the guy she told me not to worry about.",
  //   BSINGLEPLOT, [PJEALOUS, TJEALOUS], [], [], [], []));
  drama.push(new Aspect("Erroneous Judgment", 10, "I don't know what the right to do is, but it wasn't what I chose.",
    BSINGLEPLOT, [PERRORJUDGMENT], [], [], [], []));
  drama.push(new Aspect("Remorse", 10, "I am burdened by a past action.",
    BSINGLEPLOT, [PREMORSE], [], [], [], []));
  drama.push(new Aspect("Recovery of a Lost One", 10, "I was separated from my son, but I must find him again.",
    BSINGLEPLOT, [PRECOVERLOST], [], [], [], []));
  drama.push(new Aspect("Loss of a Loved One", 10, "My father is gone.",
    BSINGLEPLOT, [PLOSSLOVE], [], [], [], []));
}