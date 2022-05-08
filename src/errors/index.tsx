import React from "react";
import Bugsnag from "@bugsnag/expo";
import ErrorView from "../components/errorView";
import * as _ from 'lodash';
import Config from '../utils/config';

Bugsnag.start({
    apiKey: '4d553792245f9514a05ecc85af2ce7bd',
    onError: function () {
        // production should always report the error
        let skipReport = Config.env === 'prod' ? false : true;

        // return false will not sent error to bugsnag
        return !skipReport;
    }
});

const ErrorBoundary = Bugsnag.getPlugin("react");

const CustomErrorBoundary = (props: any) => {
    return (
        <ErrorBoundary FallbackComponent={ErrorView}>
            {props.children}
        </ErrorBoundary>
    )
}

export default CustomErrorBoundary;