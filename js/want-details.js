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
        `${p.Sdesc} wants to see the world burn because ${p.she} enjoys the suffering of others. ${p.She} gets a sick satisfaction from watching people suffer, and ${p.she} loves to inflict pain on others. By destroying everything in ${p.his} path, ${p.she} believes ${p.she} can become the ultimate dictator.`,
        `${p.Sdesc} wants to destroy the world because ${p.she} believes that humanity is inherently evil and that life on Earth is nothing but a cycle of pain and suffering. ${p.She} believes that by destroying the world, ${p.she} can put an end to all of the misery and heartache that humans have caused throughout history.`,
        `${p.Sdesc} wants to destroy the world because ${p.she} believes that humans are inherently evil and that the world would be better off without them. ${p.She} believes that the natural order of things is for animals to dominate over humans, and ${p.she} wants to see this come to fruition. ${p.She} also believes that by destroying the world, ${p.she} will be able to ascend to a higher level of existence where ${p.she} can be free from the pain and suffering that humans cause.`,
        `${p.Sdesc} wants to destroy the world because ${p.she} believes that it is a corrupt and evil place. ${p.She} thinks that if ${p.she} can erase humanity from the earth, then things can be made right again. ${p.She} is convinced that ${p.she} is doing the world a favor by destroying it, and ${p.she} doesn't care about the consequences that ${p.her} actions will have on the innocent people who live here.`,
        `${p.Sdesc} wants to see the world burn because ${p.she} is angry at the way things are. ${p.She} feels like the world has wronged ${p.her} and ${p.she} wants to get back at it. ${p.She} believes that if the world burns, then everyone will suffer equally.`,
        `${p.Sdesc} is a very angry person. ${p.She} is angry at the world, and ${p.she} is angry at those who are not like ${p.him}. ${p.She} likes to take ${p.his} anger out on others, using violence and cruelty as ${p.his} weapon of choice. ${p.She} has been this way for most of ${p.his} life, and ${p.she} doesn't see any reason to change now.`,
        `${p.Sdesc} is life's biggest burden, a plague to drive away any happiness that may try to infect the world. ${p.She} has a goal, and ${p.his} goal is to make everyone miserable.`,
        `${p.Sdescs} abusive childhood led to this. ${p.She} enjoyed seeing people suffer, and developed a sadistic personality.`,
      ]);
    case WPROTECTIVE:
      return randomArray([
        `protective`,
      ]);
    case WMACGUFFIN:
      return randomArray([
        `macguffin`,
      ]);
    case WGREATPOWER:
      return randomArray([
        `greatpower`,
      ]);
    case WCRAVELOVE:
      return randomArray([
        `cravelove`,
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
    BWANT, [WWANTBURN], [THEEL], [], [], []));
  want.push(new Aspect("Protective of someone", 12, "",
    BWANT, [WPROTECTIVE], [], [], [TDEFENDER], []));
  want.push(new Aspect("Macguffin", 9, "",
    BWANT, [WMACGUFFIN], [], [], [], []));
  want.push(new Aspect("With great power comes great responsibility", 9, "",
    BWANT, [WGREATPOWER], [TFACE], [], [TBADASS], []));
  want.push(new Aspect("Crave any kind of love", 9, "",
    BWANT, [WCRAVELOVE], [], [], [], []));
  want.push(new Aspect("Strong code of ethics", 7, "",
    BWANT, [WSTRONGETHICS], [], [], [THONORABLE], []));
  want.push(new Aspect("Make the world a better place", 7, "",
    BWANT, [WBETTERWORLD], [TFACE], [], [], []));
  want.push(new Aspect("Past mistake", 7, "",
    BWANT, [WPASTMISTAKE], [], [], [], []));
  want.push(new Aspect("More money and power", 6, "",
    BWANT, [WMONEYPOWER], [], [], [], []));
  want.push(new Aspect("Parental approval", 6, "",
    BWANT, [WPARENTAL], [], [], [], []));
  want.push(new Aspect("Willing to do anything for a beloved", 5, "",
    BWANT, [WBELOVED], [], [], [], []));
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