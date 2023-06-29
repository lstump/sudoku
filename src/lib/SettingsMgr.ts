var settings: { [name: string]: unknown } = {};

const VERSION_SETTINGS_NAME = "VERSION";
// Change CURRENT_VERSION_VALUE when the format of any of the settings becomes backwards incompatible
const CURRENT_VERSION_VALUE = "1.13";
const DEFAULT_SETTINGS_NAME = "stump";

const getSettingsName = () => {
	// when running on a server, use the pathname for the settings 
	// otherwise each different app on the platform maps to the same settings
	// in other situations we can use the DEFAULT_SETTINGS_NAME
	var ret = window.location.pathname;
	const path = ret.split("/");
	if (path.length > 1 && path[1] !== "apps") {
		ret = DEFAULT_SETTINGS_NAME;
	}
	//console.log("window.location.pathname: " + window.location.pathname);
	//console.log("path: " + JSON.stringify(path));
	//console.log("SETTINGS_NAME: " + ret);
	return ret;
}

const SETTINGS_NAME = getSettingsName();

const init = () => {
	settings = {};
	const data = localStorage.getItem(SETTINGS_NAME);
	if (data) {
		settings = JSON.parse(data);
	}
	if (undefined === settings[VERSION_SETTINGS_NAME] || CURRENT_VERSION_VALUE !== settings[VERSION_SETTINGS_NAME]) {
		settings = {};
		settings[VERSION_SETTINGS_NAME] = CURRENT_VERSION_VALUE;
	}
}

init();

export const getSettings = <T>(settingsName: string, defaultValue: T) => {
	if (undefined === settings[settingsName]) {
		settings[settingsName] = defaultValue;
	}
	return settings[settingsName] as T;
}

export const setSettings = <T>(settingsName: string, settingsObject: T): void => {
	settings[settingsName] = JSON.parse(JSON.stringify(settingsObject));
	localStorage.setItem(SETTINGS_NAME, JSON.stringify(settings));
}
