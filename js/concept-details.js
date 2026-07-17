// V7.5 Tier 2: Character concept generator — "(adjective) (noun)", occasionally
// "(adjective) (adjective) (noun)". Renders as the subtitle under the name in
// the portrait header: MARCUS / Vengeful Assassin.
//
// Ported from the Bolt prototype (utils/characterConcepts.ts). The word lists
// survive nearly verbatim; the tag map does not: Bolt keyed it off its own tag
// strings, so every want ('wrevenge' → V7 'revenge'), every plot ('prevcrime' →
// V7 'revengecrime'), and the role tags ('villainous' → 'heel') needed rekeying.
// The map is keyed with V7's constants — computed property names — so a bad key
// is a ReferenceError at load, not a silently dead entry. Dropped outright:
// Bolt tags V7 doesn't have (race*, deuteragonist, five wants, four plots...),
// and one slur in the noun list.
//
// conceptMap keys off the FULL end-of-roll tag set — personality, wants, plots,
// fashion_* from the clothing roll, facial_hair_* from the appearance roll —
// which is why the concept must be generated last.

const conceptAdjectives = [
  'ancient', 'anxious', 'awkward', 'violent',
  'bookish', 'brainwashed', 'british', 'brooding',
  'burnished', 'burned', 'cagey', 'caged',
  'chaotic', 'charismatic', 'charming', 'choked', 'chosen',
  'cocky', 'cool',
  'cursed', 'cynical', 'deadly',
  'deadpan', 'destructive', 'dignified', 'drunk',
  'elegant', 'eternal', 'talkative', 'feline',
  'feral', 'fiery', 'flatulent',
  'foulmouthed', 'ghostly', 'glittering', 'glossy',
  'godlike', 'golden', 'graceful', 'grieving', 'grumpy', 'guilty', 'gutsy',
  'hairless', 'heroic', 'hidden',
  'hopeful', 'horned', 'hot', 'hypercharged', 'icy',
  'inflamed', 'innocent',
  'jealous', 'jingoistic',
  'gentle', 'lazy', 'lonely', 'loudmouthed', 'lovelorn',
  'loyal', 'masked', 'mechanical',
  'mischievous', 'monotone', 'moral', 'morbid', 'muddy',
  'naïve', 'narcotic', 'noble', 'obsessive', 'optimistic',
  'passionate', 'patriotic', 'patient',
  'pierced', 'plastic', 'playful', 'polite', 'porcelain', 'powerful', 'powerless',
  'pretty', 'provincial', 'quiet', 'rageful',
  'scarred',
  'revolutionary', 'rich', 'royal', 'sadistic',
  'sarcastic', 'seductive',
  'hateful', 'eloquent', 'silent', 'slippery', 'smug',
  'soft', 'kind', 'sparkly',
  'spoiled', 'stubborn', 'energetic',
  'supernatural', 'synthetic', 'tattooed',
  'tentacled', 'timeless', 'tired', 'tireless', 'towering', 'toxic', 'tragic',
  'unhinged', 'unstoppable', 'uptight',
  'vengeful', 'weary', 'weaponized', 'whimsical', 'witty'
];

const conceptNouns = [
  'advisor', 'agent', 'ambassador', 'anarchist', 'angel', 'archeologist', 'assassin', 'dancer', 'beast',
  'boxer', 'bruiser', 'bureaucrat', 'clown', 'comedian',
  'consort', 'crusader', 'dictator', 'dog', 'dragon',
  'downer', 'dreamer', 'elf', 'escapee', 'executioner', 'exile',
  'experiment', 'explorer', 'genius', 'ghost', 'god', 'gremlin',
  'heir', 'icon', 'idiot', 'impostor',
  'rider', 'savior', 'joker', 'journalist', 'judge',
  'kid', 'kleptomaniac', 'knight', 'liar', 'loner', 'marshal',
  'menace', 'monster', 'murderer', 'muse',
  'necromancer', 'nemesis', 'ninja', 'nihilist', 'oracle', 'optimist', 'outcast',
  'outsider', 'parisian', 'peacemaker', 'poet',
  'prisoner', 'prodigy', 'professor', 'racer', 'rebel', 'realist', 'robot',
  'rogue', 'romantic', 'royal', 'sadist', 'schemer', 'scholar', 'sculptor',
  'seer', 'shadow', 'singer', 'spy',
  'survivor', 'thief', 'underdog', 'underlord', 'usurper', 'vampire', 'voyager', 'wanderer',
  'wannabe', 'warlock', 'warrior', 'weapon', 'whisperer', 'wizard',
  'writer', 'zombie'
];

// Only mixed in when the character actually carries the gender tag, so the
// "No gender stereotypes" checkbox suppresses these automatically.
const conceptGenderWords = {
  male: {
    adjectives: ['boyish'],
    nouns: ['boy', 'dad', 'husband', 'himbo', 'king', 'kingpin', 'patriarch', 'prince', 'stallion', 'gentleman', 'strongman', 'casanova', 'hero', 'madman', 'snowman', 'sorcerer']
  },
  female: {
    adjectives: ['maternal'],
    nouns: ['huntress', 'daughter', 'matron', 'princess', 'diva', 'witch', 'songbird', 'snowwoman', 'sorceress']
  }
};

// tag → words that bias the draw (2× weight). Keys are V7 tag/want/plot
// constants; entries whose tag V7 lacks were dropped rather than remapped to
// something dishonest. TLAZY and WLAZY share the string 'lazy', so Bolt's two
// entries merge into one here.
const conceptMap = {
  // Personality
  [TEVIL]: { adjectives: ['dark', 'sinister', 'wicked', 'malevolent', 'twisted', 'corrupt', 'ruthless', 'cruel'], nouns: ['villain', 'monster', 'tyrant'] },
  [TGOOD]: { adjectives: ['noble', 'righteous', 'pure', 'virtuous', 'blessed'], nouns: ['hero', 'champion', 'savior'] },
  [TNEUTRAL]: { adjectives: ['neutral', 'balanced', 'impartial'], nouns: ['judge'] },
  [TNOBLE]: { adjectives: ['noble', 'honorable', 'aristocratic'], nouns: ['noble', 'aristocrat', 'lord', 'lady'] },
  [TIGNOBLE]: { adjectives: ['dishonorable'], nouns: ['scoundrel', 'cur'] },
  [TCOLD]: { adjectives: ['icy', 'frigid', 'heartless', 'calculating'] },
  [TWARM]: { adjectives: ['kindhearted', 'caring', 'gentle', 'compassionate'] },
  [THOTBLOODED]: { adjectives: ['passionate', 'emotional', 'intense', 'fiery'], nouns: ['troublemaker'] },
  [TSTOIC]: { adjectives: ['stoic', 'impassive', 'unflappable'] },
  [TCHARISMATIC]: { adjectives: ['charming', 'magnetic', 'captivating'], nouns: ['charmer', 'enchanter', 'diplomat'] },
  [TMYSTERIOUS]: { adjectives: ['enigmatic', 'mysterious'], nouns: ['mystery', 'enigma', 'shadow', 'secret'] },
  [TWISE]: { adjectives: ['sage', 'ancient', 'omniscient'], nouns: ['oracle', 'philosopher', 'sage'] },
  [TNAIVE]: { adjectives: ['innocent', 'naive', 'trusting'], nouns: ['ditz', 'airhead'] },
  [TCYNICAL]: { adjectives: ['bitter', 'jaded', 'cynical', 'weary'], nouns: ['cynic'] },
  [TBRAVE]: { adjectives: ['fearless', 'bold', 'courageous', 'valiant'], nouns: ['champion'] },
  [TCOWARD]: { adjectives: ['timid', 'craven', 'cowardly'], nouns: ['coward'] },
  [TDETERMINED]: { adjectives: ['relentless', 'unstoppable', 'determined', 'driven', 'obsessed'], nouns: ['juggernaut', 'force'] },
  [TLAZY]: { adjectives: ['slow', 'lazy', 'slothful'], nouns: ['slacker', 'layabout'] },
  [THAM]: { adjectives: ['loudmouthed', 'dramatic', 'grandiose', 'hammy', 'loud'], nouns: ['diva'] },
  [TSNARKY]: { adjectives: ['sardonic', 'witty', 'sarcastic', 'snarky'] },
  [TFAKEDITZ]: { adjectives: ['deceptive', 'ditzy'], nouns: ['ditz', 'savant'] },
  [TGENRESAVVY]: { adjectives: ['clever'] },
  [TSTREETSMART]: { adjectives: ['streetwise'] },
  [TSMART]: { adjectives: ['brilliant', 'intelligent', 'clever'], nouns: ['genius', 'intellectual', 'mastermind'] },
  [TNERD]: { adjectives: ['nerdy', 'bookish', 'scholarly'], nouns: ['nerd', 'bookworm', 'scholar'] },
  [TTALKATIVE]: { adjectives: ['chatty'], nouns: ['chatterbox'] },
  [TINTROVERT]: { adjectives: ['introverted', 'reclusive', 'withdrawn'], nouns: ['introvert', 'recluse'] },
  [TSHY]: { adjectives: ['timid', 'bashful', 'meek'], nouns: ['wallflower'] },
  [TSTERN]: { adjectives: ['stern', 'strict', 'austere'], nouns: ['disciplinarian'] },

  // Physical
  [TSTRONG]: { adjectives: ['mighty', 'powerful', 'strong', 'muscular'], nouns: ['bruiser', 'powerhouse'] },
  [TWEAK]: { adjectives: ['frail', 'delicate', 'fragile'] },
  [TSMALL]: { adjectives: ['tiny', 'diminutive', 'petite'] },
  [TATTRACTIVE]: { adjectives: ['beautiful', 'stunning', 'gorgeous', 'cute', 'pretty', 'handsome'], nouns: ['beauty', 'heartthrob', 'stunner'] },
  [TUGLY]: { adjectives: ['hideous', 'grotesque', 'unsightly'] },
  [TTOUGH]: { adjectives: ['tough', 'hardened', 'resilient'], nouns: ['survivor', 'tank'] },
  [TBADFIGHTER]: { adjectives: ['clumsy', 'inept', 'hopeless', 'helpless'], nouns: ['klutz', 'bumbler', 'loser'] },
  [TBIG]: { adjectives: ['massive', 'hulking', 'enormous', 'big', 'towering'], nouns: ['giant', 'behemoth', 'colossus', 'titan'] },
  [TSEXY]: { adjectives: ['seductive', 'alluring', 'sultry'], nouns: ['seducer', 'temptress', 'heartthrob'] },

  // Moral alignment & methods
  [THONORABLE]: { adjectives: ['honorable', 'righteous', 'upright', 'principled', 'ethical'], nouns: ['paladin', 'knight', 'crusader', 'saint'] },
  [TDISHONORABLE]: { adjectives: ['pragmatic', 'ruthless', 'unethical', 'unprincipled', 'unscrupulous'] },
  [TGOODCAUSE]: { adjectives: ['righteous', 'just'], nouns: ['crusader', 'champion'] },
  [TBADCAUSE]: { adjectives: ['misguided', 'deluded'], nouns: ['zealot', 'fanatic'] },
  [TPOINTLESSCAUSE]: { adjectives: ['quixotic', 'futile'], nouns: ['dreamer', 'fool'] },
  [TGOODMEANS]: { adjectives: ['ethical', 'principled'], nouns: ['saint', 'paragon'] },
  [TBADMEANS]: { adjectives: ['pragmatic', 'ruthless'], nouns: ['pragmatist'] },
  [TMYOPIC]: { adjectives: ['shortsighted', 'narrow'], nouns: ['fool'] },
  [TIDEALISTIC]: { adjectives: ['hopeful', 'optimistic', 'idealistic'], nouns: ['dreamer', 'idealist', 'crusader'] },

  // Leadership & hierarchy
  [TFOLLOWER]: { adjectives: ['submissive', 'obedient'], nouns: ['follower', 'subordinate', 'minion'] },
  [TNUMBERTWO]: { adjectives: ['loyal'], nouns: ['lieutenant', 'deputy', 'second', 'captain'] },
  [TCOMMANDER]: { adjectives: ['commanding', 'authoritative'], nouns: ['commander', 'general', 'admiral', 'boss'] },
  [TMIDDLEMANAGER]: { adjectives: ['bureaucratic'], nouns: ['manager', 'supervisor', 'boss', 'bureaucrat'] },
  [TBUREAUCRAT]: { adjectives: ['bureaucratic'], nouns: ['bureaucrat', 'official', 'clerk'] },
  [THEART]: { adjectives: ['caring', 'unifying'], nouns: ['mediator'] },
  [TEVERYMAN]: { adjectives: ['ordinary', 'relatable'], nouns: ['everyman', 'commoner'] },
  [TTACTICIAN]: { adjectives: ['strategic', 'tactical', 'calculating'], nouns: ['tactician', 'strategist'] },
  [TTACTICLESS]: { adjectives: ['blunt', 'insensitive', 'tactless'] },

  // Social dynamics
  [TSWEET]: { adjectives: ['sweet', 'kind', 'tender'], nouns: ['sweetheart', 'angel'] },
  [TMEAN]: { adjectives: ['mean', 'nasty', 'cruel'], nouns: ['meanie', 'bully'] },
  [TCARING]: { adjectives: ['caring', 'nurturing', 'protective'], nouns: ['caretaker', 'nurturer'] },
  [TRUTHLESS]: { adjectives: ['ruthless', 'merciless', 'pitiless'], nouns: ['tyrant', 'despot'] },
  [TLOVED]: { adjectives: ['beloved', 'cherished'], nouns: ['beloved', 'darling'] },
  [THATED]: { adjectives: ['despised', 'reviled'], nouns: ['pariah', 'outcast'] },
  [THUMBLE]: { adjectives: ['humble', 'modest', 'unassuming'] },
  [TBALANCED]: { adjectives: ['balanced', 'moderate', 'centered'], nouns: ['moderate'] },
  [TUNCHARISMATIC]: { adjectives: ['awkward', 'bland'] },
  [TBITCH]: { adjectives: ['hateable', 'irritating', 'annoying', 'antagonistic', 'spiteful'], nouns: ['queen', 'bitch'] },
  [TLOVABLE]: { adjectives: ['endearing'] },
  [TDREADED]: { adjectives: ['fearsome', 'nightmarish', 'terrifying'], nouns: ['nightmare', 'horror'] },
  [TARROGANT]: { adjectives: ['egotistical', 'narcissistic', 'arrogant'], nouns: ['egomaniac', 'narcissist'] },

  // Combat & skills
  [TBADASS]: { adjectives: ['legendary', 'unstoppable', 'badass'], nouns: ['legend', 'icon', 'force', 'powerhouse', 'badass'] },
  [TVIOLENT]: { adjectives: ['bloodthirsty', 'savage', 'brutal', 'murderous'], nouns: ['berserker', 'savage', 'destroyer'] },
  [TMOREDAKKA]: { adjectives: ['violent', 'sadistic'], nouns: ['berserker'] },
  [TSADIST]: { adjectives: ['sadistic', 'cruel'], nouns: ['torturer'] },
  [TAGGRESSIVE]: { adjectives: ['aggressive', 'hostile', 'belligerent'], nouns: ['aggressor', 'bully'] },
  [TDEFENDED]: { adjectives: ['protected', 'guarded'], nouns: ['ward', 'charge'] },
  [TPACIFIST]: { adjectives: ['peaceful', 'gentle', 'nonviolent'], nouns: ['peacemaker', 'diplomat'] },
  [TTECHIE]: { adjectives: ['technical'], nouns: ['hacker', 'engineer', 'programmer', 'techie'] },
  [TBOSS]: { adjectives: ['commanding', 'veteran', 'deadly'], nouns: ['boss', 'chief', 'warrior', 'champion'] },

  // Loyalty & trust
  [TLOYAL]: { adjectives: ['loyal', 'faithful', 'devoted'], nouns: ['loyalist', 'minion'] },
  [TINDIVIDUALISTIC]: { adjectives: ['independent', 'self-reliant', 'selfish', 'solitary', 'solo'], nouns: ['individualist', 'maverick', 'loner'] },
  [THONEST]: { adjectives: ['honest', 'truthful', 'sincere'] },
  [TTREACHEROUS]: { adjectives: ['backstabbing', 'untrustworthy', 'unreliable', 'traitorous', 'treacherous'], nouns: ['betrayer', 'turncoat', 'traitor', 'deserter'] },
  [TLIAR]: { adjectives: ['deceptive', 'eloquent', 'masked', 'deceitful'], nouns: ['liar', 'trickster', 'deceiver'] },
  [TMANIPULATIVE]: { adjectives: ['manipulative', 'scheming'], nouns: ['puppetmaster', 'manipulator'] },

  // Emotional traits
  [TLONGFUSE]: { adjectives: ['patient', 'tolerant', 'enduring'], nouns: ['saint'] },
  [TBERSERKBUTTON]: { adjectives: ['triggered', 'volatile'] },
  [TANGST]: { adjectives: ['angsty', 'brooding', 'tormented'] },
  [TINSANE]: { adjectives: ['insane', 'mad', 'deranged'], nouns: ['madman', 'lunatic'] },
  [TJEALOUS]: { adjectives: ['jealous', 'envious'] },
  [TSHORTFUSE]: { adjectives: ['fragile', 'impulsive', 'temperamental'] },
  [TPOLITEANGER]: { adjectives: ['polite'], nouns: ['gentleman', 'lady'] },
  [TTRAUMA]: { adjectives: ['broken', 'damaged', 'scarred', 'traumatized', 'hurt'] },
  [TSANE]: { adjectives: ['levelheaded', 'sane', 'reasonable', 'stable', 'calm'] },
  [TINSECURE]: { adjectives: ['insecure', 'anxious'] },
  [TAFRAIDOFTHEMSELVES]: { adjectives: ['tormented', 'conflicted'] },
  [TDERE]: { adjectives: ['sympathetic', 'misunderstood'] },
  [TWOOBIE]: { adjectives: ['sympathetic', 'cute', 'adorable'] },
  [TOBSESSED]: { adjectives: ['fixated', 'obsessed'], nouns: ['stalker', 'fanatic', 'zealot'] },

  // Roles & archetypes
  [TFACE]: { adjectives: ['heroic'], nouns: ['hero'] },
  [THEEL]: { adjectives: ['villainous'], nouns: ['villain'] },
  [TSUPPORT]: { adjectives: ['supportive', 'helpful'], nouns: ['supporter'] },
  [TLEADER]: { nouns: ['commander', 'captain', 'chief', 'boss'] },
  [TMENTOR]: { adjectives: ['wise'], nouns: ['teacher', 'guide', 'master', 'mentor'] },
  [TLONER]: { adjectives: ['solitary'], nouns: ['wanderer', 'hermit', 'outcast', 'loner'] },
  [TDEFENDER]: { adjectives: ['protective'], nouns: ['guardian', 'defender', 'protector'] },

  // Utility & competence
  [TNECESSARY]: { adjectives: ['vital', 'essential'], nouns: ['keystone', 'linchpin'] },
  [TDISPOSABLE]: { adjectives: ['expendable', 'disposable'], nouns: ['pawn'] },
  [TOBSTRUCTIVE]: { adjectives: ['obstructive', 'hindering'], nouns: ['obstacle', 'hindrance'] },
  [TBUTTMONKEY]: { adjectives: ['unlucky', 'hapless'], nouns: ['victim', 'joke'] },
  [TALLY]: { adjectives: ['allied', 'friendly'], nouns: ['ally', 'friend', 'companion'] },
  [TEXPOSITION]: { adjectives: ['informative'], nouns: ['narrator'] },
  [TACE]: { adjectives: ['elite', 'worldclass'], nouns: ['prodigy', 'virtuoso', 'perfectionist', 'ace'] },
  [TLOAD]: { adjectives: ['useless'], nouns: ['liability'] },
  [TCONTRARIAN]: { adjectives: ['argumentative', 'contrary'], nouns: ['rebel', 'dissenter', 'contrarian'] },

  // Lifestyle & background
  [TRICH]: { adjectives: ['wealthy', 'affluent', 'rich', 'privileged'], nouns: ['tycoon', 'millionaire', 'billionaire'] },
  [TPOOR]: { adjectives: ['impoverished', 'destitute'], nouns: ['pauper', 'beggar'] },
  [TPOWERFUL]: { adjectives: ['influential', 'mighty'], nouns: ['magnate', 'powerbroker'] },
  [TAMBITIOUS]: { adjectives: ['ambitious', 'driven'] },
  [TVESSEL]: { nouns: ['captain', 'pilot'] },
  [TWALKINGTHEEARTH]: { adjectives: ['nomadic', 'roaming'], nouns: ['nomad', 'drifter', 'wanderer'] },
  [TISOLATED]: { adjectives: ['isolated', 'secluded'], nouns: ['hermit', 'recluse'] },
  [TLONERFREAK]: { adjectives: ['antisocial', 'estranged'], nouns: ['misfit', 'outcast'] },
  [TNATURE]: { adjectives: ['naturalistic', 'outdoorsy'], nouns: ['naturalist', 'ranger'] },
  [TFERAL]: { adjectives: ['wild', 'untamed', 'feral'], nouns: ['savage', 'wildling'] },

  // Quirks
  [TLUCKY]: { adjectives: ['fortunate', 'blessed', 'lucky'] },
  [TUNLUCKY]: { adjectives: ['cursed', 'jinxed', 'unlucky'], nouns: ['jinx'] },
  [TROGUE]: { adjectives: ['roguish', 'mischievous', 'rebellious'], nouns: ['rascal', 'scoundrel', 'rogue'] },
  [TNOTMYFAULT]: { adjectives: ['blameless'] },
  [TSELFBLAMING]: { adjectives: ['guilty', 'self-hating'], nouns: ['martyr'] },
  [TCLUMSY]: { adjectives: ['clumsy', 'bumbling'], nouns: ['klutz', 'butterfingers'] },
  [TINVESTIGATOR]: { adjectives: ['investigative', 'inquisitive'], nouns: ['detective', 'sleuth'] },
  [TGREEDY]: { adjectives: ['greedy'], nouns: ['golddigger'] },
  [TASCETIC]: { adjectives: ['minimalist', 'ascetic'], nouns: ['ascetic', 'monk', 'hermit'] },
  [TSEXER]: { adjectives: ['charming'], nouns: ['heartbreaker', 'player', 'casanova'] },
  [TCHRONICHERO]: { adjectives: ['heroic', 'sacrificing', 'selfless'], nouns: ['hero', 'martyr'] },
  [TEATER]: { adjectives: ['hungry', 'gluttonous'], nouns: ['glutton'] },
  [TCANNIBAL]: { adjectives: ['cannibalistic'], nouns: ['cannibal'] },
  [TVEGAN]: { adjectives: ['vegan', 'vegetarian'], nouns: ['vegan'] },
  [TDISTRESSED]: { adjectives: ['distressed', 'distraught'] },
  [TCREEPY]: { adjectives: ['creepy'], nouns: ['stalker'] },
  [TATTENTION]: { adjectives: ['dramatic'], nouns: ['diva'] },

  // Wants
  [WWANTBURN]: { adjectives: ['vengeful', 'wrathful', 'furious'], nouns: ['avenger', 'nemesis', 'destroyer', 'fury'] },
  [WREVENGE]: { adjectives: ['vengeful', 'wrathful'], nouns: ['avenger', 'hunter', 'nemesis'] },
  [WBEBADASS]: { adjectives: ['ambitious'], nouns: ['showoff'] },
  [WAMBITION]: { adjectives: ['ambitious'], nouns: ['climber', 'schemer', 'usurper'] },
  [WCRAVELOVE]: { adjectives: ['romantic', 'lonely', 'heartbroken'], nouns: ['romantic', 'lover', 'dreamer', 'hopeful'] },
  [WMACGUFFIN]: { adjectives: ['driven'], nouns: ['treasure hunter'] },
  [WGREATPOWER]: { adjectives: ['guilty', 'burdened', 'repentant'], nouns: ['sinner'] },
  [WPROTECTIVE]: { adjectives: ['protective'], nouns: ['protector', 'guardian'] },
  [WSTRONGETHICS]: { adjectives: ['ethical', 'moral'], nouns: ['moralist'] },
  [WBETTERWORLD]: { adjectives: ['idealistic', 'reformist'], nouns: ['reformer', 'idealist'] },
  [WPASTMISTAKE]: { adjectives: ['repentant'], nouns: ['penitent'] },
  [WMONEYPOWER]: { adjectives: ['ambitious', 'greedy'], nouns: ['schemer', 'climber', 'golddigger'] },
  [WPARENTAL]: { adjectives: ['parental', 'nurturing'], nouns: ['parent', 'guardian'] },
  [WBELOVED]: { adjectives: ['loving', 'devoted'], nouns: ['lover', 'devotee'] },
  [WPRIDE]: { adjectives: ['proud', 'dignified'] },
  [WFORBIDDEN]: { adjectives: ['forbidden', 'taboo'], nouns: ['transgressor'] },
  [WBEATFATE]: { adjectives: ['defiant', 'rebellious'], nouns: ['rebel', 'defier'] },
  [WADVENTURE]: { adjectives: ['adventurous', 'wandering'], nouns: ['adventurer', 'explorer'] },
  [WFOOD]: { adjectives: ['hungry', 'gluttonous'], nouns: ['gourmand', 'foodie'] },
  [WAVOIDSPOTLIGHT]: { adjectives: ['unambitious', 'laid-back'], nouns: ['hermit', 'slacker', 'wanderer'] },
  [WDEBT]: { adjectives: ['indebted', 'obligated'], nouns: ['debtor'] },
  [WBECOMEBEAUTIFUL]: { adjectives: ['vain'] },
  [WBESPECIAL]: { adjectives: ['normal', 'common', 'plain', 'average'] },
  [WNOSUFFERING]: { adjectives: ['compassionate', 'merciful', 'kind'], nouns: ['healer', 'savior', 'angel'] },
  [WPROVEWRONG]: { adjectives: ['vindictive', 'determined'], nouns: ['vindicator'] },
  [WUNSTOPPABLERAGE]: { adjectives: ['furious', 'wrathful'], nouns: ['berserker', 'fury'] },
  [WBEHAPPY]: { nouns: ['optimist'] },
  [WSPREADHAPPY]: { adjectives: ['uplifting', 'cheerful'], nouns: ['cheerleader', 'optimist'] },
  [WHOMELAND]: { adjectives: ['patriotic', 'homesick'], nouns: ['patriot', 'exile'] },
  [WGETJOBDONE]: { adjectives: ['professional', 'focused'], nouns: ['professional', 'specialist'] },
  [WRETURNHOME]: { adjectives: ['homesick', 'nostalgic'], nouns: ['exile', 'wanderer'] },
  [WUPHOLDHONOR]: { adjectives: ['honorable', 'dutiful'], nouns: ['knight', 'samurai'] },
  [WENEMIES]: { adjectives: ['vengeful', 'antagonistic'], nouns: ['nemesis', 'rival'] },
  [WCOLLECTION]: { adjectives: ['collecting', 'hoarding'], nouns: ['collector', 'hoarder'] },
  [WSMALLTHING]: { adjectives: ['simple', 'humble'] },
  [WFREEFROMBONDAGE]: { adjectives: ['freedom-seeking'], nouns: ['liberator', 'escapee'] },
  [WSAVEDLIFE]: { adjectives: ['grateful', 'indebted'] },
  [WCHOSENONE]: { adjectives: ['chosen', 'destined'], nouns: ['chosen one'] },
  [WENVY]: { adjectives: ['envious', 'covetous'], nouns: ['rival'] },
  [WLOSTLOVE]: { adjectives: ['heartbroken', 'searching'], nouns: ['seeker'] },
  [WSPECIFICWEALTH]: { adjectives: ['ambitious'], nouns: ['fortune hunter'] },
  [WSPECIFICJOB]: { adjectives: ['career-focused'], nouns: ['careerist'] },
  [WFAKEHEROISM]: { adjectives: ['fake', 'pretending'], nouns: ['faker', 'pretender'] },
  [WFEAR]: { adjectives: ['fearful', 'phobic'], nouns: ['coward'] },
  [WBULLY]: { adjectives: ['bullying', 'dominating'], nouns: ['bully', 'tyrant'] },
  [WFORCEDVILLAIN]: { adjectives: ['reluctant', 'coerced'] },
  [WDISABLED]: { nouns: ['survivor'] },
  [WBEHUMAN]: { adjectives: ['humanity-seeking'], nouns: ['seeker'] },
  [WRESURRECT]: { adjectives: ['desperate', 'necromantic'], nouns: ['necromancer'] },
  [WLUST]: { adjectives: ['lustful', 'passionate'], nouns: ['seducer', 'temptress'] },
  [WSEERUINED]: { adjectives: ['destructive', 'vindictive'], nouns: ['destroyer', 'ruiner'] },

  // Plot hooks
  [PSUPPLICATION]: { adjectives: ['pleading'], nouns: ['supplicant', 'petitioner'] },
  [PDELIVERANCE]: { nouns: ['seeker'] },
  [PREVCRIME]: { adjectives: ['criminal', 'vengeful'], nouns: ['avenger', 'vigilante'] },
  [PREVFAMILY]: { adjectives: ['family-oriented'], nouns: ['avenger'] },
  [PFUGITIVE]: { adjectives: ['fugitive', 'hunted', 'criminal'], nouns: ['fugitive', 'runaway', 'exile', 'escapee', 'criminal'] },
  [PDISASTER]: { adjectives: ['disaster-struck'], nouns: ['survivor', 'victim'] },
  [PCRUELTY]: { adjectives: ['cruel', 'sadistic'], nouns: ['sadist', 'torturer'] },
  [PMADNESS]: { adjectives: ['mad', 'insane', 'unhinged'], nouns: ['madman', 'lunatic', 'maniac'] },
  [PJEALOUS]: { adjectives: ['jealous', 'envious'] },
  [PAMBITION]: { adjectives: ['ambitious', 'scheming'] },
  [PABDUCTION]: { adjectives: ['abducted', 'kidnapped', 'missing'] },
  [PENIGMA]: { adjectives: ['mysterious', 'enigmatic'], nouns: ['enigma', 'mystery'] },
  [POBTAINING]: { adjectives: ['seeking', 'questing'], nouns: ['seeker', 'quester'] },
  [PENMITYKIN]: { adjectives: ['feuding', 'hostile'], nouns: ['enemy'] },
  [PRIVALKIN]: { adjectives: ['rivalrous'], nouns: ['rival'] },
  [PMURDERADULTERY]: { adjectives: ['vengeful', 'betrayed'], nouns: ['avenger'] },
  [PIMPRUDENCE]: { adjectives: ['imprudent', 'reckless'], nouns: ['fool'] },
  [PCOINCIDENCE]: { adjectives: ['coincidental', 'fated'], nouns: ['pawn of fate'] },
  [PDREAM]: { adjectives: ['dreaming', 'visionary'], nouns: ['dreamer', 'visionary'] },
  [PSACIDEAL]: { adjectives: ['sacrificing', 'idealistic'], nouns: ['martyr', 'idealist'] },
  [PSACFAMILY]: { adjectives: ['sacrificing', 'family-devoted'], nouns: ['guardian'] },
  [PSACPASSION]: { adjectives: ['passionate', 'sacrificing'], nouns: ['martyr'] },
  [PSACNECESSARY]: { adjectives: ['duty-bound'], nouns: ['dutiful'] },
  [PRIVALSUPERIOR]: { adjectives: ['competitive'], nouns: ['rival', 'competitor'] },
  [PADULTERY]: { adjectives: ['adulterous', 'unfaithful'], nouns: ['adulterer'] },
  [PINCEST]: { adjectives: ['forbidden', 'taboo'], nouns: ['transgressor'] },
  [PDISHONOURLOVE]: { adjectives: ['dishonored', 'shameful'], nouns: ['outcast'] },
  [POBSTACLELOVE]: { adjectives: ['star-crossed', 'forbidden'], nouns: ['lover'] },
  [PENEMYLOVE]: { adjectives: ['conflicted', 'torn'] },
  [PCONFLICTPOWER]: { adjectives: ['power-struggling'], nouns: ['rival', 'contender'] },
  [PERRORJUDGMENT]: { adjectives: ['misjudging', 'erring'], nouns: ['fool'] },
  [PREMORSE]: { adjectives: ['remorseful', 'guilt-ridden'], nouns: ['penitent'] },
  [PRECOVERLOST]: { adjectives: ['seeking', 'recovering'], nouns: ['seeker'] },
  [PLOSSLOVE]: { adjectives: ['heartbroken', 'mourning'], nouns: ['mourner'] },
  [PREVOLT]: { adjectives: ['revolutionary', 'rebel'], nouns: ['revolutionary', 'rebel', 'insurgent'] },
  [PREVOLT_WHISTLEBLOWER]: { nouns: ['whistleblower'] },
  [PDARING]: { adjectives: ['daring', 'reckless'], nouns: ['daredevil', 'thrillseeker'] },

  // Fashion styles (set by the clothing roll — see clothing-details.js)
  [FELEGANT]: { adjectives: ['elegant', 'refined', 'sophisticated'] },
  [FTOUGH]: { adjectives: ['tough', 'rugged'] },
  [FETHEREAL]: { adjectives: ['ethereal', 'otherworldly', 'mystical'] },
  [FVILLAINOUS]: { adjectives: ['sinister', 'menacing', 'dark'] },

  // Facial hair (set by the appearance roll)
  'facial_hair_mustache': { adjectives: ['mustachioed'] },
  'facial_hair_beard': { adjectives: ['bearded', 'grizzled'] },
};

// Bolt's rule was "second adjective only if the whole thing is under 15 chars",
// which with these word lengths meant effectively never. Retuned: a 1-in-4 shot,
// kept only when the result stays subtitle-sized.
const CONCEPT_MAX_LEN = 28;

function conceptTitleCase(s) {
  return s.split(' ').map(w =>
    (w === 'of' || w === 'the') ? w : w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ');
}

// tags: the character's full end-of-roll tag Set. Tag-matched words are pushed
// twice (2× bias, Bolt's tuning); gendered words only join when the gender tag
// is present, so "No gender stereotypes" suppresses them for free.
function generateConcept(tags) {
  const adjectives = conceptAdjectives.slice();
  const nouns = conceptNouns.slice();
  if (tags.has(TMALE)) {
    adjectives.push(...conceptGenderWords.male.adjectives);
    nouns.push(...conceptGenderWords.male.nouns);
  }
  if (tags.has(TFEMALE)) {
    adjectives.push(...conceptGenderWords.female.adjectives);
    nouns.push(...conceptGenderWords.female.nouns);
  }
  tags.forEach(function (t) {
    const words = conceptMap[t];
    if (!words) return;
    for (let i = 0; i < 2; i++) {
      if (words.adjectives) adjectives.push(...words.adjectives);
      if (words.nouns) nouns.push(...words.nouns);
    }
  });

  const adj1 = randomArray(adjectives);
  const noun = randomArray(nouns);
  let concept = adj1 + ' ' + noun;
  if (roll(1, 4) === 1) {
    const adj2 = randomArray(adjectives);
    const extended = adj1 + ' ' + adj2 + ' ' + noun;
    if (adj2 !== adj1 && extended.length <= CONCEPT_MAX_LEN) concept = extended;
  }
  return conceptTitleCase(concept);
}
