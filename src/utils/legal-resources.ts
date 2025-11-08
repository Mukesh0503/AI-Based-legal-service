
import { LegalResource } from "@/types/resource";

export function generateLegalResources(language: string = 'en'): LegalResource[] {
  const baseResources: LegalResource[] = [
    // Articles
    {
      id: "article-1",
      title: language === 'en' ? "Understanding Your Legal Rights" : 
             language === 'hi' ? "अपने कानूनी अधिकारों को समझना" :
             language === 'ta' ? "உங்கள் சட்ட உரிமைகளைப் புரிந்துகொள்வது" :
             language === 'te' ? "మీ చట్టపరమైన హక్కులను అర్థం చేసుకోవడం" :
             "आपल्या कायदेशीर हक्कांचे आकलन",
      description: "A comprehensive guide to basic legal rights in India.",
      category: "article",
      content: `<h2>Understanding Your Legal Rights</h2>
                <p>Every citizen of India is entitled to certain fundamental rights and legal protections.</p>
                <p>This guide covers the most essential rights you should know, including:</p>
                <ul>
                  <li>Right to equality (Article 14-18)</li>
                  <li>Right to freedom (Article 19-22)</li>
                  <li>Right against exploitation (Article 23-24)</li>
                  <li>Right to freedom of religion (Article 25-28)</li>
                  <li>Cultural and educational rights (Article 29-30)</li>
                  <li>Right to constitutional remedies (Article 32)</li>
                </ul>
                <p>Understanding these rights empowers you to navigate the legal system effectively and protect yourself.</p>`,
      author: "Adv. Rajesh Sharma",
      createdAt: "2024-02-15T10:30:00Z",
      tags: ["legal rights", "constitution", "fundamental rights"],
      language: language
    },
    {
      id: "article-2",
      title: language === 'en' ? "Navigating Property Disputes" : 
             language === 'hi' ? "संपत्ति विवादों का समाधान" :
             language === 'ta' ? "சொத்து சர்ச்சைகளை எதிர்கொள்வது" :
             language === 'te' ? "ఆస్తి వివాదాలను నావిగేట్ చేయడం" :
             "मालमत्ता वादांचा सामना करणे",
      description: "Key legal principles in property disputes and how to resolve them.",
      category: "article",
      content: `<h2>Navigating Property Disputes</h2>
                <p>Property disputes are among the most common legal issues faced by Indian citizens. This article covers:</p>
                <ul>
                  <li>Common types of property disputes</li>
                  <li>Key documents needed to establish property ownership</li>
                  <li>The role of revenue records in property disputes</li>
                  <li>Alternative dispute resolution mechanisms</li>
                  <li>When and how to approach the courts</li>
                </ul>
                <p>Understanding these principles can help you protect your property rights and resolve disputes efficiently.</p>`,
      author: "Adv. Meera Patel",
      createdAt: "2024-01-25T14:45:00Z",
      tags: ["property law", "land disputes", "real estate"],
      language: language
    },
    {
      id: "article-3",
      title: language === 'en' ? "Family Law Essentials" : 
             language === 'hi' ? "पारिवारिक कानून की मूल बातें" :
             language === 'ta' ? "குடும்ப சட்ட அடிப்படைகள்" :
             language === 'te' ? "కుటుంబ చట్టం ముఖ్యాంశాలు" :
             "कौटुंबिक कायदा मूलतत्त्वे",
      description: "A guide to marriage, divorce, and child custody laws in India.",
      category: "article",
      content: `<h2>Family Law Essentials</h2>
                <p>Family law governs the legal responsibilities between individuals who share a domestic connection. This comprehensive guide covers:</p>
                <ul>
                  <li>Marriage laws across different personal laws in India</li>
                  <li>Divorce proceedings and grounds for divorce</li>
                  <li>Child custody and guardianship principles</li>
                  <li>Maintenance and alimony rights</li>
                  <li>Adoption procedures and legal requirements</li>
                </ul>
                <p>Family disputes are sensitive matters that require careful navigation of both legal principles and emotional considerations.</p>`,
      author: "Adv. Priya Nair",
      createdAt: "2024-03-10T09:15:00Z",
      tags: ["family law", "marriage", "divorce", "custody"],
      language: language
    },
    
    // FAQs
    {
      id: "faq-1",
      title: language === 'en' ? "Common Legal Questions Answered" : 
             language === 'hi' ? "सामान्य कानूनी प्रश्नों के उत्तर" :
             language === 'ta' ? "பொதுவான சட்டக் கேள்விகளுக்கான பதில்கள்" :
             language === 'te' ? "సాధారణ చట్టపరమైన ప్రశ్నలకు సమాధానాలు" :
             "सामान्य कायदेशीर प्रश्नांची उत्तरे",
      description: "Answers to frequently asked legal questions by citizens.",
      category: "faq",
      content: `<h2>Common Legal Questions Answered</h2>
                <div class="faq-item">
                  <h3>Q: What should I do if I receive a legal notice?</h3>
                  <p>A: Never ignore a legal notice. Read it carefully, note the deadline for response, consult a lawyer immediately, and respond appropriately within the given timeframe.</p>
                </div>
                <div class="faq-item">
                  <h3>Q: How long does a civil case typically take in India?</h3>
                  <p>A: Civil litigation in India can take anywhere from 2-15 years depending on the complexity of the case, the court's backlog, and procedural delays.</p>
                </div>
                <div class="faq-item">
                  <h3>Q: Can I represent myself in court?</h3>
                  <p>A: Yes, you have the right to represent yourself (appear in person) in Indian courts. However, due to the complexity of legal procedures, it's generally advisable to hire a lawyer.</p>
                </div>
                <div class="faq-item">
                  <h3>Q: How can I get free legal aid in India?</h3>
                  <p>A: Free legal services are available through Legal Services Authorities at the taluk, district, state, and national levels for eligible categories including women, children, and persons below the poverty line.</p>
                </div>`,
      author: "Legal Aid Cell",
      createdAt: "2024-02-28T11:00:00Z",
      tags: ["FAQs", "legal advice", "common questions"],
      language: language
    },
    {
      id: "faq-2",
      title: language === 'en' ? "Criminal Law Process Explained" : 
             language === 'hi' ? "आपराधिक कानून प्रक्रिया का विवरण" :
             language === 'ta' ? "குற்றவியல் சட்ட செயல்முறை விளக்கப்பட்டது" :
             language === 'te' ? "క్రిమినల్ లా ప్రక్రియ వివరించబడింది" :
             "फौजदारी कायदा प्रक्रिया स्पष्टीकरण",
      description: "Understanding the criminal justice process from arrest to trial.",
      category: "faq",
      content: `<h2>Criminal Law Process Explained</h2>
                <div class="faq-item">
                  <h3>Q: What are my rights if I am arrested?</h3>
                  <p>A: You have the right to know the grounds of arrest, the right to meet and consult a lawyer, the right to be produced before a magistrate within 24 hours, and protection against custodial violence or torture.</p>
                </div>
                <div class="faq-item">
                  <h3>Q: What is the difference between bailable and non-bailable offenses?</h3>
                  <p>A: In bailable offenses, getting bail is a matter of right; the police or court must grant it. In non-bailable offenses, bail is at the discretion of the court and not a matter of right.</p>
                </div>
                <div class="faq-item">
                  <h3>Q: What is an FIR and when should it be filed?</h3>
                  <p>A: First Information Report (FIR) is a written document prepared by police when they receive information about a cognizable offense. It should be filed as soon as possible after the occurrence of the crime.</p>
                </div>
                <div class="faq-item">
                  <h3>Q: What happens if someone files a false case against me?</h3>
                  <p>A: Filing a false case with malicious intent is punishable under several sections of the Indian Penal Code. You can file a case for malicious prosecution, defamation, or seek compensation for harassment.</p>
                </div>`,
      author: "Criminal Law Cell",
      createdAt: "2024-01-18T16:30:00Z",
      tags: ["criminal law", "arrest", "bail", "FIR"],
      language: language
    },
    
    // Templates
    {
      id: "template-1",
      title: language === 'en' ? "Rental Agreement Template" : 
             language === 'hi' ? "किराया समझौता टेम्पलेट" :
             language === 'ta' ? "வாடகை ஒப்பந்த டெம்ப்ளேட்" :
             language === 'te' ? "అద్దె ఒప్పందం టెంప్లేట్" :
             "भाडे करार टेम्पलेट",
      description: "Standardized rental agreement template for residential properties.",
      category: "template",
      content: `<h2>Rental Agreement Template</h2>
                <p>This is a standardized rental agreement template that can be used for residential properties in India.</p>
                <pre>
                RENTAL AGREEMENT
                
                This Rental Agreement is executed on this [DATE] between:
                
                [OWNER NAME], s/o [FATHER'S NAME], residing at [ADDRESS], hereinafter referred to as the "LESSOR/OWNER"
                
                AND
                
                [TENANT NAME], s/o [FATHER'S NAME], residing at [ADDRESS], hereinafter referred to as the "LESSEE/TENANT"
                
                WHEREAS the Lessor is the absolute owner of the property bearing address [PROPERTY ADDRESS] hereinafter referred to as "PREMISES".
                
                AND WHEREAS the Lessee has approached the Lessor to let out the said Premises and the Lessor has agreed to the same on the following terms and conditions:
                
                1. PERIOD OF TENANCY: The period of tenancy shall be for [MONTHS/YEARS] commencing from [START DATE] and ending on [END DATE].
                
                2. RENT: The Lessee shall pay to the Lessor a monthly rent of Rs. [AMOUNT] (Rupees [AMOUNT IN WORDS] only) payable on or before the [DAY] of each English calendar month.
                
                3. SECURITY DEPOSIT: The Lessee has paid to the Lessor a sum of Rs. [AMOUNT] (Rupees [AMOUNT IN WORDS] only) as interest-free security deposit, which shall be refunded by the Lessor to the Lessee at the time of vacating the premises after deducting unpaid rents, charges for damages, if any.
                
                4. UTILITIES: The Lessee shall pay for all utility services such as electricity, water, gas, and maintenance charges as per actual consumption/charges.
                
                5. MAINTENANCE: The Lessee shall maintain the Premises in good and tenable condition and shall not cause any damage to the Premises.
                
                6. TERMINATION: Either party may terminate this agreement by giving [PERIOD] notice in writing.
                
                7. RESTRICTIONS: The Lessee shall not sublet, assign or part with possession of the Premises without prior written consent of the Lessor.
                
                IN WITNESS WHEREOF, the parties have executed this agreement on the date first above written.
                
                LESSOR                                          LESSEE
                [SIGNATURE]                                   [SIGNATURE]
                
                WITNESS 1                                      WITNESS 2
                [SIGNATURE]                                   [SIGNATURE]
                </pre>`,
      author: "Legal Documents Team",
      createdAt: "2024-03-05T13:20:00Z",
      tags: ["rental agreement", "lease", "property law"],
      language: language
    },
    {
      id: "template-2",
      title: language === 'en' ? "Will Document Template" : 
             language === 'hi' ? "वसीयत दस्तावेज़ टेम्पलेट" :
             language === 'ta' ? "உயில் ஆவண டெம்ப்ளேட்" :
             language === 'te' ? "వీలునామా డాక్యుమెంట్ టెంప్లేట్" :
             "मृत्युपत्र दस्तऐवज टेम्पलेट",
      description: "A standard format for creating a legally valid will.",
      category: "template",
      content: `<h2>Will Document Template</h2>
                <p>This is a standard template for creating a legally valid will. It should be adapted to your specific circumstances and preferably reviewed by a legal professional.</p>
                <pre>
                LAST WILL AND TESTAMENT
                
                I, [FULL NAME], son/daughter of [FATHER'S NAME], residing at [FULL ADDRESS], being of sound mind and memory, do hereby make, publish and declare this to be my last Will and Testament, hereby revoking all Wills and Codicils previously made by me.
                
                1. APPOINTMENT OF EXECUTOR:
                   I hereby nominate, constitute and appoint [EXECUTOR NAME] as the Executor of this, my last Will and Testament. In the event that [EXECUTOR NAME] is unable or unwilling to serve, then I nominate, constitute and appoint [ALTERNATE EXECUTOR NAME] as the Executor.
                
                2. DEBTS AND EXPENSES:
                   I direct my Executor to pay all my just debts, funeral expenses, and the expenses of administering my estate as soon after my demise as practicable.
                
                3. DISTRIBUTION OF ASSETS:
                   After the payment of all my just debts, funeral expenses, and expenses of administering my estate, I give, devise and bequeath my assets as follows:
                
                   a. To my [RELATION] [NAME], I give the following: [SPECIFIC ASSETS/PROPERTIES]
                   b. To my [RELATION] [NAME], I give the following: [SPECIFIC ASSETS/PROPERTIES]
                   c. [CONTINUE AS NEEDED FOR ALL BENEFICIARIES]
                
                4. RESIDUARY CLAUSE:
                   All the rest, residue and remainder of my estate, both real and personal, whatsoever and wheresoever situated, I give, devise and bequeath to [NAME].
                
                5. GUARDIAN FOR MINOR CHILDREN (if applicable):
                   In the event of my death while my children are minors, I hereby appoint [GUARDIAN NAME] as the guardian of the person and property of such minor children.
                
                IN WITNESS WHEREOF, I have hereunto set my hand to this my Last Will and Testament at [PLACE] on this [DATE].
                
                [SIGNATURE]
                
                SIGNED by the above-named Testator as his/her Last Will in our presence, and we, at his/her request and in his/her presence, and in the presence of each other, have subscribed our names as witnesses, after the Testator has signed the Will.
                
                WITNESSES:
                1. [NAME] [SIGNATURE] [ADDRESS]
                2. [NAME] [SIGNATURE] [ADDRESS]
                </pre>`,
      author: "Estate Planning Team",
      createdAt: "2024-02-10T10:15:00Z",
      tags: ["will", "testament", "inheritance", "estate planning"],
      language: language
    },
    {
      id: "template-3",
      title: language === 'en' ? "Power of Attorney Template" : 
             language === 'hi' ? "मुख्तारनामा टेम्पलेट" :
             language === 'ta' ? "அட்டர்னி அதிகார டெம்ப்ளேட்" :
             language === 'te' ? "పవర్ ఆఫ్ అటార్నీ టెంప్లేట్" :
             "मुखत्यारपत्र टेम्पलेट",
      description: "General Power of Attorney document template.",
      category: "template",
      content: `<h2>Power of Attorney Template</h2>
                <p>This is a general Power of Attorney template that should be customized based on specific requirements.</p>
                <pre>
                POWER OF ATTORNEY
                
                BY THIS POWER OF ATTORNEY made this [DATE], I, [PRINCIPAL NAME], son/daughter of [FATHER'S NAME], residing at [ADDRESS], do hereby appoint [ATTORNEY NAME], son/daughter of [FATHER'S NAME], residing at [ADDRESS], as my true and lawful Attorney to act in my name and on my behalf and to do the following acts, deeds and things:
                
                1. To manage all my properties, both movable and immovable, situated within the territory of India.
                
                2. To appear for and represent me before any Government Office, Registration Office, Court, Tribunal, or any other Judicial or Quasi-Judicial Authority.
                
                3. To execute, sign, verify, and present any application, appeal, review, petition, or other proceedings before any authority mentioned above.
                
                4. To deposit and withdraw moneys from my bank accounts and to operate my bank accounts.
                
                5. To execute, sign, and register any deed of sale, conveyance, mortgage, lease, release, or any other deed or document.
                
                6. To receive any rent, issue receipts, and to evict any tenant or occupant from my property.
                
                7. To appoint any lawyer, advocate, pleader, or attorney to act in any legal proceeding on my behalf.
                
                8. To take any action necessary for the protection of my interests concerning the properties mentioned above.
                
                AND I hereby agree to ratify and confirm all and whatsoever my said Attorney shall lawfully do or cause to be done by virtue of this Power of Attorney.
                
                This Power of Attorney shall remain valid until revoked by me in writing.
                
                IN WITNESS WHEREOF, I have signed this Power of Attorney at [PLACE] on the day, month and year first above written.
                
                SIGNED AND DELIVERED
                by the within named [PRINCIPAL NAME]
                
                [SIGNATURE]
                
                In the presence of:
                
                WITNESSES:
                1. [NAME] [SIGNATURE] [ADDRESS]
                2. [NAME] [SIGNATURE] [ADDRESS]
                </pre>`,
      author: "Legal Documents Team",
      createdAt: "2024-01-30T14:40:00Z",
      tags: ["power of attorney", "legal representation", "authorization"],
      language: language
    }
  ];
  
  return baseResources;
}
