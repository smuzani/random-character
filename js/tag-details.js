/* new tag model:
 portrayal only: often shallow/side personality traits like clumsy or heavy eater
 appearance only: physical descriptors, clothing, fashion. rarely ever appearance + portrayal
 portrayal > appearance: personality reflected by fashion
 power > portrayal: internal strength that radiates out
 personal > power: power that results from a particular personal trait
 personal > wealth: particular items that result from a personality (e.g. bigger guns)
 wealth + power: power reliant on ownership of an item, or wealth resulting from power
 power only: inherent power. or some tags have many variations, e.g. street smart, book smart, strong, and should be
  power based in detail. Sometimes things like strong but not muscular.
 personal: meta or secret
 wealth + power > portrayal. large personality sets e.g. walking the earth, billionaire
 none: certain tags like number two, to avoid conflict

 Some things are surface only - sweetness, to be combined with the actual underlying trait.
 Some things are tags only to prevent conflict, likely used in portrayal or personal.
 For anything that covers more than 2, consider splitting it.

 TODO:
 Consider making only one model per tag, with the archetype holding appropriate tags
 Make sure wealth tags can't definition conflict. E.g. everyman with rich
 Replace appearance and wealth with treasure table
 Power-only tags comboed with portrayal-only tags
 Consider bundled traits, like sadist-violent-aggressive-moredakka
 Make him/his/her just a find and replace, based on character's gender
 */

const TENERGETIC = 'energetic'; // doesn't get tired
const TLETHARGIC = 'lethargic'; // doesn't do much
const TTALKATIVE = 'talkative'; // ajdlksajflkasjfdljslfd
const TINTROVERT = 'introvert'; // doesn't say so much
const TCOLD = 'cold'; // dislikes others
const TWARM = 'warm'; // warms and friendly
const TANGST = 'angst'; // bottled up anger
const TMEAN = 'mean'; // not nice
const TSWEET = 'sweet'; // sweet, kind, and generous
const TNURTURER = 'nurturer'; // improves others
const TCARING = 'caring'; // cares about others
const TRUTHLESS = 'ruthless'; // uses their guys as pawns
const TLEADER = 'leader'; // leader role
const TFOLLOWER = 'follower'; // poor leadership skills
const TDISPOSABLE = 'disposable'; // mook
const TNECESSARY = 'necessary'; // not disposable, team needs to keep them alive
const TBIG = 'big'; // big guy
const TSMALL = 'smol'; // you're a small guy
// const TDITZ = 'ditz'; // merge into naive
const TNAIVE = 'naive'; // easily manipulated
const TFAKEDITZ = 'fakeditz'; // doesn't look smart
const TSMART = 'smart'; // smart
const TTACTICIAN = 'tactician'; // really good with military maneuvers
const TTACTICLESS = 'tacticless'; // useless at tactics
const THEART = 'heart'; // keeps the team together
const TEVERYMAN = 'everyman'; // audience surrogate
const THAM = 'ham'; // LOUD LOAD
const TMODEST = 'modest'; // betty
const TCLASSY = 'classy'; // veronica
const TSTRONG = 'strong';
const TWEAK = 'weak';
const TCHARISMATIC = 'charismatic'; // charming to the point it's like a force
const TUNCHARISMATIC = 'uncharismatic';
const TBALANCED = 'balanced'; // balanced char, probably an everyman too, but between the other extremes
const TNUMBERTWO = 'secondincommand'; // lancer, likely overlaps another role
const TPOWERFUL = 'powerful'; // someone in a position of power
const THONORABLE = 'honorable'; // strict code of honor
const TDISHONORABLE = 'dishonorable'; // pragmatist, breaks rules
const TGREEDY = 'greedy';
const TASCETIC = 'ascetic'; // pretty chill
const TMANIPULATIVE = 'manipulative'; // uses political power not physical
const TRICH = 'rich';
const TPOOR = 'poor';
const TAMBITIOUS = 'ambitious';
const TBOSS = 'boss'; // not necessarily a leader, but someone who can fight really well
const TLOVED = 'loved'; // likely people will defend them. This contrasts with TLOVABLE, in that everyone loves the TLOVABLE, but TLOVED only needs on lover. Suitable for abusive lovers.
const THATED = 'hated'; // likely lots of enemies. Approval rating 0%
const TBITCH = 'bitch'; // someone the audience loves to hate despite their strengths. Hate sink
const TLOVABLE = 'lovable'; // someone the audience likes despite their flaws. Contrast with TLOVED, in that this character is loved by strangers, whereas TLOVED may only have one
const TDREADED = 'dreaded'; // likely avoided
const TCOMMANDER = 'commander'; // commands an army, not just a team
const TPOSSE = 'posse'; // leads a posse
const TVESSEL = 'vessel'; // has a ship or airship or something
const TEXPOSITION = 'exposition'; // provides exposition for the story
const TMIDDLEMANAGER = 'midmanager'; // has bosses and underlings
const TBUREAUCRAT = 'bureaucrat'; // enforces the rules
const TPACIFIST = 'pacifist'; // avoids fights
const TVIOLENT = 'violent'; // quick to use violence, but not necessarily sadists
const TMOREDAKKA = 'extraviolent'; // uses a comically high amount of violence
const TAGGRESSIVE = 'aggressive'; // starts fights
const TSADIST = 'sadist'; // hunts for fights
// const TINNOCENT = 'innocent'; // cute
const TTREACHEROUS = 'treacherous';
const TLOYAL = 'loyal';
const TINDIVIDUALISTIC = 'individualistic'; // doesn't rely on others, selfish
const TTEAMPLAYER = 'teamplayer'; // works as a team
const TCOWARD = 'coward'; // runs away from trouble
const TBRAVE = 'brave'; // runs away from trouble
const TDEFENDER = 'defender'; // will relentlessly defend someone
const TDEFENDED = 'defended'; // is relentlessly defended by someone
const TBADASS = 'badass'; // cool, inspires dread
const TBADFIGHTER = 'badfighter'; // notably poor fighting skills
const TBUTTMONKEY = 'buttmonkey'; // not cool
const THUMBLE = 'humble';
const TARROGANT = 'arrogant';
const TDETERMINED = 'determined'; // determinator
const TLAZY = 'lazy'; // doesn't do something even when they could
const TGOODCAUSE = 'goodcause'; // devoted to a good cause
const TBADCAUSE = 'badcause'; // devoted to a bad cause often for good reasons
const TPOINTLESSCAUSE = 'pointlesscause';
const TGOODMEANS = 'goodmeans';
const TBADMEANS = 'badmeans';
const TMYOPIC = 'myopic'; // his actions has side effects that he doesn't appreciate
const TGENRESAVVY = 'genresavvy';
const TWISE = 'wise'; // has general wisdom
const TINSANE = 'insane';
const TSANE = 'sane'; // only sane man
const TDISTRESSED = 'distressed'; // living macguffin
const TACE = 'ace'; // makes the protagonist look bad
const TLOAD = 'load'; // someoene who makes things harder for the team
const TOBSTRUCTIVE = 'obstructive'; // gets in the way
const TCONTRARIAN = 'contrarian'; // disagrees with everything
const TYESMAN = 'yesman'; // agrees with everything
const TALLY = 'ally'; // helps the team out, but isn't part of the team
const TMYSTERIOUS = 'myterious'; // obscures their identity
const TTRAUMA = 'traumatized'; // dark backstory
const TIDEALISTIC = 'idealistic';
const TCYNICAL = 'cynical';
const TSTOIC = 'stoic';
const THOTBLOODED = 'hotblooded';
const TATTRACTIVE = 'attractive'; // pretty or handsome, nice to look at
const TSEXY = 'sexy'; // attractive enough to give boners
const TUGLY = 'ugly'; // not attractive
const TJEALOUS = 'jealous'; // envious counts too
const TOBSESSED = 'obsessed'; // obsessed with someone
const TNOBLE = 'noble'; // really a good person deep down inside
const TIGNOBLE = 'ignoble'; // really an ass deep down inside
const TSHORTFUSE = 'shortfuse'; // angers easily
const TLONGFUSE = 'patient'; // angers slowly
const TBERSERKBUTTON = 'berserk'; // has a berserk button
const TPOLITEANGER = 'politeanger';
const TEVIL = 'evil'; // evil just because they enjoy it
const TGOOD = 'good'; // good just because they enjoy it
const TVEGAN = 'vegan';
const TSNARKY = 'snarky'; // says it sarcastically
const TOBVIOUS = 'straight'; // says it straight
const THONEST = 'honest';
const TLIAR = 'liar'; // blatant liar
// const TINVENTOR = 'inventor'; // invents things that solve the plot. merge into techie
const TTECHIE = 'techie'; // skilled with technical things
const TSTREETSMART = 'streetsmart';
const TWOOBIE = 'woobie'; // audience feels sorry for them
const TDERE = 'dere'; // tsundere, yandere, etc, someone who is secretly sweet
const TLUCKY = 'lucky'; // good things happen to them unexpectedly
const TUNLUCKY = 'unlucky'; // bad things happen to them unexpectedly
const TROGUE = 'rogue'; // mischievous and breaks the law
const TNOTMYFAULT = 'notmyfault'; // doesn't admit mistakes
const TSELFBLAMING = 'selfblaming'; // blames themselves when
// const TBREAKSIT = 'breaksit'; // makes problems worse unwillingly
// const TFIXESIT = 'fixesit'; // makes things better for the heroes unwillingly
const TSTERN = 'stern';

const TCANNIBAL = 'cannibal';
const TEATER = 'eater'; // eats a lot
const TTOUGH = 'tough'; // physically tough
const TATTENTION = 'attentionwhore'; // fakes something for attention
const TSEXER = 'sexer'; // sleeps around with people then leaves them
const TCARETAKER = 'caretaker'; // taking care of someone
const TCLUMSY = 'clumsy';
const TINVESTIGATOR = 'investigator'; // able to investigate and move the plot forward
const TNERD = 'nerd'; // not much smarter than average, but looks the part
const TCHRONICHERO = 'chronichero'; // feels like they always have to save the day
const TNEUTRAL = 'neutral'; // reluctant
// const TBURNEDOUT = 'burnedout'; // burned out by lots of stress and excess work
const TWALKINGTHEEARTH = 'walkingwalking'; // travelling the earth, no responsibilities, no possessions

// needs aspects for each of this
const TANIMALSIDEKICK = 'animalsidekick';
const TISOLATED = 'isolated'; // in the middle of nowhere
const TLONER = 'loner'; // prefers to be left alone
const TCREEPY = 'creepy';
const TINSECURE = 'insecure'; // wants approval
const TAFRAIDOFTHEMSELVES = 'afraidofthemselves'; // afraid of their own powers and what they could be
const TLONERFREAK = 'lonerfreak'; // anti-social introvert, or gone mad from being isolated from society
const TSHY = 'shrinkingviolet'; // extremely shy and may close up when approached
const TNATURE = 'nature'; // nature lover
const TMENTOR = 'mentor'; // teaching another character
const TFERAL = 'feral'; // grew up neglected, feral, raised by wolves or some other creature

// V7.6 Overdosed Tropes expansion
const TCATCHPHRASE = 'catchphrase'; // has a signature phrase
const TENFORCER = 'enforcer'; // the boss's right hand / dragon
const TSTANDARDS = 'standards'; // villain with a line they won't cross
const THIDDENDEPTHS = 'hiddendepths'; // more to them than the surface
const TVINDICTIVE = 'vindictive'; // disproportionate retribution
const TMADSCIENCE = 'madscience'; // science without ethics boards
const TNOLINES = 'nolines'; // villain with no standards at all
const THYPOCRITE = 'hypocrite'; // preaches what they don't practice
const TBADBOSS = 'badboss'; // abuses their own minions
const TFREUDIANEXCUSE = 'freudianexcuse'; // villainy with a backstory reason
const TREASONABLE = 'reasonable'; // authority figure who actually listens
const TOBLIVIOUS = 'oblivious'; // comically misses the point
const TUNRAVELING = 'unraveling'; // sanity slipping, slowly
const TMOLE = 'mole'; // secretly working for the other side
const TATONER = 'atoner'; // seeking redemption for a past wrong
const TWORTHYFOE = 'worthyfoe'; // honorable enemy who respects the other side
const TTRANQUILFURY = 'tranquilfury'; // rage delivered quietly
const TSERIALKILLER = 'serialkiller'; // kills by pattern and compulsion
const TFAVORITEFOOD = 'favoritefood'; // trademark favorite food
const TMATCHMAKER = 'matchmaker'; // shipper on deck
const TOLDERTHANLOOKS = 'olderthanlooks'; // face and birthday disagree
const TBIGGOOD = 'biggood'; // anchor of the side of good
const TRIVAL = 'rival'; // defined by competing with someone
const TPREPARED = 'prepared'; // crazy-prepared contingencies
const TBLUNT = 'blunt'; // brutal honesty
const TDARKNOTEVIL = 'darknotevil'; // scary look, kind heart
const TMANCHILD = 'manchild'; // adult on playground instincts
const TSTEPFORD = 'stepford'; // the smile is load-bearing
const TALCOHOLIC = 'alcoholic'; // the bottle is a fixture
const TCHOSENONE = 'chosenone'; // destiny picked them
const TPETTY = 'petty'; // small-minded cruelty
const TMARRIED = 'married'; // happily married
const TSKEWEDPRIORITIES = 'skewedpriorities'; // worries about the wrong thing
const TSELFDEPRECATING = 'selfdeprecating'; // their favorite target is themselves

const TFACE = 'face';
const THEEL = 'heel';
const TSUPPORT = 'support';

const TMALE = 'male';
const TFEMALE = 'female';

function tagToDesc(tag) {
  switch (tag) {
    case TENERGETIC: // power, portrayal
      return "Energetic. ";
    case TLETHARGIC: // power, portrayal
      return "Lacks energy. ";
    case TTALKATIVE: // portrayal
      return "Doesn't stop talking talking talking. ";
    case TINTROVERT: // portrayal
      return "Doesn't talk very much. ";
    case TMEAN: // portrayal
      return "Straight up jerk who is mean to others. ";
    case TSWEET: // portrayal
      return "Sweet, kind, and generous. ";
    case TNURTURER: // portrayal
      return "Nurturing, improves the well-being of others. ";
    case TCARING: // portrayal
      return "Cares about others. ";
    case TRUTHLESS: // portrayal
      return "Ruthless, willing to dispose of anyone in the way. ";
    case TLEADER: // power, portrayal
      return "Strong leadership skills. ";
    case TFOLLOWER: // portrayal
      return "Prefers to follow orders. ";
    case TDISPOSABLE: // personal
      return "Not a necessary part of the story. ";
    case TNECESSARY: // power
      return `The team needs to keep ${p.him}, for some reason. `;
    case TBIG: // appearance
      return "Physically large. ";
    case TSMALL: // appearance
      return "Physically small. ";
    case TNAIVE: // portrayal, power
      return "Easily manipulated. ";
    case TFAKEDITZ: // portrayal (appears same as naive)
      return `Purposely appearing dumber than ${p.she} really is to avoid attention. `;
    case TSMART: // portrayal. Smart in itself is not a power base. There are many forms of smartness, power base those instead.
      return "";
    case TTACTICIAN: // power, portrayal
      return "Gifted tactician. ";
    case TTACTICLESS: // power, portrayal
      return "Poor tactical skills. ";
    case THEART: // power, portrayal
      return `The heart of ${p.his} team, keeps it together. `;
    case TEVERYMAN: // wealth, portrayal, meta
      return "An average person that everyone can relate with. ";
    case THAM: // portrayal
      return "LOUD AND GRANDOISE! ";
    case TMODEST: // portrayal, appearance
      return "Modest and down to earth. ";
    case TCLASSY: // portrayal, appearance
      return "Well dressed and cultured. ";
    case TSTRONG: // power
      return "Physically strong. ";
    case TWEAK: // power
      return "Physically weak, but not necessarily fragile. ";
    case TCHARISMATIC: // power
      return `Charming to the point where ${p.his} charisma is like a force. `;
    case TUNCHARISMATIC: // power
      return `Uncharismatic. Has trouble convincing others and offends people when ${p.she} doesn't intend to. `;
    // case TBALANCED:
    //   return "Balanced personality. ";
    // case TNUMBERTWO:
    //   return "Second in command. ";
    case TPOWERFUL: // power
      return "Influential and politically powerful. ";
    case THONORABLE: // private, power
      return "Honorable. ";
    case TDISHONORABLE: // private, power
      return `Pragmatic, often breaking rules if ${p.she} has a reason to. `;
    case TGREEDY: // private
      return "Greedy. ";
    case TASCETIC: // private
      return "Not attached. ";
    case TMANIPULATIVE: // power
      return "Skilled at manipulating others. ";
    case TRICH: // wealth, power
      return "Rich. ";
    case TPOOR: // wealth, power
      return "Poor. ";
    case TAMBITIOUS: // personal
      return "Ambitious goals and likely to succeed in them. ";
    case TBOSS: // private, power, wealth (best tools) - not good practice
      return `Boss. The most skilled person on ${p.his} team. `;
    case TLOVED: // power
      return `Loved by others, who don't want to see anything bad happening to ${p.him}. `;
    case THATED: // power
      return `Hated by others. Long list of people who wish to turn on ${p.him}. `;
    case TDREADED: // portrayal (other tags are power)
      return `Dreaded by others. ${p.His} name is used as a boogeyman. `;
    case TCOMMANDER: // wealth
      return "Commands a small army. ";
    case TPOSSE: // wealth
      return "Leads a small, loyal group. ";
    case TVESSEL: // wealth
      return "Owns a vessel. ";
    case TEXPOSITION: // personal (meta)
      return "";
    case TMIDDLEMANAGER: // power, personal/relations
      return `Leads a team, but has a boss of ${p.his} own. `;
    case TBUREAUCRAT: // power
      return "Holds a bureaucratic role. ";
    case TPACIFIST: // power
      return "Avoids violence where possible. ";
    case TVIOLENT: // power
      return "Solves problems with violence. ";
    case TMOREDAKKA: // personal, wealth
      return `If a problem isn't solvable with violence, ${p.she} resort to even bigger guns and explosives. `;
    case TAGGRESSIVE: // portrayal
      return "Eager to start fights. ";
    case TSADIST: // personal
      return "Delights in seeing others suffer. ";
    // case TINNOCENT: // portrayal
    //   return "Appears cuddly and innocent. ";
    case TTREACHEROUS: // personal
      return "Disloyal. ";
    case TLOYAL: // power, personal
      return "Loyal. ";
    case TINDIVIDUALISTIC: // power > portrayal
      return `Cares for ${p.herself} first, often selfish and narcisisstic. `;
    case TTEAMPLAYER: // power > portrayal
      return "Works best in a team. ";
    case TCOWARD: // personal - dirty coward, not simply selfish/individualistic but comboed with that
      return "Avoids trouble where possible. ";
    case TBRAVE: // portrayal, power - opposite to individualistic
      return "Brave. ";
    case TDEFENDER: // personal/relationship
      return "Defending someone either as part of a job or moral obligation. ";
    case TDEFENDED: // relationship, power
      return `Has someone else trying to defend ${p.him}. `;
    case TBADASS: // power  (portrayal is usually done elsewhere)
      return "Badass. Inspires awe and respect in allies, and fear in enemies. ";
    case TBADFIGHTER: // power
      return `Has poor fighting skills, relying on wit. Often surviving by the skin of ${p.his} teeth after a fight. `;
    case TBUTTMONKEY: // portrayal
      return "Often a target of demeaning jokes or bad luck. ";
    case THUMBLE: // portrayal
      return "Humble. ";
    case TARROGANT: // portrayal
      return "Arrogant and cocky. ";
    case TDETERMINED: // power
      return `Determined, extremely stubborn. Unstoppable until ${p.she} is dead. `;
    case TLAZY: // power
      return `Lazy. Doesn't do something even if ${p.she} could. `;
    case TGOODCAUSE: // personal
      return "Dedicated to a good cause, which inspires others. ";
    case TBADCAUSE: // personal
      return "Dedicated to a bad cause, which others try to prevent. ";
    case TPOINTLESSCAUSE: // personal
      return "Dedicated to a pointless, delusional cause that nobody understands. ";
    case TGOODMEANS:  // personal
      return "Tries to do the right thing. ";
    case TBADMEANS:  // personal
      return "Does the wrong thing, perhaps for a good cause. ";
    case TMYOPIC:  // personal
      return "Short-sighted goal that causes harm when achieved. ";
    case TGENRESAVVY: // personal > power
      return "Genre-savvy. Good situational awareness learned from stories. ";
    case TWISE: // power > portrayal
      return "Wise. Experienced, level-headed, gives good advice. ";
    case TINSANE: // power > portrayal
      return "Off the rails crazy. ";
    case TSANE: // power > portrayal
      return `Rational, with a realistic assessment of ${p.his} strengths and weaknesses. `;
    case TDISTRESSED: // power
      return "In trouble and in need of rescuing. ";
    case TACE: // portrayal
      return `So awesome at what ${p.she} does that ${p.she} make the heroes look bad. `;
    case TBITCH: // personal > portrayal
      return `Someone who everyone hates, despite ${p.his} strengths. `;
    case TLOVABLE: // personal > portrayal
      return `Someone who everyone loves, despite ${p.his} flaws. `;
    case TLOAD: // portrayal, comboed with bitch and necessary
      return `A burden on the team, often resulting from ${p.his} own laziness. `;
    case TOBSTRUCTIVE: // portrayal
      return "Obstructive. Purposely tries to make things difficult for someone. ";
    case TCONTRARIAN: // portrayal
      return "Disagrees with everything. ";
    case TYESMAN: // portrayal
      return "Agrees with everything. ";
    case TALLY: // none
      return "Helps out the main heroes, but isn't a part of the team. ";
    case TMYSTERIOUS: // portrayal
      return "Mysterious, with an obscured identity. ";
    case TTRAUMA: // personal/background
      return "Traumatized by past history. ";
    case TIDEALISTIC: // personal > power > portrayal
      return "Idealistic. Gives people the benefit of the doubt, repays cruelty with kindness.";
    case TCYNICAL: // portrayal
      return "Cynical. Assumes the worst will happen.";
    case TSTOIC: // power > portrayal
      return `Stoic. ${p.She} shows no reaction to extreme things, like provocation or death.`;
    case THOTBLOODED: // portrayal (power version is determinator)
      return "Extremely emotional, both positive and negative emotions. ";
    case TATTRACTIVE: // appearance
      return "Physically attractive. ";
    case TSEXY: // appearance
      return "Sexually appealing. ";
    case TUGLY: // appearance
      return "Ugly. ";
    case TJEALOUS: // personal
      return "Easily jealous of others. ";
    case TOBSESSED: // personal
      return "Currently obsessed with someone or something. ";
    case TNOBLE: // personal
      return "A good person deep down inside. ";
    case TIGNOBLE: // personal
      return "A nasty person deep down inside. "; // or makes mistakes
    case TSHORTFUSE: // personal
      return "Easily angered. ";
    case TLONGFUSE: // personal
      return "Difficult to anger. ";
    case TBERSERKBUTTON: // portrayal (combo with long fuse)
      return "Triggered by something. ";
    case TPOLITEANGER: // portrayal
      return "Polite when angry. ";
    case TEVIL: // personal
      return `Does evil simply because ${p.she} enjoys the thrill of being evil. `;
    case TGOOD: // personal
      return "Fights for justice and righteousness. ";
    case TVEGAN: // personal
      return "Does not eat meat, for moral or health reasons. ";
    case TSNARKY: // portrayal
      return "Makes snarky quips with a straight face. ";
    case TOBVIOUS: // portrayal
      return "Says obvious things that everyone knows. ";
    case THONEST: // personal
      return "Honest. ";
    case TLIAR: // personal
      return "Will lie, without having to cushion or justify the lie. ";
    case TCOLD: // portrayal
      return "Cold exterior, unwelcoming, pushes people away. ";
    case TWARM: // portrayal
      return "Friendly, gets along with others. ";
    case TANGST: // personal
      return "Has a lot of bottled up dread and fear, and may have given up on life. ";
    // case TINVENTOR: // power. merge into techie
    //   return "A brilliant inventor with the ability to create new things to solve problems the team is facing. ";
    case TTECHIE: // power
      return "Technically skilled in repair or even hacking things. ";
    case TSTREETSMART: // power
      return "Street smart. ";
    // case TBREAKSIT:
    //   return `Accomplishes ${p.his} goal but makes things worse. `;
    // case TFIXESIT:
    //   return "Tries to do a bad thing, but ends up making things better for the heroes. ";
    case TSTERN: // portrayal
      return "Stern disciplinarian. ";
    case TCANNIBAL: // personal
      return "Eats human flesh. ";
    case TEATER: // portrayal
      return "Eats a lot, often more than the rest of the team combined. ";
    case TTOUGH: // power
      return "Physically much tougher than expected. ";
    case TATTENTION: // personal
      return "Does things just to get attention. ";
    case TNOTMYFAULT: // portrayal
      return "Refuses to accept blame; often passing it to others. ";
    case TSELFBLAMING: // personal
      return `Blames ${p.herself} when ${p.she} can't save the day. `;
    case TSEXER: // personal
      return "Often seduces and sleeps around, then leaves them. ";
    case TCARETAKER: // personal/relationship
      return "Is carrying the burden of taking care of someone, where other family members pass the ball. ";
    case TCLUMSY: // portrayal
      return "Clumsy. ";
    case TINVESTIGATOR: // power, meta
      return "Skilled at investigating and moving the plot forward. ";
    case TNERD: // appearance [no power]
      return "Looks nerdy and clever. ";
    case TWOOBIE: // personal
      return `Has a sad story, making the audience feel sorry for ${p.him}. `;
    case TDERE: // personal
      return `Secretly sweet, kind, and generous to people who are close to ${p.him}. `;
    case TLUCKY: // personal
      return `Good things happen to ${p.him}, whether it's luck or karma. `;
    case TUNLUCKY: // personal
      return `Bad things happen to ${p.him}, whether it's just ${p.his} fault or bad luck. `;
    case TROGUE: // personal
      return "Not law abiding. ";
    case TCHRONICHERO: // personal
      return "Hero syndrome. Feels compelled to do help everyone. ";
    case TNEUTRAL: // personal
      return "Stays neutral. Does not take any side, even with the 'good guys'. ";
    // case TBURNEDOUT:
    //   return "Burned out from stress or moral pressure. ";
    case TWALKINGTHEEARTH: // wealth + power > portrayal
      return "Constantly travelling. No home, no job, no friends, and no visible means of support. ";
    case TANIMALSIDEKICK: // wealth/relations
      return "Has an animal sidekick. ";
    case TISOLATED: // wealth
      return "Isolated in a remote area, alone. ";
    case TLONER: // personal
      return "Wants to be left alone. ";
    case TCREEPY: // appearance
      return "Creepy. ";
    case TINSECURE: // personal
      return "Insecure. ";
    case TAFRAIDOFTHEMSELVES: // personal
      return `Fears ${p.his} own powers and what ${p.she} could become. `;
    case TLONERFREAK: // personal (*not* combo with loner)
      return "Developed anti-social habits from being isolated from society. ";
    case TSHY: // portrayal
      return "Extremely shy and may withdraw when talked to. ";
    case TNATURE: // portrayal
      return "Prefers nature to civilization. ";
    case TMENTOR: // personal/relationship
      return "Mentoring another character. ";
    case TFERAL: // personal/background/relationship > power
      return "Severely limited social skills and mental handicap, as a result from childhood abuse. ";
    case TFACE:
    case THEEL:
    case TSUPPORT:
      return "";
    default:
      return "";
  }
}

function tagToPortrayal(tag) {
  switch (tag) {
    case TENERGETIC:
      return randomArray([`${p.She} often paces about in idle moments.`,
        `${p.She} has a lot of stamina and keeps going when others stop.`]);
    case TLETHARGIC:
      return randomArray([`${p.She} often lazes about idly.`,
        `${p.She} often drags ${p.his} feet about and slows down the rest of the team.`]);
    case TTALKATIVE:
      return randomArray([`${p.She} will enter long conversations even with people ${p.she} just met.`,
        `People often wish ${p.she} would stop talking.`,
        `In a conversation, ${p.sdesc} often interrupts someone and talks more than needed.`]);
    case TINTROVERT:
      return randomArray([`${p.She} keeps to ${p.herself} and stays out of group activities.`,
        `${p.She} is usually the quiet one when there is a discussion.`]);
    case TMEAN:
      return randomArray([`${p.She} is eager to put others down and make them look bad.`,
        `${p.She} often yells and insults others, for no purpose other than showing that ${p.she} is superior.`]);
    case TSWEET:
      return randomArray([`${p.She} greets people by name, including the ones nobody else bothers with.`,
        `${p.She} notices when someone has gone quiet, and asks them about it.`]);
    case TNURTURER:
      return randomArray([`${p.She} often tries to motivate the rest of the team.`,
        `${p.She} makes sure that everyone in the team is looked after.`]);
    case TCARING:
      return randomArray([`People often feel at ease around ${p.him}.`,
        `Whenever someone is in trouble, ${p.sdesc} is often the first to help them.`]);
    case TRUTHLESS:
      return randomArray([`${p.She} shows little empathy for the plight of others.`,
        `${p.She} is impatient and rudely gets to the point.`,
        `${p.She} has the opinion that those who are unsuccessful have deserved to be so.`]);
    case TLEADER:
      return randomArray([`When the team's opinion is split, others often expect ${p.him} to make the decision.`,
        `${p.She} often calls the shots during a team exercise.`]);
    case TFOLLOWER:
      return randomArray([`${p.She} may disagree with the team, but follows consensus without argument.`,
        `${p.She} follows orders strictly and rarely does ${p.his} own plans.`]);
    case TNAIVE:
    case TFAKEDITZ:
      return randomArray([`${p.She} takes people at their word, and has been burned for it more than once.`,
        `${p.She} volunteers information nobody asked for, including things ${p.she} was told to keep quiet.`,
        `${p.She} tends to get into trouble, resulting from ${p.his} own stupidity.`,
        `Most jokes go above ${p.his} head.`]);
    case TSMART:
      return randomArray([`${p.She} easily grasps complicated situations and can debate them.`,
        `${p.She} enjoys intellectual conversations.`]);
    case TTACTICIAN:
      return randomArray([`${p.She} is eager to write up plans for solving a situation.`,
        `${p.She} pays a lot of attention to a situation and is quick to adjust the plan when things go wrong.`,
        `${p.Sdesc} is the one to quickly draft a plan before the meeting is over.`]);
    case TTACTICLESS:
      return randomArray([`${p.She} lives by the mantra of, "Everyone has a plan until they get punched in the mouth."`,
        `${p.She} rolls ${p.his} eyes when people start discussing plans.`]);
    case THEART:
      return randomArray([`Whenever the team is arguing, ${p.she} is the one who helps them reconcile their differences.`,
        `When someone on the team insists that a morally questionable action is necessary, ${p.sdesc} will be the one to question it`,
        `${p.Sdesc} goes out of ${p.his} way to help the helpless ones.`,
        `${p.She} acts as the moral anchor to keep the team from becoming too corrupted.`]);
    case TEVERYMAN:
      return randomArray([`${p.She} has turned down chances to move up, and meant it.`,
        `${p.She} talks about ${p.his} weekend more than the work in front of ${p.him}.`]);
    case THAM:
      return randomArray([`${p.She} doesn't have an indoor voice. Everything ${p.she} says is in loud volumes.`,
        `${p.She} announces ${p.his} own entrances.`,
        `${p.She} is often the center of attention because of ${p.his} loud words and loud actions.`]);
    case TMODEST:
      return randomArray([`${p.She} is approachable, down-to-earth, and comfortable to be around.`,
        `${p.She} is easy to talk to and often a good listener`]);
    case TCLASSY:
      return randomArray([`${p.She} is classy, alluring, and a bit of a snob.`,
        `${p.She} has a high opinion of ${p.herself} and expects others to think so as well.`]);
    //  No portrayal for strength, only power
    // case TSTRONG:
    // case TWEAK:
    case TCHARISMATIC:
      return randomArray([`${p.She} easily convinces others.`,
        `Strangers tell ${p.him} things they haven't told their friends.`,
        `${p.She} remembers the small details people mention in passing, and brings them up later.`]);
    case TUNCHARISMATIC:
      return randomArray([`Conversations with ${p.him} end a little sooner than they should.`,
        `${p.She} stands a bit too close, and doesn't notice people stepping back.`,
        `${p.She} pushes everyone away from being emotionally close.`,
        `${p.She} lingers after everyone else has left, looking for one more exchange.`]);
    case TPOWERFUL:
      return randomArray([`${p.She} stands straight and moves about confidently.`,
        `Others quiet down when ${p.she} speaks and pay attention and few talk back to what ${p.she} says.`]);
    case TDREADED:
      return randomArray([`${p.Sdesc} is feared by all. Others back away in ${p.his} presence, and would rather flee than fight ${p.him}.`,
        `Others cower when ${p.sdesc} is mentioned. Sometimes ${p.his} name is even used to scare them.`]);
    case TAGGRESSIVE:
      return randomArray([`${p.Sdesc} enjoys challenging others to a fight.`,
        `${p.Sdesc} never backs down when threatened, and instead gets more aggressive.`]);
    // case TINNOCENT:
    //   return randomArray([`${p.Sdesc} is adorably dorky.`, `${p.She} is socially inept, shy, and adorable.`,
    //     `${p.She} is sweet and cutesy.`, `${p.She} is adorably naive.`]);
    case TINDIVIDUALISTIC:
      return randomArray([`${p.She} resents it when others get more attention than ${p.his}, especially ${p.his} co-workers.`,
        `${p.Sdesc} might agree to a boss, but resentfully so.`,
        `${p.Sdesc} is egoistic and acts as if the whole world revolves around ${p.him}.`]);
    case TTEAMPLAYER:
      return randomArray([`${p.Sdesc} happily and eagerly follows orders.`,
        `${p.She} picks up the jobs nobody else volunteers for.`]);
    case TBRAVE:
      return randomArray([`${p.Sdesc} inspires the team with ${p.his} bravery.`,
        `${p.Sdesc} is calm when facing danger.`,
        `${p.She} volunteers for the part of the plan with the worst odds.`]);
    // case TBADASS:
    //   return randomArray([``,
    //     ``]);
    case TBUTTMONKEY:
      return randomArray([`${p.She} is often the target of demeaning jokes.`,
        `Everyone makes fun of ${p.sdesc}.`]);
    case THUMBLE:
      return randomArray([`${p.She} redirects credit to whoever was standing nearest.`,
        `${p.She} never shows off ${p.his} strengths.`]);
    case TARROGANT:
      return randomArray([`${p.She} never admits that ${p.she} is wrong.`,
        `${p.She} corrects people who were not wrong.`]);
    case TWISE:
      return randomArray([`${p.She} often gives good advice.`,
        `${p.She} is mature, and many people respect ${p.him} for it.`]);
    case TINSANE:
      return randomArray([`Everyone considers ${p.sdesc} crazy and nobody takes ${p.him} seriously.`,
        `${p.She} is off the rails crazy, and usually very insistent in what ${p.she} believes.`]);
    case TSANE:
      return randomArray([`${p.Sdesc} might have a little contempt towards the crazy team ${p.she} finds ${p.herself} in.`,
        `${p.Sdesc} is the one of the few that everyone takes seriously.`]);
    case TACE:
      return randomArray([`${p.Sdesc} is a benchmark for how good a person can get.`,
        `${p.Sdesc} far outclasses the protagonist and their team.`]);
    case TBITCH:
      return randomArray([`Many people hate ${p.sdesc} and talk behind ${p.his} back, but most are cooperative in person.`,
        `Rooms go quiet when ${p.she} walks in, and start up again ${p.his} way once ${p.she} leaves.`,
        `Meetings get rescheduled the moment someone learns ${p.sdesc} will be there.`,
        `${p.Sdesc} gets agreement in the meeting and resistance everywhere else.`]);
    case TLOVABLE:
      return randomArray([`People invent reasons to sit near ${p.him}.`,
        `The mood of the room lightens up when ${p.she} is around.`,
        `Even ${p.his} mistakes get retold later as fond stories.`,]);
    case TLOAD:
      return randomArray([`${p.Sdesc} is dead weight who makes things harder for everyone else`,
        `${p.She} is a burden on the team, often resulting from ${p.his} own laziness.`]);
    case TOBSTRUCTIVE:
      return randomArray([`${p.Sdesc} uses ${p.his} position to make things difficult for others.`,
        `${p.She} raises a fresh objection each time the last one is answered.`]);
    case TCONTRARIAN:
      return randomArray([`${p.Sdesc} actively pokes holes in the plans of others, opposing them, and complain about everything they do.`,
        `${p.She} can be an annoying advisor who offers excessive criticism and proposes nothing helpful.`]);
    case TYESMAN:
      return randomArray([`${p.Sdesc} is quick to agree to everything ${p.his} boss proposes.`,
        `Whatever your religious or political opinion, ${p.sdesc} agrees with it.`]);
    case TMYSTERIOUS:
      return randomArray([`${p.She} answers questions about ${p.herself} with questions.`,
        `Little is publicly known about ${p.him}, and ${p.she} keeps it that way.`]);
    case TIDEALISTIC:
      return randomArray([`${p.Sdesc} repays cruelty with kindness.`,
        `${p.She} will repay cruelty with kindness, and anger with calm.`,
        `${p.She} keeps looking for the reading of events in which nobody meant any harm.`]);
    case TCYNICAL:
      return randomArray([`${p.She} asks what someone stands to gain before ${p.she} asks anything else.`,
        `${p.She} is distrustful of human sincerity.`]);
    case TSTOIC:
      return randomArray([`${p.Sdesc} shows no reaction to any provocation or humor.`,
        `People read ${p.his} mood by guesswork, and get it wrong.`]);
    case THOTBLOODED:
      return randomArray([`${p.She} is extremely passionate about everything ${p.she} does and gives it 110%.`,
        `${p.She} never does anything half-hearted. Everything ${p.she} does is taken to the extreme.`]);
    case TBERSERKBUTTON:
      return randomArray([`Certain things trigger ${p.sdesc} into a berserk rage.`,
        `${p.Sdesc} is insecure about a certain physical trait, and bringing it up will make ${p.him} furious.`]);
    case TPOLITEANGER:
      return randomArray([`When angry, ${p.she} will simply vent ${p.his} frustration in polite words.`,
        `When angry, ${p.she} never shouts or slams ${p.his} fists down, but politely expresses ${p.his} rage.`]);
    case TSNARKY:
      return randomArray([`${p.She} answers sincere questions with a joke at the asker's expense.`,
        `Every response by ${p.sdesc} is snarky and sarcastic.`]);
    case TOBVIOUS:
      return randomArray([`${p.Sdesc} states the obvious. Sometimes for story exposition purposes.`,
        `${p.Sdesc} will often say obvious things to make the plot clear.`]);
    case TCOLD:
      return randomArray([`${p.She} doesn't get along with people, and finds them annoying.`,
        `${p.She} is distrustful and avoids being attached to others.`,
        `${p.She} lets a question sit unanswered until someone else fills the silence.`]);
    case TWARM:
      return randomArray([`${p.She} remembers what people are worried about and checks back on it.`,
        `${p.She} makes room for whoever arrived last.`]);
    case TSTERN:
      return randomArray([`${p.She} has an intimidating, stern tone.`,
        `${p.She} names the rule that was broken before ${p.she} asks why.`]);
    case TEATER:
      return randomArray([`${p.Sdesc} eats more than the rest of ${p.his} team combined.`,
        `${p.Sdesc} will finish several plates per meal, chomping it all down quickly.`]);
    case TNOTMYFAULT:
      return randomArray([`${p.Sdesc} absolutely refuses to accept responsibility for ${p.his} mistakes.`,
        `${p.She} will push the blame to others whenever ${p.she} makes a mistake.`]);
    case TCLUMSY:
      return randomArray([`${p.She} tends to trip, drop things, and frequently makes mistakes.`,
        `${p.She} bumbles and fumbles at almost anything ${p.she} does.`]);
    case TWALKINGTHEEARTH:
      return randomArray([`${p.She} seems to be a traveller. Nobody knows ${p.him} and ${p.she} keeps no roots.`,
        `${p.She} is always out seeking adventure, never staying rooted in any one place for long.`]);
    case TCATCHPHRASE:
      return randomArray([`${p.She} has a verbal tic ${p.she} says as a matter of habit, like "Uh huh" or "you know..."`,
        `${p.She} has a catch-phrase for saying goodbye.`,
        `${p.She} shouts a signature battle cry before a fight.`,
        `${p.She} mutters the same curse whenever ${p.she} fails at something.`]);
    case TENFORCER:
      return randomArray([`${p.She} stands at ${p.his} boss's shoulder and handles whatever needs handling.`,
        `When the boss wants something done personally, ${p.sdesc} is who gets sent.`]);
    case TSTANDARDS:
      return randomArray([`There is one line ${p.she} will not cross, and ${p.she} holds open contempt for those who do.`,
        `${p.She} refuses certain jobs flat, no matter the pay.`]);
    case TVINDICTIVE:
      return randomArray([`${p.She} answers the smallest slight with overwhelming payback.`,
        `${p.She} keeps score of every offense, and the interest rate is brutal.`]);
    case TMADSCIENCE:
      return randomArray([`${p.She} talks about ${p.his} experiments with an enthusiasm that makes people back away slowly.`,
        `${p.She} considers safety protocols a failure of imagination.`]);
    case THYPOCRITE:
      return randomArray([`${p.She} loudly preaches standards ${p.she} never holds ${p.herself} to.`,
        `${p.His} rules, it turns out, apply to everyone but ${p.him}.`]);
    case TBADBOSS:
      return randomArray([`${p.She} treats ${p.his} own underlings as disposable, and they know it.`,
        `Working for ${p.sdesc} is widely considered more dangerous than opposing ${p.him}.`]);
    case TREASONABLE:
      return randomArray([`When someone brings ${p.him} a wild story, ${p.she} hears it out before judging.`,
        `${p.She} uses ${p.his} authority sensibly, which surprises everyone used to worse.`]);
    case TOBLIVIOUS:
      return randomArray([`${p.She} walks away from every conversation with exactly the wrong lesson.`,
        `Sarcasm, hints, and outright warnings all sail past ${p.him} at altitude.`]);
    case TUNRAVELING:
      return randomArray([`${p.His} behavior has been getting stranger lately, a little at a time.`,
        `People who knew ${p.him} before have started trading concerned looks.`]);
    case TWORTHYFOE:
      return randomArray([`${p.She} treats ${p.his} enemies with respect, and fights them fairly.`,
        `${p.She} would rather lose clean than win ugly, and salutes a good opponent.`]);
    case TTRANQUILFURY:
      return randomArray([`When truly angry, ${p.she} goes very quiet, and everyone who knows ${p.him} clears the room.`,
        `${p.His} rage never raises its voice, which makes it far more frightening.`]);
    case TFAVORITEFOOD:
      return randomArray([`${p.She} is never far from ${p.his} favorite food, and everyone knows what it is.`,
        `${p.She} can be bribed, reliably, with one particular dish.`]);
    case TMATCHMAKER:
      return randomArray([`${p.She} has decided which two people belong together, and is forever nudging them.`,
        `${p.She} ships ${p.his} friends shamelessly and schemes to get them alone together.`]);
    case TBIGGOOD:
      return randomArray([`Others rally to ${p.him} when things are darkest.`,
        `${p.She} is the moral center the whole side of good organizes around.`]);
    case TRIVAL:
      return randomArray([`Everything ${p.she} does is measured against one particular person.`,
        `${p.She} has a rival, and beating them matters more than winning.`]);
    case TPREPARED:
      return randomArray([`${p.She} has a contingency plan for scenarios nobody else even imagined.`,
        `Whatever goes wrong, ${p.she} somehow packed for it.`]);
    case TBLUNT:
      return randomArray([`${p.She} tells the unvarnished truth, comfort be damned.`,
        `${p.She} does not cushion bad news, and considers it a kindness.`]);
    case TDARKNOTEVIL:
      return randomArray([`People cross the street to avoid ${p.him}, then ${p.she} helps someone carry groceries.`,
        `${p.His} looks say villain; ${p.his} actions say the kindest person in the room.`]);
    case TMANCHILD:
      return randomArray([`${p.She} is an adult running on playground instincts.`,
        `${p.His} tastes, tantrums, and enthusiasms all stopped maturing years ago.`]);
    case TALCOHOLIC:
      return randomArray([`${p.She} is rarely far from a drink, and gets twitchy when one isn't available.`,
        `${p.His} relationship with the bottle is the worst-kept secret around.`]);
    case TPETTY:
      return randomArray([`For all ${p.his} menace, ${p.she} spends real effort on small, spiteful cruelties.`,
        `${p.She} will derail ${p.his} own plans to settle some tiny score.`]);
    case TMARRIED:
      return randomArray([`${p.She} is happily married, and it grounds everything ${p.she} does.`,
        `${p.She} checks in with ${p.his} spouse before anything risky, and means it.`]);
    case TSKEWEDPRIORITIES:
      return randomArray([`In every crisis, ${p.she} worries about exactly the wrong detail.`,
        `The building could be burning and ${p.she} would be rescuing the houseplants.`]);
    case TSELFDEPRECATING:
      return randomArray([`${p.His} favorite target of mockery is ${p.herself}.`,
        `${p.She} gets the insult in about ${p.herself} before anyone else can.`]);
    case TFACE:
    case THEEL:
    case TSUPPORT:
      return "";
    default:
      return "";
  }
}

// Consider replacing this with treasure table
function tagToAppearance(tag) {
  switch (tag) {
    case TBIG:
      return randomArray([`${p.She} has broad shoulders and stands well above others.`,
        `${p.She} is big and beefy.`]);
    case TSMALL:
      return randomArray([`${p.She} is short.`,
        `${p.She} is cute and petite.`]);
    case TMODEST:
      return randomArray([`${p.She} is dressed casually.`,
        `${p.She} wears simple, modest clothing.`]);
    case TCLASSY:
      return randomArray([`${p.She} is well-dressed, has a well-groomed appearance.`,
        `${p.She} wears classy, expensive clothes and accessories.`]);
    // Strength can generate specific tropes, but don't put this in yet
    // case TSTRONG:
    // case TWEAK:
    // Same with charisma - characters with good charisma have nice portrayal but can be ugly. Use pretty for good looking, sexy for clothing
    // case TCHARISMATIC:
    // case TUNCHARISMATIC:
    // case TGREEDY:
    //   return randomArray([`${p.She} is overdressed and wearing a good amount of jewelry.`,
    //     `${p.She} wears luxurious clothing.`]);
    // case TASCETIC:
    //   return randomArray([`${p.She} wears minimalist clothing and ${p.his} home and possessions are similarly simple.`,
    //     `${p.She} wears tattered, cheap clothing. Some appear several years old and have been patched.`]);
    case TSEXY:
      return randomArray([`${p.She} has less clothes than is modest, but wears the look well.`,
        `${p.His} clothes show off ${p.his} well-defined body.`]);
    case TATTRACTIVE:
      return randomArray([`${p.She} is very attractive.`,
        `${p.Sdesc} is good-looking and has a great smile.`]);
    case TUGLY:
      return randomArray([`${p.She} has a distorted face.`,
        `${p.His} is out of shape.`]);
    case TNERD:
      return randomArray([`${p.She} wears thick glasses and slouches.`,
        `${p.She} is skinny and uses an inhaler.`,
        `${p.She} has acne and a high-pitched laugh.`,
        `${p.She} is fat and wears thick glasses.`]);
    case TCREEPY:
      // Mood only — hair, skin, and clothing belong to the appearance and
      // clothing layers now, and the old lines contradicted them.
      return randomArray([`Strangers give ${p.him} space without quite knowing why.`,
        `Something in ${p.his} stillness makes people glance at the exits.`]);
    case TOLDERTHANLOOKS:
      return randomArray([`${p.She} looks a decade or more younger than ${p.she} actually is.`,
        `${p.His} face and ${p.his} birthday disagree, and strangers guess wrong every time.`]);
    case TDARKNOTEVIL:
      return randomArray([`${p.She} dresses in black and reads as dangerous from across the street.`,
        `Everything about ${p.his} look — the dark clothes, the sharp silhouette — says villain.`]);
    default:
      return "";
  }
}

function tagToPowerBase(tag) {
  switch (tag) {
    case TENERGETIC:
      return randomArray([`${p.Sdesc} has endless energy and doesn't tire easily.`,
        `${p.Sdesc} is tireless and easily outworks others.`]);
    case TLETHARGIC:
      return randomArray([`${p.Sdesc} is lazy.`,
        `${p.Sdesc} has ${p.his} strengths, but can be outworked by others.`]);
    case TLEADER:
      return randomArray([`${p.She} has excellent leadership skills.`,
        `${p.She} is able to put together a team and solve problems.`]);
    case TNECESSARY:
      return randomArray([`${p.She} has knowledge that make ${p.him} necessary to the team.`,
        `${p.She} is the only one with a set of skills that make ${p.him} indispensable.`,
        `${p.She} owns or is the only one who can operate a plot device.`,
        `Under the circumstances, the team needs ${p.him}.`]);
    // Smart in itself is not a power base. There are many forms of smartness, power base those instead.
    // case TSMART:
    case TTACTICIAN:
      return randomArray([`${p.She} will normally analyze the strengths and weaknesses of the enemy, identify the right thing to do, and come up with a plan.`,
        `${p.She} has clear goals and relies on ${p.his} intelligence and tactics to save the day.`,
        `${p.She} is an expert in manipulating events, situations, and circumstances to suit ${p.his} plans. ${p.She} often plans events to happen in a certain order, that others may not anticipate. ${p.She} has several layers of backup and misdirection.`]);
    case TTACTICLESS:
      return randomArray([`${p.She} is easily outsmarted.`,
        `${p.His} ego often blinds ${p.him} from proper planning and ${p.she} easily falls into traps.`]);
    case THEART:
      return randomArray([`${p.She} keeps the team from bickering and falilng apart.`,
        `${p.She} acts as the moral compass and heart of the team.`]);
    case TSTRONG:
      return randomArray([`${p.She} lifts heavy objects easily and has immense strength.`,
        `${p.She} is blessed with a lot of strength.`]);
    case TWEAK:
      return randomArray([`${p.She} has difficulty with feats of strength.`,
        `${p.She} has the strength of a child or old person.`]);
    case TCHARISMATIC:
      return randomArray([`${p.She} is able to talk ${p.his} way out of trouble and convince others to follow ${p.his} cause.`,
        `${p.His} charisma is like a force, able to move obstacles out of the way.`]);
    case TUNCHARISMATIC:
      return randomArray([`${p.She} often gets into trouble because ${p.his} behavior rubs people the wrong way.`,
        `Others often wish ${p.him} bad luck because of ${p.his} temperament.`]);
    case TPOWERFUL:
      return randomArray([`${p.She} has immense political influence, able to influence governments.`,
        `${p.Sdesc} has many allies in high places.`,
        `${p.She} is said to have bought out many leaders.`,]);
    case THONORABLE:
      return randomArray([`${p.She} is respected by even ${p.his} enemies.`,
        `${p.Sdesc} has a strong code of ethics and has many supporters because of it.`,
        `${p.She} is extremely honorable, and willing to stick to ${p.his} values even when it is illogical`]);
    case TDISHONORABLE:
      return randomArray([`${p.Sdesc} will stop at nothing to win. ${p.She} will break treaties and agreements and backstab allies.`,
        `${p.She} will utilize underhanded tactics to win.`]);
    case TMANIPULATIVE:
      return randomArray([`${p.She} relies on ${p.his} charisma and cunning to control others.`,
        `${p.She} has a strong understanding of the current situation and able to manipulate that to ${p.his} advantage.`]);
    case TRICH:
      return randomArray([`${p.Sdesc} has a lot of wealth at ${p.his} disposal.`,
        `${p.Sdesc} has no financial issues and often throws money at the problem.`]);
    case TPOOR:
      return randomArray([`${p.Sdesc} lives paycheck to paycheck.`,
        `${p.Sdesc} can't afford many of the things ${p.she} needs.`]);
    case TBOSS:
      return randomArray([`${p.She} is the most skilled member of ${p.his} team, by a far margin.`,
        `The people who taught ${p.him} now quote ${p.him}.`]);
    case TLOVED:
      return randomArray([`Someone out there loves ${p.sdesc} deeply.`,
        `${p.Sdesc} is loved by someone.`]);
    case THATED:
      return randomArray([`${p.She} has made many enemies who now conspire against ${p.him}.`,
        `${p.She} is hated and others look for an opportunity to backstab ${p.him}.`]);
    case TPACIFIST:
      return randomArray([`${p.She} avoids using violence as a solution to ${p.his} problems.`,
        `${p.She} has learned to solve problems well, without any violence.`]);
    case TMIDDLEMANAGER:
      return randomArray([`${p.She} has people to report to, but is in full command of a team.`,
        `${p.She} has full authority over a team, but is supplied resources and assigned tasks by a boss.`]);
    case TBUREAUCRAT:
      return randomArray([`${p.Sdesc} has a moderate amount of bureaucratic power, enough to make it difficult for others.`,
        `${p.She} holds a bureaucratic position, with modest power.`]);
    case TVIOLENT:
      return randomArray([`${p.Sdesc} is well-prepared to solve ${p.his} problems with violence.`,
        `${p.She} quickly resorts to violence to settle ${p.his} problems.`]);
    case TLOYAL:
      return randomArray([`Many in ${p.his} team are willing to go to lengths for ${p.him}.`,
        `${p.Sdesc} is trusted by ${p.his} team.`]);
    case TINDIVIDUALISTIC:
      return randomArray([`${p.Sdesc} is only focused on ${p.his} own survival and well-being.`,
        `${p.Sdesc} would happily abandon someone who just rescued them.`,
        `${p.Sdesc} would break laws and ethics for ${p.his} own personal profit.`]);
    case TTEAMPLAYER:
      return randomArray([`${p.Sdesc} would sacrifice themselves for the team, and vice versa.`,
        `${p.Sdesc} works well in a team, and brings out the best in others.`]);
    case TBRAVE:
      return randomArray([`${p.Sdescs} team is willing to go into danger, inspired by ${p.his} bravery.`,
        `${p.Sdesc} is willing to take risks.`, `${p.Sdesc} is unlikely to panic.`]);
    case TDEFENDED:
      return randomArray([`${p.Sdesc} has someone watching ${p.his} back.`,
        `Someone out there is willing to violently defend ${p.sdesc}.`]);
    case TBADASS:
      return randomArray([`${p.Sdesc} is incredibly powerful.`,
        `${p.Sdesc} is one of the best at what ${p.she} does.`]);
    case TBADFIGHTER:
      return randomArray([`${p.She} has poor fighting skills, and relies on wit and cunning during a fight.`,
        `${p.Sdesc} is a poor fighter, often surviving by the skin of ${p.his} teeth after a fight.`]);
    case TDETERMINED:
      return randomArray([`You can beat ${p.him} but not break ${p.him}.`,
        `${p.Sdesc} is extremely stubborn and determined. ${p.She} is unstoppable as long as ${p.she} is not dead.`]);
    case TLAZY:
      return randomArray([`${p.Sdesc} refers to delegate work to someone else and avoids any work ${p.herself}.`,
        `${p.She} often doesn't take action unless absolutely necessary.`]);
    case TGENRESAVVY:
      return randomArray([`${p.She} can spot traps and is alert to suspicious situations.`,
        `${p.She} can identify and expose parts of the plot that isn't obvious to ${p.his} teammates`]);
    case TWISE:
      return randomArray([`${p.Sdesc} is experienced and level-headed.`,
        `${p.Sdesc} is able to think around problems too big to solve.`]);
    case TINSANE:
      return randomArray([`${p.Sdesc} is good at thinking outside the box. ${p.She} is rarely correct, but sometimes is the only one who is.`,
        `${p.She} has mental issues or has seen too much. But sometimes ${p.she} just might be right.`]);
    case TSANE:
      return randomArray([`${p.Sdesc} has realistic assessment of the situation and ${p.his} own strengths and weaknesses.`,
        `${p.She} is very rational, especially when others are corrupt, clueless, or incompetent.`]);
    case TDISTRESSED:
      return randomArray([`${p.Sdesc} is trapped under ${p.his} circumstances. ${p.She} awaits a rescuer, but may rescue ${p.herself} if lucky.`,
        `${p.Sdesc} is kept prisoner. ${p.She} awaits a rescuer, but may rescue ${p.herself} if lucky.`,
        `${p.Sdesc} is lost. ${p.She} awaits a rescuer, but may rescue ${p.herself} if lucky.`]);
    case TIDEALISTIC:
      return randomArray([`Others admire ${p.sdescs} morals and resolve and try to assist ${p.him}.`,
        `${p.Sdesc} is relentlessly optimistic, even at the worst times, and things often go ${p.his} way.`]);
    case TSTOIC:
      return randomArray([`${p.She} is calm and unaffected by problems, like injury or disaster.`,
        `Only very extreme things, like death, can shake ${p.his} resolve.`]);
    case TTECHIE:
      return randomArray([`${p.She} is technically skilled in repair or even hacking things.`,
        `${p.Sdesc} is gifted with technology and engineering. ${p.She}'s often the person on the team who builds and repairs devices.`,
        `${p.She} is a brilliant inventor with the ability to create new things to solve problems the team is facing.`,
        `${p.Sdesc} actively experiments with new things. ${p.She} is gifted in inventing new items that helps out their team.`]);
    case TSTREETSMART:
      return randomArray([`${p.She} doesn't easily fall for tricks and traps set up by ${p.his} rivals.`,
        `${p.Sdesc} is street smart. ${p.She} knows how to outsmart and convince foes and enemies.`]);
    case TTOUGH:
      return randomArray([`${p.Sdesc} can take a surprising amount of damage and injury.`,
        `${p.Sdesc} is much tougher than ${p.she} looks. ${p.She} is not invincible, but ${p.she} has a boxer's physique.`]);
    case TINVESTIGATOR:
      return randomArray([`${p.She} is skilled at investigating and moving the plot forward.`,
        `${p.Sdesc} is skilled in investigation, finding intel, and convincing people to admit things they otherwise wouldn't.`]);
    case TWALKINGTHEEARTH:
      return randomArray([`${p.She} has some kind of skill that's good enough to make money wherever ${p.she} goes.`,
        `${p.She} is able to scavenge and survive wherever ${p.she} goes.`]);
    case TFERAL:
      return randomArray([`${p.Sdesc} has severely limited social skills and mental handicap.`,
        `${p.She} has very poor language skills, barely enough to communicate, and unable to learn more.`]);
    case TMADSCIENCE:
      return randomArray([`${p.She} can build things that shouldn't work, and occasionally shouldn't exist.`,
        `${p.His} inventions solve problems nobody else can touch — with side effects nobody else would accept.`]);
    case TPREPARED:
      return randomArray([`Whatever the situation calls for, ${p.she} already has it stashed somewhere.`,
        `${p.His} contingency plans have contingency plans.`]);
    case TCHOSENONE:
      return randomArray([`Coincidence sides with ${p.him} often enough to feel deliberate.`,
        `Whatever marked ${p.him} as chosen came with power to match the burden.`]);
    case TENFORCER:
      return randomArray([`${p.She} is the most dangerous piece on ${p.his} boss's board.`,
        `${p.She} has authority to act in ${p.his} boss's name, and the muscle to back it.`]);
    case TBIGGOOD:
      return randomArray([`${p.His} word carries weight with every faction on the side of good.`,
        `Allies ${p.she} has helped over the years will answer when ${p.she} calls.`]);
    case TFACE:
    case THEEL:
    case TSUPPORT:
      return "";
    default:
      return "";
  }
}

function tagToBackground(tag) {
  return "";
}

function tagToHiddenPersonality(tag) {
  switch (tag) {
    case TDISPOSABLE:
      return randomArray([`${p.She} is unneeded by the team.`,
        `${p.She} is disposable.`]);
    case TFAKEDITZ:
      return randomArray([`${p.She} acts dumber than ${p.she} is, to avoid being stigmatized.`,
        `${p.She} acts dumb to avoid responsibility, either out of laziness or lack of confidence.`]);
    // already in power base
    // case THONORABLE:
    //   return randomArray([`${p.She} sticks strongly to ${p.his} ethics.`,
    //     `${p.She} has a strict code of honor.`,
    //     `${p.She} is extremely honorable, and willing to stick to ${p.his} values even when it is illogical`]);
    // case TDISHONORABLE:
    //   return randomArray([`${p.She} is willing to do anything to win a fight. ${p.She} is not restricted to chivalry or any other rules to engage fairly.`,
    //     `${p.She} will use underhanded tactics and other acts of radical terrorism.`]);
    case TGREEDY:
      return randomArray([`${p.She} tries to make as much money and power as possible.`,
        `${p.She} prioritizes wealth above all other things.`]);
    case TASCETIC:
      return randomArray([`${p.She} does not care much for money and power.`,
        `${p.She} often donates what excess wealth ${p.she} has.`]);
    case TAMBITIOUS:
      return randomArray([`${p.She} has ambitious goals and often succeeds in style.`,
        `${p.She} has grand plans.`]);
    case TBOSS:
      return randomArray([`${p.She} is the most powerful of ${p.his} forces, and far more competent than ${p.his} next in command.`,
        `${p.She} is terrifyingly competent at what ${p.she} does.`]);
    case TEXPOSITION:
      return randomArray([`${p.Sdesc} provides exposition to the audience.`,
        `${p.Sdesc} narrates to the audience.`]);
    case TSADIST:
      return randomArray([`${p.She} likes to play sadistically with ${p.his} enemies.`,
        `${p.She} delights in the pain of others.`, `${p.Sdesc} is an insane and sadistic person.`]);
    case TTREACHEROUS:
      return randomArray([`${p.She} plans to overthrow the big guy everyone else fears and take ${p.his} place.`,
        `${p.Sdesc} often sabotages ${p.his} boss's plans.`]);
    case TLOYAL:
      return randomArray([`${p.Sdesc} is extremely loyal.`,
        `${p.She} is willing to die for ${p.his} team.`]);
    case TCOWARD:
      return randomArray([`${p.Sdesc} is completely self-serving, dedicated to ${p.his} own survival.`,
        `${p.Sdesc} is a dirty coward.`]);
    case TDEFENDER:
      return randomArray([`${p.Sdesc} is fiercely, almost violently protective of someone.`,
        `${p.Sdesc} is protecting someone as a moral obligation.`,
        `${p.Sdesc} is protecting someone as a social obligation.`]);
    case TGOODCAUSE:
      return randomArray([`${p.Sdesc} is dedicated to a good cause, which inspires others.`,
        `${p.Sdesc} wants to save the world, and is willing to die to do so.`,
        `${p.Sdesc} is very dedicated to a noble cause.`]);
    case TBADCAUSE:
      return randomArray([`${p.Sdesc} is very dedicated to a cause. ${p.His} reasoning is noble, but the goal isn't.`,
        `${p.Sdesc} is dedicated to a bad cause, which others try to prevent.`,
        `${p.Sdesc} truly believes ${p.she} is right. ${p.She} is dedicated to a dangerous cause, and refuses to be convinced otherwise.`]);
    case TPOINTLESSCAUSE:
      return randomArray([`${p.She} is dedicated to a pointless, delusional cause that nobody understands.`,
        `${p.Sdesc} is very dedicated to a noble cause. Only problem is that ${p.she} is straight up delusional and it's all a part of ${p.his} imagination.`]);
    case TGOODMEANS:
      return randomArray([`${p.She} tries to do the right thing.`,
        `${p.She} has noble reasons to do what ${p.she} is doing.`]);
    case TBADMEANS:
      return randomArray([`${p.She} does the wrong thing, perhaps for a good cause.`,
        `${p.She} is willing to do anything, to achieve ${p.his} noble goal, including torture, murder, and child labor.`]);
    case TMYOPIC:
      return randomArray([`${p.Sdesc} does not pay attention to the consequences. For example, ${p.she} may try to overthrow a cruel tyrant, without caring that it would just create a power vacuum for an even worse tyrant.`,
        `${p.She} is ignorant to the side effects of ${p.his} actions. For example, someone whose goal is to make the neighborhood safe, by putting them under the protection of a local gang.`]);
    case TGENRESAVVY:
      return randomArray([`${p.She} is genre-savvy. ${p.She} has good situational awareness learned from stories.`,
        `${p.Sdesc} has good situational awareness, which ${p.she} may have learned from stories.`]);
    case TBITCH:
      return randomArray([`${p.Sdesc} regularly abuses ${p.his} power to strengthen ${p.his} grasp on it.`,
        `${p.She} regularly makes life difficult for others.`]);
    case TLOVABLE:
      return randomArray([`Someone the audience loves despite ${p.his} flaws.`,
        `Despite whatever ${p.sdesc} does, ${p.she} also does enough good to be lovable.`]);
    case TTRAUMA:
      return randomArray([`${p.She} was traumatized by past abuse.`,
        `${p.Sdesc} has survived a traumatic situation`, `${p.Sdesc} was once deeply damaged by a tragedy`]);
    case TIDEALISTIC:
      return randomArray([`${p.Sdesc} is idealistic and gives mean people the benefit of the doubt.`,
        `${p.She} loves everyone, even those who hate ${p.him}.`]);
    case TJEALOUS:
      return randomArray([`${p.Sdesc} is easily jealous of others.`,
        `${p.She} can be possessive and psychotically jealous.`,
        `${p.Sdesc} hates the hero for having friends and attention.`]);
    case TOBSESSED:
      return randomArray([`${p.Sdesc} is often obsessed with something ${p.she} loves.`,
        `${p.Sdesc} is stalking another character ${p.she} has a crush on. This may be creepy or cute depending on the circumstances.`]);
    case TNOBLE:
      return randomArray([`${p.She} is a little more mature than the rest of the team.`,
        `${p.She} may not be perfect, but ${p.she} has good intentions.`]);
    case TIGNOBLE:
      return randomArray([`${p.She} is a nasty person deep down inside.`,
        `${p.Sdesc} does deeds that violates ${p.his} moral values every now and then.`]);
    case TSHORTFUSE:
      return randomArray([`${p.His} friends keep a list of safe topics, and it keeps getting shorter.`,
        `${p.She} is easily triggered.`]);
    case TLONGFUSE:
      return randomArray([`It takes a lot to make ${p.sdesc} angry.`,
        `${p.Sdesc} is slow to anger.`]);
    case TEVIL:
      return randomArray([`Does evil simply because ${p.she} enjoys the thrill of being evil.`,
        `${p.Sdesc} is evil simply because ${p.she} enjoys it. There is no deeper meaning and ${p.she} can't be reasoned with.`,
        `${p.Sdesc} is evil, because ${p.she} treats it as a kind of sport to excel in.`]);
    case TGOOD:
      return randomArray([`${p.Sdesc} fights evil for justice and righteousness.`,
        `${p.She} fights to make sure everyone gets the justice they deserve.`]);
    case TVEGAN:
      return randomArray([`${p.She} does not eat meat, for moral reasons.`,
        `${p.Sdesc} does not eat meat, for health reasons.`]);
    case THONEST:
      return randomArray([`${p.Sdesc} is a bad liar.`,
        `${p.She} refuses to lie or cheat someone.`]);
    case TLIAR:
      return randomArray([`${p.Sdesc} has no issues with straight up lying, without having to cushion or justify the lie.`,
        `${p.She} will lie to people with a straight face.`]);
    case TANGST:
      return randomArray([`${p.Sdesc} has a lot of bottled up dread and fear, and may have given up on life.`,
        `${p.She} is anxious for what the future holds, and at ${p.his} wits' end.`]);
    case TCANNIBAL:
      return randomArray([`${p.Sdesc} enjoys the taste of human flesh.`,
        `${p.Sdesc} quietly eats human flesh out of some morbid curiosity.`]);
    case TATTENTION:
      return randomArray([`${p.Sdesc} is faking a condition to get attention and sympathy.`,
        `${p.Sdesc} is faking a condition for money.`,
        `${p.Sdesc} is faking a condition to get attention and troll others.`]);
    case TSELFBLAMING:
      return randomArray([`${p.She} is hard on ${p.herself} when things go wrong.`,
        `${p.Sdesc} blames ${p.herself} for ${p.his} team's failures.`]);
    case TSEXER:
      return randomArray([`${p.His} main goal in life is indulging ${p.his} lust, conquering one woman after another.`,
        `${p.She} relentlessly pursues women, has sex with them, and then abandons them.`]);
    case TCARETAKER:
      return randomArray([`${p.She} is carrying the burden of taking care of a relative, where other family members pass the ball.`,
        `${p.She} is the sole caretaker of a sick relative.`]);
    case TWOOBIE:
      return randomArray([`Bad news has stopped surprising ${p.him}.`,
        `${p.She} has a sad story, that makes the audience feel sorry for ${p.him}.`]);
    case TDERE:
      return randomArray([`${p.She} is secretly sweet, kind, and generous to people who are close to ${p.him}.`,
        `${p.She} hides a softer, sweet side of ${p.herself}.`]);
    case TLUCKY:
      return randomArray([`Good things happen to ${p.him}, whether it's luck or karma.`,
        `Luck is often on ${p.his} side.`]);
    case TUNLUCKY:
      return randomArray([`${p.She} is frequently unlucky.`,
        `Bad things happen to ${p.him}, whether it's just ${p.his} fault or bad luck.`]);
    case TROGUE:
      return randomArray([`${p.Sdesc} does not follow the rules.`,
        `${p.Sdesc} breaks the law for ${p.his} own personal profit`]);
    case TCHRONICHERO:
      return randomArray([`${p.Sdesc} has hero syndrome. ${p.She} feels compelled to help everyone.`,
        `${p.Sdesc} is compelled by a strong personal drive to look for good deeds to do.`]);
    case TNEUTRAL:
      return randomArray([`${p.Sdesc} stays neutral. ${p.She} does not take any side, even with the 'good guys'.`,
        `${p.Sdesc} is not interested in interfering with either side.`]);
    case TLONER:
      return randomArray([`${p.Sdesc} just wants to be left alone.`,
        `${p.Sdesc} hates the company of others and just wishes to be left alone.`]);
    case TINSECURE:
      return randomArray([`${p.She} seeks the attention and approval of others.`,
        `${p.She} wishes others respected ${p.him} more and is eager to prove ${p.herself}.`]);
    case TAFRAIDOFTHEMSELVES:
      return randomArray([`Fears ${p.his} own powers and what ${p.she} could become.`,
        `${p.She} tries ${p.his} best to keep ${p.his} powers suppressed, so that ${p.she} would not get overwhelmed by them.`]);
    case TLONERFREAK:
      return randomArray([`${p.Sdesc} is an anti-social introvert.`,
        `${p.She} has been isolated from society for so long that ${p.she} has become anti-social.`]);
    case TSHY:
      return randomArray([`${p.She} is extremely shy and withdraws when approached.`,
        `${p.She} freezes and withdraws when others try to talk to ${p.him}.`]);
    case TNATURE:
      return randomArray([`${p.Sdesc} prefers nature to civilization.`,
        `${p.Sdesc} is uncomfortable in large, civilized areas and prefers to stay in the wild.`]);
    case TMENTOR:
      return randomArray([`${p.She} is mentoring another character.`,
        `${p.She} is a mentor for someone.`]);
    case TFERAL:
      return randomArray([`${p.She} was locked in a room as a child, and faced years of abuse by ${p.his} guardians.`,
        `${p.She} was abandoned as a child and left to fend for ${p.herself}`,
        `${p.She} was abandoned as a child and raised by wild animals.`]);
    case THIDDENDEPTHS:
      return randomArray([`There is far more to ${p.him} than anyone suspects — a talent or history nobody would guess.`,
        `${p.She} keeps an unexpected skill quietly to ${p.herself}.`]);
    case TNOLINES:
      return randomArray([`There is genuinely nothing ${p.she} will not do. No line, no exception.`,
        `Other villains have standards. ${p.Sdesc} finds that quaint.`]);
    case TFREUDIANEXCUSE:
      return randomArray([`${p.His} cruelty has a source: something was done to ${p.him} first.`,
        `The wound that made ${p.him} this way is still open, if anyone cared to look.`]);
    case TMOLE:
      return randomArray([`${p.She} is secretly working for the other side.`,
        `${p.His} loyalty is a performance; ${p.his} reports go elsewhere.`]);
    case TATONER:
      return randomArray([`${p.She} is trying to make up for a wrong ${p.she} committed, one that still defines ${p.him}.`,
        `Every good deed ${p.she} does is quietly measured against an old sin.`]);
    case TSERIALKILLER:
      return randomArray([`${p.She} has killed before, more than once, and will again. There is a pattern to it.`,
        `Somewhere there is a string of cases nobody has connected to ${p.him} yet.`]);
    case TSTEPFORD:
      return randomArray([`The smile never drops, and it is holding back something bleak.`,
        `Behind the relentless cheerfulness, ${p.she} is quietly miserable.`]);
    case TUNRAVELING:
      return randomArray([`${p.She} is coming apart, slowly enough that nobody has called it yet.`,
        `${p.She} has started hearing ${p.his} own thoughts as if they belonged to someone else.`]);
    case TOLDERTHANLOOKS:
      return randomArray([`${p.She} is far older than ${p.she} appears, and lets people assume wrong.`,
        `${p.His} real age would end several conversations abruptly.`]);
    case TCHOSENONE:
      return randomArray([`A prophecy, bloodline, or destiny has marked ${p.him}, ready or not.`,
        `${p.She} did not ask to be chosen, and some days wishes ${p.she} hadn't been.`]);
    case TFACE:
    case THEEL:
    case TSUPPORT:
      return "";
    default:
      return "";
  }
}

function tagToWealth(tag) {
  switch (tag) {
    case TEVERYMAN:
      return randomArray([`${p.She} has a stable job and a comfortable apartment.`,
        `${p.She} has a nice car, a decent job, a good house.`, `${p.She} runs a small store and lives in a good home.`]);
    case TRICH:
      return randomArray([`${p.She} has a multi-story house and owns a chain of businesses.`,
        `${p.She} lives in a comfy home.`, `${p.She} has a sizeable mansion.`]);
    // case TPOWERFUL: only political power
    // case TGREEDY: not now but maybe later
    // case TASCETIC: not now but maybe later
    case TPOOR:
      return randomArray([`${p.She} has a minimalist, but comfortable home.`,
        `${p.She} lives with very little, only a single pair of clothes, and a small room.`]);
    case TBOSS:
      return randomArray([`${p.His} tools cost more than most people's homes, and have earned it back twice.`,
        `${p.She} has a signature weapon.`]);
    case TCOMMANDER:
      return randomArray([`${p.She} has a small army at ${p.his} disposal.`,
        `${p.She} has a squad of loyalists, ready to die for ${p.him}.`]);
    case TPOSSE:
      return randomArray([`${p.She} is part of a tight knit group, who follow ${p.his} will.`,
        `${p.She} has a small group of minions, who are not loyal, but recognize ${p.him} as their leader.`]);
    case TVESSEL:
      return randomArray([`${p.She} operates a vessel, such as a tank or airship.`,
        `${p.She} has full command of a vessel, such as a mech or ship.`]);
    case TMOREDAKKA:
      return randomArray([`${p.She} keeps a lot of extra weapons and explosives on ${p.him}.`,
        `${p.She} has an excessive arsenal of weapons.`]);
    case TWALKINGTHEEARTH:
      return randomArray([`${p.She} has no home, no job, no identification.`,
        `${p.She} travels with very little on ${p.him}.`]);
    case TANIMALSIDEKICK:
      return randomArray([`${p.She} has an animal sidekick.`,
        `${p.She} keeps a smart pet as a companion.`]);
    case TISOLATED:
      return randomArray([`${p.She} is all alone, with no companions.`,
        `${p.She} is alone, isolated far from any other contact.`]);
    default:
      return "";
  }
}
