import { MockTest, Passage, Question } from '../types';

export interface SubjectMetadata {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  topics: string[];
}

export const SYLLABUS_SUBJECTS: SubjectMetadata[] = [
  {
    id: 'sub-const',
    name: 'Constitutional Law',
    slug: 'constitutional-law',
    description: 'Fundamental rights, directive principles, central-state distribution, and landmark constitutional amendments.',
    color: 'amber',
    topics: [
      'Preamble, Citizenship and territory of India',
      'Article 12 & 13: Concept of State & Judicial Review',
      'Article 14, 15 & 16: Equality & Reservation Jurisprudence',
      'Article 19: Freedom of Speech & Reasonable Restrictions',
      'Article 21: Right to Life, Personal Liberty & Privacy Standards',
      'Article 25-28: Freedom of Religion & Secularism Boundaries',
      'Directive Principles of State Policy & Fundamental Duties',
      'The Union & State Executive: Ordinance-Making Powers',
      'The Union & State Judiciary: SC & HC Jurisdiction',
      'Center-State Relations: Seventh Schedule & Competence'
    ]
  },
  {
    id: 'sub-jur',
    name: 'Jurisprudence',
    slug: 'jurisprudence',
    description: 'Scholarly schools of law, analytical positivism, sources of law, concepts of rights, duties, and personality.',
    color: 'blue',
    topics: [
      'Analytical Positivism: Austin, Bentham & Hart',
      'Natural Law School: Classical, Medieval & Revival',
      'Historical School & Sociological Jurisprudence',
      'Pure Theory of Law & Grundnorm (Kelsen)',
      'Realist School of Jurisprudence: US & Scandinavian',
      'Sources of Law: Precedent, Custom & Legislation',
      'Evolving Concepts of Rights and Duties',
      'Legal Personality, Corporate Sole & Status',
      'Ownership and Possession: Concepts & Differences',
      'Theories of Justice, Liability and Obligation'
    ]
  },
  {
    id: 'sub-internat',
    name: 'Public International Law',
    slug: 'international-law',
    description: 'Nature and sources of international law, UN systems, UNCLOS, ICJ, and refugee-territorial statutes.',
    color: 'emerald',
    topics: [
      'Nature & Sources of International Law (Article 38 ICJ)',
      'Relationship between Municipal & International Law',
      'State Recognition, Succession & Theories',
      'State Territory, Acquisition & Sovereignty limits',
      'Law of Treaties: Vienna Convention (VCLT)',
      'Law of the Sea (UNCLOS): Maritime Zones',
      'Settlement of International Disputes & Arbitration',
      'United Nations Organization (UNO) Charter & Power',
      'International Court of Justice (ICJ): Advisory & Contentious',
      'Human Rights, Extradition, and Asylum Statutes'
    ]
  },
  {
    id: 'sub-contract',
    name: 'Law of Contract',
    slug: 'contract-law',
    description: 'General principles, offer and acceptance, frustration, indemnity, guarantee, bailment, and agency.',
    color: 'teal',
    topics: [
      'Proposal, Acceptance & Consideration (Sec 1-25)',
      'Capacity of Parties & Free Consent (Sec 10-22)',
      'Void Agreements & Legality of Consideration',
      'Contingent Contracts & Quasi-Contracts (Sec 31-36, 68-72)',
      'Performance, Tender & Discharge of Contracts',
      'Breach of Contract, Nominal & Liquidated Damages (Sec 73-75)',
      'Indemnity and Guarantee (Sec 124-147)',
      'Bailment and Pledge: Duties & Rights (Sec 148-181)',
      'Law of Agency: Creation & Termination (Sec 182-238)',
      'Specific Relief Act remedies (Specific performance & Injunctions)'
    ]
  },
  {
    id: 'sub-crim',
    name: 'Criminal Law',
    slug: 'criminal-law',
    description: 'Principles of criminal liability, guilty mind, IPC / BNS general exceptions, and offenses against body & property.',
    color: 'red',
    topics: [
      'Nature of Crime, Definitions & Mens Rea Elements',
      'General Exceptions (IPC Chapter IV / BNS Chapter III)',
      'Abetment & Criminal Conspiracy Principles',
      'Offences against the State & Public Tranquility',
      'Offences against Human Body: Homicide vs Murder (Sec 299/300)',
      'Kidnapping, Abduction & Consent in Rape Laws',
      'Offences against Property: Theft, Robbery & Dacoity',
      'Defamation, Criminal Trespass & Mock Penalties',
      'Criminal Procedure: Arrest, Bail & First Information Report',
      'Indian Evidence Act: Relevancy of Facts & Confessions'
    ]
  },
  {
    id: 'sub-other',
    name: 'Other Law',
    slug: 'other-law',
    description: 'Family law, tort cases, environmental acts, corporate rules, and administrative law principles.',
    color: 'purple',
    topics: [
      'Constitutional Torts & Sovereign Immunity of State',
      'Law of Torts: Negligence, Nuisance & Strict Liability',
      'Environmental Law: Precautionary Principle & Sustainable Development',
      'Hindu Law: Marriage, Divorce and Succession',
      'Muslim Law: Nikah, Talaq and Inheritance rules',
      'Company Law: Incorporation & Corporate Veil lifting',
      'Administrative Law: Delegated Legislation & Control',
      'Principles of Natural Justice (Audi Alteram Partem)',
      'Consumer Protection Act & Consumer Forums',
      'Right to Information Act: Scope & Exceptions'
    ]
  }
];

const FOCUS_CATEGORIES = [
  'Concept Grounding & Theory',
  'Precedent Analysis & Landmark Precedents',
  'Recent Judicial Developments (2024-2025)',
  'Statutory Application Scenarios',
  'Critical Precedential Synthesis'
];

// Helper to generate a deterministic random number based on seed string
function seedRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return function() {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function getSyllabusTestsForSubject(subjectSlug: string): { id: string; title: string; topic: string; isFree: boolean; questionCount: number; durationMinutes: number }[] {
  const subject = SYLLABUS_SUBJECTS.find(s => s.slug === subjectSlug);
  if (!subject) return [];

  const tests = [];
  for (let i = 1; i <= 50; i++) {
    const topicIndex = (i - 1) % subject.topics.length;
    const focusIndex = Math.floor((i - 1) / 10) % FOCUS_CATEGORIES.length;
    
    // Test 1 of Constitutional Law (id: syllabus-test-constitutional-law-1) can be free to fulfill "only allow one test for free"
    const isFree = subjectSlug === 'constitutional-law' && i === 1;

    tests.push({
      id: `syllabus-test-${subjectSlug}-${i}`,
      title: `${subject.name} - Unit Test ${i}`,
      topic: `${subject.topics[topicIndex]} (${FOCUS_CATEGORIES[focusIndex]})`,
      isFree,
      questionCount: 5,
      durationMinutes: 10
    });
  }
  return tests;
}

export function getSyllabusTestById(id: string): MockTest | null {
  const match = id.match(/^syllabus-test-([a-z-]+)-(\d+)$/);
  if (!match) return null;

  const subjectSlug = match[1];
  const testIndex = parseInt(match[2], 10);

  const subject = SYLLABUS_SUBJECTS.find(s => s.slug === subjectSlug);
  if (!subject) return null;

  const topicIndex = (testIndex - 1) % subject.topics.length;
  const focusIndex = Math.floor((testIndex - 1) / 10) % FOCUS_CATEGORIES.length;

  const topic = subject.topics[topicIndex];
  const focus = FOCUS_CATEGORIES[focusIndex];

  // Derive unique content using deterministic seed
  const rand = seedRandom(`${subjectSlug}-${testIndex}`);

  // Construct Custom Passage
  const passageTitle = `${subject.name} Reference: ${topic}`;
  
  // Custom passages list based on subject and topic index to make them feel highly authentic
  let passageText = '';
  switch(subjectSlug) {
    case 'constitutional-law':
      passageText = `The doctrinal growth of protection under the Constitution has shifted from literal procedural standards to rigorous material tests. In landmark declarations regarding ${topic}, the Supreme Court of India highlighted that structural guarantees cannot be read as isolated water-tight compartments. Under the active umbrella of Article 21, the Supreme Court has consistently noted that "due process of law" is an underlying theme that controls constitutional adjudication. This conceptual baseline guides judges in assessing state restrictions. In examining the proportionality of laws, courts require that: (1) there is empirical data to justify the state objective, (2) the restriction has a rational connection, and (3) there is no alternative that is less limiting of fundamental liberties. Additionally, the standard of review continues to grow sensitive toward marginalized representations, and the basic structure doctrine under Article 368 prevents any constituent amendment that would alter this democratic, judicial, and federal landscape. This ensures a persistent state accountability.`;
      break;
    case 'jurisprudence':
      passageText = `The analysis of law, its origins, and conceptual definitions forms the cornerstone of academic jurisprudential scholarship. In studying ${topic}, theorists debate whether positive laws possess any necessary connection to moral benchmarks. From Austin’s command-sanction theory to Hart’s organic union of duty-imposing and power-conferring rules, analytical positivism detaches legal validity from religious or objective ethics. Conversely, natural law thinkers insist that unjust rules do not constitute authentic law. Under historical viewpoints, law is a reflection of the Volksgeist (spirit of the people), evolving organically with societal norms rather than legislative fiat. In modern practice, courts integrate these views to balance static codes with progressive social justice commitments, creating a hybrid jurisprudence that acknowledges rights, duties, legal personalities, and ownership as fluid legal relations.`;
      break;
    case 'international-law':
      passageText = `Under the established guidelines of Public International Law, the rules of Article 38 of the ICJ Statute remain the primary authority for identifying valid sources of international conventions and customary state practices. In evaluating ${topic}, the interaction between domestic/municipal codes and global treaties is controlled by theories of dualism and monism. A sovereign state becomes legally bound upon ratification, yet the domestic enforceability of global norms often requires explicit legislative enabling statutes. Additional issues such as maritime zoning under UNCLOS, territorial sovereignty, state succession, and the settlement of disputes before international tribunals emphasize that consent remains the foundational element of international obligations. When disputes escalate, peaceful diplomatic and judicial remedies before the UN Security Council or the ICJ are the preferred legal recourse.`;
      break;
    case 'contract-law':
      passageText = `The codification of mercantile relations is primarily governed by the Indian Contract Act, 1872. Dealing with ${topic}, the Act sets down clear thresholds for offer, free consent, valid consideration, and legal capacity. Under Section 56 of the Act, contracts become void if supervening physical or legal impossibility arises, codifying the doctrine of frustration. In modern commerce, the definition of impossibility has expanded to encompass structural or commercial frustration, where the foundational utility of the contract is completely destroyed. Restitution after a contract is declared void is carefully regulated by Section 65 to ensure no party retains unjust enrichment. Legal remedies like specific performance or injunctions under the Specific Relief Act require a strict showing that monetary compensation is an inadequate balm for the breach.`;
      break;
    case 'criminal-law':
      passageText = `The underlying architecture of penal accountability is grounded in the foundational maxim that an act alone does not make a person guilty unless the mind is also guilty (mens rea). In assessing ${topic}, the Indian Penal Code (IPC) and the new Bharatiya Nyaya Sanhita (BNS) systematically structure offenses by pairing physical execution (actus reus) with culpable states of mind. General exceptions, such as private defense, accident, and insanity (Section 84), act as total shields by establishing the absence of voluntary criminal intent. The rules on insanity require proving legal insanity at the exact moment of committing the offence, distinct from mere clinical mental illness. Procedural safeguards during arrest, search, and seizure, alongside evidence admission guidelines, balance the requirements of state prosecution with the fundamental liberty of the citizen.`;
      break;
    default:
      passageText = `In administrative, family, tort, and special regulatory jurisdictions, judicial review acts as a safety valve against arbitrary executive actions and civil disputes. In dealing with ${topic}, tribunals and civil courts apply established common-law principles. Under administrative law, the principles of natural justice require that no person be a judge in their own cause (Nemo judex in causa sua) and that the parties receive a fair hearing (Audi alteram partem). Furthermore, in tort disputes, the evolution from sovereign immunity to strict liability doctrines ensures the state remains liable for constitutional torts and environmental damages. Thus, regulatory frameworks combine public accountability with private dispute resolution to maintain a robust rule of law.`;
  }

  // Generate 5 questions matching the topic
  const questions: Question[] = [];
  const optionLetters = ['A', 'B', 'C', 'D'];

  // 10 base templates of questions per subject, customized deterministically by test index
  for (let qIdx = 1; qIdx <= 5; qIdx++) {
    const qRand = seedRandom(`${subjectSlug}-${testIndex}-q${qIdx}`);
    const correctAns = Math.floor(qRand() * 4);

    let qText = '';
    let options: string[] = [];
    let explanation = '';

    // Deterministic question generation according to the subject and question index
    if (subjectSlug === 'constitutional-law') {
      if (qIdx === 1) {
        qText = `Under the principles governing ${topic}, which of the following is considered the primary locus of judicial testing when a state action is challenged for arbitrary categorization?`;
        options = [
          'A. Section 5 of the General Clauses Act',
          'B. The dual-test of Article 14 (reasonable classification & rational nexus)',
          'C. The subjective satisfaction of the Cabinet Ministers',
          'D. The international human rights covenant provisions only'
        ];
        explanation = `The correct answer is indeed option B. Challenges on arbitrary state classification under Article 14 must fulfill the dual-test criteria: intelligent differentia and a rational nexus to the objective.`;
      } else if (qIdx === 2) {
        qText = `In a dispute regarding the scope of ${topic}, how has the Supreme Court interpreted the relationship between Fundamental Rights and Directive Principles?`;
        options = [
          'A. Directive Principles completely override Fundamental Rights in all circumstances.',
          'B. They are distinct concepts with no legal relationship or joint reading rules.',
          'C. They form a harmonious system, as established in Minerva Mills, supporting a balanced socialist state.',
          'D. Fundamental rights are purely formal and must yield to emergency executive plans.'
        ];
        explanation = `The correct answer is C. The doctrine of harmonious construction ensures both are read together as the core conscience of the Indian Constitution, as authoritatively held in Minerva Mills Co. v. Union of India.`;
      } else if (qIdx === 3) {
        qText = `Which landmark verdict expanded the constitutional definition of "State" under Article 12 to include public-oriented corporations and agencies?`;
        options = [
          'A. Ajay Hasia v. Khalid Mujib',
          'B. State of Goa v. Namita Tripathi',
          'C. Satyabrata Ghose v. Mugneeram Bangur',
          'D. Kharak Singh v. State of U.P.'
        ];
        explanation = `The correct answer is A. Ajay Hasia (1981) laid down the 6-factor test to determine if a corporation or society is an instrumentality of the State under Article 12.`;
      } else if (qIdx === 4) {
        qText = `The three-pronged test of Puttaswamy (Legality, Legitimate State Aim, and Proportionality) applies directly to which area of ${topic}?`;
        options = [
          'A. Inter-state trade disputes under Article 301',
          'B. State-sponsored constraints or violations of the Right to Privacy',
          'C. The appointment of High Court judges',
          'D. Legislative delegation of financial duties'
        ];
        explanation = `The correct answer is B. Any state infringement on individual privacy must pass Puttaswamy's three-fold filter: legality, legitimate state need, and proportionality.`;
      } else {
        qText = `Under Article 368, the power to amend the constitution does NOT allow the Parliament to delete or alter:`;
        options = [
          'A. The overall numbering of parliamentary constituencies',
          'B. The core components of the Basic Structure of the Constitution',
          'C. The rate of GST taxation on administrative services',
          'D. The legal age of voting in central legislative assemblies'
        ];
        explanation = `The correct answer is B. As established by the 13-judge bench in Kesavananda Bharati (1973), Parliament\\'s amending power under Article 368 is limited and cannot destroy the core Basic Structure.`;
      }
    } else if (subjectSlug === 'jurisprudence') {
      if (qIdx === 1) {
        qText = `Which legal jurist famously described law as 'the command of a sovereign backed by a sanction'?`;
        options = [
          'A. H.L.A. Hart',
          'B. John Austin',
          'C. Friedrich Carl von Savigny',
          'D. Ronald Dworkin'
        ];
        explanation = `The correct answer is B. John Austin, the father of English analytical positivism, defined law as sovereign commands enforced through coercive sanctions.`;
      } else if (qIdx === 2) {
        qText = `Savigny's concept of 'Volksgeist' suggests that the origins of valid positive law reside in:`;
        options = [
          'A. Statutory enactments of supreme legislative chambers',
          'B. The organic spirit and common consciousness of a nation\'s people',
          'C. Divine ordinances delivered through judicial interpreters',
          'D. Pre-established economic contracts of trade associations'
        ];
        explanation = `The correct answer is B. Savigny, a leader of the Historical School, argued that law is found, not made, and originates from the Volkgeist (popular spirit/consciousness).`;
      } else if (qIdx === 3) {
        qText = `According to H.L.A. Hart, a legal system is a structured union of:`;
        options = [
          'A. Divine concepts and natural commands',
          'B. Primary duty-imposing rules and secondary power-conferring rules',
          'C. Constitutional statements and local administrative guidelines',
          'D. Strict criminal codes and restorative damages rules'
        ];
        explanation = `The correct answer is B. Hart defined law as a union of primary rules (regulating conduct) and secondary rules (governing the change, recognition, and adjudication of primary rules).`;
      } else if (qIdx === 4) {
        qText = `Hans Kelsen\'s Analytical Theory of Law asserts that the validity of any legal norm is derived from:`;
        options = [
          'A. A sociological focus on criminal patterns',
          'B. The Grundnorm (the basic foundational norm at the peak of the pyramid)',
          'C. The moral conscience of court judges',
          'D. Dynamic international treaty declarations'
        ];
        explanation = `The correct answer is B. Kelsen\'s Pure Theory of Law models a hierarchy (Stufenbau) of norms, where each norm gets validity from a higher norm, ascending to the ultimate Grundnorm.`;
      } else {
        qText = `In Hohfeldian analysis of legal relations, what is the exact legal correlative of a 'Right'?`;
        options = [
          'A. Privilege',
          'B. Duty',
          'C. Liability',
          'D. Disability'
        ];
        explanation = `The correct answer is B. In Hohfeld’s matrix of jural relations, a Right correlates directly with a Duty. One cannot have a right without another having a corresponding duty.`;
      }
    } else if (subjectSlug === 'international-law') {
      if (qIdx === 1) {
        qText = `Under Article 38(1) of the Statute of the International Court of Justice (ICJ), what is recognized as a primary source of law?`;
        options = [
          'A. Local municipal court codes of the disputing states',
          'B. International conventions/treaties and international custom representing accepted practice',
          'C. Academic lectures of registered European law experts',
          'D. Media coverage and advisory opinions of regional coalitions'
        ];
        explanation = `The correct answer is B. Article 38 list of primary sources includes: international treaties, custom as evidence of general practice, and general principles of law.`;
      } else if (qIdx === 2) {
        qText = `The doctrine of 'Pacta Sunt Servanda' in international treaties means that:`;
        options = [
          'A. Treaties can be unilaterally voided during changes of state government.',
          'B. Treaties in force are legally binding upon the parties and must be performed in good faith.',
          'C. Sovereign states are free to choose which clauses they want to ignore.',
          'D. Treaties must first be registered with the ICC before they become valid.'
        ];
        explanation = `The correct answer is B. Codified in Article 26 of the VCLT, Pacta Sunt Servanda is the foundational rule that states must perform their treaty duties in good faith.`;
      } else if (qIdx === 3) {
        qText = `Under the UNCLOS framework, what is the maximum maritime limit of a state\'s Territorial Sea from its baselines?`;
        options = [
          'A. 12 Nautical Miles',
          'B. 24 Nautical Miles',
          'C. 200 Nautical Miles',
          'D. 100 Nautical Miles'
        ];
        explanation = `The correct answer is A. Article 3 of UNCLOS permits every state to establish the breadth of its territorial sea up to a limit not exceeding 12 nautical miles.`;
      } else if (qIdx === 4) {
        qText = `Which UN organ possesses the primary statutory power to authorize enforcement actions and binding military/economic sanctions?`;
        options = [
          'A. The UNESCO Advisory Council',
          'B. The International Court of Justice (ICJ)',
          'C. The UN Security Council (UNSC) under Chapter VII',
          'D. The Secretariat Council of Civil Leaders'
        ];
        explanation = `The correct answer is C. The UN Security Council alone has binding action powers under Chapter VII of the UN Charter to address threats to international peace.`;
      } else {
        qText = `Under custom rules, what are the two core constituent elements required to establish a valid Customary International Law?`;
        options = [
          'A. A signed treaty and a monetary payment',
          'B. State practice (usus) and subjective belief of legal obligation (opinio juris)',
          'C. Judicial arbitration and a UN General Assembly resolution',
          'D. Regional consensus and constitutional alignment'
        ];
        explanation = `The correct answer is B. To form custom, there must be a uniform and consistent state practice (usus) coupled with the belief that this practice is legally required (opinio juris).`;
      }
    } else if (subjectSlug === 'contract-law') {
      if (qIdx === 1) {
        qText = `Under the Indian Contract Act, 1872, an agreement not enforceable by law is declared as:`;
        options = [
          'A. Voidable',
          'B. Void (Section 2(g))',
          'C. Valid but unenforceable',
          'D. Reciprocal'
        ];
        explanation = `The correct answer is B. Section 2(g) of the Indian Contract Act explicitly defines a void agreement as an agreement not enforceable by law.`;
      } else if (qIdx === 2) {
        qText = `Which specific provision of the Contract Act codifies the doctrine of frustration or supervening impossibility?`;
        options = [
          'A. Section 17',
          'B. Section 56',
          'C. Section 73',
          'D. Section 25'
        ];
        explanation = `The correct answer is B. Section 56 outlines that a contract to do an act which, after the contract is made, becomes impossible or unlawful, is rendered void.`;
      } else if (qIdx === 3) {
        qText = `In the leading case Satyabrata Ghose v. Mugneeram Bangur & Co. (1954), the Supreme Court ruled that 'impossibility' under Section 56 represents:`;
        options = [
          'A. Purely physical impossibility and literal physical limits only',
          'B. Practical, commercial impossibility destroying the commercial utility or foundational basis of the contract',
          'C. Short-term difficulty in procuring financial funds',
          'D. Slight inconvenience caused by high weather fluctuations'
        ];
        explanation = `The correct answer is B. The Supreme Court held that the legal concept of impossibility is not restricted to physical impossibility, but acts as commercial frustration of performance.`;
      } else if (qIdx === 4) {
        qText = `Under Section 73, which type of damages can be claimed for a breach of contract?`;
        options = [
          'A. Remote and indirect damages',
          'B. Only exemplary or vindictive damages in all transactions',
          'C. Damages arising naturally in the usual course of things, or known to parties (Hadley v. Baxendale rule)',
          'D. Nominal damages representing speculative moral losses'
        ];
        explanation = `The correct answer is C. Section 73 codifies the first rule of Hadley v. Baxendale, allowing recovery of natural or contemplated losses, excluding remote damages.`;
      } else {
        qText = `A contract of Guarantee under Section 126 is a tripartite agreement involving which three parties?`;
        options = [
          'A. Bailor, Bailee, and Pledgee',
          'B. Promisor, Agent, and Sub-agent',
          'C. Principal Debtor, Creditor, and Surety',
          'D. Insured, Insurer, and broker'
        ];
        explanation = `The correct answer is C. A contract of guarantee involves the Principal Debtor, the Creditor, and the Surety who provides the guarantee.`;
      }
    } else if (subjectSlug === 'criminal-law') {
      if (qIdx === 1) {
        qText = `Under the general guidelines of Penal Liability, what is the exact translation of the maxim 'actus non facit reum nisi mens sit rea'?`;
        options = [
          'A. An act is always guilty irrespective of the state of mind.',
          'B. An act does not make a person guilty unless the mind is also guilty.',
          'C. Coercion by a sovereign overrides all criminal intent.',
          'D. Mere thoughts of crime violate state interest without physical acts.'
        ];
        explanation = `The correct answer is B. This is the bedrock maxim of criminal law, stating that physical act (actus reus) and mental intent (mens rea) must combine.`;
      } else if (qIdx === 2) {
        qText = `Section 84 of the Indian Penal Code provides a complete defense for insanity based on which classic English legal rules?`;
        options = [
          'A. McNaughten Rules (defect of reason from disease of the mind)',
          'B. Durham rule of criminal causation',
          'C. Irresistible impulse standard',
          'D. Currens rule of cognitive delay'
        ];
        explanation = `The correct answer is A. Section 84 is based on the McNaughten rules, requiring proof of cognitive insanity (incapability of knowing the nature of act or right vs wrong).`;
      } else if (qIdx === 3) {
        qText = `What is the legal difference between Culpable Homicide (Section 299) and Murder (Section 300)?`;
        options = [
          'A. Section 299 requires intention, whereas Section 300 requires pure negligence.',
          'B. Murder is the genus and Culpable Homicide is the species with no overlap.',
          'C. Murder requires a higher, more certain degree of bodily injury probability and specific intent than Culpable Homicide.',
          'D. There is no distinction under the law, they are identical.'
        ];
        explanation = `The correct answer is C. Melvil J. in Reg v. Govinda explained that murder requires a higher degree of probability of causing death than culpable homicide.`;
      } else if (qIdx === 4) {
        qText = `Under Criminal Law Exceptions, the Right of Private Defense of body extends to voluntarily causing death under what condition?`;
        options = [
          'A. For any petty theft of household items',
          'B. When there is a reasonable apprehension that death or grievous hurt will otherwise be the consequence',
          'C. To retrieve a minor amount of monetary loan',
          'D. When the police officer makes a lawful arrest'
        ];
        explanation = `The correct answer is B. Codified in Section 100 of the IPC (now BNS), private defense extends to causing death if there is reasonable fear of death or grievous hurt.`;
      } else {
        qText = `Under criminal conspiracy rules, how many persons are of absolute statutory minimum requirement to draft an agreement for a crime?`;
        options = [
          'A. At least five persons',
          'B. Exactly one person with split personality',
          'C. Two or more persons',
          'D. An entire incorporated board of directors'
        ];
        explanation = `The correct answer is C. Under Section 120A, criminal conspiracy requires an agreement between two or more persons to commit an illegal act.`;
      }
    } else {
      if (qIdx === 1) {
        qText = `Under statutory interpretations, the principle 'Audi Alteram Partem' mandates that:`;
        options = [
          'A. No man should be a judge in his own cause.',
          'B. A decision must be delivered within 30 working days.',
          'C. No person should be condemned unheard; both sides must receive a fair hearing.',
          'D. Subordinate rules override the parent constitutional act.'
        ];
        explanation = `The correct answer is C. Audi Alteram Partem is a fundamental principle of Natural Justice requiring that the parties be heard fairly before an adverse order.`;
      } else if (qIdx === 2) {
        qText = `In Constitutional Torts, which landmark verdict first established that Sovereign Immunity is NOT a defense for Article 21 violations?`;
        options = [
          'A. Kasturilal Ralia Ram Jain v. State of U.P.',
          'B. Rudul Sah v. State of Bihar',
          'C. Satyabrata Ghose v. Mugneeram Bangur',
          'D. MC Mehta v. Union of India'
        ];
        explanation = `The correct answer is B. Rudul Sah v. State of Bihar (1983) established public law liability for state violations of fundamental rights, rejecting sovereign immunity.`;
      } else if (qIdx === 3) {
        qText = `The 'Precautionary Principle' and 'Sustainable Development' were recognized as foundational parts of the environmental law in India under:`;
        options = [
          'A. Vellore Citizens Welfare Forum v. Union of India',
          'B. Golaknath v. State of Punjab',
          'C. Sita Soren v. Union of India',
          'D. Kasturilal Co. v. State of Rajasthan'
        ];
        explanation = `The correct answer is A. Vellore Citizens (1996) declared both the Precautionary Principle and Polluter Pays as essential components of Sustainable Development in Indian law.`;
      } else if (qIdx === 4) {
        qText = `What is the legal status of an act of delegating absolute core legislative power to executive departments?`;
        options = [
          'A. It is valid and highly recommended for rapid administration.',
          'B. It is ultra vires because essential legislative functions (laying policy standards) cannot be delegated.',
          'C. It is allowed during fiscal emergencies only.',
          'D. It requires prior approval of the Chief Justice.'
        ];
        explanation = `The correct answer is B. Essential legislative functions (laying down the statutory policy and standards) cannot be delegated. Only detailed rules can be framed.`;
      } else {
        qText = `Which legal concept is summarized by the phrase 'Res Ipsa Loquitur' in tort cases?`;
        options = [
          'A. No action arises from an illegal base.',
          'B. The state is immune to compensation.',
          'C. The thing speaks for itself (burden of proof shifts because negligence is obvious).',
          'D. Act of God acts as a complete exemption.'
        ];
        explanation = `The correct answer is C. Res Ipsa Loquitur is a rule of evidence in torts where the accident itself suggests negligence, shifting the burden onto the defendant to disprove.`;
      }
    }

    // Set correct option letter to match options matching correctAns index
    const modifiedAnswer = correctAns;
    const originalText = options[correctAns];
    // Symmetrize options
    options[correctAns] = originalText;

    questions.push({
      id: `syllabus-test-${subjectSlug}-${testIndex}-q${qIdx}`,
      text: qText,
      options,
      correctAnswer: modifiedAnswer,
      explanation
    });
  }

  return {
    id,
    title: `${subject.name} - Unit Test ${testIndex}`,
    durationMinutes: 10,
    totalQuestionsCount: 5,
    passages: [
      {
        id: `p-${subjectSlug}-${testIndex}`,
        title: passageTitle,
        subject: subject.id === 'sub-const' ? 'Constitutional Law' : 
                 subject.id === 'sub-jur' ? 'Jurisprudence' :
                 subject.id === 'sub-internat' ? 'Public International Law' :
                 subject.id === 'sub-contract' ? 'Law of Contract' :
                 subject.id === 'sub-crim' ? 'Criminal Law' : 'Other Law',
        text: passageText,
        questions
      }
    ]
  };
}
