const WWANTBURN = 'worldburn';
const WPROTECTIVE = 'protective';
const WMACGUFFIN = 'macguffin';
const WGREATPOWER = 'greatpower';
const WCRAVELOVE = 'cravelove';
const WSTRONGETHICS = 'strongethics';
const WBETTERWORLD = 'betterworld';
const WPASTMISTAKE = 'pastmistake';
const WMONEYPOWER = 'moneypower';
const WPARENTAL = 'parental';
const WBELOVED = 'beloved';
const WPRIDE = 'pride';
const WFAVOUR = 'favour';
const WFORBIDDEN = 'forbidden';
const WBEBADASS = 'bebadass';
const WREVENGE = 'revenge';
const WBEATFATE = 'beatfate';
const WADVENTURE = 'adventure';
const WFOOD = 'food';
const WLAZY = 'lazy';
const WAVOIDSPOTLIGHT = 'avoidspotlight';
const WDEBT = 'debt';
const WBECOMEBEAUTIFUL = 'becomebeautiful';
const WBESPECIAL = 'bespecial';
const WNOSUFFERING = 'nosuffering';
const WPROVEWRONG = 'provewrong';
const WUNSTOPPABLERAGE = 'unstoppablerage';
const WAMBITION = 'ambition';
const WBEHAPPY = 'behappy';
const WSPREADHAPPY = 'spreadhappy';
const WHOMELAND = 'homeland';
const WGETJOBDONE = 'getjobdone';
const WRETURNHOME = 'returnhome';
const WUPHOLDHONOR = 'upholdhonor';
const WENEMIES = 'enemies';
const WCOLLECTION = 'collection';
const WSMALLTHING = 'smallthing';
const WFREEFROMBONDAGE = 'freefrombondage';
const WSAVEDLIFE = 'savedlife';
const WCHOSENONE = 'chosenone';
const WENVY = 'envy';
const WLOSTLOVE = 'lostlove';
const WSPECIFICWEALTH = 'specificwealth';
const WSPECIFICJOB = 'specificjob';
const WFAKEHEROISM = 'pracgmaticheroism';
const WFEAR = 'fear';
const WBULLY = 'bully';
const WFORCEDVILLAIN = 'forcedvillain';
const WDISABLED = 'disabled';
const WBEHUMAN = 'behuman';
const WRESURRECT = 'resurrect';
const WLUST = 'reallywant';
const WSEERUINED = 'seeruined';


function wantToDesc(tag) {
  switch (tag) {
    case WWANTBURN:
      return randomArray([
        `${p.Sdesc} is a very angry person. ${p.She} is angry at the world, and ${p.she} is angry at those who are not like ${p.him}. ${p.She} likes to take ${p.his} anger out on others, using violence and cruelty as ${p.his} weapon of choice. ${p.She} has been this way for most of ${p.his} life, and ${p.she} doesn't see any reason to change now.`,
        `${p.Sdesc} is life's biggest burden, a plague to drive away any happiness that may try to infect the world. ${p.She} has a goal, and ${p.his} goal is to make everyone miserable.`,
        `${p.Sdescs} abusive childhood led to this. ${p.She} enjoyed seeing people suffer, and developed a sadistic personality.`,
      ]);
    case WPROTECTIVE:
      return randomArray([
        `${p.Sdesc}'s loyalty is to ${p.his} family. One of the main reasons ${p.she} is so loyal is because of how much everyone else in ${p.his} family works, they all have lives that are more stressful than ${p.his}. ${p.Sdesc} understands the most important thing in ${p.his} life is ${p.his} family and their support, without them ${p.she} is nothing.`,
        `${p.She}'s always looking out for the success of the team because ${p.she} knows there's strength in unity.`,
        `${p.Sdesc} is unquestioningly loyal to ${p.his} organization. ${p.She} will always take the organization's interests as paramount.`,
        `${p.Sdesc} would do anything to make sure ${p.his} younger sister is safe. ${p.She} and ${p.his} sister have always been close, and that bond has only grown after the death of their mother. ${p.His} sister isn't the brightest crayon in the box and ${p.she} gets into more than ${p.his} fair share of trouble. But ${p.Sdesc} has promised ${p.herself} that he'll protect her come hell or high water.`,
        `${p.She} has sworn to always protect ${p.his} spouse. ${p.She} intends to take care of ${p.his} spouse and cherish them forever.`
      ]);
    case WMACGUFFIN:
      return randomArray([
        `${p.Sdesc} has always been a determined person with aspirations to greater heights. Somewhere deep down ${p.she} can't help but feel that ${p.his} family is being held hostage from the gifts they could have. The next step in achieving this goal is getting ${p.his} hands on the artifact and then finding somone who can teach ${p.him} to wield it.`,
        `${p.Sdesc} wishes to take hold of a powerful artifact in order to use it as leverage against ${p.his} enemies. ${p.She} believes that by obtaining this item and using it as a bargaining chip, ${p.she} will be able to outmaneuver them.`,
        `An ally is being framed for a crime that they didn't commit, and the people framing ${p.him} have all the evidence necessary to frame ${p.him}, so ${p.she} has to steal it.
        `,
        `${p.She} is in need of some decisive evidence to make sure ${p.she} will have a solid case against the enemy.`,
        `${p.Sdesc} believes that whoever owns a certain relic is the rightful heir, and wants to take possession of it.`,
        `${p.She} doesn't want to make a move for the relic because ${p.she} is worried about one of ${p.her} own family members owning it. However, now ${p.she} needs the relic as means of victory.`
      ]);
    case WGREATPOWER:
      return randomArray([
        `${p.Sdesc}'s motivation to help ${p.his} patient was ${p.his} deep rooted need to help live when ${p.she} was learning how to save lives. As ${p.sdesc} grew, ${p.she} realized the seriousness of a healer's role, which drove ${p.him} to help more than just a single life. Helping one person at a time would make all the difference in the world for that individual, but also contribute to bringing change because of people paying it forward.`,
        `To ${p.sdesc} has a compulsive need to solve every problem because ${p.she} feels if ${p.she} doesn't try to solve it, the problem will grow until it consumes ${p.him} and the ones ${p.she} loves most.`,
        `${p.She} always felt like ${p.she} was put on this planet to fix as many wrongs as possible. It gave ${p.him} a purpose in life. ${p.She} felt like ${p.she} could never find any justice or peace in ${p.his} own life until ${p.she} found a way to give those other things to someone else.`,
        `${p.She} feels the need to right wrongs because ${p.she} feels that ${p.she} has been let down by others. ${p.She} feels like ${p.she} needs to prove ${p.herself}, but to whom? ${p.His} family and friends seem to be on a different path. ${p.She} feels forgotten and alone, but still believes that this hero complex is justified.`,
        `${p.She} was tired of being a hero. There were plenty of others and ${p.she} wants to find a replacement.`,
        `${p.She} is tired of the constant praise and attention. ${p.She} wants to be like everyone else, instead of the object of admiration. It ruins mundane things like grocery shopping or finding a parking space. Plus ${p.she} would get to put ${p.herself} first for once, instead of thinking of only others.`,
        `${p.She} just hates how pressure is constantly put on ${p.him}. ${p.His} father had told ${p.him} that ${p.she} needed to be 'The Savior': the one to come home with the W every time. ${p.She} always had to win.`
      ]);
    case WCRAVELOVE:
      return randomArray([
        `${p.She} is not the malevolent antagonist at the center of everything. ${p.She} just wants to be loved and accepted by the people around ${p.him}.`,
        `All people want to be loved, but ${p.sdesc} is one of those people who will do anything to feel loved. ${p.She} needs love like most people need air. Without it, ${p.she} feels as though ${p.she} has nothing left.`,
        `${p.She} is lonely. ${p.She} does not have many friends and thinks that ${p.she} would be happier if ${p.she} did.`,
        `${p.Sdesc}'s motives are to gain fame and have many friends who enjoy ${p.his} company. ${p.She} has some friends, but wants to be popular.`,
        `${p.She} wants to make friends and feel like ${p.she} belongs somewhere. ${p.She} feels lost without even knowing it, ${p.she}'s just so used to being on ${p.his} own.`,
        `${p.She} believes ${p.she} lacks the feeling of love from family. ${p.She} doesn't want to be alone.`,
        `${p.She} has always had a difficult time meeting people. ${p.She} can't seem to find anyone ${p.she} connects with.`,
        `${p.Sdesc} wished for romance, because the forecast of loneliness was looking too gloomy. ${p.She} wanted to find a girl who would love ${p.him} and take care of ${p.him}. ${p.She} wanted someone to date and share the rest of ${p.his} life with.`,
        `${p.Alex} wants something to love unconditionally, but ${p.he} can't find that with a human. ${p.She} adopted a pet but it died early because of an illness. Getting hurt again feels too familiar.`
      ]);
    case WSTRONGETHICS:
      return randomArray([
        `strongethics`,
      ]);
    case WBETTERWORLD:
      return randomArray([
        `betterworld`,
      ]);
    case WPASTMISTAKE:
      return randomArray([
        `pastmistake`,
      ]);
    case WMONEYPOWER:
      return randomArray([
        `moneypower`,
      ]);
    case WPARENTAL:
      return randomArray([
        `parental`,
      ]);
    case WBELOVED:
      return randomArray([
        `beloved`,
      ]);
    case WPRIDE:
      return randomArray([
        `pride`,
      ]);
    case WFAVOUR:
      return randomArray([
        `favour`,
      ]);
    case WFORBIDDEN:
      return randomArray([
        `forbidden`,
      ]);
    case WBEBADASS:
      return randomArray([
        `bebadass`,
      ]);
    case WREVENGE:
      return randomArray([
        `revenge`,
      ]);
    case WBEATFATE:
      return randomArray([
        `beatfate`,
      ]);
    case WADVENTURE:
      return randomArray([
        `adventure`,
      ]);
    case WFOOD:
      return randomArray([
        `food`,
      ]);
    case WLAZY:
      return randomArray([
        `lazy`,
      ]);
    case WAVOIDSPOTLIGHT:
      return randomArray([
        `avoidspotlight`,
      ]);
    case WDEBT:
      return randomArray([
        `debt`,
      ]);
    case WBECOMEBEAUTIFUL:
      return randomArray([
        `becomebeautiful`,
      ]);
    case WBESPECIAL:
      return randomArray([
        `bespecial`,
      ]);
    case WNOSUFFERING:
      return randomArray([
        `nosuffering`,
      ]);
    case WPROVEWRONG:
      return randomArray([
        `provewrong`,
      ]);
    case WUNSTOPPABLERAGE:
      return randomArray([
        `unstoppablerage`,
      ]);
    case WAMBITION:
      return randomArray([
        `ambition`,
      ]);
    case WBEHAPPY:
      return randomArray([
        `behappy`,
      ]);
    case WSPREADHAPPY:
      return randomArray([
        `spreadhappy`,
      ]);
    case WHOMELAND:
      return randomArray([
        `homeland`,
      ]);
    case WGETJOBDONE:
      return randomArray([
        `getjobdone`,
      ]);
    case WRETURNHOME:
      return randomArray([
        `returnhome`,
      ]);
    case WUPHOLDHONOR:
      return randomArray([
        `upholdhonor`,
      ]);
    case WENEMIES:
      return randomArray([
        `enemies`,
      ]);
    case WCOLLECTION:
      return randomArray([
        `collection`,
      ]);
    case WSMALLTHING:
      return randomArray([
        `smallthing`,
      ]);
    case WFREEFROMBONDAGE:
      return randomArray([
        `freefrombondage`,
      ]);
    case WSAVEDLIFE:
      return randomArray([
        `savedlife`,
      ]);
    case WCHOSENONE:
      return randomArray([
        `chosenone`,
      ]);
    case WENVY:
      return randomArray([
        `envy`,
      ]);
    case WLOSTLOVE:
      return randomArray([
        `lostlove`,
      ]);
    case WSPECIFICWEALTH:
      return randomArray([
        `specificwealth`,
      ]);
    case WSPECIFICJOB:
      return randomArray([
        `specificjob`,
      ]);
    case WFAKEHEROISM:
      return randomArray([
        `pracgmaticheroism`,
      ]);
    case WFEAR:
      return randomArray([
        `fear`,
      ]);
    case WBULLY:
      return randomArray([
        `bully`,
      ]);
    case WFORCEDVILLAIN:
      return randomArray([
        `forcedvillain`,
      ]);
    case WDISABLED:
      return randomArray([
        `disabled`,
      ]);
    case WBEHUMAN:
      return randomArray([
        `behuman`,
      ]);
    case WRESURRECT:
      return randomArray([
        `resurrect`,
      ]);
    case WLUST:
      return randomArray([
        `lust`,
      ]);
    case WSEERUINED:
      return randomArray([
        `seeruined`,
      ]);
    default:
      return "";
  }
}

function initWants() {
  want.push(new Aspect("See the world burn", 26, "",
    BWANT, [WWANTBURN], [THEEL], [], [TBADCAUSE], []));
  want.push(new Aspect("Protective of someone", 12, "",
    BWANT, [WPROTECTIVE], [], [], [TDEFENDER], []));
  want.push(new Aspect("Macguffin", 9, "",
    BWANT, [WMACGUFFIN], [], [], [], []));
  want.push(new Aspect("With great power comes great responsibility", 9, "",
    BWANT, [WGREATPOWER], [TFACE], [], [TBADASS, TGOODCAUSE], []));
  want.push(new Aspect("Crave any kind of love", 9, "",
    BWANT, [WCRAVELOVE], [], [], [], []));
  want.push(new Aspect("Strong code of ethics", 7, "",
    BWANT, [WSTRONGETHICS], [], [], [THONORABLE], []));
  want.push(new Aspect("Make the world a better place", 7, "",
    BWANT, [WBETTERWORLD], [TFACE], [], [TGOODCAUSE], []));
  want.push(new Aspect("Past mistake", 7, "",
    BWANT, [WPASTMISTAKE], [], [], [], []));
  want.push(new Aspect("More money and power", 6, "",
    BWANT, [WMONEYPOWER], [], [], [TBADCAUSE], []));
  want.push(new Aspect("Parental approval", 6, "",
    BWANT, [WPARENTAL], [], [], [], []));
  want.push(new Aspect("Willing to do anything for a beloved", 5, "",
    BWANT, [WBELOVED], [], [], [TGOODCAUSE], []));
  want.push(new Aspect("Better than everyone else", 5, "",
    BWANT, [WPRIDE], [], [], [], []));
  want.push(new Aspect("Owe someone a favour", 4, "",
    BWANT, [WFAVOUR], [], [], [], []));
  want.push(new Aspect("Seek forbidden knowledge", 4, "",
    BWANT, [WFORBIDDEN], [], [], [], []));
  want.push(new Aspect("Want others to consider them badass", 4, "",
    BWANT, [WBEBADASS], [], [], [], [TBADASS]));
  want.push(new Aspect("Revenge", 3, "",
    BWANT, [WREVENGE], [], [], [], []));
  want.push(new Aspect("Fated for something", 3, "",
    BWANT, [WBEATFATE], [], [], [], []));
  want.push(new Aspect("Adventure and danger in their lives", 3, "",
    BWANT, [WADVENTURE], [], [], [], []));
  want.push(new Aspect("Just here for the free food", 3, "",
    BWANT, [WFOOD], [], [], [], []));
  want.push(new Aspect("Purposely lazy to avoid the pain of failure", 3, "",
    BWANT, [WLAZY], [], [], [], []));
  want.push(new Aspect("Avoid the spotlight and high expectations", 2, "",
    BWANT, [WAVOIDSPOTLIGHT], [], [], [], []));
  want.push(new Aspect("Debt to pay off", 2, "",
    BWANT, [WDEBT], [], [], [], []));
  want.push(new Aspect("Become beautiful", 2, "",
    BWANT, [WBECOMEBEAUTIFUL], [], [], [], []));
  want.push(new Aspect("Be special", 2, "",
    BWANT, [WBESPECIAL], [], [], [], []));
  want.push(new Aspect("Don't want others to suffer", 2, "",
    BWANT, [WNOSUFFERING], [], [], [], []));
  want.push(new Aspect("Prove someone wrong", 2, "",
    BWANT, [WPROVEWRONG], [], [], [], []));
  want.push(new Aspect("Unstoppable rage", 2, "",
    BWANT, [WUNSTOPPABLERAGE], [], [], [], []));
  want.push(new Aspect("Ambition", 2, "",
    BWANT, [WAMBITION], [], [PAMBITION], [], []));
  want.push(new Aspect("Be happy", 1, "",
    BWANT, [WBEHAPPY], [], [], [], []));
  want.push(new Aspect("Spread happiness", 1, "",
    BWANT, [WSPREADHAPPY], [], [], [], []));
  want.push(new Aspect("Homeland", 1, "",
    BWANT, [WHOMELAND], [], [], [], []));
  want.push(new Aspect("Get the job done and rest at home", 1, "",
    BWANT, [WGETJOBDONE], [], [], [], []));
  want.push(new Aspect("Return to their original home", 1, "",
    BWANT, [WRETURNHOME], [], [], [], []));
  want.push(new Aspect("Uphold family honor", 1, "",
    BWANT, [WUPHOLDHONOR], [], [], [], []));
  want.push(new Aspect("Great people must have lots of enemies", 1, "",
    BWANT, [WENEMIES], [], [], [], []));
  want.push(new Aspect("Fill out a collection", 1, "",
    BWANT, [WCOLLECTION], [], [], [], []));
  want.push(new Aspect("Small thing", 1, "",
    BWANT, [WSMALLTHING], [], [], [], []));
  want.push(new Aspect("Freedom from some bondage", 1, "",
    BWANT, [WFREEFROMBONDAGE], [], [], [], []));
  want.push(new Aspect("Saved life", 1, "",
    BWANT, [WSAVEDLIFE], [], [], [], []));
  want.push(new Aspect("Chosen one", 1, "",
    BWANT, [WCHOSENONE], [], [], [], []));
    want.push(new Aspect("Deeply envy someone", 1, "",
    BWANT, [WENVY], [], [], [], []));
  want.push(new Aspect("Find a lost or kidnapped loved one", 1, "",
    BWANT, [WLOSTLOVE], [], [], [], []));
  want.push(new Aspect("Specific form of wealth", 1, "",
    BWANT, [WSPECIFICWEALTH], [], [], [], []));
  want.push(new Aspect("Specific job", 1, "",
    BWANT, [WSPECIFICJOB], [], [], [], []));
  want.push(new Aspect("Heroism is more practical", 1, "",
    BWANT, [WFAKEHEROISM], [THEEL], [], [], []));
  want.push(new Aspect("Motivated by fear", 1, "",
    BWANT, [WFEAR], [], [], [], []));
  want.push(new Aspect("Bully others out of fear of being bullied", 1, "",
    BWANT, [WBULLY], [THEEL], [], [], []));
  want.push(new Aspect("Only perform villainous acts because otherwise they die", 1, "",
    BWANT, [WFORCEDVILLAIN], [THEEL], [], [], []));
  want.push(new Aspect("Disabled", 1, "",
    BWANT, [WDISABLED], [], [], [], []));
  want.push(new Aspect("Be human", 1, "",
    BWANT, [WBEHUMAN], [], [], [], []));
  want.push(new Aspect("Resurrect another dead character", 1, "",
    BWANT, [WRESURRECT], [], [], [], []));
  want.push(new Aspect("Really want someone", 1, "",
    BWANT, [WLUST], [], [], [], []));
  want.push(new Aspect("See someone else's successes ruined", 1, "",
    BWANT, [WSEERUINED], [], [], [], []));
}