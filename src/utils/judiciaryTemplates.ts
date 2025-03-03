import { jsPDF } from "jspdf";

// Define a type for the PDF template function
export type PdfTemplateFunction = (doc: jsPDF) => void;

export interface JudiciaryTemplate {
    id: string;
    name: string;
    description: string;
    templateFunction: PdfTemplateFunction; // Use a function to generate the PDF content
}

// Example PDF template functions (using jsPDF API directly)
const affidavitTemplate: PdfTemplateFunction = (doc: jsPDF) => {
    const textColor = "#333333";
    const headingColor = "#0077cc";
    const signatureLineLength = 100;

    doc.setFont('times', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(headingColor);
    doc.text("AFFIDAVIT", 105, 20, { align: 'center' });

    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(textColor);
    doc.text("I, [Your Name], residing at [Your Address], do solemnly swear and affirm under penalty of perjury that the following statements are true and correct to the best of my knowledge, information, and belief:", 20, 40, { maxWidth: 170 });

    doc.setFontSize(11);
    doc.text("1. Statement 1: [Detailed statement about a fact, event, or circumstance]", 30, 60, { maxWidth: 160 });
    doc.text("2. Statement 2: [Another detailed statement providing additional context]", 30, 80, { maxWidth: 160 });
    doc.text("3. Statement 3: [A concluding statement affirming the truthfulness of the foregoing]", 30, 100, { maxWidth: 160 });

    doc.setFontSize(12);
    doc.text("Further Affiant Sayeth Naught.", 20, 120);

    doc.text("Signed this _____ day of __________, 20___ at [Location].", 20, 140);

    doc.line(20, 160, 20 + signatureLineLength, 160);
    doc.text("Signature of Affiant", 20, 165);

    doc.setFontSize(10);
    doc.text("Subscribed and sworn to before me this _____ day of __________, 20___.", 20, 180);
    doc.line(20, 200, 20 + signatureLineLength, 200);
    doc.text("Notary Public", 20, 205);
};

const summonsTemplate: PdfTemplateFunction = (doc: jsPDF) => {
    const textColor = "#333333";
    const headingColor = "#0077cc";

    doc.setFont('times', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(headingColor);
    doc.text("SUMMONS", 105, 20, { align: 'center' });

    doc.setFont('times', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(textColor);
    doc.text("To: [Defendant's Name]", 20, 40);
    doc.text("Address: [Defendant's Address]", 20, 48);

    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text("You are hereby summoned to appear before the [Court Name] at [Court Address] on [Date] at [Time] to answer the complaint filed against you in the above-entitled action.", 20, 65, { maxWidth: 170 });

    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.text("Failure to appear may result in a judgment being entered against you.", 20, 85, { maxWidth: 170 });

    doc.setFont('times', 'bold');
    doc.text("Issued on [Date]", 20, 100);
    doc.line(20, 120, 70, 120);  //Line for signature
    doc.text("[Clerk of Court Name]", 20, 125);

    doc.setFont('times', 'italic');
    doc.setFontSize(10);
    doc.text("(Seal of the Court)", 150, 140);
};

const legalContractTemplate: PdfTemplateFunction = (doc: jsPDF) => {
    const textColor = "#333333";
    const headingColor = "#0077cc";

    doc.setFont('times', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(headingColor);
    doc.text("LEGAL CONTRACT", 105, 20, { align: 'center' });

    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(textColor);
    doc.text("This contract is made on [Date] between:", 20, 40);

    doc.setFont('times', 'bold');
    doc.text("Party A:", 20, 55);
    doc.setFont('times', 'normal');
    doc.text("[Name] residing at [Address]", 50, 55);

    doc.setFont('times', 'bold');
    doc.text("Party B:", 20, 70);
    doc.setFont('times', 'normal');
    doc.text("[Name] residing at [Address]", 50, 70);

    doc.setFont('times', 'bold');
    doc.text("Terms and Conditions:", 20, 85);
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.text("1. [Clause 1]: [Detailed clause specifying rights, obligations, and considerations]", 30, 95, { maxWidth: 160 });
    doc.text("2. [Clause 2]: [Another clause addressing contingencies, timelines, and responsibilities]", 30, 115, { maxWidth: 160 });
    doc.text("3. [Clause 3]: [A clause regarding dispute resolution, governing law, and termination]", 30, 135, { maxWidth: 160 });

    doc.setFontSize(12);
    doc.text("Signed:", 20, 155);
    doc.line(20, 175, 70, 175);
    doc.text("Party A", 20, 180);

    doc.line(120, 175, 170, 175);
    doc.text("Party B", 120, 180);
};

const witnessStatementTemplate: PdfTemplateFunction = (doc: jsPDF) => {
    const textColor = "#333333";
    const headingColor = "#0077cc";

    doc.setFont('times', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(headingColor);
    doc.text("WITNESS STATEMENT", 105, 20, { align: 'center' });

    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(textColor);
    doc.text("I, [Witness Name], residing at [Address], state as follows under penalty of perjury:", 20, 40, { maxWidth: 170 });

    doc.setFontSize(11);
    doc.text("1. [Statement 1]: [A detailed account of what the witness observed or heard]", 30, 60, { maxWidth: 160 });
    doc.text("2. [Statement 2]: [Additional details providing context and clarification]", 30, 80, { maxWidth: 160 });
    doc.text("3. [Statement 3]: [A concluding statement affirming the truthfulness and accuracy of the witness's testimony]", 30, 100, { maxWidth: 160 });

    doc.text("Signed on [Date]", 20, 120);
    doc.line(20, 140, 70, 140);
    doc.text("Signature: ___________________", 20, 145);
};

const powerOfAttorneyTemplate: PdfTemplateFunction = (doc: jsPDF) => {
    const textColor = "#333333";
    const headingColor = "#0077cc";

    doc.setFont('times', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(headingColor);
    doc.text("POWER OF ATTORNEY", 105, 20, { align: 'center' });

    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(textColor);
    doc.text("I, [Grantor Name], residing at [Address], hereby appoint [Attorney Name], residing at [Address], as my true and lawful attorney-in-fact to act for me and in my name, place, and stead.", 20, 40, { maxWidth: 170 });

    doc.text("This Power of Attorney is granted for the following purposes:", 20, 60);
    doc.text("[Purpose]: [A specific and detailed description of the authority granted to the attorney-in-fact]", 30, 70, { maxWidth: 160 });

    doc.text("Executed on [Date] at [Location].", 20, 90);
    doc.line(20, 110, 70, 110);
    doc.text("Signature: ___________________", 20, 115);

    doc.setFont('times', 'italic');
    doc.setFontSize(10);
    doc.text("Witnessed:", 120, 90);
    doc.line(120, 110, 170, 110);
    doc.text("Witness Signature: ___________________", 120, 115);
};

// Define your judiciary templates
export const judiciaryTemplates: JudiciaryTemplate[] = [
    {
        id: "affidavit",
        name: "Affidavit",
        description: "A sworn statement of facts.",
        templateFunction: affidavitTemplate, // Use the template function
    },
    {
        id: "summons",
        name: "Summons",
        description: "A legal order to appear in court.",
        templateFunction: summonsTemplate, // Use the template function
    },
    {
        id: "legal_contract",
        name: "Legal Contract",
        description: "A binding agreement between parties.",
        templateFunction: legalContractTemplate,
    },
    {
        id: "witness_statement",
        name: "Witness Statement",
        description: "A statement given by a witness in a legal case.",
        templateFunction: witnessStatementTemplate,
    },
    {
        id: "power_of_attorney",
        name: "Power of Attorney",
        description: "A legal document granting someone authority to act on behalf of another.",
        templateFunction: powerOfAttorneyTemplate,
    },
];