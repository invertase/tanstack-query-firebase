import {
	ConnectorConfig,
	DataConnect,
	getDataConnect,
} from "firebase/data-connect";

interface ParsedReactArgs<Variables, Options> {
	dc: DataConnect;
	vars: Variables;
	options: Options;
}

/**
 * The generated React SDK will allow the user to pass in variables, a Data Connect instance, or operation options.
 * The only required argument is the variables, which are only required when the operation has at least one required
 * variable. Otherwise, all arguments are optional. This function validates the variables and returns back the DataConnect
 * instance, variables, and options based on the arguments passed in.
 * @param connectorConfig DataConnect connector config
 * @param dcOrVarsOrOptions the first argument provided to a generated react function
 * @param varsOrOptions the second argument provided to a generated react function
 * @param options the third argument provided to a generated react function
 * @param hasVars boolean parameter indicating whether the operation has variables
 * @param validateVars boolean parameter indicating whether we should expect to find a value for realVars
 * @returns parsed DataConnect, Variables, and Options for the operation
 * @internal
 */
export function validateReactArgs<
	Variables extends object,
	Options extends object
>(
	connectorConfig: ConnectorConfig,
	dcOrVarsOrOptions?: DataConnect | Variables | Options,
	varsOrOptions?: Variables | Options,
	options?: Options,
	hasVars?: boolean,
	validateVars?: boolean
): ParsedReactArgs<Variables, Options> {
	let dcInstance: DataConnect;
	let realVars: Variables;
	let realOptions: Options;

	if (dcOrVarsOrOptions && "enableEmulator" in dcOrVarsOrOptions) {
		dcInstance = dcOrVarsOrOptions as DataConnect;
		if (hasVars) {
			realVars = varsOrOptions as Variables;
			realOptions = options as Options;
		} else {
			realVars = undefined as unknown as Variables;
			realOptions = varsOrOptions as Options;
		}
	} else {
		dcInstance = getDataConnect(connectorConfig);
		if (hasVars) {
			realVars = dcOrVarsOrOptions as Variables;
			realOptions = varsOrOptions as Options;
		} else {
			realVars = undefined as unknown as Variables;
			realOptions = dcOrVarsOrOptions as Options;
        }
	}

	if (!dcInstance || (!realVars && validateVars)) {
		throw new Error("invalid-argument: Variables required."); // copied from firebase error codes
	}
	return { dc: dcInstance, vars: realVars, options: realOptions };
}
