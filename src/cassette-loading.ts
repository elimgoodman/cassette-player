import _ from "lodash";

import {
    CassetteDef,
    EventHandler as EventHandlerDef,
    GameObject,
    Scene,
    Variable,
} from "./cassette-def";
import {
    CommonVariable,
    DynamicObjectInst,
    EventHandlers,
    Variables,
} from "./game-state";

const uuidv4 = require("uuid/v4");

const ROOT_ID = "root";

export function cassetteDefToDynObj(
    cassetteDef: CassetteDef
): DynamicObjectInst {
    return {
        id: ROOT_ID,
        uuid: uuidv4(),
        variables: transformVariables(cassetteDef.variables),
        eventHandlers: transformEventHandlers(cassetteDef.events),
    };
}

export function sceneDefToDynObjs(
    sceneDef: Scene
): { sceneDynObj: DynamicObjectInst; sceneObjs: DynamicObjectInst[] } {
    return {
        sceneDynObj: sceneDefToDynObj(sceneDef),
        sceneObjs: sceneObjsToDynObjs(sceneDef.gameObjects),
    };
}

// FIXME: dedupe w cassetteDef one - they're identical
function sceneDefToDynObj(sceneDef: Scene): DynamicObjectInst {
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
        [CommonVariable.SCALE]: 1,
    };
}

function sceneObjsToDynObjs(gameObjects: GameObject[]): DynamicObjectInst[] {
    return gameObjects.map(gameObject => {
        const variables = _.merge(
            {},
            getCommonSceneObjVariables(gameObject),
            transformVariables(gameObject.variables)
        );

        return {
            id: gameObject.id,
            uuid: uuidv4(),
            variables,
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
