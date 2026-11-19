/*
Detects the layout of the generated iOS project.

cordova-ios 8+ always names the Xcode project App.xcodeproj (target "App"), regardless of the
<name> in config.xml, and ships its own entitlements files: App/Entitlements-Debug.plist and
App/Entitlements-Release.plist, already wired up through
CODE_SIGN_ENTITLEMENTS = "$(TARGET_NAME)/Entitlements-$(CONFIGURATION).plist".

Older cordova-ios versions name the project after config.xml's <name> and have no entitlements file,
so this plugin creates <name>/Resources/<name>.entitlements and points CODE_SIGN_ENTITLEMENTS at it.
*/

var path = require('path');
var fs = require('fs');

var FIXED_PROJECT_NAME = 'App';
var ENTITLEMENTS_FILES = ['Entitlements-Debug.plist', 'Entitlements-Release.plist'];

module.exports = {
  usesFixedAppProject: usesFixedAppProject,
  fixedProjectEntitlementsFiles: fixedProjectEntitlementsFiles
};

/**
 * Whether the iOS platform uses the cordova-ios 8+ layout (App.xcodeproj).
 *
 * @param {String} projectRoot - absolute path to the cordova project root
 * @return {Boolean}
 */
function usesFixedAppProject(projectRoot) {
  return fs.existsSync(path.join(iosPlatformPath(projectRoot), FIXED_PROJECT_NAME + '.xcodeproj'));
}

/**
 * Absolute paths to the entitlements files of the cordova-ios 8+ project.
 *
 * @param {String} projectRoot - absolute path to the cordova project root
 * @return {String[]}
 */
function fixedProjectEntitlementsFiles(projectRoot) {
  return ENTITLEMENTS_FILES.map(function(fileName) {
    return path.join(iosPlatformPath(projectRoot), FIXED_PROJECT_NAME, fileName);
  });
}

function iosPlatformPath(projectRoot) {
  return path.join(projectRoot, 'platforms', 'ios');
}
