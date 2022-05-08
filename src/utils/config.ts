import Constants from "expo-constants";
type MethodConfig = {
    physicalCard: boolean
}

type Config = {
    env: string,
    publicUrl: string,
    phpUrl: string,
    nodeUrl: string,
    method: MethodConfig
}

const devConfig: Config = {
    env: "dev",
    publicUrl: 'https://staging.calldoctor.hk/',
    phpUrl: "https://staging.calldoctor.hk/ClinicAppBackend/",
    nodeUrl: "https://staging.calldoctor.hk:5001/app/",
    method: {
        physicalCard: true,
    }
    /*
    env: "dev",
    publicUrl: 'http://localhost', //www?
    //phpUrl: "http://localhost/ClinicAppBackend/", //clinic-app-backend
    phpUrl: "http://localhost/ClinicAppBackend/", //clinic-app-backend
    nodeUrl: "http://localhost:5001/app/", //backend-mcc-for-clinic-frontend? check if it uses 5001
    method: {
        physicalCard: true,
    }
    */
}

const stagingConfig: Config = {
    env: "staging",
    publicUrl: 'https://staging.calldoctor.hk/',
    phpUrl: "https://staging.calldoctor.hk/ClinicAppBackend/",
    nodeUrl: "https://staging.calldoctor.hk:5001/app/",
    method: {
        physicalCard: true,
    }
}

const testingConfig: Config = {
    env: "testing",
    publicUrl: 'https://testing.prod.mediconcen.com/',
    phpUrl: "https://testing.prod.mediconcen.com/ClinicAppBackend/",
    nodeUrl: "https://testing.prod.mediconcen.com:5001/app/",
    method: {
        physicalCard: true,
    }
}

const prodConfig: Config = {
    env: "prod",
    publicUrl: 'https://web2.prod.mediconcen.com/',
    phpUrl: "https://web2.prod.mediconcen.com/ClinicAppBackend/",
    nodeUrl: "https://web2.prod.mediconcen.com:5001/app/",
    method: {
        physicalCard: true,
    }
}

let config: Config = prodConfig;

switch (Constants.manifest.releaseChannel) {
    case 'prod':
        config = prodConfig;
        break;
    case 'testing':
        config = testingConfig;
        break;
    case 'staging':
        config = stagingConfig;
        break;
    default:
        config = devConfig;
}

export default config;
