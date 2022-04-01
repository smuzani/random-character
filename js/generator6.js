/**
 * @fileoverview V6 of the generator, first public release.
 * 
 * Deprecated for the new V6, only kept for historical purposes.
 */

const UNISEX = 0;
const MALE = 1;
const FEMALE = 2;

function Trope(id, name, weight, text, gender) {
  this.id = id;
  this.name = name;
  this.weight = weight;
  this.text = text;
  this.gender = gender;
}

$(document).ready(function(){
    var char = generate();

    $("button#generate").click(function(){
        generate();        
    });
});

function generate() {
    var merged = mergeArrays();
    var maj = merged[0];
    var min = merged[1];
    var cMajor = rollRole(maj);

    // var role = $('select#role option:selected').attr("id");
    cMinorArray = [];
    cMinorArray.push(rollRole(min));

    if (role != ROLE_SUPPORT) { // hacky way of only generating one paragraph for support
        cMinorArray.push(rollRole(min));

        // hacky way of removing duplicates
        while(cMinorArray[0] == cMinorArray[1]) {
            cMinorArray.pop();
            cMinorArray.push(rollRole(min));
        }
    }
    display(cMajor, cMinorArray);
}

function display(cMajor, cMinorArray){
    var textOutput = "";

    if (cMajor.text != undefined)
        textOutput = cMajor.text;
    else // if there's a mistake it's only a string
        textOutput = cMajor;

    if (cMinorArray.length > 0) {
        for (var i = 0; i < cMinorArray.length; i++) {
            textOutput += "<br><br>" + cMinorArray[i].text;
        }
    }

    $("#results").html(textOutput);
}

function rollRole(array) {
    var totalWeight = 0;
    for (var i = array.length - 1; i >= 0; i--) {
        totalWeight += array[i].weight;
    }

    var r = roll(1, totalWeight);
    var search = 1;
    for (var i = 0; i < array.length; i++) {
        var w = array[i].weight;
        if (r >= search && r < (search+w)){
            return array[i];
        }
        search += w;
    }

    return "Unable to generate.";
}


function roll(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

const ROLE_ANY = "role-any";
const ROLE_HERO = "role-hero";
const ROLE_VILLAIN = "role-villain";
const ROLE_SUPPORT = "role-support";
const GENDER_UNISEX = "gender-any";
const GENDER_MALE = "gender-male";
const GENDER_FEMALE = "gender-female";
var role = ROLE_ANY;

function mergeArrays(){
    init();
    role = $('select#role option:selected').attr("id");
    // var gender = $('select#gender option:selected').attr("id");
    role = forceRole(role);
    // console.log("Role: " + role)

    switch(role) {
        case ROLE_HERO:
            delete major.heel;
            delete minor.heel;
            delete major.support;
            break;
        case ROLE_VILLAIN:
            delete major.face;
            delete minor.face;
            delete major.support;
            break;
        case ROLE_SUPPORT:
            delete major.heel;
            delete major.face;
            delete minor.face;
            delete minor.heel;
            break;
        case ROLE_ANY:
        default:
            break;
    }

    var maj = [];
    for(let key in major){
      maj.push(...major[key]);
    }

    var min = [];
    for(let key in minor){
      min.push(...minor[key]);
    }
    // console.log(major)
    // console.log(minor)
    return [maj, min];
}

/* makes the role consistent, so that evil guys don't have good text with "ANY" */
function forceRole(role) {
    if (role == ROLE_ANY) {
        var r = roll(1, 3);
        switch (r){
            case 1:
                return ROLE_HERO;
            case 2:
                return ROLE_VILLAIN;
            case 3:
                return ROLE_SUPPORT;
        }
    } else {
        return role;
    }
}


var major = {};
function init() {
    major = {};
    major.face = [];
    major.heel = [];
    major.support = [];
    major.any = [];

    major.face.push(new Trope(0, "Team Mom", 5, "Character is supportive and nurturing. The team cares a lot about them, and will defend them violently if anything were to happen.", FEMALE));
    major.face.push(new Trope(1, "Broken Bird", 4, "The character was once deeply damaged by a tragedy. Perhaps they tried to be a hero and failed, or were abused. They try to cope by being as cynical, stoic, or badass as possible.", UNISEX));
    major.face.push(new Trope(2, "All Loving Hero", 4, "The character is extremely idealistic. They love everyone, even those who hate them. They will repay cruelty with kindness, and anger with calm.", UNISEX));
    major.face.push(new Trope(3, "The Captain", 3, "The character is a commanding officer of their team. They have people to report to, but are in full command of the team. They're often in charge of a vessel. Also keeps a journal, either for work or personal purposes.", UNISEX));
    major.face.push(new Trope(4, "A Father to His Men", 3, "A commander who cares deeply about their team. Unlike many other military leaders, they try to keep their team safe, and values every member of the team, from the front line soldiers to the janitors.", UNISEX));
    major.face.push(new Trope(5, "The Heart", 3, "The character is more introverted and pacifist than the rest of the team. They are caring, often helping to keep the team together.", UNISEX));
    major.face.push(new Trope(6, "Team Dad", 3, "The character is a little more mature than the rest of the team. They're a disciplinarian, but is noble and leads by example.", MALE));
    major.face.push(new Trope(38, "Guile Hero", 4, "Character is very intelligent and doesn't easily fall for tricks and traps set up by their rivals. They're charismatic in a gentlemanly way, to the point where their charisma is like a physical force. They have ambitious goals and often succeed in style.", UNISEX));
    major.heel.push(new Trope(7, "Corrupt Corporate Executive", 6, "Character is a senior manager/CEO who tries to make as much money and power as possible, not caring who gets hurt.", UNISEX));
    major.heel.push(new Trope(8, "Alpha Bitch", 6, "Character is the alpha bitch of a posse. May have a tough jerk boyfriend, who acts as her muscle. Manipulative. Hard to hurt because she's part of a rich family and a higher social status.", FEMALE));
    major.heel.push(new Trope(9, "Monster of the Week", 6, "Character is a one-shot villain. At the end of the story, the character will either be destroyed, or repent.", UNISEX));
    major.heel.push(new Trope(10, "The Man Behind the Man", 6, "The character is the real main villain. More powerful, well connected, and intelligent, they have bigger plans than the lesser villains he bosses around.", UNISEX));
    major.heel.push(new Trope(11, "Evil Overlord", 4, "Character is an evil overlord. They have an intimidating fortress, and a sizeable army, willing or unwilling. They have plans to take over the world. Can be a king, dictator, CEO. Often the most powerful of his forces, and far more competent than their next in command.", UNISEX));
    major.heel.push(new Trope(12, "The Starscream", 4, "The character resents being under their current boss. Ambitious and individualistic. Plans to overthrow the big guy everyone else fears and take his place. Often resents praising and agreeing to the boss. Sometimes opposes the boss's plans. But is highly competent enough for the boss to keep around despite the risk of betrayal.", UNISEX));
    major.heel.push(new Trope(13, "Evil Genius", 3, "Character is very intelligent, a genius with technical and engineering. But not very politically or financially savvy.", UNISEX));
    major.heel.push(new Trope(14, "Evil Genius", 1, "Character is a brillian military commander, but not very politically or financially savvy.", UNISEX));
    major.heel.push(new Trope(15, "Psycho For Hire", 3, "They absolutely love battle and violence. Has a signature weapon. Flashy, and likely to play sadistically with their enemies. Their main role is as a hired gun, where they can get paid to do what they love.", UNISEX));
    // Link to description
    major.heel.push(new Trope(16, "The Fake Cutie", 2, "Character is sweet and cute on the surface. But it's an act to hide their intelligence, true self, or jealousy towards another. Often manipulative and dangerous to those who know what they're really like.", UNISEX));
    major.heel.push(new Trope(17, "Dark Messiah", 1, "Character wants to save the world, and is willing to die to do so. But they use underhanded tactics and other acts of radical terrorism.", UNISEX));
    major.heel.push(new Trope(33, "The Dark Chick", 6, "Character is empathic, understanding emotions well. But they use that skill to manipulate others. They don't care for the well-being of others, and experts at sowing discord. They're often hard to get rid of because they integrate themselves into their social ladder so well. Her motivations are slightly different to that of the other characters.", FEMALE));
    major.heel.push(new Trope(37, "Magnificent Bastard", 8, "Character is very intelligent and doesn't easily fall for tricks and traps set up by their rivals. They're charismatic in a gentlemanly way, to the point where their charisma is like a physical force. They have ambitious goals and often succeed in style.", UNISEX));
    major.support.push(new Trope(18, "Butt Monkey", 19, "Character is the butt monkey of the team, the one everyone makes fun of and doesn't expect to save the day.", UNISEX));
    major.support.push(new Trope(19, "Cloudcuckoolander ", 17, "The character is off the rails crazy. Nobody takes them seriously. They either have mental issues or have seen too much. But sometimes they just might be right.", UNISEX));
    major.support.push(new Trope(20, "Mook", 11, "This is a lesser character who's probably going to die and be forgotten.", UNISEX));
    major.support.push(new Trope(21, "Red Shirt", 4, "This is a lesser character who's probably going to die and be forgotten.", UNISEX));
    major.support.push(new Trope(22, "Damsel in Distress", 7, "The character is trapped under their circumstances, kept prisoner, or lost. They await a rescuer, but may rescue themselves if lucky.", UNISEX));
    major.support.push(new Trope(23, "Distressed Dude", 3, "The character is trapped under their circumstances, kept prisoner, or lost. They await a rescuer, but may rescue themselves if lucky.", UNISEX));
    major.support.push(new Trope(24, "The Ace", 6, "Character is extremely good at what they do. They're usually a benchmark that there's always someone better. Might be a mentor, or just a rival that the hero has to overcome.", UNISEX));
    // Link to description
    major.support.push(new Trope(25, "The Chick", 6, "Character is supportive and nurturing to the team. They don't really seem to do much else, though.", FEMALE));
    major.support.push(new Trope(26, "Troll", 6, "Character is a bully who delights in the pain of others. They often bait people into fights and attacks.", UNISEX));
    major.support.push(new Trope(27, "Dirty Coward", 6, "Character is completely self-serving, dedicated to their own survival. They will abandon someone who just rescued them. They play any dirty trick they can, but complain when it's used against them. Not very competent either.", UNISEX));
    major.support.push(new Trope(28, "Elite Mook", 5, "Character is very skilled and intimidating, but will likely die and be forgotten.", UNISEX));
    major.support.push(new Trope(29, "The Load", 4, "Character is dead weight who makes things harder for everyone else. Often they play on the sympathy of others to help them.", UNISEX));
    major.support.push(new Trope(30, "Obstructive Bureaucrat", 2, "The character has a moderate amount of bureaucratic power and tries to make it difficult for others.", UNISEX));
    major.support.push(new Trope(31, "Mysterious Backer", 1, "The character is someone very powerful who backs the main heroes, for whatever purpose. They often provide support and protection against the main villain.", UNISEX));
    major.support.push(new Trope(32, "The Imp", 1, "Someone who can cause a lot of trouble, but is usually just too lazy or apathetic to do so. They often act as a companion or annoying advisor., UNISEX"));
    major.support.push(new Trope(34, "Commander Contrarian", 1, "The character actively pokes holes in the plans of other people, opposing them, and complain about everything they do.", UNISEX));
    major.any.push(new Trope(39, "Genki Girl", 8, "Extremely energetic character. Doesn't stop talking, to the point of being annoying.", FEMALE));
    major.any.push(new Trope(40, "Keet", 4, "Extremely energetic character. Doesn't stop talking, to the point of being annoying.", MALE));
    major.any.push(new Trope(41, "Only Sane Man", 12, "They are very rational, with a realistic assessment of the situation and their own strengths and weaknesses. The character might have a little contempt towards the crazy team they find themselves in.", UNISEX));
    major.any.push(new Trope(42, "Too Dumb To Live", 12, "Character is a complete idiot. Prone to getting into trouble because of this. They don't utilize safety precautions and often taunt dangerous animals and people.", UNISEX));
    major.any.push(new Trope(43, "Blood Knight", 12, "They absolutely love battle. They're quick to pick fights, often encouraging violent resolution over peaceful ones. Sometimes they even shiver with bloodlust.", UNISEX));
    major.any.push(new Trope(44, "Well Intentioned Extremist", 3, "The character is very dedicated to a noble cause. Only problem is that they're willing to do anything, to achieve it, including torture, murder, and child labor."));
    major.any.push(new Trope(45, "Well Intentioned Extremist", 3, "The character is very dedicated to a cause. Their reasoning is noble, but the goal isn't. For example, a man whose goal is to make the neighborhood safe, by putting them under the protection of a local gang.", UNISEX));
    major.any.push(new Trope(46, "Well Intentioned Extremist", 3, "The character is very dedicated to a noble cause. Only problem is that they don't pay attention to the consequences. For example, they may try to overthrow a cruel tyrant, without caring that it would just create a power vacuum for an even worse tyrant.", UNISEX));
    major.any.push(new Trope(47, "Well Intentioned Extremist", 1, "The character is very dedicated to a noble cause. Only problem is that they're straight up delusional and it's all a part of their imagination.", UNISEX));
    major.any.push(new Trope(48, "The Smart Guy", 2, "The character is gifted with technology and engineering. They're often the person on the team who builds and repairs devices.", UNISEX));
    major.any.push(new Trope(49, "The Smart Guy", 1, "The character actively experiments with new things. They are gifted in inventing new items that helps out their team.", UNISEX));
    major.any.push(new Trope(50, "The Smart Guy", 2, "The character is more aware of the world than others. They're often the ones who create the plans and direct the missions. They're the ones who spend their time analyzing the weaknesses of the enemy. They're the ones who can spot traps, when things are going suspicious, or expose parts of the plot that isn't obvious to their teammates.", UNISEX));
    major.any.push(new Trope(51, "The Smart Guy", 2, "The character is street smart. They know to outsmart and convince foes and enemies. They're also skilled in investigation, finding intel, convincing people to admit things they otherwise wouldn't.", UNISEX));
    major.any.push(new Trope(52, "The Smart Guy", 1, "The character is wise, more level-headed, able to think their way around problems too big to solve.", UNISEX));
    major.any.push(new Trope(53, "The Smart Guy", 1, "The character is a little geekier looking than most. People think they're the smart one, but they're really quite average.", UNISEX));
    // Link to description
    major.any.push(new Trope(54, "The Big Guy", 2, "The character is big, probably the largest in the team. They are rugged and gruff, with a few scars to show for the battles they've been in. They're loyal and one of the best fighters in the team, but not necessarily the best.", UNISEX));
    major.any.push(new Trope(55, "The Big Guy", 2, "The character is big, probably the largest in the team. They are often cuddly and lovable, but you don't want to push them too far. Often the most level-headed of the group, they're the one who splits up fights and keeps everyone together. But just because they're nice, it doesn't make them a pushover.", UNISEX));
    major.any.push(new Trope(56, "The Big Guy", 1, "The character is big, probably the largest in the team. They are loud and often fun to be around.", UNISEX));
    major.any.push(new Trope(57, "The Big Guy", 1, "The character is big, probably the largest in the team. They great fighters, but they're also one of the smartest people on the team.", UNISEX));
    major.any.push(new Trope(58, "The Big Guy", 2, "The character appears fairly unintimidating, whether they're just cute or small. But they're often the strongest member on their team.", UNISEX));
    major.any.push(new Trope(59, "The Big Guy", 1, "The character is big, probably the largest in the team. They are unimaginative bullies, not useful for anything else, but others keep them around because they're useful in a fight.", UNISEX));
    major.any.push(new Trope(60, "The Lancer", 8, "The character is often second best on their team. They're the jack of all trades, able to fill up any role that the others don't.", UNISEX));
    major.any.push(new Trope(61, "The Leader", 2, "The character is often the face of their team. They are quite good looking, charismatic, able to inspire and lead. They usually hold the team together.", UNISEX));
    major.any.push(new Trope(62, "The Leader", 1, "The character is often the face of their team. They have clear goals from the start, and rely on intelligence and tactics to save the day.", UNISEX));
    major.any.push(new Trope(63, "The Leader", 1, "The character is often the face of their team. They are mature, and level-headed, able to rally the team when things go bad.", UNISEX));
    major.any.push(new Trope(64, "The Leader", 1, "The character is often the face of their team. They are the most outspoken and outgoing member of the group. They're not any smarter or better, but often inspires the team with their bravery and persistence.", UNISEX));

    minor = {};
    minor.face = [];
    minor.heel = [];
    minor.any = [];

    minor.face.push(new Trope(1000, "Nice Guy", 18, "This character is genuinely nice, friendly and likeable. They don't get into relationship conflicts with other people and try to settle it nicely when they do.", UNISEX));
    minor.face.push(new Trope(1000, "Jerk With a Heart of Gold", 14, "This character is a cruel asshole on the outside. But underneath the surface, there are some redeeming qualities.", UNISEX));
    minor.face.push(new Trope(1000, "What the Hell Hero", 12, "The character is willing to do deeds that violate their moral values every now and then.", UNISEX));
    minor.face.push(new Trope(1000, "Beware the Nice Ones", 10, "They are normally pleasant people. But when pushed too hard, they tend to burst into anger.", UNISEX)); // double with nice guy
    minor.face.push(new Trope(1000, "Plucky Girl", 3, "This character is determined and optimistic. Often cheerful. You can beat them but not break them.", UNISEX));
    minor.heel.push(new Trope(1000, "Ax-Crazy", 19, "This character is an insane and sadistic person who enjoys murder and mutilation.", UNISEX));
    minor.heel.push(new Trope(1000, "Affably Evil", 9, "This character is evil but extremely polite and likeable. They may be benevolent bosses to their minions. They seem like any other normal person. They may even try to nicely convince their enemies not to oppose them. If turned down, they'll give clear reminders of their villainous nature.", UNISEX));
    minor.heel.push(new Trope(1000, "Knight Templar", 8, "This character is narcisisstic and always believes they are right. They are quick to judge others but refuse all judgement on themselves. They believe that fate handed them a means for inflicting punishment upon evil, and punish the weak.", UNISEX));
    minor.heel.push(new Trope(1000, "Smug Snake", 8, "This character is arrogant and cocky, to both enemies and allies.", UNISEX));
    minor.heel.push(new Trope(1000, "The Dreaded", 8, "This is character is dreaded by others. Their name is used as a boogeyman. They may have taken the trouble to develop this reputation, often attacking in stealthy, underhanded manners.", UNISEX));
    minor.heel.push(new Trope(1000, "For The Evulz", 8, "Character is evil for its own purpose. There is no deeper meaning and they can't be reasoned with. Perhaps they are trolls, or enjoy destruction. Perhaps they treat it as a kind of sport to excel in.", UNISEX));
    minor.heel.push(new Trope(1000, "Humanitarian", 6, "Character enjoys the taste of human flesh.", UNISEX));
    minor.any.push(new Trope(1000, "Jerkass", 29, "The character is a straight up jerk who is cruel and delights in the pain of others. If he hangs out with good guys, they tolerate him for a reason.", UNISEX));
    minor.any.push(new Trope(1000, "Deadpan Snarker", 26, "They often make snarky quips with a straight face.", UNISEX));
    minor.any.push(new Trope(1000, "Berserk Button", 23, "This character is normally calm, but certain things can drive them into a berserk rage.", UNISEX));
    minor.any.push(new Trope(1000, "Large Ham", 18, "This character is GRANDOISE. They're AWESOME people to have in the room. They say whatever comes to mind, and not only call out the fucking elephant in the room, but do it in front of everyone. EXPECT THEM TO TALK AS LOUD AS THEY LIKE.", UNISEX));
    minor.any.push(new Trope(1000, "Catch-Phrase", 4, 'Character has a verbal tic they say as a matter of habit, such as, "Uh huh", "You know...", "my dear", "bruh"', UNISEX));
    minor.any.push(new Trope(1000, "Catch-Phrase", 2, 'Character is not very conversational. There is a phrase they often repeat, like "Yup."', UNISEX));
    minor.any.push(new Trope(1000, "Catch-Phrase", 2, "Character says the same phrase as to curse, whenever they fail at something.", UNISEX));
    minor.any.push(new Trope(1000, "Catch-Phrase", 2, "Character has a catch-phrase when saying goodbye.", UNISEX));
    minor.any.push(new Trope(1000, "Catch-Phrase", 2, "Character has a catch-phrase when entering a dangerous situation, as a rallying cry or order to attack.", UNISEX));
    minor.any.push(new Trope(1000, "Catch-Phrase", 1, "Character shouts a brief battle cry before combat.", UNISEX));
    minor.any.push(new Trope(1000, "Catch-Phrase", 1, "Character has a catch-phrase they use whenever insulting someone.", UNISEX));
    minor.any.push(new Trope(1000, "Catch-Phrase", 1, "Character has a catch-phrase they use whenever defeating or executing someone.", UNISEX));
    minor.any.push(new Trope(1000, "Catch-Phrase", 1, "Character has a catch-phrase before battle. It's not as brief as a battle cry, and is often used to demonstrate righteousness. May be a short prayer.", UNISEX));
    minor.any.push(new Trope(1000, "Papa Wolf", 8, "Character is fiercely, almost violently protective of their child or a child-like figure.", MALE));
    minor.any.push(new Trope(1000, "Mama Bear", 7, "Character is fiercely, almost violently protective of their child or a child-like figure.", FEMALE));
    minor.any.push(new Trope(1000, "Determinator", 13, "This character is extremely stubborn and determined. They are unstoppable as long as they are not dead.", UNISEX));
    minor.any.push(new Trope(1000, "Manipulative Bastard", 13, "This character is an expert in manipulating emotions, perspectives, and psychology.", UNISEX));
    // minor.any.push(new Trope(1000, "The Woobie", 12, "This character has their own soft", UNISEX));
    minor.any.push(new Trope(1000, "Darker and Edgier", 12, "This character is serious, cynical, edgy, and gritty.", UNISEX));
    minor.any.push(new Trope(1000, "Blatant Lies", 12, "This character has no issues with straight up lying, without having to cushion or justify the lie.", UNISEX));
    minor.any.push(new Trope(1000, "The Stoic", 10, "This character shows little reaction to extreme things, like injury or disaster. They may break this facade with very rare things, like a death.", UNISEX));
    minor.any.push(new Trope(1000, "Ensemble Dark Horse", 10, "This character has a little trait that makes people underestimate them. For example, they might be small but strong, or come from an evil background but be heroic.", UNISEX));
    minor.any.push(new Trope(1000, "Captain Obvious", 10, "They say really obvious things. Useful as the exposition guy to a story.", UNISEX));
    minor.any.push(new Trope(1000, "Tsundere", 9, "They are harsh outwardly, but soft and sweet deep inside.", UNISEX));
    minor.any.push(new Trope(1000, "Badass Normal", 9, "They seem very normal on the outside, but have trained themselves to be unexpectedly badass.", UNISEX));
    minor.any.push(new Trope(1000, "Adorkable", 9, "Character is shy and socially inept. It makes them adorable.", UNISEX));
    minor.any.push(new Trope(1000, "Chessmaster", 8, "This character is an expert in manipulating events, situations, and circumstances to suit their plans. They often plan events to happen in a certain order, that others may not anticipate. They also have several layers of backup and misdirection.", UNISEX));
    minor.any.push(new Trope(1000, "Big Eater", 8, "This character eats more than the rest of his team combined.", UNISEX));
    minor.any.push(new Trope(1000, "Hot Blooded", 8, "This character is extremely emotional, whether it's a positive or negative spectrum.", UNISEX));
    minor.any.push(new Trope(1000, "It's All About Me", 8, "Character is egoistic and feels the whole world revolves around them.", UNISEX));
    minor.any.push(new Trope(1000, "Genre Savvy", 7, "The character has good situational awareness, which they may have learned from stories and movies.", UNISEX));
    minor.any.push(new Trope(1000, "Big Brother Instinct", 7, "This character is protective of some other smaller or younger character.", UNISEX));
    minor.any.push(new Trope(1000, "Undying Loyalty", 7, "The character is extremely loyal. They may not be a Yes Man, though.", UNISEX));
    minor.any.push(new Trope(1000, "Yandere", 6, "This person is sweet on the outside, but crazy on the inside. They're often obsessed with something they love. They can also be possessive and psychotically jealous.", UNISEX));
    minor.any.push(new Trope(1000, "Obfuscating Stupidity", 6, "This character acts dumber than they are, usually to avoid being targeted or to have others underestimate them.", UNISEX));
    minor.any.push(new Trope(1000, "Combat Pragmatist", 6, "This character is willing to do anything in a fight. They are not restricted to chivalry or any other rules to engage fairly.", UNISEX));
    minor.any.push(new Trope(1000, "Made of Iron", 6, "This character is much tougher than they look. They're not invincible, but they have a boxer's physique.", UNISEX));
    minor.any.push(new Trope(1000, "Stalker With a Crush", 6, "This character is stalking another character they have a crush on. This may be creepy or cute depending on the circumstances.", UNISEX));
    minor.any.push(new Trope(1000, "Honor Before Reason", 5, "This character is extremely honorable, and willing to stick to their values even when it is illogical.", UNISEX));
    // Link to description
    // minor.any.push(new Trope(1000, "Fiery Redhead", 5, "This character is ", UNISEX)); 
    minor.any.push(new Trope(1000, "Munchausen's By Proxy", 5, "This character is faking a condition. It might be for sympathy, for money, or even to troll others.", UNISEX));
    minor.any.push(new Trope(1000, "Never My Fault", 5, "This character absolutely refuses to accept responsibility for their mistakes. They'll push the blame to others all the time.", UNISEX));
    minor.any.push(new Trope(1000, "More Dakka", 5, "This character loves violence.", UNISEX));
    minor.any.push(new Trope(1000, "Green Eyed Monster", 5, "This character is easily jealous.", UNISEX));
    minor.any.push(new Trope(1000, "Jerkass Woobie", 5, "This character is a sadistic, cruel jerk. But they use it as a cover, for a softer damaged part inside.", UNISEX));
    minor.any.push(new Trope(1000, "Femme Fatale", 4, "This character is dangerous and sexy. Others notice the dangerous part of them, but they're too distracted by the sexy part to care.", FEMALE));
    // minor.any.push(new Trope(1000, "Mentor", 4, "", UNISEX));
    minor.any.push(new Trope(1000, "Lovable Rogue", 3, "Character breaks the law for their own personal profit, but is nice and likeable. They may be a legitimate criminal who is opposing an uncaring world. Or they may do enough good to be likeable.", UNISEX));
    minor.any.push(new Trope(1000, "The Casanova", 3, "The character relentlessly pursues, loves, and abandons members of the opposite sex, and think they're badass for it.", MALE));
    minor.any.push(new Trope(1000, "Caretaker", 2, "They have someone to take care of when the rest of the family passes the ball. May have angst related to this.", UNISEX));
    minor.any.push(new Trope(1000, "Badass Pacifist", 2, "This character is an actual pacifist. They are able to take extreme beatings or dodge extremely effectively. They often win in the end, without fighting.", UNISEX));
    minor.any.push(new Trope(1000, "The Klutz", 1, "Character is unusually clumsy.", UNISEX));
}