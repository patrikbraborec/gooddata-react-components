// (C) 2007-2020 GoodData Corporation
import { IFeatureFlags, SDK } from "@gooddata/gooddata-js";
import { getCachedOrLoad } from "./sdkCache";
import { IChartConfig } from "../interfaces/Config";
import isNil = require("lodash/isNil");
import merge = require("lodash/merge");
import { IColumnSizing, IPivotTableConfig } from "../interfaces/PivotTable";
import { DASHBOARDS_ENVIRONMENT } from "../internal/constants/properties";
import { VisualizationEnvironment } from "../components/uri/Visualization";

export async function getFeatureFlags(sdk: SDK, projectId: string): Promise<IFeatureFlags> {
    const apiCallIdentifier = `getFeatureFlags.${projectId}`;
    const loader = () => sdk.project.getFeatureFlags(projectId);
    try {
        return getCachedOrLoad(apiCallIdentifier, loader);
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.error(`unable to retrieve featureFlags for project ${projectId}`, error);
        throw Error(error);
    }
}

export function setConfigFromFeatureFlags(config: IChartConfig, featureFlags: IFeatureFlags): IChartConfig {
    if (!featureFlags) {
        return config;
    }

    let result = config;
    if (
        featureFlags.disableKpiDashboardHeadlineUnderline === true &&
        (!config || isNil(config.disableDrillUnderline))
    ) {
        result = { ...result, disableDrillUnderline: true };
    }
    return result;
}

// TODO: ONE-4407 refactor - here should be only feature flag logic
export function getTableConfigFromFeatureFlags(
    config: IPivotTableConfig,
    featureFlags: IFeatureFlags,
    environment?: VisualizationEnvironment,
): IPivotTableConfig {
    let result: IPivotTableConfig = config;
    const columnSizing: IColumnSizing = { defaultWidth: "viewport" };

    if (featureFlags.enableTableColumnsAutoResizing) {
        result = merge(result, { columnSizing });
    }

    if (featureFlags.enableTableColumnsGrowToFit && environment === DASHBOARDS_ENVIRONMENT) {
        result = merge(result, { growToFit: true });
    }

    return result;
}
