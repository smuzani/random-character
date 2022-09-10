const WWANTBURN = 'worldburn';
const WPROTECTIVE = 'protective';
const WMACGUFFIN = 'macguffin';
const WSTRONGETHICS = 'strongethics';
const WPERSONAL = 'personal';
const WPAPPROVAL = 'parentalapproval';
const WBETTERWORLD = 'betterworld';
const WANYTHINGFORLOVE = 'anythingforlove';
const WREVENGE = 'revenge';
const WFAVOUR = 'favour';
const WGREATRESPONSIBILITY = 'greatresponsibility';
const WFORBIDDEN = 'forbidden';
const WPROVEBETTER = 'provebetter';
const WMONEYPOWER = 'moneypower';
const WFRIENDS = 'friends';
const WBEATFATE = 'beatfate';
const WCHOSENONE = 'chosenone';
const WHAPPINESS = 'happiness';
const WPASTMISTAKE = 'pastmistake';
const WSAVEHOMELAND = 'savehomeland';
const WPAYDEBT = 'paydebt';
const WDUNDERPERFORM = 'deliberateunderperformance';
const WDDOC = 'determineddoctor';
const WDESPERATEPURPOSE = 'desperatepurpose';
const WDESPOTISM = 'despotism';
const WDYSTOPIA = 'dystopia';
const WDISMOTIVATION = 'dismotivation';
const WDRIVENBYENVY = 'drivenbyenvy';
const WEMBODIMENT = 'embodiment';
const WENEMIES = 'enemies';
const WFAILURE = 'failureknight';
const WFAMILYHONOUR = 'familyhonour';
const WFIGHTING = 'fighting';
const WFORGREAT = 'forgreat';
const WFORHAPPINESS = 'forhappiness';
const WFAMILY = 'family';
const WROMANCE = 'romance';
const WUNCONDITIONAL = 'unconditional';
const WGLORYSEEKER = 'gloryseeker';
const WGLORYHOUND = 'gloryhound';
const WGOALINLIFE = 'goalinlife';
const WGOTTACATCH = 'gottacatch';
const WHEALTHCARE = 'healthcare';
const WHOMESWEET = 'homesweet';
const WHUMBLE = 'humble';
const WJUSTBADASS = 'justbadass';
const WJUSTBEAUTIFUL = 'justbeautiful';
const WJUSTFREE = 'justfree';
const WJUSTLOVED = 'justloved';
const WJUSTSPECIAL = 'justspecial';
const WJUSTYOU = 'justyou';
const WIOWEYOU = 'ioweyou';
const WBEREALMAN = 'berealman';
const WIWILLFINDYOU = 'iwillfindyou';
const WINHARMWAY = 'inharmway';
const WJUSTSNACKS = 'justsnacks';
const WLOVESGOLD = 'lovesgold';
const WMPRAGMATIST = 'moralpragmatist';
const WMOTIVATEDBYFEAR = 'motivatedbyfear';
const WMSTICK = 'motivationonastick';
const WNEVERBEHURT = 'neverbehurtagain';
const WOPPOSESUFFERED = 'opposesuffered';
const WPPBULLT = 'peerpressuredbully';
const WPHYTHERAPY = 'physicaltherapy';
const WPINOCCHIO = 'pinocchiosyndrome';
const WPOWEROFAPATHY = 'powerofapathy';
const WPOWEROFHATE = 'powerofhate';
const WPURSUEDREAM = 'pursuedream';
const WRAHEAVENS = 'rageagainstheavens';
const WRESTARTWORLD = 'restarttheworld';
const WRICHBOREDOM = 'richboredom';
const WSAMARITAN = 'samaritan';
const WSEEKSRESURRECTION = 'seeksresurrection';
const WLUST = 'lust';
const WENVY = 'envy';
const WSLOTH = 'sloth';
const WWRATH = 'wrath';
const WGLUTTONY = 'gluttony';
const WCOMEHOME = 'noplacelikehome';
const WPLAYGROUND = 'playground';
const WTHEYMAD = 'theymad';
const WTRADREAM = 'tragicdream';
const WTRAPPED = 'trappedinvillainy';
const WTHRILLSEEKER = 'thrillseeker';
const WBODYUPGRADE = 'bodyupgrade';
const WGUILT = 'survivorguilt';


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
    default:
      return "";
  }
}

function initWants() {
  want.push(new Aspect("See the world burn", 11, "",
    BWANT, [WWANTBURN], [], [], [], []));
  want.push(new Aspect("Protective of someone", 12, "",
    BWANT, [WPROTECTIVE], [], [], [], []));
  want.push(new Aspect("Macguffin", 9, "",
    BWANT, [WMACGUFFIN], [], [], [], []));
  want.push(new Aspect("Strong code of ethics", 7, "",
    BWANT, [WSTRONGETHICS], [], [], [], []));
  want.push(new Aspect("It's personal", 7, "",
    BWANT, [WPERSONAL], [], [], [], []));
  want.push(new Aspect("Parental approval", 6, "",
    BWANT, [WPAPPROVAL], [], [], [], []));
  want.push(new Aspect("Make the world a better place", 6, "",
    BWANT, [WBETTERWORLD], [], [], [], []));
  want.push(new Aspect("Anything for a beloved", 5, "",
    BWANT, [WANYTHINGFORLOVE], [], [], [], []));
  want.push(new Aspect("Revenge", 5, "",
    BWANT, [WREVENGE], [], [], [], []));
  want.push(new Aspect("Owe someone a favour", 4, "",
    BWANT, [WFAVOUR], [], [], [], []));
  want.push(new Aspect("With great power comes great responsibility", 8, "",
    BWANT, [WGREATRESPONSIBILITY], [], [], [], []));
  want.push(new Aspect("Seek forbidden knowledge", 4, "",
    BWANT, [WFORBIDDEN], [], [], [], []));
  want.push(new Aspect("Better than everyone else", 4, "",
    BWANT, [WPROVEBETTER], [], [], [], []));
  want.push(new Aspect("More money and power", 6, "",
    BWANT, [WMONEYPOWER], [], [], [], []));
  want.push(new Aspect("Just want friends", 3, "",
    BWANT, [WFRIENDS], [], [], [], []));
  want.push(new Aspect("Beat fate", 3, "",
    BWANT, [WBEATFATE], [], [], [], []));
  want.push(new Aspect("Chosen one", 1, "",
    BWANT, [WCHOSENONE], [], [], [], []));
  want.push(new Aspect("Happiness", 1, "",
    BWANT, [WHAPPINESS], [], [], [], []));
  want.push(new Aspect("Past mistake", 1, "",
    BWANT, [WPASTMISTAKE], [], [], [], []));
  want.push(new Aspect("Save homeland", 1, "",
    BWANT, [WSAVEHOMELAND], [], [], [], []));
  want.push(new Aspect("Pay off debt", 1, "",
    BWANT, [WPAYDEBT], [], [], [], []));
  want.push(new Aspect("Deliberate underperformance", 1, "",
    BWANT, [WDUNDERPERFORM], [], [], [], []));
  want.push(new Aspect("Determined Doctor", 1, "",
    BWANT, [WDDOC], [], [], [], []));
  want.push(new Aspect("Desperately looking for a purpose in life", 1, "",
    BWANT, [WDESPERATEPURPOSE], [], [], [], []));
  want.push(new Aspect("Despotism justifies the means", 1, "",
    BWANT, [WDESPOTISM], [], [], [], []));
  want.push(new Aspect("Dystopia justifies the means", 1, "",
    BWANT, [WDYSTOPIA], [], [], [], []));
  want.push(new Aspect("Dismotivation", 1, "",
    BWANT, [WDISMOTIVATION], [], [], [], []));
  want.push(new Aspect("Driven by envy", 1, "",
    BWANT, [WDRIVENBYENVY], [], [], [], []));
  want.push(new Aspect("Embodiment of virtue", 1, "",
    BWANT, [WEMBODIMENT], [], [], [], []));
  want.push(new Aspect("Enemies equals greatness", 1, "",
    BWANT, [WENEMIES], [], [], [], []));
  want.push(new Aspect("Failure Knight", 1, "",
    BWANT, [WFAILURE], [], [], [], []));
  want.push(new Aspect("Family honour", 1, "",
    BWANT, [WFAMILYHONOUR], [], [], [], []));
  want.push(new Aspect("Fighting for a homeland", 1, "",
    BWANT, [WFIGHTING], [], [], [], []));
  want.push(new Aspect("For great justice", 1, "",
    BWANT, [WFORGREAT], [], [], [], []));
  want.push(new Aspect("For happiness", 1, "",
    BWANT, [WFORHAPPINESS], [], [], [], []));
  want.push(new Aspect("Family", 1, "",
    BWANT, [WFAMILY], [], [], [], []));
  want.push(new Aspect("Romance", 1, "",
    BWANT, [WROMANCE], [], [], [], []));
  want.push(new Aspect("Unconditional love", 1, "",
    BWANT, [WUNCONDITIONAL], [], [], [], []));
  want.push(new Aspect("Glory seeker", 1, "",
    BWANT, [WGLORYSEEKER], [], [], [], []));
  want.push(new Aspect("Glory hound", 1, "",
    BWANT, [WGLORYHOUND], [], [], [], []));
  want.push(new Aspect("Goal in life", 1, "",
    BWANT, [WGOALINLIFE], [], [], [], []));
  want.push(new Aspect("Gotta catch them all", 1, "",
    BWANT, [WGOTTACATCH], [], [], [], []));
  want.push(new Aspect("Healthcare motivation", 1, "",
    BWANT, [WHEALTHCARE], [], [], [], []));
    want.push(new Aspect("Home sweet home", 1, "",
    BWANT, [WHOMESWEET], [], [], [], []));
  want.push(new Aspect("Humble goal", 1, "",
    BWANT, [WHUMBLE], [], [], [], []));
  want.push(new Aspect("I just want to be badass", 1, "",
    BWANT, [WJUSTBADASS], [], [], [], []));
  want.push(new Aspect("I just want to be beautiful", 1, "",
    BWANT, [WJUSTBEAUTIFUL], [], [], [], []));
  want.push(new Aspect("I just want to be free", 1, "",
    BWANT, [WJUSTFREE], [], [], [], []));
  want.push(new Aspect("I just want to be loved", 1, "",
    BWANT, [WJUSTLOVED], [], [], [], []));
  want.push(new Aspect("I just want to be special", 1, "",
    BWANT, [WJUSTSPECIAL], [], [], [], []));
  want.push(new Aspect("I just want to be you", 1, "",
    BWANT, [WJUSTYOU], [], [], [], []));
  want.push(new Aspect("I owe you my life", 1, "",
    BWANT, [WIOWEYOU], [], [], [], []));
  want.push(new Aspect("I want to be a real man", 1, "",
    BWANT, [WBEREALMAN], [], [], [], []));
  want.push(new Aspect("I will find you", 1, "",
    BWANT, [WIWILLFINDYOU], [], [], [], []));
  want.push(new Aspect("In harm's way", 1, "",
    BWANT, [WINHARMWAY], [], [], [], []));
  want.push(new Aspect("Just gere for the free snacks", 1, "",
    BWANT, [WJUSTSNACKS], [], [], [], []));
  want.push(new Aspect("Loves only gold", 1, "",
    BWANT, [WLOVESGOLD], [], [], [], []));
  want.push(new Aspect("Moral pragmatist", 1, "",
    BWANT, [WMPRAGMATIST], [], [], [], []));
  want.push(new Aspect("Motivated by fear", 1, "",
    BWANT, [WMOTIVATEDBYFEAR], [], [], [], []));
  want.push(new Aspect("Motivation on a stick", 1, "",
    BWANT, [WMSTICK], [], [], [], []));
  want.push(new Aspect("Never be hurt again", 1, "",
    BWANT, [WNEVERBEHURT], [], [], [], []));
  want.push(new Aspect("Oppose what you suffered", 1, "",
    BWANT, [WOPPOSESUFFERED], [], [], [], []));
  want.push(new Aspect("Peer-Pressured Bully", 1, "",
    BWANT, [WPPBULLT], [], [], [], []));
  want.push(new Aspect("Physical Therapy Plot", 1, "",
    BWANT, [WPHYTHERAPY], [], [], [], []));
  want.push(new Aspect("Pinocchio Syndrome", 1, "",
    BWANT, [WPINOCCHIO], [], [], [], []));
  want.push(new Aspect("The Power of Apathy", 1, "",
    BWANT, [WPOWEROFAPATHY], [], [], [], []));
  want.push(new Aspect("The Power of Hate", 1, "",
    BWANT, [WPOWEROFHATE], [], [], [], []));
  want.push(new Aspect("Pursue the Dream Job", 1, "",
    BWANT, [WPURSUEDREAM], [], [], [], []));
  want.push(new Aspect("Rage Against the Heavens", 1, "",
    BWANT, [WRAHEAVENS], [], [], [], []));
  want.push(new Aspect("Restart the World", 1, "",
    BWANT, [WRESTARTWORLD], [], [], [], []));
  want.push(new Aspect("Rich Boredom", 1, "",
    BWANT, [WRICHBOREDOM], [], [], [], []));
  want.push(new Aspect("Samaritan Syndrome", 1, "",
    BWANT, [WSAMARITAN], [], [], [], []));
  want.push(new Aspect("Seeks Another's Resurrection", 1, "",
    BWANT, [WSEEKSRESURRECTION], [], [], [], []));
  want.push(new Aspect("Lust", 1, "",
    BWANT, [WLUST], [], [], [], []));
  want.push(new Aspect("Envy", 1, "",
    BWANT, [WENVY], [], [], [], []));
  want.push(new Aspect("Sloth", 1, "",
    BWANT, [WSLOTH], [], [], [], []));
  want.push(new Aspect("Wrath", 1, "",
    BWANT, [WWRATH], [], [], [], []));
  want.push(new Aspect("Gluttony", 1, "",
    BWANT, [WGLUTTONY], [], [], [], []));
  want.push(new Aspect("There's no place like home", 1, "",
    BWANT, [WCOMEHOME], [], [], [], []));
  want.push(new Aspect("To create a playground for evil", 1, "",
    BWANT, [WPLAYGROUND], [], [], [], []));
  want.push(new Aspect("They called me mad!", 1, "",
    BWANT, [WTHEYMAD], [], [], [], []));
  want.push(new Aspect("Tragic dream", 1, "",
    BWANT, [WTRADREAM], [], [], [], []));
  want.push(new Aspect("Trapped in Villainy", 1, "",
    BWANT, [WTRAPPED], [], [], [], []));
  want.push(new Aspect("Thrill seeker", 1, "",
    BWANT, [WTHRILLSEEKER], [], [], [], []));
  want.push(new Aspect("Working for a body upgrade", 1, "",
    BWANT, [WBODYUPGRADE], [], [], [], []));
  want.push(new Aspect("Survivor Guilt", 3, "",
    BWANT, [WGUILT], [], [], [], []));
}