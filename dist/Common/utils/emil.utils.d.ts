export declare class EmailUtils {
    private transporter;
    constructor();
    sendEmail(to: string, subject: string, html: string): Promise<void>;
    sendManyEmails(emailArray: string[], subject: string, html: string): Promise<void>;
}
