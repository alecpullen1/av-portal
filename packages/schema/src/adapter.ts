export interface IAdapter {
    // pull all data on first connection
    initalSync(): Promise<SyncResult>

    // individual fetches
    getProjects(): Promise<Project[]>
    getQuote(externalId: string): Promise<Quote | null>

    // write back
    writeApproval(externalId: string, approvedAt: Date): Promise<void>
    writeComment(externalId: string, comment: string): Promise<void>
}

export interface SyncResult {
    projects: Project[]
    quotes:   Quote[]
    contacts: Contact[]
    invoices: Invoice[]
}