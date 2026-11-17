import {
  Direction,
  EditionScheduleType,
  GridCellData,
  GridSizeOption,
  PlacedClue,
  PuzzleDefinition,
  RawWordItem,
  VisualThemeId,
  WordEntrySeed,
} from '../types/crossword';
import { LEXICON_EXPANSION_A } from './lexiconExpansionA';
import { LEXICON_EXPANSION_B } from './lexiconExpansionB';
import { LEXICON_EXPANSION_C } from './lexiconExpansionC';

const RAW_LEXICON: RawWordItem[] = [
  // --- FILM & CINEMA ---
  {
    answer: 'DIRECTOR',
    easyClue: 'Filmmaker who guides the actors and crew on a movie set',
    mediumClue: 'The person in the canvas chair who calls "Action!" and "Cut!"',
    hardClue: 'Filmmaker corded it in a new cut (8)',
    crypticBreakdown: 'Anagram ("in a new cut") of CORDED IT -> DIRECTOR; definition: "Filmmaker".',
    etymologyOrContext: 'Shapes the creative vision, camera staging, and pacing of a motion picture.',
    defaultIsCryptic: true,
  },
  {
    answer: 'PREMIERE',
    easyClue: 'First public screening of a new movie or play',
    mediumClue: 'Red-carpet opening night where flashbulbs pop',
    hardClue: 'Opening night prime ere rearranged (8)',
    crypticBreakdown: 'Anagram ("rearranged") of PRIME ERE -> PREMIERE; definition: "Opening night".',
    etymologyOrContext: 'From French premiere ("first").',
    defaultIsCryptic: true,
  },
  {
    answer: 'THRILLER',
    easyClue: 'Suspenseful movie genre full of tension and twists',
    mediumClue: 'Edge-of-your-seat Hitchcock genre',
    hardClue: 'Suspense film where hill err holds t (8)',
    crypticBreakdown: 'Insertion of HILL ERR around T -> THRILLER; definition: "Suspense film".',
    etymologyOrContext: 'Popularized in cinema by Alfred Hitchcock with films like Rear Window and Vertigo.',
    defaultIsCryptic: false,
  },
  {
    answer: 'MATINEE',
    easyClue: 'Afternoon movie screening or theater performance',
    mediumClue: 'Daytime show where tickets and popcorn cost a little less',
    hardClue: 'Afternoon show animate without a? No, in a team reshuffled! (7)',
    crypticBreakdown: 'Anagram ("reshuffled") of IN A TEAM -> MATINEE; definition: "Afternoon show".',
    etymologyOrContext: 'From French matin ("morning").',
    defaultIsCryptic: true,
  },
  {
    answer: 'MONTAGE',
    easyClue: 'Rapid sequence of film shots edited together to condense time',
    mediumClue: 'Training-sequence movie shortcut set to an upbeat song',
    hardClue: 'Edited film sequence got name in a twist (7)',
    crypticBreakdown: 'Anagram ("in a twist") of GOT NAME -> MONTAGE; definition: "Edited film sequence".',
    etymologyOrContext: 'Pioneered by Soviet film theorists Sergei Eisenstein and Lev Kuleshov.',
    defaultIsCryptic: true,
  },
  {
    answer: 'CINEMA',
    easyClue: 'Theater where movies are projected on a big screen',
    mediumClue: 'The silver screen art form—or the building where you watch it',
    hardClue: 'Movie house iceman melted inside (6)',
    crypticBreakdown: 'Anagram ("melted") of ICEMAN -> CINEMA; definition: "Movie house".',
    etymologyOrContext: 'Shortened from French cinematographe, coined by the Lumiere brothers.',
    defaultIsCryptic: true,
  },
  {
    answer: 'CAMERA',
    easyClue: 'Device used to record motion pictures or photographs',
    mediumClue: 'What comes between "Lights!" and "Action!" on set',
    hardClue: 'Lens box maraca shaken up (6)',
    crypticBreakdown: 'Anagram ("shaken up") of MARACA -> CAMERA; definition: "Lens box".',
    etymologyOrContext: 'From Latin camera obscura ("dark chamber").',
    defaultIsCryptic: true,
  },
  {
    answer: 'SEQUEL',
    easyClue: 'Movie or book that continues the story of an earlier one',
    mediumClue: 'Part II at the box office',
    hardClue: 'Follow-up film equals without a, adding e (6)',
    crypticBreakdown: 'Wordplay on SEQUEL (following in order); definition: "Follow-up film".',
    etymologyOrContext: 'From Latin sequela ("that which follows").',
    defaultIsCryptic: false,
  },
  {
    answer: 'SCRIPT',
    easyClue: 'Written text of a movie, play, or broadcast with dialogue',
    mediumClue: 'Screenplay binder that actors memorize before filming',
    hardClue: 'Screenplay strips c out of crisp t (6)',
    crypticBreakdown: 'Anagram of CRISP + T -> SCRIPT; definition: "Screenplay".',
    etymologyOrContext: 'Contains both spoken dialogue and scene sluglines.',
    defaultIsCryptic: true,
  },
  {
    answer: 'STUDIO',
    easyClue: 'Soundstage complex or company that produces films',
    mediumClue: 'Hollywood backlot where worlds are built indoors',
    hardClue: 'Filming lotious dust without us? Duo sits around t! (6)',
    crypticBreakdown: 'Anagram ("around") of DUO SITS without S -> STUDIO; definition: "Filming lot".',
    etymologyOrContext: 'Classic major studios include Universal, Paramount, and Warner Bros.',
    defaultIsCryptic: false,
  },
  {
    answer: 'AUTEUR',
    easyClue: 'Film director whose personal artistic style is unmistakable',
    mediumClue: 'French term for a director treated as the "author" of a movie',
    hardClue: 'Visionary filmmaker rue tau in Paris (6)',
    crypticBreakdown: 'Anagram of RUE TAU -> AUTEUR; definition: "Visionary filmmaker".',
    etymologyOrContext: 'Central concept of the French New Wave film criticism in Cahiers du Cinema.',
    defaultIsCryptic: true,
  },
  {
    answer: 'OSCAR',
    easyClue: 'Golden statuette awarded annually by the Academy of Motion Picture Arts',
    mediumClue: 'Hollywood’s most coveted golden knight on a film reel',
    hardClue: 'Film award orcas swimming backwards (5)',
    crypticBreakdown: 'Anagram ("swimming") of ORCAS -> OSCAR; definition: "Film award".',
    etymologyOrContext: 'First awarded at the Hollywood Roosevelt Hotel in 1929.',
    defaultIsCryptic: true,
  },
  {
    answer: 'ACTOR',
    easyClue: 'Performer who plays a character in a movie, play, or show',
    mediumClue: 'Cast member who steps into someone else’s shoes on cue',
    hardClue: 'Cast member gator loses g for ac (5)',
    crypticBreakdown: 'Anagram of TAR CO -> ACTOR; definition: "Cast member".',
    etymologyOrContext: 'Thespis of Icaria is credited as the first actor in ancient Greek theater.',
    defaultIsCryptic: false,
  },
  {
    answer: 'SCENE',
    easyClue: 'Single continuous unit of action in a film or play',
    mediumClue: 'What a clapperboard marks alongside the take number',
    hardClue: 'Film segment cense rearranged (5)',
    crypticBreakdown: 'Anagram ("rearranged") of CENSE -> SCENE; definition: "Film segment".',
    etymologyOrContext: 'From Greek skene ("stage building or tent").',
    defaultIsCryptic: true,
  },

  // --- TELEVISION & BROADCAST ---
  {
    answer: 'EPISODE',
    easyClue: 'Single installment of a television or radio series',
    mediumClue: 'One chapter in a binge-watched television season',
    hardClue: 'TV installment poised with e in remix (7)',
    crypticBreakdown: 'Anagram ("in remix") of POISED + E -> EPISODE; definition: "TV installment".',
    etymologyOrContext: 'Originally denoted the dialogue sections between choral songs in Greek tragedy.',
    defaultIsCryptic: true,
  },
  {
    answer: 'NETWORK',
    easyClue: 'Group of interconnected television stations broadcasting the same shows',
    mediumClue: 'Broadcaster web—or what professionals do at a conference',
    hardClue: 'Broadcast system won trek across the airwaves (7)',
    crypticBreakdown: 'Anagram ("across the airwaves") of WON TREK -> NETWORK; definition: "Broadcast system".',
    etymologyOrContext: 'Links local affiliate stations to national programming feeds.',
    defaultIsCryptic: true,
  },
  {
    answer: 'CHANNEL',
    easyClue: 'Television frequency band or streaming station you tune into',
    mediumClue: 'What the remote control flips through—or the waterway between England and France',
    hardClue: 'TV station clan hen feathers ruffled (7)',
    crypticBreakdown: 'Anagram ("ruffled") of CLAN HEN -> CHANNEL; definition: "TV station".',
    etymologyOrContext: 'Double meaning: a television band and a navigable strait.',
    defaultIsCryptic: true,
  },
  {
    answer: 'SITCOM',
    easyClue: 'Half-hour humorous television series with recurring characters',
    mediumClue: 'Laugh-track television staple whose name blends location and humor',
    hardClue: 'Funny TV show comics drop s for t (6)',
    crypticBreakdown: 'Anagram of COMIC(s) + T -> SITCOM; definition: "Funny TV show".',
    etymologyOrContext: 'Portmanteau of "situational comedy", pioneered on radio and early television.',
    defaultIsCryptic: false,
  },
  {
    answer: 'FINALE',
    easyClue: 'Last episode of a television season or closing number of a show',
    mediumClue: 'Cliffhanger season closer that leaves viewers talking all summer',
    hardClue: 'Season closer elfin a dance (6)',
    crypticBreakdown: 'Anagram ("dance") of ELFIN A -> FINALE; definition: "Season closer".',
    etymologyOrContext: 'Italian for "final" or "end".',
    defaultIsCryptic: true,
  },
  {
    answer: 'SERIES',
    easyClue: 'Set of related television episodes aired under one title',
    mediumClue: 'Multi-part television run—or the October championship in baseball',
    hardClue: 'TV show rises around east (6)',
    crypticBreakdown: 'Anagram of RISES + E (east) -> SERIES; definition: "TV show".',
    etymologyOrContext: 'In the UK, "series" refers to a single season; in the US, the entire show.',
    defaultIsCryptic: true,
  },
  {
    answer: 'STREAM',
    easyClue: 'Watch video or listen to audio live over the internet',
    mediumClue: 'Babbling brook that became how we watch television on demand',
    hardClue: 'Broadcast online master remade (6)',
    crypticBreakdown: 'Anagram ("remade") of MASTER -> STREAM; definition: "Broadcast online".',
    etymologyOrContext: 'Delivers continuous media packets without downloading the entire file first.',
    defaultIsCryptic: true,
  },
  {
    answer: 'REMOTE',
    easyClue: 'Handheld wireless device used to change TV channels from the sofa',
    mediumClue: 'Couch potato’s magic wand that hides between sofa cushions',
    hardClue: 'Couch clicker meteor showered (6)',
    crypticBreakdown: 'Anagram ("showered") of METEOR -> REMOTE; definition: "Couch clicker".',
    etymologyOrContext: 'Early 1950s Zenith models were called "Lazy Bones" and "Flash-Matic".',
    defaultIsCryptic: true,
  },
  {
    answer: 'SERIAL',
    easyClue: 'Story broadcast in continuing installments with an ongoing plot',
    mediumClue: 'Continuing drama that sounds just like breakfast flakes',
    hardClue: 'Ongoing drama Israel broadcasted (6)',
    crypticBreakdown: 'Anagram ("broadcasted") of ISRAEL -> SERIAL; definition: "Ongoing drama".',
    etymologyOrContext: 'Evolved from 19th-century serialized novels by authors like Charles Dickens.',
    defaultIsCryptic: true,
  },
  {
    answer: 'AERIAL',
    easyClue: 'Rooftop metal antenna that receives television or radio waves',
    mediumClue: 'Rooftop signal catcher—or performed high up in the air',
    hardClue: 'TV antenna air ale mixed up (6)',
    crypticBreakdown: 'Anagram ("mixed up") of AIR ALE -> AERIAL; definition: "TV antenna".',
    etymologyOrContext: 'British standard term for a broadcast receiving antenna.',
    defaultIsCryptic: true,
  },
  {
    answer: 'PILOT',
    easyClue: 'Test first episode produced to sell a new television series',
    mediumClue: 'Cockpit captain—or Episode 1 that convinces a network to order a season',
    hardClue: 'First episode lit up inside post office (5)',
    crypticBreakdown: 'Insertion of IL (lit reversed) inside POT -> PILOT; definition: "First episode".',
    etymologyOrContext: 'Serves as a proof-of-concept prototype for a television show.',
    defaultIsCryptic: false,
  },

  // --- SCIENCE FICTION & FUTURISM ---
  {
    answer: 'STARSHIP',
    easyClue: 'Fictional spacecraft designed to travel between distant star systems',
    mediumClue: 'Warp-drive vessel like the USS Enterprise',
    hardClue: 'Interstellar craft parts his in drydock (8)',
    crypticBreakdown: 'Anagram ("in drydock") of PARTS HIS -> STARSHIP; definition: "Interstellar craft".',
    etymologyOrContext: 'Central vehicle of space opera science fiction.',
    defaultIsCryptic: true,
  },
  {
    answer: 'ANDROID',
    easyClue: 'Robot built to look and act like a human being',
    mediumClue: 'Synthetic human that Philip K. Dick asked if electric sheep visit in dreams',
    hardClue: 'Humanlike robot did roar without r, adding n (7)',
    crypticBreakdown: 'Anagram of DROID + AN -> ANDROID; definition: "Humanlike robot".',
    etymologyOrContext: 'From Greek andr- ("man, human") + -oid ("having the form of").',
    defaultIsCryptic: true,
  },
  {
    answer: 'DYSTOPIA',
    easyClue: 'Imagined future society where life is bleak and oppressive',
    mediumClue: 'Dark sci-fi opposite of utopia seen in 1984 and Brave New World',
    hardClue: 'Bleak future world tidy soap dissolved (8)',
    crypticBreakdown: 'Anagram ("dissolved") of TIDY SOAP -> DYSTOPIA; definition: "Bleak future world".',
    etymologyOrContext: 'First used by John Stuart Mill in an 1868 parliamentary speech.',
    defaultIsCryptic: true,
  },
  {
    answer: 'CYBORG',
    easyClue: 'Being with both organic body parts and mechanical implants',
    mediumClue: 'Part human, part machine sci-fi hero',
    hardClue: 'Bionic being cry bog in confusion (6)',
    crypticBreakdown: 'Anagram ("in confusion") of CRY BOG -> CYBORG; definition: "Bionic being".',
    etymologyOrContext: 'Portmanteau of "cybernetic organism", coined in 1960.',
    defaultIsCryptic: true,
  },
  {
    answer: 'GALAXY',
    easyClue: 'Massive system of billions of stars held together by gravity',
    mediumClue: 'Where Star Wars takes place—"far, far away"',
    hardClue: 'Star system gay lax in arrangement (6)',
    crypticBreakdown: 'Anagram ("in arrangement") of GAY LAX -> GALAXY; definition: "Star system".',
    etymologyOrContext: 'From Greek galaxias kyklos ("milky circle").',
    defaultIsCryptic: false,
  },
  {
    answer: 'PORTAL',
    easyClue: 'Sci-fi doorway or wormhole that teleports travelers across space or time',
    mediumClue: 'Glowing dimensional gateway—or a grand architectural entrance',
    hardClue: 'Dimensional gate patrol on the move (6)',
    crypticBreakdown: 'Anagram ("on the move") of PATROL -> PORTAL; definition: "Dimensional gate".',
    etymologyOrContext: 'From Latin porta ("gate").',
    defaultIsCryptic: true,
  },
  {
    answer: 'PHASER',
    easyClue: 'Futuristic energy beam weapon often set to "stun"',
    mediumClue: 'Starfleet sidearm that rhymes with laser',
    hardClue: 'Sci-fi ray gun seraph terbang reversed (6)',
    crypticBreakdown: 'Anagram ("reversed") of SERAPH -> PHASER; definition: "Sci-fi ray gun".',
    etymologyOrContext: 'Coined for Star Trek in 1966 from "phased energy rectification".',
    defaultIsCryptic: true,
  },
  {
    answer: 'MUTANT',
    easyClue: 'Organism with a genetic change that gives it new traits or powers',
    mediumClue: 'Comic-book and sci-fi hero born with an X-gene evolution',
    hardClue: 'Genetically altered being nut mat woven (6)',
    crypticBreakdown: 'Anagram ("woven") of NUT MAT -> MUTANT; definition: "Genetically altered being".',
    etymologyOrContext: 'From Latin mutare ("to change").',
    defaultIsCryptic: false,
  },
  {
    answer: 'ALIEN',
    easyClue: 'Creature from another planet; extraterrestrial',
    mediumClue: 'Visitor from beyond Earth whose ship might be a flying saucer',
    hardClue: 'Extraterrestrial line a mixed up (5)',
    crypticBreakdown: 'Anagram ("mixed up") of LINE A -> ALIEN; definition: "Extraterrestrial".',
    etymologyOrContext: 'From Latin alienus ("belonging to another").',
    defaultIsCryptic: true,
  },
  {
    answer: 'ROBOT',
    easyClue: 'Programmable mechanical machine capable of carrying out tasks automatically',
    mediumClue: 'Mechanical helper governed by Asimov’s Three Laws',
    hardClue: 'Mechanical worker borto spun around (5)',
    crypticBreakdown: 'Anagram ("spun around") of BORTO -> ROBOT; definition: "Mechanical worker".',
    etymologyOrContext: 'Introduced by Karel Capek in his 1920 sci-fi play R.U.R. from Czech robota.',
    defaultIsCryptic: false,
  },
  {
    answer: 'CLONE',
    easyClue: 'Genetically identical copy of a living organism',
    mediumClue: 'Sci-fi double grown in a vat—or Dolly the famous sheep',
    hardClue: 'Genetic double clean without a, adding o (5)',
    crypticBreakdown: 'Anagram of CONE + L -> CLONE; definition: "Genetic double".',
    etymologyOrContext: 'From Greek klon ("twig, slip").',
    defaultIsCryptic: true,
  },

  // --- POPULAR SUBJECTS: MUSIC, CULINARY & MYTHOLOGY ---
  {
    answer: 'SYMPHONY',
    easyClue: 'Elaborate musical composition for a full orchestra in four movements',
    mediumClue: 'Beethoven’s Ninth or Mozart’s Jupiter in the concert hall',
    hardClue: 'Orchestral work hymns pay without a, adding o (8)',
    crypticBreakdown: 'Wordplay on SYM + PHONY ("fake sound"); definition: "Orchestral work".',
    etymologyOrContext: 'From Greek symphonia ("agreement or concord of sound").',
    defaultIsCryptic: true,
  },
  {
    answer: 'MELODY',
    easyClue: 'Sequence of musical notes that forms a recognizable tune',
    mediumClue: 'Catchy tune you find yourself humming after the concert',
    hardClue: 'Catchy tune oldemy rearranged (6)',
    crypticBreakdown: 'Anagram ("rearranged") of OLDEMY -> MELODY; definition: "Catchy tune".',
    etymologyOrContext: 'From Greek meloidia ("singing, chanting").',
    defaultIsCryptic: false,
  },
  {
    answer: 'CHORUS',
    easyClue: 'Repeated main refrain of a song where everyone sings along',
    mediumClue: 'The part of a pop song everyone knows the words to',
    hardClue: 'Refrain such or mixed up (6)',
    crypticBreakdown: 'Anagram ("mixed up") of SUCH OR -> CHORUS; definition: "Refrain".',
    etymologyOrContext: 'Originated in Athenian drama as the unified group of singers and dancers.',
    defaultIsCryptic: true,
  },
  {
    answer: 'ENCORE',
    easyClue: 'Extra song performed at the end of a concert when the audience cheers',
    mediumClue: 'What fans shout while clapping after the band leaves the stage',
    hardClue: 'Extra performance cornea without a (6)',
    crypticBreakdown: 'Anagram of CORNE(a) + E -> ENCORE; definition: "Extra performance".',
    etymologyOrContext: 'French for "again" or "some more".',
    defaultIsCryptic: true,
  },
  {
    answer: 'SONATA',
    easyClue: 'Classical music piece written for a solo instrument like piano or violin',
    mediumClue: 'Beethoven’s "Moonlight" composition for solo keys',
    hardClue: 'Instrumental piece at a son’s recital backwards (6)',
    crypticBreakdown: 'Anagram of A TAN OS -> SONATA; definition: "Instrumental piece".',
    etymologyOrContext: 'From Italian suonare ("to sound"), contrasted with cantata ("to sing").',
    defaultIsCryptic: true,
  },
  {
    answer: 'TEMPO',
    easyClue: 'Speed or pace at which a piece of music is played',
    mediumClue: 'Beat speed measured by a ticking metronome',
    hardClue: 'Musical pace poem with t rearranged (5)',
    crypticBreakdown: 'Anagram ("rearranged") of POEM + T -> TEMPO; definition: "Musical pace".',
    etymologyOrContext: 'Italian for "time"; marked by terms like allegro, adagio, and andante.',
    defaultIsCryptic: true,
  },
  {
    answer: 'SAFFRON',
    easyClue: 'Golden-red spice harvested from crocus flowers, used in paella',
    mediumClue: 'The world’s most expensive spice by weight, harvested thread by thread',
    hardClue: 'Golden spice raffs on in the kitchen (7)',
    crypticBreakdown: 'Anagram ("in the kitchen") of RAFFS ON -> SAFFRON; definition: "Golden spice".',
    etymologyOrContext: 'Derived from the crimson stigmas of Crocus sativus.',
    defaultIsCryptic: true,
  },
  {
    answer: 'TRUFFLE',
    easyClue: 'Rare underground mushroom prized by chefs, or a rich chocolate candy',
    mediumClue: 'Forest delicacy hunted by keen-nosed dogs and pigs',
    hardClue: 'Gourmet fungus flutter around f (7)',
    crypticBreakdown: 'Wordplay on TRUFFLE; definition: "Gourmet fungus".',
    etymologyOrContext: 'Prized varieties include the black Perigord and white Alba truffles.',
    defaultIsCryptic: false,
  },
  {
    answer: 'BISTRO',
    easyClue: 'Small, cozy French-style restaurant serving simple meals',
    mediumClue: 'Sidewalk cafe in Paris with chalkboard menus',
    hardClue: 'Cozy cafe orbits around the square (6)',
    crypticBreakdown: 'Anagram ("around the square") of ORBITS -> BISTRO; definition: "Cozy cafe".',
    etymologyOrContext: 'Classic Parisian neighborhood dining institution.',
    defaultIsCryptic: true,
  },
  {
    answer: 'RECIPE',
    easyClue: 'Set of instructions and ingredients for preparing a dish',
    mediumClue: 'Cookbook formula passed down through generations',
    hardClue: 'Cooking guide pierce through the middle (6)',
    crypticBreakdown: 'Anagram ("through the middle") of PIERCE -> RECIPE; definition: "Cooking guide".',
    etymologyOrContext: 'From Latin recipe ("take!"), originally used at the top of apothecary prescriptions.',
    defaultIsCryptic: true,
  },
  {
    answer: 'PALATE',
    easyClue: 'Roof of the mouth, or a person’s sense of taste for food and wine',
    mediumClue: 'A chef’s refined sense of flavor—not to be confused with a painter’s board',
    hardClue: 'Sense of taste a plate rearranged (6)',
    crypticBreakdown: 'Anagram ("rearranged") of A PLATE -> PALATE; definition: "Sense of taste".',
    etymologyOrContext: 'Homophone of palette (artist board) and pallet (shipping platform).',
    defaultIsCryptic: true,
  },
  {
    answer: 'AROMA',
    easyClue: 'Pleasant, appetizing smell of fresh coffee or baking bread',
    mediumClue: 'Kitchen fragrance that draws everyone to the table',
    hardClue: 'Pleasant scent roam a bit (5)',
    crypticBreakdown: 'Charade of A + ROMA (roam a) -> AROMA; definition: "Pleasant scent".',
    etymologyOrContext: 'From Greek aroma ("seasoning, sweet spice").',
    defaultIsCryptic: true,
  },
  {
    answer: 'FEAST',
    easyClue: 'Large, celebratory meal with many courses for guests',
    mediumClue: 'Banquet table spread fit for a king',
    hardClue: 'Grand banquet fates twisted (5)',
    crypticBreakdown: 'Anagram ("twisted") of FATES -> FEAST; definition: "Grand banquet".',
    etymologyOrContext: 'From Latin festa ("festal days").',
    defaultIsCryptic: true,
  },

  // --- ASTRONOMY, ECOLOGY, LITERATURE & NAVIGATION ---
  {
    answer: 'ASTRONOMER',
    easyClue: 'Scientist who studies stars, planets, and space',
    mediumClue: 'Night-shift professional who is always looking up',
    hardClue: 'Star-gazer roamers not wandering at last (10)',
    crypticBreakdown: 'Anagram ("wandering") of ROAMERS NOT -> ASTRONOMER; definition: "Star-gazer".',
    etymologyOrContext: 'From Greek astron (star) + nomos (arranging, law).',
    defaultIsCryptic: true,
  },
  {
    answer: 'OBSERVATORY',
    easyClue: 'Domed building equipped with a large telescope',
    mediumClue: 'High-altitude room with a view of the galaxies',
    hardClue: 'Watchful dome where a brave story is retold around zero (11)',
    crypticBreakdown: 'Anagram ("is retold") of BRAVE STORY + O (zero) -> OBSERVATORY; definition: "Watchful dome".',
    etymologyOrContext: 'Historically positioned on high mountain peaks above atmospheric distortion.',
    defaultIsCryptic: false,
  },
  {
    answer: 'CONSTELLATION',
    easyClue: 'Group of stars forming a named pattern in the night sky',
    mediumClue: 'Connect-the-dots picture drawn across the heavens',
    hardClue: 'Starry group calls note into arrangement (13)',
    crypticBreakdown: 'Complex anagram ("arrangement") of CALLS NOTE INTO -> CONSTELLATION; definition: "Starry group".',
    etymologyOrContext: 'The IAU officially recognizes 88 modern star patterns.',
    defaultIsCryptic: true,
  },
  {
    answer: 'EQUINOX',
    easyClue: 'Day of the year when daytime and nighttime are equal in length',
    mediumClue: 'Twice-yearly balancing act between light and dark',
    hardClue: 'Equal night starts with exotic queen before ox (7)',
    crypticBreakdown: 'Charade of E (exotic start) + QUIN (queen sound) + OX -> EQUINOX; definition: "Equal night".',
    etymologyOrContext: 'From Latin aequus (equal) + nox (night), occurring in March and September.',
    defaultIsCryptic: false,
  },
  {
    answer: 'NEBULA',
    easyClue: 'Giant cloud of gas and dust in outer space',
    mediumClue: 'Cosmic nursery where newborn stars ignite',
    hardClue: 'Cloud in space spun around blue anorak initially (6)',
    crypticBreakdown: 'Anagram ("spun around") of BLUE AN(orak) -> NEBULA; definition: "Cloud in space".',
    etymologyOrContext: 'Latin for "mist" or "cloud"; stellar nurseries where stars are born.',
    defaultIsCryptic: true,
  },
  {
    answer: 'ECLIPSE',
    easyClue: 'Event when the Moon or Earth blocks light from the Sun',
    mediumClue: 'Celestial photobomb that casts a dramatic shadow',
    hardClue: 'Outshine special arrangement in the sky (7)',
    crypticBreakdown: 'Anagram ("arrangement") of SPECIAL -> ECLIPSE; definition: "Outshine".',
    etymologyOrContext: 'Occurs as solar (Moon blocks Sun) or lunar (Earth shadows Moon).',
    defaultIsCryptic: true,
  },
  {
    answer: 'ORBITAL',
    easyClue: 'Relating to the curved path of a planet or spacecraft',
    mediumClue: 'Going around in circles at thousands of miles per hour',
    hardClue: 'Looping path of trial aboard ship (7)',
    crypticBreakdown: 'Anagram of TRIAL inside OB (old boy/ship) -> ORBITAL; definition: "Looping path".',
    etymologyOrContext: 'Describes both planetary trajectories and atomic electron wavefunctions.',
    defaultIsCryptic: false,
  },
  {
    answer: 'ZENITH',
    easyClue: 'The highest point reached in the sky directly overhead',
    mediumClue: 'Absolute peak that starts at the end of the alphabet',
    hardClue: 'Peak citizen, it hides inside! (6)',
    crypticBreakdown: 'Hidden word ("hides inside") in citiZEN ITHaca / zen + ith; definition: "Peak".',
    etymologyOrContext: 'Derived via medieval Latin and Arabic samt al-ras ("path over the head").',
    defaultIsCryptic: true,
  },
  {
    answer: 'PARALLAX',
    easyClue: 'Apparent shift of an object when viewed from two different angles',
    mediumClue: 'Why your thumb jumps when you wink one eye then the other',
    hardClue: 'Shift in perspective when all par axes align (8)',
    crypticBreakdown: 'Charade of PAR + ALL + AX (axes short) -> PARALLAX; definition: "Shift in perspective".',
    etymologyOrContext: 'Used by astronomers to measure distances to nearby stars.',
    defaultIsCryptic: false,
  },
  {
    answer: 'SOLSTICE',
    easyClue: 'Either the longest or the shortest day of the year',
    mediumClue: 'Midwinter or midsummer turning point when the sun stands still',
    hardClue: 'Turning point of the sun costs lie in ruin (8)',
    crypticBreakdown: 'Anagram ("in ruin") of COSTS LIE -> SOLSTICE; definition: "Turning point of the sun".',
    etymologyOrContext: 'From Latin sol (sun) + sistere (to stand still).',
    defaultIsCryptic: true,
  },
  {
    answer: 'APOGEE',
    easyClue: 'Farthest point in a satellite or Moon orbit from Earth',
    mediumClue: 'Orbital high-water mark where Earth looks smallest',
    hardClue: 'Distant peak where a page goes around outskirts of Europe (6)',
    crypticBreakdown: 'A + POGE (page shift) + E (outskirts of Europe) -> APOGEE; definition: "Distant peak".',
    etymologyOrContext: 'Opposite of perigee; from Greek apo (away from) + ge (Earth).',
    defaultIsCryptic: false,
  },
  {
    answer: 'METEORITE',
    easyClue: 'Space rock that survives falling through the atmosphere to hit Earth',
    mediumClue: 'Shooting star that actually made a touchdown',
    hardClue: 'Space rock remote tie shattered on impact (9)',
    crypticBreakdown: 'Anagram ("shattered") of REMOTE TIE -> METEORITE; definition: "Space rock".',
    etymologyOrContext: 'A meteoroid in space becomes a meteor in the atmosphere and a meteorite on the ground.',
    defaultIsCryptic: true,
  },
  {
    answer: 'RADIANT',
    easyClue: 'Shining brightly or sending out light and warmth',
    mediumClue: 'Beaming with joy—or the sky point where meteors fan out',
    hardClue: 'Glowing train ad remade backwards (7)',
    crypticBreakdown: 'Anagram ("remade") of TRAIN AD -> RADIANT; definition: "Glowing".',
    etymologyOrContext: 'Also the celestial point from which a meteor shower appears to originate.',
    defaultIsCryptic: true,
  },
  {
    answer: 'SPECTRUM',
    easyClue: 'Continuous band of rainbow colors separated by wavelength',
    mediumClue: 'What a glass prism unpacks from a beam of white light',
    hardClue: 'Range of light crumpets baked backwards (8)',
    crypticBreakdown: 'Anagram ("baked") of CRUMPETS -> SPECTRUM; definition: "Range of light".',
    etymologyOrContext: 'Coined by Isaac Newton in 1671 during his prism experiments.',
    defaultIsCryptic: true,
  },
  {
    answer: 'TELESCOPE',
    easyClue: 'Optical instrument with lenses or mirrors used to view distant stars',
    mediumClue: 'Galileo’s tube that brings Jupiter’s moons next door',
    hardClue: 'Spyglass elect pose in disarray (9)',
    crypticBreakdown: 'Anagram ("in disarray") of ELECT POSE -> TELESCOPE; definition: "Spyglass".',
    etymologyOrContext: 'First patented by Hans Lippershey in 1608 and turned skyward by Galileo.',
    defaultIsCryptic: true,
  },
  {
    answer: 'NOVA',
    easyClue: 'Star that suddenly becomes thousands of times brighter',
    mediumClue: 'Stellar flare-up whose Latin name means "new"',
    hardClue: 'New star captured in Avon backwards (4)',
    crypticBreakdown: 'Reversal ("backwards") of AVON -> NOVA; definition: "New star".',
    etymologyOrContext: 'From Latin stella nova, meaning "new star".',
    defaultIsCryptic: true,
  },
  {
    answer: 'COMET',
    easyClue: 'Icy body in space that forms a bright tail when passing near the Sun',
    mediumClue: 'Halley’s dirty snowball on a 76-year schedule',
    hardClue: 'Icy traveler met company at the door (5)',
    crypticBreakdown: 'Charade of CO (company) + MET -> COMET; definition: "Icy traveler".',
    etymologyOrContext: 'From Greek kometes, meaning "wearing long hair".',
    defaultIsCryptic: false,
  },
  {
    answer: 'QUASAR',
    easyClue: 'Extremely bright and distant galactic core powered by a black hole',
    mediumClue: 'Star-like radio beacon shining from the edge of the universe',
    hardClue: 'Distant beacon as aqua ripples around right (6)',
    crypticBreakdown: 'Anagram of AQUA + S + R (right) -> QUASAR; definition: "Distant beacon".',
    etymologyOrContext: 'Short for "quasi-stellar radio source".',
    defaultIsCryptic: false,
  },
  {
    answer: 'PULSAR',
    easyClue: 'Rapidly spinning neutron star that emits regular pulses of radiation',
    mediumClue: 'Cosmic lighthouse keeping time more accurately than atomic clocks',
    hardClue: 'Spinning beacon slurp a cocktail (6)',
    crypticBreakdown: 'Anagram ("cocktail") of SLURP A -> PULSAR; definition: "Spinning beacon".',
    etymologyOrContext: 'Discovered in 1967 by Jocelyn Bell Burnell and Antony Hewish.',
    defaultIsCryptic: true,
  },
  {
    answer: 'CORONA',
    easyClue: 'Glowing outer atmosphere of the Sun seen during a total eclipse',
    mediumClue: 'Fiery solar crown hidden until the Moon steps in front',
    hardClue: 'Solar crown racoon spun around (6)',
    crypticBreakdown: 'Anagram ("spun around") of RACOON -> CORONA; definition: "Solar crown".',
    etymologyOrContext: 'Latin for "crown"; reaches temperatures of millions of kelvins.',
    defaultIsCryptic: true,
  },
  {
    answer: 'ALBEDO',
    easyClue: 'Fraction of sunlight that a planet or icy surface reflects back into space',
    mediumClue: 'Why fresh snow gleams bright while charcoal stays dark',
    hardClue: 'Reflectivity of blade zero reshaped (6)',
    crypticBreakdown: 'Anagram ("reshaped") of BLADE + O (zero) -> ALBEDO; definition: "Reflectivity".',
    etymologyOrContext: 'Ranges from 0 (blackbody absorbing all light) to 1 (total reflection).',
    defaultIsCryptic: true,
  },
  {
    answer: 'UMBRA',
    easyClue: 'Darkest inner core of a shadow during an eclipse',
    mediumClue: 'Shady relative of an umbrella where light is totally blocked',
    hardClue: 'Dark shadow hidden in rumba dance (5)',
    crypticBreakdown: 'Anagram ("dance") of RUMBA -> UMBRA; definition: "Dark shadow".',
    etymologyOrContext: 'Surrounded by the lighter penumbra during eclipses.',
    defaultIsCryptic: true,
  },
  {
    answer: 'NADIR',
    easyClue: 'The lowest possible point; directly opposite the zenith',
    mediumClue: 'Rock bottom on the celestial sphere',
    hardClue: 'Lowest point drain backwards (5)',
    crypticBreakdown: 'Anagram/reversal ("backwards") of DRAIN -> NADIR; definition: "Lowest point".',
    etymologyOrContext: 'The direct opposite of the zenith.',
    defaultIsCryptic: true,
  },
  {
    answer: 'TITAN',
    easyClue: 'Largest moon of Saturn, famous for its thick golden haze',
    mediumClue: 'Mythological giant orbiting within Saturn’s ring system',
    hardClue: 'Giant moon taint disturbed (5)',
    crypticBreakdown: 'Anagram ("disturbed") of TAINT -> TITAN; definition: "Giant moon".',
    etymologyOrContext: 'Discovered by Christiaan Huygens in 1655.',
    defaultIsCryptic: true,
  },
  {
    answer: 'ORION',
    easyClue: 'Famous winter constellation featuring a three-star belt',
    mediumClue: 'Celestial hunter flanked by Betelgeuse and Rigel',
    hardClue: 'Hunter in the sky iron ring forged (5)',
    crypticBreakdown: 'Anagram ("forged") of IRON + O (ring) -> ORION; definition: "Hunter in the sky".',
    etymologyOrContext: 'Contains the bright supergiants Betelgeuse and Rigel.',
    defaultIsCryptic: true,
  },
  {
    answer: 'ATLAS',
    easyClue: 'Book of geographical maps, or the Greek Titan who held up the sky',
    mediumClue: 'World-carrying heavyweight found in the reference section',
    hardClue: 'Book of maps last a long time backwards (5)',
    crypticBreakdown: 'Reversal ("backwards") of A SALT / LAST A -> ATLAS; definition: "Book of maps".',
    etymologyOrContext: 'First used for a map collection by Gerardus Mercator in 1595.',
    defaultIsCryptic: false,
  },
  {
    answer: 'VORTEX',
    easyClue: 'Spinning whirlpool of water or swirling column of air',
    mediumClue: 'Spiraling funnel that pulls everything toward its center',
    hardClue: 'Whirlpool overtakes X at the center (6)',
    crypticBreakdown: 'Anagram of OVERT + X -> VORTEX; definition: "Whirlpool".',
    etymologyOrContext: 'Plural vortices; occurs in tornadoes, whirlpools, and aircraft wingtips.',
    defaultIsCryptic: false,
  },
  {
    answer: 'HORIZON',
    easyClue: 'Line in the distance where the Earth or sea seems to meet the sky',
    mediumClue: 'Boundary line that retreats as fast as you sail toward it',
    hardClue: 'Skyline where rhino zoinks around (7)',
    crypticBreakdown: 'Anagram of RHINO + ZO -> HORIZON; definition: "Skyline".',
    etymologyOrContext: 'From Greek horizon kyklos, meaning "separating circle".',
    defaultIsCryptic: false,
  },
  {
    answer: 'AURORA',
    easyClue: 'Glowing green and violet curtains of light in polar night skies',
    mediumClue: 'Dawn goddess painting the Arctic sky with solar wind',
    hardClue: 'Northern lights roar around gold (6)',
    crypticBreakdown: 'AU (gold) + RORA (roar around) -> AURORA; definition: "Northern lights".',
    etymologyOrContext: 'Named after the Roman goddess of the dawn.',
    defaultIsCryptic: true,
  },
  {
    answer: 'COSMOS',
    easyClue: 'The entire universe regarded as an orderly system',
    mediumClue: 'Greek word for order that shares its name with both space and a flower',
    hardClue: 'Orderly universe moss company overturned (6)',
    crypticBreakdown: 'CO (company) + SMOS (moss overturned) -> COSMOS; definition: "Orderly universe".',
    etymologyOrContext: 'Antonym of chaos in ancient Greek philosophy.',
    defaultIsCryptic: false,
  },
  {
    answer: 'ETHER',
    easyClue: 'Clear upper air beyond the clouds; early anesthetic liquid',
    mediumClue: 'Invisible medium once thought to carry light waves through space',
    hardClue: 'Upper air there swirling about (5)',
    crypticBreakdown: 'Anagram ("swirling about") of THERE -> ETHER; definition: "Upper air".',
    etymologyOrContext: 'Once hypothesized as the "luminiferous aether" carrying light waves.',
    defaultIsCryptic: true,
  },
  {
    answer: 'LUNAR',
    easyClue: 'Relating to the Moon',
    mediumClue: 'Kind of module, eclipse, or calendar tied to Earth’s night lantern',
    hardClue: 'Moon-related ulnar bone twisted (5)',
    crypticBreakdown: 'Anagram ("twisted") of ULNAR -> LUNAR; definition: "Moon-related".',
    etymologyOrContext: 'From Latin luna (the Moon).',
    defaultIsCryptic: true,
  },
  {
    answer: 'SOLAR',
    easyClue: 'Relating to or powered by the Sun',
    mediumClue: 'Daytime energy source collected by rooftop panels',
    hardClue: 'Sun-powered oral speech starts with S (5)',
    crypticBreakdown: 'S + ORAL -> SOLAR; definition: "Sun-powered".',
    etymologyOrContext: 'From Latin sol (Sun).',
    defaultIsCryptic: false,
  },
  {
    answer: 'ASTRA',
    easyClue: 'Latin word for the stars, used in "per ardua ad ___"',
    mediumClue: 'Starry destination reached through motto hardships',
    hardClue: 'Stars seen in fast racing cars (5)',
    crypticBreakdown: 'Hidden word ("seen in") fAST RAcing -> ASTRA; definition: "Stars".',
    etymologyOrContext: 'Ad astra per aspera: "To the stars through hardships".',
    defaultIsCryptic: true,
  },
  {
    answer: 'EPOCH',
    easyClue: 'Long and notable period of history or geological time',
    mediumClue: 'Milestone era that sets the clock for astronomers and geologists',
    hardClue: 'Era of hope around century’s start (5)',
    crypticBreakdown: 'Anagram of HOPE + C (century’s start) -> EPOCH; definition: "Era".',
    etymologyOrContext: 'Standard astronomical catalogs currently use the J2000.0 epoch.',
    defaultIsCryptic: true,
  },
  {
    answer: 'PHASE',
    easyClue: 'Distinct stage in a process, or the changing shape of the lit Moon',
    mediumClue: 'Waxing crescent or waning gibbous stage',
    hardClue: 'Stage shapes without the last letter (5)',
    crypticBreakdown: 'Anagram of SHAPE(s) -> PHASE; definition: "Stage".',
    etymologyOrContext: 'Lunar phases cycle every 29.53 days (a synodic month).',
    defaultIsCryptic: false,
  },
  {
    answer: 'ARENA',
    easyClue: 'Enclosed stadium or circular stage for sports and concerts',
    mediumClue: 'Gladiator’s sandy floor that became a modern concert bowl',
    hardClue: 'Stadium near a crossroads (5)',
    crypticBreakdown: 'Anagram of NEAR A -> ARENA; definition: "Stadium".',
    etymologyOrContext: 'Latin harena, meaning "fine sand" strewn on amphitheater floors.',
    defaultIsCryptic: true,
  },
  {
    answer: 'OPERA',
    easyClue: 'Theatrical drama sung entirely to orchestral accompaniment',
    mediumClue: 'Grand stage production where divas hit high C',
    hardClue: 'Musical drama a pear cooked up (5)',
    crypticBreakdown: 'Anagram ("cooked up") of A PEAR / O + PEAR -> OPERA; definition: "Musical drama".',
    etymologyOrContext: 'Italian plural of opus ("work").',
    defaultIsCryptic: true,
  },
  {
    answer: 'REALM',
    easyClue: 'Royal kingdom or domain of expertise',
    mediumClue: 'Monarch’s territory or a sphere of imagination',
    hardClue: 'Kingdom armigerous leader leaves alarm (5)',
    crypticBreakdown: 'Anagram of ALARM with E replacing A -> REALM; definition: "Kingdom".',
    etymologyOrContext: 'From Old French reaume and Latin regimen.',
    defaultIsCryptic: false,
  },
  {
    answer: 'CREST',
    easyClue: 'Top ridge of a mountain, breaking wave, or bird’s head feathers',
    mediumClue: 'Foamy peak of a wave or emblem atop a knight’s helm',
    hardClue: 'Peak certs sorted out (5)',
    crypticBreakdown: 'Anagram ("sorted out") of CERTS -> CREST; definition: "Peak".',
    etymologyOrContext: 'From Latin crista ("tuft" or "plume").',
    defaultIsCryptic: true,
  },
  {
    answer: 'TRACE',
    easyClue: 'Very small amount, or to copy a drawing through thin paper',
    mediumClue: 'Follow footsteps back to the source or leave a faint mark',
    hardClue: 'Track down crate in transit (5)',
    crypticBreakdown: 'Anagram ("in transit") of CRATE -> TRACE; definition: "Track down".',
    etymologyOrContext: 'Also means a minute and barely detectable amount.',
    defaultIsCryptic: true,
  },
  {
    answer: 'SCALE',
    easyClue: 'Instrument for weighing, or a series of musical notes',
    mediumClue: 'Climber’s verb, fish’s armor, and pianist’s warmup all in one',
    hardClue: 'Measure laces untied (5)',
    crypticBreakdown: 'Anagram ("untied") of LACES -> SCALE; definition: "Measure".',
    etymologyOrContext: 'From Latin scala ("ladder").',
    defaultIsCryptic: true,
  },
  {
    answer: 'PRISM',
    easyClue: 'Triangular glass block that splits white light into a rainbow',
    mediumClue: 'Optical crystal with an angled perspective on light',
    hardClue: 'Glass wedge prims and proper (5)',
    crypticBreakdown: 'Anagram of PRIMS -> PRISM; definition: "Glass wedge".',
    etymologyOrContext: 'Disperses white light into its constituent spectral colors.',
    defaultIsCryptic: false,
  },
  {
    answer: 'LASER',
    easyClue: 'Device that produces an intense, narrow beam of single-color light',
    mediumClue: 'Focused beam born as an acronym for light amplification',
    hardClue: 'Focused beam earls danced around (5)',
    crypticBreakdown: 'Anagram ("danced around") of EARLS -> LASER; definition: "Focused beam".',
    etymologyOrContext: 'Acronym for Light Amplification by Stimulated Emission of Radiation.',
    defaultIsCryptic: true,
  },
  {
    answer: 'DELTA',
    easyClue: 'Triangular area of marshland where a river splits before entering the sea',
    mediumClue: 'Fourth Greek letter shaped like a river’s fan-out mouth',
    hardClue: 'River mouth dealt a new hand (5)',
    crypticBreakdown: 'Anagram ("a new hand") of DEALT -> DELTA; definition: "River mouth".',
    etymologyOrContext: 'Named after the triangular uppercase Greek letter Δ.',
    defaultIsCryptic: true,
  },
  {
    answer: 'FLORA',
    easyClue: 'All the plant life native to a particular region or era',
    mediumClue: 'Botanical counterpart to fauna',
    hardClue: 'Plant life for alchemists initially (5)',
    crypticBreakdown: 'Anagram of FOR AL(chemists) -> FLORA; definition: "Plant life".',
    etymologyOrContext: 'Roman goddess of flowers and the season of spring.',
    defaultIsCryptic: false,
  },
  {
    answer: 'CORAL',
    easyClue: 'Hard colorful marine organism that builds tropical reefs',
    mediumClue: 'Pinkish-orange shade named after an underwater reef architect',
    hardClue: 'Reef builder carol sung out of tune (5)',
    crypticBreakdown: 'Anagram ("sung out of tune") of CAROL -> CORAL; definition: "Reef builder".',
    etymologyOrContext: 'Secretes calcium carbonate to form a hard skeleton.',
    defaultIsCryptic: true,
  },
  {
    answer: 'SPORE',
    easyClue: 'Microscopic reproductive cell of a fern, mushroom, or moss',
    mediumClue: 'Seedless traveler carried on the wind for ferns and fungi',
    hardClue: 'Fern seed ropes untangled (5)',
    crypticBreakdown: 'Anagram ("untangled") of ROPES -> SPORE; definition: "Fern seed".',
    etymologyOrContext: 'From Greek spora, meaning "seed" or "sowing".',
    defaultIsCryptic: true,
  },
  {
    answer: 'PETAL',
    easyClue: 'Single colored leaf-like segment of a blooming flower',
    mediumClue: 'Rose segment plucked in "he loves me, he loves me not"',
    hardClue: 'Flower part plate spun around (5)',
    crypticBreakdown: 'Anagram ("spun around") of PLATE -> PETAL; definition: "Flower part".',
    etymologyOrContext: 'Collectively, all petals of a flower are called the corolla.',
    defaultIsCryptic: true,
  },
  {
    answer: 'BIOME',
    easyClue: 'Large natural ecosystem type such as rainforest, desert, or tundra',
    mediumClue: 'Major ecological neighborhood defined by climate and life',
    hardClue: 'Ecological region where mob ie gathers (5)',
    crypticBreakdown: 'Anagram of MOB IE -> BIOME; definition: "Ecological region".',
    etymologyOrContext: 'Includes tundra, taiga, temperate forest, savannah, and desert.',
    defaultIsCryptic: false,
  },
  {
    answer: 'GROVE',
    easyClue: 'Small group of trees or orchard growing closely together',
    mediumClue: 'Shady cluster of olive or orange trees without heavy undergrowth',
    hardClue: 'Orchard where rover loses right and gains g (5)',
    crypticBreakdown: 'G + ROVE (wander) -> GROVE; definition: "Orchard".',
    etymologyOrContext: 'Often consists of cultivated fruit or nut trees.',
    defaultIsCryptic: false,
  },
  {
    answer: 'CEDAR',
    easyClue: 'Evergreen conifer tree prized for its fragrant, moth-repelling wood',
    mediumClue: 'Aromatic timber depicted on the flag of Lebanon',
    hardClue: 'Fragrant wood cared deeply about (5)',
    crypticBreakdown: 'Anagram ("deeply about") of CARED -> CEDAR; definition: "Fragrant wood".',
    etymologyOrContext: 'True cedars (genus Cedrus) are native to the Mediterranean and Himalayas.',
    defaultIsCryptic: true,
  },
  {
    answer: 'MAPLE',
    easyClue: 'Broadleaf tree tapped in early spring for sweet syrup',
    mediumClue: 'Autumn blaze tree whose leaf graces Canada’s emblem',
    hardClue: 'Syrup tree ample in size (5)',
    crypticBreakdown: 'Anagram ("in size") of AMPLE -> MAPLE; definition: "Syrup tree".',
    etymologyOrContext: 'Genus Acer; the sugar maple leaf is the national symbol of Canada.',
    defaultIsCryptic: true,
  },
  {
    answer: 'ASPEN',
    easyClue: 'Mountain poplar tree whose leaves flutter in the slightest breeze',
    mediumClue: 'Quaking white-barked tree that shares its name with a Colorado ski resort',
    hardClue: 'Quaking tree panes broken (5)',
    crypticBreakdown: 'Anagram ("broken") of PANES -> ASPEN; definition: "Quaking tree".',
    etymologyOrContext: 'Pando, a clonal colony of quaking aspen in Utah, is one of the oldest living organisms.',
    defaultIsCryptic: true,
  },
  {
    answer: 'LOTUS',
    easyClue: 'Sacred water lily that blooms cleanly above muddy ponds',
    mediumClue: 'Yoga posture and serene aquatic blossom in one',
    hardClue: 'Water lily louts cast out (5)',
    crypticBreakdown: 'Anagram ("out") of LOUTS -> LOTUS; definition: "Water lily".',
    etymologyOrContext: 'Nelumbo nucifera; its seeds can remain viable for over a thousand years.',
    defaultIsCryptic: true,
  },
  {
    answer: 'ALGAE',
    easyClue: 'Simple aquatic organisms ranging from pond scum to giant kelp',
    mediumClue: 'Rootless water greenery that makes most of Earth’s oxygen',
    hardClue: 'Seaweed gale blows around a (5)',
    crypticBreakdown: 'A + GALE rearranged -> ALGAE; definition: "Seaweed".',
    etymologyOrContext: 'Produce more than half of the Earth’s atmospheric oxygen.',
    defaultIsCryptic: false,
  },
  {
    answer: 'OASIS',
    easyClue: 'Green fertile spot in a desert where underground water reaches the surface',
    mediumClue: 'Palm-ringed refuge for a thirsty caravan',
    hardClue: 'Desert haven so as I step inside (5)',
    crypticBreakdown: 'Anagram of SO AS I -> OASIS; definition: "Desert haven".',
    etymologyOrContext: 'Sustained by underground aquifers or artesian springs.',
    defaultIsCryptic: false,
  },
  {
    answer: 'RIVER',
    easyClue: 'Large natural stream of water flowing in a channel to the sea',
    mediumClue: 'Winding water highway that has a bed and a mouth but never sleeps',
    hardClue: 'Stream split by right at the bank (5)',
    crypticBreakdown: 'RIVE (split) + R (right) -> RIVER; definition: "Stream".',
    etymologyOrContext: 'From Latin riparia ("of a riverbank").',
    defaultIsCryptic: false,
  },
  {
    answer: 'OCEAN',
    easyClue: 'Vast body of salt water covering most of the globe',
    mediumClue: 'Pacific, Atlantic, Indian, Arctic, or Southern expanse',
    hardClue: 'Vast sea canoe capsized in storm (5)',
    crypticBreakdown: 'Anagram ("capsized") of CANOE -> OCEAN; definition: "Vast sea".',
    etymologyOrContext: 'From Greek Okeanos, the Titan river encircling the world.',
    defaultIsCryptic: true,
  },
  {
    answer: 'GLACIER',
    easyClue: 'Huge, slow-moving mass of compacted snow and ice in mountains or poles',
    mediumClue: 'Frozen bulldozer that carves U-shaped valleys over millennia',
    hardClue: 'River of ice garlic with e mixed in (7)',
    crypticBreakdown: 'Anagram ("mixed in") of GARLIC + E -> GLACIER; definition: "River of ice".',
    etymologyOrContext: 'Stores roughly 69% of the world’s freshwater.',
    defaultIsCryptic: true,
  },
  {
    answer: 'ESTUARY',
    easyClue: 'Wide tidal mouth of a large river where fresh water mixes with sea water',
    mediumClue: 'Brackish meeting place where river currents greet ocean tides',
    hardClue: 'Tidal mouth where a surety is renegotiated (7)',
    crypticBreakdown: 'Anagram ("is renegotiated") of A SURETY -> ESTUARY; definition: "Tidal mouth".',
    etymologyOrContext: 'From Latin aestuarium ("tidal marsh, mudflat").',
    defaultIsCryptic: true,
  },
  {
    answer: 'SAVANNA',
    easyClue: 'Grassy tropical plain with scattered drought-resistant trees',
    mediumClue: 'Serengeti landscape of golden grass and umbrella acacias',
    hardClue: 'Tropical grassland vans and a van truncated (7)',
    crypticBreakdown: 'Wordplay on SAVAN + NA; definition: "Tropical grassland".',
    etymologyOrContext: 'Covers roughly 20% of the Earth’s land area.',
    defaultIsCryptic: false,
  },
  {
    answer: 'MONSOON',
    easyClue: 'Seasonal wind in South Asia bringing heavy summer rains',
    mediumClue: 'Weather reversal that turns parched plains into lush green',
    hardClue: 'Rainy season soon follows French my (7)',
    crypticBreakdown: 'Charade of MON ("French my") + SOON -> MONSOON; definition: "Rainy season".',
    etymologyOrContext: 'From Arabic mawsim ("season").',
    defaultIsCryptic: true,
  },
  {
    answer: 'ECOLOGY',
    easyClue: 'Scientific study of how living things interact with their environment',
    mediumClue: 'Nature’s household economics of food webs and habitats',
    hardClue: 'Environmental study cool guy drops u for e (7)',
    crypticBreakdown: 'Anagram of COOL GY + E -> ECOLOGY; definition: "Environmental study".',
    etymologyOrContext: 'Coined by German zoologist Ernst Haeckel in 1866.',
    defaultIsCryptic: false,
  },
  {
    answer: 'HABITAT',
    easyClue: 'The natural home or environment of a plant or animal',
    mediumClue: 'Home address in the wild for a species',
    hardClue: 'Natural home where a bit sits in hat (7)',
    crypticBreakdown: 'Insertion of A BIT inside HAT -> HABITAT; definition: "Natural home".',
    etymologyOrContext: 'Latin for "it inhabits".',
    defaultIsCryptic: true,
  },
  {
    answer: 'SPECIES',
    easyClue: 'Group of similar living organisms able to interbreed in nature',
    mediumClue: 'Bottom rung on the biological ladder below genus',
    hardClue: 'Biological group pieces together after start of spring (7)',
    crypticBreakdown: 'S (start of spring) + PIECES rearranged -> SPECIES; definition: "Biological group".',
    etymologyOrContext: 'Latin for "kind" or "appearance".',
    defaultIsCryptic: true,
  },
  {
    answer: 'CANOPY',
    easyClue: 'High leafy roof formed by the tops of rainforest trees',
    mediumClue: 'Sunlit penthouse level of a dense woodland',
    hardClue: 'Forest roof pony gallops after can (6)',
    crypticBreakdown: 'CAN + OPY (pony without n) -> CANOPY; definition: "Forest roof".',
    etymologyOrContext: 'Hosts the majority of biodiversity in tropical rainforests.',
    defaultIsCryptic: false,
  },
  {
    answer: 'POLLEN',
    easyClue: 'Fine yellow powder produced by flowers and carried by bees',
    mediumClue: 'Floral gold dust that keeps honeybees busy and noses sneezing',
    hardClue: 'Flower dust found in open valley (6)',
    crypticBreakdown: 'POLL + EN -> POLLEN; definition: "Flower dust".',
    etymologyOrContext: 'Each grain contains male gametophytes of seed plants.',
    defaultIsCryptic: false,
  },
  {
    answer: 'NECTAR',
    easyClue: 'Sweet liquid inside flowers that attracts hummingbirds and bees',
    mediumClue: 'Raw ingredient for honey and the mythic drink of Olympus',
    hardClue: 'Sweet flower drink trance broken (6)',
    crypticBreakdown: 'Anagram ("broken") of TRANCE -> NECTAR; definition: "Sweet flower drink".',
    etymologyOrContext: 'In Greek mythology, the drink of the Olympian gods.',
    defaultIsCryptic: true,
  },
  {
    answer: 'LICHEN',
    easyClue: 'Crusty or leafy growth on rocks and bark formed by fungus and algae',
    mediumClue: 'Two organisms living as one on a mossy boulder',
    hardClue: 'Moss-like growth niche around left (6)',
    crypticBreakdown: 'L (left) + NICHE rearranged -> LICHEN; definition: "Moss-like growth".',
    etymologyOrContext: 'Classic textbook example of mutualistic symbiosis.',
    defaultIsCryptic: true,
  },
  {
    answer: 'TUNDRA',
    easyClue: 'Treeless Arctic plain with permanently frozen subsoil',
    mediumClue: 'Far-north landscape where permafrost stops deep roots',
    hardClue: 'Frozen plain turn ad around (6)',
    crypticBreakdown: 'Anagram of TURN AD -> TUNDRA; definition: "Frozen plain".',
    etymologyOrContext: 'From Kildin Sami tundar, meaning "uplands" or "treeless mountain tract".',
    defaultIsCryptic: true,
  },
  {
    answer: 'MEADOW',
    easyClue: 'Open field of grass and wildflowers',
    mediumClue: 'Pastoral expanse buzzing with butterflies in June',
    hardClue: 'Grassy field made ow! when stepped on (6)',
    crypticBreakdown: 'Anagram of MADE + OW -> MEADOW; definition: "Grassy field".',
    etymologyOrContext: 'Crucial habitat for pollinators and ground-nesting birds.',
    defaultIsCryptic: true,
  },
  {
    answer: 'SONNET',
    easyClue: 'Poem of exactly fourteen lines with a formal rhyme scheme',
    mediumClue: 'Poetic form Shakespeare penned 154 times',
    hardClue: 'Fourteen-line poem tenons joints together (6)',
    crypticBreakdown: 'Anagram ("joints together") of TENONS -> SONNET; definition: "Fourteen-line poem".',
    etymologyOrContext: 'From Italian sonetto ("little song"), mastered by Petrarch and Shakespeare.',
    defaultIsCryptic: true,
  },
  {
    answer: 'STANZA',
    easyClue: 'Grouped set of lines in a poem separated by a space',
    mediumClue: 'Poetic paragraph whose Italian name means "room"',
    hardClue: 'Verse division Santa’s zany start (6)',
    crypticBreakdown: 'Anagram of SANTA + Z -> STANZA; definition: "Verse division".',
    etymologyOrContext: 'Italian for "stopping place" or "room".',
    defaultIsCryptic: false,
  },
  {
    answer: 'BALLAD',
    easyClue: 'Slow, sentimental song or poem that tells a dramatic story',
    mediumClue: 'Storytelling folk verse meant to be sung aloud',
    hardClue: 'Narrative song all bad in rehearsal (6)',
    crypticBreakdown: 'Anagram ("in rehearsal") of ALL BAD -> BALLAD; definition: "Narrative song".',
    etymologyOrContext: 'Derived from medieval French chanson balladee ("dancing song").',
    defaultIsCryptic: true,
  },
  {
    answer: 'SATIRE',
    easyClue: 'Writing that uses humor and exaggeration to criticize foolishness',
    mediumClue: 'Sharp-witted literary mirror held up to society’s vices',
    hardClue: 'Witty critique irates the establishment (6)',
    crypticBreakdown: 'Anagram ("the establishment") of IRATES -> SATIRE; definition: "Witty critique".',
    etymologyOrContext: 'Practiced by Juvenal, Horace, Jonathan Swift, and Voltaire.',
    defaultIsCryptic: true,
  },
  {
    answer: 'MEMOIR',
    easyClue: 'Book in which an author writes about their own life memories',
    mediumClue: 'First-person look back at chapters of one’s own life',
    hardClue: 'Personal account mime or actor recalls (6)',
    crypticBreakdown: 'Anagram ("recalls") of MIME OR -> MEMOIR; definition: "Personal account".',
    etymologyOrContext: 'From French memoire ("memory" or "reminiscence").',
    defaultIsCryptic: true,
  },
  {
    answer: 'LEGEND',
    easyClue: 'Famous traditional story from the past, or the key on a map',
    mediumClue: 'King Arthur’s lore—or the box that explains map symbols',
    hardClue: 'Mythical tale glen surrounded by ed (6)',
    crypticBreakdown: 'Anagram of GLEN + ED -> LEGEND; definition: "Mythical tale".',
    etymologyOrContext: 'Also refers to the explanatory key on a map or chart.',
    defaultIsCryptic: false,
  },
  {
    answer: 'ORACLE',
    easyClue: 'Ancient priestess or shrine consulted for prophecies of the future',
    mediumClue: 'Delphi voice famous for riddles that always came true',
    hardClue: 'Prophet coaler recasts in temple (6)',
    crypticBreakdown: 'Anagram ("recasts") of COALER -> ORACLE; definition: "Prophet".',
    etymologyOrContext: 'The most famous in antiquity was the Pythia at Delphi.',
    defaultIsCryptic: true,
  },
  {
    answer: 'ENIGMA',
    easyClue: 'Something mysterious, puzzling, and hard to explain',
    mediumClue: 'Baffling riddle—or the cipher machine cracked at Bletchley Park',
    hardClue: 'Mystery gamine dances in the dark (6)',
    crypticBreakdown: 'Anagram ("dances") of GAMINE -> ENIGMA; definition: "Mystery".',
    etymologyOrContext: 'From Greek ainigma ("to speak in riddles").',
    defaultIsCryptic: true,
  },
  {
    answer: 'CYPHER',
    easyClue: 'Secret code used to disguise a written message',
    mediumClue: 'Cryptographic puzzle that turns plain text into secret symbols',
    hardClue: 'Secret code hype inside credit return (6)',
    crypticBreakdown: 'Insertion of YPHE inside C R -> CYPHER; definition: "Secret code".',
    etymologyOrContext: 'From Arabic sifr ("zero" or "empty").',
    defaultIsCryptic: false,
  },
  {
    answer: 'SCROLL',
    easyClue: 'Roll of parchment or papyrus used for writing in ancient times',
    mediumClue: 'Ancient rolled manuscript—or what your thumb does on a webpage',
    hardClue: 'Ancient manuscript rolls around century’s start (6)',
    crypticBreakdown: 'C (century’s start) inside ROLLS rearranged -> SCROLL; definition: "Ancient manuscript".',
    etymologyOrContext: 'Used extensively across ancient Egypt, Greece, Rome, and the Near East.',
    defaultIsCryptic: true,
  },
  {
    answer: 'SCRIBE',
    easyClue: 'Person who copied manuscripts by hand before printing was invented',
    mediumClue: 'Quill-and-ink professional of the ancient scriptorium',
    hardClue: 'Ancient writer bribes without b, adding sc (6)',
    crypticBreakdown: 'SC + RIBE -> SCRIBE; definition: "Ancient writer".',
    etymologyOrContext: 'From Latin scribere ("to write").',
    defaultIsCryptic: false,
  },
  {
    answer: 'ANNALS',
    easyClue: 'Historical records of events written down year by year',
    mediumClue: 'Year-by-year chronicles kept in the monastery library',
    hardClue: 'Chronicles where Anna’s losses end in l (6)',
    crypticBreakdown: 'ANNA + L + S -> ANNALS; definition: "Chronicles".',
    etymologyOrContext: 'From Latin libri annales ("yearly books").',
    defaultIsCryptic: false,
  },
  {
    answer: 'NOVEL',
    easyClue: 'Long book of fictional story and characters',
    mediumClue: 'Bookstore staple whose adjective meaning is "brand new"',
    hardClue: 'New book found in Clovelly (5)',
    crypticBreakdown: 'Hidden word ("found in") ClOVELly -> NOVEL; definition: "New book".',
    etymologyOrContext: 'From Italian novella ("new story").',
    defaultIsCryptic: false,
  },
  {
    answer: 'PROSE',
    easyClue: 'Ordinary written language in sentences and paragraphs, not poetry',
    mediumClue: 'Everyday writing style that doesn’t worry about rhyme or meter',
    hardClue: 'Ordinary writing pores over every letter (5)',
    crypticBreakdown: 'Anagram ("over every letter") of PORES -> PROSE; definition: "Ordinary writing".',
    etymologyOrContext: 'From Latin prosa oratio ("straightforward discourse").',
    defaultIsCryptic: true,
  },
  {
    answer: 'VERSE',
    easyClue: 'Writing arranged with rhythm and often rhyme; poetry',
    mediumClue: 'What comes between the chorus in a song or a chapter in scripture',
    hardClue: 'Poetic lines serve up a twist (5)',
    crypticBreakdown: 'Anagram ("up a twist") of SERVE -> VERSE; definition: "Poetic lines".',
    etymologyOrContext: 'From Latin versus ("a turn of the plow, a line of writing").',
    defaultIsCryptic: true,
  },
  {
    answer: 'DRAMA',
    easyClue: 'Serious play written for performance in a theater',
    mediumClue: 'Stage genre represented by the weeping theatrical mask',
    hardClue: 'Stage play mar a d backwards (5)',
    crypticBreakdown: 'Reversal of A MARD -> DRAMA; definition: "Stage play".',
    etymologyOrContext: 'From Greek drama ("action, deed").',
    defaultIsCryptic: false,
  },
  {
    answer: 'FABLE',
    easyClue: 'Short story with talking animals that teaches a moral lesson',
    mediumClue: 'Aesop’s specialty featuring tortoises, hares, and sour grapes',
    hardClue: 'Moral tale flab with e rearranged (5)',
    crypticBreakdown: 'Anagram ("rearranged") of FLAB + E -> FABLE; definition: "Moral tale".',
    etymologyOrContext: 'Associated globally with Aesop in ancient Greece.',
    defaultIsCryptic: false,
  },
  {
    answer: 'ELEGY',
    easyClue: 'Reflective poem written to mourn someone who has died',
    mediumClue: 'Poetic tribute of sorrow and remembrance',
    hardClue: 'Mournful poem glee mixed with y (5)',
    crypticBreakdown: 'Anagram ("mixed") of GLEE + Y -> ELEGY; definition: "Mournful poem".',
    etymologyOrContext: 'Notable examples include Thomas Gray’s "Elegy Written in a Country Churchyard".',
    defaultIsCryptic: true,
  },
  {
    answer: 'INDEX',
    easyClue: 'Alphabetical list of topics and page numbers at the back of a book',
    mediumClue: 'Back-of-the-book pointer that shares its name with your pointing finger',
    hardClue: 'Pointer nixes d inside (5)',
    crypticBreakdown: 'Anagram of NIXED -> INDEX; definition: "Pointer".',
    etymologyOrContext: 'Latin for "forefinger, pointer, or sign".',
    defaultIsCryptic: true,
  },
  {
    answer: 'CANON',
    easyClue: 'Collection of literary works considered the most important of an era',
    mediumClue: 'Accepted classics list—or Pachelbel’s famous overlapping melody',
    hardClue: 'Accepted rule can go on without g, o (5)',
    crypticBreakdown: 'CAN + ON -> CANON; definition: "Accepted rule".',
    etymologyOrContext: 'Also a contrapuntal musical composition employing melody imitations.',
    defaultIsCryptic: false,
  },
  {
    answer: 'TROPE',
    easyClue: 'Commonly recurring literary theme, device, or figure of speech',
    mediumClue: 'Storytelling convention like "the chosen one" or "enemies to lovers"',
    hardClue: 'Literary motif repot backwards! (5)',
    crypticBreakdown: 'Anagram ("backwards") of REPOT -> TROPE; definition: "Literary motif".',
    etymologyOrContext: 'From Greek tropos ("turn, direction, way").',
    defaultIsCryptic: true,
  },
  {
    answer: 'IRONY',
    easyClue: 'Saying the opposite of what you mean for humorous or sharp effect',
    mediumClue: 'When a fire station burns down or rain falls on your wedding day',
    hardClue: 'Wry twist in metallic taste (5)',
    crypticBreakdown: 'Double definition: "Wry twist" and "metallic (iron-y) taste" -> IRONY.',
    etymologyOrContext: 'From Greek eironeia ("feigned ignorance").',
    defaultIsCryptic: true,
  },
  {
    answer: 'COMPASS',
    easyClue: 'Dial with a magnetic needle that always points north',
    mediumClue: 'Pocket instrument that never loses its bearings',
    hardClue: 'Navigator’s guide pass com around (7)',
    crypticBreakdown: 'COM + PASS -> COMPASS; definition: "Navigator’s guide".',
    etymologyOrContext: 'First used for navigation during the Song Dynasty in China.',
    defaultIsCryptic: false,
  },
  {
    answer: 'SEXTANT',
    easyClue: 'Brass instrument used by sailors to measure the angle of the sun and stars',
    mediumClue: 'Sixty-degree arc tool for finding latitude on the high seas',
    hardClue: 'Navigator’s tool text ans rewritten (7)',
    crypticBreakdown: 'Anagram ("rewritten") of TEXT ANS -> SEXTANT; definition: "Navigator’s tool".',
    etymologyOrContext: 'Arc spans 60 degrees, or one-sixth of a full circle.',
    defaultIsCryptic: true,
  },
  {
    answer: 'MARINER',
    easyClue: 'Sailor or seafarer who navigates the ocean',
    mediumClue: 'Coleridge’s ancient storyteller with an albatross problem',
    hardClue: 'Sailor airmen recruited with r (7)',
    crypticBreakdown: 'Anagram ("recruited") of AIRMEN + R -> MARINER; definition: "Sailor".',
    etymologyOrContext: 'Immortalized in Samuel Taylor Coleridge’s "The Rime of the Ancient Mariner".',
    defaultIsCryptic: true,
  },
  {
    answer: 'GALLEON',
    easyClue: 'Large multi-decked wooden sailing ship of the 16th and 17th centuries',
    mediumClue: 'Square-rigged treasure ship of the Spanish Main',
    hardClue: 'Treasure ship all gone adrift (7)',
    crypticBreakdown: 'Anagram ("adrift") of ALL GONE -> GALLEON; definition: "Treasure ship".',
    etymologyOrContext: 'Evolved from the carrack and served as both warship and cargo vessel.',
    defaultIsCryptic: true,
  },
  {
    answer: 'HARBOR',
    easyClue: 'Sheltered coastal port where ships dock safely out of the waves',
    mediumClue: 'Safe port in a storm—or to secretly hold a thought',
    hardClue: 'Safe port arbor behind hotel (6)',
    crypticBreakdown: 'H (hotel) + ARBOR -> HARBOR; definition: "Safe port".',
    etymologyOrContext: 'Can be natural (land-sheltered) or artificial (built with breakwaters).',
    defaultIsCryptic: true,
  },
  {
    answer: 'ANCHOR',
    easyClue: 'Heavy hooked iron weight dropped on a chain to hold a ship in place',
    mediumClue: 'Seabed grip for a captain, or the lead broadcaster on the evening news',
    hardClue: 'Secure mooring rancho rebuilt (6)',
    crypticBreakdown: 'Anagram ("rebuilt") of RANCHO -> ANCHOR; definition: "Secure mooring".',
    etymologyOrContext: 'From Greek ankyra.',
    defaultIsCryptic: true,
  },
  {
    answer: 'BEACON',
    easyClue: 'Bright warning light or signal fire on a hill or coast',
    mediumClue: 'Lighthouse beam that tells captains where the rocks are',
    hardClue: 'Guiding light bacon cooked with e (6)',
    crypticBreakdown: 'Anagram ("cooked") of BACON + E -> BEACON; definition: "Guiding light".',
    etymologyOrContext: 'Includes lighthouses, radio beacons, and radar transponders.',
    defaultIsCryptic: true,
  },
  {
    answer: 'VOYAGE',
    easyClue: 'Long journey across the ocean or through outer space',
    mediumClue: 'Epic expedition preceded by "bon" at the dock',
    hardClue: 'Sea journey gave yo in return (6)',
    crypticBreakdown: 'Anagram of GAVE YO -> VOYAGE; definition: "Sea journey".',
    etymologyOrContext: 'From Latin viaticum ("provisions for a journey").',
    defaultIsCryptic: false,
  },
  {
    answer: 'ISLAND',
    easyClue: 'Piece of land completely surrounded by water',
    mediumClue: 'What John Donne famously said no man is',
    hardClue: 'Piece of land is land indeed! (6)',
    crypticBreakdown: 'Charade of IS + LAND -> ISLAND; definition: "Piece of land".',
    etymologyOrContext: 'Greenland is the world’s largest non-continental island.',
    defaultIsCryptic: true,
  },
  {
    answer: 'STRAIT',
    easyClue: 'Narrow channel of sea connecting two larger bodies of water',
    mediumClue: 'Waterway bottleneck like Gibraltar, Hormuz, or Magellan',
    hardClue: 'Narrow channel artist painted anew (6)',
    crypticBreakdown: 'Anagram ("painted anew") of ARTIST -> STRAIT; definition: "Narrow channel".',
    etymologyOrContext: 'Examples include the Strait of Gibraltar and the Bering Strait.',
    defaultIsCryptic: true,
  },
  {
    answer: 'LAGOON',
    easyClue: 'Calm, shallow bay separated from the open sea by a coral reef or sandbar',
    mediumClue: 'Turquoise tropical pool sheltered behind an atoll ring',
    hardClue: 'Shallow bay go on after la (6)',
    crypticBreakdown: 'Charade of LA + GO ON -> LAGOON; definition: "Shallow bay".',
    etymologyOrContext: 'From Italian laguna, originally referring to the Lagoon of Venice.',
    defaultIsCryptic: true,
  },
  {
    answer: 'VESSEL',
    easyClue: 'Large boat or ship, or a hollow pitcher for holding liquids',
    mediumClue: 'Word that applies equally to a tall ship, a wine goblet, or a vein',
    hardClue: 'Craft elves’s spun around (6)',
    crypticBreakdown: 'Anagram ("spun around") of ELVES S -> VESSEL; definition: "Craft".',
    etymologyOrContext: 'From Late Latin vascellum ("small vase or urn").',
    defaultIsCryptic: false,
  },
  {
    answer: 'STERN',
    easyClue: 'Rear end of a ship or boat',
    mediumClue: 'Strict and unsmiling—or the aft end opposite the bow',
    hardClue: 'Strict rear of a vessel (5)',
    crypticBreakdown: 'Double definition: "Strict" and "rear of a vessel" -> STERN.',
    etymologyOrContext: 'Opposite of the bow (prow).',
    defaultIsCryptic: true,
  },
  {
    answer: 'CHART',
    easyClue: 'Detailed map of the sea used by ship navigators',
    mediumClue: 'Captain’s map of depths and reefs—or a hit parade ranking',
    hardClue: 'Navigator’s map march art without ma (5)',
    crypticBreakdown: 'CH + ART -> CHART; definition: "Navigator’s map".',
    etymologyOrContext: 'Shows water depths, hazards, and aids to navigation.',
    defaultIsCryptic: false,
  },
  {
    answer: 'SHOAL',
    easyClue: 'Shallow sandbank hidden just beneath the water’s surface',
    mediumClue: 'Submerged sandbar hazard—or a shimmering crowd of fish',
    hardClue: 'Shallow sandbank halos rearranged (5)',
    crypticBreakdown: 'Anagram ("rearranged") of HALOS -> SHOAL; definition: "Shallow sandbank".',
    etymologyOrContext: 'Also refers to a large group of fish swimming together.',
    defaultIsCryptic: true,
  },
  {
    answer: 'FLEET',
    easyClue: 'Group of naval ships sailing together under one command',
    mediumClue: 'Swift-footed adjective that also names an entire armada',
    hardClue: 'Fast naval squadron (5)',
    crypticBreakdown: 'Double definition: "Fast" and "naval squadron" -> FLEET.',
    etymologyOrContext: 'From Old English fleot ("ship, raft, estuary").',
    defaultIsCryptic: true,
  },
  {
    answer: 'HAVEN',
    easyClue: 'Protected inlet for boats; any peaceful place of safety',
    mediumClue: 'Cozy refuge that sits halfway between New and Connecticut’s coast',
    hardClue: 'Safe harbor have north at the end (5)',
    crypticBreakdown: 'HAVE + N (north) -> HAVEN; definition: "Safe harbor".',
    etymologyOrContext: 'Preserved in port names such as New Haven and Milford Haven.',
    defaultIsCryptic: true,
  },
  {
    answer: 'INLET',
    easyClue: 'Narrow arm of water reaching inland from a coast or lake',
    mediumClue: 'Small coastal cove that lets the tide in',
    hardClue: 'Coastal cove lent i out (5)',
    crypticBreakdown: 'Anagram ("out") of LENT I -> INLET; definition: "Coastal cove".',
    etymologyOrContext: 'Connects an enclosed body of water with the open sea.',
    defaultIsCryptic: true,
  },
  {
    answer: 'ATOLL',
    easyClue: 'Ring-shaped coral island enclosing a central lagoon',
    mediumClue: 'Circular reef necklace floating in the Pacific',
    hardClue: 'Coral ring takes a toll on sailors (5)',
    crypticBreakdown: 'Charade ("takes") of A + TOLL -> ATOLL; definition: "Coral ring".',
    etymologyOrContext: 'Word comes from the Dhivehi language of the Maldives (atholhu).',
    defaultIsCryptic: true,
  },
  {
    answer: 'TRADE',
    easyClue: 'Buying and selling of goods, or steady tropical ocean winds',
    mediumClue: 'Swap collectibles—or catch the steady winds across the tropics',
    hardClue: 'Commerce rated highly in overhaul (5)',
    crypticBreakdown: 'Anagram ("in overhaul") of RATED -> TRADE; definition: "Commerce".',
    etymologyOrContext: 'Trade winds enabled historic transoceanic sailing routes.',
    defaultIsCryptic: true,
  },
  {
    answer: 'NORTH',
    easyClue: 'Direction toward the Arctic Pole at the top of a standard map',
    mediumClue: 'Polaris’s direction where compass needles love to point',
    hardClue: 'Cardinal point thorn twisted (5)',
    crypticBreakdown: 'Anagram ("twisted") of THORN -> NORTH; definition: "Cardinal point".',
    etymologyOrContext: 'Oriented toward the star Polaris in the Northern Hemisphere.',
    defaultIsCryptic: true,
  },
  {
    answer: 'SOUTH',
    easyClue: 'Direction opposite north, toward Antarctica',
    mediumClue: 'Where migratory birds head when autumn frost arrives',
    hardClue: 'Cardinal direction shout wildly (5)',
    crypticBreakdown: 'Anagram ("wildly") of SHOUT -> SOUTH; definition: "Cardinal direction".',
    etymologyOrContext: 'Marked in the southern sky by the Crux (Southern Cross) constellation.',
    defaultIsCryptic: true,
  },

  // --- FILM, THEATER & PHOTOGRAPHY (EXPANDED) ---
  {
    answer: 'CAMEO',
    easyClue: 'Brief surprise appearance by a famous actor in a film',
    mediumClue: 'Blink-and-you-miss-it guest role—or a carved oval portrait brooch',
    hardClue: 'Brief film role came with ring (5)',
    crypticBreakdown: 'Charade of CAME + O (ring) -> CAMEO; definition: "Brief film role".',
    etymologyOrContext: 'Alfred Hitchcock famously made 39 cameo appearances in his own films.',
    defaultIsCryptic: true,
  },
  {
    answer: 'GENRE',
    easyClue: 'Category of art, music, or film such as comedy, mystery, or sci-fi',
    mediumClue: 'Style shelf at the bookstore or streaming menu',
    hardClue: 'Film category green mixed up (5)',
    crypticBreakdown: 'Anagram ("mixed up") of GREEN -> GENRE; definition: "Film category".',
    etymologyOrContext: 'French for "kind" or "sort", from Latin genus.',
    defaultIsCryptic: true,
  },
  {
    answer: 'CLIMAX',
    easyClue: 'Most intense, decisive turning point near the end of a story',
    mediumClue: 'Dramatic peak where all plot threads collide',
    hardClue: 'Story peak climb loses b for ax (6)',
    crypticBreakdown: 'CLIM(b) + AX -> CLIMAX; definition: "Story peak".',
    etymologyOrContext: 'From Greek klimax ("ladder" or "staircase").',
    defaultIsCryptic: false,
  },
  {
    answer: 'STAGE',
    easyClue: 'Raised platform in a theater where actors perform',
    mediumClue: 'Wooden boards lit by spotlights—or a phase in a journey',
    hardClue: 'Theater platform gates rearranged (5)',
    crypticBreakdown: 'Anagram ("rearranged") of GATES -> STAGE; definition: "Theater platform".',
    etymologyOrContext: 'Originally from Old French estage ("story of a building, platform").',
    defaultIsCryptic: true,
  },
  {
    answer: 'DEBUT',
    easyClue: 'First public appearance of a performer, show, or product',
    mediumClue: 'Opening-night bow that launches a career',
    hardClue: 'First appearance tubed backwards (5)',
    crypticBreakdown: 'Reversal ("backwards") of TUBED -> DEBUT; definition: "First appearance".',
    etymologyOrContext: 'From French debuter ("to make the first stroke in a game").',
    defaultIsCryptic: true,
  },
  {
    answer: 'TRAILER',
    easyClue: 'Short promotional preview showing highlights of an upcoming movie',
    mediumClue: 'Coming-attractions teaser shown before the feature presentation',
    hardClue: 'Movie preview earlier shifted around t (7)',
    crypticBreakdown: 'Anagram ("shifted") of EARLIER replacing E with T -> TRAILER; definition: "Movie preview".',
    etymologyOrContext: 'Called a trailer because early previews literally trailed after the main feature.',
    defaultIsCryptic: false,
  },
  {
    answer: 'SHUTTER',
    easyClue: 'Camera mechanism that opens briefly to let light hit the sensor or film',
    mediumClue: 'Blinking blade inside a lens—or a hinged wooden window cover',
    hardClue: 'Camera blade hurts et inside? No, truth re-set! (7)',
    crypticBreakdown: 'Anagram of HURT SET -> SHUTTER; definition: "Camera blade".',
    etymologyOrContext: 'Speed is measured in fractions of a second to freeze or blur motion.',
    defaultIsCryptic: false,
  },
  {
    answer: 'FRAME',
    easyClue: 'Single still image on a strip of movie film, or a border around art',
    mediumClue: 'One of twenty-four snapshots flashing per second at the movies',
    hardClue: 'Picture border far me wandered (5)',
    crypticBreakdown: 'Anagram ("wandered") of FAR ME -> FRAME; definition: "Picture border".',
    etymologyOrContext: 'Standard cinema runs at 24 frames per second.',
    defaultIsCryptic: true,
  },
  {
    answer: 'FOCUS',
    easyClue: 'Adjust a lens so the image looks crisp and sharp',
    mediumClue: 'Sharpness knob on a lens—or concentrated mental attention',
    hardClue: 'Sharpness of us around core of camera (5)',
    crypticBreakdown: 'FO + C(amera) + US -> FOCUS; definition: "Sharpness".',
    etymologyOrContext: 'Latin for "hearth" or "fireplace", adapted by Johannes Kepler for optics.',
    defaultIsCryptic: false,
  },
  {
    answer: 'USHER',
    easyClue: 'Theater attendant who checks tickets and guides guests to their seats',
    mediumClue: 'Flashlight guide down the darkened cinema aisle',
    hardClue: 'Aisle guide rushes without s (5)',
    crypticBreakdown: 'Anagram ("without s") of RUSHES -> USHER; definition: "Aisle guide".',
    etymologyOrContext: 'From Anglo-French usser ("doorkeeper"), via Latin ostium ("door").',
    defaultIsCryptic: false,
  },
  {
    answer: 'EXTRA',
    easyClue: 'Background performer in a crowd scene with no speaking lines',
    mediumClue: 'Coffee-shop patron in the background of a movie shot',
    hardClue: 'Crowd performer taxer shuffled (5)',
    crypticBreakdown: 'Anagram ("shuffled") of TAXER -> EXTRA; definition: "Crowd performer".',
    etymologyOrContext: 'Also called a background actor in modern union credits.',
    defaultIsCryptic: true,
  },
  {
    answer: 'PROPS',
    easyClue: 'Movable objects handled by actors on stage or on a film set',
    mediumClue: 'Teacups, swords, and briefcases cared for by the stage crew',
    hardClue: 'Stage items sop up PR (5)',
    crypticBreakdown: 'Anagram of PR + SOP -> PROPS; definition: "Stage items".',
    etymologyOrContext: 'Short for "theatrical properties".',
    defaultIsCryptic: true,
  },
  {
    answer: 'SPOTLIGHT',
    easyClue: 'Bright, narrow beam of light aimed at a single performer on stage',
    mediumClue: 'Center-stage halo—or intense public attention',
    hardClue: 'Stage beam plot sight altered (9)',
    crypticBreakdown: 'Anagram ("altered") of PLOT SIGHT -> SPOTLIGHT; definition: "Stage beam".',
    etymologyOrContext: 'Early theater spotlights used heated quicklime, giving rise to the phrase "in the limelight".',
    defaultIsCryptic: true,
  },
  {
    answer: 'ENCORES',
    easyClue: 'Repeated applause calls for extra songs at the end of a show',
    mediumClue: 'Bonus curtain-call numbers demanded by cheering crowds',
    hardClue: 'Bonus numbers screen o rearranged (7)',
    crypticBreakdown: 'Anagram ("rearranged") of SCREEN + O -> ENCORES; definition: "Bonus numbers".',
    etymologyOrContext: 'Plural of French encore ("again").',
    defaultIsCryptic: true,
  },
  {
    answer: 'CURTAIN',
    easyClue: 'Heavy fabric drape drawn across the front of a theater stage',
    mediumClue: 'Velvet divider that rises at Act I and falls at the finale',
    hardClue: 'Stage drape run a tic around (7)',
    crypticBreakdown: 'Anagram ("around") of RUN A TIC -> CURTAIN; definition: "Stage drape".',
    etymologyOrContext: '"Curtain call" comes from actors stepping in front of the lowered drape.',
    defaultIsCryptic: true,
  },
  {
    answer: 'BACKDROP',
    easyClue: 'Painted cloth or scenery hung behind actors on a stage or set',
    mediumClue: 'Canvas skyline hanging at the rear of a theater stage',
    hardClue: 'Stage scenery pack orb d in disorder (8)',
    crypticBreakdown: 'Anagram ("in disorder") of PACK ORB D -> BACKDROP; definition: "Stage scenery".',
    etymologyOrContext: 'Also used figuratively for the historical setting of an event.',
    defaultIsCryptic: true,
  },
  {
    answer: 'TRIPOD',
    easyClue: 'Three-legged stand used to keep a camera steady',
    mediumClue: 'Three-footed support that stops blurry long-exposure photos',
    hardClue: 'Camera stand dip rot twisted (6)',
    crypticBreakdown: 'Anagram ("twisted") of DIP ROT -> TRIPOD; definition: "Camera stand".',
    etymologyOrContext: 'From Greek tripous ("three-footed").',
    defaultIsCryptic: true,
  },
  {
    answer: 'LENS',
    easyClue: 'Curved piece of clear glass in a camera, telescope, or eyeglasses',
    mediumClue: 'Polished glass eye that bends light onto film or retina',
    hardClue: 'Glass optic snell drops l backwards? No, simply half of lenses (4)',
    crypticBreakdown: 'Charade/clipping of LENS from LENSES; definition: "Glass optic".',
    etymologyOrContext: 'Named for its resemblance to a lentil seed (Latin lens).',
    defaultIsCryptic: false,
  },

  // --- JOURNALISM, MEDIA & BROADCAST (EXPANDED) ---
  {
    answer: 'BYLINE',
    easyClue: 'Line under a newspaper headline naming the article’s author',
    mediumClue: 'Reporter’s printed credit right above the opening paragraph',
    hardClue: 'Author credit near nib? No, lie by new print (6)',
    crypticBreakdown: 'Anagram of LIE BY N(ew) -> BYLINE; definition: "Author credit".',
    etymologyOrContext: 'Literally the line reading "By [Author Name]".',
    defaultIsCryptic: false,
  },
  {
    answer: 'SCOOP',
    easyClue: 'Exclusive breaking news story published before any rival',
    mediumClue: 'Front-page beat—or a ladle for ice cream',
    hardClue: 'Exclusive story coops up inside (5)',
    crypticBreakdown: 'Anagram ("up inside") of COOPS -> SCOOP; definition: "Exclusive story".',
    etymologyOrContext: 'Newspaper slang from the 1870s for "scooping up" a rival’s story.',
    defaultIsCryptic: true,
  },
  {
    answer: 'EDITOR',
    easyClue: 'Person who revises, polishes, and approves articles or books for print',
    mediumClue: 'Newsroom chief wielding a red pen over headlines and drafts',
    hardClue: 'Newsroom chief tried zero adjustments (6)',
    crypticBreakdown: 'Anagram ("adjustments") of TRIED + O (zero) -> EDITOR; definition: "Newsroom chief".',
    etymologyOrContext: 'From Latin edere ("to bring forth, publish").',
    defaultIsCryptic: true,
  },
  {
    answer: 'COLUMN',
    easyClue: 'Recurring opinion article in a newspaper, or a vertical stone pillar',
    mediumClue: 'Vertical strip of print on a page or marble support at a temple',
    hardClue: 'News feature or pillar lum con mixed up (6)',
    crypticBreakdown: 'Anagram ("mixed up") of LUM CON -> COLUMN; definition: "News feature or pillar".',
    etymologyOrContext: 'Double meaning in journalism, spreadsheets, and architecture.',
    defaultIsCryptic: true,
  },
  {
    answer: 'SIGNAL',
    easyClue: 'Radio wave, gesture, or light used to transmit a message',
    mediumClue: 'What bars on your phone measure or traffic lights flash',
    hardClue: 'Transmission aligning without i, g? No, aligns scrambled (6)',
    crypticBreakdown: 'Anagram ("scrambled") of ALIGNS -> SIGNAL; definition: "Transmission".',
    etymologyOrContext: 'From Latin signum ("mark, token, sign").',
    defaultIsCryptic: true,
  },
  {
    answer: 'RADIO',
    easyClue: 'Wireless broadcast of music, news, and talk via electromagnetic waves',
    mediumClue: 'Dashboard dial tuned to AM or FM frequencies',
    hardClue: 'Wireless audio or aid twisted (5)',
    crypticBreakdown: 'Anagram ("twisted") of OR AID -> RADIO; definition: "Wireless".',
    etymologyOrContext: 'Pioneered in the 1890s by Guglielmo Marconi and Nikola Tesla.',
    defaultIsCryptic: true,
  },
  {
    answer: 'STATIC',
    easyClue: 'Crackling interference noise between radio stations, or stationary',
    mediumClue: 'Fuzzy snow on an untuned screen—or completely unmoving',
    hardClue: 'Crackling noise acts it out (6)',
    crypticBreakdown: 'Anagram ("out") of ACTS IT -> STATIC; definition: "Crackling noise".',
    etymologyOrContext: 'From Greek statikos ("causing to stand").',
    defaultIsCryptic: true,
  },
  {
    answer: 'PODCAST',
    easyClue: 'Episodic digital audio talk show downloaded or streamed online',
    mediumClue: 'Commuter’s favorite spoken-word audio series',
    hardClue: 'Audio show casts pod out (7)',
    crypticBreakdown: 'Anagram ("out") of CASTS POD -> PODCAST; definition: "Audio show".',
    etymologyOrContext: 'Portmanteau of "iPod" and "broadcast", coined in 2004.',
    defaultIsCryptic: true,
  },
  {
    answer: 'BULLETIN',
    easyClue: 'Brief urgent news report interrupting regular programming',
    mediumClue: 'Breaking news flash or church-board announcement sheet',
    hardClue: 'News flash in bullet fired (8)',
    crypticBreakdown: 'Charade of BULLET + IN -> BULLETIN; definition: "News flash".',
    etymologyOrContext: 'From Italian bullettino ("small official note or seal").',
    defaultIsCryptic: true,
  },
  {
    answer: 'HEADLINE',
    easyClue: 'Large bold title printed at the top of a newspaper story',
    mediumClue: 'Front-page banner meant to sum up the story in six words',
    hardClue: 'Front-page title healed in print (8)',
    crypticBreakdown: 'Anagram ("in print") of HEALED IN -> HEADLINE; definition: "Front-page title".',
    etymologyOrContext: 'Newspaper copy editors craft headlines to fit exact column widths.',
    defaultIsCryptic: true,
  },
  {
    answer: 'ARCHIVE',
    easyClue: 'Collection of historical documents, records, or past puzzle editions',
    mediumClue: 'Vault where yesterday’s newspapers and records live forever',
    hardClue: 'Record vault a richer v? No, chair ve twisted (7)',
    crypticBreakdown: 'Anagram ("twisted") of CHAIR VE -> ARCHIVE; definition: "Record vault".',
    etymologyOrContext: 'From Greek arkheion ("town hall, public office").',
    defaultIsCryptic: true,
  },
  {
    answer: 'GAZETTE',
    easyClue: 'Official newspaper or journal publishing public announcements',
    mediumClue: 'Classic broadsheet title originally priced at one Venetian coin',
    hardClue: 'Newspaper tag zed tee? No, zeta get reworked (7)',
    crypticBreakdown: 'Wordplay on GAZETTA (Venetian coin); definition: "Newspaper".',
    etymologyOrContext: 'Named after the gazzetta, a small 16th-century Venetian coin.',
    defaultIsCryptic: false,
  },
  {
    answer: 'CHRONICLE',
    easyClue: 'Detailed written account of historical events in time order',
    mediumClue: 'Year-by-year history—or a storied city daily paper',
    hardClue: 'Historical record coiled around church nr? No, clean choir rearranged (9)',
    crypticBreakdown: 'Anagram ("rearranged") of CH(o)IR + CONLE -> CHRONICLE; definition: "Historical record".',
    etymologyOrContext: 'From Greek khronos ("time").',
    defaultIsCryptic: false,
  },

  // --- SCIENCE FICTION, COMPUTING & FUTURISM (EXPANDED) ---
  {
    answer: 'QUANTUM',
    easyClue: 'Smallest discrete unit of energy or property in subatomic physics',
    mediumClue: 'Physics leap that turns continuous waves into tiny packets',
    hardClue: 'Tiny physics leap aunt qum shuffled? No, at mu qun! (7)',
    crypticBreakdown: 'Wordplay on Latin quantum ("how much"); definition: "Tiny physics leap".',
    etymologyOrContext: 'Introduced by Max Planck in 1900 to explain black-body radiation.',
    defaultIsCryptic: false,
  },
  {
    answer: 'PLASMA',
    easyClue: 'Superheated fourth state of matter made of charged ions, found in stars',
    mediumClue: 'Glowing ionized gas inside lightning bolts and neon signs',
    hardClue: 'Ionized matter palms a glowing star (6)',
    crypticBreakdown: 'Anagram ("glowing") of PALMS A -> PLASMA; definition: "Ionized matter".',
    etymologyOrContext: 'Accounts for over 99% of visible matter in the universe.',
    defaultIsCryptic: true,
  },
  {
    answer: 'PHOTON',
    easyClue: 'Massless elementary particle that carries electromagnetic light',
    mediumClue: 'Tiny packet of light racing through space at 300,000 km/s',
    hardClue: 'Light particle hot pon bouncing (6)',
    crypticBreakdown: 'Anagram ("bouncing") of HOT PON -> PHOTON; definition: "Light particle".',
    etymologyOrContext: 'Coined in 1926 by chemist Gilbert N. Lewis from Greek phos ("light").',
    defaultIsCryptic: true,
  },
  {
    answer: 'PROTON',
    easyClue: 'Positively charged subatomic particle inside an atomic nucleus',
    mediumClue: 'Positive partner to the neutron in every atom’s core',
    hardClue: 'Positive particle not pro backwards (6)',
    crypticBreakdown: 'Reversal ("backwards") of NOT ORP -> PROTON; definition: "Positive particle".',
    etymologyOrContext: 'Its count determines an element’s atomic number on the periodic table.',
    defaultIsCryptic: false,
  },
  {
    answer: 'NEUTRON',
    easyClue: 'Electrically neutral subatomic particle in an atom’s nucleus',
    mediumClue: 'Zero-charge particle that stabilizes heavy atomic nuclei',
    hardClue: 'Uncharged particle run tone wildly (7)',
    crypticBreakdown: 'Anagram ("wildly") of RUN TONE -> NEUTRON; definition: "Uncharged particle".',
    etymologyOrContext: 'Discovered by James Chadwick in 1932.',
    defaultIsCryptic: true,
  },
  {
    answer: 'FUSION',
    easyClue: 'Nuclear reaction joining light atoms to power the Sun and stars',
    mediumClue: 'Stellar energy process—or blending two culinary or musical styles',
    hardClue: 'Stellar power of us in ion (6)',
    crypticBreakdown: 'Anagram ("power") of OF US IN -> FUSION; definition: "Stellar power".',
    etymologyOrContext: 'Powers main-sequence stars by converting hydrogen into helium.',
    defaultIsCryptic: true,
  },
  {
    answer: 'BINARY',
    easyClue: 'Number system using only 0s and 1s, or a star system with two suns',
    mediumClue: 'Base-two computer language of ons and offs',
    hardClue: 'Two-digit code brainy without i? No, brainy rearranged! (6)',
    crypticBreakdown: 'Anagram ("rearranged") of BRAINY -> BINARY; definition: "Two-digit code".',
    etymologyOrContext: 'Formalized by Gottfried Wilhelm Leibniz in the 17th century.',
    defaultIsCryptic: true,
  },
  {
    answer: 'MATRIX',
    easyClue: 'Rectangular grid of numbers or circuits, or a simulated sci-fi reality',
    mediumClue: 'Rows-and-columns math array—or the virtual world in Keanu Reeves’ classic',
    hardClue: 'Number grid tram ix scrambled (6)',
    crypticBreakdown: 'Anagram ("scrambled") of TRAM IX -> MATRIX; definition: "Number grid".',
    etymologyOrContext: 'From Latin matrix ("womb, source, origin").',
    defaultIsCryptic: true,
  },
  {
    answer: 'KERNEL',
    easyClue: 'Core program of an operating system, or the edible seed inside a nut',
    mediumClue: 'Popcorn seed—or the deepest inner layer of Linux',
    hardClue: 'Central core kneels around r (6)',
    crypticBreakdown: 'Anagram ("around") of KNEEL + R -> KERNEL; definition: "Central core".',
    etymologyOrContext: 'Homophone of the military rank "colonel".',
    defaultIsCryptic: true,
  },
  {
    answer: 'SERVER',
    easyClue: 'Computer that supplies data to other devices on a network',
    mediumClue: 'Data-center workhorse—or the one bringing plates to your table',
    hardClue: 'Network host reverses without s (6)',
    crypticBreakdown: 'Anagram of REVERS(e) + S -> SERVER; definition: "Network host".',
    etymologyOrContext: 'Responds to client requests over HTTP, DNS, or game protocols.',
    defaultIsCryptic: false,
  },
  {
    answer: 'ROUTER',
    easyClue: 'Networking device that directs internet traffic between computers',
    mediumClue: 'Blinking Wi-Fi box in the hallway directing data packets',
    hardClue: 'Traffic director tourer lost t, gained r (6)',
    crypticBreakdown: 'Double meaning: "Traffic director" and "woodworker’s tool" -> ROUTER.',
    etymologyOrContext: 'Forwards data packets along optimal paths across networks.',
    defaultIsCryptic: false,
  },
  {
    answer: 'PIXEL',
    easyClue: 'Single tiny dot of color making up a digital screen image',
    mediumClue: 'Microscopic RGB tile inside every digital photograph',
    hardClue: 'Screen dot lip ex shifted (5)',
    crypticBreakdown: 'Anagram ("shifted") of LIP EX -> PIXEL; definition: "Screen dot".',
    etymologyOrContext: 'Portmanteau of "picture" (pix) + "element" (el).',
    defaultIsCryptic: true,
  },
  {
    answer: 'VECTOR',
    easyClue: 'Quantity having both magnitude and direction, or scalable line graphics',
    mediumClue: 'Arrow on a physics diagram showing speed and heading',
    hardClue: 'Directed arrow covertly turned (6)',
    crypticBreakdown: 'Anagram ("turned") of COVERT -> VECTOR; definition: "Directed arrow".',
    etymologyOrContext: 'From Latin vector ("carrier").',
    defaultIsCryptic: true,
  },
  {
    answer: 'DRONE',
    easyClue: 'Unmanned remote-controlled flying craft, or a steady low hum',
    mediumClue: 'Hovering quadcopter—or a worker-free hive bee',
    hardClue: 'Pilotless craft redone without e (5)',
    crypticBreakdown: 'Anagram of REDON(e) -> DRONE; definition: "Pilotless craft".',
    etymologyOrContext: 'Also refers to the sustained bass pipes of bagpipes.',
    defaultIsCryptic: true,
  },
  {
    answer: 'PROBE',
    easyClue: 'Uncrewed spacecraft sent to explore distant planets and moons',
    mediumClue: 'Voyager-style robotic scout—or a careful investigation',
    hardClue: 'Space scout bore p inside (5)',
    crypticBreakdown: 'Anagram ("inside") of BORE P -> PROBE; definition: "Space scout".',
    etymologyOrContext: 'Voyager 1, launched in 1977, is the farthest human-made probe from Earth.',
    defaultIsCryptic: true,
  },
  {
    answer: 'ROVER',
    easyClue: 'Wheeled robotic vehicle built to drive across Mars or the Moon',
    mediumClue: 'Perseverance or Curiosity exploring Martian craters',
    hardClue: 'Mars explorer over right (5)',
    crypticBreakdown: 'Charade of R (right) + OVER -> ROVER; definition: "Mars explorer".',
    etymologyOrContext: 'Named from the English verb "rove" ("to wander widely").',
    defaultIsCryptic: true,
  },
  {
    answer: 'REACTOR',
    easyClue: 'Chamber in which controlled nuclear energy or chemical change takes place',
    mediumClue: 'Power-plant core—or warp-core engine on a starship',
    hardClue: 'Power core creator rebuilt (7)',
    crypticBreakdown: 'Anagram ("rebuilt") of CREATOR -> REACTOR; definition: "Power core".',
    etymologyOrContext: 'Enrico Fermi led the team that built Chicago Pile-1, the first artificial reactor, in 1942.',
    defaultIsCryptic: true,
  },
  {
    answer: 'BYTE',
    easyClue: 'Unit of digital information equal to eight binary bits',
    mediumClue: 'Eight-bit chunk big enough to encode a single text letter',
    hardClue: 'Eight bits by the sound of it (4)',
    crypticBreakdown: 'Homophone ("sound of it") of BITE -> BYTE; definition: "Eight bits".',
    etymologyOrContext: 'Coined by Werner Buchholz at IBM in 1956.',
    defaultIsCryptic: true,
  },
  {
    answer: 'CODE',
    easyClue: 'Instructions written in a programming language, or a system of secret signals',
    mediumClue: 'Developer’s source text—or Morse’s dots and dashes',
    hardClue: 'Program lines coed scrambled (4)',
    crypticBreakdown: 'Anagram ("scrambled") of COED -> CODE; definition: "Program lines".',
    etymologyOrContext: 'From Latin codex ("book of laws").',
    defaultIsCryptic: true,
  },
  {
    answer: 'DATA',
    easyClue: 'Facts, measurements, and numbers collected for computer processing',
    mediumClue: 'Raw spreadsheet figures—or the positronic android on Star Trek',
    hardClue: 'Raw facts at a detour backwards (4)',
    crypticBreakdown: 'Reversal ("backwards") of AT AD -> DATA; definition: "Raw facts".',
    etymologyOrContext: 'Latin plural of datum ("something given").',
    defaultIsCryptic: false,
  },
  {
    answer: 'NODE',
    easyClue: 'Connection point in a computer network, or a joint on a plant stem',
    mediumClue: 'Network junction where cables or branches meet',
    hardClue: 'Network point done differently (4)',
    crypticBreakdown: 'Anagram ("differently") of DONE -> NODE; definition: "Network point".',
    etymologyOrContext: 'From Latin nodus ("knot").',
    defaultIsCryptic: true,
  },
  {
    answer: 'MODULE',
    easyClue: 'Detachable self-contained section of a spacecraft or software system',
    mediumClue: 'Eagle lander that touched down on the Moon in 1969',
    hardClue: 'Spacecraft section loud me arranged (6)',
    crypticBreakdown: 'Anagram ("arranged") of LOUD ME -> MODULE; definition: "Spacecraft section".',
    etymologyOrContext: 'From Latin modulus ("small measure").',
    defaultIsCryptic: true,
  },

  // --- MUSIC, RHYTHM & INSTRUMENTS (EXPANDED) ---
  {
    answer: 'OCTAVE',
    easyClue: 'Musical interval spanning eight notes from one C to the next C',
    mediumClue: 'Span between a low note and its double-frequency twin',
    hardClue: 'Eight-note span vocate shifted (6)',
    crypticBreakdown: 'Anagram ("shifted") of VOCATE -> OCTAVE; definition: "Eight-note span".',
    etymologyOrContext: 'Doubling a note’s frequency raises it by exactly one octave.',
    defaultIsCryptic: true,
  },
  {
    answer: 'CHORD',
    easyClue: 'Three or more musical notes sounded harmoniously together',
    mediumClue: 'Strummed guitar grip—or a straight line across a circle',
    hardClue: 'Musical harmony struck on cord with h inside (5)',
    crypticBreakdown: 'Insertion of H inside CORD -> CHORD; definition: "Musical harmony".',
    etymologyOrContext: 'Shortened from "accord" ("agreement of sounds").',
    defaultIsCryptic: true,
  },
  {
    answer: 'CADENCE',
    easyClue: 'Rhythmic flow of speech or music, or the closing chords of a phrase',
    mediumClue: 'Musical punctuation mark—or a marching band’s steady stride',
    hardClue: 'Musical flow dance around ce (7)',
    crypticBreakdown: 'Anagram ("around") of DANCE + CE -> CADENCE; definition: "Musical flow".',
    etymologyOrContext: 'From Latin cadere ("to fall").',
    defaultIsCryptic: false,
  },
  {
    answer: 'LYRIC',
    easyClue: 'Sung words of a song, or expressing deep personal emotion in poetry',
    mediumClue: 'What you sing along to on the chorus—named after the ancient lyre',
    hardClue: 'Song text icily without i, adding r (5)',
    crypticBreakdown: 'Wordplay on LYRE ("ancient harp"); definition: "Song text".',
    etymologyOrContext: 'Originally meant poetry sung to the accompaniment of a lyre.',
    defaultIsCryptic: false,
  },
  {
    answer: 'TREBLE',
    easyClue: 'Highest range of voices or instruments; the G clef on sheet music',
    mediumClue: 'High-note dial on a stereo—or three times as much in British English',
    hardClue: 'High range or triple rebel with t (6)',
    crypticBreakdown: 'Anagram of REBEL + T -> TREBLE; definition: "High range or triple".',
    etymologyOrContext: 'From Latin triplus ("triple"), originally the third, highest voice part.',
    defaultIsCryptic: true,
  },
  {
    answer: 'TENOR',
    easyClue: 'High adult male singing voice between alto and baritone',
    mediumClue: 'Pavarotti’s vocal range—or the general drift of an argument',
    hardClue: 'Male voice or general drift toner tuned (5)',
    crypticBreakdown: 'Anagram ("tuned") of TONER -> TENOR; definition: "Male voice or general drift".',
    etymologyOrContext: 'From Latin tenere ("to hold"), because it originally held the main melody.',
    defaultIsCryptic: true,
  },
  {
    answer: 'SOPRANO',
    easyClue: 'Highest female singing voice in opera and choir',
    mediumClue: 'Top vocal register—or Tony’s New Jersey television family name',
    hardClue: 'High singing voice apron so arranged (7)',
    crypticBreakdown: 'Anagram ("arranged") of APRON SO -> SOPRANO; definition: "High singing voice".',
    etymologyOrContext: 'Italian for "above" or "supreme".',
    defaultIsCryptic: true,
  },
  {
    answer: 'RHYTHM',
    easyClue: 'Strong, regular repeated pattern of beats in music or poetry',
    mediumClue: 'Heartbeat of a groove—with six letters and zero standard vowels',
    hardClue: 'Musical beat my rht? No, myth around right! (6)',
    crypticBreakdown: 'R (right) + HYTHM (anagram of MYTH + H) -> RHYTHM; definition: "Musical beat".',
    etymologyOrContext: 'One of the longest common English words spelled without A, E, I, O, or U.',
    defaultIsCryptic: false,
  },
  {
    answer: 'CELLO',
    easyClue: 'Large bowed wooden string instrument played seated between the knees',
    mediumClue: 'Yo-Yo Ma’s warm-voiced instrument with an endpin on the floor',
    hardClue: 'String instrument where cell holds zero (5)',
    crypticBreakdown: 'Charade of CELL + O (zero) -> CELLO; definition: "String instrument".',
    etymologyOrContext: 'Short for Italian violoncello ("little big viol").',
    defaultIsCryptic: true,
  },
  {
    answer: 'VIOLA',
    easyClue: 'Four-stringed orchestral instrument slightly larger and deeper than a violin',
    mediumClue: 'Middle voice of a string quartet—or the flower family of pansies',
    hardClue: 'String instrument voila rearranged (5)',
    crypticBreakdown: 'Anagram ("rearranged") of VOILA -> VIOLA; definition: "String instrument".',
    etymologyOrContext: 'Reads the alto clef in orchestral scores.',
    defaultIsCryptic: true,
  },
  {
    answer: 'FLUTE',
    easyClue: 'Slender woodwind instrument played by blowing across a side hole',
    mediumClue: 'Silver orchestral pipe—or a tall champagne glass',
    hardClue: 'Woodwind or tall glass left u out (5)',
    crypticBreakdown: 'Anagram ("out") of LEFT U -> FLUTE; definition: "Woodwind or tall glass".',
    etymologyOrContext: 'One of the oldest musical instruments, with bone flutes dating back over 40,000 years.',
    defaultIsCryptic: true,
  },
  {
    answer: 'TRUMPET',
    easyClue: 'Bright brass horn with three valves played in orchestras and jazz bands',
    mediumClue: 'Fanfare horn played by Louis Armstrong and Miles Davis',
    hardClue: 'Brass horn murmur? No, pet term spun around! (7)',
    crypticBreakdown: 'Wordplay on TRUMP ("declare loudly") + ET -> TRUMPET; definition: "Brass horn".',
    etymologyOrContext: 'Early trumpets had no valves and played only natural harmonics.',
    defaultIsCryptic: false,
  },
  {
    answer: 'PIANO',
    easyClue: 'Large keyboard instrument whose hammers strike metal strings',
    mediumClue: 'Eighty-eight black and white keys—and Italian for "softly"',
    hardClue: 'Keyboard played softly on a pi arrangement (5)',
    crypticBreakdown: 'Anagram ("arrangement") of ON A PI -> PIANO; definition: "Keyboard played softly".',
    etymologyOrContext: 'Short for Italian pianoforte ("soft-loud"), invented by Bartolomeo Cristofori around 1700.',
    defaultIsCryptic: true,
  },
  {
    answer: 'FUGUE',
    easyClue: 'Contrapuntal music piece where a theme is woven across echoing voices',
    mediumClue: 'Bach’s musical chase where voices imitate one another in turn',
    hardClue: 'Musical chase where fog hides u inside? No, g u fee! (5)',
    crypticBreakdown: 'From Latin fuga ("flight"); definition: "Musical chase".',
    etymologyOrContext: 'J.S. Bach’s "The Art of Fugue" is the pinnacle of the form.',
    defaultIsCryptic: false,
  },
  {
    answer: 'ARIA',
    easyClue: 'Expressive solo song for one voice with orchestra in an opera',
    mediumClue: 'Opera’s showstopping solo moment in the spotlight',
    hardClue: 'Opera solo found in Bavaria (4)',
    crypticBreakdown: 'Hidden word ("found in") BavARIA -> ARIA; definition: "Opera solo".',
    etymologyOrContext: 'Italian for "air" or "melody".',
    defaultIsCryptic: true,
  },
  {
    answer: 'DUET',
    easyClue: 'Musical composition performed by two singers or instrumentalists',
    mediumClue: 'Harmonious pair on stage, like piano four-hands',
    hardClue: 'Song for two due before tea (4)',
    crypticBreakdown: 'Charade of DUE + T (tea) -> DUET; definition: "Song for two".',
    etymologyOrContext: 'From Italian duetto ("little two").',
    defaultIsCryptic: true,
  },
  {
    answer: 'TANGO',
    easyClue: 'Dramatic ballroom dance from Argentina and Uruguay in crisp 2/4 time',
    mediumClue: 'Buenos Aires partner dance that famously "takes two"',
    hardClue: 'Argentine dance goat n pranced (5)',
    crypticBreakdown: 'Anagram ("pranced") of GOAT N -> TANGO; definition: "Argentine dance".',
    etymologyOrContext: 'Emerged in the working-class port neighborhoods of Buenos Aires and Montevideo in the 1880s.',
    defaultIsCryptic: true,
  },
  {
    answer: 'WALTZ',
    easyClue: 'Smooth three-quarter-time ballroom dance in a sweeping 1-2-3 rhythm',
    mediumClue: 'Viennese spin across the ballroom floor in 3/4 time',
    hardClue: 'Three-beat dance law around t and z (5)',
    crypticBreakdown: 'Anagram of LAW + T + Z -> WALTZ; definition: "Three-beat dance".',
    etymologyOrContext: 'From German walzen ("to roll, turn, glide").',
    defaultIsCryptic: true,
  },
  {
    answer: 'HARP',
    easyClue: 'Tall triangular stringed instrument plucked with both hands',
    mediumClue: 'Celestial plucked instrument and national emblem of Ireland',
    hardClue: 'Plucked instrument par h tuned (4)',
    crypticBreakdown: 'Anagram ("tuned") of PAR H -> HARP; definition: "Plucked instrument".',
    etymologyOrContext: 'Modern concert pedal harps have 47 strings and 7 foot pedals.',
    defaultIsCryptic: true,
  },
  {
    answer: 'OBOE',
    easyClue: 'Slender double-reed woodwind that plays the tuning A for an orchestra',
    mediumClue: 'Double-reed orchestra leader whose name is a French "high wood" palindrome',
    hardClue: 'Orchestra tuner seen in two-way oboe? Wait: both ends equal! (4)',
    crypticBreakdown: 'From French hautbois ("high wood"); definition: "Orchestra tuner".',
    etymologyOrContext: 'Its steady, clear pitch is used to tune the entire symphony orchestra before concerts.',
    defaultIsCryptic: false,
  },
  {
    answer: 'ORGAN',
    easyClue: 'Massive wind keyboard instrument with ranks of pipes played by keys and pedals',
    mediumClue: 'Cathedral keyboard king of instruments—or a living body part',
    hardClue: 'Pipe keyboard groan twisted (5)',
    crypticBreakdown: 'Anagram ("twisted") of GROAN -> ORGAN; definition: "Pipe keyboard".',
    etymologyOrContext: 'From Greek organon ("instrument, tool").',
    defaultIsCryptic: true,
  },
  {
    answer: 'JAZZ',
    easyClue: 'Improvisational American music style born in New Orleans with swing and blues',
    mediumClue: 'Syncopated genre of Ellington, Coltrane, and Ella Fitzgerald',
    hardClue: 'Improvised music style with double finale (4)',
    crypticBreakdown: 'Wordplay on New Orleans syncopated improvisation; definition: "Improvised music style".',
    etymologyOrContext: 'Emerged in New Orleans around the turn of the 20th century.',
    defaultIsCryptic: false,
  },

  // --- CULINARY, BAKING & SPICES (EXPANDED) ---
  {
    answer: 'GARLIC',
    easyClue: 'Pungent white bulb divided into cloves, foundational in world cooking',
    mediumClue: 'Aromatic kitchen bulb feared by vampires and loved by chefs',
    hardClue: 'Kitchen bulb grail c crushed (6)',
    crypticBreakdown: 'Anagram ("crushed") of GRAIL C -> GARLIC; definition: "Kitchen bulb".',
    etymologyOrContext: 'Old English garleac, meaning "spear-leek".',
    defaultIsCryptic: true,
  },
  {
    answer: 'THYME',
    easyClue: 'Fragrant Mediterranean culinary herb with tiny leaves on woody stems',
    mediumClue: 'Aromatic herb that sounds just like what a clock measures',
    hardClue: 'Savory herb the my? No, myth with e! (5)',
    crypticBreakdown: 'Anagram of MYTH + E -> THYME; definition: "Savory herb".',
    etymologyOrContext: 'Part of the classic French bouquet garni alongside bay leaf and parsley.',
    defaultIsCryptic: true,
  },
  {
    answer: 'BASIL',
    easyClue: 'Sweet green leafy herb essential for pesto and Caprese salad',
    mediumClue: 'Fragrant pizza-and-pasta herb whose Greek name means "royal"',
    hardClue: 'Pesto herb sails around b (5)',
    crypticBreakdown: 'Anagram of SAIL + B -> BASIL; definition: "Pesto herb".',
    etymologyOrContext: 'From Greek basilikon ("royal plant").',
    defaultIsCryptic: true,
  },
  {
    answer: 'CUMIN',
    easyClue: 'Earthy, warm spice seed central to curries, chili, and tacos',
    mediumClue: 'Warm, nutty spice shared by Indian garam masala and Mexican mole',
    hardClue: 'Earthy spice music without s, plus n? No, in muc! (5)',
    crypticBreakdown: 'From Greek kyminon; definition: "Earthy spice".',
    etymologyOrContext: 'Cultivated in the Mediterranean and Middle East for over 4,000 years.',
    defaultIsCryptic: false,
  },
  {
    answer: 'GINGER',
    easyClue: 'Spicy aromatic rhizome used fresh in stir-fries and dried in cookies',
    mediumClue: 'Zesty root behind sushi palate-cleansers, ale, and holiday snaps',
    hardClue: 'Zesty root nigger? No, ringer g! (6)',
    crypticBreakdown: 'Anagram of RINGER -> GINGER? Wait: R-I-N-G-E-G; charade of GIN + GER; definition: "Zesty root".',
    etymologyOrContext: 'Zingiber officinale; prized along ancient Asian spice routes.',
    defaultIsCryptic: false,
  },
  {
    answer: 'NUTMEG',
    easyClue: 'Warmly fragrant spice grated from the seed inside a tropical fruit',
    mediumClue: 'Eggnog topper harvested from the same fruit as mace',
    hardClue: 'Grated spice get mun mixed up (6)',
    crypticBreakdown: 'Anagram ("mixed up") of GET MUN -> NUTMEG; definition: "Grated spice".',
    etymologyOrContext: 'Once so valuable in 17th-century Europe that a small island was traded for Manhattan.',
    defaultIsCryptic: true,
  },
  {
    answer: 'VANILLA',
    easyClue: 'Sweet fragrant flavoring extracted from orchid seed pods',
    mediumClue: 'Classic ice-cream bean harvested from tropical climbing orchids',
    hardClue: 'Orchid spice all vain in dessert (7)',
    crypticBreakdown: 'Anagram ("in dessert") of ALL VAIN -> VANILLA; definition: "Orchid spice".',
    etymologyOrContext: 'From Spanish vainilla ("little pod"), native to Mesoamerica.',
    defaultIsCryptic: true,
  },
  {
    answer: 'CACAO',
    easyClue: 'Tropical tree whose roasted seeds are used to make chocolate',
    mediumClue: 'Pure roasted bean before sugar and milk turn it into cocoa',
    hardClue: 'Chocolate tree hidden in Macaoco? No, doubled ca + o! (5)',
    crypticBreakdown: 'From Nahuatl cacahuatl; definition: "Chocolate tree".',
    etymologyOrContext: 'Theobroma cacao literally translates from Greek as "food of the gods".',
    defaultIsCryptic: false,
  },
  {
    answer: 'CITRUS',
    easyClue: 'Tangy fruit family that includes lemons, limes, oranges, and grapefruit',
    mediumClue: 'Vitamin-C orchard family with fragrant zesty peels',
    hardClue: 'Zesty fruit family rustic rearranged (6)',
    crypticBreakdown: 'Anagram ("rearranged") of RUSTIC -> CITRUS; definition: "Zesty fruit family".',
    etymologyOrContext: 'Almost all cultivated citrus hybrids descend from citron, pomelo, and mandarin.',
    defaultIsCryptic: true,
  },
  {
    answer: 'OLIVE',
    easyClue: 'Small Mediterranean fruit pressed for cooking oil or brined for martinis',
    mediumClue: 'Branch of peace—or a pitted green garnish',
    hardClue: 'Mediterranean fruit voile draped (5)',
    crypticBreakdown: 'Anagram ("draped") of VOILE -> OLIVE; definition: "Mediterranean fruit".',
    etymologyOrContext: 'Olive trees can live and bear fruit for well over a thousand years.',
    defaultIsCryptic: true,
  },
  {
    answer: 'BRIOCHE',
    easyClue: 'Rich, tender French bread enriched with butter and eggs',
    mediumClue: 'Golden, pillowy French loaf ideal for burger buns or French toast',
    hardClue: 'Buttery bread choir be baked (7)',
    crypticBreakdown: 'Anagram ("baked") of CHOIR BE -> BRIOCHE; definition: "Buttery bread".',
    etymologyOrContext: 'High butter and egg content gives brioche its golden crumb and tender flake.',
    defaultIsCryptic: true,
  },
  {
    answer: 'BROTH',
    easyClue: 'Savory clear liquid made by simmering meat, bones, or vegetables',
    mediumClue: 'Warm soup base that too many cooks allegedly spoil',
    hardClue: 'Soup base throb stirred (5)',
    crypticBreakdown: 'Anagram ("stirred") of THROB -> BROTH; definition: "Soup base".',
    etymologyOrContext: 'Foundation for sauces, risottos, ramen, and classic soups.',
    defaultIsCryptic: true,
  },
  {
    answer: 'SAUCE',
    easyClue: 'Flavorful liquid or creamy topping served over pasta, meat, or dessert',
    mediumClue: 'Bechamel, hollandaise, marinara, or caramel drizzle',
    hardClue: 'Savory topping cause stirred (5)',
    crypticBreakdown: 'Anagram ("stirred") of CAUSE -> SAUCE; definition: "Savory topping".',
    etymologyOrContext: 'French cuisine famously codified five "mother sauces".',
    defaultIsCryptic: true,
  },
  {
    answer: 'GLAZE',
    easyClue: 'Shiny sweet or savory coating brushed onto pastries, roasts, or ceramics',
    mediumClue: 'Glossy sugar coat on a donut or vitrified finish on pottery',
    hardClue: 'Shiny finish gaze around left (5)',
    crypticBreakdown: 'Insertion of L (left) inside GAZE -> GLAZE; definition: "Shiny finish".',
    etymologyOrContext: 'Shared term in pastry kitchens and ceramic kilns.',
    defaultIsCryptic: true,
  },
  {
    answer: 'BRAISE',
    easyClue: 'Slow-cooking method that browns food first, then simmers it in liquid',
    mediumClue: 'Low-and-slow Dutch-oven technique that makes tough cuts tender',
    hardClue: 'Slow-cook a bries melt? Yes, baires! (6)',
    crypticBreakdown: 'Anagram of RABIES -> BRAISE; definition: "Slow-cook".',
    etymologyOrContext: 'From French braiser ("to cook over live coals").',
    defaultIsCryptic: true,
  },
  {
    answer: 'WHISK',
    easyClue: 'Wire kitchen utensil used to beat eggs, whip cream, or blend sauces',
    mediumClue: 'Balloon-shaped wire beater that whips air into egg whites',
    hardClue: 'Kitchen beater with quick sweep (5)',
    crypticBreakdown: 'Double definition: "Kitchen beater" and "quick sweep" -> WHISK.',
    etymologyOrContext: 'Whips air into creams, meringues, and vinaigrettes.',
    defaultIsCryptic: true,
  },
  {
    answer: 'LADLE',
    easyClue: 'Deep long-handled spoon used for serving soup or stew',
    mediumClue: 'Big-dipper spoon resting in the stockpot',
    hardClue: 'Soup spoon all ed confused (5)',
    crypticBreakdown: 'Anagram ("confused") of ALL ED -> LADLE; definition: "Soup spoon".',
    etymologyOrContext: 'From Old English hlaedel ("instrument for drawing water").',
    defaultIsCryptic: true,
  },
  {
    answer: 'SIEVE',
    easyClue: 'Fine wire-mesh utensil for straining liquids or sifting flour',
    mediumClue: 'Kitchen strainer—or a proverbially leaky memory',
    hardClue: 'Kitchen strainer eves i twisted (5)',
    crypticBreakdown: 'Anagram ("twisted") of EVES I -> SIEVE; definition: "Kitchen strainer".',
    etymologyOrContext: 'Essential for lump-free sauces and airy cake batters.',
    defaultIsCryptic: true,
  },
  {
    answer: 'CRUMB',
    easyClue: 'Tiny fragment broken off bread, cake, or biscuit',
    mediumClue: 'Tiny toast flake—or the soft inner texture of a loaf',
    hardClue: 'Bread fragment curb m around (5)',
    crypticBreakdown: 'Anagram of CURB + M -> CRUMB; definition: "Bread fragment".',
    etymologyOrContext: 'Bakers judge loaves by both their "crust" and open "crumb".',
    defaultIsCryptic: true,
  },
  {
    answer: 'ROAST',
    easyClue: 'Cook meat or vegetables in dry oven heat, or toast coffee beans',
    mediumClue: 'Sunday oven centerpiece—or a comedic tribute full of teasing',
    hardClue: 'Oven cook sort a dinner (5)',
    crypticBreakdown: 'Anagram ("dinner") of SORT A -> ROAST; definition: "Oven cook".',
    etymologyOrContext: 'Creates rich browning through the Maillard reaction and caramelization.',
    defaultIsCryptic: true,
  },

  // --- ARCHITECTURE, DESIGN & CRAFT ---
  {
    answer: 'SPIRE',
    easyClue: 'Tall tapering pointed roof rising atop a church tower or skyscraper',
    mediumClue: 'Needle-sharp crown of a cathedral or Chrysler Building',
    hardClue: 'Tower tip pries upwards (5)',
    crypticBreakdown: 'Anagram ("upwards") of PRIES -> SPIRE; definition: "Tower tip".',
    etymologyOrContext: 'From Old English spir ("tall slender blade or shoot").',
    defaultIsCryptic: true,
  },
  {
    answer: 'VAULT',
    easyClue: 'Arched ceiling of stone or brick, or a fortified room for valuables',
    mediumClue: 'Gothic cathedral ceiling—or a gymnastics leap over a horse',
    hardClue: 'Arched ceiling or leap over a bank room (5)',
    crypticBreakdown: 'Triple definition: "Arched ceiling", "leap", and "bank room" -> VAULT.',
    etymologyOrContext: 'Barrel vaults and groin vaults allowed Roman and Gothic spans.',
    defaultIsCryptic: true,
  },
  {
    answer: 'PILLAR',
    easyClue: 'Tall vertical structural column supporting a roof or arch',
    mediumClue: 'Load-bearing stone post—or a steadfast community supporter',
    hardClue: 'Stone column all rip up (6)',
    crypticBreakdown: 'Anagram ("up") of ALL RIP -> PILLAR; definition: "Stone column".',
    etymologyOrContext: 'From Latin pila ("pier, column").',
    defaultIsCryptic: true,
  },
  {
    answer: 'FRIEZE',
    easyClue: 'Horizontal sculpted or painted band running along an upper wall',
    mediumClue: 'Carved marble band high on a Greek temple, sounding icy cold',
    hardClue: 'Carved temple band sounds chilly (6)',
    crypticBreakdown: 'Homophone ("sounds") of FREEZE -> FRIEZE; definition: "Carved temple band".',
    etymologyOrContext: 'Famous example is the Parthenon frieze in Athens.',
    defaultIsCryptic: true,
  },
  {
    answer: 'ALCOVE',
    easyClue: 'Small recessed nook or bay opening off a larger room',
    mediumClue: 'Cozy reading nook set into a library wall',
    hardClue: 'Wall recess vocal e rearranged (6)',
    crypticBreakdown: 'Anagram ("rearranged") of VOCAL E -> ALCOVE; definition: "Wall recess".',
    etymologyOrContext: 'From Arabic al-qubbah ("the vault, dome").',
    defaultIsCryptic: true,
  },
  {
    answer: 'ATRIUM',
    easyClue: 'Bright central open courtyard or skylight hall inside a building',
    mediumClue: 'Sunlit glass lobby—or an upper chamber of the human heart',
    hardClue: 'Central hall or heart chamber a trim u? (6)',
    crypticBreakdown: 'Double meaning: "Central hall" and "heart chamber" -> ATRIUM.',
    etymologyOrContext: 'Central open-roofed hearth room of ancient Roman houses.',
    defaultIsCryptic: false,
  },
  {
    answer: 'FACADE',
    easyClue: 'Front exterior face of a building, or a deceptive outward appearance',
    mediumClue: 'Grand street-facing front—or a cheerful mask hiding trouble',
    hardClue: 'Building front a faced construction (6)',
    crypticBreakdown: 'Anagram ("construction") of A FACED -> FACADE; definition: "Building front".',
    etymologyOrContext: 'From French facade ("frontage"), via Italian faccia ("face").',
    defaultIsCryptic: true,
  },
  {
    answer: 'PLAZA',
    easyClue: 'Open public square in a town or city surrounded by shops or buildings',
    mediumClue: 'Sunny cobblestone town square for fountains and markets',
    hardClue: 'City square zap la around (5)',
    crypticBreakdown: 'Anagram ("around") of ZAP LA -> PLAZA; definition: "City square".',
    etymologyOrContext: 'Spanish cognate of Italian piazza and French place.',
    defaultIsCryptic: true,
  },
  {
    answer: 'BRIDGE',
    easyClue: 'Structure built to carry a road or path across water or a valley',
    mediumClue: 'Suspension span, dental anchor, violin prop, and card game',
    hardClue: 'River crossing bird eg? No, gird be! (6)',
    crypticBreakdown: 'Anagram of GIRD BE -> BRIDGE; definition: "River crossing".',
    etymologyOrContext: 'Also the command deck of a ship and the contrasting middle section of a song.',
    defaultIsCryptic: true,
  },
  {
    answer: 'MASON',
    easyClue: 'Skilled craftsperson who builds walls and arches from stone or brick',
    mediumClue: 'Stonecutter artisan—or the maker of wide-mouth canning jars',
    hardClue: 'Stone builder moans reshaped (5)',
    crypticBreakdown: 'Anagram ("reshaped") of MOANS -> MASON; definition: "Stone builder".',
    etymologyOrContext: 'Medieval stonemasons carved personal banker marks onto each dressed stone.',
    defaultIsCryptic: true,
  },
  {
    answer: 'MORTAR',
    easyClue: 'Paste of cement, sand, and water that binds bricks together, or a spice bowl',
    mediumClue: 'Troweled brick glue—or the heavy bowl paired with a pestle',
    hardClue: 'Brick binder armor t mixed up (6)',
    crypticBreakdown: 'Anagram ("mixed up") of ARMOR T -> MORTAR; definition: "Brick binder".',
    etymologyOrContext: 'Originally mixed in a bowl (Latin mortarium) using a pestle.',
    defaultIsCryptic: true,
  },
  {
    answer: 'MARBLE',
    easyClue: 'Polished white or veined metamorphic stone prized by sculptors',
    mediumClue: 'Carrara quarry stone—or a glass toy rolled in a ring',
    hardClue: 'Sculptor’s stone ramble confused (6)',
    crypticBreakdown: 'Anagram ("confused") of RAMBLE -> MARBLE; definition: "Sculptor’s stone".',
    etymologyOrContext: 'From Greek marmaros ("shining stone").',
    defaultIsCryptic: true,
  },
  {
    answer: 'GRANITE',
    easyClue: 'Hard speckled igneous rock used for monuments and kitchen countertops',
    mediumClue: 'Quartz-and-feldspar bedrock carved at Mount Rushmore',
    hardClue: 'Hard rock tearing neatly (7)',
    crypticBreakdown: 'Anagram ("neatly") of TEARING -> GRANITE; definition: "Hard rock".',
    etymologyOrContext: 'From Latin granum ("grain"), for its coarse interlocking mineral crystals.',
    defaultIsCryptic: true,
  },
  {
    answer: 'GABLE',
    easyClue: 'Triangular upper wall section formed between two sloping roof sides',
    mediumClue: 'Triangular attic wall of Anne’s green farmhouse',
    hardClue: 'Roof triangle bagel baked (5)',
    crypticBreakdown: 'Anagram ("baked") of BAGEL -> GABLE; definition: "Roof triangle".',
    etymologyOrContext: 'Made famous in literature by L.M. Montgomery’s "Anne of Green Gables".',
    defaultIsCryptic: true,
  },
  {
    answer: 'TURRET',
    easyClue: 'Small slender tower projecting from the corner of a castle or mansion',
    mediumClue: 'Corner lookout tower—or a rotating lathe tool holder',
    hardClue: 'Castle tower utter r restructured (6)',
    crypticBreakdown: 'Anagram ("restructured") of UTTER R -> TURRET; definition: "Castle tower".',
    etymologyOrContext: 'From Old French tourete ("little tower").',
    defaultIsCryptic: true,
  },
  {
    answer: 'CORNICE',
    easyClue: 'Decorative horizontal molding crowning the top of a building or wall',
    mediumClue: 'Projecting roof trim—or an overhanging shelf of wind-packed snow',
    hardClue: 'Roof molding chronic e without h (7)',
    crypticBreakdown: 'Anagram of CHRONIC(h) + E -> CORNICE; definition: "Roof molding".',
    etymologyOrContext: 'From Greek koronis ("curved line, wreath, crown").',
    defaultIsCryptic: false,
  },
  {
    answer: 'DOME',
    easyClue: 'Hemispherical rounded roof crowning a capitol or observatory',
    mediumClue: 'Pantheon’s concrete vault or an observatory’s rotating cap',
    hardClue: 'Rounded roof mode rebuilt (4)',
    crypticBreakdown: 'Anagram ("rebuilt") of MODE -> DOME; definition: "Rounded roof".',
    etymologyOrContext: 'From Latin domus ("house") and Italian duomo ("cathedral").',
    defaultIsCryptic: true,
  },
  {
    answer: 'ARCH',
    easyClue: 'Curved masonry structure spanning an opening and supporting weight above',
    mediumClue: 'St. Louis Gateway landmark—or the curve beneath your foot',
    hardClue: 'Curved span char rearranged (4)',
    crypticBreakdown: 'Anagram ("rearranged") of CHAR -> ARCH; definition: "Curved span".',
    etymologyOrContext: 'Transfers vertical weight outward into compressive thrust along the curve.',
    defaultIsCryptic: true,
  },

  // --- HISTORY, ROYALTY & CIVILIZATIONS ---
  {
    answer: 'EMPIRE',
    easyClue: 'Extensive group of territories ruled by a single supreme monarch or state',
    mediumClue: 'Vast realm—or a crisp red New York apple variety',
    hardClue: 'Imperial domain premier without r (6)',
    crypticBreakdown: 'Anagram ("without r") of PREMIER -> EMPIRE; definition: "Imperial domain".',
    etymologyOrContext: 'From Latin imperium ("supreme command, authority").',
    defaultIsCryptic: true,
  },
  {
    answer: 'CROWN',
    easyClue: 'Jeweled circular headpiece worn by a king or queen',
    mediumClue: 'Monarch’s gold circlet, a dentist’s tooth cap, or a five-shilling coin',
    hardClue: 'Royal circlet won after c? No, nc row mixed! (5)',
    crypticBreakdown: 'Wordplay on CROWN ("top of head" / "royal circlet"); definition: "Royal circlet".',
    etymologyOrContext: 'From Latin corona ("wreath, garland").',
    defaultIsCryptic: false,
  },
  {
    answer: 'THRONE',
    easyClue: 'Ceremonial chair of state occupied by a monarch on official occasions',
    mediumClue: 'Royal seat of power—or "hornet" rearranged',
    hardClue: 'Royal seat hornet stirred up (6)',
    crypticBreakdown: 'Anagram ("stirred up") of HORNET -> THRONE; definition: "Royal seat".',
    etymologyOrContext: 'From Greek thronos ("elevated seat").',
    defaultIsCryptic: true,
  },
  {
    answer: 'SCEPTER',
    easyClue: 'Ornamental staff held by a ruler as a symbol of royal authority',
    mediumClue: 'Jeweled royal rod paired with the orb at coronations',
    hardClue: 'Royal staff respect rearranged (7)',
    crypticBreakdown: 'Anagram ("rearranged") of RESPECT -> SCEPTER; definition: "Royal staff".',
    etymologyOrContext: 'From Greek skeptron ("staff, baton").',
    defaultIsCryptic: true,
  },
  {
    answer: 'HERALD',
    easyClue: 'Royal messenger who proclaims news, or a sign that something is coming',
    mediumClue: 'Coat-of-arms official—or the robin announcing spring',
    hardClue: 'Messenger hard le adjusted (6)',
    crypticBreakdown: 'Anagram ("adjusted") of HARD LE -> HERALD; definition: "Messenger".',
    etymologyOrContext: 'Heralds kept official rolls of knightly coats of arms in medieval Europe.',
    defaultIsCryptic: true,
  },
  {
    answer: 'KNIGHT',
    easyClue: 'Armored medieval warrior on horseback, or an L-jumping chess piece',
    mediumClue: 'Chivalrous Round Table hero—or the only chess piece that leaps others',
    hardClue: 'Chess jumper or armored rider sounds like darkness (6)',
    crypticBreakdown: 'Homophone ("sounds like") of NIGHT -> KNIGHT; definition: "Armored rider".',
    etymologyOrContext: 'From Old English cniht ("boy, youth, attendant").',
    defaultIsCryptic: true,
  },
  {
    answer: 'CASTLE',
    easyClue: 'Fortified stone residence with thick walls and towers for medieval rulers',
    mediumClue: 'Moated fortress—or the protective two-piece chess maneuver',
    hardClue: 'Fortress or chess move cleats rearranged (6)',
    crypticBreakdown: 'Anagram ("rearranged") of CLEATS -> CASTLE; definition: "Fortress".',
    etymologyOrContext: 'From Latin castellum ("fortified village").',
    defaultIsCryptic: true,
  },
  {
    answer: 'CITADEL',
    easyClue: 'Strong central fortress overlooking and defending a city',
    mediumClue: 'Last-stand hilltop stronghold within a walled city',
    hardClue: 'City fortress dialed c around t (7)',
    crypticBreakdown: 'Anagram ("around") of DIALED C replacing D with T -> CITADEL; definition: "City fortress".',
    etymologyOrContext: 'From Italian cittadella ("little city").',
    defaultIsCryptic: false,
  },
  {
    answer: 'RELIC',
    easyClue: 'Surviving object or artifact from an ancient historical era',
    mediumClue: 'Museum treasure—or a quiet reminder of a bygone age',
    hardClue: 'Ancient artifact clier? No, rice l scrambled! (5)',
    crypticBreakdown: 'Anagram ("scrambled") of RICE L -> RELIC; definition: "Ancient artifact".',
    etymologyOrContext: 'From Latin reliquiae ("remains").',
    defaultIsCryptic: true,
  },
  {
    answer: 'BRONZE',
    easyClue: 'Durable golden-brown metal alloy of copper and tin that named an ancient age',
    mediumClue: 'Third-place Olympic medal—or the alloy before the Iron Age',
    hardClue: 'Copper alloy zone br cast (6)',
    crypticBreakdown: 'Anagram ("cast") of ZONE BR -> BRONZE; definition: "Copper alloy".',
    etymologyOrContext: 'Smelting copper with tin transformed tools, armor, and art around 3300 BCE.',
    defaultIsCryptic: true,
  },
  {
    answer: 'DYNASTY',
    easyClue: 'Succession of rulers belonging to the same royal family',
    mediumClue: 'Ming, Tudor, or championship sports lineage',
    hardClue: 'Ruling line sandy t rewritten (7)',
    crypticBreakdown: 'Anagram ("rewritten") of SANDY T -> DYNASTY; definition: "Ruling line".',
    etymologyOrContext: 'From Greek dynasteia ("power, lordship").',
    defaultIsCryptic: true,
  },
  {
    answer: 'PHARAOH',
    easyClue: 'Title of the ancient Egyptian rulers who built pyramids and temples',
    mediumClue: 'Nile monarch whose name originally meant "great house"',
    hardClue: 'Egyptian ruler harpooh? Wait: harp around a oh! (7)',
    crypticBreakdown: 'From Egyptian per-aa ("great house"); definition: "Egyptian ruler".',
    etymologyOrContext: 'Originally referred to the royal palace before becoming the king’s title.',
    defaultIsCryptic: false,
  },
  {
    answer: 'SENATE',
    easyClue: 'Upper legislative council, originating in ancient Rome',
    mediumClue: 'Capitol chamber named after Rome’s "council of elders"',
    hardClue: 'Lawmaking body neatest without t (6)',
    crypticBreakdown: 'Anagram ("without t") of NEATEST -> SENATE; definition: "Lawmaking body".',
    etymologyOrContext: 'From Latin senatus, derived from senex ("elder, old man").',
    defaultIsCryptic: true,
  },
  {
    answer: 'TREATY',
    easyClue: 'Formal written peace or trade agreement signed between sovereign nations',
    mediumClue: 'Signed diplomatic pact sealed at the end of negotiations',
    hardClue: 'Formal pact try tea brewed (6)',
    crypticBreakdown: 'Anagram ("brewed") of TRY TEA -> TREATY; definition: "Formal pact".',
    etymologyOrContext: 'One of the earliest surviving peace treaties is the Egyptian–Hittite Treaty of Kadesh (1259 BCE).',
    defaultIsCryptic: true,
  },
  {
    answer: 'CHARTER',
    easyClue: 'Official written grant of rights, or to hire a boat or plane privately',
    mediumClue: 'Magna Carta–style founding document—or a private boat hire',
    hardClue: 'Founding grant catcher without c, adding r (7)',
    crypticBreakdown: 'Anagram of CATCHER replacing C with R -> CHARTER; definition: "Founding grant".',
    etymologyOrContext: 'From Greek khartes ("sheet of papyrus").',
    defaultIsCryptic: false,
  },
  {
    answer: 'GUILD',
    easyClue: 'Medieval association of merchants or skilled artisans regulating a craft',
    mediumClue: 'Medieval union of weavers, bakers, or goldsmiths',
    hardClue: 'Craft association dug li? No, glad ui! (5)',
    crypticBreakdown: 'From Old Norse gildi ("payment, brotherhood"); definition: "Craft association".',
    etymologyOrContext: 'Apprentices progressed to journeymen and finally master artisans within a guild.',
    defaultIsCryptic: false,
  },
  {
    answer: 'SHIELD',
    easyClue: 'Broad piece of armor carried on the arm to deflect blows',
    mediumClue: 'Heraldic defender—or a police officer’s metal badge',
    hardClue: 'Protective armor hid les inside? Wait: slides h! (6)',
    crypticBreakdown: 'Anagram of SLIDES(s) + H -> SHIELD; definition: "Protective armor".',
    etymologyOrContext: 'Display shapes on shields gave rise to medieval heraldry ("escutcheon").',
    defaultIsCryptic: false,
  },
  {
    answer: 'LANCE',
    easyClue: 'Long wooden spear used by mounted knights in tournaments',
    mediumClue: 'Jousting weapon—or to pierce cleanly',
    hardClue: 'Jousting spear clean tossed (5)',
    crypticBreakdown: 'Anagram ("tossed") of CLEAN -> LANCE; definition: "Jousting spear".',
    etymologyOrContext: 'From Latin lancea ("light spear").',
    defaultIsCryptic: true,
  },
  {
    answer: 'MINT',
    easyClue: 'Factory where official coins are stamped, or a cool green garden herb',
    mediumClue: 'Coin-making press—or brand-new collector condition',
    hardClue: 'Coin press and fragrant herb (4)',
    crypticBreakdown: 'Double definition: "Coin press" and "fragrant herb" -> MINT.',
    etymologyOrContext: 'Named after the temple of Juno Moneta in Rome, where Roman coins were struck.',
    defaultIsCryptic: true,
  },
  {
    answer: 'COIN',
    easyClue: 'Flat stamped piece of metal used as money',
    mediumClue: 'Pocket change—or to invent a brand-new phrase',
    hardClue: 'Metal money icon flipped (4)',
    crypticBreakdown: 'Anagram ("flipped") of ICON -> COIN; definition: "Metal money".',
    etymologyOrContext: 'First minted in ancient Lydia (modern-day Turkey) around 600 BCE.',
    defaultIsCryptic: true,
  },

  // --- SCIENCE, CHEMISTRY & PHYSICS ---
  {
    answer: 'ATOM',
    easyClue: 'Tiny basic building block of a chemical element',
    mediumClue: 'Greek "indivisible" unit holding protons, neutrons, and electrons',
    hardClue: 'Element unit moat disturbed (4)',
    crypticBreakdown: 'Anagram ("disturbed") of MOAT -> ATOM; definition: "Element unit".',
    etymologyOrContext: 'From Greek atomos ("uncuttable, indivisible").',
    defaultIsCryptic: true,
  },
  {
    answer: 'CARBON',
    easyClue: 'Versatile chemical element forming diamonds, graphite, and all living cells',
    mediumClue: 'Element 6: equally at home in pencil lead and sparkling diamonds',
    hardClue: 'Life’s element car bon? No, cobra n coiled! (6)',
    crypticBreakdown: 'Anagram ("coiled") of COBRA N -> CARBON; definition: "Life’s element".',
    etymologyOrContext: 'Forms four covalent bonds, making it the chemical backbone of organic chemistry.',
    defaultIsCryptic: true,
  },
  {
    answer: 'OXYGEN',
    easyClue: 'Breathable gas making up roughly one-fifth of Earth’s atmosphere',
    mediumClue: 'Element 8 that fuels both campfires and human lungs',
    hardClue: 'Breathable gas ox yen g? (6)',
    crypticBreakdown: 'Charade of OX + Y + GEN -> OXYGEN; definition: "Breathable gas".',
    etymologyOrContext: 'Coined by Antoine Lavoisier from Greek oxys ("acid") + genes ("producer").',
    defaultIsCryptic: false,
  },
  {
    answer: 'HELIUM',
    easyClue: 'Light noble gas that lifts party balloons and powers the Sun',
    mediumClue: 'Second periodic element, first spotted in sunlight before Earth',
    hardClue: 'Balloon gas while mu? No, hum lie mixed! (6)',
    crypticBreakdown: 'Anagram ("mixed") of HUM LIE -> HELIUM; definition: "Balloon gas".',
    etymologyOrContext: 'Named after Helios, the Greek sun god, after its spectral line was found in the Sun in 1868.',
    defaultIsCryptic: true,
  },
  {
    answer: 'QUARTZ',
    easyClue: 'Hard crystalline mineral used in jewelry and accurate wristwatches',
    mediumClue: 'Piezoelectric crystal ticking inside battery-powered watches',
    hardClue: 'Watch crystal (6)',
    crypticBreakdown: 'From German Quarz; vibrates at an exact 32,768 Hz in watch oscillators.',
    etymologyOrContext: 'Second most abundant mineral in Earth’s continental crust after feldspar.',
    defaultIsCryptic: false,
  },
  {
    answer: 'COBALT',
    easyClue: 'Silvery metal famous for creating deep royal-blue glass and pigments',
    mediumClue: 'Deep-blue ceramic glaze metal and rechargeable battery element',
    hardClue: 'Blue-glaze metal bolt ca welded (6)',
    crypticBreakdown: 'Anagram ("welded") of BOLT CA -> COBALT; definition: "Blue-glaze metal".',
    etymologyOrContext: 'From German Kobold ("goblin"), named by medieval miners.',
    defaultIsCryptic: true,
  },
  {
    answer: 'COPPER',
    easyClue: 'Reddish-orange metal used in electrical wires, plumbing, and pennies',
    mediumClue: 'Conductive metal that gave the Statue of Liberty her green patina',
    hardClue: 'Reddish wire metal crop per twisted (6)',
    crypticBreakdown: 'From Latin cuprum ("metal of Cyprus"); definition: "Reddish wire metal".',
    etymologyOrContext: 'Used by humans for over 10,000 years; turns green via oxidation.',
    defaultIsCryptic: false,
  },
  {
    answer: 'SILVER',
    easyClue: 'Bright precious metal with the highest electrical conductivity of any element',
    mediumClue: 'Second-place Olympic metal and classic mirror backing',
    hardClue: 'Precious metal livers polished (6)',
    crypticBreakdown: 'Anagram ("polished") of LIVERS -> SILVER; definition: "Precious metal".',
    etymologyOrContext: 'Chemical symbol Ag comes from Latin argentum.',
    defaultIsCryptic: true,
  },
  {
    answer: 'NICKEL',
    easyClue: 'Silvery corrosion-resistant metal, or a US five-cent coin',
    mediumClue: 'Magnetic coin metal alloyed into stainless steel',
    hardClue: 'Five-cent metal lick en? No, line ck! (6)',
    crypticBreakdown: 'Shortened from German Kupfernickel ("copper demon"); definition: "Five-cent metal".',
    etymologyOrContext: 'Named after mythical mischievous spirits by Saxon miners.',
    defaultIsCryptic: false,
  },
  {
    answer: 'CATALYST',
    easyClue: 'Substance that speeds up a chemical reaction without being consumed',
    mediumClue: 'Reaction sparker—or an event that triggers major change',
    hardClue: 'Reaction booster last act y mixed (8)',
    crypticBreakdown: 'Anagram ("mixed") of LAST ACT Y -> CATALYST; definition: "Reaction booster".',
    etymologyOrContext: 'Biological catalysts inside living cells are called enzymes.',
    defaultIsCryptic: true,
  },
  {
    answer: 'SOLVENT',
    easyClue: 'Liquid able to dissolve another substance, or financially able to pay debts',
    mediumClue: 'Water is the "universal" one—and a healthy business stays this way',
    hardClue: 'Dissolving liquid or debt-free lost ven rearranged (7)',
    crypticBreakdown: 'Anagram ("rearranged") of LOST VEN -> SOLVENT; definition: "Dissolving liquid or debt-free".',
    etymologyOrContext: 'From Latin solvere ("to loosen, untie, pay").',
    defaultIsCryptic: true,
  },
  {
    answer: 'ISOTOPE',
    easyClue: 'Variant of a chemical element having a different number of neutrons',
    mediumClue: 'Same atomic number, different mass—like Carbon-12 and Carbon-14',
    hardClue: 'Atomic variant is to ope? No, poetic o shifted! (7)',
    crypticBreakdown: 'Anagram of O POET IS -> ISOTOPE; definition: "Atomic variant".',
    etymologyOrContext: 'Coined in 1913 by Margaret Todd and Frederick Soddy ("same place" on the table).',
    defaultIsCryptic: false,
  },
  {
    answer: 'KINETIC',
    easyClue: 'Relating to or produced by motion and moving energy',
    mediumClue: 'Energy of a rolling boulder or spinning wind turbine',
    hardClue: 'Motion-related tick in e rearranged (7)',
    crypticBreakdown: 'Anagram ("rearranged") of TICK IN E -> KINETIC; definition: "Motion-related".',
    etymologyOrContext: 'From Greek kinesis ("movement").',
    defaultIsCryptic: true,
  },
  {
    answer: 'INERTIA',
    easyClue: 'Tendency of an object to stay still or keep moving unless pushed',
    mediumClue: 'Newton’s First Law stubbornness against changing speed or direction',
    hardClue: 'Resistance to change rain tie blown around (7)',
    crypticBreakdown: 'Anagram ("blown around") of RAIN TIE -> INERTIA; definition: "Resistance to change".',
    etymologyOrContext: 'From Latin iners ("unskilled, idle, inactive").',
    defaultIsCryptic: true,
  },
  {
    answer: 'GRAVITY',
    easyClue: 'Natural force pulling planets into orbit and apples toward the ground',
    mediumClue: 'Newton’s falling-apple force—or seriousness of a situation',
    hardClue: 'Pulling force ray t vig? No, try a vig! (7)',
    crypticBreakdown: 'From Latin gravitas ("weight, seriousness"); definition: "Pulling force".',
    etymologyOrContext: 'Described by Newton as universal gravitation and by Einstein as curved spacetime.',
    defaultIsCryptic: false,
  },
  {
    answer: 'TORQUE',
    easyClue: 'Twisting or rotational force applied by a wrench or engine',
    mediumClue: 'Turning force that tightens a lug nut or spins a wheel',
    hardClue: 'Twisting force quote around right (6)',
    crypticBreakdown: 'Insertion of R (right) inside QUOTE rearranged -> TORQUE; definition: "Twisting force".',
    etymologyOrContext: 'From Latin torquere ("to twist").',
    defaultIsCryptic: true,
  },
  {
    answer: 'OPTICS',
    easyClue: 'Branch of physics studying light, mirrors, lenses, and vision',
    mediumClue: 'Science of rainbows and telescopes—or public perception in politics',
    hardClue: 'Light science topics reshaped (6)',
    crypticBreakdown: 'Anagram ("reshaped") of TOPICS -> OPTICS; definition: "Light science".',
    etymologyOrContext: 'Ibn al-Haytham’s 11th-century Book of Optics laid foundations for the scientific method.',
    defaultIsCryptic: true,
  },
  {
    answer: 'VALENCE',
    easyClue: 'Combining capacity of an atom’s outer electrons to form chemical bonds',
    mediumClue: 'Outer-shell electron count that governs how atoms bond',
    hardClue: 'Bonding power cleave n sorted (7)',
    crypticBreakdown: 'Anagram ("sorted") of CLEAVE N -> VALENCE; definition: "Bonding power".',
    etymologyOrContext: 'From Latin valentia ("strength, capacity").',
    defaultIsCryptic: true,
  },
  {
    answer: 'ALKALI',
    easyClue: 'Water-soluble chemical base such as lye or baking soda solution',
    mediumClue: 'pH-above-7 opposite of an acid—and column 1 of the periodic table',
    hardClue: 'Chemical base ail around l, a, k (6)',
    crypticBreakdown: 'From Arabic al-qaly ("ashes of the saltwort plant"); definition: "Chemical base".',
    etymologyOrContext: 'Historically extracted from wood ashes for soapmaking.',
    defaultIsCryptic: false,
  },
  {
    answer: 'ACID',
    easyClue: 'Sour-tasting chemical substance with pH under 7, like lemon juice',
    mediumClue: 'Vinegar or citric compound that turns litmus paper red',
    hardClue: 'Sour reagent said without s, swapped c (4)',
    crypticBreakdown: 'From Latin acidus ("sour, sharp"); definition: "Sour reagent".',
    etymologyOrContext: 'Turns blue litmus indicator paper red.',
    defaultIsCryptic: false,
  },

  // --- EARTH, WEATHER & GEMS ---
  {
    answer: 'CANYON',
    easyClue: 'Deep narrow valley with steep rocky cliffs carved by a river',
    mediumClue: 'Grand Arizona gorge sculpted by the Colorado River',
    hardClue: 'Deep gorge can yon be echoed? (6)',
    crypticBreakdown: 'Charade of CAN + YON -> CANYON; definition: "Deep gorge".',
    etymologyOrContext: 'From Spanish canon ("tube, pipe, gorge").',
    defaultIsCryptic: true,
  },
  {
    answer: 'VALLEY',
    easyClue: 'Low stretch of land nestled between hills or mountains',
    mediumClue: 'Green lowland between two ridges—or Silicon’s tech corridor',
    hardClue: 'Lowland between hills all yve? No, alley v! (6)',
    crypticBreakdown: 'Charade of V + ALLEY -> VALLEY; definition: "Lowland between hills".',
    etymologyOrContext: 'Typically carved over millennia by glaciers (U-shaped) or rivers (V-shaped).',
    defaultIsCryptic: true,
  },
  {
    answer: 'SUMMIT',
    easyClue: 'Highest peak of a mountain, or a top-level meeting of world leaders',
    mediumClue: 'Climber’s crowning point—or a meeting of heads of state',
    hardClue: 'Mountain top must i’m? No, mist um! (6)',
    crypticBreakdown: 'Double definition: "Mountain top" and "leaders’ meeting" -> SUMMIT.',
    etymologyOrContext: 'From Latin summus ("highest").',
    defaultIsCryptic: false,
  },
  {
    answer: 'RIDGE',
    easyClue: 'Long narrow elevated crest running along hills or mountain tops',
    mediumClue: 'High mountain spine—or a raised ripple on a fingerprint',
    hardClue: 'Mountain spine dirge rewritten (5)',
    crypticBreakdown: 'Anagram ("rewritten") of DIRGE -> RIDGE; definition: "Mountain spine".',
    etymologyOrContext: 'Mid-ocean ridges form the longest mountain ranges on Earth.',
    defaultIsCryptic: true,
  },
  {
    answer: 'CRATER',
    easyClue: 'Bowl-shaped hollow formed by a volcano or a meteorite impact',
    mediumClue: 'Volcanic cauldron or lunar pockmark',
    hardClue: 'Impact bowl tracer reshaped (6)',
    crypticBreakdown: 'Anagram ("reshaped") of TRACER -> CRATER; definition: "Impact bowl".',
    etymologyOrContext: 'From Greek krater ("large mixing bowl").',
    defaultIsCryptic: true,
  },
  {
    answer: 'GEYSER',
    easyClue: 'Hot spring that periodically shoots tall jets of steam and boiling water',
    mediumClue: 'Old Faithful’s punctual underground steam fountain',
    hardClue: 'Hot spring grey se? No, erg yes mixed! (6)',
    crypticBreakdown: 'Anagram ("mixed") of ERG YES -> GEYSER; definition: "Hot spring".',
    etymologyOrContext: 'Named after Geysir, a famous erupting spring in southwestern Iceland.',
    defaultIsCryptic: true,
  },
  {
    answer: 'FJORD',
    easyClue: 'Long, deep, narrow sea inlet flanked by steep cliffs, common in Norway',
    mediumClue: 'Glacier-carved sea canyon along the Norwegian coast',
    hardClue: 'Nordic inlet from j and ford (5)',
    crypticBreakdown: 'From Old Norse fjorthr; definition: "Nordic inlet".',
    etymologyOrContext: 'Norway’s Sognefjord stretches over 200 kilometers inland.',
    defaultIsCryptic: false,
  },
  {
    answer: 'PLATEAU',
    easyClue: 'High flat-topped tableland rising sharply above surrounding lowlands',
    mediumClue: 'Elevated flatland—or a leveling-off period during practice',
    hardClue: 'High flatland a pale tu? No, tap u ale! (7)',
    crypticBreakdown: 'French for "flat tray or platter"; definition: "High flatland".',
    etymologyOrContext: 'The Tibetan Plateau is the world’s highest and largest, dubbed "the Roof of the World".',
    defaultIsCryptic: false,
  },
  {
    answer: 'CIRRUS',
    easyClue: 'High, wispy ice-crystal clouds resembling thin curls or mares’ tails',
    mediumClue: 'Feathery high-altitude clouds made entirely of ice crystals',
    hardClue: 'Wispy cloud cur sir shifted (6)',
    crypticBreakdown: 'Anagram ("shifted") of CUR SIR -> CIRRUS; definition: "Wispy cloud".',
    etymologyOrContext: 'Latin for "lock of curly hair".',
    defaultIsCryptic: true,
  },
  {
    answer: 'ZEPHYR',
    easyClue: 'Soft, gentle, refreshing breeze blowing from the west',
    mediumClue: 'Mild spring breeze named after the Greek west wind',
    hardClue: 'Gentle breeze from Greek west wind god (6)',
    crypticBreakdown: 'From Greek Zephyros ("personification of the west wind"); definition: "Gentle breeze".',
    etymologyOrContext: 'Classic crossword favorite featuring both Z and Y.',
    defaultIsCryptic: false,
  },
  {
    answer: 'SQUALL',
    easyClue: 'Sudden fierce gust of wind often accompanied by heavy rain or snow',
    mediumClue: 'Brief stormy blast that catches sailors off guard',
    hardClue: 'Sudden storm all squ? No, qualls around s! (6)',
    crypticBreakdown: 'Wordplay on S + QUALL; definition: "Sudden storm".',
    etymologyOrContext: 'Commonly forms along advancing cold fronts or thunderstorms.',
    defaultIsCryptic: false,
  },
  {
    answer: 'FROST',
    easyClue: 'Thin white layer of ice crystals formed on cold surfaces overnight',
    mediumClue: 'Morning lawn glitter—or the poet Robert of New England',
    hardClue: 'Morning ice forts frozen around (5)',
    crypticBreakdown: 'Anagram ("around") of FORTS -> FROST; definition: "Morning ice".',
    etymologyOrContext: 'Forms by deposition when water vapor turns directly into ice below 0°C.',
    defaultIsCryptic: true,
  },
  {
    answer: 'AMBER',
    easyClue: 'Golden fossilized tree resin used in jewelry, or a warm yellow-orange hue',
    mediumClue: 'Golden fossil resin that sometimes preserves ancient insects',
    hardClue: 'Fossil resin bream caught (5)',
    crypticBreakdown: 'Anagram ("caught") of BREAM -> AMBER; definition: "Fossil resin".',
    etymologyOrContext: 'Static electricity ("electron") was named after Greek elektron, meaning amber.',
    defaultIsCryptic: true,
  },
  {
    answer: 'TOPAZ',
    easyClue: 'Hard transparent gemstone traditionally golden-yellow or sky-blue',
    mediumClue: 'November’s golden birthstone—or a Hitchcock spy thriller',
    hardClue: 'Golden gem pot a z backwards (5)',
    crypticBreakdown: 'Reversal ("backwards") of ZAP OT -> TOPAZ; definition: "Golden gem".',
    etymologyOrContext: 'Ranks 8 on the Mohs hardness scale.',
    defaultIsCryptic: true,
  },
  {
    answer: 'OPAL',
    easyClue: 'Milky gemstone famous for shimmering flashes of rainbow color',
    mediumClue: 'Iridescent October birthstone mined heavily in Australia',
    hardClue: 'Rainbow gem polo without o, adding a (4)',
    crypticBreakdown: 'Anagram of PA + LO -> OPAL; definition: "Rainbow gem".',
    etymologyOrContext: 'From Sanskrit upala ("precious stone").',
    defaultIsCryptic: false,
  },
  {
    answer: 'ONYX',
    easyClue: 'Banded black-and-white chalcedony stone often carved into cameos',
    mediumClue: 'Jet-black gemstone whose Greek name means "fingernail"',
    hardClue: 'Dark banded gem (4)',
    crypticBreakdown: 'From Greek onyx ("claw, fingernail"); definition: "Dark banded gem".',
    etymologyOrContext: 'Prized since antiquity for intaglio signet rings and cameos.',
    defaultIsCryptic: false,
  },
  {
    answer: 'JADE',
    easyClue: 'Smooth green ornamental stone carved into bangles and figurines',
    mediumClue: 'Imperial green stone—or to tire out from overuse',
    hardClue: 'Green carving stone or weary horse (4)',
    crypticBreakdown: 'Double definition: "Green carving stone" and "weary horse" -> JADE.',
    etymologyOrContext: 'From Spanish piedra de ijada ("stone of the flank").',
    defaultIsCryptic: true,
  },
  {
    answer: 'DUNE',
    easyClue: 'Hill or ridge of loose sand sculpted by wind in a desert or on a beach',
    mediumClue: 'Shifting sand wave—or Frank Herbert’s desert planet Arrakis',
    hardClue: 'Sand hill nude in the desert (4)',
    crypticBreakdown: 'Anagram ("in the desert") of NUDE -> DUNE; definition: "Sand hill".',
    etymologyOrContext: 'Barchan and star dunes form depending on wind direction and sand supply.',
    defaultIsCryptic: true,
  },
  {
    answer: 'MESA',
    easyClue: 'Flat-topped hill with steep cliff sides common in the American Southwest',
    mediumClue: 'Table-shaped desert landform whose Spanish name means "table"',
    hardClue: 'Flat hill same reshaped (4)',
    crypticBreakdown: 'Anagram ("reshaped") of SAME -> MESA; definition: "Flat hill".',
    etymologyOrContext: 'Larger than a butte and smaller than a plateau.',
    defaultIsCryptic: true,
  },
  {
    answer: 'RUBY',
    easyClue: 'Deep crimson gemstone prized as July’s birthstone',
    mediumClue: 'Pigeon-blood red gem—and a popular programming language',
    hardClue: 'Red gem bury upturned (4)',
    crypticBreakdown: 'Anagram ("upturned") of BURY -> RUBY; definition: "Red gem".',
    etymologyOrContext: 'Red variety of the mineral corundum colored by trace chromium.',
    defaultIsCryptic: true,
  },

  // --- WILDLIFE, BIRDS & MARINE LIFE ---
  {
    answer: 'FALCON',
    easyClue: 'Swift bird of prey known for diving at astonishing speed',
    mediumClue: 'Peregrine hunter capable of 200 mph stoop dives',
    hardClue: 'Swift raptor flan co flying (6)',
    crypticBreakdown: 'Anagram ("flying") of FLAN CO -> FALCON; definition: "Swift raptor".',
    etymologyOrContext: 'The peregrine falcon is the fastest animal on Earth in a hunting dive.',
    defaultIsCryptic: true,
  },
  {
    answer: 'OSPREY',
    easyClue: 'Large coastal fish-eating hawk that hovers before plunging feet-first',
    mediumClue: 'Seaside "fish hawk"—or a tilt-rotor aircraft',
    hardClue: 'Fish hawk prose y circling (6)',
    crypticBreakdown: 'Anagram ("circling") of PROSE Y -> OSPREY; definition: "Fish hawk".',
    etymologyOrContext: 'Found on every continent except Antarctica.',
    defaultIsCryptic: true,
  },
  {
    answer: 'HERON',
    easyClue: 'Long-legged wading bird that stands motionless in marshes watching for fish',
    mediumClue: 'Patient wetland fisher with an S-curved neck',
    hardClue: 'Wading bird shone without s, adding r? No, nor he flew! (5)',
    crypticBreakdown: 'Anagram ("flew") of NOR HE -> HERON; definition: "Wading bird".',
    etymologyOrContext: 'Great blue herons tuck their necks into an S-shape during flight.',
    defaultIsCryptic: true,
  },
  {
    answer: 'RAVEN',
    easyClue: 'Large glossy black songbird known for intelligence and deep croaks',
    mediumClue: 'Poe’s midnight visitor that muttered "Nevermore"',
    hardClue: 'Black bird never? No, v near perched! (5)',
    crypticBreakdown: 'Anagram ("perched") of V NEAR -> RAVEN; definition: "Black bird".',
    etymologyOrContext: 'Corvus corax; capable of tool use, mimicry, and multi-step problem solving.',
    defaultIsCryptic: true,
  },
  {
    answer: 'FINCH',
    easyClue: 'Small seed-eating songbird studied by Darwin on the Galapagos Islands',
    mediumClue: 'Conical-beaked bird—or Atticus, Scout, and Jem’s surname',
    hardClue: 'Seed-eating bird in ch? No, flinch drops l! (5)',
    crypticBreakdown: 'FLINCH minus L -> FINCH; definition: "Seed-eating bird".',
    etymologyOrContext: 'Beak variations among Galapagos finches illustrated natural selection.',
    defaultIsCryptic: true,
  },
  {
    answer: 'OTTER',
    easyClue: 'Playful sleek aquatic mammal that swims on its back cracking shellfish',
    mediumClue: 'Kelp-anchoring river and sea mammal that holds paws while napping',
    hardClue: 'Aquatic mammal tote r tumbling (5)',
    crypticBreakdown: 'Anagram ("tumbling") of TOTE R -> OTTER; definition: "Aquatic mammal".',
    etymologyOrContext: 'Sea otters have the densest fur of any mammal on Earth.',
    defaultIsCryptic: true,
  },
  {
    answer: 'BADGER',
    easyClue: 'Stout burrowing woodland mammal with distinctive facial stripes',
    mediumClue: 'Striped nocturnal digger—or to pester relentlessly',
    hardClue: 'Burrowing mammal or nagged garbed oddly (6)',
    crypticBreakdown: 'Anagram ("oddly") of GARBED -> BADGER; definition: "Burrowing mammal or nag".',
    etymologyOrContext: 'Constructs elaborate underground tunnel networks called setts.',
    defaultIsCryptic: true,
  },
  {
    answer: 'COUGAR',
    easyClue: 'Large tan wild cat of the Americas, also called a mountain lion or puma',
    mediumClue: 'Stealthy Rocky Mountain big cat with the widest range in the Americas',
    hardClue: 'Mountain cat cargo u prowling (6)',
    crypticBreakdown: 'Anagram ("prowling") of CARGO U -> COUGAR; definition: "Mountain cat".',
    etymologyOrContext: 'Holds the Guinness record for the mammal with the most English names (over 40).',
    defaultIsCryptic: true,
  },
  {
    answer: 'GAZELLE',
    easyClue: 'Swift, slender horned antelope of African and Asian plains',
    mediumClue: 'Graceful bounding antelope built for high-speed sprints',
    hardClue: 'Swift antelope glaze el gracefully (7)',
    crypticBreakdown: 'Anagram ("gracefully") of GLAZE EL -> GAZELLE; definition: "Swift antelope".',
    etymologyOrContext: 'From Arabic ghazal ("graceful antelope").',
    defaultIsCryptic: true,
  },
  {
    answer: 'BISON',
    easyClue: 'Massive shaggy wild ox that roams North American prairies',
    mediumClue: 'Heavy-shouldered plains herbivore on the classic nickel',
    hardClue: 'Plains ox has no is? No, is on b! (5)',
    crypticBreakdown: 'Charade of B + IS + ON -> BISON; definition: "Plains ox".',
    etymologyOrContext: 'From Greek bison ("wild ox"); plural is also bison.',
    defaultIsCryptic: true,
  },
  {
    answer: 'DOLPHIN',
    easyClue: 'Intelligent toothed marine mammal famous for leaps and echolocation',
    mediumClue: 'Playful ocean swimmer that sleeps with one brain hemisphere at a time',
    hardClue: 'Ocean swimmer hold pin splashing (7)',
    crypticBreakdown: 'Anagram ("splashing") of HOLD PIN -> DOLPHIN; definition: "Ocean swimmer".',
    etymologyOrContext: 'From Greek delphis, related to delphys ("womb").',
    defaultIsCryptic: true,
  },
  {
    answer: 'WHALE',
    easyClue: 'Enormous ocean-dwelling mammal that breathes air through a blowhole',
    mediumClue: 'Melville’s Moby-Dick or a song-singing humpback',
    hardClue: 'Ocean giant law he navigated (5)',
    crypticBreakdown: 'Anagram ("navigated") of LAW HE -> WHALE; definition: "Ocean giant".',
    etymologyOrContext: 'The blue whale is the largest animal known to have ever lived.',
    defaultIsCryptic: true,
  },
  {
    answer: 'MANTA',
    easyClue: 'Giant harmless ocean ray with wide wing-like pectoral fins',
    mediumClue: 'Graceful "blanket" ray gliding through tropical currents',
    hardClue: 'Ocean ray at man backwards (5)',
    crypticBreakdown: 'Reversal/anagram of AT MAN -> MANTA; definition: "Ocean ray".',
    etymologyOrContext: 'Spanish for "blanket" or "cloak".',
    defaultIsCryptic: true,
  },
  {
    answer: 'EAGLE',
    easyClue: 'Powerful hooked-beak bird of prey, emblem of many nations',
    mediumClue: 'Soaring raptor—or two under par on a golf hole',
    hardClue: 'Soaring bird glee around a (5)',
    crypticBreakdown: 'Anagram ("around") of GLEE + A -> EAGLE; definition: "Soaring bird".',
    etymologyOrContext: 'Bald and golden eagles build massive nests called eyries.',
    defaultIsCryptic: true,
  },
  {
    answer: 'CRANE',
    easyClue: 'Tall wading bird with long legs, or a tall construction hoist',
    mediumClue: 'Origami paper classic—or a steel skyscraper lifter',
    hardClue: 'Tall bird or builder’s hoist can re-angle (5)',
    crypticBreakdown: 'Anagram ("re-angle") of CAN RE -> CRANE; definition: "Tall bird or hoist".',
    etymologyOrContext: 'Constructing machines were named after their resemblance to the bird’s long neck.',
    defaultIsCryptic: true,
  },
  {
    answer: 'ORCA',
    easyClue: 'Black-and-white apex ocean predator also known as the killer whale',
    mediumClue: 'Pod-hunting black-and-white dolphin family giant',
    hardClue: 'Ocean hunter seen in Mallorca (4)',
    crypticBreakdown: 'Hidden word ("seen in") MallORCA -> ORCA; definition: "Ocean hunter".',
    etymologyOrContext: 'Despite the nickname "killer whale", orcas are the largest members of the dolphin family.',
    defaultIsCryptic: true,
  },
  {
    answer: 'LYNX',
    easyClue: 'Medium-sized wild cat with tufted ears and a short bobbed tail',
    mediumClue: 'Snowshoe-pawed forest cat—and a faint northern constellation',
    hardClue: 'Tufted wild cat (4)',
    crypticBreakdown: 'From Greek lynx; famous for sharp eyesight.',
    etymologyOrContext: 'Its wide fur-covered paws act like natural snowshoes in winter.',
    defaultIsCryptic: false,
  },
  {
    answer: 'WREN',
    easyClue: 'Tiny brownish songbird with an upturned tail and surprisingly loud voice',
    mediumClue: 'Cock-tailed garden songbird—or St. Paul’s Cathedral architect',
    hardClue: 'Tiny songbird new r perched (4)',
    crypticBreakdown: 'Anagram ("perched") of NEW R -> WREN; definition: "Tiny songbird".',
    etymologyOrContext: 'Sir Christopher Wren rebuilt 52 London churches after the Great Fire of 1666.',
    defaultIsCryptic: true,
  },

  // --- ART, COLOR & LITERATURE (EXPANDED) ---
  {
    answer: 'CANVAS',
    easyClue: 'Stretched heavy woven cloth used by painters or for sails and tents',
    mediumClue: 'Artist’s blank frame—or to poll voters door to door',
    hardClue: 'Painter’s cloth can vas? No, scan va! (6)',
    crypticBreakdown: 'From Latin cannabis ("hemp"); definition: "Painter’s cloth".',
    etymologyOrContext: 'Linen and cotton duck canvases replaced wooden panels in the Renaissance.',
    defaultIsCryptic: false,
  },
  {
    answer: 'EASEL',
    easyClue: 'Upright wooden tripod stand holding a painter’s canvas',
    mediumClue: 'Studio stand named after the humble donkey ("ass")',
    hardClue: 'Painter’s stand lease arranged (5)',
    crypticBreakdown: 'Anagram ("arranged") of LEASE -> EASEL; definition: "Painter’s stand".',
    etymologyOrContext: 'From Dutch ezel ("donkey"), because it carries the painter’s burden.',
    defaultIsCryptic: true,
  },
  {
    answer: 'PASTEL',
    easyClue: 'Soft powdery color stick for drawing, or a pale gentle hue',
    mediumClue: 'Chalky Degas medium—or Easter-egg shade',
    hardClue: 'Pale shade or chalk stick plates shifted (6)',
    crypticBreakdown: 'Anagram ("shifted") of PLATES -> PASTEL; definition: "Pale shade".',
    etymologyOrContext: 'Named after the "paste" of pure pigment and binder pressed into sticks.',
    defaultIsCryptic: true,
  },
  {
    answer: 'FRESCO',
    easyClue: 'Wall painting technique applied rapidly onto freshly laid wet plaster',
    mediumClue: 'Sistine Chapel medium whose Italian name means "fresh"',
    hardClue: 'Plaster mural forces shifted (6)',
    crypticBreakdown: 'Anagram ("shifted") of FORCES -> FRESCO; definition: "Plaster mural".',
    etymologyOrContext: 'As wet lime plaster dries, pigments bond chemically into the wall itself.',
    defaultIsCryptic: true,
  },
  {
    answer: 'MURAL',
    easyClue: 'Large painting or artwork applied directly onto a wall or ceiling',
    mediumClue: 'Street-spanning wall painting from Diego Rivera to city alleys',
    hardClue: 'Wall painting rum al splashed (5)',
    crypticBreakdown: 'Anagram ("splashed") of RUM AL -> MURAL; definition: "Wall painting".',
    etymologyOrContext: 'From Latin murus ("wall").',
    defaultIsCryptic: true,
  },
  {
    answer: 'SKETCH',
    easyClue: 'Quick rough drawing or brief comedic stage scene',
    mediumClue: 'Pencil study in a notebook—or a short Saturday-night comedy bit',
    hardClue: 'Rough drawing check t’s rearranged (6)',
    crypticBreakdown: 'Wordplay on SKETCH; definition: "Rough drawing".',
    etymologyOrContext: 'From Italian schizzo ("splash, rough draft").',
    defaultIsCryptic: false,
  },
  {
    answer: 'CHISEL',
    easyClue: 'Sharp beveled steel blade struck with a mallet to carve stone or wood',
    mediumClue: 'Sculptor’s carving iron—or to cheat out of something',
    hardClue: 'Carving tool slices around h, dropping s (6)',
    crypticBreakdown: 'Anagram of SLICE(s) + H -> CHISEL; definition: "Carving tool".',
    etymologyOrContext: 'Michelangelo famously used toothed chisels to bring figures out of Carrara marble.',
    defaultIsCryptic: false,
  },
  {
    answer: 'PALETTE',
    easyClue: 'Thin oval board on which an artist mixes paint colors',
    mediumClue: 'Thumb-holed paint board—or the chosen color scheme of an app',
    hardClue: 'Color board let tape stick together (7)',
    crypticBreakdown: 'Anagram ("stick together") of LET TAPE -> PALETTE; definition: "Color board".',
    etymologyOrContext: 'From French palette ("little shovel").',
    defaultIsCryptic: true,
  },
  {
    answer: 'OCHRE',
    easyClue: 'Earthy yellow-brown clay pigment used since prehistoric cave paintings',
    mediumClue: 'Warm golden-earth pigment used in Lascaux cave art',
    hardClue: 'Earth pigment chore mixed (5)',
    crypticBreakdown: 'Anagram ("mixed") of CHORE -> OCHRE; definition: "Earth pigment".',
    etymologyOrContext: 'Iron oxide-tinted clay among humanity’s oldest surviving pigments.',
    defaultIsCryptic: true,
  },
  {
    answer: 'INDIGO',
    easyClue: 'Deep blue-violet dye between blue and violet in the rainbow',
    mediumClue: 'Blue-jeans plant dye—and the "I" in ROYGBIV',
    hardClue: 'Deep blue dye doing i differently (6)',
    crypticBreakdown: 'Anagram ("differently") of DOING I -> INDIGO; definition: "Deep blue dye".',
    etymologyOrContext: 'From Greek indikon ("from India").',
    defaultIsCryptic: true,
  },
  {
    answer: 'CRIMSON',
    easyClue: 'Rich deep purplish-red shade associated with velvet and roses',
    mediumClue: 'Deep red college color—or a sudden blush',
    hardClue: 'Deep red scion mr? No, microns without n! (7)',
    crypticBreakdown: 'Anagram ("without n") of MICRONS + N? Wait: CRIMSON = C-R-I-M-S-O-N -> MICRONS minus nothing! Anagram of MICRONS -> CRIMSON.',
    etymologyOrContext: 'From Sanskrit krmi-ja ("worm-produced"), referring to kermes scarlet dye.',
    defaultIsCryptic: true,
  },
  {
    answer: 'AZURE',
    easyClue: 'Bright clear sky-blue color, named after lapis lazuli',
    mediumClue: 'Clear Mediterranean sky shade from lapis lazuli',
    hardClue: 'Sky blue haze around ur? Wait: raze u! (5)',
    crypticBreakdown: 'Anagram of RAZE U -> AZURE; definition: "Sky blue".',
    etymologyOrContext: 'Shared root with "lapis lazuli" via Persian lazhward.',
    defaultIsCryptic: true,
  },
  {
    answer: 'ESSAY',
    easyClue: 'Short nonfiction composition exploring an idea or argument',
    mediumClue: 'Montaigne’s literary invention whose French name means "to try"',
    hardClue: 'Short prose piece yes sa? No, ease y without e! (5)',
    crypticBreakdown: 'From French essai ("trial, attempt"); definition: "Short prose piece".',
    etymologyOrContext: 'Michel de Montaigne popularized the form with his Essais in 1580.',
    defaultIsCryptic: false,
  },
  {
    answer: 'ODYSSEY',
    easyClue: 'Long adventurous wandering journey, named after Homer’s epic',
    mediumClue: 'Ten-year homeward voyage—or Stanley Kubrick’s 2001 subtitle',
    hardClue: 'Epic journey does sy? No, yes doys! (7)',
    crypticBreakdown: 'Named for Greek hero Odysseus; definition: "Epic journey".',
    etymologyOrContext: 'Homer’s Odyssey chronicles Odysseus’s ten-year voyage back to Ithaca.',
    defaultIsCryptic: false,
  },
  {
    answer: 'PROLOGUE',
    easyClue: 'Introductory section setting the scene before Chapter 1 or Act I',
    mediumClue: 'Before-the-story opener spoken before the curtain rises',
    hardClue: 'Opening section pour ogle carefully (8)',
    crypticBreakdown: 'Anagram ("carefully") of POUR OGLE -> PROLOGUE; definition: "Opening section".',
    etymologyOrContext: 'From Greek prologos ("foreword, speaking beforehand").',
    defaultIsCryptic: true,
  },
  {
    answer: 'EPILOGUE',
    easyClue: 'Concluding section at the end of a book or play wrapping up fates',
    mediumClue: 'Afterword scene showing where characters end up years later',
    hardClue: 'Closing section lie up ego reshaped (8)',
    crypticBreakdown: 'Anagram ("reshaped") of LIE UP EGO -> EPILOGUE; definition: "Closing section".',
    etymologyOrContext: 'Opposite of a prologue; from Greek epilogos ("conclusion").',
    defaultIsCryptic: true,
  },
  {
    answer: 'STATUE',
    easyClue: 'Three-dimensional carved or cast sculpture of a person or animal',
    mediumClue: 'Bronze or marble figure standing on a plaza pedestal',
    hardClue: 'Sculpted figure taste u rearranged (6)',
    crypticBreakdown: 'Anagram ("rearranged") of TASTE U -> STATUE; definition: "Sculpted figure".',
    etymologyOrContext: 'From Latin statua ("standing image").',
    defaultIsCryptic: true,
  },
  {
    answer: 'IVORY',
    easyClue: 'Creamy white material of elephant or walrus tusks, or a warm off-white',
    mediumClue: 'Warm off-white shade—or "tower" adjective for detached academia',
    hardClue: 'Creamy white shade or piano key legacy (5)',
    crypticBreakdown: 'From Latin eboreus ("of ivory"); definition: "Creamy white shade".',
    etymologyOrContext: 'Modern piano keys use synthetic resins rather than animal ivory.',
    defaultIsCryptic: false,
  },

  // --- GAMES, SPORTS & STRATEGY ---
  {
    answer: 'CHESS',
    easyClue: 'Classic 64-square strategy board game ending in checkmate',
    mediumClue: 'Eight-by-eight game of kings, queens, rooks, and pawns',
    hardClue: 'Board game chests without t (5)',
    crypticBreakdown: 'CHESTS minus T -> CHESS; definition: "Board game".',
    etymologyOrContext: 'Descended from the 6th-century Indian game chaturanga via Persian shah ("king").',
    defaultIsCryptic: true,
  },
  {
    answer: 'BISHOP',
    easyClue: 'Chess piece that glides diagonally across squares of one color',
    mediumClue: 'Mitred diagonal chess slider—or a senior cathedral cleric',
    hardClue: 'Diagonal piece his bop played (6)',
    crypticBreakdown: 'Anagram ("played") of HIS BOP -> BISHOP; definition: "Diagonal piece".',
    etymologyOrContext: 'Formerly called alfil ("the elephant") in medieval Arabic chess.',
    defaultIsCryptic: true,
  },
  {
    answer: 'GAMBIT',
    easyClue: 'Chess opening sacrificing a pawn early for positional advantage',
    mediumClue: 'Calculated opening sacrifice—or any bold opening move',
    hardClue: 'Opening ploy big mat tossed (6)',
    crypticBreakdown: 'Anagram ("tossed") of BIG MAT -> GAMBIT; definition: "Opening ploy".',
    etymologyOrContext: 'From Italian gambetto ("tripping up by the heel").',
    defaultIsCryptic: true,
  },
  {
    answer: 'TROPHY',
    easyClue: 'Cup, plaque, or statuette awarded to a tournament champion',
    mediumClue: 'Silver cup gleaming in the champion’s cabinet',
    hardClue: 'Winner’s cup thy pro polished (6)',
    crypticBreakdown: 'Anagram ("polished") of THY PRO -> TROPHY; definition: "Winner’s cup".',
    etymologyOrContext: 'From Greek tropaion ("monument of an enemy’s turning/defeat").',
    defaultIsCryptic: true,
  },
  {
    answer: 'MEDAL',
    easyClue: 'Stamped metal disc awarded for athletic victory or bravery',
    mediumClue: 'Gold, silver, or bronze Olympic ribbon prize',
    hardClue: 'Prize disc lamed awkwardly (5)',
    crypticBreakdown: 'Anagram ("awkwardly") of LAMED -> MEDAL; definition: "Prize disc".',
    etymologyOrContext: 'From Latin metallum ("metal").',
    defaultIsCryptic: true,
  },
  {
    answer: 'SPRINT',
    easyClue: 'Short all-out run at top speed over a brief distance',
    mediumClue: 'Hundred-meter dash—or a two-week software development cycle',
    hardClue: 'Fast dash prints out of order (6)',
    crypticBreakdown: 'Anagram ("out of order") of PRINTS -> SPRINT; definition: "Fast dash".',
    etymologyOrContext: 'In track, sprint events cover 100m, 200m, and 400m.',
    defaultIsCryptic: true,
  },
  {
    answer: 'RELAY',
    easyClue: 'Team race where runners pass a baton from one leg to the next',
    mediumClue: 'Baton-passing race—or an electrical switch triggered by a pulse',
    hardClue: 'Baton race early shifted (5)',
    crypticBreakdown: 'Anagram ("shifted") of EARLY -> RELAY; definition: "Baton race".',
    etymologyOrContext: 'Originally meant fresh packs of hunting hounds or horses stationed along a route.',
    defaultIsCryptic: true,
  },
  {
    answer: 'HURDLE',
    easyClue: 'Lightweight barrier that track runners leap over in a race',
    mediumClue: 'Track-and-field barrier—or an obstacle to overcome',
    hardClue: 'Track barrier hurled awkwardly (6)',
    crypticBreakdown: 'Anagram ("awkwardly") of HURLED -> HURDLE; definition: "Track barrier".',
    etymologyOrContext: 'Originally a portable woven fence panel used to pen sheep.',
    defaultIsCryptic: true,
  },
  {
    answer: 'ARCHERY',
    easyClue: 'Sport or skill of shooting arrows from a bow at a target',
    mediumClue: 'Robin Hood’s precision bullseye sport',
    hardClue: 'Bow sport carry he? No, rare chy! (7)',
    crypticBreakdown: 'From Latin arcus ("bow"); definition: "Bow sport".',
    etymologyOrContext: 'Modern Olympic archery shoots recurve bows at targets 70 meters away.',
    defaultIsCryptic: false,
  },
  {
    answer: 'FENCING',
    easyClue: 'Sword-fighting sport using foil, epee, or sabre',
    mediumClue: 'Mask-and-blade duel—or posts enclosing a pasture',
    hardClue: 'Sword sport or yard boundary (7)',
    crypticBreakdown: 'Double definition: "Sword sport" and "yard boundary" -> FENCING.',
    etymologyOrContext: 'Shortened from "defence", one of the original 1896 modern Olympic sports.',
    defaultIsCryptic: true,
  },
  {
    answer: 'DERBY',
    easyClue: 'Famous annual horse race or stiff rounded felt hat',
    mediumClue: 'Kentucky classic, hometown sports rivalry, or bowler hat',
    hardClue: 'Racetrack classic by red rearranged (5)',
    crypticBreakdown: 'Anagram ("rearranged") of BY RED -> DERBY; definition: "Racetrack classic".',
    etymologyOrContext: 'Named after the 12th Earl of Derby, who founded the Epsom Stakes in 1780.',
    defaultIsCryptic: true,
  },
  {
    answer: 'PODIUM',
    easyClue: 'Raised platform for a speaker, orchestra conductor, or top three medalists',
    mediumClue: 'Three-step medal stand—or a conductor’s perch',
    hardClue: 'Medal stand do i’m up? (6)',
    crypticBreakdown: 'Anagram of DO IM UP -> PODIUM; definition: "Medal stand".',
    etymologyOrContext: 'From Greek podion ("little foot, base").',
    defaultIsCryptic: true,
  },
  {
    answer: 'TRIUMPH',
    easyClue: 'Great victory, milestone achievement, or overwhelming joy',
    mediumClue: 'Grand Roman victory parade—or a classic British motorcycle',
    hardClue: 'Great victory hurt imp badly (7)',
    crypticBreakdown: 'Anagram ("badly") of HURT IMP -> TRIUMPH; definition: "Great victory".',
    etymologyOrContext: 'In ancient Rome, a formal victory procession granted to victorious generals.',
    defaultIsCryptic: true,
  },
  {
    answer: 'VICTORY',
    easyClue: 'Success in defeating an opponent in a contest, game, or battle',
    mediumClue: 'Winning outcome celebrated by two fingers in a V',
    hardClue: 'Winning outcome ivory ct? (7)',
    crypticBreakdown: 'Anagram of IVORY + CT -> VICTORY; definition: "Winning outcome".',
    etymologyOrContext: 'From Latin victoria, personified by the Roman goddess Nike/Victoria.',
    defaultIsCryptic: true,
  },
  {
    answer: 'RALLY',
    easyClue: 'Back-and-forth exchange of shots in tennis, or a spirited comeback',
    mediumClue: 'Long tennis volley—or an off-road stage car race',
    hardClue: 'Tennis exchange or comeback (5)',
    crypticBreakdown: 'Double definition: "Tennis exchange" and "comeback" -> RALLY.',
    etymologyOrContext: 'From French rallier ("to unite again").',
    defaultIsCryptic: true,
  },
  {
    answer: 'SCORE',
    easyClue: 'Total points earned in a game, or the printed sheet music for an orchestra',
    mediumClue: 'Twenty years (as Lincoln said)—or the full orchestral sheet music',
    hardClue: 'Game tally or sheet music cores sorted (5)',
    crypticBreakdown: 'Anagram ("sorted") of CORES -> SCORE; definition: "Game tally or sheet music".',
    etymologyOrContext: 'From Old Norse skor ("notch"), used for tallying sheep or points on a stick.',
    defaultIsCryptic: true,
  },

  // --- TIME, TRAVEL & EVERYDAY CLASSICS ---
  {
    answer: 'CLOCK',
    easyClue: 'Instrument with hands or digits that measures and shows the time',
    mediumClue: 'Ticking wall timepiece—or to time a sprinter’s run',
    hardClue: 'Timepiece lock behind c (5)',
    crypticBreakdown: 'Charade of C + LOCK -> CLOCK; definition: "Timepiece".',
    etymologyOrContext: 'From Medieval Latin clocca ("bell"), because early town clocks struck bells.',
    defaultIsCryptic: true,
  },
  {
    answer: 'PENDULUM',
    easyClue: 'Suspended weight swinging steadily back and forth to regulate a clock',
    mediumClue: 'Swinging brass bob behind a grandfather clock’s glass door',
    hardClue: 'Swinging weight plum nude? Wait: lump dune! (8)',
    crypticBreakdown: 'Anagram of LUMP + DUNE -> PENDULUM; definition: "Swinging weight".',
    etymologyOrContext: 'Galileo discovered its isochronism by watching a swinging cathedral lamp.',
    defaultIsCryptic: true,
  },
  {
    answer: 'TWILIGHT',
    easyClue: 'Soft glowing light in the sky just after sunset or before sunrise',
    mediumClue: 'Dusk’s purple hour—or Rod Serling’s famous "Zone"',
    hardClue: 'Dusk glow will tight? No, lit wight! (8)',
    crypticBreakdown: 'From Old English twi- ("two, half") + light; definition: "Dusk glow".',
    etymologyOrContext: 'Astronomers divide it into civil, nautical, and astronomical twilight.',
    defaultIsCryptic: false,
  },
  {
    answer: 'LANTERN',
    easyClue: 'Portable lamp enclosed in glass or paper to protect the flame',
    mediumClue: 'Campground light—or an architectural rooftop skylight turret',
    hardClue: 'Portable lamp learn nt? No, rent aln! (7)',
    crypticBreakdown: 'Anagram of RENTAL + N -> LANTERN; definition: "Portable lamp".',
    etymologyOrContext: 'From Greek lampter ("torch, lamp").',
    defaultIsCryptic: true,
  },
  {
    answer: 'CANDLE',
    easyClue: 'Stick of wax with a central wick burned to give steady warm light',
    mediumClue: 'Birthday-cake topper—or an old unit of light intensity',
    hardClue: 'Wax light danced without d, adding l (6)',
    crypticBreakdown: 'Anagram of DANCED replacing D with L -> CANDLE; definition: "Wax light".',
    etymologyOrContext: 'Historically made from beeswax, tallow, or spermaceti.',
    defaultIsCryptic: false,
  },
  {
    answer: 'MIRROR',
    easyClue: 'Polished glass surface that reflects a clear image',
    mediumClue: 'Bathroom glass—or an astronomical telescope’s curved reflector',
    hardClue: 'Reflecting glass or rim reversed (6)',
    crypticBreakdown: 'Charade of MIR (rim reversed) + ROR -> MIRROR; definition: "Reflecting glass".',
    etymologyOrContext: 'From Latin mirari ("to admire, wonder at").',
    defaultIsCryptic: false,
  },
  {
    answer: 'TRAIN',
    easyClue: 'Connected line of railway cars pulled along steel tracks, or to coach',
    mediumClue: 'Railroad locomotive line—or a bridal gown’s trailing fabric',
    hardClue: 'Rail convoy or bridal trail (5)',
    crypticBreakdown: 'Double definition: "Rail convoy" and "bridal trail" -> TRAIN.',
    etymologyOrContext: 'From Old French trahiner ("to pull, draw along").',
    defaultIsCryptic: true,
  },
  {
    answer: 'METRO',
    easyClue: 'Underground urban rapid-transit railway system',
    mediumClue: 'Parisian subway—or prefix meaning major city',
    hardClue: 'Subway system more t routed (5)',
    crypticBreakdown: 'Anagram ("routed") of MORE T -> METRO; definition: "Subway system".',
    etymologyOrContext: 'Shortened from Paris’s Chemin de Fer Metropolitain (1900).',
    defaultIsCryptic: true,
  },
  {
    answer: 'FERRY',
    easyClue: 'Boat that regularly carries passengers and vehicles across a river or bay',
    mediumClue: 'Commuter harbor boat—or to shuttle people back and forth',
    hardClue: 'Harbor shuttle fryer scrambled (5)',
    crypticBreakdown: 'Anagram ("scrambled") of FRYER -> FERRY; definition: "Harbor shuttle".',
    etymologyOrContext: 'Staten Island and Sydney Harbour ferries are iconic commuter vessels.',
    defaultIsCryptic: true,
  },
  {
    answer: 'TUNNEL',
    easyClue: 'Underground passage dug through a mountain or beneath a river',
    mediumClue: 'Subway bore—or what mole crickets dig beneath a lawn',
    hardClue: 'Underground passage let nun dig (6)',
    crypticBreakdown: 'Anagram ("dig") of LET NUN -> TUNNEL; definition: "Underground passage".',
    etymologyOrContext: 'The Channel Tunnel links England and France beneath the Strait of Dover.',
    defaultIsCryptic: true,
  },
  {
    answer: 'CABIN',
    easyClue: 'Small cozy log house in the woods, or a private room on a ship or plane',
    mediumClue: 'Lakeside timber retreat—or where airplane passengers sit',
    hardClue: 'Log retreat or ship room (5)',
    crypticBreakdown: 'Double definition: "Log retreat" and "ship room" -> CABIN.',
    etymologyOrContext: 'From Late Latin capanna ("hut, small shelter").',
    defaultIsCryptic: true,
  },
  {
    answer: 'TICKET',
    easyClue: 'Printed pass granting entry to a train, theater, or concert',
    mediumClue: 'Boarding pass—or a slate of political running mates',
    hardClue: 'Entry pass or traffic fine (6)',
    crypticBreakdown: 'Double definition: "Entry pass" and "traffic fine" -> TICKET.',
    etymologyOrContext: 'From French etiquette ("small label or note pinned on").',
    defaultIsCryptic: true,
  },
  {
    answer: 'PASSPORT',
    easyClue: 'Official government travel booklet proving identity and citizenship abroad',
    mediumClue: 'Stamped booklet tucked inside carry-on bags at customs',
    hardClue: 'Travel booklet past port? No, pass harbor! (8)',
    crypticBreakdown: 'Charade of PASS + PORT -> PASSPORT; definition: "Travel booklet".',
    etymologyOrContext: 'Originally a document granting permission to pass through a city gate or port.',
    defaultIsCryptic: true,
  },
  {
    answer: 'BAGGAGE',
    easyClue: 'Suitcases and travel bags packed for a trip',
    mediumClue: 'Carousel luggage—or emotional weight from the past',
    hardClue: 'Travel cases gag babe? No, bag age + g! (7)',
    crypticBreakdown: 'Charade of BAG + G + AGE -> BAGGAGE; definition: "Travel cases".',
    etymologyOrContext: 'Airports sort millions of bags daily via optical barcode and RFID carousels.',
    defaultIsCryptic: false,
  },
  {
    answer: 'HOSTEL',
    easyClue: 'Inexpensive shared lodging popular with backpackers and young travelers',
    mediumClue: 'Budget bunkhouse for backpackers across Europe',
    hardClue: 'Backpacker inn lost he found (6)',
    crypticBreakdown: 'Anagram ("found") of LOST HE -> HOSTEL; definition: "Backpacker inn".',
    etymologyOrContext: 'Shares its Latin root hospitale with "hotel" and "hospital".',
    defaultIsCryptic: true,
  },
  {
    answer: 'EXPRESS',
    easyClue: 'Fast non-stop train or delivery service, or to put thoughts into words',
    mediumClue: 'Train that skips local stops—or a bold coffee base',
    hardClue: 'Fast train or squeeze out (7)',
    crypticBreakdown: 'Double definition: "Fast train" and "squeeze out" -> EXPRESS.',
    etymologyOrContext: 'Pony Express riders crossed 1,900 miles in ten days in 1860.',
    defaultIsCryptic: true,
  },
  {
    answer: 'LUGGAGE',
    easyClue: 'Suitcases, trunks, and bags carried by a traveler',
    mediumClue: 'Overhead-bin carry-ons and checked bags ("to lug")',
    hardClue: 'Travel bags (7)',
    crypticBreakdown: 'From "lug" ("to drag heavily") + -age; definition: "Travel bags".',
    etymologyOrContext: 'Originally meant something heavy that had to be lugged by hand.',
    defaultIsCryptic: false,
  },
  {
    answer: 'SUMMITS',
    easyClue: 'Mountain peaks reached by alpine climbers',
    mediumClue: 'High-altitude peaks—or annual meetings of G7 leaders',
    hardClue: 'High peaks must sit? No, mist us! (7)',
    crypticBreakdown: 'Anagram of MIST SUM -> SUMMITS; definition: "High peaks".',
    etymologyOrContext: 'Mountaineers pursue the Seven Summits—the highest peak on each continent.',
    defaultIsCryptic: false,
  },
  {
    answer: 'CARAVAN',
    easyClue: 'Group of travelers and pack animals crossing a desert together',
    mediumClue: 'Silk Road camel convoy—or a British travel trailer',
    hardClue: 'Desert convoy can a var? (7)',
    crypticBreakdown: 'From Persian karwan ("company of travelers"); definition: "Desert convoy".',
    etymologyOrContext: 'Protected Silk Road merchants traveling between oasis cities.',
    defaultIsCryptic: false,
  },

  // --- PHILOSOPHY, PSYCHOLOGY, LAW & LANGUAGE ---
  {
    answer: 'LOGIC',
    easyClue: 'Systematic reasoning based on sound principles and valid deduction',
    mediumClue: 'Aristotle’s rules of valid argument—and Spock’s guiding code',
    hardClue: 'Sound reasoning coil g twisted (5)',
    crypticBreakdown: 'Anagram ("twisted") of COIL G -> LOGIC; definition: "Sound reasoning".',
    etymologyOrContext: 'From Greek logike ("art of reason"), from logos ("word, reason").',
    defaultIsCryptic: true,
  },
  {
    answer: 'ETHICS',
    easyClue: 'Moral principles governing right and wrong human conduct',
    mediumClue: 'Philosophy branch asking "What is the right thing to do?"',
    hardClue: 'Moral code chest i examined (6)',
    crypticBreakdown: 'Anagram ("examined") of CHEST I -> ETHICS; definition: "Moral code".',
    etymologyOrContext: 'From Greek ethos ("character, custom").',
    defaultIsCryptic: true,
  },
  {
    answer: 'AXIOM',
    easyClue: 'Self-evident truth accepted without proof as a starting point in math',
    mediumClue: 'Euclid’s unprovable starting assumption ("things equal to the same...")',
    hardClue: 'Self-evident rule mix oa? No, aim ox! (5)',
    crypticBreakdown: 'Anagram of AIM OX -> AXIOM; definition: "Self-evident rule".',
    etymologyOrContext: 'From Greek axioma ("that which is thought worthy or fit").',
    defaultIsCryptic: true,
  },
  {
    answer: 'PARADOX',
    easyClue: 'Statement that seems contradictory yet reveals a surprising truth',
    mediumClue: 'Logical puzzle like "This sentence is false"',
    hardClue: 'Apparent contradiction road pox twisted (7)',
    crypticBreakdown: 'Anagram ("twisted") of ROAD POX -> PARADOX; definition: "Apparent contradiction".',
    etymologyOrContext: 'From Greek paradoxon ("contrary to expectation").',
    defaultIsCryptic: true,
  },
  {
    answer: 'STOIC',
    easyClue: 'Person who endures hardship calmly without showing emotion or complaint',
    mediumClue: 'Follower of Marcus Aurelius’s calm, unflappable philosophy',
    hardClue: 'Calm philosopher or tic’s cousin? No, coits! (5)',
    crypticBreakdown: 'Anagram of COITS -> STOIC; definition: "Calm philosopher".',
    etymologyOrContext: 'Named after the Stoa Poikile ("Painted Porch") in Athens where Zeno taught.',
    defaultIsCryptic: true,
  },
  {
    answer: 'SYNTAX',
    easyClue: 'Rules governing how words are arranged to form grammatical sentences',
    mediumClue: 'Word-order rules for English prose—or Python code',
    hardClue: 'Sentence structure any txs? No, tax syn! (6)',
    crypticBreakdown: 'From Greek syntaxis ("putting together in order"); definition: "Sentence structure".',
    etymologyOrContext: 'Distinguished from semantics (meaning) in both linguistics and computer science.',
    defaultIsCryptic: false,
  },
  {
    answer: 'VERDICT',
    easyClue: 'Final formal decision reached by a jury at the end of a trial',
    mediumClue: 'Jury’s "guilty" or "not guilty" announcement in court',
    hardClue: 'Jury decision credit v revised (7)',
    crypticBreakdown: 'Anagram ("revised") of CREDIT V -> VERDICT; definition: "Jury decision".',
    etymologyOrContext: 'From Anglo-French verdit ("true saying").',
    defaultIsCryptic: true,
  },
  {
    answer: 'ALIBI',
    easyClue: 'Proof that an accused person was elsewhere when a crime occurred',
    mediumClue: 'Courtroom defense whose Latin meaning is literally "elsewhere"',
    hardClue: 'Defense claim a li bi? (5)',
    crypticBreakdown: 'Latin for "in another place, elsewhere"; definition: "Defense claim".',
    etymologyOrContext: 'Formed from Latin alius ("other") + ibi ("there").',
    defaultIsCryptic: false,
  },
  {
    answer: 'STATUTE',
    easyClue: 'Written law formally passed by a legislature or parliament',
    mediumClue: 'Enacted book law—often confused with a marble sculpture',
    hardClue: 'Written law state ut? No, taste ut! (7)',
    crypticBreakdown: 'Anagram of TASTE UT -> STATUTE; definition: "Written law".',
    etymologyOrContext: 'From Latin statutum ("that which is set up, decreed").',
    defaultIsCryptic: true,
  },
  {
    answer: 'PATENT',
    easyClue: 'Government license granting an inventor exclusive rights to a new invention',
    mediumClue: 'Inventor’s legal shield—or glossy polished shoe leather',
    hardClue: 'Inventor’s right or shiny leather (6)',
    crypticBreakdown: 'Double definition: "Inventor’s right" and "shiny leather" -> PATENT.',
    etymologyOrContext: 'From Latin litterae patentes ("open letters") issued by a monarch.',
    defaultIsCryptic: true,
  },
  {
    answer: 'QUORUM',
    easyClue: 'Minimum number of members required at a meeting to hold an official vote',
    mediumClue: 'Attendance threshold needed before a committee can bang the gavel',
    hardClue: 'Meeting minimum from Latin "of whom" (6)',
    crypticBreakdown: 'Latin quorum ("of whom") from formal commission wording; definition: "Meeting minimum".',
    etymologyOrContext: 'Originated from legal Latin commissions naming justices "of whom" a minimum had to attend.',
    defaultIsCryptic: false,
  },
  {
    answer: 'IDIOM',
    easyClue: 'Common expression whose figurative meaning differs from its literal words',
    mediumClue: 'Phrase like "break a leg" or "spill the beans"',
    hardClue: 'Figurative phrase do i’m i? (5)',
    crypticBreakdown: 'From Greek idioma ("peculiar phrasing"); definition: "Figurative phrase".',
    etymologyOrContext: 'Every language develops idioms that cannot be translated word-for-word.',
    defaultIsCryptic: false,
  },
  {
    answer: 'LEXICON',
    easyClue: 'Complete vocabulary of a language, person, or field of knowledge',
    mediumClue: 'Dictionary-like word bank powering every crossword puzzle',
    hardClue: 'Word stock ex colon? No, ox cline! (7)',
    crypticBreakdown: 'From Greek lexikon ("wordbook"); definition: "Word stock".',
    etymologyOrContext: 'Derived from Greek lexis ("word, speech").',
    defaultIsCryptic: false,
  },
  {
    answer: 'MAXIM',
    easyClue: 'Short memorable saying expressing a general rule of conduct or truth',
    mediumClue: 'Pithy proverb like "Actions speak louder than words"',
    hardClue: 'Pithy saying I’m max? (5)',
    crypticBreakdown: 'From Latin maxima ("greatest, chief premise"); definition: "Pithy saying".',
    etymologyOrContext: 'Popularized in French literature by La Rochefoucauld.',
    defaultIsCryptic: false,
  },

  // --- TEXTILES, FASHION, TEXTURES & CRAFTS ---
  {
    answer: 'VELVET',
    easyClue: 'Luxurious woven fabric with a soft, dense, plush pile',
    mediumClue: 'Plush theater-curtain fabric—or smooth jazz vocal tone',
    hardClue: 'Plush fabric level t? No, vet lev! (6)',
    crypticBreakdown: 'From Old Italian velluto ("shaggy, tufted"); definition: "Plush fabric".',
    etymologyOrContext: 'Originally woven from silk in medieval Italy and the Middle East.',
    defaultIsCryptic: false,
  },
  {
    answer: 'LINEN',
    easyClue: 'Cool breathable cloth woven from the fibers of the flax plant',
    mediumClue: 'Crisp summer shirt fabric woven from flax',
    hardClue: 'Flax cloth in len woven (5)',
    crypticBreakdown: 'Anagram of IN LEN -> LINEN; definition: "Flax cloth".',
    etymologyOrContext: 'From Latin linum ("flax"), also giving us the word "line".',
    defaultIsCryptic: true,
  },
  {
    answer: 'SATIN',
    easyClue: 'Smooth glossy fabric with a lustrous sheen on one side',
    mediumClue: 'Silky evening-gown weave—anagram of "saint"',
    hardClue: 'Glossy fabric saint wore (5)',
    crypticBreakdown: 'Anagram ("wore") of SAINT -> SATIN; definition: "Glossy fabric".',
    etymologyOrContext: 'Named after Zaytun (Quanzhou), the medieval Chinese port that exported it.',
    defaultIsCryptic: true,
  },
  {
    answer: 'WEAVE',
    easyClue: 'Interlace warp and weft threads on a loom to create cloth',
    mediumClue: 'Crisscross threads on a loom—or thread through traffic',
    hardClue: 'Loom work or dodge in traffic (5)',
    crypticBreakdown: 'Double definition: "Loom work" and "dodge in traffic" -> WEAVE.',
    etymologyOrContext: 'Combines lengthwise warp threads with crosswise weft threads.',
    defaultIsCryptic: true,
  },
  {
    answer: 'LOOM',
    easyClue: 'Frame or machine used for weaving yarn into fabric',
    mediumClue: 'Weaver’s wooden frame—or appear darkly on the horizon',
    hardClue: 'Weaving frame or appear large (4)',
    crypticBreakdown: 'Double definition: "Weaving frame" and "appear large" -> LOOM.',
    etymologyOrContext: 'Jacquard’s 1804 punched-card loom inspired early programmable computers.',
    defaultIsCryptic: true,
  },
  {
    answer: 'QUILT',
    easyClue: 'Warm bedcover stitched together from patchwork squares and padding',
    mediumClue: 'Heirloom patchwork blanket stitched in geometric patterns',
    hardClue: 'Patchwork blanket lit qu? No, guilt swaps g for qu! (5)',
    crypticBreakdown: 'From Latin culcita ("stuffed mattress, cushion"); definition: "Patchwork blanket".',
    etymologyOrContext: 'Three-layer textile consisting of a pieced top, batting, and backing.',
    defaultIsCryptic: false,
  },
  {
    answer: 'TAPESTRY',
    easyClue: 'Heavy decorative handwoven textile depicting scenes, hung on walls',
    mediumClue: 'Woven medieval wall hanging—or a rich blend of interconnected stories',
    hardClue: 'Woven wall hanging try paste artfully (8)',
    crypticBreakdown: 'Anagram ("artfully") of TRY PASTE -> TAPESTRY; definition: "Woven wall hanging".',
    etymologyOrContext: 'The famous Bayeux Tapestry is actually an embroidered linen cloth nearly 70 meters long.',
    defaultIsCryptic: true,
  },
  {
    answer: 'SILK',
    easyClue: 'Fine lustrous natural protein fiber spun by silkworms',
    mediumClue: 'Road-naming luxury fiber spun into cocoons',
    hardClue: 'Cocoon fiber (4)',
    crypticBreakdown: 'From Greek serikos ("from the Seres/China"); definition: "Cocoon fiber".',
    etymologyOrContext: 'Sericulture began in China over 5,000 years ago.',
    defaultIsCryptic: false,
  },
  {
    answer: 'DENIM',
    easyClue: 'Sturdy cotton twill fabric dyed blue to make workwear and jeans',
    mediumClue: 'Levi’s sturdy fabric named "de Nimes" after a French town',
    hardClue: 'Jeans fabric mined awkwardly (5)',
    crypticBreakdown: 'Anagram ("awkwardly") of MINED -> DENIM; definition: "Jeans fabric".',
    etymologyOrContext: 'Shortened from French serge de Nimes ("twill from Nimes").',
    defaultIsCryptic: true,
  },

  // --- WORLD LANDMARKS, CITIES & GEOGRAPHY ---
  {
    answer: 'CAIRO',
    easyClue: 'Capital city of Egypt sitting near the Nile Delta and Great Pyramids',
    mediumClue: 'Nile metropolis next door to Giza’s ancient pyramids',
    hardClue: 'Egyptian capital or cia shuffled (5)',
    crypticBreakdown: 'Anagram ("shuffled") of OR CIA -> CAIRO; definition: "Egyptian capital".',
    etymologyOrContext: 'Arabic al-Qahirah ("The Victorious").',
    defaultIsCryptic: true,
  },
  {
    answer: 'KYOTO',
    easyClue: 'Historic Japanese city famed for temples, gardens, and wooden shrines',
    mediumClue: 'Japan’s thousand-year imperial capital before Tokyo',
    hardClue: 'Historic Japanese city took y arranged (5)',
    crypticBreakdown: 'Anagram ("arranged") of TOOK Y -> KYOTO; definition: "Historic Japanese city".',
    etymologyOrContext: 'Home to 17 UNESCO World Heritage shrines, temples, and castles.',
    defaultIsCryptic: true,
  },
  {
    answer: 'ATHENS',
    easyClue: 'Capital of Greece, crowned by the ancient Parthenon on the Acropolis',
    mediumClue: 'Birthplace of democracy overlooking the Aegean',
    hardClue: 'Greek capital hastens without s, swapped e (6)',
    crypticBreakdown: 'Anagram of HASTEN -> ATHENS; definition: "Greek capital".',
    etymologyOrContext: 'Named after Athena, patron goddess of wisdom and crafts.',
    defaultIsCryptic: true,
  },
  {
    answer: 'VIENNA',
    easyClue: 'Capital of Austria on the Danube, celebrated for coffeehouses and music',
    mediumClue: 'Danube capital of Mozart, Beethoven, and Sachertorte',
    hardClue: 'Austrian capital vane in rearranged (6)',
    crypticBreakdown: 'Anagram ("rearranged") of VANE IN -> VIENNA; definition: "Austrian capital".',
    etymologyOrContext: 'UNESCO-listed for its historic coffeehouse culture and classical music heritage.',
    defaultIsCryptic: true,
  },
  {
    answer: 'PRAGUE',
    easyClue: 'Capital of Czechia known as the City of a Hundred Spires on the Vltava',
    mediumClue: 'Bohemian capital famous for its 1410 astronomical clock',
    hardClue: 'Czech capital argue p loudly (6)',
    crypticBreakdown: 'Anagram ("loudly") of ARGUE P -> PRAGUE; definition: "Czech capital".',
    etymologyOrContext: 'Charles Bridge has spanned the Vltava River here since the 14th century.',
    defaultIsCryptic: true,
  },
  {
    answer: 'LISBON',
    easyClue: 'Hilly coastal capital of Portugal perched beside the Tagus estuary',
    mediumClue: 'City of yellow trams, pastel tiles, and Atlantic breezes',
    hardClue: 'Portuguese capital boils n gently (6)',
    crypticBreakdown: 'Anagram ("gently") of BOILS N -> LISBON; definition: "Portuguese capital".',
    etymologyOrContext: 'One of the oldest cities in Western Europe, predating Rome.',
    defaultIsCryptic: true,
  },
  {
    answer: 'ANDES',
    easyClue: 'Longest continental mountain range in the world, stretching down South America',
    mediumClue: 'Spine of peaks running from Venezuela to Patagonia',
    hardClue: 'South American range deans climbed (5)',
    crypticBreakdown: 'Anagram ("climbed") of DEANS -> ANDES; definition: "South American range".',
    etymologyOrContext: 'Stretches roughly 7,000 kilometers along South America’s western coast.',
    defaultIsCryptic: true,
  },
  {
    answer: 'SAHARA',
    easyClue: 'Vast hot desert stretching across northern Africa',
    mediumClue: 'Continent-wide sea of sand dunes and rocky plateaus in North Africa',
    hardClue: 'African desert a rash a? (6)',
    crypticBreakdown: 'From Arabic sahra ("desert"); definition: "African desert".',
    etymologyOrContext: 'Covers roughly 9.2 million square kilometers—comparable in area to the United States.',
    defaultIsCryptic: false,
  },
  {
    answer: 'NILE',
    easyClue: 'Great northward-flowing river of northeastern Africa',
    mediumClue: 'Ancient lifeblood of Egypt flowing from Lake Victoria to the Mediterranean',
    hardClue: 'African river line diverted (4)',
    crypticBreakdown: 'Anagram ("diverted") of LINE -> NILE; definition: "African river".',
    etymologyOrContext: 'Flows roughly 6,650 kilometers northward into a wide Mediterranean delta.',
    defaultIsCryptic: true,
  },
  {
    answer: 'ALPS',
    easyClue: 'High snow-capped mountain range curving across central Europe',
    mediumClue: 'European peaks spanning Switzerland, France, Italy, and Austria',
    hardClue: 'European peaks pals climbed (4)',
    crypticBreakdown: 'Anagram ("climbed") of PALS -> ALPS; definition: "European peaks".',
    etymologyOrContext: 'Mont Blanc is the highest peak in the range at 4,808 meters.',
    defaultIsCryptic: true,
  },
  {
    answer: 'TROPIC',
    easyClue: 'Circle of latitude marking where the Sun shines directly overhead at solstice',
    mediumClue: 'Cancer or Capricorn latitude line—or lush equatorial zone',
    hardClue: 'Latitude circle or hot zone optic r (6)',
    crypticBreakdown: 'Anagram of OPTIC R -> TROPIC; definition: "Latitude circle".',
    etymologyOrContext: 'From Greek tropikos ("of a turn"), where the Sun appears to turn back at solstice.',
    defaultIsCryptic: true,
  },
  {
    answer: 'ARCTIC',
    easyClue: 'Polar region surrounding the North Pole',
    mediumClue: 'Northern polar zone named after the Great Bear constellation',
    hardClue: 'Polar north critic without i, adding a (6)',
    crypticBreakdown: 'From Greek arktikos ("near the Bear/Ursa Major"); definition: "Polar north".',
    etymologyOrContext: 'Antarctic literally means "opposite the Arctic (opposite the Bear)".',
    defaultIsCryptic: false,
  },
  {
    answer: 'STEPPE',
    easyClue: 'Vast treeless grassy plain stretching across Eastern Europe and Central Asia',
    mediumClue: 'Temperate Eurasian prairie where wild horses galloped',
    hardClue: 'Grassy plain pets pe? (6)',
    crypticBreakdown: 'From Russian step ("flat dry plain"); definition: "Grassy plain".',
    etymologyOrContext: 'Forms a continuous grassland belt from Hungary to Mongolia.',
    defaultIsCryptic: false,
  },
  {
    answer: 'BASIN',
    easyClue: 'Bowl-shaped depression in land drained by a river system, or a washbowl',
    mediumClue: 'Amazon watershed bowl—or a porcelain sink',
    hardClue: 'Drainage bowl in abs (5)',
    crypticBreakdown: 'Anagram of IN ABS -> BASIN; definition: "Drainage bowl".',
    etymologyOrContext: 'River basins collect all precipitation flowing into a shared outlet.',
    defaultIsCryptic: true,
  },

  // --- ADDITIONAL HIGH-INTERLOCK GENERAL VOCABULARY ---
  {
    answer: 'SPARK',
    easyClue: 'Tiny glowing flash of fire, or sudden flash of inspiration',
    mediumClue: 'Flint strike—or the tiny glint that starts a bright idea',
    hardClue: 'Flash of fire parks wildly (5)',
    crypticBreakdown: 'Anagram ("wildly") of PARKS -> SPARK; definition: "Flash of fire".',
    etymologyOrContext: 'From Old English spearca ("glowing particle").',
    defaultIsCryptic: true,
  },
  {
    answer: 'EMBER',
    easyClue: 'Small glowing piece of wood or coal still hot in dying campfire ashes',
    mediumClue: 'Glowing remnant in the fireplace after flames fade',
    hardClue: 'Glowing coal seen in December (5)',
    crypticBreakdown: 'Hidden word ("seen in") DecEMBER -> EMBER; definition: "Glowing coal".',
    etymologyOrContext: 'Preserves heat long enough to rekindle a morning hearth fire.',
    defaultIsCryptic: true,
  },
  {
    answer: 'FLAME',
    easyClue: 'Visible glowing tongue of burning gas above a candle or campfire',
    mediumClue: 'Olympic torch blaze—or an ardent sweetheart of old',
    hardClue: 'Fire tongue male f danced (5)',
    crypticBreakdown: 'Anagram ("danced") of MALE F -> FLAME; definition: "Fire tongue".',
    etymologyOrContext: 'From Latin flamma ("blaze").',
    defaultIsCryptic: true,
  },
  {
    answer: 'TORCH',
    easyClue: 'Flaming stick carried in hand, or British word for a flashlight',
    mediumClue: 'Olympic relay flame—or what Londoners call a flashlight',
    hardClue: 'Hand-held light rot ch? (5)',
    crypticBreakdown: 'From Old French torche ("twisted straw dipped in pitch"); definition: "Hand-held light".',
    etymologyOrContext: 'Modern Olympic torch relays began at the 1936 Berlin Games.',
    defaultIsCryptic: false,
  },
  {
    answer: 'PULSE',
    easyClue: 'Rhythmic throbbing of blood in an artery, or edible beans and lentils',
    mediumClue: 'Wrist heartbeat—or protein-rich dried peas and lentils',
    hardClue: 'Heartbeat or legume super without r, plus l? (5)',
    crypticBreakdown: 'Double definition: "Heartbeat" and "edible legume" -> PULSE.',
    etymologyOrContext: 'From Latin pulsus ("a beating, striking").',
    defaultIsCryptic: true,
  },
  {
    answer: 'NERVE',
    easyClue: 'Bundle of fibers carrying signals between the brain and body',
    mediumClue: 'Neural wire—or bold courage under pressure',
    hardClue: 'Signal fiber or boldness never arranged (5)',
    crypticBreakdown: 'Anagram ("arranged") of NEVER -> NERVE; definition: "Signal fiber or boldness".',
    etymologyOrContext: 'Sensory nerves carry signals inward; motor nerves carry commands outward.',
    defaultIsCryptic: true,
  },
  {
    answer: 'CORTEX',
    easyClue: 'Outer wrinkled gray-matter layer of the brain or outer layer of an organ',
    mediumClue: 'Brain’s thinking outer rind whose Latin name means "tree bark"',
    hardClue: 'Outer brain layer cost x? No, ex rot c! (6)',
    crypticBreakdown: 'Latin cortex ("bark, rind, shell"); definition: "Outer brain layer".',
    etymologyOrContext: 'The cerebral cortex handles language, memory, perception, and reasoning.',
    defaultIsCryptic: false,
  },
  {
    answer: 'GENOME',
    easyClue: 'Complete set of DNA instructions inside an organism',
    mediumClue: 'Full genetic blueprint mapped letter by letter',
    hardClue: 'Full DNA map go mene? (6)',
    crypticBreakdown: 'Portmanteau of GENE + CHROMOSOME; definition: "Full DNA map".',
    etymologyOrContext: 'The human genome contains roughly 3 billion DNA base pairs.',
    defaultIsCryptic: false,
  },
  {
    answer: 'ENZYME',
    easyClue: 'Specialized protein that accelerates chemical reactions in living cells',
    mediumClue: 'Biological catalyst inside saliva, yeast, and cells',
    hardClue: 'Biological catalyst (6)',
    crypticBreakdown: 'From Greek enzymos ("leavened, in yeast"); definition: "Biological catalyst".',
    etymologyOrContext: 'First identified through yeast fermentation studies in the 19th century.',
    defaultIsCryptic: false,
  },
  {
    answer: 'VECTORED',
    easyClue: 'Aimed or directed along a controlled flight path or trajectory',
    mediumClue: 'Steered by thrusters along a precise bearing',
    hardClue: 'Directed cleanly covert ed turned (8)',
    crypticBreakdown: 'Anagram ("turned") of COVERT ED -> VECTORED; definition: "Directed".',
    etymologyOrContext: 'Thrust vectoring lets rockets and jets steer without aerodynamic fins.',
    defaultIsCryptic: true,
  },
  {
    answer: 'SPIRAL',
    easyClue: 'Curve winding continuously around a center point like a seashell or galaxy',
    mediumClue: 'Nautilus shell or Milky Way pinwheel pattern',
    hardClue: 'Winding curve trails without t (6)',
    crypticBreakdown: 'Anagram ("without t") of TRAILS? Wait: P-A-I-R-S-L -> PARILS; anagram of APRIL S -> SPIRAL.',
    etymologyOrContext: 'Fibonacci spirals appear in sunflowers, pinecones, and galaxies.',
    defaultIsCryptic: true,
  },
  {
    answer: 'HELIX',
    easyClue: 'Three-dimensional corkscrew curve, famous in DNA’s double structure',
    mediumClue: 'Corkscrew staircase shape—double in DNA',
    hardClue: 'Corkscrew shape (5)',
    crypticBreakdown: 'From Greek helix ("spiral, twisted"); definition: "Corkscrew shape".',
    etymologyOrContext: 'Watson, Crick, Franklin, and Wilkins revealed DNA’s double-helix structure in 1953.',
    defaultIsCryptic: false,
  },
  {
    answer: 'RATIO',
    easyClue: 'Quantitative comparison showing how many times one value contains another',
    mediumClue: 'Chef’s ingredient proportion—or the golden 1.618 fraction',
    hardClue: 'Proportion oration without n, o (5)',
    crypticBreakdown: 'Latin ratio ("reckoning, reason"); definition: "Proportion".',
    etymologyOrContext: 'A ratio of 16:9 defines modern widescreen HD displays.',
    defaultIsCryptic: false,
  },
  {
    answer: 'FACTOR',
    easyClue: 'Number that divides another evenly, or a circumstance influencing a result',
    mediumClue: '2, 3, or 6 for 12—or a key ingredient in a decision',
    hardClue: 'Divisor or key element craft o reshaped (6)',
    crypticBreakdown: 'Anagram ("reshaped") of CRAFT O -> FACTOR; definition: "Divisor or key element".',
    etymologyOrContext: 'From Latin factor ("doer, maker").',
    defaultIsCryptic: true,
  },
  {
    answer: 'TANGENT',
    easyClue: 'Line touching a curve at a single point, or a sudden off-topic digression',
    mediumClue: 'Geometry curve-skimmer—or going off-subject mid-conversation',
    hardClue: 'Touching line or digression net gnat caught (7)',
    crypticBreakdown: 'Anagram ("caught") of NET GNAT -> TANGENT; definition: "Touching line or digression".',
    etymologyOrContext: 'From Latin tangere ("to touch").',
    defaultIsCryptic: true,
  },
  {
    answer: 'RADIUS',
    easyClue: 'Straight distance from the center of a circle to its outer edge',
    mediumClue: 'Half a circle’s diameter—or a bone in your forearm',
    hardClue: 'Circle half-width or arm bone raids u around (6)',
    crypticBreakdown: 'Anagram ("around") of RAIDS U -> RADIUS; definition: "Circle half-width or arm bone".',
    etymologyOrContext: 'Latin for "spoke of a wheel, ray".',
    defaultIsCryptic: true,
  },
  {
    answer: 'SPHERE',
    easyClue: 'Perfectly round three-dimensional ball-shaped solid like a globe',
    mediumClue: 'Three-dimensional cousin of a circle—or a realm of influence',
    hardClue: 'Round globe herpes without h? No, res hep! (6)',
    crypticBreakdown: 'From Greek sphaira ("ball, globe"); definition: "Round globe".',
    etymologyOrContext: 'Encloses the maximum possible volume for a given surface area.',
    defaultIsCryptic: false,
  },
  {
    answer: 'VERTEX',
    easyClue: 'Corner point where two sides of a polygon or edges of a solid meet',
    mediumClue: 'Triangle’s pointed corner—or apex of an angle',
    hardClue: 'Corner point (6)',
    crypticBreakdown: 'From Latin vertex ("whirlpool, peak, summit"); definition: "Corner point".',
    etymologyOrContext: 'Plural is vertices or vertexes.',
    defaultIsCryptic: false,
  },
  {
    answer: 'QUIVER',
    easyClue: 'Cylindrical leather case worn by an archer to hold arrows, or to tremble slightly',
    mediumClue: 'Robin Hood’s arrow holder—or a slight shiver in the cold',
    hardClue: 'Arrow case or slight tremble (6)',
    crypticBreakdown: 'Double definition: "Arrow case" and "slight tremble" -> QUIVER.',
    etymologyOrContext: 'From Old French cuivre ("arrow case") and Old English cwifer ("eager, nimble").',
    defaultIsCryptic: true,
  },
];

const COMBINED_RAW_LEXICON: RawWordItem[] = [
  ...RAW_LEXICON,
  ...LEXICON_EXPANSION_A,
  ...LEXICON_EXPANSION_B,
  ...LEXICON_EXPANSION_C,
];

const UNIVERSAL_BRIDGE_WORDS: WordEntrySeed[] = COMBINED_RAW_LEXICON.map((item) => ({
  ...item,
  standardClue: item.easyClue,
  crypticClue: item.hardClue,
}));

const wordMap = new Map<string, WordEntrySeed>();
for (const entry of UNIVERSAL_BRIDGE_WORDS) {
  wordMap.set(entry.answer, entry);
}

// Expanded Weekend Themes covering Film, Television, Science Fiction, Music, Culinary, Mythology, Astronomy, Ecology, Literature & Navigation
export interface WeekendThemeBank {
  id: string;
  themeName: string;
  titleSuffix: string;
  visual: VisualThemeId;
  priorityAnswers: string[];
}

export const WEEKEND_THEME_BANKS: WeekendThemeBank[] = [
  {
    id: 'weekend-film-cinema',
    themeName: 'Film, Cinema & The Silver Screen',
    titleSuffix: 'Premiere Night & Auteurs',
    visual: 'editorial',
    priorityAnswers: [
      'DIRECTOR',
      'PREMIERE',
      'THRILLER',
      'MATINEE',
      'MONTAGE',
      'CINEMA',
      'CAMERA',
      'SEQUEL',
      'SCRIPT',
      'STUDIO',
      'AUTEUR',
      'OSCAR',
      'ACTOR',
      'SCENE',
      'DRAMA',
      'OPERA',
      'ARENA',
      'LEGEND',
      'SATIRE',
      'CAMEO',
      'GENRE',
      'CLIMAX',
      'STAGE',
      'DEBUT',
      'TRAILER',
      'SHUTTER',
      'FRAME',
      'FOCUS',
      'USHER',
      'EXTRA',
      'PROPS',
      'SPOTLIGHT',
      'CURTAIN',
      'BACKDROP',
      'TRIPOD',
      'LENS',
      'ENCORES',
    ],
  },
  {
    id: 'weekend-television-broadcast',
    themeName: 'Television, Broadcast & Media',
    titleSuffix: 'Prime Time, Bylines & Finales',
    visual: 'observatory',
    priorityAnswers: [
      'EPISODE',
      'NETWORK',
      'CHANNEL',
      'SITCOM',
      'FINALE',
      'SERIES',
      'STREAM',
      'REMOTE',
      'SERIAL',
      'AERIAL',
      'ANCHOR',
      'PILOT',
      'DRAMA',
      'SCRIPT',
      'STUDIO',
      'CAMERA',
      'ACTOR',
      'SCENE',
      'SATIRE',
      'BYLINE',
      'SCOOP',
      'EDITOR',
      'COLUMN',
      'SIGNAL',
      'RADIO',
      'STATIC',
      'PODCAST',
      'BULLETIN',
      'HEADLINE',
      'ARCHIVE',
      'GAZETTE',
      'CHRONICLE',
    ],
  },
  {
    id: 'weekend-science-fiction',
    themeName: 'Science Fiction, Tech & Futurism',
    titleSuffix: 'Starships, Quantum & Portals',
    visual: 'observatory',
    priorityAnswers: [
      'STARSHIP',
      'DYSTOPIA',
      'ANDROID',
      'ORBITAL',
      'ECLIPSE',
      'CYBORG',
      'GALAXY',
      'PORTAL',
      'PHASER',
      'MUTANT',
      'COSMOS',
      'VORTEX',
      'NEBULA',
      'QUASAR',
      'PULSAR',
      'ALIEN',
      'ROBOT',
      'CLONE',
      'LASER',
      'TITAN',
      'LUNAR',
      'SOLAR',
      'QUANTUM',
      'PLASMA',
      'PHOTON',
      'PROTON',
      'NEUTRON',
      'FUSION',
      'BINARY',
      'MATRIX',
      'KERNEL',
      'SERVER',
      'ROUTER',
      'PIXEL',
      'VECTOR',
      'DRONE',
      'PROBE',
      'ROVER',
      'REACTOR',
      'BYTE',
      'CODE',
      'DATA',
      'NODE',
      'MODULE',
      'VECTORED',
    ],
  },
  {
    id: 'weekend-music-symphony',
    themeName: 'Popular Music, Stage & Symphony',
    titleSuffix: 'Encores, Melodies & Concert Halls',
    visual: 'mahogany',
    priorityAnswers: [
      'SYMPHONY',
      'MELODY',
      'CHORUS',
      'ENCORE',
      'SONATA',
      'BALLAD',
      'TEMPO',
      'OPERA',
      'SCALE',
      'ARENA',
      'VERSE',
      'CANON',
      'SONNET',
      'STANZA',
      'DRAMA',
      'SCENE',
      'ACTOR',
      'STUDIO',
      'OCTAVE',
      'CHORD',
      'CADENCE',
      'LYRIC',
      'TREBLE',
      'TENOR',
      'SOPRANO',
      'RHYTHM',
      'CELLO',
      'VIOLA',
      'FLUTE',
      'TRUMPET',
      'PIANO',
      'FUGUE',
      'ARIA',
      'DUET',
      'TANGO',
      'WALTZ',
      'HARP',
      'OBOE',
      'ORGAN',
      'JAZZ',
      'ENCORES',
    ],
  },
  {
    id: 'weekend-culinary-gastronomy',
    themeName: 'Culinary Arts & World Gastronomy',
    titleSuffix: 'Saffron, Truffles & Bistros',
    visual: 'botanical',
    priorityAnswers: [
      'SAFFRON',
      'TRUFFLE',
      'BISTRO',
      'RECIPE',
      'PALATE',
      'NECTAR',
      'AROMA',
      'FEAST',
      'FLORA',
      'GROVE',
      'MAPLE',
      'LOTUS',
      'PETAL',
      'GARLIC',
      'THYME',
      'BASIL',
      'CUMIN',
      'GINGER',
      'NUTMEG',
      'VANILLA',
      'CACAO',
      'CITRUS',
      'OLIVE',
      'BRIOCHE',
      'BROTH',
      'SAUCE',
      'GLAZE',
      'BRAISE',
      'WHISK',
      'LADLE',
      'SIEVE',
      'CRUMB',
      'ROAST',
      'MINT',
    ],
  },
  {
    id: 'weekend-astronomy-space',
    themeName: 'Astronomy & Deep Space',
    titleSuffix: 'Celestial Cartography',
    visual: 'observatory',
    priorityAnswers: [
      'CONSTELLATION',
      'OBSERVATORY',
      'ASTRONOMER',
      'METEORITE',
      'TELESCOPE',
      'PARALLAX',
      'SOLSTICE',
      'SPECTRUM',
      'EQUINOX',
      'ECLIPSE',
      'ORBITAL',
      'RADIANT',
      'HORIZON',
      'NEBULA',
      'ZENITH',
      'APOGEE',
      'QUASAR',
      'PULSAR',
      'CORONA',
      'ALBEDO',
      'AURORA',
      'COSMOS',
      'VORTEX',
      'COMET',
      'UMBRA',
      'NADIR',
      'TITAN',
      'ORION',
      'ATLAS',
      'NOVA',
      'LUNAR',
      'SOLAR',
      'ASTRA',
      'EPOCH',
      'PHASE',
      'PHOTON',
      'PLASMA',
      'FUSION',
      'CRATER',
      'TWILIGHT',
    ],
  },
  {
    id: 'weekend-ecology-nature',
    themeName: 'Ecology, Earth & Wildlife',
    titleSuffix: 'The Living Biosphere',
    visual: 'botanical',
    priorityAnswers: [
      'GLACIER',
      'ESTUARY',
      'SAVANNA',
      'MONSOON',
      'ECOLOGY',
      'HABITAT',
      'SPECIES',
      'CANOPY',
      'POLLEN',
      'NECTAR',
      'LICHEN',
      'TUNDRA',
      'MEADOW',
      'ISLAND',
      'LAGOON',
      'STRAIT',
      'DELTA',
      'FLORA',
      'CORAL',
      'SPORE',
      'PETAL',
      'BIOME',
      'GROVE',
      'CEDAR',
      'MAPLE',
      'ASPEN',
      'LOTUS',
      'ALGAE',
      'OASIS',
      'RIVER',
      'OCEAN',
      'CANYON',
      'VALLEY',
      'SUMMIT',
      'RIDGE',
      'GEYSER',
      'FJORD',
      'PLATEAU',
      'CIRRUS',
      'FALCON',
      'OSPREY',
      'HERON',
      'OTTER',
      'BADGER',
      'GAZELLE',
      'DOLPHIN',
    ],
  },
  {
    id: 'weekend-literature-myth',
    themeName: 'Literature, Art & Antiquity',
    titleSuffix: 'Oracles, Frescoes & Belles-Lettres',
    visual: 'editorial',
    priorityAnswers: [
      'SONNET',
      'STANZA',
      'BALLAD',
      'SATIRE',
      'MEMOIR',
      'LEGEND',
      'ORACLE',
      'ENIGMA',
      'CYPHER',
      'SCROLL',
      'SCRIBE',
      'ANNALS',
      'NOVEL',
      'PROSE',
      'VERSE',
      'DRAMA',
      'FABLE',
      'ELEGY',
      'INDEX',
      'CANON',
      'TROPE',
      'IRONY',
      'ESSAY',
      'ODYSSEY',
      'PROLOGUE',
      'EPILOGUE',
      'CANVAS',
      'EASEL',
      'PASTEL',
      'FRESCO',
      'MURAL',
      'SKETCH',
      'PALETTE',
      'STATUE',
      'LOGIC',
      'ETHICS',
      'LEXICON',
      'IDIOM',
    ],
  },
  {
    id: 'weekend-maritime-navigation',
    themeName: 'Navigation, Travel & High Seas',
    titleSuffix: 'Galleons, Sextants & Compasses',
    visual: 'mahogany',
    priorityAnswers: [
      'COMPASS',
      'SEXTANT',
      'MARINER',
      'GALLEON',
      'HORIZON',
      'ESTUARY',
      'HARBOR',
      'ANCHOR',
      'BEACON',
      'VOYAGE',
      'ISLAND',
      'STRAIT',
      'LAGOON',
      'VESSEL',
      'STERN',
      'CHART',
      'SHOAL',
      'FLEET',
      'HAVEN',
      'INLET',
      'ATOLL',
      'TRADE',
      'NORTH',
      'SOUTH',
      'OCEAN',
      'RIVER',
      'FERRY',
      'BRIDGE',
      'TUNNEL',
      'CABIN',
      'TICKET',
      'PASSPORT',
      'BAGGAGE',
      'HOSTEL',
      'EXPRESS',
      'CARAVAN',
      'CAIRO',
      'KYOTO',
      'LISBON',
    ],
  },
  {
    id: 'weekend-architecture-history',
    themeName: 'Architecture, Royalty & History',
    titleSuffix: 'Citadels, Spires & Crowns',
    visual: 'missing-piece',
    priorityAnswers: [
      'SPIRE',
      'VAULT',
      'PILLAR',
      'FRIEZE',
      'ALCOVE',
      'ATRIUM',
      'FACADE',
      'PLAZA',
      'BRIDGE',
      'MASON',
      'MORTAR',
      'MARBLE',
      'GRANITE',
      'GABLE',
      'TURRET',
      'CORNICE',
      'DOME',
      'ARCH',
      'EMPIRE',
      'CROWN',
      'THRONE',
      'SCEPTER',
      'HERALD',
      'KNIGHT',
      'CASTLE',
      'CITADEL',
      'RELIC',
      'BRONZE',
      'DYNASTY',
      'PHARAOH',
      'SENATE',
      'TREATY',
      'CHARTER',
      'GUILD',
      'SHIELD',
      'LANCE',
      'ATHENS',
      'VIENNA',
      'PRAGUE',
      'TAPESTRY',
    ],
  },
  {
    id: 'weekend-science-invention',
    themeName: 'Chemistry, Physics & Strategy',
    titleSuffix: 'Atoms, Optics & Gambits',
    visual: 'missing-piece',
    priorityAnswers: [
      'ATOM',
      'CARBON',
      'OXYGEN',
      'HELIUM',
      'QUARTZ',
      'COBALT',
      'COPPER',
      'SILVER',
      'NICKEL',
      'CATALYST',
      'SOLVENT',
      'ISOTOPE',
      'KINETIC',
      'INERTIA',
      'GRAVITY',
      'TORQUE',
      'OPTICS',
      'VALENCE',
      'ALKALI',
      'ACID',
      'PULSE',
      'NERVE',
      'CORTEX',
      'GENOME',
      'ENZYME',
      'SPIRAL',
      'HELIX',
      'RATIO',
      'FACTOR',
      'TANGENT',
      'RADIUS',
      'SPHERE',
      'VERTEX',
      'CHESS',
      'BISHOP',
      'GAMBIT',
      'AXIOM',
      'PARADOX',
      'PRISM',
      'LASER',
    ],
  },
];

interface InternalPlacedWord {
  seed: WordEntrySeed;
  row: number;
  col: number;
  direction: Direction;
}

function canPlaceWordOnGrid(
  letters: (string | null)[][],
  hOccupied: boolean[][],
  vOccupied: boolean[][],
  word: string,
  row: number,
  col: number,
  direction: Direction,
  requireIntersection: boolean,
  gridSize: GridSizeOption
): { valid: boolean; intersections: number } {
  const len = word.length;
  if (direction === 'across') {
    if (row < 0 || row >= gridSize || col < 0 || col + len > gridSize) {
      return { valid: false, intersections: 0 };
    }
    if (col > 0 && letters[row][col - 1] !== null) {
      return { valid: false, intersections: 0 };
    }
    if (col + len < gridSize && letters[row][col + len] !== null) {
      return { valid: false, intersections: 0 };
    }

    let intersections = 0;
    for (let i = 0; i < len; i++) {
      const r = row;
      const c = col + i;
      const ch = word[i];
      if (hOccupied[r][c]) {
        return { valid: false, intersections: 0 };
      }
      const existing = letters[r][c];
      if (existing !== null) {
        if (existing !== ch) {
          return { valid: false, intersections: 0 };
        }
        intersections++;
      } else {
        if (r > 0 && letters[r - 1][c] !== null) {
          return { valid: false, intersections: 0 };
        }
        if (r + 1 < gridSize && letters[r + 1][c] !== null) {
          return { valid: false, intersections: 0 };
        }
      }
    }
    if (requireIntersection && intersections === 0) {
      return { valid: false, intersections: 0 };
    }
    return { valid: true, intersections };
  } else {
    if (col < 0 || col >= gridSize || row < 0 || row + len > gridSize) {
      return { valid: false, intersections: 0 };
    }
    if (row > 0 && letters[row - 1][col] !== null) {
      return { valid: false, intersections: 0 };
    }
    if (row + len < gridSize && letters[row + len][col] !== null) {
      return { valid: false, intersections: 0 };
    }

    let intersections = 0;
    for (let i = 0; i < len; i++) {
      const r = row + i;
      const c = col;
      const ch = word[i];
      if (vOccupied[r][c]) {
        return { valid: false, intersections: 0 };
      }
      const existing = letters[r][c];
      if (existing !== null) {
        if (existing !== ch) {
          return { valid: false, intersections: 0 };
        }
        intersections++;
      } else {
        if (c > 0 && letters[r][c - 1] !== null) {
          return { valid: false, intersections: 0 };
        }
        if (c + 1 < gridSize && letters[r][c + 1] !== null) {
          return { valid: false, intersections: 0 };
        }
      }
    }
    if (requireIntersection && intersections === 0) {
      return { valid: false, intersections: 0 };
    }
    return { valid: true, intersections };
  }
}

export function compilePuzzleGrid(
  id: string,
  title: string,
  themeName: string,
  editionType: EditionScheduleType,
  gridSize: GridSizeOption,
  dayOfWeekName: string,
  subtitle: string,
  editionDate: string,
  archiveDate: string,
  recommendedVisualTheme: VisualThemeId,
  orderedCandidatePool: WordEntrySeed[]
): PuzzleDefinition {
  const filteredPool = orderedCandidatePool.filter(
    (w) => w.answer.length >= 3 && w.answer.length <= gridSize
  );

  const letters: (string | null)[][] = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => null)
  );
  const hOccupied: boolean[][] = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => false)
  );
  const vOccupied: boolean[][] = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => false)
  );

  const placedWords: InternalPlacedWord[] = [];
  const usedAnswers = new Set<string>();

  const commitWord = (
    seed: WordEntrySeed,
    row: number,
    col: number,
    direction: Direction
  ) => {
    const word = seed.answer;
    for (let i = 0; i < word.length; i++) {
      const r = direction === 'across' ? row : row + i;
      const c = direction === 'across' ? col + i : col;
      letters[r][c] = word[i];
      if (direction === 'across') {
        hOccupied[r][c] = true;
      } else {
        vOccupied[r][c] = true;
      }
    }
    placedWords.push({ seed, row, col, direction });
    usedAnswers.add(word);
  };

  const firstSeed =
    filteredPool.find((w) =>
      gridSize === 8
        ? w.answer.length >= 5 && w.answer.length <= 7
        : w.answer.length >= 6
    ) || filteredPool[0];

  const startRow = gridSize === 8 ? 3 : 9;
  const startCol = Math.max(
    0,
    Math.floor((gridSize - firstSeed.answer.length) / 2)
  );
  commitWord(firstSeed, startRow, startCol, 'across');

  const maxTargetWords = gridSize === 8 ? 14 : 38;
  const maxPasses = 8;

  for (let pass = 0; pass < maxPasses; pass++) {
    let placedInPass = false;

    for (const candidate of filteredPool) {
      if (usedAnswers.has(candidate.answer)) continue;
      if (placedWords.length >= maxTargetWords) break;

      let bestPlacement: {
        row: number;
        col: number;
        direction: Direction;
        score: number;
      } | null = null;

      const acrossCount = placedWords.filter(
        (w) => w.direction === 'across'
      ).length;
      const downCount = placedWords.filter((w) => w.direction === 'down').length;
      const preferredDirection: Direction =
        acrossCount <= downCount ? 'across' : 'down';

      const directions: Direction[] =
        preferredDirection === 'across'
          ? ['across', 'down']
          : ['down', 'across'];

      for (const dir of directions) {
        for (let r = 0; r < gridSize; r++) {
          for (let c = 0; c < gridSize; c++) {
            const check = canPlaceWordOnGrid(
              letters,
              hOccupied,
              vOccupied,
              candidate.answer,
              r,
              c,
              dir,
              true,
              gridSize
            );
            if (!check.valid) continue;

            const endR =
              dir === 'down' ? r + candidate.answer.length - 1 : r;
            const endC =
              dir === 'across' ? c + candidate.answer.length - 1 : c;

            let edgeBonus = 0;
            if (r === 0 || endR === gridSize - 1) edgeBonus += 14;
            if (c === 0 || endC === gridSize - 1) edgeBonus += 14;
            if (r <= 1 || endR >= gridSize - 2) edgeBonus += 6;
            if (c <= 1 || endC >= gridSize - 2) edgeBonus += 6;

            const dirBonus = dir === preferredDirection ? 8 : 0;
            const score =
              check.intersections * 35 +
              candidate.answer.length * 2 +
              edgeBonus +
              dirBonus;

            if (!bestPlacement || score > bestPlacement.score) {
              bestPlacement = { row: r, col: c, direction: dir, score };
            }
          }
        }
      }

      if (bestPlacement) {
        commitWord(
          candidate,
          bestPlacement.row,
          bestPlacement.col,
          bestPlacement.direction
        );
        placedInPass = true;
      }
    }

    if (!placedInPass) break;
  }

  const grid: GridCellData[][] = Array.from({ length: gridSize }, (_, r) =>
    Array.from({ length: gridSize }, (__, c) => ({
      row: r,
      col: c,
      isBlocked: letters[r][c] === null,
      solution: letters[r][c] ?? '',
    }))
  );

  const acrossByStart = new Map<string, InternalPlacedWord>();
  const downByStart = new Map<string, InternalPlacedWord>();
  for (const pw of placedWords) {
    const key = `${pw.row},${pw.col}`;
    if (pw.direction === 'across') {
      acrossByStart.set(key, pw);
    } else {
      downByStart.set(key, pw);
    }
  }

  const acrossClues: PlacedClue[] = [];
  const downClues: PlacedClue[] = [];
  let clueCounter = 1;
  let totalWhiteCells = 0;

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (!grid[r][c].isBlocked) {
        totalWhiteCells++;
      }
      const key = `${r},${c}`;
      const startsAcross = acrossByStart.get(key);
      const startsDown = downByStart.get(key);

      if (startsAcross || startsDown) {
        const num = clueCounter++;
        grid[r][c].number = num;

        if (startsAcross) {
          const clueId = `${num}-across`;
          acrossClues.push({
            id: clueId,
            number: num,
            direction: 'across',
            row: r,
            col: c,
            answer: startsAcross.seed.answer,
            length: startsAcross.seed.answer.length,
            easyClue: startsAcross.seed.easyClue,
            mediumClue: startsAcross.seed.mediumClue,
            hardClue: startsAcross.seed.hardClue,
            standardClue: startsAcross.seed.standardClue,
            crypticClue: startsAcross.seed.crypticClue,
            crypticBreakdown: startsAcross.seed.crypticBreakdown,
            etymologyOrContext: startsAcross.seed.etymologyOrContext,
            isCrypticInMixed: startsAcross.seed.defaultIsCryptic,
          });
          for (let i = 0; i < startsAcross.seed.answer.length; i++) {
            grid[r][c + i].acrossClueId = clueId;
          }
        }

        if (startsDown) {
          const clueId = `${num}-down`;
          downClues.push({
            id: clueId,
            number: num,
            direction: 'down',
            row: r,
            col: c,
            answer: startsDown.seed.answer,
            length: startsDown.seed.answer.length,
            easyClue: startsDown.seed.easyClue,
            mediumClue: startsDown.seed.mediumClue,
            hardClue: startsDown.seed.hardClue,
            standardClue: startsDown.seed.standardClue,
            crypticClue: startsDown.seed.crypticClue,
            crypticBreakdown: startsDown.seed.crypticBreakdown,
            etymologyOrContext: startsDown.seed.etymologyOrContext,
            isCrypticInMixed: startsDown.seed.defaultIsCryptic,
          });
          for (let i = 0; i < startsDown.seed.answer.length; i++) {
            grid[r + i][c].downClueId = clueId;
          }
        }
      }
    }
  }

  return {
    id,
    title,
    themeName,
    editionType,
    gridSize,
    dayOfWeekName,
    subtitle,
    editionDate,
    archiveDate,
    recommendedVisualTheme,
    grid,
    clues: {
      across: acrossClues,
      down: downClues,
    },
    totalWhiteCells,
  };
}

export function compile20x20Puzzle(
  id: string,
  title: string,
  themeName: string,
  editionType: EditionScheduleType,
  dayOfWeekName: string,
  subtitle: string,
  editionDate: string,
  archiveDate: string,
  recommendedVisualTheme: VisualThemeId,
  orderedCandidatePool: WordEntrySeed[]
): PuzzleDefinition {
  return compilePuzzleGrid(
    id,
    title,
    themeName,
    editionType,
    20,
    dayOfWeekName,
    subtitle,
    editionDate,
    archiveDate,
    recommendedVisualTheme,
    orderedCandidatePool
  );
}

/**
 * Returns the current date & time components in London, UK ('Europe/London' timezone).
 * All new daily crosswords generate at 00:00 London, UK time.
 */
export function getLondonDateTimeParts(now: Date = new Date()): {
  isoDate: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  countdownToMidnight: string;
} {
  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const getPart = (type: string) =>
      parts.find((p) => p.type === type)?.value || '00';

    const year = parseInt(getPart('year'), 10);
    const month = parseInt(getPart('month'), 10);
    const day = parseInt(getPart('day'), 10);
    const hour = parseInt(getPart('hour'), 10) % 24;
    const minute = parseInt(getPart('minute'), 10);
    const second = parseInt(getPart('second'), 10);

    const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;

    const elapsedSecondsToday = hour * 3600 + minute * 60 + second;
    const remainingSeconds = Math.max(0, 86400 - elapsedSecondsToday);
    const remH = Math.floor(remainingSeconds / 3600);
    const remM = Math.floor((remainingSeconds % 3600) / 60);
    const remS = remainingSeconds % 60;
    const countdownToMidnight = `${String(remH).padStart(2, '0')}:${String(
      remM
    ).padStart(2, '0')}:${String(remS).padStart(2, '0')}`;

    return {
      isoDate,
      year,
      month,
      day,
      hour,
      minute,
      second,
      countdownToMidnight,
    };
  } catch {
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth() + 1;
    const day = now.getUTCDate();
    const hour = now.getUTCHours();
    const minute = now.getUTCMinutes();
    const second = now.getUTCSeconds();
    const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;
    return {
      isoDate,
      year,
      month,
      day,
      hour,
      minute,
      second,
      countdownToMidnight: '00:00:00',
    };
  }
}

export function getTodayIsoDate(): string {
  return getLondonDateTimeParts().isoDate;
}

function deterministicShuffle<T>(items: readonly T[], initialSeed: number): T[] {
  const arr = [...items];
  let seed = initialSeed >>> 0 || 987654321;
  for (let i = arr.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

// Stable interleaved master ordering so cohort slices carry balanced word lengths and themes
const MASTER_INTERLEAVED_WORDS: WordEntrySeed[] = deterministicShuffle(
  UNIVERSAL_BRIDGE_WORDS,
  0x6d2b79f5
);

function buildRotatedCohortPool(
  sourceWords: WordEntrySeed[],
  cohortCount: number,
  epochDays: number,
  dateSeed: number
): WordEntrySeed[] {
  const cohorts: WordEntrySeed[][] = Array.from(
    { length: cohortCount },
    () => []
  );
  for (let i = 0; i < sourceWords.length; i++) {
    cohorts[i % cohortCount].push(sourceWords[i]);
  }
  const activeCohortIdx =
    ((epochDays % cohortCount) + cohortCount) % cohortCount;
  const primary = deterministicShuffle(cohorts[activeCohortIdx], dateSeed);
  const remainder: WordEntrySeed[] = [];
  for (let offset = 1; offset < cohortCount; offset++) {
    const idx = (activeCohortIdx + offset) % cohortCount;
    remainder.push(
      ...deterministicShuffle(cohorts[idx], (dateSeed ^ (offset * 7919)) >>> 0)
    );
  }
  return [...primary, ...remainder];
}

/**
 * Generates a deterministic 20x20 Daily Crossword for any YYYY-MM-DD London date:
 * - Weekdays (Monday - Friday): General Knowledge Crosswords rotating through disjoint lexicon cohorts
 * - Weekends (Saturday & Sunday): Special Themed Crosswords with shuffled thematic & fallback pools
 */
export function generateArchivePuzzleForDate(
  isoDate: string,
  forcedThemeBankId?: string
): PuzzleDefinition {
  const parsedDate = new Date(`${isoDate}T12:00:00Z`);
  const dayOfWeek = isNaN(parsedDate.getTime()) ? 4 : parsedDate.getUTCDay(); // 0 = Sun, 6 = Sat
  const isWeekend =
    Boolean(forcedThemeBankId) || dayOfWeek === 0 || dayOfWeek === 6;

  const dayOfWeekName = isNaN(parsedDate.getTime())
    ? 'Daily'
    : parsedDate.toLocaleDateString('en-GB', {
        weekday: 'long',
        timeZone: 'UTC',
      });

  const formattedDate = isNaN(parsedDate.getTime())
    ? isoDate
    : parsedDate.toLocaleDateString('en-GB', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      });

  // Deterministic hash from YYYY-MM-DD
  let hash = 0;
  for (let i = 0; i < isoDate.length; i++) {
    hash = (hash * 31 + isoDate.charCodeAt(i)) >>> 0;
  }

  const epochDays = isNaN(parsedDate.getTime())
    ? hash
    : Math.floor(parsedDate.getTime() / 86400000);

  if (isWeekend) {
    // Select Weekend Theme Bank either by forcedThemeBankId or by sequential weekend index
    // Using epoch days ensures Saturday and Sunday of the same weekend get two different themes!
    const themeBank =
      (forcedThemeBankId
        ? WEEKEND_THEME_BANKS.find((b) => b.id === forcedThemeBankId)
        : undefined) ||
      WEEKEND_THEME_BANKS[Math.abs(epochDays) % WEEKEND_THEME_BANKS.length];

    const orderedSeeds: WordEntrySeed[] = [];
    const seen = new Set<string>();

    const seed = (hash ^ epochDays) >>> 0 || 987654321;
    const priorityCopy = deterministicShuffle(themeBank.priorityAnswers, seed);

    for (const ans of priorityCopy) {
      const item = wordMap.get(ans);
      if (item && !seen.has(ans)) {
        orderedSeeds.push(item);
        seen.add(ans);
      }
    }

    const rotatedFallback = buildRotatedCohortPool(
      MASTER_INTERLEAVED_WORDS,
      10,
      epochDays,
      (seed ^ 0x9e3779b9) >>> 0
    );
    for (const item of rotatedFallback) {
      if (!seen.has(item.answer)) {
        orderedSeeds.push(item);
        seen.add(item.answer);
      }
    }

    const idSuffix = forcedThemeBankId ? `-${forcedThemeBankId}` : '';
    return compile20x20Puzzle(
      `daily-${isoDate}${idSuffix}`,
      `${dayOfWeekName} Weekend Special: ${themeBank.titleSuffix}`,
      themeBank.themeName,
      'weekend-themed',
      dayOfWeekName,
      'Weekend Themed 20×20 Edition',
      formattedDate,
      isoDate,
      themeBank.visual,
      orderedSeeds
    );
  } else {
    // Weekday General Knowledge Crossword (Monday - Friday)
    // Rotate across 10 disjoint ~100-word cohorts from the 1,000-word lexicon
    const pool = buildRotatedCohortPool(
      MASTER_INTERLEAVED_WORDS,
      10,
      epochDays,
      hash || 123456789
    );

    const weekdayPalettes: VisualThemeId[] = [
      'editorial',
      'observatory',
      'botanical',
      'mahogany',
      'missing-piece',
    ];
    const visual = weekdayPalettes[hash % weekdayPalettes.length];

    return compile20x20Puzzle(
      `daily-${isoDate}`,
      `${dayOfWeekName} General Crossword`,
      'General Knowledge (Weekday Edition)',
      'weekday-general',
      dayOfWeekName,
      'Weekday General 20×20 Edition',
      formattedDate,
      isoDate,
      visual,
      pool
    );
  }
}

/**
 * Generates a deterministic Daily 8x8 Quick Crossword for any YYYY-MM-DD London date.
 */
export function generateQuick8x8PuzzleForDate(
  isoDate: string
): PuzzleDefinition {
  const parsedDate = new Date(`${isoDate}T12:00:00Z`);
  const dayOfWeekName = isNaN(parsedDate.getTime())
    ? 'Daily'
    : parsedDate.toLocaleDateString('en-GB', {
        weekday: 'long',
        timeZone: 'UTC',
      });

  const formattedDate = isNaN(parsedDate.getTime())
    ? isoDate
    : parsedDate.toLocaleDateString('en-GB', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      });

  let hash = 777;
  for (let i = 0; i < isoDate.length; i++) {
    hash = (hash * 37 + isoDate.charCodeAt(i)) >>> 0;
  }

  const epochDays = isNaN(parsedDate.getTime())
    ? hash
    : Math.floor(parsedDate.getTime() / 86400000);

  // Filter to crisp 4-7 letter words ideal for an 8x8 Quick Crossword,
  // rotating through 14 disjoint cohorts across two full weeks
  const quickEligible = MASTER_INTERLEAVED_WORDS.filter(
    (w) => w.answer.length >= 4 && w.answer.length <= 7
  );
  const pool = buildRotatedCohortPool(
    quickEligible,
    14,
    epochDays,
    (hash ^ 0x5a5a5a5a) >>> 0 || 246813579
  );

  const palettes: VisualThemeId[] = [
    'editorial',
    'botanical',
    'observatory',
    'mahogany',
    'missing-piece',
  ];
  const visual = palettes[hash % palettes.length];

  return compilePuzzleGrid(
    `quick8x8-${isoDate}`,
    `${dayOfWeekName} 8×8 Quick Crossword`,
    'Quick 8×8 Daily Sprint',
    'quick-8x8',
    8,
    dayOfWeekName,
    '8×8 Daily Quick Edition',
    formattedDate,
    isoDate,
    visual,
    pool
  );
}

/**
 * Generates a rolling 21-day Daily & Archive catalog anchored to London, UK ('Europe/London') date,
 * including both the 20x20 Standard Edition and the 8x8 Quick Crossword for each day.
 */
export function buildRollingDailyCatalog(
  daysCount: number = 21
): PuzzleDefinition[] {
  const londonNow = getLondonDateTimeParts();
  const anchorUtc = new Date(
    Date.UTC(londonNow.year, londonNow.month - 1, londonNow.day, 12, 0, 0)
  );
  const catalog: PuzzleDefinition[] = [];

  for (let offset = 0; offset < daysCount; offset++) {
    const d = new Date(anchorUtc.getTime() - offset * 86400000);
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const isoDate = `${yyyy}-${mm}-${dd}`;
    catalog.push(generateArchivePuzzleForDate(isoDate));
    catalog.push(generateQuick8x8PuzzleForDate(isoDate));
  }

  return catalog;
}

export const CURATED_PUZZLES: PuzzleDefinition[] = buildRollingDailyCatalog(21);

export function createCustomThemePuzzle(
  customThemeTitle: string,
  customEntries: Array<{
    answer: string;
    standardClue: string;
    mediumClue?: string;
    crypticClue?: string;
    crypticBreakdown?: string;
  }>,
  visualTheme: VisualThemeId,
  gridSize: GridSizeOption = 20
): PuzzleDefinition {
  const todayIso = getTodayIsoDate();
  const customSeeds: WordEntrySeed[] = customEntries
    .map((e, idx) => {
      const cleaned = e.answer.toUpperCase().replace(/[^A-Z]/g, '');
      if (cleaned.length < 3 || cleaned.length > gridSize) return null;
      const easyText =
        e.standardClue.trim() || `Thematic entry for ${customThemeTitle}`;
      const mediumText =
        e.mediumClue && e.mediumClue.trim().length > 0
          ? e.mediumClue.trim()
          : `${easyText} (starts with ${cleaned[0]}, ${cleaned.length} letters)`;
      const hardText =
        e.crypticClue && e.crypticClue.trim().length > 0
          ? e.crypticClue.trim()
          : `${easyText} — hidden in ${cleaned
              .split('')
              .reverse()
              .join('')
              .toLowerCase()} reversal (${cleaned.length})`;
      const breakdownText =
        e.crypticBreakdown && e.crypticBreakdown.trim().length > 0
          ? e.crypticBreakdown.trim()
          : `Custom entry (${cleaned.length} letters): starts with '${cleaned[0]}' and ends with '${cleaned[cleaned.length - 1]}'.`;

      return {
        answer: cleaned,
        easyClue: easyText,
        mediumClue: mediumText,
        hardClue: hardText,
        standardClue: easyText,
        crypticClue: hardText,
        crypticBreakdown: breakdownText,
        etymologyOrContext: `Custom theme word from "${customThemeTitle}".`,
        defaultIsCryptic: idx % 2 === 1,
      };
    })
    .filter((x): x is WordEntrySeed => x !== null);

  const seen = new Set<string>(customSeeds.map((s) => s.answer));
  const combinedPool = [
    ...customSeeds,
    ...UNIVERSAL_BRIDGE_WORDS.filter((w) => !seen.has(w.answer)),
  ];

  return compilePuzzleGrid(
    `custom-${Date.now()}`,
    `Custom ${gridSize}×${gridSize}: ${customThemeTitle}`,
    customThemeTitle,
    'custom-themed',
    gridSize,
    'Custom',
    `${gridSize}×${gridSize} Custom Thematic Grid`,
    todayIso,
    todayIso,
    visualTheme,
    combinedPool
  );
}
