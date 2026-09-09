'use client';

import {createContext, useContext} from 'react';

type Config = {
    searchApiBaseUrl: string;
    defaultSearchLimit: number;
    maxSearchLimit: number;
};

const ConfigProviderContext = createContext<Config | null>(null);

// noinspection JSUnusedGlobalSymbols
export default function ClientConfigContext({children,}: { children: React.ReactNode }) {

    // const [config, setConfig] = useState<AppConfig | null>(null);

    // useEffect(() => {
    //     fetch('/config.json', {cache: 'no-store'})
    //         .then((response) => {
    //             if (!response.ok) throw new Error('Unable to load configuration');
    //             return response.json();
    //         })
    //         .then(setConfig);
    // }, []);
    //
    // if (!config) return <p>Loading application…</p>;

    const config: Config = {
        searchApiBaseUrl: "",
        defaultSearchLimit: 2,
        maxSearchLimit: 20,
    }

    return (
        <ConfigProviderContext.Provider value={config}>
            {children}
        </ConfigProviderContext.Provider>
    );
}

export function useConfig() {
    const config = useContext(ConfigProviderContext);

    if (!config) {
        throw new Error('useAppConfig must be used within AppConfigProvider');
    }

    return config;
}