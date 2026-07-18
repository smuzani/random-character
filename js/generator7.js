/**
 * @fileoverview V7 of the generator, now with procedurally generated content.
 *
 * Will be deprecated for V8, once content is always from from server.
 */

"use strict";

// const BROLE = 'role';
const BPERSONALITY = 'personality';
const BTEAMONE = 'team-one';
const BSINGLEPLOT = 'single-plot'; // only one plot
const BTHREEACT = 'three-act'; // three act structure
const BSEVENBASIC = 'seven-basic'; // seven basic plots
const BWANT = 'want';

class Character {
  constructor(initialTags, initialBranches = [BPERSONALITY, BPERSONALITY]) {
    // compare against t.excludes for new roll
    if (initialTags === undefined) {
      this.tags = new Set();
    } else {
      this.tags = new Set(initialTags);
    }

    // compare against t.tags for new roll
    this.excludes = new Set();

    // All of this are rolled to generate character. Not unique.
    this.branches = initialBranches;

    // Tracks aspects applied to this character
    this.aspects = [];
  }
}

class Aspect {
  constructor(name, weight, text,
              type, tags, requirements, excludes,
              branchRequirements, branchExcludes) {
    this.name = name;
    this.weight = weight;
    this.text = text;
    this.type = type;

    // Tags are added to char, and must match character's excludes
    this.tags = new Set(tags);

    // These two must match with existing character
    this.requirements = new Set(requirements);
    this.excludes = new Set(excludes);

    // These two must match with future characters on a search
    this.branchRequirements = new Set(branchRequirements);
    this.branchExcludes = new Set(branchExcludes);
  }
}

let aspects = [];
let soloTeam = [];
let drama = [];
let want = [];

function initAspects() {
  aspects.push(new Aspect("Team Mom", 1, "Supportive and nurturing. The team will defend them violently if anything happens",
    BPERSONALITY, [TNURTURER, TCARING, TLOVED, TDEFENDED, TWISE], [TFACE], [TRUTHLESS, BTEAMONE], [], []));
  aspects.push(new Aspect("Team Mom", 1, "Supportive and nurturing. The team will defend them violently if anything happens",
    BPERSONALITY, [TNURTURER, TCARING, TSTERN, TLOVED, TDEFENDED, TWISE], [TFACE], [TRUTHLESS, BTEAMONE], [], []));
  aspects.push(new Aspect("Broken Bird", 1, "The character was once deeply damaged by a tragedy. Perhaps they tried to be a hero and failed, or were abused. They try to cope by being as cynical, stoic, or badass as possible.",
    BPERSONALITY, [TTRAUMA, TCOLD, TANGST, TCYNICAL, TBADASS], [TFACE], [TWARM, TIDEALISTIC, TBUTTMONKEY], [], []));
  aspects.push(new Aspect("All Loving Hero", 1, "The character is extremely idealistic. They love everyone, even those who hate them. They will repay cruelty with kindness, and anger with calm.",
    BPERSONALITY, [TNURTURER, TCARING, THEART, TIDEALISTIC], [TFACE], [TRUTHLESS, TCOLD, TCYNICAL, TANGST], [], []));
  aspects.push(new Aspect("Guile Hero", 1, "Character is very intelligent and doesn't easily fall for tricks and traps set up by their rivals. They're charismatic in a gentlemanly way, to the point where their charisma is like a physical force. They have ambitious goals and often succeed in style.",
    BPERSONALITY, [TSMART, TSTREETSMART, TMANIPULATIVE, TCHARISMATIC, TBADASS, TAMBITIOUS], [TFACE], [TNAIVE, TUNCHARISMATIC, TBUTTMONKEY, TLAZY, TMYOPIC], [], []));
  aspects.push(new Aspect("The Captain", 1, "The character is a commanding officer of their team. They have people to report to, but are in full command of the team. They're often in charge of a vessel. Also keeps a journal, either for work or personal purposes.",
    BPERSONALITY, [TLEADER, TCOMMANDER, TVESSEL, TEXPOSITION, TMIDDLEMANAGER], [TFACE], [BTEAMONE], [], []));
  aspects.push(new Aspect("A Father to His Men", 1, "A commander who cares deeply for the team, appreciating every team member",
    BPERSONALITY, [TLEADER, TCARING, TCOMMANDER], [TFACE], [TRUTHLESS, BTEAMONE], [], []));
  aspects.push(new Aspect("The Heart", 1, "The character is more introverted and pacifist than the rest of the team. They are caring, often helping to keep the team together.",
    BPERSONALITY, [THEART, TINTROVERT, TPACIFIST], [TFACE], [TRUTHLESS, TTALKATIVE, TRUTHLESS, TMEAN, THAM], [], []));
  aspects.push(new Aspect("Team Dad", 1, "The character is a little more mature than the rest of the team. They're a disciplinarian, but is noble and leads by example.",
    BPERSONALITY, [TLEADER, TSTERN], [TFACE], [TIGNOBLE, BTEAMONE], [], []));

  aspects.push(new Aspect("Corrupt Corporate Executive", 6, "Character is a senior manager/CEO who tries to make as much money and power as possible, not caring who gets hurt.",
    BPERSONALITY, [TPOWERFUL, TRUTHLESS, TGREEDY, TCOMMANDER, TRICH], [THEEL], [TASCETIC, TBUTTMONKEY, TCARING, TPOOR, TBUTTMONKEY, BTEAMONE], [], []));
  aspects.push(new Aspect("Alpha Bitch", 3, "Character is the alpha bitch of a posse. May have a tough jerk boyfriend, who acts as her muscle. Manipulative. Hard to hurt because she's part of a rich family and a higher social status.",
    BPERSONALITY, [TMANIPULATIVE, TRICH, TBITCH, THATED, TPOSSE], [THEEL, TFEMALE], [TNAIVE, TPOOR, TLOVABLE, TBUTTMONKEY, BTEAMONE], [], []));
  // V7.6: ungendered half of the Alpha Bitch archetype (from bolt), so it
  // survives "No gender stereotypes"
  aspects.push(new Aspect("Alpha Bully", 3, "Character is the top dog of a posse. Manipulative, and hard to hurt because they come from money and a higher social status.",
    BPERSONALITY, [TMANIPULATIVE, TRICH, TBITCH, THATED, TPOSSE], [THEEL], [TNAIVE, TPOOR, TLOVABLE, TBUTTMONKEY, TFEMALE, BTEAMONE], [], []));
  aspects.push(new Aspect("Monster of the Week", 7, "Character is a one-shot villain. At the end of the story, the character will either be destroyed, or repent.",
    BPERSONALITY, [TDISPOSABLE, TBOSS], [THEEL], [TNECESSARY], [], []));
  // V7.6: absorbed The Man Behind the Man — same archetype, this is the on-list name
  aspects.push(new Aspect("Greater-Scope Villain", 7, "The character is the real main villain. More powerful, well connected, and intelligent, they have bigger plans than the lesser villains he bosses around.",
    BPERSONALITY, [TMANIPULATIVE, TMYSTERIOUS, TLAZY, TBOSS], [THEEL], [TNAIVE, TTALKATIVE, TDETERMINED, TBUTTMONKEY, BTEAMONE], [], []));
  aspects.push(new Aspect("Evil Overlord", 1, "Character is an evil overlord. They have an intimidating fortress, and a sizeable army, willing or unwilling. They have plans to take over the world. Can be a king, dictator, CEO. Often the most powerful of his forces, and far more competent than their next in command.",
    BPERSONALITY, [TPOWERFUL, TAMBITIOUS, TBOSS, TCOMMANDER, THATED, TDREADED], [THEEL], [TLOVED, TLOVABLE, TNAIVE, TLAZY, TBUTTMONKEY, BTEAMONE], [], []));
  aspects.push(new Aspect("The Starscream", 1, "The character resents being under their current boss. Ambitious and individualistic. Plans to overthrow the big guy everyone else fears and take his place. Often resents praising and agreeing to the boss. Sometimes opposes the boss's plans. But is highly competent enough for the boss to keep around despite the risk of betrayal.",
    BPERSONALITY, [TTREACHEROUS, TAMBITIOUS, TINDIVIDUALISTIC, TBADASS, TCONTRARIAN, TNECESSARY], [THEEL], [TLOYAL, TLAZY, TTEAMPLAYER, TDISPOSABLE, BTEAMONE], [], []));
  aspects.push(new Aspect("Evil Genius", 1, "Character is very intelligent, a genius with technical and engineering. But not very politically or financially savvy.",
    BPERSONALITY, [TSMART, TNAIVE, TTECHIE], [THEEL], [TMANIPULATIVE], [], []));
  aspects.push(new Aspect("Evil Genius", 1, "Character is a brilliant military commander, but not very politically or financially savvy.",
    BPERSONALITY, [TSMART, TNAIVE, TTACTICIAN], [THEEL], [TMANIPULATIVE], [], []));
  aspects.push(new Aspect("Psycho For Hire", 1, "They absolutely love battle and violence. Has a signature weapon. Flashy, and likely to play sadistically with their enemies. Their main role is as a hired gun, where they can get paid to do what they love.",
    BPERSONALITY, [TSADIST, TARROGANT, TDREADED, TVIOLENT, TBOSS], [THEEL], [TPACIFIST, THUMBLE, TLOVED, TBUTTMONKEY, TSWEET, TSTERN], [], []));
  // V7.6: absorbed The Fake Cutie — same archetype, this is the on-list name
  aspects.push(new Aspect("Bitch in Sheep's Clothing", 5, "Character is sweet and cute on the surface. But it's an act to hide their intelligence, true self, or jealousy towards another. Often manipulative and dangerous to those who know what they're really like.",
    BPERSONALITY, [TMANIPULATIVE, TSWEET], [THEEL], [TNAIVE, TSTERN], [], []));
  aspects.push(new Aspect("Bitch in Sheep's Clothing", 2, "Character is sweet and cute on the surface. But it's an act to hide their intelligence, true self, or jealousy towards another. Often manipulative and dangerous to those who know what they're really like.",
    BPERSONALITY, [TJEALOUS, TSWEET], [THEEL], [TNAIVE, TSTERN], [], []));
  aspects.push(new Aspect("Dark Messiah", 1, "Character wants to save the world, and is willing to die to do so. But they use underhanded tactics and other acts of radical terrorism.",
    BPERSONALITY, [TDISHONORABLE, TGOODCAUSE], [THEEL], [THONORABLE, TLAZY], [], []));
  aspects.push(new Aspect("The Dark Chick", 1, "Character is empathic, understanding emotions well. But they use that skill to manipulate others. They don't care for the well-being of others, and experts at sowing discord. They're often hard to get rid of because they integrate themselves into their social ladder so well. Her motivations are slightly different to that of the other characters.",
    BPERSONALITY, [TMANIPULATIVE, TRUTHLESS, TATTRACTIVE, TNURTURER, TNECESSARY], [THEEL, TFEMALE], [TNAIVE, TUGLY], [], []));
  aspects.push(new Aspect("Magnificent Bastard", 1, "Character is very intelligent and doesn't easily fall for tricks and traps set up by their rivals. They're charismatic in a gentlemanly way, to the point where their charisma is like a physical force. They have ambitious goals and often succeed in style.",
    BPERSONALITY, [TSMART, TSTREETSMART, TMANIPULATIVE, TCHARISMATIC, TBADASS, TAMBITIOUS], [THEEL], [TNAIVE, TUNCHARISMATIC, TBUTTMONKEY, TLAZY, TMYOPIC], [], []));

  aspects.push(new Aspect("Butt Monkey", 17, "Character is the butt monkey of the team, the one everyone makes fun of and doesn't expect to save the day.",
    BPERSONALITY, [TBUTTMONKEY, TUNLUCKY], [TSUPPORT], [TBADASS, BTEAMONE, TSTERN], [], []));
  aspects.push(new Aspect("Cloudcuckoolander", 13, "The character is off the rails crazy. Nobody takes them seriously. They either have mental issues or have seen too much. But sometimes they just might be right.",
    BPERSONALITY, [TINSANE, TEXPOSITION], [TSUPPORT], [TSTERN], [], []));
  aspects.push(new Aspect("Mook", 9, "This is a lesser character who's probably going to die and be forgotten.",
    BPERSONALITY, [TDISPOSABLE], [TSUPPORT], [TNECESSARY, BTEAMONE], [], []));
  aspects.push(new Aspect("Red Shirt", 1, "This is a lesser character who's probably going to die and be forgotten.",
    BPERSONALITY, [TDISPOSABLE], [TSUPPORT], [TNECESSARY, BTEAMONE], [], []));
  aspects.push(new Aspect("Damsel in Distress", 6, "The character is trapped under their circumstances, kept prisoner, or lost. They await a rescuer, but may rescue themselves if lucky.",
    BPERSONALITY, [TDISTRESSED], [TSUPPORT, TFEMALE], [], [], []));
  aspects.push(new Aspect("Distressed Dude", 1, "The character is trapped under their circumstances, kept prisoner, or lost. They await a rescuer, but may rescue themselves if lucky.",
    BPERSONALITY, [TDISTRESSED], [TSUPPORT, TMALE], [], [], []));
  aspects.push(new Aspect("The Ace", 8, "Character is extremely good at what they do. They're usually a benchmark that there's always someone better. Might be a mentor, or just a rival that the hero has to overcome.",
    BPERSONALITY, [TBADASS, TACE], [TSUPPORT], [TBUTTMONKEY, TBADFIGHTER], [], []));
  aspects.push(new Aspect("The Chick", 1, "Character is supportive and nurturing to the team. They don't really seem to do much else, though.",
    BPERSONALITY, [THEART, TCARING, TNURTURER, TSWEET], [TSUPPORT, TFEMALE], [TRUTHLESS, TMEAN, BTEAMONE, TARROGANT, TSTERN, TSNARKY], [], []));
  aspects.push(new Aspect("Troll", 6, "Character is a bully who delights in the pain of others. They often bait people into fights and attacks.",
    BPERSONALITY, [TSADIST, TMEAN, TMANIPULATIVE], [TSUPPORT], [TSWEET, TWARM, TLOVABLE], [], []));
  aspects.push(new Aspect("Dirty Coward", 7, "Character is completely self-serving, dedicated to their own survival. They will abandon someone who just rescued them. They play any dirty trick they can, but complain when it's used against them. Not very competent either.",
    BPERSONALITY, [TDISHONORABLE, TINDIVIDUALISTIC, TCOWARD, TBITCH], [TSUPPORT], [THONORABLE, TTEAMPLAYER, TLOVABLE, TBADASS], [], []));
  aspects.push(new Aspect("Elite Mook", 1, "Character is very skilled and intimidating, but will likely die and be forgotten.",
    BPERSONALITY, [TBADASS, TDISPOSABLE], [TSUPPORT], [TBUTTMONKEY, TNECESSARY, TBADFIGHTER], [], []));
  aspects.push(new Aspect("The Load", 1, "Character is dead weight who makes things harder for everyone else. Often they play on the sympathy of others to help them.",
    BPERSONALITY, [TBITCH, TLOAD, TNECESSARY], [TSUPPORT], [TDISPOSABLE, TAMBITIOUS], [], []));
  aspects.push(new Aspect("Obstructive Bureaucrat", 1, "The character has a moderate amount of bureaucratic power and tries to make it difficult for others.",
    BPERSONALITY, [TBUREAUCRAT, TOBSTRUCTIVE, TBITCH], [TSUPPORT], [TCOMMANDER, TLOVABLE, BTEAMONE], [], []));
  aspects.push(new Aspect("Mysterious Backer", 1, "The character is someone very powerful who backs the main heroes, for whatever purpose. They often provide support and protection against the main villain.",
    BPERSONALITY, [TRICH, TMANIPULATIVE, TALLY, TMYSTERIOUS, TLAZY], [TSUPPORT], [TPOOR, TNAIVE, BTEAMONE], [], []));
  aspects.push(new Aspect("The Imp", 1, "Someone who can cause a lot of trouble, but is usually just too lazy or apathetic to do so. They often act as a companion or annoying advisor., UNISEX",
    BPERSONALITY, [TBADASS, TLAZY, TCONTRARIAN], [TSUPPORT], [TYESMAN], [], []));
  aspects.push(new Aspect("Commander Contrarian", 1, "The character actively pokes holes in the plans of other people, opposing them, and complain about everything they do.",
    BPERSONALITY, [TCONTRARIAN, TBITCH], [TSUPPORT], [TLOVABLE, BTEAMONE], [], []));

  aspects.push(new Aspect("Genki Girl", 6, "Extremely energetic. Doesn't stop talking, to the point of being annoying.",
    BPERSONALITY, [TENERGETIC, TTALKATIVE], [TFEMALE], [TINTROVERT, TLAZY, TLETHARGIC, TSTERN], [], []));
  aspects.push(new Aspect("Keet", 1, "Extremely energetic character. Doesn't stop talking, to the point of being annoying.",
    BPERSONALITY, [TENERGETIC, TTALKATIVE], [TMALE], [TINTROVERT, TLAZY, TLETHARGIC, TSTERN], [], []));
  aspects.push(new Aspect("Only Sane Man", 11, "They are very rational, with a realistic assessment of the situation and their own strengths and weaknesses. The character might have a little contempt towards the crazy team they find themselves in.",
    BPERSONALITY, [TSANE], [], [TNAIVE], [], []));
  aspects.push(new Aspect("Too Dumb to Live", 11, "Character is a complete idiot. Prone to getting into trouble because of this. They don't utilize safety precautions and often taunt dangerous animals and people.",
    BPERSONALITY, [TNAIVE, TUNLUCKY], [], [TGENRESAVVY, TLUCKY], [], []));
  aspects.push(new Aspect("Blood Knight", 10, "They absolutely love battle. They're quick to pick fights, often encouraging violent resolution over peaceful ones. Sometimes they even shiver with bloodlust.",
    BPERSONALITY, [TVIOLENT, TAGGRESSIVE], [], [TPACIFIST], [], []));
  aspects.push(new Aspect("Well Intentioned Extremist", 3, "The character is very dedicated to a noble cause. Only problem is that they're willing to do anything, to achieve it, including torture, murder, and child labor.",
    BPERSONALITY, [TGOODCAUSE, TBADMEANS, TMYOPIC], [], [TBADCAUSE, TGOODMEANS, TLAZY, TWISE], [], []));
  aspects.push(new Aspect("Well Intentioned Extremist", 3, "The character is very dedicated to a cause. Their reasoning is noble, but the goal isn't. For example, a man whose goal is to make the neighborhood safe, by putting them under the protection of a local gang.",
    BPERSONALITY, [TGOODMEANS, TBADCAUSE, TMYOPIC], [], [TBADMEANS, TGOODCAUSE, TLAZY, TWISE], [], []));
  aspects.push(new Aspect("Well Intentioned Extremist", 2, "The character is very dedicated to a noble cause. Only problem is that they don't pay attention to the consequences. For example, they may try to overthrow a cruel tyrant, without caring that it would just create a power vacuum for an even worse tyrant.",
    BPERSONALITY, [TGOODCAUSE, TGOODMEANS, TMYOPIC], [], [TGOODCAUSE, TGOODMEANS, TLAZY, TWISE], [], []));
  aspects.push(new Aspect("Well Intentioned Extremist", 1, "The character is very dedicated to a noble cause. Only problem is that they're straight up delusional and it's all a part of their imagination.",
    BPERSONALITY, [TPOINTLESSCAUSE, TMYOPIC], [], [TBADCAUSE, TGOODCAUSE, TLAZY, TWISE], [], []));
  aspects.push(new Aspect("The Smart Guy", 1, "The character is gifted with technology and engineering. They're often the person on the team who builds and repairs devices.",
    BPERSONALITY, [TSMART, TTECHIE], [], [], [], []));
  // aspects.push(new Aspect("The Smart Guy", 1, "The character actively experiments with new things. They are gifted in inventing new items that helps out their team.",
  //   BPERSONALITY, [TSMART, TINVENTOR], [], [], [], []));
  aspects.push(new Aspect("The Smart Guy", 1, "The character is more aware of the world than others. They're often the ones who create the plans and direct the missions. They're the ones who spend their time analyzing the weaknesses of the enemy. They're the ones who can spot traps, when things are going suspicious, or expose parts of the plot that isn't obvious to their teammates.",
    BPERSONALITY, [TSMART, TGENRESAVVY, TTACTICIAN], [], [TNAIVE], [], []));
  aspects.push(new Aspect("The Smart Guy", 1, "The character is street smart. They know to outsmart and convince foes and enemies. They're also skilled in investigation, finding intel, convincing people to admit things they otherwise wouldn't.",
    BPERSONALITY, [TSMART, TSTREETSMART, TINVESTIGATOR, TEXPOSITION], [], [TNAIVE], [], []));
  aspects.push(new Aspect("The Smart Guy", 1, "The character is wise, more level-headed, able to think their way around problems too big to solve.",
    BPERSONALITY, [TSMART, TWISE], [], [TNAIVE], [], []));
  aspects.push(new Aspect("The Smart Guy", 1, "The character is a little geekier looking than most. People think they're the smart one, but they're really quite average.",
    BPERSONALITY, [TNERD], [], [], [], []));
  aspects.push(new Aspect("The Big Guy", 1, "The character is big, probably the largest in the team. They are rugged and gruff, with a few scars to show for the battles they've been in. They're loyal and one of the best fighters in the team, but not necessarily the best.",
    BPERSONALITY, [TBIG, TCOLD, TTOUGH, TLOYAL, TSTRONG], [], [TSMALL, TWARM, TWEAK, TTREACHEROUS], [], []));
  aspects.push(new Aspect("The Big Guy", 1, "The character is big, probably the largest in the team. They are often cuddly and lovable, but you don't want to push them too far. Often the most level-headed of the group, they're the one who splits up fights and keeps everyone together. But just because they're nice, it doesn't make them a pushover.",
    BPERSONALITY, [TBIG, TLOVABLE, THEART, TTOUGH, TLOYAL, TSTRONG], [], [TSMALL, TBITCH, TMEAN, TSADIST, TWEAK, TTREACHEROUS], [], []));
  aspects.push(new Aspect("The Big Guy", 1, "The character is big, probably the largest in the team. They are loud and often fun to be around.",
    BPERSONALITY, [TBIG, TLOVABLE, THAM, TTOUGH, TLOYAL, TSTRONG], [], [TSMALL, TBITCH, TMEAN, TWEAK, TTREACHEROUS, TINTROVERT, TSHY], [], []));
  aspects.push(new Aspect("The Big Guy", 1, "The character is big, probably the largest in the team. They great fighters, but they're also one of the smartest people on the team.",
    BPERSONALITY, [TBIG, TSMART, TTOUGH, TSTRONG], [], [TSMALL, TNAIVE, TWEAK], [], []));
  aspects.push(new Aspect("The Big Guy", 1, "The character appears fairly unintimidating, whether they're just cute or small. But they're often the strongest member on their team.",
    BPERSONALITY, [TSMALL, TTOUGH, TSTRONG], [], [TWEAK, TBIG], [], []));
  aspects.push(new Aspect("The Big Guy", 1, "The character appears fairly unintimidating, whether they're just cute or small. But they're often the strongest member on their team.",
    BPERSONALITY, [TSWEET, TTOUGH, TSTRONG], [], [TWEAK, TBIG, TSNARKY], [], []));
  aspects.push(new Aspect("The Big Guy", 1, "The character is big, probably the largest in the team. They are unimaginative bullies, not useful for anything else, but others keep them around because they're useful in a fight.",
    BPERSONALITY, [TBIG, TAGGRESSIVE, TVIOLENT, TSTRONG], [], [TSMALL, TWEAK, TPACIFIST], [], []));
  // aspects.push(new Aspect("The Lancer", 8, "The character is often second best on their team. They're the jack of all trades, able to fill up any role that the others don't.",
  // 	BPERSONALITY, [], [], [], [], []));
  aspects.push(new Aspect("The Leader", 1, "The character is often the face of their team. They are quite good looking, charismatic, able to inspire and lead. They usually hold the team together.",
    BPERSONALITY, [TLEADER, TCHARISMATIC], [], [TUNCHARISMATIC], [], []));
  aspects.push(new Aspect("The Leader", 1, "The character is often the face of their team. They have clear goals from the start, and rely on intelligence and tactics to save the day.",
    BPERSONALITY, [TLEADER, TTACTICIAN], [], [TNAIVE, TTACTICLESS, TMYOPIC], [], []));
  aspects.push(new Aspect("The Leader", 1, "The character is often the face of their team. They are mature, and level-headed, able to rally the team when things go bad.",
    BPERSONALITY, [TLEADER, TWISE], [], [TNAIVE, TMYOPIC], [], []));
  aspects.push(new Aspect("The Leader", 1, "The character is often the face of their team. They are the most outspoken and outgoing member of the group. They're not any smarter or better, but often inspires the team with their bravery and persistence.",
    BPERSONALITY, [TLEADER, TBRAVE], [], [TCOWARD], [], []));

  aspects.push(new Aspect("Nice Guy", 20, "Genuinely nice and gets along with others",
    BPERSONALITY, [TLONGFUSE, TWARM], [TFACE], [TSNARKY, TMEAN, TSHORTFUSE], [], []));
  aspects.push(new Aspect("Jerk With a Heart of Gold", 14, "This character is a cruel asshole on the outside. But underneath the surface, there are some redeeming qualities.",
    BPERSONALITY, [TMEAN, TNOBLE], [TFACE], [TWARM, TSWEET, TIGNOBLE, TLOVABLE], [], []));
  aspects.push(new Aspect("What the Hell Hero", 12, "The character is willing to do deeds that violate their moral values every now and then.",
    BPERSONALITY, [TIGNOBLE, TRUTHLESS], [TFACE], [], [], []));
  aspects.push(new Aspect("Plucky Girl", 1, "This character is determined and optimistic. Often cheerful. You can beat them but not break them.",
    BPERSONALITY, [TDETERMINED, TIDEALISTIC, TWARM], [TFACE], [TLAZY, TCYNICAL, TMEAN, TSNARKY], [], []));
  aspects.push(new Aspect("For Great Justice", 1, "Fights against evil for justice, righteousness, principles and values that depend more on what people deserve than on what they enjoy.",
    BPERSONALITY, [TGOOD], [TFACE], [TEVIL], [], []));

  aspects.push(new Aspect("Ax-Crazy", 15, "This character is an insane and sadistic person who enjoys murder and mutilation.",
    BPERSONALITY, [TSADIST, TVIOLENT], [THEEL], [TPACIFIST], [], []));
  aspects.push(new Aspect("Affably Evil", 8, "This character is evil but extremely polite and likeable. They may be benevolent bosses to their minions. They seem like any other normal person. They may even try to nicely convince their enemies not to oppose them. If turned down, they'll give clear reminders of their villainous nature.",
    BPERSONALITY, [TEVIL, TSWEET, TRUTHLESS], [THEEL], [TSNARKY, TGOODCAUSE, TMEAN, TARROGANT], [], []));
  aspects.push(new Aspect("Knight Templar", 3, "This character is narcisisstic and always believes they are right. They are quick to judge others but refuse all judgement on themselves. They believe that fate handed them a means for inflicting punishment upon evil, and punish the weak.",
    BPERSONALITY, [TBADCAUSE, TBADMEANS, TARROGANT, TRUTHLESS, TMYOPIC], [THEEL], [TLOVABLE, TGOODCAUSE, TGOODMEANS, TTEAMPLAYER, TSWEET, TWARM, THUMBLE, TLAZY, TCARING], [], []));
  aspects.push(new Aspect("Knight Templar", 2, "This character is narcisisstic and always believes they are right. They are quick to judge others but refuse all judgement on themselves. They believe that fate handed them a means for inflicting punishment upon evil, and punish the weak.",
    BPERSONALITY, [TGOODCAUSE, TARROGANT, TRUTHLESS, TMYOPIC], [THEEL], [TLOVABLE, TBADCAUSE, TTEAMPLAYER, TSWEET, TWARM, THUMBLE, TLAZY, TCARING], [], []));
  aspects.push(new Aspect("Knight Templar", 1, "This character is narcisisstic and always believes they are right. They are quick to judge others but refuse all judgement on themselves. They believe that fate handed them a means for inflicting punishment upon evil, and punish the weak.",
    BPERSONALITY, [TPOINTLESSCAUSE, TARROGANT, TRUTHLESS, TMYOPIC], [THEEL], [TLOVABLE, TGOODCAUSE, TBADCAUSE, TTEAMPLAYER, TSWEET, TWARM, THUMBLE, TLAZY, TCARING], [], []));
  aspects.push(new Aspect("Smug Snake", 7, "This character is arrogant and cocky, to both enemies and allies.",
    BPERSONALITY, [TARROGANT, TBITCH], [THEEL], [THUMBLE, TLOVABLE], [], []));
  aspects.push(new Aspect("The Dreaded", 11, "This is character is dreaded by others. Their name is used as a boogeyman. They may have taken the trouble to develop this reputation, often attacking in stealthy, underhanded manners.",
    BPERSONALITY, [TDREADED, TMYSTERIOUS], [THEEL], [TBUTTMONKEY, TLOVABLE], [], []));
  aspects.push(new Aspect("For The Evulz", 7, "Character is evil for its own purpose. There is no deeper meaning and they can't be reasoned with. Perhaps they are trolls, or enjoy destruction. Perhaps they treat it as a kind of sport to excel in.",
    BPERSONALITY, [TEVIL], [THEEL], [TGOOD, TNEUTRAL], [], []));
  aspects.push(new Aspect("Humanitarian", 5, "Character enjoys the taste of human flesh.",
    BPERSONALITY, [TCANNIBAL], [THEEL], [TVEGAN], [], []));

  // split based on roles
  aspects.push(new Aspect("Jerkass", 4, "The character is a straight up jerk who is cruel and delights in the pain of others. If he hangs out with good guys, they tolerate him for a reason.",
    BPERSONALITY, [TMEAN, TSADIST, TNECESSARY], [TFACE], [TWARM, TSWEET, TPACIFIST, TDISPOSABLE, TLOVABLE], [], []));
  aspects.push(new Aspect("Jerkass", 8, "The character is a straight up jerk who is cruel and delights in the pain of others. If he hangs out with good guys, they tolerate him for a reason.",
    BPERSONALITY, [TMEAN, TSADIST, TNECESSARY], [TSUPPORT], [TWARM, TSWEET, TPACIFIST, TDISPOSABLE, TLOVABLE], [], []));
  aspects.push(new Aspect("Jerkass", 8, "The character is a straight up jerk who is cruel and delights in the pain of others. If he hangs out with good guys, they tolerate him for a reason.",
    BPERSONALITY, [TMEAN, TSADIST, TNECESSARY], [THEEL], [TWARM, TSWEET, TPACIFIST, TDISPOSABLE, TLOVABLE], [], []));

  aspects.push(new Aspect("Deadpan Snarker", 19, "They often make snarky quips with a straight face.",
    BPERSONALITY, [TSNARKY], [], [TOBVIOUS, TWARM, TSWEET], [], []));
  aspects.push(new Aspect("Large Ham", 13, "This character is GRANDOISE. They're AWESOME people to have in the room. They say whatever comes to mind, and not only call out the fucking elephant in the room, but do it in front of everyone. EXPECT THEM TO TALK AS LOUD AS THEY LIKE.",
    BPERSONALITY, [THAM], [], [THUMBLE], [], []));
  aspects.push(new Aspect("Beware the Nice Ones", 9, "They are normally pleasant people. But when pushed too hard, they tend to burst into anger.",
    BPERSONALITY, [TLONGFUSE, TBERSERKBUTTON], [TWARM], [TMEAN, TSHORTFUSE], [], []));
  aspects.push(new Aspect("Berserk Button", 18, "This character is normally calm, but certain things can drive them into a berserk rage.",
    BPERSONALITY, [TBERSERKBUTTON], [], [TWARM], [], [])); // excludes nice ones
  // V7.6: the old tagless Catch-Phrase variants were invisible (aspect text
  // never renders); their situations live on as tagToPortrayal variants of
  // TCATCHPHRASE.
  aspects.push(new Aspect("Catch-Phrase", 5, "Character has a catch-phrase.",
    BPERSONALITY, [TCATCHPHRASE], [], [], [], []));
  aspects.push(new Aspect("Papa Wolf", 8, "Character is fiercely, almost violently protective of their child or a child-like figure.",
    BPERSONALITY, [TDEFENDER], [TMALE], [BTEAMONE], [], []));
  aspects.push(new Aspect("Mama Bear", 7, "Character is fiercely, almost violently protective of their child or a child-like figure.",
    BPERSONALITY, [TDEFENDER], [TFEMALE], [BTEAMONE], [], []));
  aspects.push(new Aspect("Determinator", 12, "This character is extremely stubborn and determined. They are unstoppable as long as they are not dead.",
    BPERSONALITY, [TDETERMINED], [], [TLAZY], [], []));
  aspects.push(new Aspect("Manipulative Bastard", 11, "This character is an expert in manipulating emotions, perspectives, and psychology.",
    BPERSONALITY, [TSMART, TSTREETSMART, TMANIPULATIVE, TRUTHLESS], [], [TNAIVE, BTEAMONE], [], []));
  aspects.push(new Aspect("Darker and Edgier", 10, "This character is serious, cynical, edgy, and gritty.",
    BPERSONALITY, [TCYNICAL, TSTOIC], [], [TIDEALISTIC, TWARM, THOTBLOODED], [], []));
  aspects.push(new Aspect("The Woobie", 8, "The character is in trouble and needs help.",
    BPERSONALITY, [TWOOBIE, TDISTRESSED], [], [TDREADED, TBOSS], [], []));
  aspects.push(new Aspect("Blatant Lies", 13, "This character has no issues with straight up lying, without having to cushion or justify the lie.",
    BPERSONALITY, [TLIAR], [], [THONEST, THONORABLE], [], []));
  aspects.push(new Aspect("The Stoic", 9, "This character shows little reaction to extreme things, like injury or disaster. They may break this facade with very rare things, like a death.",
    BPERSONALITY, [TSTOIC], [], [THOTBLOODED, TWARM, TSWEET], [], []));
  aspects.push(new Aspect("Ensemble Dark Horse", 7, "This character has a little trait that makes people underestimate them. For example, they might be small but strong, or come from an evil background but be heroic.",
    BPERSONALITY, [TLOVABLE, THIDDENDEPTHS], [], [THATED, TBOSS], [], []));
  aspects.push(new Aspect("Captain Obvious", 1, "They say really obvious things. Useful as the exposition guy to a story.",
    BPERSONALITY, [TOBVIOUS, TEXPOSITION], [], [], [], []));
  aspects.push(new Aspect("Tsundere", 2, "They are harsh outwardly, but soft and sweet deep inside.",
    BPERSONALITY, [TMEAN, TDERE], [], [TWARM, TSWEET], [], []));
  aspects.push(new Aspect("Tsundere", 3, "They are harsh outwardly, but soft and sweet deep inside.",
    BPERSONALITY, [TCOLD, TDERE], [], [TWARM, TSWEET], [], []));
  aspects.push(new Aspect("Tsundere", 2, "They are harsh outwardly, but soft and sweet deep inside.",
    BPERSONALITY, [TSTERN, TDERE], [], [TWARM, TSWEET], [], []));
  aspects.push(new Aspect("Badass Normal", 7, "They seem very normal on the outside, but have trained themselves to be unexpectedly badass.",
    BPERSONALITY, [TBADASS], [], [TBUTTMONKEY, TBADFIGHTER], [], []));
  aspects.push(new Aspect("Adorkable", 1, "Character is shy and socially inept. It makes them adorable.",
    BPERSONALITY, [TINTROVERT, TLOVABLE], [], [TTALKATIVE, TCYNICAL, THATED, TMEAN, TSTERN, THAM], [], []));
  aspects.push(new Aspect("Chessmaster", 7, "This character is an expert in manipulating events, situations, and circumstances to suit their plans. They often plan events to happen in a certain order, that others may not anticipate. They also have several layers of backup and misdirection.",
    BPERSONALITY, [TSMART, TTACTICIAN, TAMBITIOUS], [], [TNAIVE, TTACTICLESS, TMYOPIC], [], []));
  aspects.push(new Aspect("Big Eater", 7, "This character eats more than the rest of his team combined.",
    BPERSONALITY, [TEATER], [], [], [], []));
  aspects.push(new Aspect("Hot Blooded", 6, "This character is extremely emotional, whether it's a positive or negative spectrum.",
    BPERSONALITY, [THOTBLOODED, TDETERMINED], [], [TSTOIC], [], []));
  aspects.push(new Aspect("It's All About Me", 9, "Character is egoistic and feels the whole world revolves around them.",
    BPERSONALITY, [TINDIVIDUALISTIC], [], [TTEAMPLAYER], [], []));
  aspects.push(new Aspect("Genre Savvy", 1, "The character has good situational awareness, which they may have learned from stories and movies.",
    BPERSONALITY, [TGENRESAVVY], [], [TNAIVE], [], []));
  aspects.push(new Aspect("Big Brother Instinct", 8, "This character is protective of some other smaller or younger character.",
    BPERSONALITY, [TDEFENDER], [], [], [], []));
  aspects.push(new Aspect("Undying Loyalty", 7, "The character is extremely loyal. They may not be a Yes Man, though.",
    BPERSONALITY, [TLOYAL], [], [TTREACHEROUS], [], []));
  aspects.push(new Aspect("Yandere", 3, "This person is sweet on the outside, but crazy on the inside. They're often obsessed with something they love. They can also be possessive and psychotically jealous.",
    BPERSONALITY, [TVIOLENT, TSWEET, TOBSESSED], [], [TPACIFIST, TSNARKY], [], []));
  aspects.push(new Aspect("Yandere", 2, "This person is sweet on the outside, but crazy on the inside. They're often obsessed with something they love. They can also be possessive and psychotically jealous.",
    BPERSONALITY, [TVIOLENT, TSWEET, TJEALOUS], [], [TPACIFIST, TSNARKY], [], []));
  aspects.push(new Aspect("Obfuscating Stupidity", 1, "This character acts dumber than they are, usually to avoid being targeted or to have others underestimate them.",
    BPERSONALITY, [TFAKEDITZ, TMANIPULATIVE], [], [TNAIVE], [], []));
  aspects.push(new Aspect("Combat Pragmatist", 6, "This character is willing to do anything in a fight. They are not restricted to chivalry or any other rules to engage fairly.",
    BPERSONALITY, [TDISHONORABLE], [], [THONORABLE], [], []));
  aspects.push(new Aspect("Made of Iron", 5, "This character is much tougher than they look. They're not invincible, but they have a boxer's physique.",
    BPERSONALITY, [TTOUGH], [], [TWEAK], [], []));
  aspects.push(new Aspect("Stalker With a Crush", 5, "This character is stalking another character they have a crush on. This may be creepy or cute depending on the circumstances.",
    BPERSONALITY, [TOBSESSED], [], [], [], []));
  aspects.push(new Aspect("Honor Before Reason", 1, "This character is extremely honorable, and willing to stick to their values even when it is illogical.",
    BPERSONALITY, [THONORABLE], [], [TDISHONORABLE], [], []));
  aspects.push(new Aspect("Munchausen's By Proxy", 1, "This character is faking a condition. It might be for sympathy, for money, or even to troll others.",
    BPERSONALITY, [TATTENTION], [TDISTRESSED], [TBADASS], [], []));
  aspects.push(new Aspect("Never My Fault", 8, "This character absolutely refuses to accept responsibility for their mistakes. They'll push the blame to others all the time.",
    BPERSONALITY, [TNOTMYFAULT], [], [TSELFBLAMING], [], []));
  aspects.push(new Aspect("More Dakka", 1, "This character solves problems with more violence.",
    BPERSONALITY, [TMOREDAKKA], [TVIOLENT], [TPACIFIST], [], []));
  aspects.push(new Aspect("Green Eyed Monster", 6, "This character is easily jealous.",
    BPERSONALITY, [TJEALOUS], [], [], [], []));
  // aspects.push(new Aspect("Jerkass Woobie", 5, "This character is a sadistic, cruel jerk. But they use it as a cover, for a softer damaged part inside.",
  //   BPERSONALITY, [TMEAN, TWOOBIE, TDISTRESSED], [], [TSWEET, TWARM], [], []));
  aspects.push(new Aspect("Femme Fatale", 1, "This character is dangerous and sexy. Others notice the dangerous part of them, but they're too distracted by the sexy part to care.",
    BPERSONALITY, [TSEXY, TMANIPULATIVE, TCHARISMATIC, TCLASSY, TATTRACTIVE], [TFEMALE], [TUGLY, TNAIVE, THUMBLE], [], []));
  aspects.push(new Aspect("Lovable Rogue", 1, "Character breaks the law for their own personal profit, but is nice and likeable. They may be a legitimate criminal who is opposing an uncaring world. Or they may do enough good to be likeable.",
    BPERSONALITY, [TLOVABLE, TINDIVIDUALISTIC, TROGUE, TCHARISMATIC], [], [TUNCHARISMATIC], [], []));
  aspects.push(new Aspect("The Casanova", 1, "Attracts lots of women and sleeps with them. ",
    BPERSONALITY, [TCHARISMATIC, TATTRACTIVE, TSEXER], [TMALE], [TUNCHARISMATIC], [], []));
  aspects.push(new Aspect("Walking The Earth", 1, "Constantly travelling. No home, no job, no identification, no friends, no visible means of support.",
    BPERSONALITY, [TWALKINGTHEEARTH], [TMALE, BTEAMONE], [TFOLLOWER, TLOVED], [], []));
  aspects.push(new Aspect("Kuudere", 1, "Cold outside, sweet inside.",
    BPERSONALITY, [TSTOIC, TDERE], [], [TSWEET], [], []));
  aspects.push(new Aspect("Dandere", 1, "Asocial outside, sweet inside.",
    BPERSONALITY, [TINTROVERT, TDERE], [], [TSWEET, TSTERN, THAM], [], []));
  aspects.push(new Aspect("Caretaker", 1, "They have someone to take care of when the rest of the family passes the ball. May have angst related to this.",
    BPERSONALITY, [TCARETAKER, TANGST], [], [], [], []));
  aspects.push(new Aspect("Badass Pacifist", 1, "This character is an actual pacifist. They are able to take extreme beatings or dodge extremely effectively. They often win in the end, without fighting.",
    BPERSONALITY, [TPACIFIST, TBADASS], [], [TBUTTMONKEY, TVIOLENT], [], []));
  aspects.push(new Aspect("The Klutz", 1, "Character is unusually clumsy.",
    BPERSONALITY, [TCLUMSY], [], [], [], []));
  aspects.push(new Aspect("Is This What Anger Feels Like", 1, "Very polite when angry",
    BPERSONALITY, [TPOLITEANGER], [], [TBERSERKBUTTON], [], []));
  aspects.push(new Aspect("Vegan", 1, "Vegan",
    BPERSONALITY, [TVEGAN], [], [TCANNIBAL], [], []));
  // aspects.push(new Aspect("Stoic Woobie", 1, "This character is scarred by a situation, but shows no emotion about it.",
  //   BPERSONALITY, [TSTOIC, TWOOBIE, TDISTRESSED], [], [TSWEET, TWARM], [], []));
  aspects.push(new Aspect("True Neutral", 1, "Doesn't take sides whether for good or evil.",
    BPERSONALITY, [TNEUTRAL], [], [TEVIL, TGOOD], [], []));

  // V7.6: Overdosed Tropes expansion. Weights are round(wicks / 2000) capped
  // at 20, from tvtropes.org/pmwiki/pmwiki.php/JustForFun/OverdosedTropes.
  aspects.push(new Aspect("Big Bad", 20, "The main villain of the story. Everything bad traces back to them.",
    BPERSONALITY, [TBOSS, TDREADED, TRUTHLESS, TAMBITIOUS, TPOWERFUL], [THEEL], [TDISPOSABLE, TFOLLOWER, TWEAK, TNAIVE, TBUTTMONKEY, BTEAMONE], [], []));
  aspects.push(new Aspect("The Dragon", 13, "The boss's right hand and enforcer. The last obstacle before the real villain.",
    BPERSONALITY, [TENFORCER, TBADASS, TLOYAL, TVIOLENT, TNUMBERTWO], [THEEL], [TLEADER, TBOSS, TTREACHEROUS, TPACIFIST, TWEAK], [], []));
  aspects.push(new Aspect("Even Evil Has Standards", 12, "A villain with a line they will not cross, and contempt for those who do.",
    BPERSONALITY, [TSTANDARDS], [THEEL], [TNOLINES, TSADIST], [], []));
  aspects.push(new Aspect("Action Girl", 12, "A capable, hard-hitting fighter who needs no rescuing.",
    BPERSONALITY, [TBADASS, TBRAVE, TSTRONG], [TFEMALE], [TBADFIGHTER, TWEAK, TDISTRESSED, TCOWARD], [], []));
  aspects.push(new Aspect("Hidden Depths", 12, "There is far more to this character than the surface suggests.",
    BPERSONALITY, [THIDDENDEPTHS], [], [], [], []));
  aspects.push(new Aspect("Disproportionate Retribution", 12, "Any slight, however small, is answered with overwhelming payback.",
    BPERSONALITY, [TVINDICTIVE, TSHORTFUSE], [], [TLONGFUSE, TPACIFIST], [], []));
  aspects.push(new Aspect("Mad Scientist", 10, "A brilliant researcher unburdened by ethics boards.",
    BPERSONALITY, [TMADSCIENCE, TTECHIE, TSMART], [], [TNAIVE], [], []));
  aspects.push(new Aspect("Would Hurt a Child", 10, "A villain with no lines at all. Nothing is off the table.",
    BPERSONALITY, [TNOLINES, TRUTHLESS], [THEEL], [TSTANDARDS, TSWEET, TWARM, THONORABLE, TPACIFIST], [], []));
  aspects.push(new Aspect("Dark and Troubled Past", 9, "A tragedy in their history still shapes everything they do.",
    BPERSONALITY, [TTRAUMA, TANGST, TCYNICAL], [], [TIDEALISTIC, TNAIVE], [], []));
  aspects.push(new Aspect("Hypocrite", 9, "Preaches standards they never hold themselves to.",
    BPERSONALITY, [THYPOCRITE], [], [THONEST], [], []));
  aspects.push(new Aspect("Bad Boss", 8, "Treats their own underlings as punching bags or worse.",
    BPERSONALITY, [TBADBOSS, TMEAN, TBOSS], [THEEL], [TWARM, TSWEET, TCARING, TFOLLOWER, BTEAMONE], [], []));
  aspects.push(new Aspect("Freudian Excuse", 8, "Their villainy has a reason, and the reason is a wound.",
    BPERSONALITY, [TFREUDIANEXCUSE, TTRAUMA], [THEEL], [], [], []));
  aspects.push(new Aspect("Anti-Hero", 8, "On the right side, with all the wrong methods.",
    BPERSONALITY, [TCYNICAL, TBADASS, TDISHONORABLE, TGOODCAUSE], [TFACE], [TIDEALISTIC, TSWEET, THONORABLE, TPACIFIST], [], []));
  aspects.push(new Aspect("The Hero", 8, "The brave, determined protagonist who carries the story.",
    BPERSONALITY, [TBRAVE, TGOODCAUSE, TLEADER, TDETERMINED], [TFACE], [TCOWARD, TEVIL, TLAZY], [], []));
  aspects.push(new Aspect("Reasonable Authority Figure", 8, "The one in charge who actually listens and acts sensibly.",
    BPERSONALITY, [TREASONABLE, TWISE, TPOWERFUL], [TSUPPORT], [TOBSTRUCTIVE, TINSANE, TEVIL, TNAIVE], [], []));
  aspects.push(new Aspect("Comically Missing the Point", 8, "Reliably walks away from every conversation with the wrong lesson.",
    BPERSONALITY, [TOBLIVIOUS], [], [TSMART, TWISE, TGENRESAVVY], [], []));
  aspects.push(new Aspect("Sanity Slippage", 7, "They are coming apart, slowly enough that nobody has called it yet.",
    BPERSONALITY, [TUNRAVELING], [], [TSANE], [], []));
  aspects.push(new Aspect("The Mole", 7, "Secretly working for the other side.",
    BPERSONALITY, [TMOLE, TTREACHEROUS, TLIAR], [], [TLOYAL, THONEST], [], []));
  aspects.push(new Aspect("The Atoner", 7, "Trying to make up for a past wrong that still defines them.",
    BPERSONALITY, [TATONER, TSELFBLAMING], [], [TNOTMYFAULT, TEVIL], [], []));
  aspects.push(new Aspect("Anti-Villain", 7, "A villain with noble qualities and sympathetic goals.",
    BPERSONALITY, [TNOBLE, TGOODCAUSE, TBADMEANS], [THEEL], [TEVIL, TSADIST, TPETTY], [], []));
  aspects.push(new Aspect("Worthy Opponent", 6, "An enemy who fights with honor and respects the other side.",
    BPERSONALITY, [TWORTHYFOE, THONORABLE], [THEEL], [TDISHONORABLE, TTREACHEROUS, TPETTY, TSADIST], [], []));
  aspects.push(new Aspect("Tranquil Fury", 6, "Their anger arrives quietly, which makes it far more frightening.",
    BPERSONALITY, [TTRANQUILFURY, TLONGFUSE], [], [TSHORTFUSE, THAM, THOTBLOODED], [], []));
  aspects.push(new Aspect("Faux Affably Evil", 6, "The politeness is a predator's mask, and everyone can feel it.",
    BPERSONALITY, [TMANIPULATIVE, TSADIST, TCHARISMATIC], [THEEL], [TWARM, TSWEET, THONEST, TUNCHARISMATIC], [], []));
  aspects.push(new Aspect("Serial Killer", 6, "They kill, repeatedly, by pattern and compulsion.",
    BPERSONALITY, [TSERIALKILLER, TVIOLENT, TCREEPY], [THEEL], [TPACIFIST, TGOODMEANS], [], []));
  aspects.push(new Aspect("Trademark Favorite Food", 6, "There is one food they are never far from.",
    BPERSONALITY, [TFAVORITEFOOD], [], [], [], []));
  aspects.push(new Aspect("Hate Sink", 6, "Built to be loathed. No redeeming charm, no cool factor.",
    BPERSONALITY, [TBITCH, TMEAN, TPETTY], [THEEL], [TLOVABLE, TCHARISMATIC, TBADASS], [], []));
  aspects.push(new Aspect("Shipper on Deck", 6, "The team matchmaker, forever nudging two people together.",
    BPERSONALITY, [TMATCHMAKER], [], [TCOLD, TMEAN], [], []));
  aspects.push(new Aspect("Older Than They Look", 6, "Their face and their birthday disagree by a decade or more.",
    BPERSONALITY, [TOLDERTHANLOOKS], [], [], [], []));
  aspects.push(new Aspect("Big Good", 6, "The anchor of the side of good — the one everyone rallies behind.",
    BPERSONALITY, [TBIGGOOD, TWISE, TLEADER, TGOODCAUSE], [TSUPPORT], [TEVIL, TMEAN, TFOLLOWER, BTEAMONE], [], []));
  aspects.push(new Aspect("The Ditz", 6, "Sweet-natured and reliably clueless, whatever their hair color.",
    BPERSONALITY, [TNAIVE], [], [TSMART, TWISE, TGENRESAVVY, TTACTICIAN], [], []));
  aspects.push(new Aspect("The Rival", 6, "Defined by the race to beat one particular person.",
    BPERSONALITY, [TRIVAL, TAMBITIOUS, TDETERMINED], [], [TLAZY], [], []));
  aspects.push(new Aspect("Crazy-Prepared", 6, "Has a contingency plan for scenarios nobody else imagined.",
    BPERSONALITY, [TPREPARED, TTACTICIAN], [], [TTACTICLESS, TNAIVE, TLAZY], [], []));
  aspects.push(new Aspect("Hair-Trigger Temper", 6, "Always one small provocation away from an explosion.",
    BPERSONALITY, [TSHORTFUSE, TAGGRESSIVE], [], [TLONGFUSE, TSTOIC, TPOLITEANGER], [], []));
  aspects.push(new Aspect("Brutal Honesty", 6, "Tells the unvarnished truth, comfort be damned.",
    BPERSONALITY, [TBLUNT, THONEST], [], [TLIAR, TMANIPULATIVE], [], []));
  aspects.push(new Aspect("Omnicidal Maniac", 6, "Wants everything gone. Not ruled — gone.",
    BPERSONALITY, [TEVIL, TVIOLENT, TINSANE, TDREADED], [THEEL], [TPACIFIST, TSTANDARDS, TGOODCAUSE], [], []));
  aspects.push(new Aspect("Dark Is Not Evil", 6, "Looks like the villain, acts like the kindest person in the room.",
    BPERSONALITY, [TDARKNOTEVIL, TWARM], [TFACE], [TEVIL, TMEAN], [], []));
  aspects.push(new Aspect("Manchild", 5, "An adult running on playground instincts.",
    BPERSONALITY, [TMANCHILD], [], [TWISE, TSTERN, TCLASSY], [], []));
  aspects.push(new Aspect("The Sociopath", 5, "Cold, calculating, and empty where the empathy should be.",
    BPERSONALITY, [TRUTHLESS, TMANIPULATIVE, TCOLD], [THEEL], [TWARM, TCARING, TSELFBLAMING], [], []));
  aspects.push(new Aspect("Stepford Smiler", 5, "The smile is permanent, and load-bearing.",
    BPERSONALITY, [TSTEPFORD, TSWEET], [], [TSTOIC, TMEAN, TBLUNT], [], []));
  aspects.push(new Aspect("Shrinking Violet", 5, "Painfully shy; closes up entirely when approached.",
    BPERSONALITY, [TSHY, TINTROVERT, TINSECURE], [], [THAM, TTALKATIVE, TCHARISMATIC], [], []));
  aspects.push(new Aspect("The Alcoholic", 5, "The bottle is a fixture of their life, admitted or not.",
    BPERSONALITY, [TALCOHOLIC], [], [], [], []));
  aspects.push(new Aspect("The Chosen One", 5, "Destiny picked them, ready or not.",
    BPERSONALITY, [TCHOSENONE, TNECESSARY], [TFACE], [TDISPOSABLE], [], []));
  aspects.push(new Aspect("Evil Is Petty", 5, "Grand villainy, small-minded cruelty.",
    BPERSONALITY, [TPETTY, TMEAN], [THEEL], [TWORTHYFOE, THONORABLE], [], []));

  // V7.6 borderline calls, in by default per checkpoint review
  aspects.push(new Aspect("Evil Counterpart", 9, "The hero's dark mirror — same gifts, opposite compass.",
    BPERSONALITY, [TEVIL, TBADASS, TRIVAL], [THEEL], [TWEAK, TBADFIGHTER], [], []));
  aspects.push(new Aspect("Ms. Fanservice", 8, "Deliberately, unapologetically easy on the eyes.",
    BPERSONALITY, [TSEXY, TATTRACTIVE], [TFEMALE], [TUGLY], [], []));
  aspects.push(new Aspect("One-Man Army", 6, "Alone, they are the strategic asset.",
    BPERSONALITY, [TBADASS, TSTRONG, TTOUGH], [], [TWEAK, TBADFIGHTER, TPACIFIST], [], []));
  aspects.push(new Aspect("Happily Married", 6, "Home holds someone they love, and it shows.",
    BPERSONALITY, [TMARRIED, TLOVED], [], [TLONER, TSEXER], [], []));
  aspects.push(new Aspect("Skewed Priorities", 6, "Focuses on exactly the wrong detail of every crisis.",
    BPERSONALITY, [TSKEWEDPRIORITIES], [], [TWISE, TSANE], [], []));
  aspects.push(new Aspect("Not So Above It All", 6, "The sensible one — until the nonsense looks fun enough.",
    BPERSONALITY, [TSANE, TLOVABLE], [], [TSTOIC, TSTERN], [], []));
  aspects.push(new Aspect("Lightning Bruiser", 6, "Fast, strong, and durable all at once. It isn't fair.",
    BPERSONALITY, [TSTRONG, TENERGETIC, TTOUGH], [], [TWEAK, TLETHARGIC], [], []));
  aspects.push(new Aspect("Self-Deprecation", 5, "Their favorite target is themselves.",
    BPERSONALITY, [TSELFDEPRECATING, THUMBLE], [], [TARROGANT], [], []));

  // V7.6: genuinely-new tropes from the bolt prototype (off-list, weight 1)
  aspects.push(new Aspect("Comic Relief", 1, "The one who keeps the mood breathable when everything is on fire.",
    BPERSONALITY, [TLOVABLE, TTALKATIVE], [], [TSTERN, TSTOIC], [], []));
  aspects.push(new Aspect("Man-Eater", 1, "She collects hearts, and returns none of them.",
    BPERSONALITY, [TSEXER, TMANIPULATIVE, TATTRACTIVE], [TFEMALE], [TUNCHARISMATIC, TUGLY, TNAIVE], [], []));

  // Color tropes: the only tropes that name a physical color outright. Each pins
  // an appearance layer with an A* tag (see appearance-details.js), which also
  // makes that color the palette seed — a Fiery Redhead gets a red palette.
  // Tropes pinning the same layer exclude each other's tag so the color can't be
  // claimed twice. Deliberately rare: most personality has no color, and reading
  // temperament off hair is a trope, not a rule.
  //
  // The gendered ones carry TFEMALE/TMALE as their source material does, so they
  // drop out entirely under "No gender stereotypes" along with every other
  // gender-gated aspect.
  aspects.push(new Aspect("Fiery Redhead", 1, "Red hair and a temper to match. The character is loud, quick to anger, and quicker to act. Nobody who has met them describes them as calm.",
    BPERSONALITY, [TENERGETIC, TSHORTFUSE, THOTBLOODED, AHAIRRED], [TFEMALE],
    [TSTOIC, TLONGFUSE, TLETHARGIC, TLAZY, AHAIRBLOND, AHAIRBLACK, AHAIRGRAY], [], []));
  aspects.push(new Aspect("Dumb Blonde", 1, "Blonde, and treated as an idiot by everyone around them. The unkind assumption arrives before they do, and in this case it happens to be correct.",
    BPERSONALITY, [TNAIVE, AHAIRBLOND], [TFEMALE],
    [TSMART, TGENRESAVVY, TWISE, TTACTICIAN, AHAIRRED, AHAIRBLACK, AHAIRGRAY], [], []));
  aspects.push(new Aspect("Raven Hair, Ivory Skin", 1, "Black hair against pale skin, a contrast striking enough that people remember the character's face before they remember anything they said.",
    BPERSONALITY, [TATTRACTIVE, AHAIRBLACK, ASKINPALE], [TFEMALE],
    [TUGLY, AHAIRRED, AHAIRBLOND, AHAIRGRAY], [], []));
  aspects.push(new Aspect("Distinguished Gentleman's Gray", 1, "Gray at the temples, and it only made them more imposing. The character wears age as credentials.",
    BPERSONALITY, [TCLASSY, TATTRACTIVE, AHAIRGRAY], [TMALE],
    [TUGLY, AHAIRRED, AHAIRBLOND, AHAIRBLACK], [], []));
  aspects.push(new Aspect("Hair of Gold, Heart of Gold", 1, "Fair-haired and genuinely kind with it. The character is the one who checks on people nobody else thought to check on.",
    BPERSONALITY, [TSWEET, TGOOD, AHAIRBLOND], [],
    [TMEAN, TEVIL, TRUTHLESS, TCOLD, AHAIRRED, AHAIRBLACK, AHAIRGRAY], [], []));
  aspects.push(new Aspect("Icy Blue Eyes", 1, "Pale blue eyes that give away nothing. The character is distant and unreadable, and the stare does most of the work.",
    BPERSONALITY, [TCOLD, TSTOIC, AEYESBLUE], [],
    [TWARM, THOTBLOODED, TSWEET, TSHORTFUSE, AEYESRED], [], []));
  aspects.push(new Aspect("Innocent Blue Eyes", 1, "Wide blue eyes that make the character look harmless, trustworthy, and younger than they are. People tell them things they shouldn't.",
    BPERSONALITY, [TNAIVE, TSWEET, AEYESBLUE], [],
    [TMEAN, TEVIL, TCYNICAL, TRUTHLESS, TCOLD, TSTOIC, AEYESRED], [], []));
  aspects.push(new Aspect("Red Eyes, Take Warning", 6, "The character's eyes are red, and everyone reads it as a warning. They are not wrong to.",
    BPERSONALITY, [TCREEPY, TDREADED, AEYESRED], [],
    [TSWEET, TWARM, TLOVABLE, AEYESBLUE], [], []));
}

// Weighted at x5 kwicks, to set friendless default to 1, and x1.5 those with char reqs and no aspect reqs
function initTeams() {
  soloTeam.push(new Aspect("The Drifter", 5, "This character is alone and on the move, because they are running from someone or searching for a place to belong.",
    BTEAMONE, [TWALKINGTHEEARTH], [TFACE], [], [TBADASS], [TWARM, TLOVED, TCOMMANDER, TPOSSE, TBADFIGHTER]));
  soloTeam.push(new Aspect("Action Survivor", 19, "This character is a regular person, alone, trying to survive a bad situation.",
    BTEAMONE, [TBADFIGHTER], [TFACE], [], [], [TBADASS, TCOMMANDER, TPOSSE, TLOVED]));
  soloTeam.push(new Aspect("The Aloner", 3, "This character just wanted to be left alone, achieved their goals, and are now alone.",
    BTEAMONE, [TISOLATED, TLONER], [THEEL], [], [TBADASS], [TCOMMANDER, TPOSSE, TLOVED, TWARM, TCHARISMATIC, TNURTURER]));
  soloTeam.push(new Aspect("The Aloner", 2, "This character just wanted to be left alone, and got exactly that.",
    BTEAMONE, [TISOLATED, TLONER, TANIMALSIDEKICK], [THEEL], [], [TBADASS], [TCOMMANDER, TPOSSE, TLOVED, TWARM, TCHARISMATIC, TNURTURER]));
  soloTeam.push(new Aspect("Alone With The Psycho", 8, "This character is trapped in the same building with a vicious killer.",
    BTEAMONE, [], [], [THEEL], [], []));
  soloTeam.push(new Aspect("Bleak Border Base", 10, "Stationed at a base in the middle of nowhere, with no other staff.",
    BTEAMONE, [TISOLATED], [], [], [], [TCOMMANDER, TPOSSE, TLOVED, TLEADER]));
  soloTeam.push(new Aspect("Can't Live Without Them", 5, "Got in a fight with their closest partner. Wanted to be left alone and got what they asked for.",
    BTEAMONE, [], [], [], [], []));
  soloTeam.push(new Aspect("Creepy Loner Girl", 2, "Scares people away by being too snarky. Has trouble talking straight to people, either from insecurity or a mental handicap. Others may regard her as creepy.",
    BTEAMONE, [TCREEPY, TLONER, TUNCHARISMATIC], [TFEMALE], [], [TSNARKY], [TCOMMANDER, TPOSSE, TLEADER, TLOVED, TWARM, TCHARISMATIC, TSTOIC]));
  soloTeam.push(new Aspect("Creepy Loner Girl", 2, "Has difficulty controlling her emotions, and is too clingy. Others may regard her as creepy.",
    BTEAMONE, [TCREEPY, TLONER, TUNCHARISMATIC], [TFEMALE], [], [THOTBLOODED], [TCOMMANDER, TPOSSE, TLEADER, TLOVED, TWARM, TCHARISMATIC, TSTOIC, TSTERN]));
  soloTeam.push(new Aspect("Creepy Loner Girl", 1, "Has no friends because she pushes everyone away. Others may regard her as creepy.",
    BTEAMONE, [TCREEPY, TLONER, TUNCHARISMATIC], [TFEMALE], [], [TCOLD], [TCOMMANDER, TPOSSE, TLEADER, TLOVED, TWARM, TCHARISMATIC, TSTOIC]));
  soloTeam.push(new Aspect("Crew of One", 5, "Operates a vehicle with a capacity of one, and often works alone.",
    BTEAMONE, [TVESSEL], [], [], [], [TPOSSE]));
  soloTeam.push(new Aspect("Dark Magical Girl", 3, "Cursed with awesome skills, which has isolated them. They're motivated to try to get approval from some other figure, afraid to be alone.",
    BTEAMONE, [TWOOBIE, TINSECURE, TAFRAIDOFTHEMSELVES], [THEEL], [], [TBADASS], [TCOMMANDER, TPOSSE, TLOVED, TCHARISMATIC]));
  soloTeam.push(new Aspect("Dark Magical Girl", 2, "Cursed with awesome skills, which has isolated them. They hate the hero for having friends and attention.",
    BTEAMONE, [TWOOBIE, TJEALOUS, TAFRAIDOFTHEMSELVES], [THEEL], [], [TBADASS], [TCOMMANDER, TPOSSE, TLOVED, TCHARISMATIC]));
  soloTeam.push(new Aspect("Friendless New Transfer Student", 2, "Has no friends, because of recently transferring in from another city.",
    BTEAMONE, [], [], [], [], [TCOMMANDER, TPOSSE, TLOVED]));
  soloTeam.push(new Aspect("Friendless Loner", 1, "Has no friends, because they're creepy and anti-social.",
    BTEAMONE, [TLONERFREAK], [], [], [], [TCOMMANDER, TPOSSE, TLEADER, TLOVED, TWARM, TCHARISMATIC]));
  soloTeam.push(new Aspect("Friendless Loner", 9, "Has no friends, because they're jerks.",
    BTEAMONE, [], [], [], [TMEAN], [TCOMMANDER, TPOSSE, TLEADER, TLOVED, TWARM, TCHARISMATIC]));
  soloTeam.push(new Aspect("Friendless Homeschooled", 2, "Has no friends, because they grew up or lived away from others for most of their lives, such as on a farm or remote location.",
    BTEAMONE, [], [], [], [], [TCOMMANDER, TPOSSE, TLEADER, TLOVED, TWARM]));
  soloTeam.push(new Aspect("Friendless Traumatized", 2, "Has no friends. Traumatized by past abuse, this character distrusts others.",
    BTEAMONE, [TANGST, TTRAUMA], [], [], [TWOOBIE], [TCOMMANDER, TPOSSE, TLEADER, TLOVED, TWARM]));
  soloTeam.push(new Aspect("Friendless Shy", 2, "Has no friends, because they're too shy to talk to people. ",
    BTEAMONE, [TSHY], [], [], [], [TCOMMANDER, TPOSSE, TLEADER, TLOVED, TWARM, TCHARISMATIC, TSTOIC, TSTERN, TMEAN, THAM]));
  soloTeam.push(new Aspect("Friendless Insecure", 1, "Has no friends. This character is nobody important and wishes that they were.",
    BTEAMONE, [TINSECURE], [], [], [], [TCOMMANDER, TPOSSE, TLEADER, TLOVED, TBADASS, TWARM, TCHARISMATIC, TBOSS, TSTOIC, TSTERN, TFAKEDITZ]));
  soloTeam.push(new Aspect("Friendless Uncharismatic", 1, "Has no friends, because they tend to put people off.",
    BTEAMONE, [TUNCHARISMATIC], [], [], [], [TCOMMANDER, TPOSSE, TLEADER, TLOVED, TWARM, TCHARISMATIC, TSTERN]));
  soloTeam.push(new Aspect("Friendless Ugly", 1, "Has no friends, because their looks scare off others.",
    BTEAMONE, [TUGLY], [], [], [], [TCOMMANDER, TPOSSE, TLOVED, TCHARISMATIC, TSEXER, TSEXY, TATTRACTIVE, TWARM, TCHARISMATIC, TSTERN]));
  soloTeam.push(new Aspect("Friendless Intimidating", 8, "Has no friends. This character is so intimidating that everyone else avoids them.",
    BTEAMONE, [], [], [], [TDREADED], [TCOMMANDER, TPOSSE, TLOVED, TWARM, TCHARISMATIC]));
  soloTeam.push(new Aspect("Friendless Ostracized", 2, "Has no friends. This character has been ostracized and victimized for some reason, perhaps out of jealousy for their skills or a group that they have offended.",
    BTEAMONE, [], [], [], [], [TCOMMANDER, TPOSSE, TLEADER, TLOVED, TWARM, TCHARISMATIC, TSTERN]));
  soloTeam.push(new Aspect("Hermit", 5, "Willingly chooses to leave society and live as a hermit. ",
    BTEAMONE, [TLONERFREAK], [], [], [], [TCOMMANDER, TPOSSE, TLEADER, TLOVED]));
  soloTeam.push(new Aspect("Hermit Guru", 5, "A wise hermit, who others may visit to seek knowledge from. ",
    BTEAMONE, [], [], [THEEL], [TWISE], [TCOMMANDER, TPOSSE, TLEADER, TLOVED]));
  soloTeam.push(new Aspect("Heroic Neutral", 10, "A retired badass who is tired of enforcing justice. He wants to be left out of fights, but gets pulled back into the plot. ",
    BTEAMONE, [TNEUTRAL], [TFACE], [], [TBADASS], [TWARM]));
  soloTeam.push(new Aspect("Hikikomori", 5, "This character shuts themselves in their bedroom. There may be too much pressure to succeed, social stigma on mental illness, and they find that they can interact with the world without seeing other humans. ",
    BTEAMONE, [TLONERFREAK], [], [], [], [TCOMMANDER, TPOSSE, TLEADER, TLOVED, TWARM, TCHARISMATIC, TSTERN]));
  soloTeam.push(new Aspect("Informed Loner", 5, "Sees themselves as a lone wolf, but actually has a strong support system and lots of allies. ",
    BTEAMONE, [], [], [], [], [TCOMMANDER, TWARM]));
  soloTeam.push(new Aspect("Intelligence Means Isolation", 5, "Has no friends, because of their intelligence. Classmates or colleagues get jealous and bully them, teachers don't like to be corrected, and they have difficulty relating with their friends.",
    BTEAMONE, [], [], [], [TSMART], [TCOMMANDER, TPOSSE, TLEADER, TLOVED, TWARM, TCHARISMATIC, TSTERN]));
  soloTeam.push(new Aspect("It's All Up To You", 10, "Works better solo, either for stealth reasons, like a sniper, or someone who does a lot of collateral damage, like a superhero.",
    BTEAMONE, [], [], [], [], []));
  soloTeam.push(new Aspect("I Work Alone", 5, "Prefers to work alone. Turns down offers for help, only to require rescuing later.",
    BTEAMONE, [TDISTRESSED], [], [], [], [TCOMMANDER, TPOSSE, TLEADER, TWARM, TNECESSARY]));
  soloTeam.push(new Aspect("I Work Alone", 5, "Prefers to work alone. Handles it just fine on their own.",
    BTEAMONE, [], [], [], [TBADASS], [TCOMMANDER, TPOSSE, TLEADER, TWARM]));
  soloTeam.push(new Aspect("Jungle Princess", 5, "Jungle princess. Animals and jungle natives obey her for some reason.",
    BTEAMONE, [TATTRACTIVE, TSEXY, TNATURE], [TFEMALE], [], [], [TCLASSY, TPOSSE, TWARM]));
  soloTeam.push(new Aspect("Knight Errant", 10, "A noble, landless knight, unattached to anyone, looking to do good deeds.",
    BTEAMONE, [TCHRONICHERO, TWALKINGTHEEARTH], [], [THEEL], [THONORABLE], [TCOMMANDER, TPOSSE, TLOVED]));
  soloTeam.push(new Aspect("Lonely at the Top", 5, "This character has become extremely successful but has no friends.",
    BTEAMONE, [], [], [], [TRICH], [TCOMMANDER, TPOSSE, TLOVED, TWARM]));
  soloTeam.push(new Aspect("Lonely Rich Kid", 1, "Lonely rich kid. Some people may have tried to take advantage of their wealth. Growing up rich separates them by caste. Often isolated themselves from others for security reasons.",
    BTEAMONE, [TCOLD], [], [], [TRICH], [TCOMMANDER, TPOSSE, TLOVED, TWARM]));
  soloTeam.push(new Aspect("Lonely Rich Kid", 1, "Lonely rich kid. Parents were always busy, and paid little attention to them. Other family members may have filled the gaps.",
    BTEAMONE, [], [], [], [TRICH], [TCOMMANDER, TPOSSE, TLOVED, TSTERN]));
  soloTeam.push(new Aspect("Lonely Rich Kid", 1, "Lonely rich kid. Unable to get along with others, and feels like an alien in a different world. They're quiet and nerdy, which sets them apart.",
    BTEAMONE, [TNERD], [], [], [TRICH], [TTALKATIVE, TCOMMANDER, TPOSSE, TLEADER, TLOVED, TWARM, TCHARISMATIC, TSTERN]));
  soloTeam.push(new Aspect("Maddened Into Misantrophy", 5, "This character has been through a lot of suffering - broken relationships, failed dreams, and physical suffering. They distrust others and push them away.",
    BTEAMONE, [TANGST, TCOLD], [], [], [TWOOBIE], [TWARM, TCOMMANDER, TPOSSE, TLEADER, TLOVED]));
  soloTeam.push(new Aspect("Nature Hero", 5, "This character doesn't get along with people, but finds themselves more attached to animals. They often protect the wildlife and stray animals from humans, though they may defend visitors. They find humans a little annoying.",
    BTEAMONE, [TLONERFREAK, TCOLD, TNATURE], [], [], [], [TWARM, TCOMMANDER, TPOSSE, TLEADER]));
  soloTeam.push(new Aspect("Not Good With People", 4, "This character doesn't get along with people, and keeps an animal companion.",
    BTEAMONE, [TANIMALSIDEKICK, TSHY], [], [], [], [TCOMMANDER, TPOSSE, TLEADER, TWARM, TCHARISMATIC, THAM]));
  soloTeam.push(new Aspect("Not Good With People", 1, "This character doesn't get along with people, and keeps an animal companion.",
    BTEAMONE, [TANIMALSIDEKICK], [], [], [TCOLD], [TCOMMANDER, TPOSSE, TLEADER, TWARM, TCHARISMATIC]));
  soloTeam.push(new Aspect("One Riot One Ranger", 3, "The company sends their best person do deal with the problem. The company fears that sending more would attract too much attention from the enemy. ",
    BTEAMONE, [], [], [], [TBADASS], []));
  soloTeam.push(new Aspect("One Riot One Ranger", 4, "The company sends their best person do deal with the problem. The rest of team are needed to hold off the enemy army, leaving only the best to do the rest of the work. ",
    BTEAMONE, [], [], [], [TBADASS], []));
  soloTeam.push(new Aspect("One Riot One Ranger", 3, "The company sends their best person do deal with the problem, because the leadership has underestimated or downplayed the threat. ",
    BTEAMONE, [], [], [], [TBADASS], []));
  soloTeam.push(new Aspect("Space Isolation Horror", 2, "Alone, in the cold depths of space.",
    BTEAMONE, [TISOLATED], [], [], [], [TCOMMANDER, TPOSSE, TLOVED]));
  soloTeam.push(new Aspect("Sole Survivor", 20, "The character was part of a larger party, but everyone else has died. ",
    BTEAMONE, [TTRAUMA], [], [], [], [TPOSSE]));
  soloTeam.push(new Aspect("Wild Child", 5, "The character was a feral child, as a result of abandonment, neglect or abuse. They may have been raised by animals, with poor language skills.",
    BTEAMONE, [TFERAL, TTRAUMA], [], [], [], [TCOMMANDER, TPOSSE, TLEADER, TLOVED, TWARM, TCHARISMATIC]));
  soloTeam.push(new Aspect("Zen Survivor", 5, "The character survived a traumatic situation but has become cynical and wise.  They don't share their wisdom with just anyone, as most don't appreciate it. Instead they become cryptic and makes things tough for their student.",
    BTEAMONE, [TMENTOR, TCYNICAL, TTRAUMA], [], [], [], [TCOMMANDER, TPOSSE, TLOVED, TWARM, TCHARISMATIC]));
  soloTeam.push(new Aspect("Only Sane One", 32, "The character has to handle the job alone, because everyone else is either corrupt, clueless, or incompetent.",
    BTEAMONE, [], [], [], [TSANE], [TCOMMANDER, TPOSSE, TLOVED]));
  soloTeam.push(new Aspect("Nobody Else To Do It", 8, "The character has to handle the job alone, because the trained experts were unable to get to the task in time.",
    BTEAMONE, [], [], [], [], []));
}

function createCharacter(tags, branches = loadInitialBranches()) {
  if (typeof ga !== 'undefined') {
    ga('send', 'event', 'generate', 'create');
  }
  let c = new Character(tags, branches);
  return generate(c);
}

function loadTags() {
  let tags = [];

  const ROLE_ANY = "role-any";
  const ROLE_HERO = "role-hero";
  const ROLE_VILLAIN = "role-villain";
  const ROLE_SUPPORT = "role-support";
  const GENDER_UNISEX = "gender-any";
  const GENDER_MALE = "gender-male";
  const GENDER_FEMALE = "gender-female";

  let role = $('select#role option:selected').attr("id");
  switch (role) {
    case ROLE_HERO:
      tags.push(TFACE);
      break;
    case ROLE_VILLAIN:
      tags.push(THEEL);
      break;
    case ROLE_SUPPORT:
      tags.push(TSUPPORT);
      break;
    case ROLE_ANY:
      tags.push(forceRole());
      break;
    default:
      tags.push(forceRole());
  }

  let gender = '';
  // only add the gender limitations when the checkbox is not ticked
  if (!document.getElementById('no-stereotypes').checked) {
    let genderOption = $('select#gender option:selected').attr("id");
    switch (genderOption) {
      case GENDER_MALE:
        gender = TMALE;
        break;
      case GENDER_FEMALE:
        gender = TFEMALE;
        break;
      case GENDER_UNISEX:
        gender = forceGender();
        break;
      default:
        gender = forceGender();
        break;
    }
    tags.push(gender);
  }
  const charName = $('input#name').val();
  if (charName != "") {
    generatePronouns(gender, charName);
  } else {
    const rName = randomName(gender);
    generatePronouns(gender, rName);
  }
  tags.push(getTeamSize());
  return tags;
}

// One branch table for every consumer (the form reader below, the roll lab).
const DETAIL_BRANCHES = {
  "detail-sparse": [BWANT, BSINGLEPLOT, BPERSONALITY],
  "detail-moderate": [BWANT, BSINGLEPLOT, BPERSONALITY, BPERSONALITY],
  "detail-high": [BWANT, BSINGLEPLOT, BPERSONALITY, BPERSONALITY, BPERSONALITY],
  "detail-very-high": [BWANT, BSINGLEPLOT, BPERSONALITY, BPERSONALITY, BPERSONALITY, BPERSONALITY],
};

function branchesForDetail(detail) {
  const branches = DETAIL_BRANCHES[detail] || DETAIL_BRANCHES["detail-moderate"];
  return branches.slice();
}

function loadInitialBranches() {
  let detail = $('select#detail option:selected').attr("id");
  return branchesForDetail(detail);
}

function getTeamSize() {
  const SIZE_ONE = "team-one";
  let size = $('select#team-size option:selected').attr("id");
  switch (size) {
    case SIZE_ONE:
      return BTEAMONE;
  }
  return "";
}

/* generate(Character) */
function generate(c) {
  generateCharacter(c);
  displayCharacter(c);
  return c;
}

function generateCharacter(c) {
  let len = c.branches.length;
  while (len > 0) {
    let branch = c.branches[0];
    switch (branch) {
      case BPERSONALITY:
        generateAspects(c);
        break;
      case BTEAMONE:
        generateSoloTeam(c);
        break;
      case BSINGLEPLOT:
        generateOneShot(c);
        break;
      case BWANT:
        generateWant(c);
        break;
    }

    c.branches.shift(); // remove the one at the front of the array, not the end
    len = c.branches.length;
  }
}

// On a personality search, check that the current character fits whatever 
// aspect is to be rolled
function generateAspects(c) {
  let filtered = obtainRoot(aspects, c);
  let picked = rollRole(filtered);
  if (picked) {
    c.aspects.push(picked);
    addTags(c, picked);
  }
}

// on a team generation, search for aspects that fit the given requirements
function generateSoloTeam(c) {
  let filtered = obtainRoot(soloTeam, c);
  let root = rollRole(filtered);
  if (root) {
    // console.log(root.name);
    c.teamType = root;
    addTags(c, root);

    // Spawn one fitting role, maybe lower BPERSONALITY count by one
    filtered = filterPersonalityFromRoot(aspects, root, c);
    let picked = rollRole(filtered);
    if (picked) {
      // console.log(picked.name);
      c.aspects.push(picked);
      addTags(c, picked);
    }
  }
}

function generateOneShot(c) {
  let filtered = obtainRoot(drama, c);
  let picked = rollRole(filtered);
  if (picked) {
    // console.log(picked.name);
    c.aspects.push(picked);
    addTags(c, picked);
  }
}

function generateWant(c) {
  let filtered = obtainRoot(want, c);
  let picked = rollRole(filtered);
  if (picked) {
    c.aspects.push(picked);
    addTags(c, picked);
  }
}

// This searches for a possible root, based on characteristics already 
// assigned, like FEMALE or HEEL
// c is character, t is trope/target from list to filter
function obtainRoot(roots, c) {
  return roots.filter(function (t) {
    let isValid = true;

    // For each t.requirement and !t.exclude, check that it doesn't match c.tag
    t.requirements.forEach(function (requirement) {
      if (!c.tags.has(requirement)) isValid = false;
    });
    t.excludes.forEach(function (exclude) {
      if (c.tags.has(exclude)) isValid = false;
    });

    // For each t.tag, check that it doesn't match c.exclude
    c.excludes.forEach(function (exclude) {
      if (t.tags.has(exclude)) isValid = false;
    });

    return isValid;
  });
}

// This filters roles that do not fit root criteria for roles
// c is character, t is trope/target from list to filter, 
// root is the role (e.g. team/story) that spawns new roles
function filterPersonalityFromRoot(personalities, root, c) {
  return personalities.filter(function (t) {
    let isValid = true;

    // For each t.requirement and !t.exclude, check that it doesn't match c.tag
    t.requirements.forEach(function (requirement) {
      if (!c.tags.has(requirement)) isValid = false;
    });
    t.excludes.forEach(function (exclude) {
      if (c.tags.has(exclude)) isValid = false;
    });

    // Filter personalities that don't fit the root's expectation
    // For each root.requirement and !root.exclude,
    // check that it doesn't match t.tag
    root.branchRequirements.forEach(function (requirement) {
      if (!t.tags.has(requirement)) isValid = false;
    });
    root.branchExcludes.forEach(function (exclude) {
      if (t.tags.has(exclude)) isValid = false;
    });

    // For each t.tag, check that it doesn't match c.exclude
    c.excludes.forEach(function (exclude) {
      if (t.tags.has(exclude)) isValid = false;
    });

    return isValid;
  });
}

// Reveals the portrait card, renders the palette pie into the square, sets the
// name, the concept subtitle, and the Eyes/Hair/Skin/Build stats. Runs at
// every detail level.
function renderPortraitHeader(values, seed, concept) {
  values = values || {};
  const name = (typeof p !== 'undefined' && p.Sdesc) ? p.Sdesc.toUpperCase() : 'NEW CHARACTER';
  $('#display-name').text(name);
  $('#display-concept').text(concept || '').toggleClass('hidden', !concept);

  if (typeof generatePalette === 'function' && typeof palettePieSvg === 'function') {
    // seed comes from the character's physical coloring — { hue } for a chromatic
    // color, { family } for an achromatic one. Null yields a random palette.
    const palette = generatePalette(seed || undefined);
    $('#portrait-square').html(palettePieSvg(palette, 96));
  }

  $('#stat-eyes').text(values.eyes || '—');
  $('#stat-hair').text(values.hair || '—');
  $('#stat-skin').text(values.skin || '—');
  $('#stat-build').text(values.build || '—');

  // Swap the plain first-load name for the full card.
  $('#display-name-plain').addClass('hidden');
  $('#portrait-card').removeClass('hidden');
}

// Renders the wardrobe into the collapsed Style accordion at the bottom of the
// Physical Attributes section. The outfit name rides in the <summary> so the
// headline fact is on the card without opening it; fashion sense, flair, and
// accessory prose tuck behind the click. Deliberately never touches the open/
// closed state: it starts collapsed, and a reader who opens it keeps it open
// across rerolls.
function renderStyle(clothing) {
  const $details = $('#style-details');
  if (!clothing) {
    $details.addClass('hidden');
    return;
  }
  $('#style-summary-outfit').text(clothing.outfit || 'Unremarkable');
  let styleText = '';
  clothing.lines.forEach(function (line) {
    styleText += '<li class="text-justify">' + line + '</li>';
  });
  $('#results-style').html(styleText);
  $details.removeClass('hidden');
}

// Completes a generated character into displayable data — appearance,
// clothing, palette seed, concept — with no DOM access. The roll lab calls
// this directly; displayCharacter is only the DOM half.
function resolveCharacter(c) {
  // Portrait header: always roll a palette + the 4 appearance values, at any
  // detail level. The full appearance roll (values + section lines) is stashed
  // on the character so the detail branch below reuses it instead of re-rolling.
  let appearance = { values: {}, lines: [], seed: null, seedCandidates: [], tags: c.tags };
  if (typeof rollAppearance === 'function') {
    appearance = rollAppearance(c.tags);
  }
  c.appearance = appearance;

  // Clothing rolls off the appearance-augmented tag set. Its color flairs join
  // the palette-seed pool unpinned, so a trope-pinned hair color still wins,
  // but Red Accents can steer an otherwise unseeded palette.
  let clothing = null;
  if (typeof rollClothing === 'function') {
    clothing = rollClothing(appearance.tags || c.tags);
  }
  c.clothing = clothing;
  let seed = appearance.seed;
  if (clothing && typeof pickSeed === 'function') {
    seed = pickSeed((appearance.seedCandidates || []).concat(clothing.seedCandidates));
  }
  c.paletteSeed = seed;
  // The concept reads the full end-of-roll tag set — personality + wants +
  // plots + the appearance and clothing rolls' adds — so it goes last.
  let concept = null;
  if (typeof generateConcept === 'function') {
    concept = generateConcept(clothing ? clothing.tags : (appearance.tags || c.tags));
  }
  c.concept = concept;
  return c;
}

// Assembles every detail-mode section as data: arrays of
// { text, src: { bank, tag, via } } where `via` names the aspect that put the
// tag on the character. Provenance stays content-level (trope names, tag
// constants) — never file/line — so it survives an engine rewrite.
// displayCharacter renders from this; the roll lab exports it.
function characterSections(c) {
  // Map each tag back to the aspect that added it.
  let owners = {};
  c.aspects.forEach(function (a) {
    a.tags.forEach(function (t) { owners[t] = a.name; });
    a.branchRequirements.forEach(function (t) { owners[t] = a.name; });
  });
  if (c.teamType) {
    c.teamType.tags.forEach(function (t) { owners[t] = c.teamType.name; });
  }

  let sections = {
    appearance: [], portrayal: [], power: [],
    personal: [], wealth: [], plot: [], want: []
  };
  const line = (bank, tag, text) =>
    ({ text: text, src: { bank: bank, tag: tag || null, via: (tag && owners[tag]) || null } });

  // Physique flavor, grooming, and facial hair from the appearance roll.
  // Eye/hair/skin sentences are suppressed there since they show in the
  // portrait header.
  (c.appearance ? c.appearance.lines : []).forEach(function (text) {
    sections.appearance.push(line('rollAppearance', null, text));
  });

  c.tags.forEach(function (t) {
    let appearance = tagToAppearance(t);
    if (appearance) sections.appearance.push(line('tagToAppearance', t, appearance));
    let portrayal = tagToPortrayal(t);
    if (portrayal) sections.portrayal.push(line('tagToPortrayal', t, portrayal));
    let power = tagToPowerBase(t);
    if (power) sections.power.push(line('tagToPowerBase', t, power));
    let personal = tagToHiddenPersonality(t);
    if (personal) sections.personal.push(line('tagToHiddenPersonality', t, personal));
    let wealth = tagToWealth(t);
    if (wealth) sections.wealth.push(line('tagToWealth', t, wealth));
    let plot = plotToDesc(t);
    if (plot) sections.plot.push(line('plotToDesc', t, plot));
    let want = wantToDesc(t);
    if (want) sections.want.push(line('wantToDesc', t, want));
  });
  return sections;
}

function displayCharacter(c) {
  resolveCharacter(c);
  renderPortraitHeader(c.appearance.values, c.paletteSeed, c.concept);
  renderStyle(c.clothing);

  if (!showDetails) {
    let $listResults = $('#list-results');
    let $listTeam = $('#results-team');
    $listResults.html("");
    $listTeam.html("");
    let textOutput = $listResults.html();
    let headingTeam = $('#team-heading');
    let headingDesc = $('#desc-heading');
    let tags = c.tags;
    tags.forEach(function (t) {
      // console.log(t);
      let desc = tagToDesc(t).trim();
      if (desc.length > 0) {
        textOutput += '<li class="text-justify">' + desc + '</li>';
      }
    });
    $listResults.html(textOutput);
    if (c.teamType) {
      let teamText = c.teamType.text;
      $listTeam.html(teamText);
      headingTeam.removeClass('hidden');
    } else {
      headingTeam.addClass('hidden');
    }
  } else {
    // console.log(c.aspects);
    let $listTeam = $('#results-team');
    $listTeam.html("");
    let $appearance = $('#results-appearance');
    let $portrayal = $('#results-portrayal');
    let $power = $('#results-power');
    let $personal = $('#results-personal');
    let $background = $('#results-background');
    let $wealth = $('#results-wealth');
    let $plot = $('#results-plot');
    let $want = $('#results-want');
    let $portrayalHeading = $('#portrayal-heading');
    let $personalityHeading = $('#personality-heading');
    let $appearanceHeading = $('#appearance-heading');
    let $powerHeading = $('#power-heading');
    let $personalHeading = $('#personal-heading');
    let $backgroundHeading = $('#background-heading');
    let $wealthHeading = $('#wealth-heading');
    let $plotHeading = $('#plot-heading');
    let $wantHeading = $('#want-heading');
    let $headingTeam = $('#team-heading');
    $appearance.html("");
    $portrayal.html("");
    $power.html("");
    $personal.html("");
    $background.html("");
    $wealth.html("");
    $plot.html("");
    $want.html("");
    $personalityHeading.hide();
    $appearanceHeading.hide();
    $portrayalHeading.hide();
    $powerHeading.hide();
    $personalHeading.hide();
    $backgroundHeading.hide();
    $wealthHeading.hide();
    $plotHeading.hide();
    $wantHeading.hide();

    // All section content comes pre-assembled from characterSections(); this
    // branch only wraps it in markup.
    const sections = characterSections(c);
    const toList = (lines) => lines.map(function (l) {
      return '<li class="text-justify">' + l.text + '</li>';
    }).join('');
    let appearanceText = toList(sections.appearance);
    let portrayalText = toList(sections.portrayal);
    let powerText = toList(sections.power);
    let personalText = toList(sections.personal);
    let backgroundText = '';
    let wealthText = toList(sections.wealth);
    let plotText = sections.plot.map(function (l) { return l.text; }).join('');
    let wantText = sections.want.map(function (l) { return l.text; }).join('');

    if (appearanceText) {
      $appearanceHeading.removeClass('hidden').show();
      $appearance.removeClass('hidden');
      $appearance.html(appearanceText);
    }
    if (portrayalText) {
      $portrayalHeading.removeClass('hidden').show();
      $portrayal.removeClass('hidden');
      $portrayal.html(portrayalText);
    }
    if (powerText) {
      $powerHeading.removeClass('hidden').show();
      $power.removeClass('hidden');
      $power.html(powerText);
    }
    if (personalText) {
      $personalHeading.removeClass('hidden').show();
      $personal.removeClass('hidden');
      $personal.html(personalText);
    }
    if (backgroundText) {
      $backgroundHeading.removeClass('hidden').show();
      $background.removeClass('hidden');
      $background.html(backgroundText);
    }
    if (wealthText) {
      $wealthHeading.removeClass('hidden').show();
      $wealth.removeClass('hidden');
      $wealth.html(wealthText);
    }
    if (plotText) {
      $plotHeading.removeClass('hidden').show();
      $plot.removeClass('hidden');
      $plot.html(plotText);
    }
    if (wantText) {
      $wantHeading.removeClass('hidden').show();
      $want.removeClass('hidden');
      $want.html(wantText);
    }
    if (c.teamType) {
      let teamText = c.teamType.text;
      $listTeam.html(teamText);
      $headingTeam.removeClass('hidden');
    } else {
      $headingTeam.addClass('hidden');
    }
  }
}

const showDetails = true;
const reducer = (accumulator, currentValue) => accumulator + currentValue;

function rollRole(array) {
  if (array.length < 1) {
    console.log("Role list is empty");
    return;
  }

  const getWeight = R.pluck('weight');
  const totalWeight = getWeight(array).reduce(reducer);

  let r = roll(1, totalWeight);
  let search = 1;
  for (let i = 0; i < array.length; i++) {
    let w = array[i].weight;
    if (r >= search && r < (search + w)) {
      return array[i];
    }
    search += w;
  }

  console.log("rollRole unable to generate");
  console.log(array);
  return "error";
}

function randomArray(array) {
  let r = roll(0, array.length-1);
  return array[r];
}

/* makes the role consistent, so that evil guys don't have good text with 
"ANY" */
function forceRole() {
  let r = roll(1, 3);
  switch (r) {
    case 1:
      return TFACE;
    case 2:
      return THEEL;
    case 3:
      return TSUPPORT;
  }
}

function forceGender() {
  let r = roll(1, 2);
  switch (r) {
    case 1:
      return TMALE;
    case 2:
      return TFEMALE;
  }
}

function randomName(gender) {
  if (gender == TMALE) {
    return randomArray(namesM);
  } else { // including androgynous
    return randomArray(namesF);
  }
}

function roll(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const addTag = R.curry((c, tag) => c.tags.add(tag));
const addExcludes = R.curry((c, tag) => c.excludes.add(tag));
function addTags(c, aspect) {
  aspect.tags.forEach(addTag(c));
  aspect.branchRequirements.forEach(addTag(c));
  aspect.excludes.forEach(addExcludes(c));
  aspect.branchExcludes.forEach(addExcludes(c));
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// pronouns - don't update this, this will be set up later
let p = {
  sdesc: 'this character', // Bob
  Sdesc: 'This character', // Bob
  sdescs: "this character's",
  Sdescs: "This character's",
  him: 'him/her',
  Him: 'Him/her',
  his: 'his/her',
  His: 'His/her',
  she: 'he/she',
  She: 'He/she',
  herself: 'him/herself',
  Herself: 'His/herself',
  hers: 'his/hers',
  Hers: 'His/Hers'
};

function generatePronouns(gender, name = p.sdesc) {
  let sdesc, Sdesc, sdescs, Sdescs;
  sdesc = name;
  Sdesc = capitalizeFirstLetter(name);
  sdescs = sdesc + "'s";
  Sdescs = Sdesc + "'s";

  switch (gender) {
    case TMALE:
      p = {
        sdesc: sdesc, // Bob
        Sdesc: Sdesc, // Bob
        sdescs: sdescs,
        Sdescs: Sdescs,
        him: 'him',
        Him: 'Him',
        his: 'his',
        His: 'His',
        she: 'he',
        She: 'He',
        herself: 'himself',
        Herself: 'Himself',
        hers: 'his',
        Hers: 'His'
      };
      break;
    case TFEMALE:
      p = {
        sdesc: sdesc, // Bob
        Sdesc: Sdesc, // Bob
        sdescs: sdescs,
        Sdescs: Sdescs,
        him: 'her',
        Him: 'Her',
        his: 'her',
        His: 'Her',
        she: 'she',
        She: 'She',
        herself: 'herself',
        Herself: 'Herself',
        hers: 'hers',
        Hers: 'Hers'
      };
      break;
    default:
      p = {
        sdesc: sdesc, // Bob
        Sdesc: Sdesc, // Bob
        sdescs: sdescs,
        Sdescs: Sdescs,
        him: 'them',
        Him: 'Them',
        his: 'their',
        His: 'Their',
        she: sdesc,
        She: Sdesc,
        herself: 'themselves',
        Herself: 'Themselves',
        hers: 'their',
        Hers: 'Their'
      };
  }
}

$(document).ready(function () {
  init();
});

function init() {
  if (showDetails) {
    $('#personality-heading').hide();
  }
  initAspects();
  initTeams();
  initPlots();
  initWants();

  let starter = loadInitialBranches();
  let teamSize = getTeamSize();
  if (teamSize) {
    // starter.shift(); // remove one personality and replace it with the role
    starter.unshift(teamSize);
  }
  createCharacter(loadTags(), starter);
  $("button#generate").click(function () {
    starter = loadInitialBranches();
    teamSize = getTeamSize();
    if (teamSize) {
      // starter.shift(); // remove one personality and replace it with the role
      starter.unshift(teamSize);
    }
    createCharacter(loadTags(), starter);

    // Scroll to character sheet on mobile
    if (window.innerWidth < 1024) {
      document.querySelector('.sheet-column').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Add a quick visual indicator
    let $sheet = $('.sheet-column');
    $sheet.css('transition', 'background-color 0.3s ease');
    $sheet.css('background-color', '#f3f4f6');
    setTimeout(() => {
      $sheet.css('background-color', '#ffffff');
    }, 300);
  });
}