import _ from "lodash";
import { DynoInst, GameState } from "./game-state";

export class DynoFinder {
    private state: GameState;
    private static instance: DynoFinder;
    private constructor() {
        this.state = GameState.getInstance();
    }

    public static getInstance(): DynoFinder {
        if (!DynoFinder.instance) {
            DynoFinder.instance = new DynoFinder();
        }

        return DynoFinder.instance;
    }

    public getById(id: string): DynoInst | undefined {
        // FIXME: also this is almost definitely terrible perf-wise!
        return _.find(this.state.allSceneObjects(), obj => obj.id === id);
    }

    public filter(pred: (obj: DynoInst) => boolean): DynoInst[] {
        return this.state.allSceneObjects().filter(pred);
    }
}
