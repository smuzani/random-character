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

// new model, create descriptions based on the trope
const TMOM = "teammom"

// note that this has already been generated
const PORTRAYAL = "portrayal"
const BACKGROUND = "background"
const STRENGTHS = "strengths"
const LIKES = "likes"
const WEALTH = "wealth"
const APPEARANCE = "appearance"

const TFACE = 'face';
const THEEL = 'heel';
const TSUPPORT = 'support';

const TMALE = 'male';
const TFEMALE = 'female';

// first person:
// function tagToPortrayal(tag) {
//   switch (tag) {
//     case TENERGETIC:
//       return randomArray([`I wake up and instantly want to go for a run. I get dressed in my running clothes and go outside. It's cold out, but I'm feeling so good that I just keep going. I finish the whole run and feel so energized, it's the best feeling ever. I think I'll do another one!`,
//         `I woke up today feeling like a million bucks! I can't wait to get out of bed and start my day. I'm going to do some push-ups before breakfast. When I'm done, I'll head out to the grocery store and pick up some healthy food for the week. After that, I plan on getting a haircut and playing some volleyball with my coworkers. Then, I'll have a yummy lunch and take care of some work before heading home to spend the evening with my family.`,
//         `I wake up every morning and I am on a mission. My first thought is to find out what it is I am going to be doing today. What is the task that will take up my time? That will occupy my thoughts, and use me as an instrument? That might sound like a weird way to start a day, but it's how I know my place in this world. When I know where I'm going, when I have something to lose myself in, then I feel like I'm alive. I love the feeling of conquering something new. Every day is a challenge that needs to be met. Every day is a chance to make things better.`,
//         `I can't believe it's been 3 months since I started this job. Sure, it's not the most exciting work in the world, but I really love my coworkers, and they're so different from anyone I've ever met before. I feel like I can be my true self here and that's something that I think is rare. This place is open to new ideas and even if they're not always implemented, they hear me out. I'm also working on a project right now that could really affect how we do things around here, as long as it all goes through. But it's amazing to know that I have a say in how it models itself.`]);
//     case TLETHARGIC:
//       return randomArray([`I can't find the energy to do anything. I'm always tired, and all I want to do is sleep. I can't find the motivation to get up in the morning. Sometimes I'll lay in bed for hours before deciding to drag myself out of bed. It's like I'm a zombie. All I do is lay around.`,
//         `I'm tired. I'm always tired. Sometimes I feel like a zombie, just stumbling through the motions of life. I would love to get up in the morning and do something worthwhile, but I can't muster the energy to do anything. When I think about how much life I've wasted, I can't help but feel guilty. I know that I should be doing more with my life, but it's so hard to get up and do anything. Sometimes it feels as though there's an invisible force pushing me down into my bed, making me lie there for hours on end. If only I could find a way to break free from this feeling of lifelessness, then maybe I could have some semblance of fulfilling a meaningful life. Maybe I could even be happy.`]);
//     case TTALKATIVE:
//       return randomArray([`I have a tendency to ramble and talk about anything and everything. Sometimes I even talk to myself, which can be embarrassing when I have to get up in front of a group of people. Some people find me interesting, but most find me annoying.`,
//         `I never shut up. If I get on your nerves, it is only because I am excited about the topics we're discussing. You may not want to talk to me, but you know you can't get me to stop!`,
//         `I'm sorry, I can't seem to stop talking. It's just that I have a lot on my mind and I like to talk about it. You see, I've been thinking about what I would do if the world were ending. What would you do if you knew the world was ending in just a few hours?`,
//         `I'm sorry, I just can't stop talking. It's like once I start something, I have to finish it. I know that the things that I say are not always worth listening to, but the thoughts just keep coming and I can't get out of them.`]);
//     case TINTROVERT:
//       return randomArray([`I never know what to do when people talk to me. I try to act interested and engaged, but I end up sounding like an idiot. I can't seem to think of anything to say. I know that it's my responsibility to keep the conversation going, but I just don't have the brain power. I'm sure they're thinking, "What is this guy thinking? He just sits there with a blank look on his face." People don't need to know that I'm so self-conscious that I'm trying to hide it. I don't want them to think that I'm some arrogant jerk who's too full of himself to care about what they're saying.`,
//         `I don't know why people think I'm shy. I just want to do my own thing and not have to deal with confrontation.`,
//         `I like to be alone and I need time to recharge. I can't handle too much interaction with people at a time because I'll get overloaded and start feeling drained. When I'm in a conversation, I spend time thinking about what I'm going to say before I say it.`]);
//     case TMEAN:
//       return randomArray([`I am a jerk, and I don't apologize for that. I am here to tell you that I will be rude to you and put you down, all the while making you feel like it's your fault. I will laugh at your pain and I will make you feel ashamed for being so sensitive. I will belittle you from every angle, word, and gesture. I will refuse to acknowledge any of your accomplishments or the things that make you special, because they don't matter to me. You are nothing but a walking pile of garbage that is too stupid to see how much better than you I am.`,
//         `I'm a jerk, and I know it. I love to see people suffer. It's what gives me pleasure. I like to take people down a notch--or two--but it's all in good fun, right? Sure, I can make you feel like the most important person in the world, but only if you agree with my opinion.`,
//         `I'm not nice. I will laugh at you while you're drowning in your own tears. I will tell you how ugly you are and that no one wants to be your friend. You will never get what you want out of life because I am holding onto it. I never let anyone have anything, because I want it all.`,
//         `I don't go around saying mean things to people. It's just that when I get mad, I feel like I can't control my mouth. And when someone pushes me, I push back. But it's usually for a reason. I know what you're thinking, though: I just do it for attention. Well, in the past that may have been true, but now, I just can't help it.`,
//         `I'm an asshole, deal with it. I'm usually all over people, and they don't like it. But I don't really care. I just like to have fun, and I like to have everything my way. And if you're not going to take the time to understand me, then I'm just going to leave you behind.`]);
//     case TSWEET:
//       return randomArray([`I am usually very cheerful and always like to do nice things for people. I think it is so important to have a good attitude and try to work hard. Life is too short not to have fun!`,
//         `I love being around people and making them laugh. They say I’m a ray of sunshine on a cloudy day. That my smile can make anyone happy. I like to be the one who helps people in need. I like taking care of others, and I like to take care of myself too. I know how to be sweet and not to let the bad things get me down.`,
//         `I am kind to everyone and always willing to help. I like to bring people together in conversation, despite their differences. I try to be as tolerant as possible and never judge or make fun of anyone.`]);
//     case TNURTURER:
//       return randomArray([`I find that my favorite part of mentoring is hearing about other people's lives and how they are changing. Especially when we reflect on their successes. The best part is when I see them develop a new idea or skill, and they come to me for advice with their new found knowledge.`,
//         `I am there for them every time they need me. Sometimes they might be feeling down, so I tell them a story of when life used to be hard for me. They might be discouraged about their circumstance, so I remind them that they are not alone. They might be frustrated with their progress, so I let them know that it's ok to take some time off from their goal. Whatever it is, I do everything in my power to be there for them.`,
//         `I am the one who wipes their tears when they are sad, and I am the one who is there to listen. When they are scared, I make sure to stay close so that they can hold my hand. I am a shoulder to cry on and an ear to hear.`]);
//     case TCARING:
//       return randomArray([`I always try to be there for my friends when they need me. I do my best to make sure that everyone is taken care of and happy. That's what I'm here for.`,
//         `I always feel sorry for the homeless people. They have to go through all sorts of difficult circumstances. Not only do they have to sleep in a bed of dirt, but they also have to eat food that is barely edible. I try not to judge them when I see them standing on the street corner with their cups out, but it's hard not to be judgmental sometimes. Sometimes I'll stop and give some spare change or a sandwich that someone brought into work yesterday.`,
//         `I always help people out when they are in need. I even spend my money on other people's needs before my own. One time, I gave away all of the food in my house to a homeless family because their children were starving to death and begging for food. It was hard to watch but it was the right thing to do.`,
//         ` I care about people all the time, it's who I am. But sometimes I feel that people don't want to be cared for and they are looking for somebody to pour their cares and worries out to. It's like they see me as their therapist or something, but I'm not that kind of person.`]);
//     case TRUTHLESS:
//       return randomArray([`I walk with my head held high, the sound of my heels clicking on the pavement filling my ears. I love knowing that I am better than the people around me, that I am invincible. It's always been this way, and it will always be this way. But if I'm not, then I'll just get up again. And again. And again.`,
//         `I remember that time when I was a kid, and my father would tell me stories about how people were killed. I remember being fascinated by it. I loved hearing about these creative ways to murder people. The first time I killed someone with my bare hands, it was an exhilarating feeling.`,
//         `I am a relentless, unstoppable force. I understand the power of my will and the strength that it has. I will not stop until I have achieved my goal. I have a goal in mind, and it is all I care about. It is all that matters to me. No one can stop me from fulfilling this ambition. They can try if they want, but I won't be swayed by their efforts.`,
//         `I'm always looking for my next conquest--whether it's a business deal, a lover, or a meal. I don't have time to be kind or gentle because that would slow me down. I like to make decisions quickly and without regret.`,
//         `I have been called ruthless, unstoppable, and mostly, crazy. But I don't care what people say about me. I'm not here to make friends. That's not my job. My job is to save this city from evil.`,
//         `I am unstoppable. I have no weaknesses. I have no flaws. I always get what I want. It's the only way to live. I never sleep, so I don't need to lie in bed at night dreaming about how my day was screwed up because of a single human mistake. My life is perfect. I am perfect.`]);
//     case TLEADER:
//       return randomArray([`I am the leader. I am the best of them all. I can sense when there is a presence around me, even if they are not in my view. I always know who's here and how many there are. My senses are more developed than any other animal because I have to be aware of everything that is around me.`,
//         `I can see what others cannot. I know what's best for them even though they don't often want to listen to me. That's how it has been my whole life, and it will be that way until the day I die.`,
//         `I guess I would say that a responsible leader has the courage to do what they know is right, even if it's not popular. They strive to be their best, no matter the situation, and always keep their focus on what's important- in this case, being a good role model for others. A responsible leader is someone that doesn't let fear dictate their decisions or actions and who remains steadfast in their convictions.`,
//         `I never forget those who I lead and the responsibility I have to them. When we are all on the same page, we can build and grow together as a team. One day at a time, we will always have each other's backs.`,
//         `I always wanted to be a leader. It was my calling. I knew that my leadership abilities would help me in life and make me a more successful person. When I met other people, I saw that they were all trying to get ahead of each other, so I took charge.`]);
//     case TFOLLOWER:
//       return randomArray([`He had called me to follow him and so that is what I did. No matter how hard it was, no matter how hungry or tired I became, I still followed him. Whenever someone said "give up on this," those words would only make me want to follow him more; they made me want to prove them wrong and show them that loyalty was worth it in the end.`,
//         `It's only been a few months since I took the oath. I can't believe how quickly time flies, or how much I've changed in that time. The first few days were tough, of course. You're thrown into a new environment and expected to make friends and find your place all at once. It's intimidating. But it was so worth it. Now life is so much more than just getting by for me. This is my family and these are my people now. They come before everything else, even myself sometimes, which is hard to do because I'm so used to being independent and self-sufficient.`,
//         `I am loyal. I always have been
//         , and I always will be. People often say that they are loyal, but they lack the conviction to see through their own words. They say it because they want you to think they're a good person. They say it because they feel obligated to tell you so. They say it because they think that's what you want them to say. But if you really asked them, if you put them on the spot and made them answer in front of everyone, then you would see who really means it when they call themselves loyal. You would see who is truly committed to being someone who never wavers in commitment, and who can be counted on to stand by your side no matter what life throws at us.`,
//         `I am loyal, and I am proud of it. I will not abandon my friends or family for any reason, because they are the ones who have always stood by me when I was in need. The friendships that I have made through the years, some of which date back to my childhood, are precious to me. They make up a significant part of who I am today. And so, if someone does something bad to one of them, well then that person had better watch out!`]);
//     case TNAIVE:
//       return randomArray([`I can't believe I forgot to bring my lunch today. What was I thinking? It's been so long since we took a break, and I just let myself get distracted by work. Now I'm going to be hungry all day!`,
//         `I've never been the smartest person in the room. Everyone else here at school seems so sure of themselves, so ready to take on the world, but I can't say that's ever been me. Still, I keep trying -- it's what my mom always told me to do. And it helps that I have a lot of friends from other places who are willing to talk with me and give me their time.`,
//         `I don't understand how people could be mean to others. They are all so nice and helpful to me! I can't imagine why someone would want to be mean. When people are mean, it makes me sad and hurts my feelings.`,
//         `I’m so sorry about this. You know I would never do anything to hurt you! I just wanted you to have a flower for your front porch, and it was the only one in bloom. I didn’t mean to take it from the owner’s garden, but I saw you walking by and thought you might like it.`,
//         `I take everything literally. I'm not smart. But that doesn't mean I'm not happy! I love being with my friends, especially the fun ones who are always laughing and having a good time. My favorite thing to do is eating ice cream on hot days.`]);
//     case TFAKEDITZ:
//       return randomArray([`Most people think I am a useless fool, which is true, but not for the reason they believe. I play my part well and effectively. They all look down on me and pity me, yet do not see what is going on. It has been like this for so long now that I have become used to it.`,
//         `I have never been able to stand attention. I remember the first time I was given a prominent role, I made sure to be as clumsy and bumbling as possible without drawing too much ire. When my friends would say "look at me!" I would move out of their way so they could bask in their glory. Every time someone looked at me, I would pretend to be pointlessly fiddling with something.`,
//         `I’ve always been the stupider child. I was too slow to learn, too stupid to understand. My siblings would make fun of me and call me names, but I never cared because it was better than being called on for something that I’d likely fail. I liked being the youngest and the stupider one because that meant that my siblings and parents could be angry at me without having to worry about my feelings or opinions. As long as they didn't notice me, everything was okay.`,
//         `I pretend to be dumb because it's easier that way. If I say something wrong or don't know what someone is talking about, they'll get bored and there will be fewer questions. It's easier to change the subject than try to answer. I don't want people looking at me, so I pretend to be stupid. It always works out in the end.`,
//         `I can speak in a higher pitch, and make my voice sound softer. I take on a persona of someone who doesn't think anything through, who is oblivious to the world around them. I don't like talking about myself or what I'm thinking about but if people are interested in me then they will talk to me and then I'll tell them a little bit more.`]);
//     case TSMART:
//       return randomArray([`I'm constantly asking questions that other people think are obvious... but there are some things I just can't help but wonder about. I've always been this way, even when I was a kid. It's like there's always something going on in my brain that makes me want to ask another question. Like why is it that when you leave your house and turn left, it takes you to the grocery store? Why do we have seasons? Who invented clocks? What is space made of? How does weather work? Why do people look at the sky when they're sad? Some people find me annoying because they don't know how to answer my questions, but I know a lot of the time they're just embarrassed because they don't know. But it's not all bad. It's really cool when someone knows the answer and is willing to share that with me, or when I find out something on my own and can finally put my curiosity to rest.`,
//         `The work I do is less about math and more about numbers. I love to make connections and find patterns in data. My mind is always racing with theories, plans, possibilities for the data I am given. Sometimes I can't sleep because of all the possible conclusions I come up with. When all the information comes together, it's like a puzzle and my brain just has to put everything together in order to see the final picture. Another reason why some days are so hard is that sometimes people won't give me enough information at first or they won't answer my questions because they think it's too annoying. They don't understand how much my head hurts when I can only have half of the information needed to solve a problem.`,
//         `I have always been a person with a quick wit. I like to think of myself as the type of person who can handle anything, and I am always prepared for any occasion.`,
//         `I am a research junkie. I love to get lost in the depths of subjects that interest me and explore them with all my might. I have a great need to know every last detail about what I'm studying, and it often takes up all of my time and energy. `,
//         `I see things that other people do not. Everyday, I watch as the sheep come and go, living their lives, never knowing what is really going on around them. And everyday, I laugh in their faces because they are so easily fooled and manipulated into believing that they are in control of their own destiny when in reality they have no idea what is happening. They take themselves for granted and don't even realize how lucky they have it until it's too late. But you cannot blame them, not when they live a life where everything goes according to plan and nothing seems to be out of place or wrong.`,
//         `The world is a dark and confusing place, but there are those that know how to navigate it. There are those who understand the nuances of society far better than you do. They know what people think, they know what motivates them, and they know how to get exactly what they want from any situation. I am one of them.`]);
//     case TTACTICIAN:
//       return randomArray([`In the early morning hours, I find myself staring out the window and contemplating my next moves. I'm not going to get much sleep tonight, no matter how hard I try. I've been at this for years now, and never once have I made it through a night without planning. It's just who I am.`,
//         `I have been doing this for a long time, and I have seen how the profession has changed over time. The landscape is constantly shifting, and it's not easy to keep up. That being said, I love what I do and consider myself very lucky to be able to help people navigate the complex world.`,
//         `I am the pillar that holds up the establishment. The foundation of our society. I stand at the top, and I see all. I create my own reality and manipulate it to my advantage. I am in charge of what you think, live, see. I know that I am lying to you, but you won't know until it's too late.`]);
//     case TTACTICLESS:
//       return randomArray([`I don't like plans. They're always too rigid, too precise. They require so much thought and imagination, not to mention the time it takes to do them. Plans can never work out how I want them to, so why bother?`,
//         `I'm not a planner. I am spontaneous. I like to do things on the fly and see where they lead. Sometimes it leads me right into trouble, but at least I have a good story to tell about what happened!`]);
//     case THEART:
//       return randomArray([``,
//         ``,
//         ``,
//         ``]);
//     case TEVERYMAN:
//       return randomArray([`I think I'm really boring. It's not my fault, I was born this way. Even my parents are like, "We're so sorry we made you. You're just a waste of our time and money." Wow, thanks mom and dad. My friends are always telling me that I'm not fun to be around and that they would rather spend time with someone else. They don't understand how hard it is for me to be with them. Sometimes I have to act like I'm having a good time just so they won't get mad at me for being a bore. I can't help what I am!`,
//         `I'm really not that boring. I just can't think of anything to say right now. And I'm trying to think of something interesting to say because you're reading this and I don't want you to conclude that I'm boring. But the little things that happen in my day are all easy to talk about, they're not really interesting. Like last night I went to the store and saw a guy that I know there, but he didn't see me. It was a bit awkward because he was looking for someone and I almost said hi, but then he looked away so I didn't bother. Yeah, that's my life really.`,
//         `I spend my days sitting around picking at my cuticles and reading outdated magazines. I've never been to an adventure, or had a stimulating conversation with someone more than once. I sit and think and sometimes write in my diary about how much I love the sound of crickets chirping.`,
//         `I wake up at 6:00 am every day, whether I want to or not. I have breakfast and go to work. I come home from work and do the same thing. I eat dinner and go to bed. Every day is the same. `]);
//     case THAM:
//       return randomArray([``,
//         ``,
//         ``,
//         ``,
//         ``,
//         ``]);
//     case TMODEST:
//       return randomArray([``,
//         ``]);
//     case TCLASSY:
//       return randomArray([``,
//         ``,
//         ``]);
//     //  No portrayal for strength, only power
//     // case TSTRONG:
//     // case TWEAK:
//     case TCHARISMATIC:
//       return randomArray([``,
//         ``,
//         ``,
//         ``]);
//     case TUNCHARISMATIC:
//       return randomArray([`I'm sorry if I've made you uncomfortable. I'm not sure what's so different about me that makes people want to avoid me. I have a feeling it might be my lack of inhibition. I say what I think, and sometimes that makes people uncomfortable. I like to make people laugh, and I'm usually successful at it. I'm not always funny, but when I am it is because I tell the truth.`,
//         `I'm not sure what I do that annoys people so much. I am polite, I smile at everyone, and I try to keep my mouth shut when it's not necessary. It's like they all want to see me fail and revel in my pain. The only time I get a break is when I'm sitting alone, which is starting to happen more often.`,
//         `I know I'm not easy to be around, but I don't really care if people like me or not. I think that's what irritates them the most. You see, when you're an introvert who enjoys their own company, people start to think you're a loner and a hermit. They think you're always angry about something and they don't want to be around you anymore. They think that you have no interest in being friends with them and you might even be homophobic because of how much time you spend alone.`,
//         `I am not a people person. I know that I am not the most charming of individuals, and sometimes my words come across as abrasive. It is not intentional, nor am I doing it on purpose. I find myself constantly apologizing for being so blunt, but I don't think it's something that will ever go away.`]);
//     case TPOWERFUL:
//       return randomArray([``,
//         ``,
//         ``]);
//     case TDREADED:
//       return randomArray([``,
//         ``,
//         ``]);
//     case TAGGRESSIVE:
//       return randomArray([`I love to fight. I love the adrenaline rush of combat, the power I feel when I touch my opponent and feel their life drain from them like water running through my fingers. I love feeling the strength of my body as it pushes against theirs, forcing them to yield. I love the exhilaration of conflict, and how it always leaves me feeling alive.`,
//         `I love combat. I love the feeling of exhilaration as I strike my foe, the thrill of victory as they fall at my feet. I love it when my foes fall as I strike them, and the sound of their armor clattering to the ground. I love fighting for the joy of fighting, for the love of battle and competition and victory. Most of all, I love the feeling of fear in my opponent's eyes as they realize that their fate is in my hands.`,
//         `I love the sound of swords clashing, and the battle cries. I'm not afraid to get dirty either. The blood on my hands is a symbol of all the work I've done, and it's satisfying to see that I've made a difference somewhere.`,
//         `I love the thrill of combat. It is a rush like no other, to feel the blood pumping through my veins as I stand on the precipice, waiting for my chance to strike. I can taste the adrenaline in the back of my mouth and feel it course through my limbs as I wait for that one perfect moment to end everything. There's nothing quite like it, nothing that feels so good and so right.`]);
//     // case TINNOCENT:
//     //   return randomArray([`${p.Sdesc} is adorably dorky.`, `${p.She} is socially inept, shy, and adorable.`,
//     //     `${p.She} is sweet and cutesy.`, `${p.She} is adorably naive.`]);
//     case TINDIVIDUALISTIC:
//       return randomArray([`I don't have time for anyone else's problems, and I spend my time taking care of myself. I'm not able to relate to others because I've spent my whole life catering to my own needs. When someone else needs help, my first response is to say no. If they need emotional support, I'll offer them a shoulder to cry on, but that's all I can give.`,
//         `I don't care about the feelings of others, and I only do things that will benefit me. I don't care if you're hurting, I just want to be happy. I don't care if you're crying, I just want to eat a sandwich in peace.`,
//         `I always put myself first, and that's the way I want it, because it's me! So when people are unhappy with me for doing what I want to do, I just tell them, "Hey, life is short!"`,
//         `I have never been a very good person to people, because I have always put myself first. It's not intentional, it's just the way I am. I'm not bragging about it or anything. It's just the truth. I know that I should be nicer to people and not so selfish, but that's just not who I am.`,
//         `I don't think of myself as a team player. It's not that I don't want to help others out, it's just that I don't get what they need from me. I'm not very good at working with people, and I'm not good at coming up with ways to make things better. But I always do my share of the work. The only thing I do is make sure that everyone else has had their share of the work.`]);
//     case TTEAMPLAYER:
//       return randomArray([`I understand that to be a team player, one must put the needs of the team before their own. While I can't always empathize with other people's feelings and emotions, I do my best to try and understand them and do what I can to make them feel better. If someone is feeling sad, I will offer them a hug or do something silly to cheer them up. Sometimes this doesn't work, but it's worth a shot, right?`,
//         `I've been on the team for a few years now. I'm not the best player, but I do my best and I don't complain. If you're down, I'll get you back up. When I'm injured, I know not to say anything and keep my head in the game. It's tough playing against the other team, but I know it's just competitive spirit. There are a lot of people who want to be on this team, so I always have to be grateful for what I have.`]);
//     case TBRAVE:
//       return randomArray([``,
//         ``,
//         ``]);
//     // case TBADASS:
//     //   return randomArray([``,
//     //     ``]);
//     case TBUTTMONKEY:
//       return randomArray([`I was always the butt of everyone's jokes. I had really bad hair and a really big nose, but I could still be happy and carefree when I wanted to find something to laugh about.`,
//         ``,
//         ``]);
//     case THUMBLE:
//       return randomArray([``,
//         ``]);
//     case TARROGANT:
//       return randomArray([``,
//         ``]);
//     case TWISE:
//       return randomArray([``,
//         ``,
//         ``]);
//     case TINSANE:
//       return randomArray([``,
//         ``,
//         ``]);
//     case TSANE:
//       return randomArray([``,
//         ``,
//         ``]);
//     case TACE:
//       return randomArray([`${p.Sdesc} is a benchmark for how good a person can get.`,
//         `${p.Sdesc} far outclasses the protagonist and their team.`]);
//     case TBITCH:
//       return randomArray([`Many people hate ${p.sdesc} and talk behind ${p.his} back, but most are cooperative in person.`,
//         `Everyone hates ${p.sdesc}.`]);
//     case TLOVABLE:
//       return randomArray([`${p.She} is fun to be around.`,
//         `The mood of the room lightens up when ${p.sdesc} is around.`,
//         `${p.She} is adorable.`,]);
//     case TLOAD:
//       return randomArray([`${p.Sdesc} is dead weight who makes things harder for everyone else`,
//         `${p.She} is a burden on the team, often resulting from ${p.his} own laziness.`]);
//     case TOBSTRUCTIVE:
//       return randomArray([`${p.Sdesc} uses ${p.his} position to make things difficult for others.`,
//         `${p.She} is being purposely obstructive.`]);
//     case TCONTRARIAN:
//       return randomArray([`${p.Sdesc} actively pokes holes in the plans of others, opposing them, and complain about everything they do.`,
//         `${p.She} can be an annoying advisor who offers excessive criticism and proposes nothing helpful.`]);
//     case TYESMAN:
//       return randomArray([`${p.Sdesc} is quick to agree to everything ${p.his} boss proposes.`,
//         `Whatever your religious or political opinion, ${p.sdesc} agrees with it.`]);
//     case TMYSTERIOUS:
//       return randomArray([`${p.His} identity is obscured.`,
//         `Little is publicly known about ${p.him}.`]);
//     case TIDEALISTIC:
//       return randomArray([`The world is a confusing place, full of people who are constantly fighting for what they feel is right. Sometimes it seems like there's no hope, but I know deep down that there is always a ray of sunshine peeking out through the clouds.`,
//         `${p.She} will repay cruelty with kindness, and anger with calm.`,
//         `${p.She} is relentlessly optimistic and cheerful.`]);
//     case TCYNICAL:
//       return randomArray([`${p.Sdesc} is cynical of others.`,
//         `${p.She} is distrustful of human sincerity.`]);
//     case TSTOIC:
//       return randomArray([`${p.Sdesc} shows no reaction to any provocation or humor.`,
//         `${p.She} shows no emotion.`]);
//     case THOTBLOODED:
//       return randomArray([`${p.She} is extremely passionate about everything ${p.she} does and gives it 110%.`,
//         `${p.She} never does anything half-hearted. Everything ${p.she} does is taken to the extreme.`]);
//     case TBERSERKBUTTON:
//       return randomArray([`Certain things trigger ${p.sdesc} into a berserk rage.`,
//         `${p.Sdesc} is insecure about a certain physical trait, and bringing it up will make ${p.him} furious.`]);
//     case TPOLITEANGER:
//       return randomArray([`When angry, ${p.she} will simply vent ${p.his} frustration in polite words.`,
//         `When angry, ${p.she} never shouts or slams ${p.his} fists down, but politely expresses ${p.his} rage.`]);
//     case TSNARKY:
//       return randomArray([`${p.Sdesc} is often snarky and bitter.`,
//         `Every response by ${p.sdesc} is snarky and sarcastic.`]);
//     case TOBVIOUS:
//       return randomArray([`${p.Sdesc} states the obvious. Sometimes for story exposition purposes.`,
//         `${p.Sdesc} will often say obvious things to make the plot clear.`]);
//     case TCOLD:
//       return randomArray([`${p.She} doesn't get along with people, and finds them annoying.`,
//         `${p.She} is distrustful and avoids being attached to others.`, `${p.She} is unfriendly and says little.`]);
//     case TWARM:
//       return randomArray([`${p.She} is kind-hearted and loving.`,
//         `${p.She} is cheerful and friendly.`]);
//     case TSTERN:
//       return randomArray([`${p.She} has an intimidating, stern tone.`,
//         `${p.Sdesc} is strict and gruff.`]);
//     case TEATER:
//       return randomArray([`${p.Sdesc} eats more than the rest of ${p.his} team combined.`,
//         `${p.Sdesc} will finish several plates per meal, chomping it all down quickly.`]);
//     case TNOTMYFAULT:
//       return randomArray([`${p.Sdesc} absolutely refuses to accept responsibility for ${p.his} mistakes.`,
//         `${p.She} will push the blame to others whenever ${p.she} makes a mistake.`]);
//     case TCLUMSY:
//       return randomArray([`${p.She} tends to trip, drop things, and frequently makes mistakes.`,
//         `${p.She} bumbles and fumbles at almost anything ${p.she} does.`]);
//     case TWALKINGTHEEARTH:
//       return randomArray([`${p.She} seems to be a traveller. Nobody knows ${p.him} and ${p.she} keeps no roots.`,
//         `${p.She} is always out seeking adventure, never staying rooted in any one place for long.`]);
//     case TDERE:
//       return randomArray([`${p.She} is secretly sweet, kind, and generous to people who are close to ${p.him}.`,
//         `${p.She} hides a softer, sweet side of ${p.herself}.`]);
//     case TFACE:
//     case THEEL:
//     case TSUPPORT:
//       return "";
//     default:
//       return "";
//   }
// }

// Third person:
function tagToPortrayal(tag) {
  switch (tag) {
    case TENERGETIC:
      return randomArray([`Lizbeth was always an energetic person. She never really knew her limits when it came to staying up late or doing something for the first time, and she didn't care much about the consequences either. She was always in the mood for something new, and she was determined to accomplish those goals no matter how long it might take. She could be found in any number of places, but her favourite was being out in the world. Lizbeth loved going on hikes, attending concerts and festivals, and exploring the unknown. She would be at home in a busy city, taking in all the sights and sounds as though they were fresh and new to her.`,
        `John is a man who always has a smile on his face. He's always in the middle of a new project, and he greets every day with enthusiasm for living life to the fullest. He can't sleep at night, but he'll try anything once, and he loves to laugh.`,
        `Jill is a bundle of energy. It seems like she's always on the go, and she can't sit still for more than five minutes without bouncing up to grab something out of the pantry to eat. She is an avid lover of yoga and can often be seen in her free time outside on the beach, practicing asanas and meditating on the sun's warmth.`,
        `He's always on the go, it seems. Constantly working and staying busy doing something. It would be exhausting if it didn't look like so much fun. He doesn't really sleep much; but he gets plenty of rest in other ways. He never seems to stop being happy, either. He is always smiling, never too tired for a laugh.`]);
    case TLETHARGIC:
      return randomArray([`She's not sure what her problem is, but lately she's just been feeling more and more exhausted. It's a struggle to get up in the mornings and even if she does make it out of bed, she feels like a zombie. She often feels like she has nothing left in her, and she just can't keep fighting against the exhaustion anymore. She needs to take a break from everything and take care of herself.`,
        `Jenny's eyelids droop; they are heavy from the lack of sleep. She sits at her desk, head slumped over, and she is trying to focus on reading through the endless paperwork. Jenny's boss is always breathing down her neck about deadlines, deadlines that she is never able to keep. Her stomach grumbles in protest as she thinks about lunch. Jenny doesn't have the energy to get up, or to find something to eat in the break room.`]);
    case TTALKATIVE:
      return randomArray([`John is the kind of person who never stops talking. He talks when someone else is talking, and he talks when no one else is - you can always hear his voice coming from across the room. He can't stop himself from speaking, and it has caused him to have few friends. John doesn't seem to care about this, though, because he's always so happy to talk to anyone.`,
        `It's a sunny day and we're walking down the sidewalk. Talkative person is talking nonstop about how she and her husband are going to go on a date to see the newest blockbuster movie, how they've been so busy lately, and how she can't wait for it to be Friday. She talks on the phone while walking down the street, without using a headphone, so that everyone around her can hear her conversation. As we get closer to the bus stop, she finally notices that we're nearing our destination, but instead of trying to wrap up the call in time, she just keeps talking.`,
        `Toiling around the kitchen, she chatters incessantly. She talks about her children, the gossip among the upper class, and the latest trends among the lower. This is how she has always been.`,
        `Lily is the type of person who cannot resist talking, and she's always going on about her life. When she speaks, she never seems to stop and will talk endlessly without pause. She is not a shy person and will go up to anyone and strike up a conversation or tell them what she's been up to. Her conversation topics range from what she ate for breakfast to her latest vacation in Puerto Rico.`]);
    case TINTROVERT:
      return randomArray([`It wasn't that he was in a bad mood today, it's just that he always had this aura of someone you don't want to cross. His eyes were always intense, and his jaw would be clenched, and his movements were sharp. He didn't like to talk to people, or really interact with them if he could help it. He would always be in his own world, thinking about a million things at once, and trying to figure out what to do next.`,
        `He likes to be by himself because it's easier for him to focus. He is good at reading people because he's always observing them. He has a lot of ideas but doesn't often talk about them, preferring instead to keep them in his head.`,
        `She likes to think of herself as an introvert in a world so focused on extroverts. She will do anything to avoid socializing, not because she's shy, but because she prefers being alone. Her room is her refuge, and she's never happier than when she has her nose in a book. When the phone rings, she freezes, hating the idea of talking to anyone, and if it's someone she doesn't know she just hangs up. But her friends don't mind too much - they're all introverts too.`]);
    case TMEAN:
      return randomArray([`She leaned in close to the mirror, staring at her own reflection. With a deep breath, she pulled out her eyeliner and began applying it. She didn't care about being pretty; she was pretty enough. She just wanted to be as good as she could be, because that's what made her happy. It made her feel powerful. Her lips twisted into a cruel smirk in the mirror as she continued applying the makeup. She loved watching people's reactions to her when they saw her for the first time. It was like she was finally getting the attention she deserved, and it felt so good.`,
        `Jackson is mean. He's not a very nice person at all. In fact, Jackson is downright rude. He's always snarking and making fun of people. His favorite pastime is being uncooperative with others. If he doesn't like someone, you can be sure that they are going to hear about it. The only time Jackson is nice is when he's really out of options.`,
        `She had a heart of stone, she thrived on the misery of others. From her vantage point at the top of the food chain, she was able to pick out which prey would be easy to tear down and consume. She delighted in tearing apart their emotions, and making them feel as if they were worthless. She was always quick to dish out insults and put-downs, because it made her feel powerful.`,
        `He liked to smash things now, because he felt so powerless in other aspects of his life. He always thought that if he just had some money, then everything would be better. His friends always talked about how they were going to get rich someday, but for him there was never a chance of that happening. Maybe he could find some someone to marry him for his money.`]);
    case TSWEET:
      return randomArray([`Sally has lived in the same town her whole life. She's a sweet girl, and she greets every person she sees on her morning walks with a kind word. She never forgets to pick up an apple for lunch, and she always shares with her friends when they're feeling down. Sally really is one of the best people you'll ever know.`,
        `She is a kind and sweet person, with a heart of gold. She is always there for her friends, and is always quick to help them out. Whenever she sees someone in need, she rushes to their side to offer assistance. When she falls in love, she loves with all her heart. She will do anything to make the person she loves happy.`,
        `Heather is a sweet person. She's always so kind and caring. She volunteers at the animal shelter every day to help take care of the animals, and she always asks how you're doing if you see her on the street. Her friends often find themselves in need of her shoulder to cry on when they are going through tough times. Heather understands that not everybody has an easy life, and she is there for her friends when they need her.`]);
    case TNURTURER:
      return randomArray([`She is the one who always has the best advice. You can always count on her to listen, and she always has a kind word of encouragement. She is never too busy to lend you an ear or make you feel better. She has a smile that could cheer anyone up, and she always knows what's best for you. When you're in need, she's the one you want to see. Even though she may not be able to do much, it's just nice to know someone cares.`,
        `Mia was always motherly towards her nieces and nephews. She would always try to protect them from harm, and she would always make sure they had their favorite foods when they came over. She would always play with them outside, and she would always offer to take care of them if their parents needed a break. It is no wonder she was the perfect babysitter for the family.`,
        `He's always willing to help people in need, and will never hear them say no. When he sees a child crying on the street, he'll come and ask if they are alright, or offer them a free lollipop. He's a gentle soul, and doesn't like to see bad things happen. He volunteers at a soup kitchen once a week, in order to provide for the hungry.`]);
    case TCARING:
      return randomArray([`She loves to be with her family when she can, but often she finds herself caring for her aging mother who is unable to do anything for herself. She takes care of her lovingly, making sure she eats and takes medication. Sometimes, in rare moments, the mother has a lucid moment and they talk about old times or just watch TV together.`,
        `Meredith had always been the person to take care of her friends. She made sure everyone got enough sleep, ate their vegetables, finished their homework, and went out for a jog every morning before school. She was the one who would make sure everyone was happy and healthy, as if it was her own responsibility.`,
        `Nina is a kindhearted person. Even when she's tired, she'll have a smile on her face for those around her. If someone needs help, she'll do everything in her power to help them out. She's also very environmentally conscious and does what she can to help save the planet. Whenever there's a joke going around, Nina will be the one laughing the loudest at it.`,
        `Nina is a kind soul. She always has a smile for people, even when she's tired or late. She is always willing to help out her friends and family in any way that they need it. She cares deeply about the environment and tries to be as environmentally friendly as possible. She is always laughing and joking.`]);
    case TRUTHLESS:
      return randomArray([`He never felt pain, because he could never feel. He was always in control, of his surroundings and of himself. He would use anyone for anything. His family was nothing to him; they were just there to make him look good to the public. All he cared about was money. He didn't care what people thought of him.`,
        `Samantha was ruthless. She would do anything to get what she wanted. No one could stop her. She would steal and abuse anyone just for a few minutes of distraction from the rest of the world.`,
        `James was ruthless. He didn't care about anyone but himself. He didn't have any emotions or feelings for anyone. When people wanted to sympathize with him, he would just brush them off and tell them they were stupid. He never felt any remorse for the things he did, even if it was hurting innocent people. He was cold and calculating, and he thought nothing of killing someone in cold blood. It would take a special type of person to get through to him, but no one was brave enough to try.`,
        `She was the most ruthless person I know. When she first started college, she quickly made a name for herself as one of the most ruthless people on campus. She would bully and torment anyone who crossed her path, and she made it her goal to make sure that nobody else felt comfortable or safe on campus. She had no regard for what she did, and no consideration for the consequences. Her favorite pastimes included starting fires, bullying the most vulnerable people on campus, and breaking into places without ever being caught.`,
        `Lydia was ruthless. She had a way of getting what she wanted, and she wasn't afraid to do anything to get it. She was cunning, sly, and calculating, with an air of mystery that made people want to know more about her. Her family often found themselves in danger because of her schemes, but they always loved her nonetheless, for the person she was.`]);
    case TLEADER:
      return randomArray([`She's a headstrong woman who knows her own mind. She has the self-confidence to go with it, and she is not afraid to speak out against those who she feels are wrong. True to her word, she does not allow fear to stop her from doing what she believes is right.`,
        `Nellie had always been the one in her family that was able to take charge. She made decisions, because she knew what needed to be done. She never asked for help with anything, and never listened to anyone's opinion but her own. She didn't see herself as a leader, but she knew when to step up and take control.`,
        `He was a man who emphasized the importance of hard work. He was the type of man who would get up at 5am and be at his desk by 6am, working tirelessly until it was time to leave at 8pm. His employees respected him for his dedication, and knew they would never have it as good as he did. He would often have employees work overtime without compensation. He said that everyone should just be happy with what they have, but privately he knew that he had a responsibility to his employees, and it was his responsibility to care for them.`,
        `Bret is a renowned leader in the industry. He has a knack for leading people and getting things done. Bret likes to be in control of his environment, and he is always the first one up to fix a problem. He is very well respected by those who work for him and he has many loyal followers. Bret is often seen as the most dependable person in the company and he will do anything that is necessary to ensure that his employees are happy.`,
        `Liam was a man with a vision. He had always been a captain of his school's football team, and he knew that he could use this same leadership to make an impact on the world. He spent hours studying people who had made it big before him, and he managed to come up with a strategy for success. `]);
    case TFOLLOWER:
      return randomArray([`Henry is the type of person who will do anything for his leader. He spends his days following the leader around, ready and willing to carry out any order he is given. He has been with the leader since day one, and has been there for him through thick and thin. If it weren't for him, the leader would have long ago fallen in battle or been killed by an assassin. Henry is loyal to a fault, even if that means his own life.`,
        `He has been following this man for as long as he can remember and never once questioned his authority. His loyalty is unquestionable, and he would gladly give his life for him. He had always felt that he was born with a specific purpose in life and now he knows what that is. This man is everything to him and he wouldn't change a thing about him, good or bad.`,
        `The dark-haired girl had always been loyal to her leader. She was one of the few people that disagreed with the way he ran the organization, but she never did anything about it. She would just stay in the background and silently agree with the people who opposed her boss. Sometimes she would go to him and try to talk him out of his ways, but he was always too stubborn for her words. This only made her more loyal to him.`,
        `He was always there for her, whether she needed him to be or not. He helped her with her homework when she was struggling and always gave her a ride to school when he was available. He felt bad for her when she got turned down by the boy she liked, but never judged her for making mistakes. Even though he could tell she didn't want to talk about it, he still listened and reassured her that he was there for her. He did everything he could to make things better for her without being pushy.`]);
    case TNAIVE:
    case TFAKEDITZ:
      return randomArray([`She's always getting lost in her own head, which is often only good for coming up with new ways to embarrass herself. She forgets the simplest things and has trouble paying attention to what others are telling her.`,
        `Betty is a dumb woman, always falling back into old habits that she knows are destructive. She's been fired from every job she's ever had due to her inability to follow directions and the constant distractions. She doesn't remember what she did this morning, what time it is now, or what day of the week it is.`,
        `Linne has very little knowledge of the world. She has trouble understanding complex words, which frustrates her to no end. She does not know what it means to be smart, but she knows that if you are not stupid then you must be smart. Linnie is also very careless and often makes decisions that leave her in deep trouble.`,
        `Her lack of ambition has led to an unfulfilled life with very few friends and little money. A night out with her girlfriends usually consists of drinking too much and smoking cigarettes in the parking lot before they go home alone.`,
        `He had never been the smartest person in the room. He has always been more of a follower than a leader; he prefers to coast by on his lack of understanding and intelligence. He doesn't care to learn about anything because he knows it will only be challenging him. His parents always told him that he wasn't dumb, but they were wrong.`]);
    case TSMART:
      return randomArray([`John is a very intelligent person. His mind is always buzzing with ideas and he cannot help but share them with the people around him. He is a welcome addition to any group because even if he doesn't have anything new to say, it's always entertaining listening to him talk about his thoughts. John has an amazing ability to see different sides of every argument and that makes him someone who can always find a way to look at things in a lighter way.`,
        `He was an intelligent person. He could easily see through the facade of any person and find out what they were really about. He could take the most complex situation and break it down to its simplest form. He was not just smart, but he also genuinely cared about them.`,
        `As an intellectual, she has a deep understanding of her own thoughts and feelings, and is not afraid to share them with the world. Her knowledge of literature, philosophy, science and history is matched only by her talent for writing. She is a master of language and communication in every form-whether it be verbal or written.`,
        `She's a smart girl. To be honest, she isn't intelligent in the way you might think of an academic genius. No, she's intelligent in a more practical sense. She has a natural way with words that can come across as intimidating to some people. This is because she's simply not afraid to speak her mind. She's confident, educated and knows how to take care of herself.`,
        `He was incredibly sharp-witted, able to respond to any question with an answer that left his classmates dumbfounded. This intelligence often made him seem arrogant and aloof, but in reality he just didn't bother to pay attention to the people around him.`]);
    case TTACTICIAN:
      return randomArray([`He's learned to think two steps ahead and can anticipate an opponent's next move. He sometimes spends hours planning for the best possible outcome, and then discards his game plan when he sees promising opportunities on the battlefield. The player is also very skilled at predicting an opponent's motivations and explaining their actions to others.`,
        `He always carries a notebook with him, and never goes anywhere without his pen and pencil. If he needs to get away from it all, he’ll just retreat into his own world and sketch out whatever pops into his head. It helps him think. For as long as he can remember, he has been helping people see the right way to go at every turn.`,
        `She thinks the best way to win a battle is to avoid it. She wants to find out what the enemy's weakness is and use that to her advantage. She can find out this information by interrogating prisoners of war, scouting, reconnaissance, and espionage. All she needs is information to give her an edge.`]);
    case TTACTICLESS:
      return randomArray([`Pierce was not a tactician. He had never been trained in the art of war, nor was he educated in military history or political affairs. He was an experienced soldier, but that wasn't enough to make up for his lack of knowledge. Pierce often found himself at a loss when others were discussing their thoughts on the current situation, even if they were two years old. It wasn't that he didn't want to learn, it was just that he hadn't had the time to do so.`,
        `Liam always liked to take risks, never caring about the consequences. He had an inability to think about what could happen after his next move. So, when he found himself in a dangerous situation, he would just charge ahead without thinking much about it.`]);
    case THEART:
      return randomArray([`Tina is the team's moral compass. She is the one who always remembers to send thank you cards and who never forgets to call home. Her teammates know that if they have a question about right or wrong, Tina will be able to help them out.`,
        `Nina is the moral compass, always thinking about the team and not herself. Her good nature often gets her on the receiving end of jokes and teasing from both her teammates and opponents, but she still remains steadfast in her beliefs. She strives to be a leader for her team, and she leads them in good times and bad. It does not matter if it is a battle in the arena or a dispute among friends, Nina is there to offer advice and a hand to hold.`,
        `Lindsay is one of the kindest members of the team. She would never turn down a request for help, and she is one of the most reliable teammates to have on an assignment. She always has a smile on her face and is always so quick with a hug. It was not easy for this former social worker to adjust to being on the dark side of life, but she stays strong, as she believes that all the good she does outweighs the bad.`,
        `He's always the first one to greet a new teammate, and he never takes his eyes off of them. His empathy for each individual is what keeps him going. He is the person that will protect everyone from the daily horrors and pain of being in this place. He can't be alone because he needs his team.`]);
    case TEVERYMAN:
      return randomArray([`Eve has never been one for success. She's always felt that hard work is tedious, and she would much rather sit around, read a book or cook. She doesn't really care about being rich or famous. All that matters to her is the people she loves and food. She spends most of her time with these people she loves. They are what make her life worth living.`,
        `John Smith is not ambitious. He has never been interested in climbing the corporate ladder or being the head of his own company, but he is happy with his life nonetheless. John is content with his work and does not need anything more.`,
        `She's never seen herself as a failure, simply too unambitious to make a lot out of what she had. She's content with her life where she has everything she needs and nothing more. She spends her time reading or cooking for her family, when not tending to her garden, which is the one place where she can be alone.`]);
    case THAM:
      return randomArray([`Eddie is a loud, boisterous person. He always has something to say about everything and he never shuts up. Even when he's in a bad mood, he still talks at length about things that bother him. He's not necessarily the most popular person in his group of friends because he can be kind of annoying, but he's well liked enough.`,
        `Tyson is a loud, boisterous person who always has something to say. He's always boisterously trying to tell people his opinions and when he doesn't get enough attention, he'll just yell them louder. He loves to be the center of attention and will stop at nothing to get what he wants. Everywhere he goes, he's always laughing too hard, talking too loudly, and otherwise being too much.`,
        `Sam is a boisterous man with a loud voice and an outgoing personality. He's always the life of the party, telling jokes that make people laugh and getting everyone involved. He's not shy about walking up to anyone and introducing himself, which is why he has so many friends. He's always doing something to get peoples' attention, whether it be sneaking up behind them to scare them or yelling their name from across the room.`,
        `Jenna is a self-assured, sometimes overbearing woman who always speaks with authority. Her voice is deep and commanding, booming across any room she enters. When she talks, you can't help but listen. Her voice is her most defining characteristic. Jenna is always up on the latest news and information, which she often shares with those around her in order to better educate them.`,
        `Every time Rick would come in to work, he'd turn on the radio and crank it up as loud as possible. His booming voice would practically shake the building and it would drive everyone else crazy. He loved the sound of the music spilling out from his mouth and into the ears of those around him. He felt like he had a captive audience, because they couldn't escape being exposed to his voice.`,
        `Karen always was the one who never lost her voice. She had a booming voice that could be heard from the other side of her office when she was on the phone, and when she walked into a room, she demanded attention. Her high-pitched laugh made it difficult to ignore her as well.`]);
    case TMODEST:
      return randomArray([`He was a modest man, always keeping his thoughts to himself and never raising his voice. He was calm, composed, and collected. He had many friends- all of whom he loved dearly and would do anything for. When he spoke, all ears were on him. His words were few and thoughtful, leaving others to fill in the gaps with their opinion. He never dwelled on the past or looked too far into the future. Doing so would cause too much worry.`,
        `Michael is a shy, polite, and respectful person. He always says please and thank you, never interrupts anyone's thoughts or conversations, and is always willing to help out with anything. Michael doesn't often speak up about things that are bothering him or things he wants to do, but when he does his opinion is almost always respected on the matter.`]);
    case TCLASSY:
      return randomArray([`She moves with a grace that seems otherworldly, as if she was the embodiment of some sort of goddess. A soft hum can be heard from her lips whenever she laughs, and her eyes gleam with light even when it's dark. There is a gentleness in her hands like a dove, and every time she touches someone they feel immediately loved and cherished. When she speaks, people are captivated by her words and want to listen for hours.`,
        `He's used to being treated like royalty. He lives a comfortable life where his every need is met, but he prefers to do things that make him feel like he's earned it. He has no desire to be a spoiled brat, so he spends his days doing manual labor around the house, and prefers not to spend his time sitting around doing nothing. He's always willing to lend a hand and answer any question if someone needs it.`,
        `Juliette was pretty, but she knew it. She always wore dresses that looked like they were on the cover of a magazine, her hair was always done, and she never left the house without mascara on. And when an attractive person walked by, she turned into a different person. The girl who enjoyed their company and laughed at everything they said. But to those who she deemed as beneath her, she was cold, distant, and unapproachable.`]);
    //  No portrayal for strength, only power
    // case TSTRONG:
    // case TWEAK:
    case TCHARISMATIC:
      return randomArray([`Lucas is the most charismatic person you will ever meet. His smile is infectious and his laugh is contagious. He can have anybody laughing within minutes of meeting them. Lucas is a born leader and he knows how to win people's trust quickly. He knows that people are drawn to him and he doesn't hesitate to use that power.`,
        `He was a charismatic person, with a natural ability to draw people to him. He always had a smile on his face and was eager to help people in need. If someone needed directions or a ride somewhere, he would always provide it willingly. He was the type of person that would spend hours in the kitchen baking batches of cookies for friends and neighbors.`,
        `She was the kind of person that people listened to. Her voice was commanding, yet at the same time she was able to change it to a soothing tone when needed. She knew how to captivate her audience and she knew how to make them listen.`,
        `Madeline was a charismatic woman. She had a deep voice that held authority and power, but she wasn't always loud. When she wanted her audience to pay attention, she could lower the volume and just let her words flow.`]);
    case TUNCHARISMATIC:
      return randomArray([`Taylor is an annoying person who doesn't have any friends because she's just too much to be around. She talks about herself constantly and isn't good at taking hints. She spends all of her free time gossiping and when she does spend time with people, she is usually making plans about what they will do the next time they hang out.`,
        `Karen was really annoying, she had really bad breath and talked really loud. People would always glare at her for being so annoying.`,
        `Lili is a woman in her mid-forties who is very much in love with herself. She has no interest in doing anything other than talking about her life, her looks, and how she's so much better than everyone else.`,
        `Maggie was the type of person who would cross the street to avoid talking to anyone. She never wanted to make friends, and in all honesty, she wasn't a very social person. She loved to show up at parties uninvited and then leave as soon as possible. She would never get close to anyone. Maggie was just a very difficult person to get along with.`]);
    case TPOWERFUL:
      return randomArray([`He commands respect, and demands it. When he walks into a room, he takes it over. If he is not careful, he will come off as arrogant and pretentious.`,
        `She never seemed to stop moving; even when she was sitting, she was still tapping her fingers on the desk or flipping through papers. She always had a smile on her face and a twinkle in her eye, no matter how tough the day had been. If anyone ever came to her with a problem, she was the first person they went to. They knew that she would be able to help them somehow, even if it was just listening.`,
        `He was not the type of man who could be intimidated. He was clever, tough, and strong and he knew it. He was a born leader and he knew that he was the best in his field. If anyone stood in his way, they would quickly find themselves on the ground. If anyone dared to challenge him, he would crush them beneath his feet.`]);
    case TDREADED:
      return randomArray([`Each time he came into the room, others felt uneasy.  He had a way of making everyone feel uncomfortable, and seemed to delight in watching their reaction.`,
        `And when he went to the market, all those who saw him quickly crossed the street. It was more than his clothes that made people afraid. There was something in his eyes that disturbed them.`,
        `He's changed over the years. He's different now. There's something in his eyes that wasn't there before. What it is, no one knows. But those who are unfortunate enough to cross his path know they're not going to be the same again.`]);
    case TAGGRESSIVE:
      return randomArray([`Marcus loved to fight. His favorite game was to seek out the most powerful being he could find and challenge them. He had no fear of death, only a joy for the challenge, and the thrill of victory. He would always say he would never have enough of fighting, and his friends agreed.`,
        `She loved sparring. The feeling of the fresh air on her skin, the power surging through her veins; she never wanted to stop. Every morning she was up before six, and every evening she would lay down at ten.`,
        `He revels in the adrenaline rush, the thrill of victory, and the sound of the crowds. Nothing feels better than the rush of blood before a fight. He loves it when he's in a battle and the stakes are high, and nothing can compare to that feeling.`]);
    // case TINNOCENT:
    //   return randomArray([`${p.Sdesc} is adorably dorky.`, `${p.She} is socially inept, shy, and adorable.`,
    //     `${p.She} is sweet and cutesy.`, `${p.She} is adorably naive.`]);
    case TINDIVIDUALISTIC:
      return randomArray([`Rosie is selfish. She only thinks about herself and does not care what others think. If she wants something, she will get it and she will get it now. She expects everyone to do whatever she wants them to do and if they refuse, she will make a scene about it. Rosie does not listen and always has the last word.`,
        `Lily loved herself more than anything in the world, but not in a conceited way. She was always kind to everyone around her, and never looked down on them, even when they didn't deserve it. She never let any negativity touch her, and she always managed to find something about a situation to be happy about. Lily felt as if people should stop looking at the bad in every situation, and instead find the good.`,
        `Hazel Dunn was a typical narcissistic person. She always made sure she was the center of attention, and that everyone knew how great she was. Hazel was the first person to volunteer for anything that would bring attention to her. She enjoyed being the centre of attention and loved being praised by others. Hazel never listened to others' opinions or ideas. She just wanted to be the one in charge.`,
        `She needs to know she is appreciated, and she needs to be rewarded for any work. She yearns for attention and appreciation from everyone all of the time. She will not take anything for granted or go unnoticed.`]);
    case TTEAMPLAYER:
      return randomArray([`Ella had been told many times by her older sister that she was the most unselfish person she knew. She would always do favors for others and never ask for anything in return. It was this characteristic that made her a great team player.`,
        `Andrew is a team player. He listens to his coworkers, and considers their suggestions before he makes a decision. He doesn't like confrontation so he often sits back and lets the more vocal people speak for him.`]);
    case TBRAVE:
      return randomArray([`She is aware of the risks and the dangers, but she is not afraid. She has seen people die, but she knows death is inevitable, whether it be today or tomorrow. She has lost many in battle, but she will continue to fight for her life and the lives of those she loves.`,
        `April was brave. She always took risks. Being a daredevil made her happy. She loved the adrenaline that coursed through her veins when she pushed herself to the brink of death. She loved to jump off bridges and swing from high places, and she never got tired of doing it. April would jump off small cliffs or swing from ropes to hang from buildings. No matter what she did, she always felt alive.`,
        `Heather has always been a brave, curious girl. Her motto in life is to "take risks and never be afraid." Heather feels that she would be missing out on life if she doesn't experience all the things that come her way.`]);
    // case TBADASS:
    //   return randomArray([``,
    //     ``]);
    case TBUTTMONKEY:
      return randomArray([`Linda always knew that she was the butt of the jokes. Even so, she never let it get to her. She walked with her head held high, and she would take anyone's insults with a smile. It didn't matter that they were only words. Linda knew that she was worth something.`,
        `He tried to be the life of the party and would always do something silly to draw attention but it never worked. The ladies laughed but the men just looked at him with pity. But he didn't care, he just wanted people to notice him.`,
        `To the outside world, he is a joke. He is often the brunt of a lot of jokes, and no one really takes him seriously. He never takes himself too seriously, because he knows that someone is always going to find him funny for some stupid reason. But deep down inside, he is a sensitive soul.`]);
    case THUMBLE:
      return randomArray([`She would answer questions patiently and speak slowly so that they could understand. When she spoke to children, her voice was soft and sweet, and she would tilt her head down in a way that showed her empathy and sympathy.`,
        `He rarely spoke, and when he did, it was with a measure of quiet dignity. He never fought for power; he simply did what needed to be done, without any show of ego.`]);
    case TARROGANT:
      return randomArray([`Her head was tilted back, her feet crossed at the ankles. She barely paid any attention to those around her. She had a confidence about her that most people would admire, but those who knew her best, saw it as arrogance. Her family would often try to tell her how she could be better, but she brushed them off.`,
        `She was one of those obnoxious people who thought that they were better than you. She liked to get into fights with people, she had a long list of enemies and never apologized for anything. If she said something, it was always the most important thing in the world. People were afraid to be around her, but she was still friends with all of them anyways.`]);
    case TWISE:
      return randomArray([`She had a sharp eye, and could see right through you. She read every line on your face, and could tell you were trying to lie. She knew how to make anything she said sound wise, even if she was faking it.`,
        `She is not afraid to share her knowledge with others, even if it makes them feel insecure. She knows the importance of education and how to appreciate the beauty in life.`,
        `Charley was a wise person. He knew that the best way to deal with a problem is to just be there for your friends. He frequently shared his wisdom with others, and they always seemed grateful. They would come to him when they were feeling low, and he would always be able to cheer them up.`]);
    case TINSANE:
      return randomArray([`He always thought that people were after him. He complained about noises he heard in his head, and he saw people who weren't there. Sometimes he would scream out obscenities for hours on end, and then stop in the middle of the sentence and pick up where he left off.`,
        `He talked to himself and the voices in his head. He had hallucinations of his family and friends. He believed that they were actually there. His mind has been wandering so much that he's been forgetting what day it is, what he did from one minute to the next. He's been hearing voices most of the time.`,
        `She watches the world from behind a curtain of fabric, and she is not sure what is real anymore. The visions take up her whole mind, and she can't remember anything else. They're a part of her now. She doesn't know what she'll see next.`]);
    case TSANE:
      return randomArray([`He was the one who most often maintained his cool head, despite the unending torrent of jokes and stupidity pouring from the mouths of the others. He was always there to offer practical advice when an impractical idea was proposed. The sanity of this individual may be due to their ability to see everyone as equals with differing abilities, or it could just be due to sheer luck.`,
        `Gertie sat in the back of the room, watching as the people around her laughed at the speaker. She felt like a pariah as she listened to them ridicule and poke fun at whatever the woman was saying. She wanted to tell them how wrong they were, but she knew that they would only ignore her or dismiss her completely. It didn't matter that she knew they were all wrong, because the thing about being sane is that you're always alone.`,
        `Only one person in the room wasn't drinking. He was sitting on the couch, watching the others have a good time. He didn't understand why they had to drink so much. It seemed like it was just an excuse to act silly and do things they never would otherwise.`]);
    case TACE:
      return randomArray([`People marveled at his unparalleled skills. He had started as a mere child and now, many years later, he was the best in the world.`,
        `He was good at what he did. He had a way of making people feel as though they were the most important person in the world when he talked to them. Even if it were a small thing, he would give them his complete and undivided attention until they left. And if someone came in with an idea, he would listen attentively and then make it happen. It didn't matter what it was that they asked him to do, he could always make it happen.`]);
    case TBITCH:
      return randomArray([`He is the kind of person that will do anything to get what he wants. He does not care about anyone but himself, which is why people hate him so much. He has been in plenty of fights and is always looking for a new competition - it does not matter who.`,
        `She always wants what she can't have, and she never lets anything go. She loves to see people suffer for her own amusement, and the only thing that can change her mood is seeing someone else in pain.`]);
    case TLOVABLE:
      return randomArray([`${p.She} is fun to be around.`,
        `The mood of the room lightens up when ${p.sdesc} is around.`,
        `${p.She} is adorable.`,]);
    case TLOAD:
      return randomArray([`${p.Sdesc} is dead weight who makes things harder for everyone else`,
        `${p.She} is a burden on the team, often resulting from ${p.his} own laziness.`]);
    case TOBSTRUCTIVE:
      return randomArray([`${p.Sdesc} uses ${p.his} position to make things difficult for others.`,
        `${p.She} is being purposely obstructive.`]);
    case TCONTRARIAN:
      return randomArray([`${p.Sdesc} actively pokes holes in the plans of others, opposing them, and complain about everything they do.`,
        `${p.She} can be an annoying advisor who offers excessive criticism and proposes nothing helpful.`]);
    case TYESMAN:
      return randomArray([`${p.Sdesc} is quick to agree to everything ${p.his} boss proposes.`,
        `Whatever your religious or political opinion, ${p.sdesc} agrees with it.`]);
    case TMYSTERIOUS:
      return randomArray([`${p.His} identity is obscured.`,
        `Little is publicly known about ${p.him}.`]);
    case TIDEALISTIC:
      return randomArray([`${p.Sdesc} repays cruelty with kindness.`,
        `${p.She} will repay cruelty with kindness, and anger with calm.`,
        `${p.She} is relentlessly optimistic and cheerful.`]);
    case TCYNICAL:
      return randomArray([`${p.Sdesc} is cynical of others.`,
        `${p.She} is distrustful of human sincerity.`]);
    case TSTOIC:
      return randomArray([`${p.Sdesc} shows no reaction to any provocation or humor.`,
        `${p.She} shows no emotion.`]);
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
      return randomArray([`${p.Sdesc} is often snarky and bitter.`,
        `Every response by ${p.sdesc} is snarky and sarcastic.`]);
    case TOBVIOUS:
      return randomArray([`${p.Sdesc} states the obvious. Sometimes for story exposition purposes.`,
        `${p.Sdesc} will often say obvious things to make the plot clear.`]);
    case TCOLD:
      return randomArray([`${p.She} doesn't get along with people, and finds them annoying.`,
        `${p.She} is distrustful and avoids being attached to others.`, `${p.She} is unfriendly and says little.`]);
    case TWARM:
      return randomArray([`${p.She} is kind-hearted and loving.`,
        `${p.She} is cheerful and friendly.`]);
    case TSTERN:
      return randomArray([`${p.She} has an intimidating, stern tone.`,
        `${p.Sdesc} is strict and gruff.`]);
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
    case TFACE:
    case THEEL:
    case TSUPPORT:
      return "";
    default:
      return "";
  }
}

// Consider replacing this with treasure table
// TDREADED: He steps from the shadows, a tall, dark figure. His eyes are deep and cold, like pools of black iced water. The tips of his fingers burn with a fire that matches the blaze in his eyes. He walks among them, all the while they shrink back in fear and disgust. A low growl escapes him as he grabs one of them by their throat, lifting them off the ground. They struggle against him, but he does not relent until they go limp- all the fight gone from their body. He tosses their lifeless form aside like trash before moving on to the next victim; he will not stop until every last one has felt his wrath.
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
      return randomArray([`${p.She} has disheveled long hair, wears frumpy dark clothing.`,
        `${p.She} appears sleep deprived, is pale, and looks unkempt.`]);
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
        `${p.She} is a master of ${p.his} field.`]);
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
  // BITCH: She had been nice, but something happened when she turned twelve. The boys at school started to pick on her, and it wasn't long until she had made it her mission to make sure that they would never mess with her again. She learned how to fight dirty, and before long the other kids were too scared to even look at her. She continued down this path until high school was over and she left for college, where she joined a gang of girls that knew how to fight just as well as she did. The gang would pick fights with girls who looked way too confident in their own skin, or guys who might have thought they were hot shit because they knew karate. They had their territory mapped out and no one could step across the boundaries without getting bopped in the head, or worse. The gang was always looking for new members and she met a girl named Laura at the grocery store that first time, who seemed to have had it pretty rough. The other girls were rightly suspicious of her but she was able to convince them that she was just as tough as they were. They brought her to their meeting spot and beat her up so badly that they could tell she wanted out, but when they let her go she came back with a bat and started swinging wildly until they had to jump on her and hold her down while one of the stronger girls took care of business. She is still with them now and everyone knows that if you mess with someone in their territory then you're going to get eaten alive.
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
      return randomArray([`${p.She} is the most powerful of his forces, and far more competent than ${p.his} next in command.`,
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
      return randomArray([`Little things make ${p.him} blow up with anger.`,
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
      return randomArray([`${p.Sdesc} is burdened by the weight of ${p.his} problems.`,
        `${p.She} has a sad story, that makes the audience feel sorry for ${p.him}.`]);
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
      return randomArray([`${p.She} owns all the most expensive tools of ${p.his} craft.`,
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
