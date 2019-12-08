import {
    CassetteDef,
    Scene,
    GameObject,
    Variable,
    EventHandler as EventHandlerDef,
} from "./cassette-def";
import _ from "lodash";
import {
    DynamicObject,
    Variables,
    EventHandlers,
    CommonVariable,
} from "./game-state";

const uuidv4 = require("uuid/v4");

const ROOT_ID = "root";

export function cassetteDefToDynObj(cassetteDef: CassetteDef): DynamicObject {
    return {
        id: ROOT_ID,
        uuid: uuidv4(),
        variables: transformVariables(cassetteDef.variables),
        eventHandlers: transformEventHandlers(cassetteDef.events),
    };
}

export function sceneDefToDynObjs(
    sceneDef: Scene
): { sceneDynObj: DynamicObject; sceneObjs: DynamicObject[] } {
    return {
        sceneDynObj: sceneDefToDynObj(sceneDef),
        sceneObjs: sceneObjsToDynObjs(sceneDef.gameObjects),
    };
}

// FIXME: dedupe w cassetteDef one - they're identical
function sceneDefToDynObj(sceneDef: Scene): DynamicObject {
    return {
        id: sceneDef.id,
        uuid: uuidv4(),
        variables: transformVariables(sceneDef.variables),
        eventHandlers: transformEventHandlers(sceneDef.events),
    };
}

function getCommonSceneObjVariables(sceneObj: GameObject): Variables {
    return {
        [CommonVariable.X]: 0,
        [CommonVariable.Y]: 0,
    };
}

function sceneObjsToDynObjs(gameObjects: GameObject[]): DynamicObject[] {
    return gameObjects.map(gameObject => {
        return {
            id: gameObject.id,
            uuid: uuidv4(),
            variables: _.merge(
                {},
                transformVariables(gameObject.variables),
                getCommonSceneObjVariables(gameObject)
            ),
            eventHandlers: transformEventHandlers(gameObject.events),
            face: gameObject.face, // should I clone / transform this at all?
        };
    });
}

function transformVariables(variables: Variable[] | undefined): Variables {
    const transformed: Variables = {};

    if (variables) {
        variables.forEach(variable => {
            transformed[variable.name] = variable.value;
        });
    }

    return transformed;
}

function transformEventHandlers(
    events: EventHandlerDef[] | undefined
): EventHandlers {
    const transformed: Variables = {};

    if (events) {
        events.forEach(event => {
            transformed[event.event] = event.handler;
        });
    }

    return transformed;
}
