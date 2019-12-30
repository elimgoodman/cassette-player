import _ from "lodash";
import { GameObject } from "./cassette-def";
import { Variables } from "./game-state";
import { PrefabManager } from "./prefab-manager";

interface FromPrefabArgs {
    prefabId: string;
    id: string;
    variables?: Variables;
}

export class SceneBuilder {
    private prefabManager: PrefabManager;
    private static instance: SceneBuilder;
    private constructor() {
        this.prefabManager = PrefabManager.getInstance();
    }

    public static getInstance(): SceneBuilder {
        if (!SceneBuilder.instance) {
            SceneBuilder.instance = new SceneBuilder();
        }

        return SceneBuilder.instance;
    }

    public fromPrefab(args: FromPrefabArgs): GameObject {
        const { prefabId, id, variables } = args;
        const prefab = this.prefabManager.getById(prefabId)!;
        const obj = _.cloneDeep(prefab);
        obj.id = id;

        // FIXME: yuckkkkkkkk
        // FIXME: this is totally fucked - fix this for real
        if (obj.variables && variables) {
            console.log(variables);
            _.forEach(variables, (value, key) => {
                for (const variable of obj.variables!) {
                    if (variable.name === key) {
                        variable.value = value;
                    }
                }
            });
        }

        console.log(obj);
        return obj;
    }
}
