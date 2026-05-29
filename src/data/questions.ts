import { MockTest } from '../types';

export const mockTests: MockTest[] = [
  {
    id: 'clat-pg-mock-1',
    title: 'LexRank CLAT PG Grand Mock Test 1',
    durationMinutes: 45, // Set to 45 mins for standard app practice, expandable.
    totalQuestionsCount: 15,
    passages: [
      {
        id: 'p1',
        title: 'Constitutional Law: Expansion of Article 21 and the Right to Privacy',
        subject: 'Constitutional Law',
        text: 'The historic judgment in K.S. Puttaswamy v. Union of India (2017) redefined the constitutional landscape of India by unanimously declaring the Right to Privacy as an intrinsic part of the Right to Life and Personal Liberty under Article 21 of the Indian Constitution. The Court observed that privacy is not an elitist construct but a foundational guarantee of dignity and autonomy. The Court established a rigorous three-pronged test to justify any state-sponsored violation of this privacy: (a) Legality - there must be an existing law; (b) Direct/Proportionate objective - the law must serve a legitimate state purpose; and (c) Proportionality - there must be a rational nexus between the state object and the restriction, and the restriction must be the least intrusive measure available. This decision has far-reaching consequences on technological tracking, data governance, marital rights, and gender autonomy in India, overriding earlier rulings like Kharak Singh (to the extent it denied the right to privacy) and M.P. Sharma.',
        questions: [
          {
            id: 'q1',
            text: 'Consider the following statements regarding the status of the right to privacy in K.S. Puttaswamy v. Union of India (2017) and its impact on historic precedents:\n\nI. The nine-judge bench explicitly overruled the decisions in both M.P. Sharma (1954) and Kharak Singh (1963) to the extent that they had held that the right to privacy is not protected under the Constitution.\nII. The Court held that the right to privacy is absolute and cannot be restricted under any circumstances by state-sponsored legislation.\nIII. The Court established a three-pronged test consisting of Legality, Legitimate State Aim, and Proportionality (least intrusive means) to evaluate state intrusion.\n\nWhich of the statements given above are correct as per the Puttaswamy verdict?',
            options: [
              'I and II only',
              'I and III only',
              'II and III only',
              'I, II and III'
            ],
            correctAnswer: 1,
            explanation: 'In K.S. Puttaswamy, the nine-judge bench explicitly overruled the decisions in M.P. Sharma (1954) and Kharak Singh (1963) to the extent that they held that the right to privacy is not protected under the Indian Constitution. The right is not absolute and is subject to reasonable restrictions evaluated through a three-pronged test (Legality, Legitimate need, and Proportionality).'
          },
          {
            id: 'q2',
            text: 'What are the three core tests established in the Puttaswamy case for validating any state interference with privacy?',
            options: [
              'Reasonableness, Public Order, and Non-arbitrariness',
              'Legality, Legitimate State Aim (Proportionality), and Proportionality (least intrusive means)',
              'Federalism, Judicial Review, and Rule of Law',
              'Clear and Present Danger, National Security, and Legislative Competence'
            ],
            correctAnswer: 1,
            explanation: 'The three-fold test of Puttaswamy requires: (1) Legality (existence of law), (2) A legitimate state aim/need, and (3) Proportionality, which ensures a rational connection and that the action is the least restrictive alternative.'
          },
          {
            id: 'q3',
            text: 'Under which provision of the Indian Constitution is the Right to Privacy primarily located as per the Puttaswamy decision?',
            options: [
              'Article 14 - Right to Equality',
              'Article 19(1)(a) - Freedom of Speech and Expression',
              'Article 21 - Right to Life and Personal Liberty',
              'Article 25 - Freedom of Religion'
            ],
            correctAnswer: 2,
            explanation: 'The Supreme Court unanimously held that the right to privacy is guaranteed as a fundamental right under Article 21 (Right to Life and Personal Liberty), read with other fundamental rights in Part III.'
          },
          {
            id: 'q4',
            text: 'The "least intrusive measure" requirement for state action restricting privacy forms part of which prong of the Puttaswamy test?',
            options: [
              'Legality',
              'Legitimate state interest',
              'Proportionality',
              'Direct legislative delegation'
            ],
            correctAnswer: 2,
            explanation: 'The proportionality prong requires that the measure adopted by the state is necessary and the least intrusive means to achieve the intended regulatory objective.'
          },
          {
            id: 'q5',
            text: 'In Puttaswamy, how did the Supreme Court view the concept of privacy in relation to socio-economic rights of the marginalized?',
            options: [
              'Privacy is an elitist luxury that can be subordinated to socio-economic welfare programs.',
              'Privacy is a prerequisite for the exercise of socio-economic rights and is inseparable from human dignity.',
              'Socio-economic rights and privacy are strictly conflicting and must be balanced by the Executive.',
              'Privacy only applies to civil liberties and does not extend to welfare services.'
            ],
            correctAnswer: 1,
            explanation: 'The Supreme Court vehemently rejected the argument that privacy is an elitist concept, stating that empty stomachs also require dignity and that civil/political rights like privacy are prerequisites for socio-economic rights.'
          }
        ]
      },
      {
        id: 'p2',
        title: 'Jurisprudence: Analytical Positivism and H.L.A. Hart\'s Theory of Law',
        subject: 'Jurisprudence',
        text: 'H.L.A. Hart, a seminal figure in analytical positivism, described law as a union of primary and secondary rules in his masterpiece, "The Concept of Law" (1961). Primary rules are duty-imposing rules that dictate what citizens must or must not do (e.g., criminal law). They apply directly to human conduct. Secondary rules, on the other hand, are power-conferring rules directed at officials to administer progress, change, and resolve defects in primary rules. Hart identifies three types of secondary rules: (1) Rules of Recognition—which cure uncertainty by providing authoritative criteria for identifying valid primary rules; (2) Rules of Change—which authorize the creation, amendment, or repeal of primary rules, remedying their static nature; and (3) Rules of Adjudication—which designate bodies and procedures to determine if primary rules have been breached, curing the inefficiency of diffuse social pressure. Hart\'s formulation separates law from morality (the separability thesis), whilst acknowledging a "minimum content of natural law" essential for human survival in social organizations.',
        questions: [
          {
            id: 'q6',
            text: 'H.L.A. Hart\'s theory of analytical positivism divides the legal system into primary and secondary rules. Consider the following statements regarding the "Rule of Recognition":\n\nI. The Rule of Recognition is a primary rule that imposes direct duties on citizens.\nII. It cures the uncertainty of primary rules by providing authoritative criteria for identifying valid primary rules.\nIII. It derives its own legal validity from an even higher-order written secondary rule of state.\n\nWhich of the statements given above is/are correct as per Hart\'s formulation?',
            options: [
              'I only',
              'II only',
              'I and III only',
              'II and III only'
            ],
            correctAnswer: 1,
            explanation: 'The Rule of Recognition is an ultimate secondary rule (not primary) that sets the criteria for legal validity, curing the uncertainty of primary rules. Crucially, Hart points out that the Rule of Recognition is a social practice that is accepted by officials, meaning it does not derive its validity from any higher rule; it is the ultimate rule of the system.'
          },
          {
            id: 'q7',
            text: 'How does H.L.A. Hart characterize "Primary Rules" as distinct from "Secondary Rules"?',
            options: [
              'Primary rules are power-conferring, while secondary rules are duty-imposing',
              'Primary rules are duty-imposing rules regulating human behavior, whereas secondary rules are power-conferring and concern primary rules themselves',
              'Primary rules represent natural law, while secondary rules represent positive codes',
              'Primary rules are constitutional acts; secondary rules are delegated legislations'
            ],
            correctAnswer: 1,
            explanation: 'Hart defines primary rules as imposing duties directly on individuals (precluding behavior), while secondary rules confer powers on officials or individuals to create, amend, adjudicate, or recognize rules.'
          },
          {
            id: 'q8',
            text: 'Which defect of a simple regime of only primary rules is cured by H.L.A. Hart\'s "Rules of Change"?',
            options: [
              'Uncertainty of rules',
              'Inefficiency of diffuse social pressure',
              'The static nature of rules which cannot adapt to dynamic changes',
              'A complete lack of judicial enforcement mechanisms'
            ],
            correctAnswer: 2,
            explanation: 'The "static character" of primary rules (no way to deliberately adapt them to changing conditions) is cured by introducing "Rules of Change," which regulate how rules are introduced, deleted, or altered.'
          },
          {
            id: 'q9',
            text: 'Hart argues that there is a "minimum content of natural law" in positive systems. What is the basis of this assertion?',
            options: [
              'It is a metaphysical necessity ordained by divine law.',
              'Human vulnerability, approximate equality, limited altruism, limited resources, and limited understanding/willpower make certain rule constraints universally necessary for survival.',
              'It demands that all laws must yield a just distribution of wealth.',
              'Positive law cannot exist without an explicit constitutional declaration of human rights.'
            ],
            correctAnswer: 1,
            explanation: 'Hart argues that owing to basic facts of human nature and the world (vulnerability, resources, etc.), any social system must contain a minimum core of natural rules to survive.'
          },
          {
            id: 'q10',
            text: 'Which jurisprudence theorist argued against Hart\'s concept of law, asserting that law is not merely a system of rules but also comprises principles which automatically carry moral weight?',
            options: [
              'John Austin',
              'Ronald Dworkin',
              'Hans Kelsen',
              'Karl Llewellyn'
            ],
            correctAnswer: 1,
            explanation: 'Ronald Dworkin famously critiqued Hart in works like "Taking Rights Seriously," asserting that legal systems include moral "principles" (like "no man should profit from his own wrong") which rules cannot purely account for.'
          }
        ]
      },
      {
        id: 'p3',
        title: 'Law of Contract: Doctrine of Frustration and Supervening Impossibility',
        subject: 'Law of Contract',
        text: 'The doctrine of frustration of contract is codified in Section 56 of the Indian Contract Act, 1872. Section 56 states that a contract to do an act which, after the contract is made, becomes impossible or, by reason of some event which the promisor could not prevent, unlawful, becomes void when the act becomes impossible or unlawful. The leading Indian ruling on supervening impossibility is Satyabrata Ghose v. Mugneeram Bangur & Co. (1954). Justice B.K. Mukherjea clarified that the term "impossible" in Section 56 is not limited to physical or literal impossibility. Rather, it encompasses situations where the entire commercial utility or underlying basis of the contract is completely destroyed due to an untoward, unforeseen event. Once a contract is frustrated, it automatically terminates, and restitution is governed by Section 65, which mandates that any party who has received an advantage must make compensation or restore it.',
        questions: [
          {
            id: 'q11',
            text: 'Consider the following statements regarding Section 56 of the Indian Contract Act, 1872 and the Doctrine of Frustration:\n\nI. Section 56 (paragraph 2) covers agreements to do acts which, after the contract is made, become impossible or unlawful owing to some event which the promisor could not prevent.\nII. Once a contract is frustrated under Section 56, it becomes void, and restitution of benefits is governed strictly by Section 39.\nIII. A contract is not frustrated if the performance merely becomes more difficult, economically burdensome, or commercially less profitable than anticipated.\n\nWhich of the statements given above are correct?',
            options: [
              'I and II only',
              'I and III only',
              'II and III only',
              'I, II and III'
            ],
            correctAnswer: 1,
            explanation: 'Section 56 (paragraph 2) covers downstream/supervening impossibility. When frustrated, the contract is automatically void, and restitution of benefits is governed by Section 65 (not Section 39). Commercial hardship or mere increase in price/costs does not discharge the contract and is not a valid ground for frustration.'
          },
          {
            id: 'q12',
            text: 'In the landmark case Satyabrata Ghose v. Mugneeram Bangur & Co., what did the Supreme Court determine regarding the meaning of "impossibility"?',
            options: [
              'It refers strictly to physical or physical-legal impossibility only.',
              'It does not require physical impossibility, but rather that the performance has become practically or commercially unfeasible, violating the fundamental undertaking of the parties.',
              'Frustration occurs only when the government takes over the entire land of the enterprise.',
              'Economic difficulty or increased costs are sufficient to claim frustration.'
            ],
            correctAnswer: 1,
            explanation: 'The Supreme Court held that "impossible" does not mean physical or literal impossibility; performance is impossible if an unforeseen turn of events destroys the foundation or commercial purpose.'
          },
          {
            id: 'q13',
            text: 'When a contract is declared frustrated under Section 56, what is its status or legal effect?',
            options: [
              'The contract remains valid but voidable at the option of the injured party.',
              'The contract becomes void instantly, automatically and ex-post-facto independent of the action of either party.',
              'The parties must execute a fresh deed with a modified consideration.',
              'The court must draft a new contract to balance the equities.'
            ],
            correctAnswer: 1,
            explanation: 'Under Section 56, once supervening impossibility takes place, the contract is automatically rendered void and dissolved immediately by operation of law.'
          },
          {
            id: 'q14',
            text: 'What provision of the Indian Contract Act governs restitution of benefits once a contract has been declared void due to frustration?',
            options: [
              'Section 56, paragraph 3',
              'Section 65',
              'Section 70',
              'Section 74'
            ],
            correctAnswer: 1,
            explanation: 'Section 65 governs restitution for agreements that become void. It states that when a contract becomes void, any person who received an advantage must restore it or make compensation.'
          },
          {
            id: 'q15',
            text: 'Which of the following is NOT a correct ground for claiming frustration of a contract?',
            options: [
              'Destruction of the subject matter',
              'Death or personal incapacity of a party in a contract of personal service',
              'Mere rise in market price or transport cost making performance unprofitable',
              'Supervening legislative prohibition or war'
            ],
            correctAnswer: 2,
            explanation: 'Commercial hardship, escalation of prices, or difficulty in procuring raw material does not discharge a party from performance and is NOT a valid ground for frustration.'
          }
        ]
      }
    ]
  },
  {
    id: 'clat-pg-mock-2',
    title: 'LexRank CLAT PG Fundamental Rights Practice',
    durationMinutes: 30,
    totalQuestionsCount: 10,
    passages: [
      {
        id: 'p4',
        title: 'Constitutional Law: Basic Structure Doctrine and Amenability of fundamental rights',
        subject: 'Constitutional Law',
        text: 'The power of Parliament to amend the Constitution under Article 368 has been a battleground of constitutional interpretation. In Shankari Prasad (1951) and Sajjan Singh (1965), the Supreme Court ruled that Article 368 contains an all-encompassing power to amend, including Part III (Fundamental Rights). However, in Golaknath (1967), an 11-judge bench reversed this, holding that Parliament cannot curtail fundamental rights as constitutional amendments are "laws" under Article 13(2). This sparked a legislative backlash culminating in the 24th Amendment. In the historic 13-judge bench decision of Kesavananda Bharati v. State of Kerala (1973), the Court formulated the "Basic Structure Doctrine." It held that while Parliament can amend any part of the Constitution under Article 368, it cannot alter, damage, or destroy the fundamental features or basic structure of the Constitution. Elements such as democracy, federalism, secularism, rule of law, and judicial review have been consistently recognized as non-negotiable components of this basic structure.',
        questions: [
          {
            id: 'q16',
            text: 'Which historical constitutional case first promulgated the "Basic Structure Doctrine" in India?',
            options: [
              'I.C. Golaknath v. State of Punjab',
              'Sajjan Singh v. State of Rajasthan',
              'Kesavananda Bharati v. State of Kerala',
              'Minerva Mills v. Union of India'
            ],
            correctAnswer: 2,
            explanation: 'The Basic Structure Doctrine was established by the largest-ever 13-judge bench in Kesavananda Bharati v. State of Kerala (1973).'
          },
          {
            id: 'q17',
            text: 'What was the core holding of the Supreme Court in the I.C. Golaknath v. State of Punjab case?',
            options: [
              'The basic structure of the Constitution is unamendable.',
              'Constitutional amendments made under Article 368 fall within the definition of "law" under Article 13(2), thereby prohibiting any amendment that abridges Part III rights.',
              'Parliament has absolute, unlimited right to abrogate any part of the Constitution.',
              'Judicial Review is not a basic feature of the Constitution.'
            ],
            correctAnswer: 1,
            explanation: 'In Golaknath (1967), the Court held that an amendment is a "law" under Article 13(2) and cannot take away or abridge fundamental rights.'
          },
          {
            id: 'q18',
            text: 'Which amendment was enacted by the Parliament specifically in response to Golaknath to distinguish constitutional amendments from regular laws?',
            options: [
              'The 24th Amendment, 1971',
              'The 42nd Amendment, 1976',
              'The 44th Amendment, 1978',
              'The 1st Amendment, 1951'
            ],
            correctAnswer: 0,
            explanation: 'The 24th Constitutional Amendment (1971) amended Article 13 and Article 368 to clarify that ordinary legislative constraints do not apply to constituent amendments.'
          },
          {
            id: 'q19',
            text: 'Which of the following elements is NOT recognized as a part of the Basic Structure of the Indian Constitution?',
            options: [
              'Judicial Review',
              'Separation of Powers',
              'Absolute, uncontrolled power of Parliament to amend any constitutional provision',
              'Secularism and Federalism'
            ],
            correctAnswer: 2,
            explanation: 'Absolute and unlimited legislative power of amendment is inherently antithetical to the Basic Structure doctrine, as ruled in Minerva Mills v. Union of India.'
          },
          {
            id: 'q20',
            text: 'In which landmark judgment did the Supreme Court strike down clauses (4) and (5) of Article 368 (inserted by 42nd Amendment which sought to exclude judicial review) by applying the Kesavananda rule?',
            options: [
              'Maneka Gandhi v. Union of India',
              'Minerva Mills Ltd. v. Union of India (1980)',
              'Indira Nehru Gandhi v. Raj Narain',
              'S.R. Bommai v. Union of India'
            ],
            correctAnswer: 1,
            explanation: 'In Minerva Mills (1980), the Supreme Court struck down clauses (4) and (5) of Article 368, declaring that a limited amending power is itself a basic structure of the Constitution.'
          }
        ]
      },
      {
        id: 'p5',
        title: 'Criminal Law: Criminal Intention (Mens Rea) and General Exceptions',
        subject: 'Criminal Law',
        text: 'The concept of "Mens Rea" (guilty mind) is central to criminal jurisprudence and is captured by the Latin maxim "actus non facit reum nisi mens sit rea" (an act does not make a person guilty unless their mind is also guilty). Under the Indian Penal Code (IPC) / Bharatiya Nyaya Sanhita (BNS), there is no general explicit statement of mens rea, but the concept is embedded in definitions through words like "intentionally," "voluntarily," "fraudulently," "dishonestly," or "knowingly." General Exceptions (codified in Chapter IV of IPC, now in Chapter III of BNS) act as defenses by showing that the requisite mens rea was absent. For example, Section 80 provides a defense for an accident, provided the act was done with no criminal intention or knowledge, in a lawful manner by lawful means, and with proper care and caution. Similarly, Section 84 protects persons with unsoundness of mind (insanity), incorporating the McNaughten Rules, which require that the person was incapable of knowing the nature of the act, or that it was wrong or contrary to law.',
        questions: [
          {
            id: 'q21',
            text: 'The absolute principle "Actus non facit reum nisi mens sit rea" implies that:',
            options: [
              'Both physical act (actus reus) and mental intent (mens rea) must coexist to constitute a crime',
              'Physical act alone is sufficient to convict in all criminal matters',
              'Mental intent is superior to actual act, so intent alone is punishable',
              'The burden of proof always rests on the defense'
            ],
            correctAnswer: 0,
            explanation: 'The maxim states that a person is criminally liable only when they commit a prohibited act (actus reus) with a guilty mind (mens rea).'
          },
          {
            id: 'q22',
            text: 'Section 84 of the Indian Penal Code (Insanity defense) is largely based on which historical English principles?',
            options: [
              'Durham Standards',
              'McNaughten Rules',
              'Irresistible Impulse Test',
              'Lord Hale\'s wild beast test'
            ],
            correctAnswer: 1,
            explanation: 'Section 84 IPC (and the corresponding BNS chapter) replicates the principles laid down in McNaughten\'s Case (1843).'
          },
          {
            id: 'q23',
            text: 'What essential requirement must be satisfied to seek protection under Section 80 (Accident) as a general exception?',
            options: [
              'The act must be highly beneficial to society.',
              'The act must be done with no criminal intention or knowledge, in a lawful manner, by lawful means, using proper care and caution.',
              'The defendant must have paid damages prior to the trial.',
              'The act must be committed under high emotional stress.'
            ],
            correctAnswer: 1,
            explanation: 'Section 80 requires the accidental act to occur without criminal intention or knowledge, in the performance of a lawful act, in a lawful manner, and with reasonable care.'
          },
          {
            id: 'q24',
            text: 'In Indian jurisprudence, what distinction exists between "medical insanity" and "legal insanity" for the purpose of the criminal defense of insanity?',
            options: [
              'They are completely identical; any medical asylum report guarantees acquittal.',
              'The standard of medical insanity is wider; only legal insanity (incapacity to know the nature/wrongfulness of the act at the exact time of the offense) qualifies for acquittal.',
              'Legal insanity is decided by a group of doctors, while medical insanity is decided by the jury.',
              'The Indian courts do not recognize legal insanity.'
            ],
            correctAnswer: 1,
            explanation: 'India recognizes only legal insanity (under Section 84) where the accused is incapable of knowing the nature/wrongfulness of their act *at the time of commission*. Medical insanity (general mental illness) is not a complete defense.'
          },
          {
            id: 'q25',
            text: 'Which section of the Indian Evidence Act, 1872 states that the burden of proving that the accused\'s case falls under any of the General Exceptions lies upon the accused?',
            options: [
              'Section 101',
              'Section 102',
              'Section 105',
              'Section 114A'
            ],
            correctAnswer: 2,
            explanation: 'Section 105 of the Indian Evidence Act requires the burden of proof to lie on the accused to bring their case under any general exception in criminal codes.'
          }
        ]
      }
    ]
  },
  {
    id: 'clat-pg-mock-3',
    title: 'LexRank Landmark Solved Papers Infiltration Mock 3',
    durationMinutes: 45,
    totalQuestionsCount: 15,
    passages: [
      {
        id: 'p6',
        title: 'Constitutional Law: Minority Education Rights & The Aligarh Muslim University Overruling',
        subject: 'Constitutional Law',
        text: 'The historic Constitution Bench decision in Aligarh Muslim University v. Naresh Agarwal & Ors. (2024 SC 8) has rewritten the jurisprudence surrounding Article 30(1) of the Indian Constitution, which guarantees religious and linguistic minorities the right to establish and administer educational institutions of their choice. The primary legal controversy centered on the correctness of the five-judge bench decision in S. Azeez Basha v. Union of India (1968), which had denied AMU minority status on the formalistic ground that it was established by a central legislative act (the AMU Act, 1920) rather than by the Muslim community. The 2024 Constitution Bench, by overruling Azeez Basha, held that the legal incorporation of an institution via a statute does not automatically dissolve its minority status. The Court emphasized a holistic, substance-over-form approach: what must be examined is whether, in fact, the institution in question was conceptualized, founded, and set up by the minority group, and whether its administrative character reflects a continuation of that minority representation. The Court held that the source of formal incorporation is not decisive for Article 30(1). At the same time, the Bench rejected assertions that a university must possess a religious sanctuary, or that the presence of non-minority elements in its administration completely invalidates its constitutional protection, as long as the underlying establishment criteria are verified through surrounding historical context and charter instruments.',
        questions: [
          {
            id: 'q26',
            text: 'Which of the following core propositions from the 1968 S. Azeez Basha judgment was explicitly rejected and overruled by the Supreme Court in the 2024 Aligarh Muslim University case?',
            options: [
              'A. That Parliament can regulate the syllabus and standards of centrally incorporated minority institutes.',
              'B. That an educational institution cannot be said to be "established" by a minority if it derives its legal character and incorporation through a state or central statute.',
              'C. That Article 30(1) does not extend to the establishment of "Universities" but only to schools and colleges.',
              'D. That the right to administer under Article 30(1) is an absolute, unregulated right.'
            ],
            correctAnswer: 1,
            explanation: 'The 2024 Constitution Bench overruled S. Azeez Basha’s formalist doctrine which held that a minority cannot establish a university if its legal incorporation is achieved through a legislative statute.'
          },
          {
            id: 'q27',
            text: 'How did the Supreme Court in the AMU (2024) decision clarify the evidentiary test to identify the "minority character" of an educational institution?',
            options: [
              'A. It held that the presence of visible religious places of worship and iconography within the campus are mandatory prerequisites.',
              'B. It adopted a holistic and realistic view, stating that minority character is inferred from founding intent, the founders\' identity, management rules, sources of funding, and the institutional mission rather than cosmetic symbols.',
              'C. It held that minority status is instantly proven if a majority of teachers and students belong to the same minority community.',
              'D. It delegated the absolute jurisdiction of fact-finding to the President of India on the advice of the cabinet.'
            ],
            correctAnswer: 1,
            explanation: 'The Supreme Court rejected superficial markers like religious symbols, adopting a robust, holistic analysis centered on the actual historical records of founding, funding, administrative controls, and ideological objectives of the founders.'
          },
          {
            id: 'q28',
            text: 'In constitutional jurisprudence, the distinction between Article 13(1) having retroactive effect versus retrospective effect is most accurately described by which of the following statements?',
            options: [
              'A. A retrospective law applies prospectively with respect to pre-existing facts, while a retroactive law alters past rights and closed transactions.',
              'B. A retroactive rule operates prospectively from its commencement but takes account of pre-existing situations to determine future legal consequences, whereas a retrospective law reaches back to alter past concluded rights.',
              'C. Both retroactive and retrospective laws operate retrospectively, but the former only applies to procedural laws.',
              'D. Article 13(1) is retrospective, meaning it reopens concluded trials and transactions finalised prior to 26 January 1950.'
            ],
            correctAnswer: 1,
            explanation: 'The Supreme Court has clarified that Article 13(1) is retroactive and not retrospective. Retrospective laws alter concluded past rights, while retroactive laws operate prospectively but attach legal consequences to pre-existing facts/events.'
          }
        ]
      },
      {
        id: 'p7',
        title: 'Environmental Law: Retrospective Clearance & Exploding Environmental Jurisprudence',
        subject: 'Other Law',
        text: 'The jurisprudence on international and domestic environmental rule of law underwent heavy scrutiny in the Supreme Court judgment of Vannashakti v. Union of India (2025 INSC 718). The core legal challenge addressed the constitutional validity of executive notifications (including the 2017 regime and subsequent 2021 Office Memoranda) that permitted the "ex post facto" or retrospective grant of Environmental Clearances (EC) to projects that had already commenced or completed operations. The petitioners contended that such retrospective clearances effectively regularised blatant environmental violations and bypassed the mandatory, prior impact assessment process. Affirming the principles of environmental rule of law as "sui generis" and a vital extension of Article 21, the Supreme Court held that the concept of retrospective environmental clearance is completely alien to environmental jurisprudence and the underlying scheme of the EIA Notification 2006. The Court emphasized that allowing ex post facto approvals directly undermines the "Precautionary Principle" and "Sustainable Development" because the entire architectural philosophy of environmental clearances relies on prior preventive scrutiny and impact mitigation before any land is disturbed or construction begins.',
        questions: [
          {
            id: 'q29',
            text: 'According to the Supreme Court’s holding in Vannashakti v. Union of India (2025), ex post facto or retrospective Environmental Clearances (EC) violated which combination of fundamental principles of environmental jurisprudence?',
            options: [
              'A. The Polluter Pays Principle and the Public Trust Doctrine',
              'B. The Precautionary Principle and Sustainable Development',
              'C. The Sovereign Immunity Principle and Administrative Convenience',
              'D. The Doctrine of Necessity and Intergenerational Equity'
            ],
            correctAnswer: 1,
            explanation: 'The Supreme Court explicitly held that retrospective environmental clearances are a derogation of both the Precautionary Principle (which demands preventive action before damage occurs) and Sustainable Development.'
          },
          {
            id: 'q30',
            text: 'The Environment Impact Assessment (EIA) Notification, 2006, which mandates prior EC before any construction work begins, was issued by the Central Government under the authority of which primary legislation?',
            options: [
              'A. The Wildlife (Protection) Act, 1972',
              'B. The Water (Prevention and Control of Pollution) Act, 1974',
              'C. The Environment (Protection) Act, 1986',
              'D. The National Green Tribunal Act, 2010'
            ],
            correctAnswer: 2,
            explanation: 'The EIA Notification 2006 is a piece of subordinate legislation issued under the powers conferred on the Central Government by Section 3 of the Environment (Protection) Act, 1986.'
          },
          {
            id: 'q31',
            text: 'Under the "Mischief Rule" of statutory interpretation, which specific development in the Factories Act, 1948 (Section 2(k)) was relied upon in State of Goa v. Namita Tripathi (2025) to distinguish it from the 1934 predecessor Act?',
            options: [
              'A. The explicit introduction of the concept of "power" in the manufacturing process.',
              'B. The addition of the words "washing, cleaning", which brought laundry and dry-cleaning services under the scope of "manufacturing process" and "factory".',
              'C. The removal of the exemption for premises employing fewer than ten workers.',
              'D. Lowering the minimum threshold of workers to qualify as a factory.'
            ],
            correctAnswer: 1,
            explanation: 'State of Goa v. Namita Tripathi (2025) noted that the 1948 Act corrected the "mischief" of the 1934 Act by explicitly adding "washing, cleaning" to Section 2(k), thereby making dry-cleaning and laundry services a manufacturing process.'
          }
        ]
      },
      {
        id: 'p8',
        title: 'Law of Torts: Constitutional Torts and state Responsibility for Public Law Liability',
        subject: 'Other Law',
        text: 'The growth of "Constitutional Torts" in Indian public law offers a remedy distinct from private law actions in tort. In landmark cases like Kaushal Kishore v. State of Uttar Pradesh (2023), the Supreme Court cemented the principle that a constitutional court can award monetary compensation against the State and its officials for failure to safeguard the fundamental rights, particularly the Right to Life and Personal Liberty under Article 21. Grounded in Rudul Sah v. State of Bihar (1983) and D.K. Basu v. State of West Bengal (1997), the Supreme Court has consistently held that the traditional common law defense of "Sovereign Immunity" has no application when a public law remedy is pursued under Article 32 or 226 for the violation of fundamental rights. The liability in such cases is based on "strict liability" for the breach of the State\'s constitutional duty. While private tort claims require proof of negligence and act as compensatory mechanisms, constitutional tort awards focus on exemplary damages, deterrence of future bureaucratic excesses, and vindication of constitutional rights. However, the Court also noted that in the absence of a structured legislative scheme, courts have historically used varying patterns and "ad hoc" formulas (ranging from "the tortious formula" in Bhim Singh to the "cost to cost" or "welfare-based" payouts) to determine appropriate quantum limits.',
        questions: [
          {
            id: 'q32',
            text: 'The principle that the doctrine of "Sovereign Immunity" cannot be invoked by the State as a defense in actions concerning the violation of fundamental rights was first authoritatively established in which landmark public law decision?',
            options: [
              'A. Kasturilal Ralia Ram Jain v. State of Uttar Pradesh (1965)',
              'B. Rudul Sah v. State of Bihar (1983)',
              'C. State of Bombay v. Narasu Appa Mali (1952)',
              'D. R.C. Cooper v. Union of India (1970)'
            ],
            correctAnswer: 1,
            explanation: 'While Kasturilal (1965) allowed sovereign immunity as a defense under private law, the Supreme Court in Rudul Sah (1983) pioneered constitutional torts by declaring that sovereign immunity cannot defeat a public law claim for compensation under Article 32.'
          },
          {
            id: 'q33',
            text: 'Which ground of judicial review is NOT available against the President\'s power to grant pardon under Article 72 of the Constitution of India, as summarized in Shatrughan Chauhan v. Union of India?',
            options: [
              'A. Non-application of mind by the executive or consideration of irrelevant materials.',
              'B. A complete administrative delay that is unreasonable and causes inordinate mental agony.',
              'C. Scrutinising the evidence on record to arrive at a different legal evaluation of the convict\'s guilt.',
              'D. Mala fides or subjective arbitrariness.'
            ],
            correctAnswer: 2,
            explanation: 'Under Article 72/161, while courts exercise limited judicial review based on non-application of mind or mala fides, they do NOT sit in appeal over the President\'s assessment of guilt or alter the judicial record of conviction.'
          },
          {
            id: 'q34',
            text: 'Which of the following is correct regarding "epistolary jurisdiction" and its first usage in Indian PIL and environmental jurisprudence?',
            options: [
              'A. It was first coined in S.P. Gupta v. Union of India (1981) to expand the locus standi rules.',
              'B. It was used by Justice Krishna Iyer in Fertilizer Corporation Kamgar Union v. Union of India (1981) to describe the court’s reception of simple letters or telegrams as petitions.',
              'C. It refers only to the jurisdiction of the National Green Tribunal to issue suo motu environmental clearances.',
              'D. It was declared ultra vires in the Kesavananda Bharati judgment.'
            ],
            correctAnswer: 1,
            explanation: 'The term "epistolary jurisdiction" was first utilized by Justice Krishna Iyer in Fertilizer Corporation Kamgar Union (1981) to validate the court’s conversion of letters, post-cards, and telegrams into writ petitions under Public Interest Litigation.'
          }
        ]
      }
    ]
  }
];
