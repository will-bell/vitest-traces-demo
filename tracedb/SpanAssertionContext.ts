import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { spansTable } from "./schema";
import { eq, and, SQL } from "drizzle-orm";

export default class SpansAssertionContext {
  private selectors: SQL[];

  constructor(
    private db: NodePgDatabase,
    private testName: string
  ) {
    this.selectors = [];
    this.selectors.push(eq(spansTable.testName, this.testName));
  }

  get with() {
    return {
      name: (name: string) => {
        this.selectors.push(eq(spansTable.name, name));
        return this;
      },
      attribute: (attribute: string) => {
        this.selectors.push(eq(spansTable.attributes, attribute));
        return this;
      },
    };
  }

  get have() {
    return {
      attribute: async (key: string, value: string) => {
        const rows = await this.db
          .select()
          .from(spansTable)
          .where(and(...this.selectors));

        const pass = rows.map((span) => {
          const attributes = span.attributes as Record<string, string>;
          if (attributes[key] !== value) {
            return false;
          }
        });

        if (pass.includes(false)) {
          return false;
        }

        return true;
      },
    };
  }
}
