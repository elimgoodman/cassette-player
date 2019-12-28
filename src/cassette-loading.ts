import _ from "lodash";
import {
    BadgeDef,
    CassetteDef,
    EventHandler as EventHandlerDef,
    GameObject,
    Helper,
    SceneDef,
    Variable,
} from "./cassette-def";
import {
    Badges,
    CommonVariable,
    DynoInst,
    EventHandlers,
    Helpers,
    Variables,
} from "./game-state";

const uuidv4 = require("uuid/v4");

const ROOT_ID = "root";

export function cassetteDefToDynObj(cassetteDef: CassetteDef): DynoInst {
    return {
        id: ROOT_ID,
        uuid: uuidv4(),
        variables: transformVariables(
            cassetteDef.variables,
            cassetteDef.badges
        ),
        eventHandlers: transformEventHandlers(cassetteDef.events),
        helpers: transformHelpers(cassetteDef.helpers),
        badges: transformBadges(cassetteDef.badges),
    };
}

export function sceneDefToDynObjs(
    sceneDef: SceneDef
): { sceneDynObj: DynoInst; sceneObjs: DynoInst[] } {
    return {
        sceneDynObj: sceneDefToDynObj(sceneDef),
        sceneObjs: sceneObjsToDynObjs(sceneDef.gameObjects),
    };
}

// FIXME: dedupe w cassetteDef one - they're identical
function sceneDefToDynObj(sceneDef: SceneDef): DynoInst {
    return {
        id: sceneDef.id,
        uuid: uuidv4(),
        variables: transformVariables(sceneDef.variables, sceneDef.badges),
        eventHandlers: transformEventHandlers(sceneDef.events),
        helpers: transformHelpers(sceneDef.helpers),
        badges: transformBadges(sceneDef.badges),
    };
}

function getCommonSceneObjVariables(sceneObj: GameObject): Variables {
    return {
        [CommonVariable.X]: 0,
        [CommonVariable.Y]: 0,
        [CommonVariable.SCALE]: 1,
    };
}

function sceneObjsToDynObjs(gameObjects: GameObject[]): DynoInst[] {
    return gameObjects.map(gameObject => {
        const variables = _.merge(
            {},
            getCommonSceneObjVariables(gameObject),
            transformVariables(gameObject.variables, gameObject.badges)
        );

        return {
            id: gameObject.id,
            uuid: uuidv4(),
            variables,
            eventHandlers: transformEventHandlers(gameObject.events),
            face: gameObject.face, // should I clone / transform this at all?
            helpers: transformHelpers(gameObject.helpers),
            badges: transformBadges(gameObject.badges),
        };
    });
}

function transformVariables(
    variables?: Variable[],
    badges?: BadgeDef[]
): Variables {
    const transformed: Variables = {};
    const setVariable = (variable: Variable) => {
        transformed[variable.name] = variable.value;
    };

    badges?.forEach(badge => {
        badge.variables?.forEach(setVariable);
    });

    variables?.forEach(setVariable);

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

function transformBadges(badges?: BadgeDef[]): Badges {
    const transformed: Badges = {};

    if (badges) {
        badges.forEach(badge => {
            transformed[badge.id] = {
                eventHandlers: transformEventHandlers(badge.events),
                variables: transformVariables(badge.variables),
            };
        });
    }

    return transformed;
}
