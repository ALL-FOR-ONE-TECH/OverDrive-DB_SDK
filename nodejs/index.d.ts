/**
 * TypeScript type definitions for overdrive-db
 */

export class OverDrive {
    /**
     * Open (or create) a database.
     * @param dbPath - Path to the database file
     */
    constructor(dbPath: string);

    /** Close the database. */
    close(): void;

    /** Sync data to disk. */
    sync(): void;

    /** Get database file path. */
    readonly path: string;

    /** Get SDK version. */
    static version(): string;

    // ── Tables ─────────────────────────────────

    /** Create a table. */
    createTable(name: string): void;

    /** Drop a table. */
    dropTable(name: string): void;

    /** List all tables. */
    listTables(): string[];

    /** Check if table exists. */
    tableExists(name: string): boolean;

    // ── CRUD ───────────────────────────────────

    /**
     * Insert a document.
     * @param table - Table name
     * @param doc - JSON document
     * @returns The generated _id
     */
    insert(table: string, doc: Record<string, any>): string;

    /**
     * Insert multiple documents.
     * @returns List of _ids
     */
    insertMany(table: string, docs: Record<string, any>[]): string[];

    /**
     * Get a document by _id.
     * @returns The document or null
     */
    get(table: string, id: string): Record<string, any> | null;

    /**
     * Update a document by _id.
     * @returns True if updated
     */
    update(table: string, id: string, updates: Record<string, any>): boolean;

    /**
     * Delete a document by _id.
     * @returns True if deleted
     */
    delete(table: string, id: string): boolean;

    /**
     * Count documents in a table.
     */
    count(table: string): number;

    // ── Query ──────────────────────────────────

    /**
     * Execute SQL query.
     * @returns Result rows
     */
    query(sql: string): Record<string, any>[];

    /**
     * Execute SQL query with full metadata.
     */
    queryFull(sql: string): {
        rows: Record<string, any>[];
        columns: string[];
        rows_affected: number;
    };

    /**
     * Full-text search.
     */
    search(table: string, text: string): Record<string, any>[];
}
