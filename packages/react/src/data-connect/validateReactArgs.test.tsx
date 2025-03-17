import { describe, expect, test } from "vitest";
import { validateReactArgs } from "./validateReactArgs";
import { connectorConfig } from "@/dataconnect/default-connector";
import { getDataConnect } from "firebase/data-connect";
import { firebaseApp } from "~/testing-utils";

// initialize firebase app
firebaseApp;

describe("validateReactArgs", () => {
	const dataConnect = getDataConnect(connectorConfig);

	const emptyObjectVars = {};
	const strictlyRequiredArgs = { limit: 5 };
	const strictlyOptionalVars = { title: "a" };
	const allArgs = { limit: 5, title: "a" };

	const options = { meta: { hasOptions: true } };

	test.each([
		{
			argsDescription: "no args are provided",
			dcOrOptions: undefined,
			options: undefined,
			expectedInputVars: undefined,
			expectedInputOpts: undefined,
		},
		{
			argsDescription: "only dataconnect is provided",
			dcOrOptions: dataConnect,
			options: undefined,
			expectedInputVars: undefined,
			expectedInputOpts: undefined,
		},
		{
			argsDescription: "only options are provided",
			dcOrOptions: options,
			options: undefined,
			expectedInputVars: undefined,
			expectedInputOpts: options,
		},
		{
			argsDescription: "dataconnect and options are provided",
			dcOrOptions: dataConnect,
			options: options,
			expectedInputVars: undefined,
			expectedInputOpts: options,
		},
	])(
		"parses args correctly when $argsDescription for an operation with no variables",
		({ dcOrOptions, options, expectedInputVars, expectedInputOpts }) => {
			const {
				dc: dcInstance,
				vars: inputVars,
				options: inputOpts,
			} = validateReactArgs(
				connectorConfig,
				dcOrOptions,
				options
				// hasVars = undefined (false-y)
				// validateArgs = undefined (false-y)
			);

			expect(dcInstance).toBe(dataConnect);

			if (expectedInputVars) {
				expect(inputVars).toBe(expectedInputVars);
			} else {
				expect(inputVars).toBeUndefined();
			}

			if (expectedInputOpts) {
				expect(inputOpts).toBe(expectedInputOpts);
			} else {
				expect(inputOpts).toBeUndefined();
			}
		}
	);

	test.each([
		{
			argsDescription: "no args are provided",
			dcOrVarsOrOptions: undefined,
			varsOrOptions: undefined,
			options: undefined,
			expectedInputVars: undefined,
			expectedInputOpts: undefined,
		},
		{
			argsDescription: "only dataconnect is provided",
			dcOrVarsOrOptions: dataConnect,
			varsOrOptions: undefined,
			options: undefined,
			expectedInputVars: undefined,
			expectedInputOpts: undefined,
		},
		{
			argsDescription: "only an empty vars object is provided",
			dcOrVarsOrOptions: emptyObjectVars,
			varsOrOptions: undefined,
			options: undefined,
			expectedInputVars: emptyObjectVars,
			expectedInputOpts: undefined,
		},
		{
			argsDescription: "only vars are provided",
			dcOrVarsOrOptions: strictlyOptionalVars,
			varsOrOptions: undefined,
			options: undefined,
			expectedInputVars: strictlyOptionalVars,
			expectedInputOpts: undefined,
		},
		{
			argsDescription: "only options are provided",
			dcOrVarsOrOptions: undefined,
			varsOrOptions: options,
			options: undefined,
			expectedInputVars: undefined,
			expectedInputOpts: options,
		},
		{
			argsDescription: "dataconnect and vars are provided",
			dcOrVarsOrOptions: dataConnect,
			varsOrOptions: strictlyOptionalVars,
			options: undefined,
			expectedInputVars: strictlyOptionalVars,
			expectedInputOpts: undefined,
		},
		{
			argsDescription: "dataconnect and options are provided",
			dcOrVarsOrOptions: dataConnect,
			varsOrOptions: undefined,
			options: options,
			expectedInputVars: undefined,
			expectedInputOpts: options,
		},
		{
			argsDescription: "dataconnect and vars and options are provided",
			dcOrVarsOrOptions: dataConnect,
			varsOrOptions: strictlyOptionalVars,
			options: options,
			expectedInputVars: strictlyOptionalVars,
			expectedInputOpts: options,
		},
	])(
		"parses args correctly when $argsDescription for an operation with all optional variables",
		({
			dcOrVarsOrOptions,
			varsOrOptions,
			options,
			expectedInputVars,
			expectedInputOpts,
		}) => {
			const {
				dc: dcInstance,
				vars: inputVars,
				options: inputOpts,
			} = validateReactArgs(
				connectorConfig,
				dcOrVarsOrOptions,
				varsOrOptions,
				options,
				true, // hasVars = true
				false // validateArgs = false
			);

			expect(dcInstance).toBe(dataConnect);

			if (expectedInputVars) {
				expect(inputVars).toBe(expectedInputVars);
			} else {
				expect(inputVars).toBeUndefined();
			}

			if (expectedInputOpts) {
				expect(inputOpts).toBe(expectedInputOpts);
			} else {
				expect(inputOpts).toBeUndefined();
			}
		}
	);

	test.each([
		{
			argsDescription: "only vars are provided",
			dcOrVarsOrOptions: strictlyRequiredArgs,
			varsOrOptions: undefined,
			options: undefined,
			expectedInputVars: strictlyRequiredArgs,
			expectedInputOpts: undefined,
		},
		{
			argsDescription: "dataconnect and vars are provided",
			dcOrVarsOrOptions: dataConnect,
			varsOrOptions: strictlyRequiredArgs,
			options: undefined,
			expectedInputVars: strictlyRequiredArgs,
			expectedInputOpts: undefined,
		},
		{
			argsDescription: "vars and options are provided",
			dcOrVarsOrOptions: strictlyRequiredArgs,
			varsOrOptions: options,
			options: undefined,
			expectedInputVars: strictlyRequiredArgs,
			expectedInputOpts: options,
		},
		{
			argsDescription: "dataconnect and vars and options are provided",
			dcOrVarsOrOptions: dataConnect,
			varsOrOptions: strictlyRequiredArgs,
			options: options,
			expectedInputVars: strictlyRequiredArgs,
			expectedInputOpts: options,
		},
	])(
		"parses args correctly when $argsDescription for an operation with any required variables",
		({
			dcOrVarsOrOptions,
			varsOrOptions,
			options,
			expectedInputVars,
			expectedInputOpts,
		}) => {
			const {
				dc: dcInstance,
				vars: inputVars,
				options: inputOpts,
			} = validateReactArgs(
				connectorConfig,
				dcOrVarsOrOptions,
				varsOrOptions,
				options,
				true, // hasVars = true
				true // validateArgs = true
			);

			expect(dcInstance).toBe(dataConnect);

			if (expectedInputVars) {
				expect(inputVars).toBe(expectedInputVars);
			} else {
				expect(inputVars).toBeUndefined();
			}

			if (expectedInputOpts) {
				expect(inputOpts).toBe(expectedInputOpts);
			} else {
				expect(inputOpts).toBeUndefined();
			}
		}
	);

	test.each([
		{
			argsDescription: "only dataconnect is provided",
			dcOrVarsOrOptions: dataConnect,
			varsOrOptions: undefined,
			options: undefined,
		},
		{
			argsDescription: "only options are provided",
			dcOrVarsOrOptions: undefined,
			varsOrOptions: options,
			options: undefined,
		},
		{
			argsDescription: "only dataconnect and options are provided",
			dcOrVarsOrOptions: dataConnect,
			varsOrOptions: undefined,
			options: options,
		},
	])(
		"throws error when $argsDescription for an operation with any required variables",
		({ dcOrVarsOrOptions, varsOrOptions, options }) => {
			expect(() => {
				validateReactArgs(
					connectorConfig,
					dcOrVarsOrOptions,
					varsOrOptions,
					options,
					true, // hasVars = true
					true // validateArgs = true
				);
			}).toThrowError("invalid-argument: Variables required.");
		}
	);
});
