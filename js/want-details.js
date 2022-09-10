const PWANTBURN = 'worldburn';
const PEVULZ = 'evulz';
const PFREUDIANEXCUSE = 'fexcuse';


function wantToDesc(tag) {
  switch (tag) {
    case PWANTBURN:
      return randomArray([
        `${p.Sdesc} wants to see the world burn because ${p.she} enjoys the suffering of others. ${p.She} gets a sick satisfaction from watching people suffer, and ${p.she} loves to inflict pain on others. By destroying everything in ${p.his} path, ${p.she} believes ${p.she} can become the ultimate dictator.`,
        `${p.Sdesc} wants to destroy the world because ${p.she} believes that humanity is inherently evil and that life on Earth is nothing but a cycle of pain and suffering. ${p.She} believes that by destroying the world, ${p.she} can put an end to all of the misery and heartache that humans have caused throughout history.`,
        `${p.Sdesc} wants to destroy the world because ${p.she} believes that humans are inherently evil and that the world would be better off without them. ${p.She} believes that the natural order of things is for animals to dominate over humans, and ${p.she} wants to see this come to fruition. ${p.She} also believes that by destroying the world, ${p.she} will be able to ascend to a higher level of existence where ${p.she} can be free from the pain and suffering that humans cause.`,
        `${p.Sdesc} wants to destroy the world because ${p.she} believes that it is a corrupt and evil place. ${p.She} thinks that if ${p.she} can erase humanity from the earth, then things can be made right again. ${p.She} is convinced that ${p.she} is doing the world a favor by destroying it, and ${p.she} doesn't care about the consequences that ${p.her} actions will have on the innocent people who live here.`,
        `${p.Sdesc} wants to see the world burn because ${p.she} is angry at the way things are. ${p.She} feels like the world has wronged ${p.her} and ${p.she} wants to get back at it. ${p.She} believes that if the world burns, then everyone will suffer equally.`,
        `${p.Sdesc} is a very angry person. ${p.She} is angry at the world, and ${p.she} is angry at those who are not like ${p.him}. ${p.She} likes to take ${p.his} anger out on others, using violence and cruelty as ${p.his} weapon of choice. ${p.She} has been this way for most of ${p.his} life, and ${p.she} doesn't see any reason to change now.`
      ]);
    case PEVULZ:
      return randomArray([
        `${p.Sdesc} wants to see the world burn because ${p.she} enjoys the suffering of others. ${p.She} gets a sick satisfaction from watching people suffer, and ${p.she} loves to inflict pain on others. By destroying everything in ${p.his} path, ${p.she} believes ${p.she} can become the ultimate dictator.`,
      ]);
    default:
      return "";
  }
}

function initWants() {
  want.push(new Aspect("See the world burn", 11, "",
    BWANT, [PWANTBURN], [THEEL], [], [], []));
  want.push(new Aspect("For the evulz", 11, "",
    BWANT, [PEVULZ], [THEEL], [], [], []));
}