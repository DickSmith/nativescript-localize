import * as fs from "fs";
import * as path from "path";

import { BeforePrepareCommon } from "./before-prepare.common";
import { BeforePrepareAndroid } from "./before-prepare.android";
import { BeforePrepareIOS } from "./before-prepare.ios";

export = function(logger: ILogger, platformsData: IPlatformsData, projectData: IProjectData, hookArgs: any) {
  const platformName = hookArgs.platform.toLowerCase();
  const platformData = platformsData.getPlatformData(platformName);

  let beforePreparePlatform: BeforePrepareCommon;

  if (platformName === "android") {
    beforePreparePlatform = new BeforePrepareAndroid(logger, platformData, projectData);
  } else if (platformName === "ios") {
    beforePreparePlatform = new BeforePrepareIOS(logger, platformData, projectData);
  } else {
    logger.warn(`Platform '${platformName}' isn't supported: skipping localization`);
    return;
  }

  beforePreparePlatform
    .on(BeforePrepareCommon.RESOURCE_CHANGED_EVENT, () => hookArgs.changesInfo.appResourcesChanged = true)
    .on(BeforePrepareCommon.CONFIGURATION_CHANGED_EVENT, () => hookArgs.changesInfo.configChanged = true)
    .run();
}
