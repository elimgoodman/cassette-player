import _ from "lodash";
import { CassetteDef } from "./cassette-def";

export class CassetteLibrary {
    private static instance: CassetteLibrary;

    private cassettes: CassetteDef[];
    private currentCassette: CassetteDef;

    static init(cassettes: CassetteDef[]) {
        this.instance = new CassetteLibrary(cassettes);
    }

    static getInstance(): CassetteLibrary {
        if (!CassetteLibrary.instance) {
            throw "Not inited";
        }

        return CassetteLibrary.instance;
    }

    private constructor(cassettes: CassetteDef[]) {
        this.cassettes = cassettes;
        this.currentCassette = _.first(cassettes)!;
    }

    public getCurrentCassette(): CassetteDef {
        return this.currentCassette;
    }
}
