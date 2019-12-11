import { MethodContext } from "./cassette-def";
import { DynamicObjectInst, GameState } from "./game-state";

const unimplemented = () => {};

export class MethodContextMaker {
    private state: GameState;

    constructor(state: GameState) {
        this.state = state;
    }

    public make(dynObj: DynamicObjectInst): MethodContext {
        return {
            actions: {
                fireEvent: unimplemented,
                getVariable: unimplemented,
                goToScene: unimplemented,
                setVariable: unimplemented,
                updateVariable: unimplemented,
            },
            assets: {
                getById: unimplemented,
            },
            currentScene: this.state.getCurrentScene()!,
            helpers: {},
            self: dynObj,
            shapes: {
                square: unimplemented,
            },
        };
    }
}
