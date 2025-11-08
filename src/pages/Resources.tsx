import { useState } from "react";
import { LegalResource, ResourceCategory } from "@/types/resource";
import { useLanguage } from "@/contexts/LanguageContext";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ResourceDetails } from "@/components/resources/ResourceDetails";
import { ResourceFilters } from "@/components/resources/ResourceFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Mock data for legal resources
const mockResources: LegalResource[] = [
  {
    id: "1",
    title: "Understanding Family Law in India",
    description: "A comprehensive guide to family law procedures, rights, and obligations in India.",
    category: "article",
    content: `<h2>Introduction to Family Law</h2>
              <p>Family law in India encompasses a wide range of legal issues including marriage, divorce, child custody, adoption, and property rights.</p>
              <h2>Marriage Laws</h2>
              <p>India recognizes different personal laws based on religion. The Hindu Marriage Act, Muslim Personal Law, Christian Marriage Act, and Special Marriage Act govern marriages for different communities.</p>
              <h2>Divorce Procedures</h2>
              <p>Divorce can be obtained through mutual consent or contested proceedings. The grounds for divorce vary based on the applicable personal law.</p>
              <h2>Child Custody</h2>
              <p>The welfare of the child is paramount in custody decisions. Courts consider factors such as the child's age, wishes, and the parents' ability to provide care.</p>`,
    author: "Advocate Priya Sharma",
    createdAt: "2024-02-15T10:30:00Z",
    tags: ["family law", "divorce", "custody"],
    language: "en"
  },
  {
    id: "2",
    title: "भारत में परिवार कानून को समझना",
    description: "भारत में परिवार कानून प्रक्रियाओं, अधिकारों और दायित्वों के लिए एक व्यापक मार्गदर्शिका।",
    category: "article",
    content: `<h2>परिवार कानून का परिचय</h2>
              <p>भारत में परिवार कानून में विवाह, तलाक, बच्चों की हिरासत, गोद लेने और संपत्ति के अधिकारों सहित कई कानूनी मुद्दे शामिल हैं।</p>
              <h2>विवाह कानून</h2>
              <p>भारत धर्म के आधार पर विभिन्न व्यक्तिगत कानूनों को मान्यता देता है। हिंदू विवाह अधिनियम, मुस्लिम व्यक्तिगत कानून, ईसाई विवाह अधिनियम और विशेष विवाह अधिनियम विभिन्न समुदायों के लिए विवाह को नियंत्रित करते हैं।</p>
              <h2>तलाक प्रक्रियाएं</h2>
              <p>तलाक आपसी सहमति या विवादित कार्यवाही के माध्यम से प्राप्त किया जा सकता है। तलाक के आधार लागू व्यक्तिगत कान��न के आधार पर भिन्न होते हैं।</p>
              <h2>बाल हिरासत</h2>
              <p>हिरासत के फैसलों में बच्चे का कल्याण सर्वोपरि है। अदालतें बच्चे की उम्र, इच्छाओं और देखभाल प्रदान करने की माता-पिता की क्षमता जैसे कारकों पर विचार करती हैं।</p>`,
    author: "अधिवक्ता प्रिया शर्मा",
    createdAt: "2024-02-15T10:30:00Z",
    tags: ["परिवार कानून", "तलाक", "हिरासत"],
    language: "hi"
  },
  {
    id: "3",
    title: "Property Rights and Ownership Documentation",
    description: "Learn about property documentation requirements, registration processes, and legal safeguards for property ownership.",
    category: "article",
    content: `<h2>Property Documentation</h2>
              <p>Proper documentation is crucial for establishing clear property ownership. Key documents include sale deed, title deed, property tax receipts, and encumbrance certificate.</p>
              <h2>Registration Process</h2>
              <p>Property registration involves paying stamp duty, registration fees, and appearing before the sub-registrar to execute and register the sale deed.</p>
              <h2>Legal Safeguards</h2>
              <p>Conduct thorough title verification, encumbrance checks, and obtain legal opinions before purchasing property to prevent disputes later.</p>`,
    author: "Advocate K.R. Natarajan",
    createdAt: "2024-03-05T14:45:00Z",
    tags: ["property law", "documentation", "registration"],
    language: "en"
  },
  {
    id: "4",
    title: "How to file an RTI Application",
    description: "Step-by-step guide on filing and following up on Right to Information (RTI) applications.",
    category: "template",
    content: `<h2>RTI Application Template</h2>
              <p>To,<br>
              The Public Information Officer,<br>
              [Name of the Public Authority]<br>
              [Address]</p>
              
              <p>Subject: Request for information under RTI Act, 2005</p>
              
              <p>Sir/Madam,</p>
              
              <p>Under the Right to Information Act, 2005, I would like to request the following information:</p>
              
              <p>1. [Clearly state the information you are seeking]<br>
              2. [Add more points if necessary]</p>
              
              <p>I am enclosing the application fee of Rs. 10/- through [payment method].</p>
              
              <p>Yours faithfully,</p>
              
              <p>[Your Name]<br>
              [Your Address]<br>
              [Contact Number]<br>
              Date: [Date]</p>
              
              <h3>Follow-up Process</h3>
              <p>If you don't receive a response within 30 days, you can file a first appeal with the First Appellate Authority of the same public authority.</p>`,
    author: "Legal Aid Society",
    createdAt: "2024-01-20T09:15:00Z",
    tags: ["RTI", "transparency", "government"],
    language: "en"
  },
  {
    id: "5",
    title: "Common Questions About Consumer Rights",
    description: "Answers to frequently asked questions about consumer protection laws and dispute resolution.",
    category: "faq",
    content: `<h2>Consumer Rights FAQs</h2>
              
              <h3>Q: What is the Consumer Protection Act?</h3>
              <p>A: The Consumer Protection Act, 2019 replaced the 1986 Act and provides for enhanced consumer rights, simplified dispute resolution, and stricter penalties for violations.</p>
              
              <h3>Q: How do I file a consumer complaint?</h3>
              <p>A: Consumer complaints can be filed online through the National Consumer Helpline portal or physically at the District, State, or National Consumer Disputes Redressal Commission based on the value of goods or services.</p>
              
              <h3>Q: What is the time limit for filing a consumer complaint?</h3>
              <p>A: A complaint must be filed within two years from the date on which the cause of action arose.</p>
              
              <h3>Q: Do I need a lawyer to file a consumer complaint?</h3>
              <p>A: No, you can represent yourself at a consumer forum. However, for complex cases, legal assistance may be beneficial.</p>`,
    author: "Consumer Rights Association",
    createdAt: "2023-11-10T16:20:00Z",
    tags: ["consumer rights", "complaints", "protection"],
    language: "en"
  },
  {
    id: "6",
    title: "Employment Contract Template",
    description: "A standard employment contract template that covers essential terms and conditions.",
    category: "template",
    content: `<h2>EMPLOYMENT AGREEMENT</h2>
              
              <p>This Employment Agreement ("Agreement") is made and entered into on [DATE], by and between:</p>
              
              <p>[EMPLOYER NAME], with its principal place of business at [ADDRESS] (hereinafter referred to as "the Employer")</p>
              
              <p>AND</p>
              
              <p>[EMPLOYEE NAME], residing at [ADDRESS] (hereinafter referred to as "the Employee")</p>
              
              <h3>1. POSITION AND DUTIES</h3>
              <p>The Employer hereby employs the Employee as [JOB TITLE], and the Employee accepts such employment. The Employee shall perform duties as described in the job description attached as Exhibit A.</p>
              
              <h3>2. TERM OF EMPLOYMENT</h3>
              <p>This Agreement shall commence on [START DATE] and shall continue until terminated in accordance with the provisions of this Agreement.</p>
              
              <h3>3. COMPENSATION</h3>
              <p>As compensation for services rendered under this Agreement, the Employee shall receive a [monthly/annual] salary of Rs. [AMOUNT], subject to statutory deductions.</p>
              
              <h3>4. WORKING HOURS</h3>
              <p>The Employee shall work [NUMBER] hours per week, from [START TIME] to [END TIME], [DAYS OF WEEK].</p>
              
              <h3>5. CONFIDENTIALITY</h3>
              <p>The Employee agrees to maintain the confidentiality of all proprietary information of the Employer during and after employment.</p>
              
              <h3>6. TERMINATION</h3>
              <p>Either party may terminate this Agreement by providing [NOTICE PERIOD] written notice to the other party.</p>
              
              <p>IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.</p>
              
              <p>__________________________<br>
              [EMPLOYER NAME]</p>
              
              <p>__________________________<br>
              [EMPLOYEE NAME]</p>`,
    author: "Legal Templates Inc.",
    createdAt: "2023-12-05T11:30:00Z",
    tags: ["employment", "contract", "legal template"],
    language: "en"
  },
  {
    id: "7",
    title: "नौकरी अनुबंध टेम्पलेट",
    description: "एक मानक रोजगार अनुबंध टेम्पलेट जो आवश्यक शर्तों और स्थितियों को कवर करता है।",
    category: "template",
    content: `<h2>रोजगार अनुबंध</h2>
              
              <p>यह रोजगार अनुबंध ("अनुबंध") [तिथि] को निम्नलिखित पक्षों के बीच किया जाता है:</p>
              
              <p>[नियोक्ता का नाम], जिसका प्रधान व्यापार स्थान [पता] है (जिसे इसके बाद "नियोक्ता" कहा जाएगा)</p>
              
              <p>और</p>
              
              <p>[कर्मचारी का नाम], निवासी [पता] (जिसे इसके बाद "कर्मचारी" कहा जाएगा)</p>
              
              <h3>1. पद और कर्तव्य</h3>
              <p>नियोक्ता इसके द्वारा कर्मचारी को [नौकरी का शीर्षक] के रूप में नियुक्त करता है, और कर्मचारी इस रोज़गार को स्वीकार करता है। कर्मचारी उन कर्तव्यों का पालन करेगा जो प्रदर्शन A के रूप में संलग्न नौकरी विवरण में वर्णित हैं।</p>
              
              <h3>2. रोज़गार की अवधि</h3>
              <p>यह अनुबंध [प्रारंभ तिथि] से शुरू होगा और इस अनुबंध के प्रावधानों के अनुसार समाप्त होने तक जारी रहेगा।</p>
              
              <h3>3. पारिश्रमिक</h3>
              <p>इस अनुबंध के तहत प्रदान की गई सेवाओं के लिए मुआवजे के रूप में, कर्मचारी को वैधानिक कटौती के अधीन रु. [राशि] का [मासिक / वार्षिक] वेतन प्राप्त होगा।</p>
              
              <h3>4. काम के घंटे</h3>
              <p>कर्मचारी [संख्या] घंटे प्रति सप्ताह, [प्रारंभ समय] से [समाप्ति समय], [सप्ताह के दिन] काम करेगा।</p>
              
              <h3>5. गोपनीयता</h3>
              <p>कर्मचारी रोजगार के दौरान और बाद में नियोक्ता की सभी स्वामित्व जानकारी की गोपनीयता बनाए रखने के लिए सहमत है।</p>
              
              <h3>6. समाप्ति</h3>
              <p>कोई भी पक्ष दूसरे ���क्ष को [नोटिस अवधि] लिखित नोटिस देकर इस अनुबंध को समाप्त कर सकता है।</p>
              
              <p>जिसके साक्ष्य में, पक्षों ने इस अनुबंध को ऊपर लिखित तिथि से निष्पादित किया है।</p>
              
              <p>__________________________<br>
              [नियोक्ता का नाम]</p>
              
              <p>__________________________<br>
              [कर्मचारी का नाम]</p>`,
    author: "लीगल टेम्पलेट्स इंक.",
    createdAt: "2023-12-05T11:30:00Z",
    tags: ["रोजगार", "अनुबंध", "कानूनी टेम्पलेट"],
    language: "hi"
  },
  {
    id: "8",
    title: "Rental Agreement Template",
    description: "Comprehensive rental/lease agreement template with all essential clauses and terms.",
    category: "template",
    content: `<h2>RESIDENTIAL RENTAL AGREEMENT</h2>
              
              <p>This Residential Rental Agreement ("Agreement") is made on [DATE] between:</p>
              
              <p>LANDLORD: [LANDLORD NAME]<br>
              Address: [LANDLORD ADDRESS]</p>
              
              <p>and</p>
              
              <p>TENANT: [TENANT NAME]<br>
              Address: [PROPERTY ADDRESS]</p>
              
              <h3>1. PROPERTY</h3>
              <p>The Landlord agrees to rent to the Tenant the residential property located at: [FULL PROPERTY ADDRESS]</p>
              
              <h3>2. TERM</h3>
              <p>The term of this Agreement shall be for [NUMBER] months, beginning on [START DATE] and ending on [END DATE].</p>
              
              <h3>3. RENT</h3>
              <p>The monthly rent shall be Rs. [AMOUNT] payable in advance on the [DAY] of each month.</p>
              
              <h3>4. SECURITY DEPOSIT</h3>
              <p>The Tenant shall pay a security deposit of Rs. [AMOUNT] to be held by the Landlord during the term of this Agreement.</p>
              
              <h3>5. UTILITIES</h3>
              <p>The Tenant shall be responsible for payment of the following utilities: [LIST UTILITIES]</p>
              
              <h3>6. MAINTENANCE AND REPAIRS</h3>
              <p>The Tenant shall maintain the Property in good condition and shall promptly notify the Landlord of any necessary repairs.</p>
              
              <p>Signatures:</p>
              
              <p>_______________________<br>
              Landlord</p>
              
              <p>_______________________<br>
              Tenant</p>`,
    author: "Legal Documents India",
    createdAt: "2024-01-15T08:30:00Z",
    tags: ["rental", "property", "agreement"],
    language: "en"
  },
  {
    id: "9",
    title: "Power of Attorney Template",
    description: "Standard Power of Attorney document template with customizable clauses.",
    category: "template",
    content: `<h2>POWER OF ATTORNEY</h2>
              
              <p>TO ALL TO WHOM THESE PRESENTS SHALL COME, I [NAME OF PRINCIPAL], residing at [ADDRESS], do hereby appoint [NAME OF ATTORNEY], residing at [ADDRESS] as my true and lawful attorney to act in my name and on my behalf and to do or execute all or any of the following acts or things:</p>
              
              <h3>1. POWERS GRANTED</h3>
              <p>1.1 To manage and conduct all my affairs<br>
              1.2 To execute all documents on my behalf<br>
              1.3 To represent me before all offices and authorities<br>
              1.4 To operate my bank accounts<br>
              1.5 To manage my properties</p>
              
              <h3>2. EFFECTIVE DATE AND DURATION</h3>
              <p>This Power of Attorney shall come into effect from [DATE] and shall remain valid until revoked by me in writing.</p>
              
              <h3>3. GOVERNING LAW</h3>
              <p>This Power of Attorney shall be governed by the laws of India.</p>
              
              <p>IN WITNESS WHEREOF, I have executed this Power of Attorney on this [DAY] of [MONTH], [YEAR].</p>
              
              <p>_______________________<br>
              [NAME OF PRINCIPAL]</p>
              
              <p>Witnesses:</p>
              
              <p>1. _______________________</p>
              <p>2. _______________________</p>`,
    author: "Legal Templates India",
    createdAt: "2024-02-20T10:15:00Z",
    tags: ["power of attorney", "legal", "authorization"],
    language: "en"
  },
  {
    id: "10",
    title: "Will Template",
    description: "Simple Last Will and Testament template with standard provisions.",
    category: "template",
    content: `<h2>LAST WILL AND TESTAMENT</h2>
              
              <p>I, [FULL NAME], residing at [ADDRESS], declare this to be my Last Will and Testament.</p>
              
              <h3>1. REVOCATION</h3>
              <p>I hereby revoke all prior wills and codicils.</p>
              
              <h3>2. MARITAL STATUS</h3>
              <p>I am married to [SPOUSE NAME], and all references to my spouse in this Will are to [him/her].</p>
              
              <h3>3. CHILDREN</h3>
              <p>The names of my children are: [NAMES OF CHILDREN]</p>
              
              <h3>4. DISPOSITION OF PROPERTY</h3>
              <p>4.1 I give, devise and bequeath all my property, both real and personal, of whatever kind and wherever located, to [BENEFICIARY NAME].</p>
              
              <h3>5. EXECUTOR</h3>
              <p>I appoint [EXECUTOR NAME] as executor of this Will.</p>
              
              <p>IN WITNESS WHEREOF, I have hereunto set my hand this [DAY] of [MONTH], [YEAR]</p>
              
              <p>_______________________<br>
              [TESTATOR NAME]</p>
              
              <p>Witnesses:</p>
              
              <p>1. _______________________</p>
              <p>2. _______________________</p>`,
    author: "Legal Documentation Services",
    createdAt: "2024-03-10T14:45:00Z",
    tags: ["will", "testament", "inheritance"],
    language: "en"
  }
];

// Update the count in categories
const mockCategories: ResourceCategory[] = [
  { id: "article", name: "Articles", description: "In-depth legal articles and analysis", count: 3 },
  { id: "faq", name: "FAQs", description: "Frequently asked legal questions", count: 1 },
  { id: "template", name: "Templates", description: "Legal document templates", count: 6 }
];

export default function Resources() {
  const { translate } = useLanguage();
  const [resources] = useState<LegalResource[]>(mockResources);
  const [categories] = useState<ResourceCategory[]>(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResource, setSelectedResource] = useState<LegalResource | null>(null);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  
  // Filter resources based on category and search term
  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory ? resource.category === selectedCategory : true;
    const matchesSearch = searchTerm 
      ? resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    
    return matchesCategory && matchesSearch;
  });

  const handleResourceClick = (resource: LegalResource) => {
    setSelectedResource(resource);
    setResourceModalOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">{translate('resources')}</h1>
      
      <ResourceFilters 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onSearch={setSearchTerm}
      />
      
      <Tabs defaultValue="grid" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <ResourceCard 
                key={resource.id} 
                resource={resource}
                onClick={handleResourceClick}
              />
            ))}
            
            {filteredResources.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No resources found matching your criteria.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="space-y-4">
          {filteredResources.map(resource => (
            <div 
              key={resource.id}
              className="border rounded-lg p-4 hover:bg-accent cursor-pointer"
              onClick={() => handleResourceClick(resource)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </div>
                <Badge variant={
                  resource.category === 'article' ? 'default' : 
                  resource.category === 'faq' ? 'secondary' : 'outline'
                }>
                  {resource.category}
                </Badge>
              </div>
            </div>
          ))}
          
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No resources found matching your criteria.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <ResourceDetails 
        resource={selectedResource}
        open={resourceModalOpen}
        onOpenChange={setResourceModalOpen}
      />
    </div>
  );
}
