import _ from "lodash";

import {
    CassetteDef,
    EventHandler as EventHandlerDef,
    GameObject,
    Scene,
    Variable,
    Helper,
} from "./cassette-def";
import {
    CommonVariable,
    DynamicObjectInst,
    EventHandlers,
    Variables,
    Helpers,
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
        helpers: transformHelpers(cassetteDef.helpers),
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
        helpers: transformHelpers(sceneDef.helpers),
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
            helpers: transformHelpers(gameObject.helpers),
        };
    });
}

function transformVariables(variables?: Variable[]): Variables {
    const transformed: Variables = {};

    if (variables) {
        variables.forEach(variable => {
            transformed[variable.name] = variable.value;
        });
    }

    return transformed;
}

function transformEventHandlers(events?: EventHandlerDef[]): EventHandlers {
    const transformed: Variables = {};

    if (events) {
        events.forEach(event => {
            transformed[event.event] = event.handler;
        });
    }

    return transformed;
}

function transformHelpers(helpers?: Helper[]): Helpers {
    const transformed: Helpers = {};

    if (helpers) {
        helpers.forEach(helper => {
            transformed[helper.id] = helper.handler;
        });
    }

    return transformed;
}
