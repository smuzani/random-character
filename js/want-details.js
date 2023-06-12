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
const WAMBITION = 'want-ambition';
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
        `${p.Sdescs} abusive childhood led to this. ${p.She} enjoyed seeing people suffer, and developed a sadistic personality.`,
        `${p.Sdesc} is just fed up with life. ${p.She} just wants to see the world burn down.`,
      ]);
    case WPROTECTIVE:
      return randomArray([
        `${p.Sdesc}'s loyalty is to ${p.his} family. One of the main reasons ${p.she} is so loyal is because of how much everyone else in ${p.his} family works, they all have lives that are more stressful than ${p.his}. ${p.Sdesc} understands the most important thing in ${p.his} life is ${p.his} family and their support, without them ${p.she} is nothing.`,
        `${p.She}'s always looking out for the success of the team because ${p.she} knows there's strength in unity.`,
        `${p.Sdesc} is unquestioningly loyal to ${p.his} organization. ${p.She} will always take the organization's interests as paramount.`,
        `${p.Sdesc} would do anything to make sure ${p.his} younger sister is safe. ${p.She} and ${p.his} sister have always been close, and that bond has only grown after the death of their mother. ${p.His} sister isn't the brightest crayon in the box and ${p.she} gets into more than ${p.his} fair share of trouble. But ${p.sdesc} has promised ${p.herself} that he'll protect her come hell or high water.`,
        `${p.She} has sworn to always protect ${p.his} spouse.`
      ]);
    case WMACGUFFIN:
      return randomArray([
        `${p.Sdesc} has always been a determined person with aspirations to greater heights. Somewhere deep down ${p.she} can't help but feel that ${p.his} family is being held hostage from the gifts they could have. The next step in achieving this goal is getting ${p.his} hands on the artifact and then finding somone who can teach ${p.him} to wield it.`,
        `${p.Sdesc} wishes to take hold of a powerful artifact in order to use it as leverage against ${p.his} enemies. ${p.She} believes that by obtaining this item and using it as a bargaining chip, ${p.she} will be able to outmaneuver them.`,
        `An ally is being framed for a crime that they didn't commit. The people framing the ally have all the evidence necessary. ${p.Sdesc} has to get the evidence in time, using legal or illegal means.
        `,
        `${p.She} is in need of some decisive evidence to make sure ${p.she} will have a solid case against the enemy.`,
        `${p.Sdesc} believes that whoever owns a certain relic is the rightful heir, and wants to take possession of it.`,
        `${p.She} doesn't want to make a move for the relic because ${p.she} is worried about one of ${p.his} own family members owning it. However, now ${p.she} needs the relic as means of victory.`
      ]);
    case WGREATPOWER:
      return randomArray([
        `As ${p.sdesc} grew, ${p.she} realized the seriousness of a healer's role, which drove ${p.him} to help more than just a single life. Helping one person at a time would make all the difference in the world for that individual, but also contribute to bringing change because of people paying it forward.`,
        `${p.Sdesc} has a compulsive need to solve every problem because ${p.she} feels if ${p.she} doesn't try to solve it, the problem will grow until it consumes ${p.him} and the ones ${p.she} loves most.`,
        `${p.She} always felt like ${p.she} was put on this planet to fix as many wrongs as possible. It gave ${p.him} a purpose in life. ${p.She} felt like ${p.she} could never find any justice or peace in ${p.his} own life until ${p.she} found a way to give those other things to someone else.`,
        `${p.She} feels the need to right wrongs because ${p.she} feels that ${p.she} has been let down by others. ${p.She} feels like ${p.she} needs to prove ${p.herself}, but to whom? ${p.His} family and friends seem to be on a different path. ${p.She} feels forgotten and alone, but still believes that this hero complex is justified.`,
        `${p.She} was tired of being a hero. There were plenty of others and ${p.she} wants to find a replacement.`,
        `${p.She} is tired of the constant praise and attention. ${p.She} wants to be like everyone else, instead of the object of admiration. It ruins mundane things like grocery shopping or finding a parking space. Plus ${p.she} would get to put ${p.herself} first for once, instead of thinking of only others.`,
        `${p.She} just hates how pressure is constantly put on ${p.him}. ${p.His} father had told ${p.him} that ${p.she} needed to be the savior, to come home with the win even when everyone else wasn't doing their part.`
      ]);
    case WCRAVELOVE:
      return randomArray([
        `${p.She} isn't as bad as everyone thinks. ${p.She} just wants to be loved and accepted by the people around ${p.him}.`,
        `All people want to be loved, but ${p.sdesc} is one of those people who will do anything to feel loved. ${p.She} needs love like most people need air. Without it, ${p.she} feels as though ${p.she} has nothing left.`,
        `${p.She} is lonely. ${p.She} does not have many friends and thinks that ${p.she} would be happier if ${p.she} did.`,
        `${p.Sdesc}'s motives are to gain fame and have many friends who enjoy ${p.his} company. ${p.She} has some friends, but wants to be popular.`,
        `${p.She} wants to make friends and feel like ${p.she} belongs somewhere. ${p.She} feels lost without even knowing it, ${p.she}'s just so used to being on ${p.his} own.`,
        `${p.She} believes ${p.she} lacks the feeling of love from family. ${p.She} doesn't want to be alone.`,
        `${p.She} has always had a difficult time meeting people. ${p.She} can't seem to find anyone ${p.she} connects with.`,
        `${p.Sdesc} wished for romance, because the forecast of loneliness was looking too gloomy. ${p.She} wanted to find a girl who would love ${p.him} and take care of ${p.him}. ${p.She} wanted someone to date and share the rest of ${p.his} life with.`,
        `${p.Sdesc} wants something to love unconditionally, but ${p.she} can't find that with a human. ${p.She} adopted a pet but it died early because of an illness. Getting hurt again feels too familiar.`
      ]);
    case WSTRONGETHICS:
      return randomArray([
        `${p.Sdesc} is a soldier. ${p.She} was bred for duty, forged by flames and fury. Rain or shine, blood or tears, ${p.sdesc} will do ${p.his} duty. ${p.She} always has, ${p.she} always would.`,
        `${p.Sdesc} will always do the right thing, no matter the consequences.`,
        `${p.Sdesc} is a deeply moral person. ${p.She} believes in doing what is right and just, even against the odds, even if it means sacrificing ${p.herself} for others.`,
        `${p.Sdesc} does the right thing. ${p.She} has always had a dim view of pragmatism, believing that tough choices are for tough people.`
      ]);
    case WBETTERWORLD:
      return randomArray([
        `${p.She} uses ${p.his} power to drive back evil forces and save humanity.`,
        `The might of ${p.sdesc} is what keeps society safe. ${p.She} is willing to risk ${p.his} life and die if it means fighting for justice.`,
        `${p.His} motivation is to help the world, and to make it a better place in any way ${p.she} can, not just for its people but also for the animals. ${p.She} wants healing, forgiveness and peace.`,
        `${p.She} is motivated not by ${p.his} own interests but by a love for others. All ${p.his} efforts gravitate towards easing the pain and suffering of others.`,
        `${p.She} is motivated by a strong sense of love for others. The only thing that seems to make ${p.him} feel better is helping those who need it.`
      ]);
    case WPASTMISTAKE:
      return randomArray([
        `${p.Sdesc} feels guilty for being the only survivor. ${p.She} knew that ${p.she} should have died with ${p.his} friend. Sometimes ${p.she} still has panic attacks remembering the incident.`,
        `One of the people under ${p.his} watch passed away--one of many casualties in a crisis. ${p.Sdesc} feels personally responsible. Why couldn't ${p.she} have done more to save her?`,
        `${p.Sdesc} hates ${p.herself} for not being able to save and protect everyone. There were so many people that ${p.she} couldn't save.`,
        `${p.Sdesc} feels guilt over the people ${p.she} couldn't save.`,        
        `${p.Sdesc} screwed up so badly ${p.she} was nearly fired. But ${p.she} was given a second chance and was determined to do well this time.`,
        `When ${p.sdesc} took the oath, ${p.she} promised ${p.his} patients that ${p.she} would do whatever it took to make them healthy.`,
        `${p.Sdesc} always been able to protect ${p.his} family from danger, and this has always tormented ${p.him}.`
      ]);
    case WMONEYPOWER:
      return randomArray([
        `${p.Sdesc} never has enough and is always trying to take more.`,
        `${p.Sdesc} is greedy and wants more. ${p.She} dreams of a better life, being surrounded by luxury and the feeling of power.`,
        `${p.Sdesc} always wanted to be more famous than ${p.his} cousin. But ${p.she} has reached a plateau. ${p.She} is trying to leverage ${p.his} current fame and get into politics for more money and power.`,
        `${p.Sdesc} has this idea in ${p.his} head that if ${p.she} made more money and had more power, ${p.his} family would respect ${p.him} more.`,
        `${p.She} always dreamed of making a better world to live in. ${p.She} thought the government is not doing what they could be doing. Along with some friends, they set a goal to take over the world.`,
        `${p.Sdesc} doesn’t want to be a statistic. ${p.She} wants a better world and will go to extremes to make sure that it happens. ${p.She} also feels that ${p.she} is the one that must see this through due to what ${p.she} has gone through in life.`
      ]);
    case WPARENTAL:
      return randomArray([
        `${p.Sdesc} feels that if ${p.she} were to work hard enough, ${p.she} might earn the respect of ${p.his} dad.`,
        `As a child, ${p.sdesc} was desperate for ${p.his} father's approval. As they grow, ${p.sdesc}'s father becomes more distant, and ${p.sdesc} wishes ${p.she} could understand why he doesn't love ${p.him}.`,
        `${p.Sdesc} is very devoted to ${p.his} mother and puts in lots of effort to get her approval.`,
        `${p.She} has an intense need to feel needed and loved by ${p.his} mother, who due to Alzheimer's disease, will not likely remember anything ${p.she} says or does.`,
        `All ${p.she} wants is for ${p.his} mentor to approve of ${p.him}. But ${p.she} can never please ${p.his} mentor, no matter what ${p.she} does.`,
        `${p.She} has a hard time meeting all the standards that ${p.his} mentor puts before ${p.him}.`,
      ]);
    case WBELOVED:
      return randomArray([
        `The person that ${p.sdesc} loves, might be happy with someone else, but ${p.she} is willing to let go of ${p.his} own happiness for the sake of their happiness.`,
        `${p.Sdesc} would do anything for the one ${p.she} loves. ${p.She} has a tendency to let the other person control ${p.him}.`,
        `${p.She} wants the person ${p.she} loves to be happy. ${p.She} ultimately chooses the person ${p.she} loves over ${p.herself}.`
      ]);
    case WPRIDE:
      return randomArray([
        `${p.She} has a deep, gnawing resentment towards someone more popular than ${p.him}.`,
        `${p.She} will do what it takes to be the best. ${p.She} is driven not by ${p.his} need to save people, but rather to uphold ${p.his} pride of being a hero for them.`,
        `${p.Sdesc} values ${p.herself} highly. ${p.She} knows that ${p.his} peers do not always hold ${p.him} in high esteem- ${p.she} is often underestimated and underestimated. ${p.She} feels that if ${p.she} can prove that ${p.she} can survive any challenge, then they will give ${p.him} the respect ${p.she} deserves.`,
        `${p.She} was tired of being told that ${p.she} wasn't good enough. It was time for ${p.him} to prove ${p.herself}.`,
      ]);
    case WFAVOUR:
      return randomArray([
        `Someone was nice to ${p.sdesc} in the past, back when ${p.she} was a creep. ${p.She} remembers them and tries to repay the favor.`,
        `Someone treated ${p.sdesc} with respect once, back when nobody else cared about ${p.him}. Because of that, ${p.she} goes out of ${p.his} way to be nice to others.`,
        `When everyone else treated ${p.sdesc} as an outcast, someone welcomed ${p.him}. ${p.She} will go out of ${p.his} way to help that person.`,
      ]);
    case WFORBIDDEN:
      return randomArray([
        `${p.Sdesc} does experiments that does a lot of harm and has no benefits, out of curiosity.`,
        `${p.Sdesc} seeks forbidden knowledge, for no other purpose than the thrill of seeking something forbidden.`,
        `${p.Sdesc} wishes to invent devastating weapons to be used for peace.`,
        `${p.Sdesc} is attempting to create a work of art using a process and materials that could harm others.`
      ]);
    case WBEBADASS:
      return randomArray([
        `${p.Sdesc} isn't the most attractive person, in fact ${p.she}'s a little nerdy. So ${p.she} wants to prove that looks aren't everything and that ${p.she} can take care of ${p.herself} too.`,
        `${p.Sdesc} can't bear to be a nobody. ${p.She} is motivated by the desire to be a great hero, respected by everyone.`,
        `${p.Sdesc} tries to go out on an adventure, to prove to everyone just how talented ${p.she} is.`,
        `${p.Sdesc} wants to be remembered and is willing to commit vile acts to achieve that.`,
      ]);
    case WREVENGE:
      return randomArray([
        `${p.Sdesc} is avengeful and sad. ${p.She} wants the gods to pay for what they have done to ${p.him}.`,
        `${p.Sdesc} is intent on getting revenge on a traitor.`,
        `${p.Sdesc} lost a family member to a crime, and will do anything to get them to face justice.`,
      ]);
    case WBEATFATE:
      return randomArray([
        `A soothsayer predicts that ${p.sdesc} will not accomplish anything significant in life. It angers ${p.sdesc}, and ${p.she} wants to prove them wrong.`,
        `${p.She} is prophesied to be married to someone, when ${p.she} loves someone else. ${p.She} is intent on proving the prophecy wrong.`,
        `${p.Sdesc} doesn't want to go against a prophecy, but ${p.she} hates that they are constantly terrified of one. ${p.She} just wants to live a normal life and focus on ${p.herself}. ${p.She} plans on proving the prophets wrong.`
      ]);
    case WADVENTURE:
      return randomArray([
        `${p.Sdesc} longs for a life full of excitement and danger, feeling that ${p.his} current life is too mundane.`,
        `${p.Sdesc} constantly dreams of exploring new places and facing down perilous challenges.`,
        `Despite ${p.his} ordinary surroundings, ${p.she} harbors a deep desire for adventure and danger.`,
        `${p.Sdesc} feels a restlessness that can only be quenched by the thrill of adventure and risk.`,
        `${p.Sdesc} is always seeking the next adrenaline rush, willing to risk life and limb for the thrill of adventure.`,
        `Bored with the monotony of wealth, ${p.sdesc} yearns for a life filled with excitement and peril. ${p.She} believes that the thrill of adventure will give ${p.his} life purpose.`,
        `Despite ${p.his} privileged upbringing, ${p.sdesc} finds no satisfaction in a life of luxury and ease. ${p.She} dreams of stepping out of ${p.his} comfort zone and plunging into the world of danger and adventure.`,
        `For ${p.sdesc}, the adrenaline rush of being in danger is what makes life worth living. ${p.She} is constantly putting ${p.him}self in harm's way to feel that thrill.`,
        `${p.Sdesc} believes that a life without risk is a life not worth living. ${p.She} seeks out dangerous adventures to escape the dullness of ${p.his} everyday life.`,
        `Born into wealth, ${p.sdesc} is bored with ${p.his} luxurious life and craves excitement. ${p.She} constantly finds ${p.him}self drawn to dangerous situations, seeing them as the ultimate thrill.`,
        `${p.Sdesc} is a thrill-seeker who craves danger and excitement. Despite the risks, ${p.she} believes that the thrill of adventure is the ultimate freedom.`,
        `No matter how dangerous the adventure, ${p.sdesc} is always ready to take the risk. ${p.She} believes that the thrill of living on the edge is worth any potential danger.`
      ]);
    case WFOOD:
      return randomArray([
        `${p.Sdesc} is always on the hunt for the next great meal, willing to go anywhere and do anything for it.`,
        `${p.She} has a deep craving for exotic foods and will go to great lengths to satisfy it.`,
        `${p.Sdesc} attends every event and gathering not for the company, but for the free food.`,
        `${p.Sdesc} dreams of tasting every cuisine in the world, and doesn't mind being seen as a freeloader.`,
      ]);
    case WLAZY:
      return randomArray([
        `${p.Sdesc} purposely avoids hard work, afraid of the disappointment that may come with failure.`,
        `${p.She} adopts a lazy attitude, choosing to stay within ${p.his} comfort zone rather than risk failure.`,
        `${p.Sdesc} prefers to laze around and do nothing, as it is easier than facing the potential pain of failing.`,
        `Despite ${p.his} talents, ${p.she} often succumbs to laziness, in order to avoid the potential hurt of not succeeding.`,
      ]);
    case WAVOIDSPOTLIGHT:
      return randomArray([
        `${p.Sdesc} constantly shies away from the limelight, wishing to avoid the high expectations it brings.`,
        `${p.She} prefers a quiet, unassuming life, avoiding the spotlight and the pressures that come with it.`,
        `${p.Sdesc} consciously avoids recognition and fame, uncomfortable with the high expectations and scrutiny they bring.`,
        `${p.Sdesc} would rather blend in with the crowd than stand out, as it helps ${p.him} avoid unwanted attention and high expectations.`,
      ]);
    case WDEBT:
      return randomArray([
        `${p.Sdesc} is burdened by a large debt, and is desperate to find a way to pay it off.`,
        `${p.Sdesc} is constantly haunted by the shadow of debt, and would do anything to be free of it.`,
        `${p.She} struggles with the weight of a debt that ${p.she} owes, seeking any opportunity to repay it.`,
        `${p.Sdesc} lives under the cloud of an unpaid debt, constantly looking for ways to settle it.`,
      ]);
    case WBECOMEBEAUTIFUL:
      return randomArray([
        `${p.Sdesc} is seeking new ways to enhance ${p.his} beauty, constantly experimenting with different diets, exercises, and beauty routines.`,
        `${p.Sdesc} feels that ${p.his} current physical appearance doesn't match the beauty ${p.she} sees within ${p.himself}. ${p.She} is determined to change that.`,
        `${p.Sdesc} is obsessed with the idea of physical perfection and goes to extreme lengths to achieve and maintain it.`,
        `${p.Sdesc} believes that beauty brings respect and love, and ${p.she} is ready to do anything to achieve it.`
      ]);
    case WBESPECIAL:
      return randomArray([
        `${p.Sdesc} feels a deep desire to be unique, to stand out from the crowd in some significant way.`,
        `${p.Sdesc} craves a purpose, a reason for being that sets ${p.him} apart from everyone else.`,
        `${p.Sdesc} doesn't want to be just another face in the crowd. ${p.She} wants to be special, to be noticed, to be remembered.`,
        `${p.Sdesc} fears being ordinary more than anything else. ${p.She} is always seeking ways to be different and unique.`
      ]);
    case WNOSUFFERING:
      return randomArray([
        `${p.Sdesc} is determined to ensure that no one else has to endure the suffering that ${p.she} has faced in ${p.his} life.`,
        `${p.Sdesc} is driven by a deep-seated desire to eliminate suffering, to create a world where pain and hardship are a thing of the past.`,
        `${p.Sdesc} has seen the harsh realities of life and is committed to making sure others don't have to experience them.`,
        `${p.Sdesc} has a heart full of empathy and cannot bear the thought of others suffering. ${p.She} works tirelessly to alleviate pain and hardship.`
      ]);
    case WPROVEWRONG:
      return randomArray([
        `${p.Sdesc} is driven by the need to prove ${p.his} doubters wrong. ${p.She} will stop at nothing to show them ${p.his} true potential.`,
        `${p.Sdesc} has been told ${p.she} couldn't succeed, but ${p.she} is determined to prove them wrong.`,
        `${p.Sdesc} was laughed at and dismissed. Now, ${p.she} is motivated by a burning desire to prove them all wrong.`,
        `${p.Sdesc} is fueled by the insults and skepticism of others. ${p.She} is determined to achieve greatness just to prove them wrong.`
      ]);
    case WUNSTOPPABLERAGE:
      return randomArray([
        `${p.Sdesc} is driven by a deep-seated anger that seems to have no end. ${p.His} rage fuels ${p.his} actions and decisions.`,
        `${p.Sdesc}'s fury is like a wildfire, consuming everything in its path. ${p.She} cannot, and will not, be stopped.`,
        `${p.Sdesc} is consumed by an unstoppable rage. ${p.His} wrath is a force to be reckoned with.`,
        `${p.Sdesc}'s rage is like a storm, unyielding and relentless. It propels ${p.him} forward in ${p.his} pursuits.`
      ]);
    case WAMBITION:
      return randomArray([
        `${p.Sdesc} has always dreamed of achieving something significant in ${p.his} field, but this dream seems forever out of reach.`,
        `${p.Sdesc} holds an ambitious goal, often spending nights without sleep in pursuit of ${p.his} vision.`,
        `No matter how many times ${p.she} fails, ${p.she} continues to chase ${p.his} ambitious dream, fueled by an unyielding spirit.`,
        `${p.Sdesc} is on a quest to reach the top of ${p.his} profession, a journey fraught with trials and tribulations.`,
        `${p.She} has a burning desire to fulfill a personal ambition, an ambition so grand that it's daunting even to ${p.him}.`,
      ]);
    case WBEHAPPY:
      return randomArray([
        `${p.Sdesc} is seeking genuine happiness, but it always seems just out of ${p.his} reach.`,
        `Despite the hardships ${p.she} faces, ${p.she} never stops yearning for happiness.`,
        `In the whirlwind of life, all ${p.she} wants is to find a moment of true happiness.`,
        `${p.Sdesc} keeps wandering aimlessly in the quest for happiness, wondering when it will finally be ${p.his}.`,
        `The smile on ${p.his} face often hides the yearning for true happiness in ${p.his} heart.`,
      ]);
    case WSPREADHAPPY:
      return randomArray([
        `${p.Sdesc} firmly believes in spreading happiness around, despite the darkness ${p.she} often faces.`,
        `${p.Sdesc} seeks to share ${p.his} joy with others, believing that happiness is multiplied when shared.`,
        `For ${p.him}, life is about spreading happiness and joy, even when the world seems bleak.`,
        `${p.She} has dedicated ${p.his} life to bringing smiles to people's faces, believing that true happiness lies in making others happy.`,
        `${p.Sdesc} lives to spread happiness, constantly working to bring a spark of joy into the lives of those around ${p.him}.`,
      ]);
    case WHOMELAND:
      return randomArray([
        `${p.Sdesc} yearns to protect ${p.his} homeland, ready to face any hardship that comes ${p.his} way.`,
        `${p.Sdesc} is willing to sacrifice anything for the sake of ${p.his} homeland.`,
        `Even though ${p.she} lives far away, ${p.she} still dreams of the days when ${p.she} can return and fight for ${p.his} homeland.`,
        `${p.Sdesc} can't shake off the memory of ${p.his} homeland, and ${p.she} wishes to return and make it a better place.`,
        `${p.She} cherishes ${p.his} homeland more than anything, and will do anything to defend it from harm.`,
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
    BWANT, [WMONEYPOWER], [], [], [TBADMEANS], []));
  want.push(new Aspect("Parental approval", 6, "",
    BWANT, [WPARENTAL], [TFACE], [], [], []));
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
  // want.push(new Aspect("Get the job done and rest at home", 1, "",
  //   BWANT, [WGETJOBDONE], [], [], [], []));
  // want.push(new Aspect("Return to their original home", 1, "",
  //   BWANT, [WRETURNHOME], [], [], [], []));
  // want.push(new Aspect("Uphold family honor", 1, "",
  //   BWANT, [WUPHOLDHONOR], [], [], [], []));
  // want.push(new Aspect("Great people must have lots of enemies", 1, "",
  //   BWANT, [WENEMIES], [], [], [], []));
  // want.push(new Aspect("Fill out a collection", 1, "",
  //   BWANT, [WCOLLECTION], [], [], [], []));
  // want.push(new Aspect("Small thing", 1, "",
  //   BWANT, [WSMALLTHING], [], [], [], []));
  // want.push(new Aspect("Freedom from some bondage", 1, "",
  //   BWANT, [WFREEFROMBONDAGE], [], [], [], []));
  // want.push(new Aspect("Saved life", 1, "",
  //   BWANT, [WSAVEDLIFE], [], [], [], []));
  // want.push(new Aspect("Chosen one", 1, "",
  //   BWANT, [WCHOSENONE], [], [], [], []));
  // want.push(new Aspect("Deeply envy someone", 1, "",
  //   BWANT, [WENVY], [], [], [], []));
  // want.push(new Aspect("Find a lost or kidnapped loved one", 1, "",
  //   BWANT, [WLOSTLOVE], [], [], [], []));
  // want.push(new Aspect("Specific form of wealth", 1, "",
  //   BWANT, [WSPECIFICWEALTH], [], [], [], []));
  // want.push(new Aspect("Specific job", 1, "",
  //   BWANT, [WSPECIFICJOB], [], [], [], []));
  // want.push(new Aspect("Heroism is more practical", 1, "",
  //   BWANT, [WFAKEHEROISM], [THEEL], [], [], []));
  // want.push(new Aspect("Motivated by fear", 1, "",
  //   BWANT, [WFEAR], [], [], [], []));
  // want.push(new Aspect("Bully others out of fear of being bullied", 1, "",
  //   BWANT, [WBULLY], [THEEL], [], [], []));
  // want.push(new Aspect("Only perform villainous acts because otherwise they die", 1, "",
  //   BWANT, [WFORCEDVILLAIN], [THEEL], [], [], []));
  // want.push(new Aspect("Disabled", 1, "",
  //   BWANT, [WDISABLED], [], [], [], []));
  // want.push(new Aspect("Be human", 1, "",
  //   BWANT, [WBEHUMAN], [], [], [], []));
  // want.push(new Aspect("Resurrect another dead character", 1, "",
  //   BWANT, [WRESURRECT], [], [], [], []));
  // want.push(new Aspect("Really want someone", 1, "",
  //   BWANT, [WLUST], [], [], [], []));
  // want.push(new Aspect("See someone else's successes ruined", 1, "",
  //   BWANT, [WSEERUINED], [], [], [], []));
}